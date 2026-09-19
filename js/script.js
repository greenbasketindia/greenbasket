/* ==========================================================================
   GREEN BASKET — SCRIPT.JS
   Phase 1: frontend-only. Cart state lives in memory (no backend yet).
   Orders are sent through WhatsApp using the CONFIG below.
   ========================================================================== */

/* --------------------------------------------------------------------------
   CONFIG
   This is the ONLY place the business WhatsApp number lives.
   Replace it later (Phase 2) or wire it to a backend setting — nothing
   else in the codebase needs to change.
   Format: full number with country code, no "+", no spaces, no leading 0.
   Example for India: 91XXXXXXXXXX
   -------------------------------------------------------------------------- */
const CONFIG = {
  WHATSAPP_NUMBER: "919772821229", // TODO: confirm country code before going live
  CURRENCY_SYMBOL: "₹",
  STORE_NAME: "Green Basket",
};

/* --------------------------------------------------------------------------
   PRODUCT DATA
   Placeholder data + placeholder images (Unsplash) for development only.
   Swap "image" values for your own product photography before launch —
   every product is defined in one place, so replacing images is a
   one-line change per product.
   -------------------------------------------------------------------------- */
const PRODUCTS = [
  {
    id: "tomato",
    name: "Tomato",
    unit: "1 kg",
    price: 20,
    oldPrice: 30,
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=500&auto=format&fit=crop",
    alt: "Fresh red tomatoes",
  },
  {
    id: "potato",
    name: "Potato",
    unit: "1 kg",
    price: 18,
    oldPrice: 25,
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=500&auto=format&fit=crop",
    alt: "Freshly harvested potatoes",
  },
  {
    id: "cucumber",
    name: "Cucumber",
    unit: "1 kg",
    price: 16,
    oldPrice: 22,
    image: "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?q=80&w=500&auto=format&fit=crop",
    alt: "Sliced fresh cucumbers",
  },
  {
    id: "capsicum",
    name: "Green Capsicum",
    unit: "1 kg",
    price: 40,
    oldPrice: 60,
    image: "https://images.unsplash.com/photo-1583663848692-8afb59a3e08c?q=80&w=500&auto=format&fit=crop",
    alt: "Fresh green capsicums",
  },
  {
    id: "banana",
    name: "Banana",
    unit: "1 dozen",
    price: 28,
    oldPrice: 40,
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?q=80&w=500&auto=format&fit=crop",
    alt: "Bunch of ripe bananas",
  },
  {
    id: "apple",
    name: "Apple",
    unit: "1 kg",
    price: 110,
    oldPrice: 150,
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&w=500&auto=format&fit=crop",
    alt: "Fresh red apples, one halved",
  },
  {
    id: "onion",
    name: "Onion",
    unit: "1 kg",
    price: 24,
    oldPrice: 32,
    image: "https://images.unsplash.com/photo-1508747703725-719777637510?q=80&w=500&auto=format&fit=crop",
    alt: "Fresh red onions",
  },
  {
    id: "spinach",
    name: "Spinach",
    unit: "1 bunch",
    price: 15,
    oldPrice: null,
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=500&auto=format&fit=crop",
    alt: "Fresh spinach bunch",
  },
  {
    id: "carrot",
    name: "Carrot",
    unit: "1 kg",
    price: 30,
    oldPrice: 42,
    image: "https://images.unsplash.com/photo-1447175008436-054170c2e979?q=80&w=500&auto=format&fit=crop",
    alt: "Fresh orange carrots",
  },
  {
    id: "orange",
    name: "Orange",
    unit: "1 kg",
    price: 65,
    oldPrice: 90,
    image: "https://images.unsplash.com/photo-1547514701-42782101795e?q=80&w=500&auto=format&fit=crop",
    alt: "Fresh juicy oranges",
  },
  {
    id: "broccoli",
    name: "Broccoli",
    unit: "500 g",
    price: 45,
    oldPrice: 60,
    image: "https://images.unsplash.com/photo-1584270354949-1b26c9291b41?q=80&w=500&auto=format&fit=crop",
    alt: "Fresh green broccoli",
  },
  {
    id: "grapes",
    name: "Green Grapes",
    unit: "500 g",
    price: 55,
    oldPrice: 75,
    image: "https://images.unsplash.com/photo-1599819177626-b4b3ceff2c66?q=80&w=500&auto=format&fit=crop",
    alt: "Fresh green grapes",
  },
];

/* --------------------------------------------------------------------------
   STATE
   -------------------------------------------------------------------------- */
const cart = {}; // { productId: quantity }

/* --------------------------------------------------------------------------
   DOM REFERENCES
   -------------------------------------------------------------------------- */
const productGrid = document.getElementById("productGrid");
const cartToggle = document.getElementById("cartToggle");
const cartClose = document.getElementById("cartClose");
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const cartItemsEl = document.getElementById("cartItems");
const cartCountEl = document.getElementById("cartCount");
const cartTotalEl = document.getElementById("cartTotal");
const whatsappOrderBtn = document.getElementById("whatsappOrderBtn");
const customerNameInput = document.getElementById("customerName");
const newsletterForm = document.getElementById("newsletterForm");
const yearEl = document.getElementById("year");

/* --------------------------------------------------------------------------
   HELPERS
   -------------------------------------------------------------------------- */
function formatPrice(amount) {
  return `${CONFIG.CURRENCY_SYMBOL}${amount.toLocaleString("en-IN")}`;
}

function getProduct(id) {
  return PRODUCTS.find((p) => p.id === id);
}

function calcDiscount(price, oldPrice) {
  if (!oldPrice || oldPrice <= price) return null;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

function cartItemCount() {
  return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
}

function cartTotalAmount() {
  return Object.entries(cart).reduce((sum, [id, qty]) => {
    const product = getProduct(id);
    return product ? sum + product.price * qty : sum;
  }, 0);
}

/* --------------------------------------------------------------------------
   RENDER: PRODUCT GRID
   -------------------------------------------------------------------------- */
function renderProducts() {
  productGrid.innerHTML = PRODUCTS.map((product) => {
    const discount = calcDiscount(product.price, product.oldPrice);
    const qty = cart[product.id] || 0;

    const priceMarkup = `
      <div class="product-card__price">
        <strong>${formatPrice(product.price)}</strong>
        ${product.oldPrice ? `<del>${formatPrice(product.oldPrice)}</del>` : ""}
        ${discount ? `<span class="discount">-${discount}%</span>` : ""}
      </div>
    `;

    const controlMarkup = qty > 0
      ? `
        <div class="qty-stepper" data-id="${product.id}">
          <button type="button" class="qty-minus" aria-label="Decrease quantity">−</button>
          <span>${qty}</span>
          <button type="button" class="qty-plus" aria-label="Increase quantity">+</button>
        </div>
      `
      : `
        <button type="button" class="add-to-cart-btn" data-id="${product.id}">
          🛒 Add to Cart
        </button>
      `;

    return `
      <div class="product-card">
        ${discount ? `<span class="product-card__badge">-${discount}%</span>` : ""}
        <div class="product-card__image-wrap">
          <img src="${product.image}" alt="${product.alt}" loading="lazy" />
        </div>
        <h3>${product.name}</h3>
        <p class="product-card__unit">${product.unit}</p>
        ${priceMarkup}
        ${controlMarkup}
      </div>
    `;
  }).join("");
}

/* --------------------------------------------------------------------------
   RENDER: CART DRAWER
   -------------------------------------------------------------------------- */
function renderCart() {
  const entries = Object.entries(cart).filter(([, qty]) => qty > 0);

  if (entries.length === 0) {
    cartItemsEl.innerHTML = `<p class="cart-empty">Your cart is empty. Start adding fresh picks!</p>`;
  } else {
    cartItemsEl.innerHTML = entries.map(([id, qty]) => {
      const product = getProduct(id);
      if (!product) return "";
      return `
        <div class="cart-line" data-id="${id}">
          <img src="${product.image}" alt="${product.alt}" />
          <div class="cart-line__info">
            <strong>${product.name}</strong>
            <small>${product.unit} · ${formatPrice(product.price)}</small>
          </div>
          <div class="cart-line__controls">
            <button type="button" class="cart-qty-minus" aria-label="Decrease quantity">−</button>
            <span>${qty}</span>
            <button type="button" class="cart-qty-plus" aria-label="Increase quantity">+</button>
          </div>
          <button type="button" class="cart-line__remove" aria-label="Remove item">✕</button>
        </div>
      `;
    }).join("");
  }

  cartCountEl.textContent = cartItemCount();
  cartTotalEl.textContent = formatPrice(cartTotalAmount());
}

/* --------------------------------------------------------------------------
   CART ACTIONS
   -------------------------------------------------------------------------- */
function setQuantity(id, qty) {
  if (qty <= 0) {
    delete cart[id];
  } else {
    cart[id] = qty;
  }
  renderProducts();
  renderCart();
}

function addToCart(id) {
  setQuantity(id, (cart[id] || 0) + 1);
}

/* --------------------------------------------------------------------------
   CART DRAWER OPEN / CLOSE
   -------------------------------------------------------------------------- */
function openCart() {
  cartDrawer.classList.add("open");
  cartOverlay.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartOverlay.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
}

/* --------------------------------------------------------------------------
   WHATSAPP ORDER MESSAGE
   Builds a readable order summary and opens WhatsApp with it pre-filled.
   -------------------------------------------------------------------------- */
function buildWhatsAppMessage() {
  const entries = Object.entries(cart).filter(([, qty]) => qty > 0);
  const customerName = customerNameInput.value.trim() || "Customer";

  const lines = [
    `Hello ${CONFIG.STORE_NAME}! I'd like to place an order.`,
    ``,
    `*Name:* ${customerName}`,
    ``,
    `*Order details:*`,
  ];

  entries.forEach(([id, qty]) => {
    const product = getProduct(id);
    if (!product) return;
    const lineTotal = product.price * qty;
    lines.push(
      `- ${product.name} (${product.unit}) x${qty} — ${formatPrice(product.price)} each = ${formatPrice(lineTotal)}`
    );
  });

  lines.push(``, `*Total amount: ${formatPrice(cartTotalAmount())}*`);
  lines.push(``, `Please confirm availability and delivery time. Thank you!`);

  return lines.join("\n");
}

function sendWhatsAppOrder() {
  const entries = Object.entries(cart).filter(([, qty]) => qty > 0);
  if (entries.length === 0) {
    alert("Your cart is empty. Add a few items before ordering.");
    return;
  }

  const message = buildWhatsAppMessage();
  const url = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener");
}

/* --------------------------------------------------------------------------
   EVENT DELEGATION
   -------------------------------------------------------------------------- */
productGrid.addEventListener("click", (e) => {
  const addBtn = e.target.closest(".add-to-cart-btn");
  if (addBtn) {
    addToCart(addBtn.dataset.id);
    openCart();
    return;
  }

  const stepper = e.target.closest(".qty-stepper");
  if (stepper) {
    const id = stepper.dataset.id;
    if (e.target.closest(".qty-plus")) setQuantity(id, (cart[id] || 0) + 1);
    if (e.target.closest(".qty-minus")) setQuantity(id, (cart[id] || 0) - 1);
  }
});

cartItemsEl.addEventListener("click", (e) => {
  const line = e.target.closest(".cart-line");
  if (!line) return;
  const id = line.dataset.id;

  if (e.target.closest(".cart-qty-plus")) setQuantity(id, (cart[id] || 0) + 1);
  if (e.target.closest(".cart-qty-minus")) setQuantity(id, (cart[id] || 0) - 1);
  if (e.target.closest(".cart-line__remove")) setQuantity(id, 0);
});

cartToggle.addEventListener("click", openCart);
cartClose.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);
whatsappOrderBtn.addEventListener("click", sendWhatsAppOrder);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeCart();
});

if (newsletterForm) {
  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Thanks for subscribing! Newsletter signup will be connected in a future update.");
    newsletterForm.reset();
  });
}

/* --------------------------------------------------------------------------
   DEAL COUNTDOWN (visual only — resets on refresh)
   -------------------------------------------------------------------------- */
function startCountdown() {
  const hrsEl = document.getElementById("hrs");
  const minsEl = document.getElementById("mins");
  const secsEl = document.getElementById("secs");
  if (!hrsEl || !minsEl || !secsEl) return;

  let totalSeconds = 8 * 3600 + 34 * 60 + 22;

  setInterval(() => {
    if (totalSeconds <= 0) {
      totalSeconds = 8 * 3600 + 34 * 60 + 22; // loop the demo timer
    }
    totalSeconds--;

    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    hrsEl.textContent = String(h).padStart(2, "0");
    minsEl.textContent = String(m).padStart(2, "0");
    secsEl.textContent = String(s).padStart(2, "0");
  }, 1000);
}

/* --------------------------------------------------------------------------
   INIT
   -------------------------------------------------------------------------- */
function init() {
  renderProducts();
  renderCart();
  startCountdown();
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", init);
