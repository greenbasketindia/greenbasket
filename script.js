/* ================= CONFIG ================= */
const WHATSAPP_NUMBER = "919772821229"; // country code + number, no + or spaces

/* ================= PRODUCT DATA ================= */
const products = [
  {
    name: "Tomato",
    unit: "1 kg",
    price: 20,
    mrp: 30,
    off: 33,
    img: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=300&q=80"
  },
  {
    name: "Potato",
    unit: "1 kg",
    price: 18,
    mrp: 25,
    off: 28,
    img: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=300&q=80"
  },
  {
    name: "Cucumber",
    unit: "1 kg",
    price: 16,
    mrp: 22,
    off: 27,
    img: "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&w=300&q=80"
  },
  {
    name: "Green Capsicum",
    unit: "1 kg",
    price: 40,
    mrp: 60,
    off: 33,
    img: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=300&q=80"
  },
  {
    name: "Banana",
    unit: "1 dozen",
    price: 28,
    mrp: 40,
    off: 30,
    img: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=300&q=80"
  },
  {
    name: "Apple",
    unit: "1 kg",
    price: 110,
    mrp: 150,
    off: 27,
    img: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=300&q=80"
  }
];

/* ================= RENDER PRODUCTS ================= */
function waLink(product) {
  const msg = `Hi Green Basket, I'd like to order:\n${product.name} (${product.unit}) - ₹${product.price}\n\nPlease confirm availability & delivery slot.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

function renderProducts() {
  const grid = document.getElementById("productGrid");
  if (!grid) return;
  grid.innerHTML = products
    .map(
      (p) => `
    <div class="product-card">
      <span class="product-card__badge">-${p.off}%</span>
      <img src="${p.img}" alt="${p.name}" loading="lazy">
      <h4>${p.name}</h4>
      <span class="unit">${p.unit}</span>
      <div class="price">
        <strong>₹${p.price}</strong>
        <del>₹${p.mrp}</del>
      </div>
      <a class="add-btn" href="${waLink(p)}" target="_blank" rel="noopener">🛒 Add to Cart</a>
    </div>`
    )
    .join("");
}
renderProducts();

/* ================= COUNTDOWN TIMER ================= */
function startCountdown() {
  let end = new Date();
  end.setHours(end.getHours() + 8, end.getMinutes() + 34, end.getSeconds() + 22);

  const thEl = document.getElementById("th");
  const tmEl = document.getElementById("tm");
  const tsEl = document.getElementById("ts");
  if (!thEl) return;

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  setInterval(() => {
    const now = new Date();
    let diff = Math.max(0, end - now);
    if (diff <= 0) {
      end = new Date();
      end.setHours(end.getHours() + 8);
    }
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    thEl.textContent = pad(h);
    tmEl.textContent = pad(m);
    tsEl.textContent = pad(s);
  }, 1000);
}
startCountdown();

/* ================= MOBILE NAV ================= */
const hamburger = document.getElementById("hamburger");
const nav = document.getElementById("nav");
if (hamburger && nav) {
  hamburger.addEventListener("click", () => {
    const isOpen = nav.style.display === "flex";
    nav.style.display = isOpen ? "none" : "flex";
    nav.style.flexDirection = "column";
    nav.style.position = "absolute";
    nav.style.top = "100%";
    nav.style.left = "0";
    nav.style.right = "0";
    nav.style.background = "#fff";
    nav.style.padding = "16px 24px";
    nav.style.borderBottom = "1px solid #e4ece3";
    nav.style.gap = "14px";
  });
}

/* ================= PIN CODE CHECK ================= */
const pinBtn = document.getElementById("pinBtn");
if (pinBtn) {
  pinBtn.addEventListener("click", () => {
    const msg = "Hi Green Basket, please confirm if you deliver to my pin code / area.";
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  });
}

/* ================= NEWSLETTER (front-end only, backend to be connected) ================= */
const subscribeForm = document.getElementById("subscribeForm");
if (subscribeForm) {
  subscribeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = e.target.querySelector("input[type=email]").value;
    // TODO: connect to backend/newsletter API later
    alert(`Thanks for subscribing! We'll send offers to ${email}.\n(Backend not connected yet.)`);
    e.target.reset();
  });
}

/* ================= FOOTER YEAR ================= */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();
