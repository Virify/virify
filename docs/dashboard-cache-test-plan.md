# Dashboard Cache & Cache Busting — Manual Test Plan

A colleague with a test account should be able to run through this end-to-end in one session. Each section notes what cache should be busted and what the expected result is so failures are easy to spot.

---

## Setup

- Use a **non-admin test account** (not the admin account — admin bypasses some caches)
- Open the dashboard in a **private/incognito window** to avoid any browser state carryover
- Have a second browser window open as a different user (for the enquiry section)

---

## 0. Account Setup

### 0a. Create a new account

1. Navigate to the registration/sign-up page
2. Sign up with a **fresh email address** (not an existing account)
3. Complete email verification if required

### 0b. Set up your profile and avatar

1. Navigate to **Dashboard → Profile Settings** (or Account Settings)
2. Upload a **profile avatar** (any image)
3. Fill in your display name / profile details
4. Save

**Expected:** Avatar appears in the sidebar/nav immediately. Profile details are saved and visible when returning to the settings page.

---

## 1. Draft Listings — Create & Image Upload

### 1a. Create a new draft listing

1. Navigate to **Dashboard → My Listings → Create Listing**
2. Complete the minimum required fields and save
3. Navigate to **Dashboard → Draft Listings**

**Expected:** The new listing card appears immediately. The **Drafts** badge count in the sidebar navigation should increment by 1 without a page reload.

> Cache check: `draftListings` aggregate + draft listings page cache are busted on create.

---

### 1b. Upload an image and set it as the main image

1. From the draft listings page, click **Edit** on the newly created listing
2. Navigate to the **Images step (Step 9)**
3. Upload at least 2 images
4. Drag one image to the **first position** (main image) or use the reorder controls
5. Save the step
6. Navigate back to **Dashboard → Draft Listings**

**Expected:** The listing card thumbnail on the draft listings page updates to the new main image — without requiring a page reload or admin cache clear.

> Cache check: `invalidateMyListingsCache` + `invalidateDraftListingsCache` are hit on image reorder for live listings; draft page re-fetches after save.

---

## 2. Publish a Listing

1. From the draft listings page, find your listing and click **Publish**
2. Confirm the publish action

**Expected (all should happen without manual refresh):**
- The listing card **disappears from the Draft Listings page** immediately
- The **Drafts** badge count in the sidebar decrements by 1
- Navigate to **Dashboard → My Listings** — the listing **appears there**
- The **My Listings** badge/count updates accordingly

> Cache check: publish endpoint busts `draftListings`, `my-listings`, and `aggregates` caches plus sends a WebSocket aggregate update.

---

## 3. Live Listing — Main Image Update

1. Go to **Dashboard → My Listings**
2. Click **Edit** on the listing you just published
3. Navigate to the **Images step**
4. Reorder the images so a different image is in position 1
5. Save
6. Navigate back to **Dashboard → My Listings**

**Expected:** The listing card thumbnail reflects the updated main image immediately.

> Cache check: `invalidateListingCache` + `invalidateMyListingsCache` are both hit.

---

## 4. Enquiries — Send a Message with Emoji & Document

1. Navigate to a **property listing page** (use the second user's browser session to view the listing as a prospective buyer)
2. Click **Enquire** / **Send Message**
3. In the message field, type a message that includes an **emoji** (e.g. 😊)
4. Attach a **document** (PDF or image)
5. Send the message
6. In the **first user's** browser (the listing owner), navigate to **Dashboard → Messages**

**Expected:**
- The message thread appears with the emoji rendered correctly
- The attached document is accessible/downloadable
- The conversation appears in the sent folder for the second user

---

## 5. Notes — Add & Remove

1. Navigate to a **property listing** (not one you own)
2. Click **Add Note** and type a note, save it
3. Navigate to **Dashboard → Notes** — the note should appear
4. Navigate away (e.g. to Dashboard home) and back to **Notes**

**Expected:** Note is still there (TTL is 2 min; navigating back should hit the cache and still show it).

5. Delete the note from the Notes page
6. Navigate away and back to **Notes**

**Expected:** The note is gone — not cached with the deleted item still present.

> Cache check: note deletion busts the notes cache.

---

## 6. Favourites — Add & Remove

1. Navigate to any **property listing**
2. Click the **Favourite** (heart) button
3. Navigate to **Dashboard → Favourites** — the property should appear
4. Navigate away and back to **Favourites**

**Expected:** The favourite persists (served from cache on second visit within TTL).

5. Unfavourite the property (click heart again, or remove from the Favourites page)
6. Navigate away and back to **Favourites**

**Expected:** The property is gone.

> Cache check: removing a favourite busts the favourites cache.

---

## 7. Search & Hidden Listings

### 7a. Search

1. Navigate to the **Search page**
2. Enter a location and submit
3. Note the number of results
4. Apply a filter (e.g. number of bedrooms, price range)

**Expected:** Results update correctly. Navigating back and forward between search and individual listings should be fast (cached) and return the same results.

### 7b. Hide a listing

1. From search results, find a listing and click **Hide** (the hidden listing action)
2. Check the **sidebar badge** for Hidden Listings increments
3. Navigate to **Dashboard → Hidden Listings** — the listing should appear
4. Go back to search — the hidden listing should **no longer appear** in results

**Expected:** Aggregate badge updates immediately via WebSocket. Hidden listings page shows the item. Search respects the hidden status.

### 7c. Unhide

1. From **Dashboard → Hidden Listings**, unhide the listing
2. Navigate away and back

**Expected:** The listing is removed from Hidden Listings. Badge decrements. The listing reappears in search results.

---

## 8. Aggregate Badge Counts — General Spot Check

After completing all of the above, do a final pass on the **sidebar navigation badges**:

| Badge | Expected value |
|---|---|
| Drafts | 0 (published the draft) |
| My Listings | 1 (the published listing) |
| Notes | 0 (deleted the note) |
| Favourites | 0 (unfavourited) |
| Hidden | 0 (unhid the listing) |

All counts should match without requiring a page reload.

---

## Known Acceptable Behaviour

- **Viewing requests** (if enabled): TTL is 5 min, so a change made by another party may take up to 5 min to appear — this is intentional
- **Recent items** (dashboard home "recently viewed"): 2 min TTL — a very recently added item may not appear for up to 2 minutes on first load
