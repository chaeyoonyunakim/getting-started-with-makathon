# Pilot smoke-test checklist (TA)

A 5-minute walkthrough to run on every device on the morning of a
pilot day. Tick each box as you go.

> Tested on iPad 10.2" portrait, iOS 17+, Safari. Works on
> any modern tablet browser.

## Setup

- [ ] Tablet is on Wi-Fi.
- [ ] Brightness above 60%.
- [ ] Volume turned down (the app does not need audio).

## 1. Sign in

1. Open the app URL bookmarked on the tablet home screen.
2. Tap **Sign in** and enter your TA credentials.
3. ✅ You see the pupil-selection screen within 5 seconds.

## 2. Start a session

1. Tap the pupil you are working with.
2. Tap any category card (e.g. **Food**).
3. ✅ A small "Session 1" indicator appears at the top (only the TA
   sees this; the pupil sees a clean board).

## 3. Navigate depth 2

1. From the category screen, tap a sub-choice (e.g. **Apple**).
2. ✅ The board shows the final-choice cards for that sub-category.
3. Tap one final choice.
4. ✅ The big **Back** button (bottom-left, ≥ 64 × 64 px) takes you
   back one step at a time.

## 4. See a prediction highlight

1. Make 3–4 selections in a row.
2. ✅ At least one card in the next view shows a subtle **amber
   ring** — that is the next-card prediction.

## 5. End the session

1. Long-press the **Home** icon (top-left) for 2 seconds, **or**
   leave the tablet idle for 3 minutes.
2. ✅ A toast confirms "Session ended".

## 6. See the dashboard

1. Tap **Settings → Sessions** (SENCo role only).
2. ✅ Today's session appears with selection count, depth used, and
   a Golden-sign badge if the pupil earned one (≥ 5 selections across
   ≥ 2 scenes).

## If something is wrong

- Card images missing → check Wi-Fi; the symbol cache lazy-loads.
- No predictions → expected for a brand-new pupil; needs ≥ 10
  historical selections before the bandit warms up.
- Stuck on a blank screen → pull-to-refresh once; if it persists,
  email the SENCo with the time and pupil initials (no full name).
