/* =========================================================
   GREENBASKET — MAIN JAVASCRIPT
   Frontend Phase
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    // Current year
    const year = document.querySelector("#year");

    if (year) {
        year.textContent = new Date().getFullYear();
    }

    // Mobile menu
    const menuButton = document.querySelector("#menuButton");
    const navLinks = document.querySelector(".nav-links");

    if (menuButton && navLinks) {
        menuButton.addEventListener("click", () => {
            navLinks.classList.toggle("mobile-open");
        });
    }

    // Demo cart count
    let cartCount = Number(localStorage.getItem("greenbasketCartCount")) || 0;

    const cartCounters = document.querySelectorAll(".cart-count");

    function updateCartCount() {
        cartCounters.forEach(counter => {
            counter.textContent = cartCount;
        });
    }

    updateCartCount();

    // Add to cart buttons
    document.querySelectorAll(".add-btn").forEach(button => {

        button.addEventListener("click", () => {

            cartCount++;

            localStorage.setItem(
                "greenbasketCartCount",
                cartCount
            );

            updateCartCount();

            button.textContent = "✓";

            setTimeout(() => {
                button.textContent = "+";
            }, 900);
        });

    });

});
