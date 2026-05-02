# Md Arshyan Farooqui — Portfolio

A fully responsive, animated personal portfolio website built with **pure HTML, CSS, and vanilla JavaScript** — zero frameworks, max portability.

## ✨ Features

- **Dark theme** with deep navy/black background (`#0a0f1e`) and electric blue accents (`#1F5C99` / `#00d4ff`)
- **Glassmorphism** cards with frosted blur and subtle glowing borders
- **Animated** background (tsParticles linked network + CSS gradient blobs)
- **Custom cursor** with a glowing trail (auto-disabled on touch / reduced motion)
- **Page-load splash** intro animation
- **Sticky navbar** with blur backdrop and active-section highlighting
- **Fully mobile responsive** with a hamburger menu
- All animations respect `prefers-reduced-motion`

## 📐 Sections

1. **Hero** — animated typewriter (AI Developer, Full-Stack Engineer, Cybersecurity Enthusiast, Problem Solver), floating tech icons, CTAs
2. **About** — bio, animated avatar, count-up stats on scroll (CGPA 8.01, internships, projects, certs)
3. **Skills** — grouped pills (Languages, CS Fundamentals, SE, Cloud & Security, App Dev) with stagger pop-in
4. **Experience** — vertical animated timeline (Cybersecurity Intern @ Edunet / IBM)
5. **Projects** — glassmorphism cards with hover tilt + glow border (MedAssist)
6. **LeetCode Stats** — **live data** from [`leetcode-stats-api`](https://leetcode-stats-api.herokuapp.com/arshyan122), animated count-up cards, donut/ring breakdown chart
7. **Education** — B.Tech AI @ BBDEC (AKTU), 2022–2026, CGPA 8.01
8. **Certifications** — AI for India 2.0, Google Ads, Cyber Security & Ethical Hacking, JEE 2022
9. **Contact** — animated icon links (email, phone, LinkedIn, GitHub, LeetCode)

## 🔧 Tech / Libraries

- [Typed.js](https://github.com/mattboldt/typed.js) — typewriter hero effect
- [AOS](https://michalsnik.github.io/aos/) — scroll-triggered animations
- [Chart.js](https://www.chartjs.org/) — LeetCode difficulty donut chart
- [tsParticles](https://github.com/tsparticles/tsparticles) — animated linked-network background
- [Bootstrap Icons](https://icons.getbootstrap.com/) — icon font

All libraries are loaded from CDNs — no build step required.

## 🚀 Local development

This is a fully static site. No build, no toolchain.

```bash
# Clone
git clone https://github.com/arshyan122/portfolio.git
cd portfolio

# Serve any way you like — examples:
python3 -m http.server 8080
# or
npx serve .
```

Then open <http://localhost:8080>.

> **Note:** if you open `index.html` directly via `file://`, the LeetCode API fetch will still work (most browsers allow it) but you may run into CORS quirks for certain CDN scripts. Prefer running a local static server.

## 🌐 Deployment

The site is 100% static, so any static host works:

- **GitHub Pages** — push to `main`, enable Pages from the repo settings, point at `/ (root)`
- **Netlify / Vercel / Cloudflare Pages** — drag-and-drop or `git` integration; no build command required
- **S3 + CloudFront** — sync the folder to a bucket

## 📁 Structure

```
portfolio/
├── index.html       # Main markup
├── css/
│   └── style.css    # Theme + components + responsive rules
├── js/
│   └── main.js      # Splash, cursor, nav, typewriter, counters, LeetCode fetch + chart
├── assets/          # Resume PDF, etc.
└── README.md
```

## 📄 License

MIT — feel free to fork and adapt for your own portfolio (please replace personal info!).
