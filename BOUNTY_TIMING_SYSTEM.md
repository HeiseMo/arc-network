# 🕐 Bounty Timing System

## Overview
Added comprehensive timing controls for bounties including session time tracking and customizable active periods.

---

## 🆕 New Features

### 1. **Time Left When Killed**
Tracks how many minutes were remaining in the game session when the reporter was killed.

**Purpose:**
- Helps hunters know if the killer is still in an active session
- Provides context for urgency
- Indicates if other players in same session can also hunt the target

**Usage:**
- Reporter enters minutes (0-300)
- Optional field
- Displayed prominently in bounty details

### 2. **Active Period Selection**
Allows reporters to set how long the bounty remains active.

**Options:**
- **24 Hours** - Quick bounties for immediate threats
- **1 Week** - Standard bounty duration  
- **Unlimited** - Persistent bounties until confirmed

**Default:** 1 Week

---

## 📊 Database Changes

### New Columns Added to `bounties` table:

```sql
time_left_when_killed INTEGER
- Stores minutes left in session when killed
- Nullable (optional)
- Range: 0-300 minutes

active_period TEXT
- Options: '24h', '1week', 'unlimited'
- NOT NULL with default 'unlimited'
- CHECK constraint enforces valid values
```

### Migration File:
`supabase/migrations/20251114000001_add_bounty_timing_fields.sql`

**Run this in Supabase SQL Editor to update your database!**

---

## 🎨 UI Implementation

### BountyForm Updates:

#### Time Left Input:
```
┌────────────────────────────────────┐
│ TIME LEFT IN SESSION (MINUTES)     │
├────────────────────────────────────┤
│ [     15     ]                     │
│ > HOW MANY MINUTES WERE LEFT?      │
└────────────────────────────────────┘
```
- Number input (0-300)
- Tactical styling
- Monospace font
- Command-line helper text

#### Active Period Selector:
```
┌─────┬──────┬──────────┐
│ 24  │  1   │    ∞     │
│HOURS│ WEEK │UNLIMITED │
└─────┴──────┴──────────┘
```
- 3-column radio grid
- Weathered card styling
- Orange accent when selected
- Large monospace numbers

---

## 📋 BountyModal Display

### Intelligence Grid (Expanded):
Now shows 4 cards instead of 2:

1. **Last Known Location**
   - Denim blue accent
   - Map pin icon

2. **Session ID**
   - Denim blue accent
   - Clock icon

3. **Time Left in Session** (conditional)
   - Orange accent
   - Shows minutes
   - Only if reporter provided data

4. **Active Period**
   - Olive accent
   - Shows 24 HOURS / 1 WEEK / UNLIMITED

### Timeline Display:
```
POSTED: Nov 14, 2025 10:30:00 PM  |  TIME: 6D 12:45
POSTED: Nov 14, 2025 10:30:00 PM  |  TIME: 18:30
POSTED: Nov 14, 2025 10:30:00 PM  |  ∞ UNLIMITED
POSTED: Nov 14, 2025 10:30:00 PM  |  TIME: EXPIRED
```

**Color Coding:**
- Orange = Active with time remaining
- Green = Unlimited bounties  
- Red (pulsing) = Expired

---

## ⚙️ Time Calculation Logic

### For Limited Bounties:
```javascript
Created: Nov 14, 10:00 PM
Active Period: 24h
Expires: Nov 15, 10:00 PM

Now: Nov 15, 6:30 PM
Remaining: 03:30 (3 hours, 30 minutes)
```

### For Week-Long Bounties:
```javascript
Created: Nov 14, 10:00 PM
Active Period: 1week
Expires: Nov 21, 10:00 PM

Now: Nov 18, 2:00 PM
Remaining: 3D 08:00 (3 days, 8 hours)
```

### Display Format:
- **Days remaining:** `3D 08:30`
- **Hours only:** `12:45`
- **Unlimited:** `∞ UNLIMITED`
- **Expired:** `EXPIRED` (red, pulsing)

---

## 🎯 Use Cases

### Scenario 1: Active Session Hunt
```
Reporter killed with 15 minutes left
Active Period: 24h
Time Left: 15 MIN displayed

→ Hunters know target might still be in same session
→ Can join session immediately and hunt
```

### Scenario 2: Persistent Threat
```
No time left data (reporter already out of session)
Active Period: Unlimited

→ Bounty stays active indefinitely
→ Hunters can claim whenever they encounter target
```

### Scenario 3: Quick Response
```
Time Left: 25 MIN
Active Period: 24h

→ Urgent bounty for immediate action
→ Expires tomorrow if not confirmed
```

---

## 📱 Form Validation

### Time Left Field:
- ✅ Optional (can be empty)
- ✅ Min: 0 minutes
- ✅ Max: 300 minutes (5 hours)
- ✅ Integer only

### Active Period:
- ✅ Required field
- ✅ Default: '1week'
- ✅ Radio selection (one choice)
- ✅ Visual feedback when selected

---

## 🔄 Backwards Compatibility

### Existing Bounties:
The migration automatically sets:
```sql
UPDATE public.bounties
SET active_period = 'unlimited'
WHERE active_period IS NULL;
```

All old bounties become unlimited by default.

### Missing time_left_when_killed:
- Field is nullable
- UI handles gracefully
- Card only shows if data exists

---

## 🚀 Testing Checklist

### Database:
- [ ] Run migration in Supabase SQL Editor
- [ ] Verify columns exist: `time_left_when_killed`, `active_period`
- [ ] Check existing bounties have `active_period = 'unlimited'`

### Form:
- [ ] Create bounty with time left (e.g., 15 min)
- [ ] Create bounty without time left (leave empty)
- [ ] Test all 3 active periods (24h, 1week, unlimited)
- [ ] Verify form data saves correctly

### Display:
- [ ] Open bounty with time left → shows in grid
- [ ] Open bounty without time left → card hidden
- [ ] Check timeline shows correct format
- [ ] Verify unlimited shows ∞ symbol
- [ ] Watch timer count down in real-time

### Edge Cases:
- [ ] Bounty expires (changes to EXPIRED, red pulse)
- [ ] Time left = 0 minutes
- [ ] Time left = 300 minutes (max)
- [ ] Switch between active periods while creating

---

## 📐 Visual Design

### Color Scheme:
- **Time Left Card:** Orange accent (urgency)
- **Active Period Card:** Olive accent (neutral info)
- **Location/Session:** Denim accent (standard info)

### Typography:
- All monospace fonts
- Uppercase labels
- Bold values
- Tactical military aesthetic

### Layout:
- Responsive grid (2 cols, 4 cards max)
- Weathered card backgrounds
- Consistent border colors
- Icon + label headers

---

**All timing features now fully integrated into the tactical bounty system!** 🎯⏱️
