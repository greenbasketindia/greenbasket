// ===== Config =====
const WHATSAPP_NUMBER = "919772821229"; // country code + number, no + or spaces

// ===== Mobile nav toggle =====
const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");

if (navToggle && mainNav) {
  navToggle.addEventListener("click", () => {
    mainNav.classList.toggle("open");
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => mainNav.classList.remove("open"));
  });
}

// ===== Per-product WhatsApp order buttons =====
document.querySelectorAll("[data-wa]").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".product-card");
    if (!card) return;

    const name = card.dataset.name || "this item";
    const unit = card.dataset.unit || "";
    const price = card.dataset.price || "";

    const message =
      `Hi GreenBasket India! I'd like to order:\n` +
      `${name} (${unit}) - ₹${price}\n\n` +
      `Please confirm availability and delivery time.`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener");
  });
});

// ===== Fake "today's list refreshes in" countdown =====
// Purely cosmetic — counts down to midnight, resets daily. No backend involved.
function updateCountdown() {
  const el = document.getElementById("countdownTimer");
  if (!el) return;

  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);

  const diff = midnight - now;
  const hours = String(Math.floor(diff / 3600000)).padStart(2, "0");
  const mins = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
  const secs = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");

  el.textContent = `${hours}:${mins}:${secs}`;
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ===== Footer year =====
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();
