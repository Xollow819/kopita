# KOPI TA

KOPI TA is an editorial coffee experience for final-semester students. The website follows coffee from **hulu to hilir**, while connecting each stage with the journey of completing a thesis.

The site combines documentary coffee imagery, a restrained paper-and-forest visual system, bilingual Indonesian and English copy, product browsing, a persistent cart, and WhatsApp ordering.

## Experience

- Cinematic hero introducing the coffee and thesis journey
- Chapter navigation covering Hulu, Panen, Proses, Roast, Journey, Racik, and Hilir
- Editorial storytelling with documentary photography
- Responsive layouts for desktop, tablet, and mobile
- Indonesian and English localization
- Product cards for KOPI TA drinks
- Persistent shopping cart using browser storage
- Quantity controls and order totals
- WhatsApp checkout with a prefilled order message
- Lightweight looping GIF for the green-bean process section
- Reduced-motion support and keyboard-friendly cart interactions

## Project structure

```text
public/
├── index.html              # Page structure and content
├── style.css               # Design system, responsive layout, and motion rules
├── app.js                  # Localization, navigation, cart, and checkout logic
├── id-core.js              # Indonesian copy
├── en.js                   # English copy
└── assets/
    └── story/              # Optimized KOPI TA imagery and process GIF
```

## Run locally

The project is a static website with no build step or backend requirement.

```bash
python3 -m http.server 4175 --directory public
```

Then open [http://localhost:4175](http://localhost:4175).

## Ordering

Products can be added to the cart from the Racik section. The cart stores its state in `localStorage` and prepares a WhatsApp message containing:

- Product names
- Quantities
- Order total
- Name field
- Pickup time field

Update the WhatsApp number in `public/app.js` and the footer link in `public/index.html` if the ordering contact changes.

## Assets

The story imagery is stored in `public/assets/story/`. The process animation is delivered as an optimized GIF so it can run without loading the original camera video file in the browser.

## Deployment

The site can be deployed as a static project through Vercel, GitHub Pages, or another static hosting provider. The production branch is `main`.
