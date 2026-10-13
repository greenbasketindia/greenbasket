# GreenBasket

A premium fresh fruits and vegetables catalogue website for Hanumangarh.
Customers browse the products and place their order on WhatsApp. There is no
login, no checkout, no online payment and **no public prices**. The current
price is shared with the customer on WhatsApp.

Live site: https://greenbasketindia.github.io/greenbasket/

## How it works

1. The customer browses products on the website.
2. They tap **Order on WhatsApp**. WhatsApp opens on their own phone or computer
   with a pre-filled message (product list included) addressed to GreenBasket.
3. GreenBasket replies on WhatsApp with today's price and availability and
   confirms the order.

The website does not run any chatbot or order system. It only sends the customer
to GreenBasket's WhatsApp.

## Tech

Plain HTML, CSS and JavaScript. No framework, no build step, no dependencies.
Hosted free on GitHub Pages.

## Project structure

    index.html        Homepage (design, products and WhatsApp logic)
    about.html        About GreenBasket
    help.html         Help & Support (how to order, prices, service area, FAQ)
    privacy.html      Privacy Policy
    terms.html        Terms & Conditions
    404.html          Page shown for broken links
    images/images/    All photos used by the website
    README.md         This file

Every page keeps its own CSS inside the file, so a page never breaks because of
a missing stylesheet.

## Common tasks

### Change the WhatsApp number

The number is stored as `GREENBASKET_WHATSAPP_NUMBER` (country code + number, no
`+`, no spaces, for example `919772821229`). It currently appears in six files,
so change it in all of them:

- `index.html`
- `about.html`
- `help.html`
- `privacy.html`
- `terms.html`
- `404.html` (it is called `NUMBER` there)

### Add, edit or hide a product

Open `index.html` and find the `PRODUCTS` list near the bottom. Each product is
one line:

    {name:"Tomato",cat:"Vegetables",img:"images/images/p-tomato.jpg",unit:"1 kg",available:true},

- `name`: product name shown on the card
- `cat`: must match one of the category names in the `CATEGORIES` list
- `img`: path to the photo
- `unit`: for example `1 kg`, `1 dozen`, `Basket`
- `available`: `true` or `false` (`false` shows "Ask on WhatsApp")

Do **not** add prices to this list. Prices are never shown on the website.

### Add or replace a photo

Upload the image to `images/images/`. Use lowercase file names with no spaces,
for example `p-mango.jpg`. To replace a photo, upload a new file with the same
name. Keep images light (ideally under 200 KB) so the site stays fast.

### Update the website address

If the site moves to its own domain, update these in `index.html`: the
`canonical` link, the `og:url` and `og:image` tags, the `twitter:image` tag and
the structured data block in the `<head>`.

## Deployment

The site is served by GitHub Pages from the `main` branch, root folder. Every
commit to `main` goes live in about a minute. If an image or page looks old,
refresh with Ctrl+Shift+R.

## Planned: simple admin without editing code

Products will move to a Google Sheet so the owner can update the name, photo,
category, availability, description and (private) price without touching the
code. The price column will stay in the sheet and will never be shown on the
website.

## Notes

- Product photos and descriptions are for illustration. Fresh produce varies in
  size and colour.
- Keep the Privacy Policy and Terms in line with how the business actually works
  (delivery, replacements, data handling).
