# FRAMD: Premium Poster Store

Welcome to the **FRAMD** poster store project! This repository contains a beautifully designed, high-performance storefront for premium wall art. 

If you are new to the project or looking to manage this website, this guide will walk you through everything you need to know.

---

## 📂 Project Structure

This project has been intentionally kept simple and modular so it is easy to understand without needing a complex backend or build system.

- **`index.html`**: The main structure (skeleton) of the website. This contains the layout, text, and product frames.
- **`style.css`**: The design system (clothing) of the website. This sets the premium light theme colors, spacing, typography, and beautiful interactions/animations.
- **`prices.js`**: ⭐ **The price configuration file.** Edit this to change ANY product price without touching the rest of the code.
- **`images.js`**: 📸 **The image configuration file.** Point each product to its photo file here. No HTML editing needed.
- **`assets/`**: The folder where all product photos are stored. Drop your `.jpg` / `.png` files here.
- **`script.js`**: The interativity logic (muscles) of the website. This handles the floating shopping bag count, scroll-based "reveal" animations, and toast notifications.

---

## 📸 How to Add Your Own Photos

1. **Drop your image** into the `assets/` folder (e.g. `assets/my-poster.jpg`).
2. **Open `images.js`** and set:
```js
"Orbital Serenity": {
    src: "assets/my-poster.jpg",   // ← point to your file
    alt: "My custom poster",
},
```
3. **Refresh the page** — your photo replaces the placeholder automatically.

> **To remove a photo** and go back to a placeholder: set `src: ""` or `src: null`.


---

## 💰 How to Change Prices

Open **`prices.js`** — it's the only file you ever need to touch for pricing. It looks like this:

```js
const PRICES = {
    "Orbital Serenity": {
        default: "A4",   // Which size is pre-selected when the page loads
        A5: 199,         // ← Change these numbers to update the price
        A4: 249,
        A3: 349,
    },
    "Grand Prix 2025": { ... },
    ...
};
```

- **To change a price**: Just update the number next to the size (`A5`, `A4`, `A3`).
- **To change the default selected size**: Update the `default` field (e.g., `"A3"`).
- The website will automatically pick up the new prices the next time the page is refreshed — **no other file needs to be changed.**


---

## 🎨 How to Customize the Design

### Changing the Theme Colors
At the very top of `style.css`, you will find a `:root` block containing the CSS Variables for the entire color theme. We currently use a premium "light/alabaster" aesthetic. 

To create a new theme or tweak colors, simply modify these HEX codes:

```css
:root {
    --bg: #fdfbf7;      /* Main background color */
    --ink: #1a1a1a;     /* Primary text color / Deep charcoal */
    --accent: #b48c56;  /* Accent color (buttons, italics, badges) / Warm brass */
    --cream: #ffffff;   /* Pure white (used for cards to contrast background) */
}
```

> **Tip:** If you adjust `--ink` or `--accent`, the styling on all pages, text, and buttons will adapt instantly!

---

## 🖼️ How to Manage Products

All products exist in pure HTML directly inside `index.html`. You do not need a database to update them for simple iterations.

### To swap a poster image:
Find the element with `class="mosaic-cell"` (for the top hero posters) or `class="product-card"` (for catalog products) in `index.html`. 

You'll see SVG placeholder art that looks like this:
```html
<svg width="400" height="600" viewBox="0 0 300 400" ...
```
To use an actual image, replace the `<svg>` block entirely with an image tag pointing to your real poster:
```html
<img src="assets/my-beautiful-poster.jpg" alt="Description" class="poster-art" />
```

### To change a product price/name:
Just search for `class="product-name"` or `class="product-price"` in `index.html` and type out the new values!

```html
<h3 class="product-name">Midnight Jazz</h3>
<div class="product-price"><span class="original">₹2,800</span> ₹1,499</div>
```

---

## 🚀 How to Run the Website

You don't need any special developer tooling to run this website!

1. Open the folder containing these files.
2. If you use VS Code, install the extension **Live Server**.
3. Right-click on `index.html` and click **"Open with Live Server"**.
4. The site will instantly launch in your browser, and it will auto-refresh whenever you save changes to the CSS, JS, or HTML pages!

---

## ✨ Features Automatically Handled

- **Scroll Reveals**: Any HTML element given the class `reveal` will gracefully slide into view as the user scrolls down the website. No extra code required.
- **Cart Interactions**: The `Add to Bag` button works immediately. When clicked, it updates the floating cart counter and displays a sleek toast notification.
- **Parallax Hero**: The big title on the homepage slightly shifts as you scroll, creating a dynamic, 3D-like depth effect. All managed flawlessly in `script.js`.
