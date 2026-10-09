# StyleSync – Smart Outfit Planner

> An elegant, responsive, individual web application designed to curate wardrobes, eliminate morning styling hesitation, and generate coherent, rule-based outfit recommendations based on dress codes, color harmony, and weather.

**Author:** [Pavani295](https://github.com/Pavani295)  
**Live Repository:** [StyleSync – Smart Outfit Planner](https://github.com/Pavani295)  

---

## 🌟 Overview & Key Highlights

**StyleSync** is a luxury-inspired personal wardrobe management and outfit recommendation platform built entirely with **React.js 19**, **Vite**, **Modern CSS3**, and a **client-side local JSON dummy database** persisted through browser `localStorage`.

Unlike black-box artificial intelligence, StyleSync uses a **transparent, deterministic, rule-based styling engine** grounded in color theory, garment silhouette compatibility, and occasion dress codes.

---

## ✨ Features

### 1. Website Design & Experience
- **Luxury Editorial Aesthetic:** Warm cream canvas (`#FAF8F5`), heritage champagne accents (`#B88E52`), and serif editorial typography (`Playfair Display` + `Plus Jakarta Sans`).
- **Responsive Architecture:** Pixel-perfect layouts for desktop, tablet, and mobile devices with a slide-out navigation drawer.
- **Graceful Fallbacks:** Built-in `ImageWithFallback` component that catches image loading failures and displays an elegant styled fashion placeholder.
- **Interactive Micro-Interactions:** Subtle card elevations, zoom-on-hover effects, and celebration confetti on outfit bookmarking.

### 2. Comprehensive Clothing Collection (72 Sample Items)
Contains rich, realistic sample items covering all 8 required categories (with at least 8 items each):
- **A. Tops (9 items):** Classic Oxford shirts, oversized graphic tees, chiffon wrap blouses, square-neck crop tops, ribbed tanks, cable knit sweaters, fleece hoodies, embroidered tunics, and satin silk shirts.
- **B. Bottoms (9 items):** High-waist wide-leg jeans, pleated tailored trousers, formal slim pants, seamless leggings, pleated midi skirts, linen resort shorts, flared palazzos, belted wide-leg pants, and raw-hem straight denims.
- **C. Traditional Indian Wear (10 items):** Royal Banarasi silk sarees, Chanderi embroidered kurtis, floral organza salwar suits, bridal velvet lehengas, floor-length flared anarkalis, raw silk kurta pajamas, regal brocade sherwanis, South-Indian dhoti sets, and coordinated ethnic sets.
- **D. Western Wear (9 items):** Little black cocktail dresses, bohemian floral maxi dresses, gala satin evening gowns, utility chic jumpsuits, washed linen rompers, tweed houndstooth co-ord sets, double-breasted power blazers, and two-piece formal suits.
- **E. Outerwear (8 items):** Distressed denim jackets, camel double-breasted trench coats, faux leather moto biker jackets, ribbed longline cardigans, lightweight puffer jackets, varsity bomber jackets, and wool pea coats.
- **F. Footwear (9 items):** Minimalist white leather sneakers, performance cushioned running shoes, pointed stiletto pumps, leather penny loafers, handcrafted zari juttis, lug-sole Chelsea boots, flat slide sandals, and block-heel sandals.
- **G. Accessories (10 items):** Structured Saffiano tote bags, canvas campus backpacks, quilted crossbody sling bags, rose-gold mesh watches, Kundan choker & earring sets, gold hoop earrings, layered coin necklaces, reversible leather belts, printed silk scarves, and cat-eye sunglasses.
- **H. Activewear and Sleepwear (8 items):** Athletic tracksuits, seamless yoga sets, pure cotton night suits, satin kimono robes, quick-dry running shorts & tees, flannel plaid pyjamas, workout rompers, and plush fleece lounge robes.

### 3. Digital Wardrobe Management
- **Search & Multi-Filter Engine:** Instant real-time search by item name, subcategory, or description.
- **Category Filter Pills:** One-click filtering across all 8 core categories.
- **Advanced Filters Drawer:** Filter by Colour, Occasion, Style Vibe, Season, and Price (Low to High / High to Low).
- **Custom Garment Creation:** Add custom garments with full validation, live image preview, and preset quick-pick image gallery.
- **Edit & Delete:** Update specifications or remove items with confirmation dialogs.
- **Detailed Modal View:** Inspect high-resolution garments with detailed specs and a 1-click shortcut to "Plan Outfits With This".

### 4. Rule-Based Outfit Recommendation Engine
- **Transparent Logic:** Deterministic pairing algorithms combining:
  1. *Silhouette Coherence:* Pairs separates (Top + Bottom) or recognizes complete standalone ensembles (Sarees, Lehengas, Gowns, Jumpsuits) without mismatched bottoms.
  2. *Color Harmony:* Validates harmonious color palettes (neutrals, complementary pairs, and monochromatic styling).
  3. *Occasion Matching:* Enforces appropriate dress codes for College, Office, Interview, Party, Wedding, Festival, Traditional Events, Sports, Travel, and Date Night.
  4. *Seasonal Appropriateness:* Layers outerwear (jackets, cardigans, trench coats) when winter/chilly weather is detected.
- **"Why This Works" Justification:** Detailed breakdown of why each recommended combination is harmonious.
- **No Incompatible Mixes:** Enforces category mutual exclusions (e.g., will never pair a Saree or Lehenga with jeans or gym sneakers).
- **One-Click Favourites:** Save outfits directly with instant feedback and duplicate prevention.

### 5. Favourites & Lookbook
- Persistent saved outfits in `localStorage`.
- Comprehensive outfit modal view showcasing every piece, occasion tags, and styling reasoning.
- Safe deletion and "Clear All" with confirmation safeguard.

### 6. Wardrobe Analytics Dashboard
- **Dynamic Metrics:** Total wardrobe count, active category count, saved favourites, and total estimated collection value in ₹.
- **Category Distribution:** Visual progress bars displaying item count and percentage share.
- **Occasion Suitability:** Event-by-event breakdown showing wardrobe versatility.
- **Colour Palette Swatches:** Visual color circles representing palette distribution.
- **Seasonal Readiness:** Summer, Winter, and All-Season readiness metrics.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React.js 19 (Hooks, Functional Components, Strict Mode) |
| **Build Tool & Bundler** | Vite 8 |
| **Styling** | Custom Modern CSS3 with CSS Variables, Flexbox, CSS Grid & Glassmorphism |
| **Typography** | Google Fonts (`Playfair Display` + `Plus Jakarta Sans`) |
| **Icons** | `lucide-react` |
| **Celebrations** | `canvas-confetti` |
| **Database & Persistence** | Local JSON Dummy Database (`src/data/clothes.json`) + Browser `localStorage` |

---

## 📂 Project Structure

```
TraceX/
├── index.html                     # HTML5 Entry with Google Fonts & metadata
├── package.json                   # Dependencies and npm scripts
├── vite.config.js                 # Vite configuration with relative base './'
├── README.md                      # Comprehensive documentation
├── src/
│   ├── main.jsx                   # React mounting point
│   ├── App.jsx                    # Root component, state & modal orchestration
│   ├── index.css                  # Global variables, typography, and resets
│   ├── App.css                    # Component styling & responsive media queries
│   ├── data/
│   │   └── clothes.json           # 72 curated sample items across 8 categories
│   ├── utils/
│   │   ├── storage.js             # LocalStorage & JSON merge utility
│   │   └── outfitEngine.js        # Deterministic rule-based matching engine
│   ├── components/
│   │   ├── Navbar.jsx             # Responsive navigation with favorites counter
│   │   ├── Footer.jsx             # Footer with author links and tech badges
│   │   ├── ImageWithFallback.jsx  # Error-resilient image loader
│   │   ├── ClothingCard.jsx       # Individual wardrobe card with actions
│   │   ├── ClothingDetailsModal.jsx # Large preview modal & quick-plan trigger
│   │   ├── AddEditClothingModal.jsx # Form validation with live preview
│   │   └── Toast.jsx              # Toast notification system
│   └── pages/
│       ├── Home.jsx               # Hero, spotlight look, and categories
│       ├── Wardrobe.jsx           # Filterable closet and search interface
│       ├── OutfitPlanner.jsx      # Rule-based outfit matching engine
│       ├── Favourites.jsx         # Bookmarked lookbook collection
│       └── Dashboard.jsx          # Wardrobe analytics and visual charts
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended, tested on Node v24)
- npm (v9 or higher)

### Installation
```bash
# Clone the repository
git clone https://github.com/Pavani295/StyleSync.git

# Navigate into project directory
cd StyleSync

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will start at `http://localhost:5173`.

### Production Build
```bash
npm run build
```
Creates an optimized production bundle inside the `dist/` directory.

### Preview Production Build
```bash
npm run preview
```

---

## 🌐 Deployment

### Deploying to Vercel
1. Push your repository to GitHub.
2. Sign in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository (`StyleSync`).
4. Select the **Vite** framework preset (Build Command: `npm run build`, Output Directory: `dist`).
5. Click **Deploy**.

### Deploying to GitHub Pages
1. The project has already configured `base: './'` in `vite.config.js` for compatibility with subpaths.
2. Run `npm run build`.
3. Push the `dist/` folder to the `gh-pages` branch or configure GitHub Actions to deploy static pages from the `dist` folder.

---

## 📄 License & Attribution

Crafted for personal and portfolio demonstration by **[Pavani295](https://github.com/Pavani295)**.  
Released under the **MIT License**.
