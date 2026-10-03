# Sagar M Kalagudi — Portfolio

Personal portfolio website showcasing my work in AI/ML, full-stack development, and software engineering.

## Links

- **Live website:** [portfolio-smoky-sigma-40.vercel.app](https://portfolio-smoky-sigma-40.vercel.app/)
- **GitHub:** [github.com/SagarMk07](https://github.com/SagarMk07)
- **LinkedIn:** [linkedin.com/in/sagar-kalagudi-b375163a2](https://www.linkedin.com/in/sagar-kalagudi-b375163a2/)

## About

Sagar M Kalagudi is an AI & ML Developer pursuing a B.E. in Artificial Intelligence & Machine Learning. His work explores AI/ML and full-stack development through practical software products, from intelligent workflows to the interfaces people use.

## Featured projects

### MedAssist AI

An AI-powered healthcare assistant combining symptom-related interaction, OCR, and supporting healthcare features.

**Technologies:** React, AI/ML, Computer Vision, OCR, Supabase

### SmartShopper Guardian AI

A browser extension concept for product and review analysis with price comparison context for online shopping.

**Technologies:** Browser Extension, JavaScript / TypeScript, AI, Product Analysis, Review Analysis, Price Comparison

### AI Personalized Trip Planner

A travel planning platform connecting user preferences, AI-generated itineraries, and mapped destinations.

**Technologies:** React, Node.js, Gemini / Vertex AI, Firebase, Google Maps

### AI-Based Rainwater Harvesting Recommendation System

A recommendation system concept applying machine learning and data analysis to rainwater harvesting inputs.

**Technologies:** Python, Machine Learning, Data Analysis, Recommendation System

## Tech stack

### Portfolio implementation

- **Languages:** TypeScript, JavaScript, HTML, CSS
- **Frontend:** React 19, React Router 7, Tailwind CSS 4
- **Motion and UI:** Framer Motion, Lucide React
- **Build:** Vite 7, TypeScript
- **External data:** GitHub REST API for public profile and repository information, with a fallback when requests are unavailable

### Technologies featured in the portfolio

These are the technologies represented in the portfolio's stack section and project descriptions; they are not all dependencies of the portfolio website itself.

| Category | Technologies |
| --- | --- |
| Languages | Python, C++, TypeScript, Kotlin, JavaScript |
| Frontend | React, HTML, CSS, Tailwind CSS |
| Backend | Node.js, REST APIs |
| AI / ML | Machine Learning, Computer Vision, Generative AI, AI APIs |
| Database / Cloud | Supabase, Firebase, Firestore |
| Tools | Git, GitHub, VS Code |

## Portfolio features

- Dark, responsive editorial interface with an oversized typographic hero and technical grid
- Project showcases with custom-built illustrative artwork and individual case-study routes
- Case-study sections for each project's overview, problem, approach, system, implementation, result, and lessons
- GitHub profile and repository information loaded from the public GitHub API, with a graceful fallback
- Framer Motion reveals, reduced-motion support, and a desktop-only custom cursor
- Responsive navigation with a compact mobile menu
- Keyboard-visible focus styles and semantic page structure

## Project structure

```text
public/
├── favicon.svg
├── robots.txt
└── sitemap.xml
src/
├── components/
│   ├── CaseStudySection.tsx
│   ├── CustomCursor.tsx
│   ├── GitHubActivity.tsx
│   ├── LineReveal.tsx
│   ├── Navigation.tsx
│   ├── ProjectArtwork.tsx
│   ├── ProjectDetail.tsx
│   ├── ProjectRow.tsx
│   ├── ScrollReveal.tsx
│   ├── SectionHeading.tsx
│   ├── SystemFlow.tsx
│   └── TechnologyList.tsx
├── data/
│   ├── projects.ts
│   └── stack.ts
├── lib/
│   └── motion.ts
├── App.tsx
├── main.tsx
└── styles.css
```

## Local development

Requirements: Node.js and npm.

```bash
git clone https://github.com/SagarMk07/Portfolio-.git
cd Portfolio-
npm install
npm run dev
```

Open the local URL printed by Vite, typically [http://localhost:5173](http://localhost:5173/).

## Production build

```bash
npm run build
npm run preview
```

The build runs the TypeScript project checks and creates the production bundle in `dist/`. The preview command serves that bundle locally, typically at [http://localhost:4173](http://localhost:4173/).

## Deployment

The portfolio is deployed on Vercel: [portfolio-smoky-sigma-40.vercel.app](https://portfolio-smoky-sigma-40.vercel.app/).

## Environment variables

No environment variables are required. GitHub profile and repository data is requested from the public GitHub REST API without an API key; if the request fails or is rate-limited, the portfolio displays fallback content.

## Design philosophy

The interface uses an immersive dark surface, oversized typography, a minimal editorial layout, a subtle technical grid, and a restrained lime accent. Motion supports navigation and storytelling while respecting reduced-motion preferences.

## Author

**Sagar M Kalagudi** — AI & ML Developer

- **GitHub:** [github.com/SagarMk07](https://github.com/SagarMk07)
- **LinkedIn:** [linkedin.com/in/sagar-kalagudi-b375163a2](https://www.linkedin.com/in/sagar-kalagudi-b375163a2/)
- **Portfolio:** [portfolio-smoky-sigma-40.vercel.app](https://portfolio-smoky-sigma-40.vercel.app/)
