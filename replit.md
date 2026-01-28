# ZOOM Chat Live Streaming Platform

## Overview
ZOOM Chat is a TikTok-style live streaming platform offering live video broadcasting, real-time viewer interaction, and virtual gifting. It includes user authentication, stream discovery, and a virtual currency system. The platform aims to capture the live streaming market with a mobile-first, responsive, and engaging user experience.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Core Design Principles
The platform utilizes a modern full-stack architecture with clear separation of concerns, leveraging real-time technologies for interactive experiences and robust data management for scalability.

### Frontend
- **Framework**: React 18 with TypeScript.
- **Routing**: Wouter.
- **State Management**: TanStack React Query for server-side state; React hooks for local component state.
- **Styling**: Tailwind CSS and CSS variables for responsive design and dynamic theming.
- **UI Components**: `shadcn/ui` (built on Radix UI).
- **Build Tool**: Vite.

### Backend
- **Runtime**: Node.js with Express.
- **Language**: TypeScript with ESM modules.
- **Real-time Communication**: WebSocket server (`ws` library) for live chat.
- **Authentication & Session Management**: Replit Auth via OpenID Connect; Express sessions with PostgreSQL store.
- **Persistent Sessions**: Sessions are stored in localStorage and persist across application closures with no expiry until explicit logout.

### Data Layer
- **Database**: PostgreSQL.
- **ORM**: Drizzle ORM with `drizzle-zod`.
- **Key Data Models**: Users, Sessions, Rooms, Messages, Gifts, UserCoins, Follows, and various cosmetic and administrative entities.

### Feature Specifications
- **Cosmetics System**: Purchasable profile frames and entrance animations with multi-format assets and audio effects, managed via an admin panel.
- **Agents & Fraud Detection**: Commission-based reseller system for coin top-ups, with configurable fraud detection and audit logging.
- **ID Marketplace**: Allows users to purchase unique numeric public IDs with rarity tiers.
- **Unified Store System**: Centralized store for cosmetics and premium items, including user inventory tracking.
- **TopTop-Style Rooms**: Rooms with levels, badges (Official, Event, PK), and country labels. Navigation via "My Room," "Explore," and "Country" tabs.
- **Live Streaming**: ZEGO integration for voice/audio streaming in voice rooms with a 16-seat mic grid, dynamic rendering, and automated audio management.
- **Roles & Badges System**: Comprehensive user roles (user, room_moderator, room_admin, global_moderator, admin) with visual identity, permission management, and moderation logging.
- **Paid Mic / VIP Mic System**: Monetization for stream room seats (free, paid, VIP) with entry fees, per-minute fees, host revenue split, and real-time seat assignment.
- **VIP Room Access Control**: Six access modes (`public`, `vip`, `level`, `paid`, `invite`, `code`) with payment UI, access badges, and host earnings.
- **Open Mic Mode**: Allows instant access to FREE seats without host approval, with host toggling and bulk mic operations.
- **Personal Room System**: Each user automatically receives a personal room with full owner privileges.
- **Room Options Menu**: A 2x4 grid bottom sheet menu for room management including sharing, locking, background/theme selection, settings, level upgrades, chat clearing, and reporting, with role-based visibility.
- **Role-Based Permissions System**: Centralized permission management with distinct roles and server-side authorization for all mic and room actions.
- **VIP Level System**: 30-level progression system with EXP from recharges, quarterly EXP deductions, and perks displayed on a dedicated VIP page. Includes `effectiveLevel` for perk checks and admin-editable `levelExp` and `quarterlyDeductionExp`.
- **VIP Abilities Gating**: Premium room actions are gated by specific VIP levels (e.g., Mute VIP10+, Lock Room VIP12+, Kick VIP16+).
- **Topup Agents Manual Payment System**: Allows users to request coin topups from designated agents, with payment proof validation, agent approval workflow, and transactional safety for coin granting. Includes specific API endpoints for users, agents, and admins.
- **Admin Panel**: A dedicated admin panel offers comprehensive management for users, rooms, reports, gifts, store items, finances, agents, and fraud alerts.
  - **Admin UX Features**: Includes bulk actions, saved views, advanced filtering, and reusable components for consistent management.
- **System Settings**: Admin-controlled, JSONB-based key-value store for global settings like VIP deduction rules, with caching and automatic invalidation.
- **Content Versioning System**: Tracks content changes for client-side cache invalidation, with auto-bumping of versions on admin mutations.
- **Admin Audit Logging System**: Tracks all admin mutations with before/after values, including sensitive data redaction, for compliance and debugging.
- **User Location Tracking System**: Tracks real-time user location for admin review and fraud detection, with client-side updates, server-side throttling, and admin-only access to historical data.
- **User Gallery System (Admin)**: Provides admin access to a user's photo history (profile, chat, camera), with permanent storage in Replit Object Storage and a live camera capture request feature.
- **Object Storage Integration**: Uses Replit Object Storage (Google Cloud Storage) for user uploads like profile images, with access via a dedicated route and ACL policy support.

## External Dependencies

### Authentication
- Phone-based authentication.
- `bcrypt` for password hashing.

### Database
- PostgreSQL (provisioned via Replit).

### Real-time Communication
- ZEGO for live video and audio streaming.

### Payment Integration
- **Fawaterk**: Primary payment gateway for coin top-ups, supporting sandbox mode for testing.

### Frontend Libraries
- `@tanstack/react-query`
- `@radix-ui/*`
- `lucide-react`
- `embla-carousel-react`
- `react-day-picker`
- `vaul`