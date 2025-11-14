# 🎯 Bounty System Expansion

## Overview
Expanded the bounty system with real-time notifications, kill confirmation workflow, and reputation rewards.

---

## ✅ Features Implemented

### 1. Real-Time Bounty Notifications

**Hook: `useBountyNotifications.js`**
- Monitors active session from localStorage
- Subscribes to Supabase realtime for new bounty inserts
- Filters bounties matching user's active session
- Excludes notifications for user's own bounties
- Auto-dismisses after 10 seconds

**Component: `BountyNotificationToast.jsx`**
- Tactical-styled notification with CRT frame
- Shows target name, location, and reporter
- Pulsing signal indicator
- Corner brackets for targeting aesthetic
- Dismissible with X button
- Slides in from right with animation

**Integration:**
- Added to `Dashboard.jsx`
- Appears when hunters in same session post bounties
- Non-intrusive toast in top-right corner

---

### 2. Kill Confirmation System

**Enhanced `BountyModal.jsx`:**

#### For Hunters (Can Claim):
- **Claim Button** - "[ CLAIM BOUNTY - SUBMIT PROOF ]"
- Opens `ConfirmationForm` inline
- Submit screenshot/video proof
- Records session ID
- Creates confirmation entry

#### For Reporters (Can Approve/Reject):
- **View Confirmations** - See all hunter submissions
- **Approve Button** - Confirms legitimate kill
  - Marks bounty as "confirmed"
  - Awards +10 reputation to hunter
  - Awards +5 reputation to reporter
  - Marks confirmation as verified
- **Reject Button** - Deletes false submission
- Both actions disabled during processing

#### Confirmation Display:
- Shows hunter username and reputation
- Displays proof image
- Shows timestamp and session ID
- "VERIFIED" badge for approved kills
- Approve/Reject buttons for pending confirmations

---

### 3. Updated BountyModal Styling

**Tactical Overhaul:**
- CRT frame container with rust accent
- Corner brackets for targeting reticle
- Stencil headers: "BOUNTY DOSSIER", "KILL CONFIRMATIONS"
- Status badges with pulsing indicators
- Weathered card styling for info sections
- Signal orange accents throughout
- Military-style typography

**Sections:**
- Target header with large stencil name
- Reporter info with reputation badge
- Proof image/video display
- Info grid (Location, Session ID)
- Intelligence brief (description)
- Bounty reward with trophy icon
- Timeline (posted time, remaining time)
- Claim button (for hunters)
- Confirmation form (when claiming)
- Confirmations list (with approve/reject)

---

### 4. Reputation System

**Automatic Reputation Awards:**

| Action | Reward | Who Gets It |
|--------|--------|-------------|
| Kill Approved | +10 REP | Hunter who claimed |
| Kill Confirmed | +5 REP | Original reporter |

**Database Updates:**
- Fetches current reputation
- Adds reward amount
- Updates user table
- Reflected immediately in UI

---

## 🔄 Complete Bounty Lifecycle

### Phase 1: Bounty Posted
1. Reporter creates bounty
2. Real-time notification sent to hunters in session
3. Toast appears for active hunters
4. Bounty appears in feed

### Phase 2: Hunter Claims
1. Hunter clicks "[ CLAIM BOUNTY ]"
2. Uploads proof screenshot/video
3. Enters session ID
4. Submits confirmation

### Phase 3: Reporter Reviews
1. Reporter opens bounty
2. Views hunter's proof submission
3. Approves or rejects

### Phase 4: Confirmed
1. If approved:
   - Bounty status → "confirmed"
   - Hunter gets +10 REP
   - Reporter gets +5 REP
   - Confirmation marked "VERIFIED"
2. If rejected:
   - Confirmation deleted
   - Bounty remains active

---

## 🎨 Tactical Design Elements

### Notifications:
- CRT frame with scanlines
- Corner brackets
- Pulsing signal indicators
- Orange accent colors
- Tactical typography

### Modal:
- Full tactical overhaul
- Weathered metal aesthetic
- Stencil headers
- Monospace data displays
- Clipped corner buttons
- Rust accent bars

### Buttons:
- "[ CLAIM BOUNTY - SUBMIT PROOF ]" - Signal orange
- "Approve" - Olive green
- "Reject" - Rust red
- All with uppercase bracketed text

---

## 📡 Supabase Realtime Setup

**Enable Realtime in Supabase:**
1. Go to Database → Replication
2. Enable replication for `bounties` table
3. Subscribe to INSERT events
4. Filter by `session_id`

**Hook Implementation:**
- Subscribes to channel: `bounties:{sessionId}`
- Listens for INSERT events
- Fetches reporter info
- Creates notification object
- Auto-cleanup with useEffect

---

## 🧪 Testing the System

### Test Real-Time Notifications:
1. Open two browser windows (or incognito)
2. Create two users
3. Both join same session (e.g., "ALPHA-1234")
4. User A posts bounty
5. User B should see notification toast

### Test Kill Confirmation:
1. User B opens bounty
2. Clicks "[ CLAIM BOUNTY ]"
3. Uploads proof image
4. Enters session ID
5. Submits confirmation
6. User A (reporter) opens bounty
7. Sees confirmation with Approve/Reject buttons
8. Clicks Approve
9. Check reputation increased for both users

---

## 🔧 Files Modified

### New Files:
- `src/hooks/useBountyNotifications.js`
- `src/components/Notifications/BountyNotificationToast.jsx`

### Modified Files:
- `src/components/Bounty/BountyModal.jsx` (major update)
- `src/pages/Dashboard.jsx` (added notification)

---

## 🚀 Next Steps (Future Enhancements)

1. **Dispute System** - Allow hunters to dispute rejections
2. **Bounty Expiry Notifications** - Alert when bounties about to expire
3. **Hunter Leaderboard** - Show top hunters by confirmed kills
4. **Bounty History** - View past bounties and confirmations
5. **Session Chat** - Real-time chat for hunters in same session
6. **Audio Alerts** - Sound effects for new bounty notifications
7. **Badge System** - Achievements for milestones
8. **Bounty Filters** - Filter by status, session, timeframe

---

**The bounty system is now fully functional with real-time notifications and a complete confirmation workflow!** 🎯⚡
