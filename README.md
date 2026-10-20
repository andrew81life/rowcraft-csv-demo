# Rowcraft
Original AI-assisted portfolio demo, not customer work. CSV cleanup entirely in the browser.

## Run
Serve this folder with any static HTTP server. Open index.html. No build step or dependencies.

## Test
`node --test core.test.mjs`

## Scope
UTF-8 CSV, configurable comma/semicolon/tab separator, edge trimming, exact row deduplication, empty row removal, preview, UTF-8 BOM export, optional spreadsheet formula protection. 5 MB and 20,000 data rows maximum. No upload, analytics, network integrations, or persistent storage.

## Limitations
No Excel binary files, encoding conversion, semantic date conversion, fuzzy merging, or production suitability guarantee. Negative values receive apostrophes with formula protection enabled. This deliberately favors safety over numeric inference. Preview limited to 20 data rows and 8 columns, export includes every cleaned cell.
