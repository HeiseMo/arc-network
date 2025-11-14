# 🎯 How to Claim a Bounty

## Complete Claim Process

### 1️⃣ Find a Bounty
- Go to Dashboard
- Browse the bounty feed
- Look for **ACTIVE** bounties (orange status badge)
- Find bounties in your current session

### 2️⃣ Open Bounty Details
- Click on any bounty card
- Modal opens with full details:
  - Target name
  - Last known location
  - Session ID
  - Reward offered
  - Reporter info
  - Time remaining

### 3️⃣ Claim the Bounty
**You'll see the claim button IF:**
- ✅ Bounty status is "active"
- ✅ You are logged in
- ✅ You are NOT the person who posted it

**Look for the big orange button:**
```
[ CLAIM BOUNTY - SUBMIT PROOF ]
```

**Click it!** → Form appears below

### 4️⃣ Submit Proof
The **Kill Confirmation Form** appears with:

**Fields to fill out:**
- 📸 **Proof Screenshot/Video** (required)
  - Upload image showing the kill
  - Must be clear proof of the target's death
  
- 🎮 **Session ID** (required)
  - Enter the session where kill happened
  - Must match the bounty's session
  
- 📝 **Additional Notes** (optional)
  - Any extra context
  - Timestamps, location details, etc.

**Submit button:** "Submit Confirmation"

### 5️⃣ Wait for Review
- Your confirmation is now **PENDING**
- Reporter receives notification
- They can see your proof
- They review and decide

### 6️⃣ Reporter Approves/Rejects

**If Reporter Approves:**
- ✅ Bounty status → "confirmed"
- 🏆 You get **+10 REPUTATION**
- 🎯 Reporter gets **+5 REPUTATION**
- ✓ Your confirmation shows "VERIFIED" badge

**If Reporter Rejects:**
- ❌ Confirmation deleted
- 🔄 Bounty remains active
- 💬 You can try again if you have better proof

---

## 🔍 Visual Flow

```
HUNTER VIEW:
1. See bounty feed
   ↓
2. Click bounty card
   ↓
3. Modal opens with details
   ↓
4. Click [ CLAIM BOUNTY - SUBMIT PROOF ]
   ↓
5. Form appears
   ↓
6. Upload proof + enter session ID
   ↓
7. Click "Submit Confirmation"
   ↓
8. Wait for reporter review
   ↓
9. Get +10 REP when approved! 🎉

REPORTER VIEW:
1. Post bounty
   ↓
2. Hunters see notification
   ↓
3. Hunter claims and submits proof
   ↓
4. Open your bounty modal
   ↓
5. See "Kill Confirmations" section
   ↓
6. Review hunter's proof image
   ↓
7. Click "Approve" or "Reject"
   ↓
8. Get +5 REP when approving! 🎉
```

---

## 🎨 UI Elements to Look For

### Claim Button:
- **Big orange tactical button**
- Corner brackets: `[ ... ]`
- Target icons on both sides
- Uppercase text
- Appears ONLY for hunters (not reporters)

### Confirmation Form:
- Orange header: "Submit Kill Confirmation"
- Alert triangle icon
- Tactical input fields
- Cancel and Submit buttons
- X button to close form

### Pending Confirmations:
- Weathered card style
- Proof image thumbnail
- Hunter username + reputation
- Timestamp and session ID
- "VERIFIED" badge if approved
- Approve/Reject buttons (for reporters only)

---

## 💡 Pro Tips

1. **Take Good Proof Screenshots**
   - Show kill feed clearly
   - Include timestamp if possible
   - Make sure target name is visible

2. **Double-Check Session ID**
   - Must match exactly
   - Copy from the bounty details
   - Case-sensitive

3. **Be in the Right Session**
   - Bounties are session-specific
   - Join the session mentioned in bounty
   - Use SessionManager to join

4. **Multiple Hunters Can Claim**
   - If multiple hunters got the kill
   - All can submit confirmations
   - Reporter decides which to approve

5. **Build Your Reputation**
   - Each confirmed kill = +10 REP
   - Higher REP = more trusted hunter
   - Shows next to your username

---

## ❓ Troubleshooting

**Q: I don't see the claim button!**
- Check if bounty is "active" (not expired/confirmed)
- Make sure you're logged in
- Can't claim your own bounties

**Q: Form disappeared after clicking claim?**
- Click the button again
- Or refresh the modal (close/reopen)

**Q: Can't upload proof image?**
- Check file size (max 50MB)
- Supported formats: JPG, PNG, GIF, MP4, WEBM
- Make sure Supabase storage bucket exists

**Q: Confirmation submitted but reporter doesn't see it?**
- Check that you entered correct session ID
- Reporter needs to refresh/reopen modal
- Check confirmations list at bottom of modal

**Q: How long until reporter reviews?**
- No time limit
- Reporters decide when to review
- Can message them in session chat

---

**Now go hunt some bounties! 🎯⚡**
