# Google Sheets Setup Guide

This guide connects your assessment to a Google Sheet so every submission is automatically recorded. It takes about 10 minutes.

---

## Step 1 — Create the Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a new spreadsheet
2. Rename it to something like **Strivers' Hub — Assessment Submissions**
3. On **Row 1**, add these headers (one per column):

| A | B | C | D | E |
|---|---|---|---|---|
| Timestamp | Language | Score | Category | Answers |

---

## Step 2 — Open the Apps Script editor

1. In your Google Sheet, click **Extensions → Apps Script**
2. Delete all the default code in the editor
3. Paste in the following code:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);

    // Format the answers as a readable string, e.g. "Q1: 1c | Q2: 2b | ..."
    const answersFormatted = Object.entries(data.answers || {})
      .map(([qId, optId]) => `Q${qId}: ${optId}`)
      .join(" | ");

    // Append a new row with KL timezone timestamp
    sheet.appendRow([
      new Date().toLocaleString("en-MY", { timeZone: "Asia/Kuala_Lumpur" }),
      data.language === "bm" ? "Bahasa Malaysia" : "English",
      data.score,
      data.category,
      answersFormatted,
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Click **Save** (floppy disk icon), name the project **Strivers Hub Collector**

---

## Step 3 — Deploy as a Web App

1. Click **Deploy → New deployment**
2. Click the gear icon ⚙️ next to "Select type" and choose **Web app**
3. Fill in the settings:
   - **Description**: Strivers Hub Assessment Collector
   - **Execute as**: Me *(your Google account)*
   - **Who has access**: **Anyone** ← this is important
4. Click **Deploy**
5. Click **Authorize access** → choose your Google account → click **Allow**
6. Copy the **Web app URL** — it looks like:
   ```
   https://script.google.com/macros/s/AKfycb.../exec
   ```

---

## Step 4 — Add the URL to your project

**For local development:**
1. Copy `.env.local.example` and rename it to `.env.local`
2. Paste the URL from Step 3:
   ```
   GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_ID/exec
   ```
3. Restart the dev server: `npm run dev`

**For Vercel (production):**
1. Go to your Vercel project → **Settings → Environment Variables**
2. Add a new variable:
   - Name: `GOOGLE_SCRIPT_URL`
   - Value: your Web App URL
3. Redeploy the project

---

## Step 5 — Test it

1. Open your app and complete the assessment
2. Check your Google Sheet — a new row should appear within a few seconds

---

## Sharing the Sheet with Stakeholders

- **View-only link**: Click **Share → Change to Anyone with the link → Viewer** → copy the link
- **Specific people**: Click **Share** → type their email → set role to Viewer
- **Publish as webpage**: Click **File → Share → Publish to web** for a clean read-only view with no spreadsheet UI

---

## Adding columns later

If you want to collect more data (e.g., a name or email field from the Results page), add the column to your sheet header and update the `sheet.appendRow([...])` line in the Apps Script to include the new field. Then **redeploy**: Deploy → Manage deployments → Edit → bump the version.
