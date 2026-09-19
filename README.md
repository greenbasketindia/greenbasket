# Green Basket 🥬

Premium fresh fruits & vegetables ordering website — **Phase 1: frontend only.**

Built with plain HTML, CSS and vanilla JavaScript. No frameworks, no backend, no database — just a clean, production-quality storefront that's ready to be wired to a real backend later.

## Project structure

```
greenbasket/
│
├── index.html          # Homepage markup
├── css/
│   └── style.css       # All styling (design tokens as CSS variables)
├── js/
│   └── script.js       # Product data, cart logic, WhatsApp ordering
├── assets/
│   ├── images/         # Put your own product/brand images here
│   └── icons/          # Put favicon / icon assets here
└── README.md
```

## Getting started

No build step needed. Just open `index.html` in a browser, or serve the folder locally:

```bash
# Option 1: just open it
open index.html

# Option 2: serve it (recommended, avoids any relative-path issues)
npx serve .
# or
python3 -m http.server 5500
```

## How ordering works (Phase 1)

There's no payment gateway or backend yet. Instead, when a customer adds items to the cart and taps **Order via WhatsApp**, the site:

1. Builds a plain-text order summary (customer name, items, quantities, prices, total).
2. Opens WhatsApp (web or app) with that message pre-filled, addressed to your business number.
3. You confirm and take the order manually from there.

### Changing the WhatsApp number

The number lives in **exactly one place** — the `CONFIG` object at the top of `js/script.js`:

```js
const CONFIG = {
  WHATSAPP_NUMBER: "919772821229", // <-- change this
  CURRENCY_SYMBOL: "₹",
  STORE_NAME: "Green Basket",
};
```

Format: country code + number, no `+`, no spaces, no leading `0` (e.g. `91XXXXXXXXXX` for India). Nothing else in the codebase needs to change.

## Product data (placeholder)

All products are defined in one array (`PRODUCTS`) near the top of `js/script.js`. Each product has an `id`, `name`, `unit`, `price`, optional `oldPrice` (for discount display), and an `image` URL.

Right now images are pulled from Unsplash for development. **Replace the `image` field with your own hosted photo** (e.g. `assets/images/tomato.jpg`) before going live — the markup and styling don't need to change.

```js
{
  id: "tomato",
  name: "Tomato",
  unit: "1 kg",
  price: 20,
  oldPrice: 30,
  image: "assets/images/tomato.jpg", // swap in your own photo
  alt: "Fresh red tomatoes",
}
```

## Design notes

- Layout, spacing, typography, card style and section rhythm follow the provided reference design as closely as possible.
- Colors and type scale are defined as CSS variables at the top of `style.css` for easy theming.
- Fully responsive: desktop, tablet and mobile breakpoints included, no horizontal scroll.
- Cart state is kept in memory only (resets on page refresh) since there's no backend yet — this is expected for Phase 1.

## Phase 2 (future backend)

The frontend is structured so a real backend can be added later without a UI rebuild:

- `PRODUCTS` in `script.js` can be swapped for a `fetch()` call to a real API.
- The WhatsApp ordering flow can be replaced with a real checkout/order-management call — the `sendWhatsAppOrder()` function is the single integration point to change.
- Planned admin capabilities (not built yet): update prices, update images, add/remove products, mark items unavailable, manage incoming orders.

## Browser support

Modern evergreen browsers (Chrome, Edge, Safari, Firefox). No polyfills included.
