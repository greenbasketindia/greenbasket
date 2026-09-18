# 🧺 Green Basket

Premium, fully responsive landing page for **Green Basket** — a fresh fruits & vegetables pre-order/delivery service. Pure HTML, CSS and JavaScript — no framework, no build step required.

## 🚀 Live Preview

Open `index.html` directly in a browser, or host it for free on **GitHub Pages**:

1. Push this repo to GitHub.
2. Go to **Settings → Pages**.
3. Under "Build and deployment", select **Deploy from a branch**, branch `main`, folder `/ (root)`.
4. Save — your site will be live at `https://<your-username>.github.io/<repo-name>/`

## 📁 Project Structure

```
green-basket/
├── index.html      # Page markup (header, hero, categories, deals, footer)
├── style.css       # All styling (colors, layout, responsive design)
├── script.js       # Product data, countdown timer, WhatsApp order links
├── .gitignore
└── README.md
```

## ✨ Features

- Hero section with pre-order CTA and "how it works" steps
- Shop by Category grid
- Promo banners (cashback, pre-order, quality)
- Fresh Deals of the Day with a live countdown timer
- Trust/why-choose-us strip
- App download, payments, delivery-check & newsletter footer blocks
- Floating WhatsApp button + WhatsApp ordering on every product/CTA
- Fully responsive (mobile, tablet, desktop)

## 🛒 How Ordering Currently Works (No Backend Yet)

There is **no app and no backend/database connected yet**. Every "Add to Cart", "Pre-Order Now", category card, and the floating button opens **WhatsApp** with a pre-filled message to:

```
+91 97728 21229
```

This lets you start taking real orders immediately while the app/backend is being built.

To change the WhatsApp number, edit the constant at the top of `script.js`:

```js
const WHATSAPP_NUMBER = "919772821229"; // country code + number, no + or spaces
```

## 🔌 Connecting a Real Backend Later

When you're ready to add a real cart/order system, here's what to replace:

| Feature | Current (frontend-only) | Replace with |
|---|---|---|
| Products | Hardcoded array in `script.js` | API call to your backend/database |
| Add to Cart | Opens WhatsApp chat | Real cart state + checkout API |
| Newsletter form | Browser `alert()` | POST request to your email/CRM API |
| Pin code check | Opens WhatsApp chat | Serviceability API |

Look for `TODO` comments in `script.js` — those mark the spots meant to be wired up later.

## 🎨 Customizing

- **Colors/fonts:** all defined as CSS variables at the top of `style.css` under `:root`
- **Products:** edit the `products` array in `script.js`
- **Images:** currently hotlinked from Unsplash for placeholder-quality photos — swap with your own product photography when ready

## 📄 License

All rights reserved — Green Basket.
