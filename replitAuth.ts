import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";

import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import { authStorage } from "./storage";

const getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID!
    );
  },
  { maxAge: 3600 * 1000 }
);

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  const isProduction = process.env.NODE_ENV === "production";
  
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: sessionTtl,
      path: "/",
    },
  });
}

function updateUserSession(
  user: any,
  tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers
) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}

async function upsertUser(claims: any) {
  await authStorage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  const config = await getOidcConfig();

  const verify: VerifyFunction = async (
    tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
    verified: passport.AuthenticateCallback
  ) => {
    const user = {};
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    verified(null, user);
  };

  // Keep track of registered strategies
  const registeredStrategies = new Set<string>();

  // Helper function to ensure strategy exists for a domain
  const ensureStrategy = (domain: string) => {
    const strategyName = `replitauth:${domain}`;
    if (!registeredStrategies.has(strategyName)) {
      const strategy = new Strategy(
        {
          name: strategyName,
          config,
          scope: "openid email profile offline_access",
          callbackURL: `https://${domain}/api/callback`,
        },
        verify
      );
      passport.use(strategy);
      registeredStrategies.add(strategyName);
    }
  };

  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  app.get("/api/login", (req, res, next) => {
    ensureStrategy(req.hostname);
    passport.authenticate(`replitauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"],
    })(req, res, next);
  });

  app.get("/api/callback", (req, res, next) => {
    ensureStrategy(req.hostname);
    passport.authenticate(`replitauth:${req.hostname}`, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login",
    })(req, res, next);
  });

  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID!,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`,
        }).href
      );
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  console.log('[Auth] isAuthenticated check started');
  console.log('[Auth] Authorization header:', req.headers.authorization?.substring(0, 30) || 'none');
  console.log('[Auth] X-Demo-User header:', req.headers['x-demo-user'] ? 'present' : 'none');
  console.log('[Auth] Session ID:', req.sessionID || 'none');
  console.log('[Auth] Session demoUser:', (req.session as any)?.demoUser ? 'present' : 'none');
  
  // Check for demo auth token in Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer demo_')) {
    // Extract demo user info from X-Demo-User header
    const demoUserHeader = req.headers['x-demo-user'];
    if (demoUserHeader) {
      try {
        const demoUser = JSON.parse(demoUserHeader as string);
        console.log('[Auth] Using demo auth header, userId:', demoUser.id);
        (req as any).user = {
          claims: {
            sub: demoUser.id,
            email: demoUser.email,
            first_name: demoUser.username,
          }
        };
        return next();
      } catch (e) {
        console.log('[Auth] Failed to parse demo user header');
        // Invalid demo user header, fall through to normal auth
      }
    }
  }

  // Check for demo user session (fallback when localStorage fails on mobile PWA)
  const demoUserSession = (req.session as any)?.demoUser;
  if (demoUserSession) {
    console.log('[Auth] Using session demoUser, userId:', demoUserSession.id);
    (req as any).user = {
      id: demoUserSession.id,
      claims: {
        sub: demoUserSession.id,
        first_name: demoUserSession.firstName,
      }
    };
    return next();
  }

  const user = req.user as any;
  console.log('[Auth] Checking Replit auth, isAuthenticated:', req.isAuthenticated?.(), 'has expires_at:', !!user?.expires_at);

  if (!req.isAuthenticated() || !user?.expires_at) {
    console.log('[Auth] REJECTED - no valid authentication found');
    return res.status(401).json({ error: "AUTH_REQUIRED", message: "Unauthorized" });
  }

  const now = Math.floor(Date.now() / 1000);
  if (now <= user.expires_at) {
    return next();
  }

  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ error: "AUTH_REQUIRED", message: "Unauthorized" });
    return;
  }

  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    res.status(401).json({ error: "AUTH_REQUIRED", message: "Unauthorized" });
    return;
  }
};
