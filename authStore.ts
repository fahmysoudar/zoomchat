import { useState, useEffect, useCallback } from 'react';

const AUTH_TOKEN_KEY = 'toptop_demo_token';
const AUTH_USER_KEY = 'toptop_demo_user';

interface DemoUser {
  id: string;
  username: string;
  phoneNumber: string;
  phoneCountryCode: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string | null;
}

export function getToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setToken(token: string): void {
  console.log('[Auth] Setting token:', token.substring(0, 20) + '...');
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  // Verify it was saved
  const saved = localStorage.getItem(AUTH_TOKEN_KEY);
  console.log('[Auth] Token saved successfully:', !!saved);
}

export function clearToken(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

export function getDemoUser(): DemoUser | null {
  const user = localStorage.getItem(AUTH_USER_KEY);
  return user ? JSON.parse(user) : null;
}

export function setDemoUser(user: DemoUser): void {
  console.log('[Auth] Setting demo user:', user.id);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  // Verify it was saved
  const saved = localStorage.getItem(AUTH_USER_KEY);
  console.log('[Auth] Demo user saved successfully:', !!saved);
}

export function updateDemoUserField(field: keyof DemoUser, value: any): void {
  const user = getDemoUser();
  if (user) {
    (user as any)[field] = value;
    setDemoUser(user);
    console.log('[Auth] Updated demo user field:', field, '=', value);
  }
}

export function useDemoAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<DemoUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = getToken();
    const savedUser = getDemoUser();
    setIsAuthenticated(!!token);
    setUser(savedUser);
    setIsLoading(false);
  }, []);

  const updateUser = useCallback((updates: Partial<DemoUser>) => {
    const currentUser = getDemoUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      setDemoUser(updatedUser);
      setUser(updatedUser);
      console.log('[Auth] Updated user:', updates);
    }
  }, []);

  const login = useCallback(async (phoneNumber: string, phoneCountryCode: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/demo/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          phoneNumber,
          phoneCountryCode,
          password,
          isLogin: true,
        }),
      });

      if (!response.ok) {
        return false;
      }

      const userData = await response.json();
      const demoToken = `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const demoUser: DemoUser = {
        id: userData.id,
        username: userData.username || userData.firstName || 'user',
        phoneNumber: userData.phoneNumber,
        phoneCountryCode: userData.phoneCountryCode,
        firstName: userData.firstName,
        lastName: userData.lastName,
        profileImageUrl: userData.profileImageUrl,
      };

      setToken(demoToken);
      setDemoUser(demoUser);
      setIsAuthenticated(true);
      setUser(demoUser);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }, []);

  const signup = useCallback(async (
    username: string,
    phoneNumber: string,
    phoneCountryCode: string,
    password: string,
    gpsData?: { lat: number; lng: number; accuracy: number } | null
  ): Promise<boolean> => {
    try {
      const response = await fetch('/api/demo/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          phoneNumber,
          phoneCountryCode,
          username,
          password,
          isLogin: false,
          gpsData: gpsData || null,
        }),
      });

      if (!response.ok) {
        return false;
      }

      const userData = await response.json();
      const demoToken = `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const demoUser: DemoUser = {
        id: userData.id,
        username: userData.username || userData.firstName || username,
        phoneNumber: userData.phoneNumber,
        phoneCountryCode: userData.phoneCountryCode,
        firstName: userData.firstName,
        lastName: userData.lastName,
        profileImageUrl: userData.profileImageUrl,
      };

      setToken(demoToken);
      setDemoUser(demoUser);
      setIsAuthenticated(true);
      setUser(demoUser);
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  }, []);

  const loginWithEmail = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/demo/auth/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        return false;
      }

      const userData = await response.json();
      const demoToken = `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const demoUser: DemoUser = {
        id: userData.id,
        username: userData.username || userData.firstName || 'admin',
        phoneNumber: userData.phoneNumber || '',
        phoneCountryCode: userData.phoneCountryCode || '',
        firstName: userData.firstName,
        lastName: userData.lastName,
        profileImageUrl: userData.profileImageUrl,
      };

      setToken(demoToken);
      setDemoUser(demoUser);
      setIsAuthenticated(true);
      setUser(demoUser);
      return true;
    } catch (error) {
      console.error('Email login error:', error);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  return {
    isAuthenticated,
    user,
    isLoading,
    login,
    loginWithEmail,
    signup,
    logout,
    updateUser,
  };
}
