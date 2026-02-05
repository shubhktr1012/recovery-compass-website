# Recovery Compass - Reclaim Your Clarity

> **A premium digital companion designed to guide users on their journey to a smoke-free life. Providing clarity, structure, and nervous system regulation through a "Warm Luxury" wellness aesthetic.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

---

## 📖 Overview

**Recovery Compass** is more than just a quit-smoking tool; it is a holistic wellness platform. It focuses on urge navigation, nervous system regulation, and structured daily programs to help users build lasting change.

This repository contains the source code for the **Phase 1 Marketing Launchpad**, which includes:
- A high-conversion **brand landing page**.
- An **interactive "Preview Experience"** (dashboard simulation) to demonstrate value.
- A **Waitlist System** for user acquisition.

The project differentiates itself from sterile "tech tools" by adopting a **"Warm Luxury"** design language, positioning itself alongside lifestyle wellness brands like *Calm* or *Attentive*.

---

## 🌿 Branch: `concept-1`

This branch represents the primary development line for the marketing website, featuring:

### Recent Development Milestones
- **Scroll-Driven Animations:** Reworked Solution section with immersive scroll-driven effects.
- **Premium Hero Variants:** Multiple hero section concepts (`hero-omega`, `hero-variant-trust`).
- **Philosophy Section:** Interactive animations explaining "Wave Regulation" and "Structure Path".
- **Testimonials Marquee:** Smooth scrolling user success stories with gradient fade.
- **Dynamic Compass:** A unique "Back to Top" button that reacts to scroll velocity.
- **Explore Programs:** Pricing cards with Framer Motion animations.
- **Newsletter Integration:** Inline form in CTA and Footer sections.

---

## 🛠 Tech Stack

### Core Frameworks
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16 (App Router) | React Framework for the Web |
| **React** | 19 | UI Library |
| **TypeScript** | 5 | Type Safety |

### Styling & Design
| Technology | Purpose |
|------------|---------|
| **Tailwind CSS v4** | Utility-first CSS (PostCSS) |
| **Framer Motion** | Animation Library |
| **Radix UI** | Accessible Component Primitives |
| **Lenis** | Smooth Scrolling |
| **Lucide React** | Icon Library |

### Fonts
- **Satoshi** (Local) - Primary sans-serif typeface.
- **Erode** - Display typeface for headings.

---

## 📂 Project Structure

```
web/
├── app/                      # Next.js App Router
│   ├── layout.tsx            # Root layout with providers
│   ├── page.tsx              # Landing page
│   └── globals.css           # Global styles
│
├── components/
│   ├── ui/                   # Atomic components (Button, Input, etc.)
│   ├── sections/             # Page sections
│   │   ├── hero-omega.tsx    # Primary hero section
│   │   ├── problem.tsx       # Problem/Pain points section
│   │   ├── solution.tsx      # Solution section (scroll-driven)
│   │   ├── philosophy/       # Philosophy animations
│   │   ├── explore-programs.tsx
│   │   ├── testimonials/     # Testimonial marquee
│   │   ├── faq.tsx
│   │   └── cta.tsx           # Call-to-action with newsletter
│   ├── navbar.tsx            # Floating navigation
│   └── footer.tsx
│
├── public/
│   ├── fonts/                # Satoshi font files
│   └── images/               # Static assets
│
└── lib/                      # Utility functions
```

---

## ✨ Key Features

### 1. "Warm Luxury" Design System
- **Color Palette:** Deep Forest, Sage Glaze.
- **Visuals:** Breathing Orb gradient, Glassmorphic elements.
- **Navigation:** Floating Navbar with smooth transitions.

### 2. Interactive Sections
- **Dynamic Compass:** Back-to-top button that rotates based on scroll velocity.
- **Philosophy Animations:** "Wave Regulation" and "Structure Path" visualizations.
- **Testimonial Marquee:** Horizontal scroll with gradient edge fades.

### 3. App Preview Experience
Simulated dashboard to showcase app value without requiring sign-up.

### 4. Waitlist Integration
Inline newsletter form in CTA and footer for seamless user acquisition.

---

## 🚀 Getting Started

### Prerequisites
- Node.js v20+
- npm, pnpm, or bun

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## 🚢 Deployment

Optimized for **Vercel**:

1. Push to your git repository.
2. Import project into Vercel.
3. Vercel auto-detects Next.js and deploys.

---

## 📄 License

**Proprietary Software** - All rights reserved.

---

*Built with intention by Shubh Khatri.*
