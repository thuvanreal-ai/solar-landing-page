# Solar Landing Page V2

Static landing page designed for GitHub Pages.

## Before production
1. Edit `js/config.js`: brand, phone, Zalo, service area.
2. Set `leadEndpoint` to a tested HTTPS endpoint that accepts `multipart/form-data` if bill-image upload is required.
3. Add GA4/GTM/Google Ads base tag and IDs; conversion must fire only after successful lead submission.
4. Replace privacy placeholder with actual legal entity/contact details.
5. Add real project photos/case studies only after permission and verification.
6. Test form on production domain, mobile, Safari/Chrome, and verify lead arrival end-to-end.

## GitHub Pages
Upload the folder contents to repository root (or configure Pages to the appropriate branch/folder). `index.html` is the entry page.
