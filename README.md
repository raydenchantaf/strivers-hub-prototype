# Strivers' Hub — Prototype 

A Next.js 15 prototype for the Strivers' Hub platform, built for The Asia Foundation / Mastercard Inclusive for Growth program.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
strivers-hub-prototype/
├── app/                        # Next.js App Router pages
│   ├── layout.tsx              # Root layout (Navbar + Footer wrapped)
│   ├── page.tsx                # Landing page
│   ├── assessment/page.tsx     # Self-assessment flow
│   ├── results/page.tsx        # Assessment results
│   └── resources/page.tsx      # Insights & Resources listing
│
├── components/
│   ├── Navbar.tsx              # Sticky mobile-friendly nav + language toggle
│   ├── Footer.tsx              # Site footer
│   ├── landing/                # Landing page section components
│   │   ├── Hero.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── Stats.tsx
│   │   ├── PartnerStrip.tsx
│   │   ├── CommunitySection.tsx
│   │   ├── CTABanner.tsx
│   │   └── InsightsGrid.tsx
│   └── assessment/
│       ├── AssessmentEngine.tsx  # Main multi-step form engine
│       └── ProgressBar.tsx
│
├── context/
│   └── LanguageContext.tsx     # EN/BM language switching + t() helper
│
├── data/
│   ├── questions.ts            # Bilingual assessment questions + scoring tiers
│   └── resources.ts            # Articles, events data
│
└── tailwind.config.ts          # Brand colors: primary (#D81B60), brand-dark, etc.
```

## Key Features

- **Bilingual (EN/BM)** — Language can be toggled at any point, including mid-assessment. Answers are preserved when switching languages.
- **Mobile-first** — All layouts are designed mobile-first with Tailwind. Navbar collapses to hamburger on small screens.
- **Self-Assessment Engine** — 10-question linear flow with radio-style selection, animated progress bar, and score-based category results.
- **Scoring tiers** — 4 tiers (Starter / Growth / Established / Advanced) with localised descriptions and next steps.
- **No backend needed for prototype** — Assessment score is stored in `sessionStorage` and read on the Results page.

## Swapping in Real Content

- **Questions**: Edit `data/questions.ts` — each question has `text.en`, `text.bm`, and `options` with point values.
- **Scoring tiers**: Edit the `scoreTiers` array in `data/questions.ts` — adjust `min`/`max` ranges and category descriptions.
- **UI strings**: All UI copy lives in `context/LanguageContext.tsx` under the `translations` object.
- **Resources/Articles**: Edit `data/resources.ts`.

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS 3**
- **No external UI library** — easy to hand off and extend

## Next Steps for Production

- [ ] Add a backend / API route to persist assessment responses (Supabase recommended)
- [ ] Add admin dashboard to view submissions
- [ ] Integrate real partner/event data via CMS (Contentful, Sanity, or Notion)
- [ ] Add authentication (NextAuth.js) for returning users
- [ ] Replace placeholder images with actual brand photography
