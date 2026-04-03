# SS Local

## Current State
The main view has a header, a single video player at top, followed by News Channels section, Bhakthi Channels section, and YouTube section all on one scrollable page.

## Requested Changes (Diff)

### Add
- Three tabs in the header: News, Devotional, YouTube
- Each tab shows its own page with the same video player + channel list below

### Modify
- Header: Add 3 tab buttons (News, Devotional, YouTube) below the logo/menu row
- Main view: Replace single scrollable page with tab-based layout
  - News tab: video player + News Channels grid below
  - Devotional tab: video player + Bhakthi Channels grid below
  - YouTube tab: video player + YouTube Channels grid below
- Each tab maintains its own currently-playing video state (or share a single player state — when switching tabs, show the last played channel for that tab)
- Video player is identical on all 3 tabs (same component, same UI)

### Remove
- Flat single-page scrolling layout with all 3 sections stacked

## Implementation Plan
1. Add `activeTab` state: 'news' | 'devotional' | 'youtube'
2. Add per-tab video state: each tab tracks its own currentVideoId + currentTitle
3. Add tab nav bar below the logo header row with 3 buttons styled as tabs
4. Render VideoPlayer component shared across tabs, receiving props from the active tab state
5. Render appropriate channel list below player depending on activeTab
6. Preserve all existing logic: login, admin, user menu, lock/unlock, autoplay TV9 on News tab start
