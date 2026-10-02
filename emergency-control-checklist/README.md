# 🚨 Emergency Control & Checklist System

A responsive, frontend-only Emergency Control & Checklist System prototype.

## Features

- Emergency numbers such as `ER-2026-001`
- Automatic Emergency Number generation
- Emergency-type-specific checklists
- Hathras sample locations
- Custom location support
- Emergency search by number or location
- Pending / Complete status
- Red blinking incomplete-checklist alert
- Approximately 1-second emergency beep
- Browser autoplay-safe WebAudio activation
- `tel:` call buttons for mobile devices
- Call logs with time, number and status
- Manual checklist completion
- Full checklist + call-log reset
- HTS CUG quick contacts
- Demo data clearly marked
- Responsive mobile + desktop UI
- No external libraries, frameworks, CDN or backend

## Project Structure

```text
emergency-control-checklist/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Run Locally

Open `index.html` directly in a browser.

No build step is required.

## GitHub Pages

1. Create a GitHub repository.
2. Upload the complete project folder.
3. Make sure `index.html` is at the repository root.
4. Open:

`Settings → Pages`

5. Select the deployment source/branch.
6. Save and open the generated GitHub Pages URL.

## Important: CUG Numbers

The following are intentionally DEMO placeholders in `script.js`:

```javascript
"HTS CUG Control Room": {
  label: "HTS CUG Control Room",
  number: "0000000000"
},
"HTS CUG Officer": {
  label: "HTS CUG Officer",
  number: "0000000000"
}
```

Replace them only with authorized official numbers before deployment.

Other sample Hathras police/official numbers are also stored in the same `CONTACTS` object in `script.js` for easy editing.

## Data Persistence

This prototype keeps data in browser memory only.

Refreshing the page resets newly-created Emergencies and checklist changes back to the initial demo state.

For production use, a backend/database and authentication/authorization should be added.
