# TopTop Live Streaming Platform - Design Guidelines

## Design Approach
**Reference-Based Design** drawing from TikTok Live, Twitch, and Instagram Live for an engaging, immersive live streaming experience prioritizing visual impact and real-time interaction.

## Core Design Principles
1. **Immersion First**: Full-screen video takes center stage with minimal UI chrome
2. **Gestural & Intuitive**: Mobile-first interactions with smooth, finger-friendly controls
3. **Social Energy**: Vibrant, energetic aesthetic celebrating live moments and community

## Typography
- **Primary Font**: Inter (via Google Fonts)
- **Display Font**: Space Grotesk for bold headers
- **Hierarchy**: 
  - Stream titles: 24-28px, bold
  - User names: 14-16px, medium
  - Metadata (viewers, time): 12-14px, regular
  - Chat messages: 14px, regular

## Layout & Spacing
**Spacing System**: Tailwind units of 1, 2, 3, 4, 6, 8, 12, 16
- Tight spacing (1-2) for chat messages and live feeds
- Medium spacing (4-6) for card padding and button groups
- Generous spacing (12-16) for section separation on discovery pages

**Grid Strategy**:
- Live streams grid: 2-4 columns (responsive: 1 col mobile, 2 tablet, 3-4 desktop)
- Trending creators: Horizontal scroll with fixed-width cards
- Gift shop: 4-6 columns for gift items

## Component Library

### Navigation
- **Top Bar**: Sticky, semi-transparent with blur effect when over video
- **Bottom Navigation** (Mobile): 5 icons - Home, Discover, Go Live (center, elevated), Inbox, Profile

### Stream Display
- **Thumbnail Cards**: 9:16 aspect ratio, rounded corners (12px), auto-playing preview on hover
- **Live Badges**: Bright red pill with pulse animation, viewer count overlay
- **Creator Info**: Avatar (40px circular), name, follower count overlay on thumbnails

### Video Player
- **Full-Screen Interface**: 
  - Minimal chrome - controls fade after 3s of inactivity
  - Live viewer count top-right with animated join/leave indicators
  - Host info overlay bottom-left (avatar, name, follow button with blur background)
  - Gift button bottom-right with blur background
  
### Chat & Interaction
- **Live Chat Panel**: 
  - Right sidebar on desktop (320px width), bottom sheet on mobile
  - Semi-transparent dark background with blur
  - Message bubbles with user avatars (24px)
  - Auto-scroll with "new messages" indicator
  
### Gift System
- **Gift Tray**: Bottom drawer/modal with categories
- **Gift Cards**: Square tiles with animations, coin cost prominent
- **Send Animation**: Full-screen effect overlaying video

### Discovery/Browse
- **Hero Section**: Large featured stream with auto-play, overlaid title and host info
- **Category Tabs**: Horizontal scroll - "For You", "Following", "Gaming", "Music", "IRL"
- **Stream Grid**: Masonry-style layout with varied card sizes for featured vs regular streams

### User Profile
- **Stats Row**: Followers, Following, Total Gifts (large numbers, labeled)
- **Bio Section**: Centered, max 2 lines
- **Past Streams Grid**: 3 columns, thumbnail with playback count

### Go Live Flow
- **Setup Screen**: 
  - Large camera preview (full width)
  - Title input, category selector, thumbnail options
  - Privacy settings toggle
  - Prominent "Start Live" button with blur background over preview

### Buttons & Controls
- **Primary Actions**: Gradient backgrounds (vibrant), white text, 44px min height
- **Secondary**: Outlined with blur background when over images
- **Icon Buttons**: 40px touch targets, monochrome icons
- **Follow/Subscribe**: Prominent, consistent placement across interfaces

## Images
**Hero Image**: Yes - Use large, dynamic image of live streamers/creators in action
- Placement: Top of discovery page, 60vh height on desktop
- Treatment: Gradient overlay (dark bottom to transparent) for text legibility
- Content: Diverse creators mid-stream showing energy and engagement

**Thumbnail Images**: Throughout - auto-generated from live streams
**Avatar Images**: Circular, consistent sizes (24px chat, 40px cards, 80px profiles)
**Category Icons**: Custom illustrated icons for each category tab
**Gift Illustrations**: Animated SVG/Lottie files for each gift type

## Animations
- **Strategic Use Only**:
  - Gift send animations (celebratory, full-screen)
  - Live badge pulse (subtle, continuous)
  - Join/leave viewer count updates (brief number change)
  - Stream thumbnail auto-play on hover
  - Bottom sheet/modal transitions

## Accessibility
- High contrast text over video (with blur backgrounds)
- Minimum 44px touch targets throughout
- Clear focus states for keyboard navigation
- Screen reader labels for all interactive elements
- Captions toggle for streams