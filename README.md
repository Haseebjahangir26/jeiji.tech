# jeiji.tech — Developer Portfolio

Personal developer portfolio website for **Haseeb Jahangir (JJ)** — Computer Science student at COMSATS University Islamabad, aspiring AI/ML engineer, and software developer.

Live Domain: **[https://jeiji.tech](https://jeiji.tech)**

---

## 🌟 Features

- **Design System & Aesthetics**: Dark editorial-technical aesthetic with carbon black surfaces (`#080808`, `#111110`), warm alabaster typography (`#F4F0EA`), terracotta orange accents (`#D96B43`), hairline blueprint grids, and interactive particle mesh physics.
- **Theme Switcher**: Dark / light mode toggle with system preference detection and `localStorage` persistence.
- **Hero & Interactive Terminal**: Animated typewriter terminal simulating developer workflows (ML training, git commands, notebook sessions) with automatic `prefers-reduced-motion` accessibility support.
- **Centralized Content Architecture**: All portfolio data (projects, skills, coursework, profile) is separated into `src/data/portfolio.js` so you can update anything without touching markup or CSS.
- **Dynamic Projects Showcase**: Project cards rendered dynamically with category filtering (`All`, `Machine Learning`, `Web / Data`), GitHub links, tags, and status badges.
- **Technical Skills Matrix**: Categorized grid (Programming, Data Science & ML, Backend & Web, Mobile, Analytics, Tools) with modern SVG iconography.
- **Education & Coursework**: Highlighting BSCS at COMSATS University Islamabad and core CS curriculum.
- **Production Performance & SEO**:
  - Full Open Graph and Twitter Card social preview metadata
  - High-resolution custom OG banner (`public/og-image.jpg`)
  - Semantic HTML5 structure with landmark roles and skip-to-content navigation
  - Accessible contrast ratios and touch-friendly targets (44px+)
  - Custom branded 404 page (`public/404.html`)
  - Search engine indexing assets (`robots.txt`, `sitemap.xml`)
  - Sub-100ms build times via Vite 8

---

## 🛠️ Tech Stack

- **Core**: HTML5, Vanilla JavaScript (ES Modules)
- **Styling**: Vanilla CSS Design System with CSS Custom Properties
- **Build Tool**: [Vite](https://vitejs.dev/) v8
- **Hosting / Deployment**: [Vercel](https://vercel.com/) (Static Web Application)

---

## 📁 Project Structure

```text
jeiji.tech website/
├── public/
│   ├── 404.html          # Custom styled 404 error page
│   ├── favicon.svg       # Branded vector SVG favicon
│   ├── og-image.jpg      # High-res social preview image (1200x630)
│   ├── robots.txt        # Search crawler directives
│   └── sitemap.xml       # SEO sitemap
├── src/
│   ├── data/
│   │   └── portfolio.js  # Centralized portfolio content & config
│   ├── js/
│   │   └── main.js       # App logic (themes, filters, animations)
│   └── styles/
│       └── index.css     # CSS design tokens, reset, & component styles
├── index.html            # Main semantic HTML template
├── package.json          # Dependencies & scripts
├── vercel.json           # Vercel configuration & security headers
├── vite.config.js        # Vite bundler configuration
├── .gitignore            # Git ignore rules
└── README.md             # Documentation & deployment guide
```

---

## 🚀 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) v18+ (verified on v24.13.0)
- npm v9+

### Commands

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

3. **Build for production**:
   ```bash
   npm run build
   ```
   Outputs production-optimized bundle to the `dist/` directory.

4. **Preview production build**:
   ```bash
   npm run preview
   ```

---

## ✏️ How to Update Portfolio Content

All your data is cleanly separated from code in `src/data/portfolio.js`:

### 1. Update Contact Email & Socials
Open `src/data/portfolio.js` and edit the `siteConfig` object:
```javascript
export const siteConfig = {
  name: "Haseeb Jahangir",
  displayName: "JJ",
  email: "your-actual-email@gmail.com", // <-- Update here
  github: "https://github.com/haseebjahangir26",
  linkedin: "https://linkedin.com/in/your-profile", // <-- Add when ready
  location: "Islamabad, Pakistan",
};
```

### 2. Add or Edit Projects
Add a new object to the `projects` array in `src/data/portfolio.js`:
```javascript
{
  id: "project-slug",
  title: "Project Title",
  subtitle: "Category or Short Subtitle",
  description: "2-3 sentences explaining what it does and the impact.",
  technologies: ["Python", "TensorFlow", "FastAPI"],
  category: "ml", // 'ml' | 'web' | 'mobile'
  status: "completed", // 'completed' | 'in-progress'
  github: "https://github.com/haseebjahangir26/your-repo",
  demo: "https://your-demo.com",
  featured: true,
}
```

### 3. Update Skills or Coursework
Modify the `skills` array or `education.coursework` array in the same file. The site re-renders automatically!

---

## 🚢 Deploying to Production (jeiji.tech)

### Method 1: Git + Vercel Dashboard (Recommended)

1. **Push your repository to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "feat: complete jeiji.tech portfolio website"
   git branch -M main
   git remote add origin https://github.com/haseebjahangir26/jeiji.tech.git
   git push -u origin main
   ```

2. **Connect to Vercel**:
   - Log in to [Vercel](https://vercel.com).
   - Click **Add New...** → **Project**.
   - Select your `jeiji.tech` GitHub repository.
   - Framework Preset: **Vite** (auto-detected).
   - Click **Deploy**.

3. **Attach Custom Domain (`jeiji.tech`)**:
   - In Vercel Project Settings → **Domains**:
   - Enter `jeiji.tech` and click **Add**.
   - Select the recommended option to also add `www.jeiji.tech` with redirect.

4. **DNS Configuration at Your Domain Registrar**:
   Add the following DNS records where you bought `jeiji.tech`:
   | Type | Name | Value | TTL |
   |------|------|-------|-----|
   | **A** | `@` | `76.76.21.21` | Automatic / 300 |
   | **CNAME** | `www` | `cname.vercel-dns.com.` | Automatic / 300 |

   *Vercel will automatically issue a free Let's Encrypt SSL/TLS certificate within minutes.*

---

### Method 2: Vercel CLI

Run directly in the project directory:
```bash
# Preview deployment
npx vercel

# Production deployment
npx vercel --prod
```

---

## 📄 License

MIT © [Haseeb Jahangir](https://jeiji.tech)
