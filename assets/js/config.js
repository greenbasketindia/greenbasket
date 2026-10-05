/**
 * GreenBasket - Central Configuration
 * ------------------------------------------------------------
 * Ye website ki ek hi settings file hai.
 * WhatsApp number, brand details aur product data ka source
 * yahin se change hoga. Baaki code mein kuch hardcode nahi hoga.
 */

window.GREENBASKET_CONFIG = {
  /* ---------- Brand ---------- */
  brand: {
    name: "GreenBasket",
    tagline: "Freshness You Can Trust.",
    serviceArea: "Hanumangarh & nearby areas" // apna actual service area yahan likh dena
  },

  /* ---------- WhatsApp ---------- */
  whatsapp: {
    // Country code (91) + number. Plus sign ya spaces nahi.
    number: "919772821229",

    // Generic button ke liye message (product select na ho tab)
    generalMessage:
      "Hi GreenBasket 👋\n\nI would like to place an order.\nPlease share today's availability and prices.",

    // Product card ke liye message template.
    // {product} aur {quantity} automatically replace honge.
    productMessage:
      "Hi GreenBasket 👋\n\nI want to order:\nProduct: {product}\nQuantity: {quantity}\n\nPlease share today's price and availability."
  },

  /* ---------- Product Data ---------- */
  products: {
    // "sheet" = Google Sheet (admin yahin se update karega)
    // "local" = data/products.json (fallback / testing)
    source: "local",

    // Google Sheet ka "Publish to web" CSV link yahan aayega (baad ke step mein)
    sheetCsvUrl: "",

    // Local fallback file
    localJsonUrl: "data/products.json"
  },

  /* ---------- Categories ---------- */
  categories: ["Fruits", "Vegetables", "Leafy Greens", "Seasonal Produce"],

  /* ---------- Default quantity options ---------- */
  quantityOptions: ["500 g", "1 kg", "2 kg", "5 kg"]
};
