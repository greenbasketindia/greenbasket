# GreenBasket India

Hyperlocal fresh vegetable & fruit ordering site for Hanumangarh, Rajasthan.

**Phase 1 (current):** Static website. No cart, no backend — customers order directly via WhatsApp. This validates real demand before any backend/admin system is built.

**Phase 2 (planned):** Firebase (Firestore + Hosting + Auth) backend with a no-code admin dashboard to manage products, prices, images, and categories without touching code.

## Tech stack (Phase 1)

- HTML5, CSS3 (no framework, no build step)
- Vanilla JavaScript
- Fonts: Fraunces + Work Sans (Google Fonts)

## Project structure

```
greenbasketindia/
├── index.html
├── assets/
│   ├── css/style.css
│   ├── js/main.js
│   └── images/
├── .gitignore
└── README.md
```

## Running locally

No build step needed — just open `index.html` in a browser, or serve it locally:

```bash
npx serve .
```

## Ordering flow (Phase 1)

Every "Order on WhatsApp" button opens a pre-filled WhatsApp message to the store number, including the product name, unit, and price where applicable. No customer data is stored anywhere in this phase.

## Roadmap

- [x] Static homepage — hero, categories, live deals, WhatsApp ordering
- [ ] Deploy to Firebase Hosting
- [ ] Firestore-backed product catalog (replaces hardcoded product cards)
- [ ] Admin dashboard (auth-protected) — manage products, prices, images, banners, orders
- [ ] Firestore security rules — public read-only, admin-only writes
