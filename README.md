# Recovery Compass - Reclaim Your Clarity

> **A premium digital companion designed to guide users on their journey to a smoke-free life. Providing clarity, structure, and nervous system regulation through a "Warm Luxury" wellness aesthetic.**

---

## 📖 Overview

**Recovery Compass** is more than just a quit-smoking tool; it is a holistic wellness platform. It focuses on urge navigation, nervous system regulation, and structured daily programs to help users build lasting change.

This repository contains the source code for the **Phase 1 Marketing Launchpad**, which includes:
- A high-conversion **brand landing page**.
- An **interactive "Preview Experience"** (dashboard simulation) to demonstrate value.
- A **Waitlist System** for user acquisition.

The project differentiates itself from sterile "tech tools" by adopting a **"Warm Luxury"** design language, positioning itself alongside lifestyle wellness brands like *Calm* or *Attentive*.

---

## 🛠 Tech Stack

This project is built with a modern, performance-focused stack ensuring scalability and a premium user experience.

### Core Frameworks
- **[Next.js 16](https://nextjs.org/)** (App Router) - The React Framework for the Web.
- **[React 19](https://react.dev/)** - The library for web and native user interfaces.
- **[TypeScript](https://www.typescriptlang.org/)** - For type safety and developer experience.

### Styling & Design
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Utility-first CSS framework (configured with PostCSS).
- **[Framer Motion](https://www.framer.com/motion/)** - Production-ready animation library for React.
- **[Radix UI](https://www.radix-ui.com/)** - Unstyled, accessible components for building high-quality design systems.
- **[Lenis](https://lenis.studio/)** - Smooth scrolling library for a premium feel.
- **[Lucide React](https://lucide.dev/)** - Beautiful & consistent icons.

### Fonts
- **Satoshi** (Local) - Primary typeface for clean, modern readability.
- **Erode** - Secondary display typeface for headings and distinctive branding.
- **Dravica** - Used for specific brand elements.

---

## 📂 Project Structure

The project follows the standard Next.js App Router structure:

```
/web
├── app/                  # Main application routes and layouts
│   ├── layout.tsx        # Root layout with global providers
│   ├── page.tsx          # Landing page
│   └── globals.css       # Global styles and Tailwind imports
│
├── components/           # Reusable UI components & Sections
│   ├── ui/               # Atomic components (Buttons, Inputs, etc.)
│   ├── sections/         # Page sections (Hero, Philosophy, Problem, etc.)
│   ├── navbar.tsx        # Floating navigation bar
│   └── footer.tsx        # Application footer
│
├── public/               # Static assets
│   ├── fonts/            # Local font files (Satoshi)
│   └── images/           # Graphic assets
│
└── lib/                  # Utility functions and shared logic
```

---

## ✨ Key Features

### 1. "Warm Luxury" Design System
A custom aesthetic designed to feel calming and premium.
- **Color Palette:** Deep Forest, Sage Glaze.
- **Visuals:** Breathing Orb (Top Semicircle Gradient), Glassmorphic elements.
- **Navigation:** Floating Navbar with smooth transitions.

### 2. Interactive Sections
- **Dynamic Compass:** A unique "Back to Top" button that functions as a compass, reacting to scroll velocity.
- **Philosophy Section:** Animations explaining "Wave Regulation" and "Structure Path".
- **Testimonial Marquee:** Smooth scrolling user success stories with gradient fade effects.

### 3. App Preview Experience
A simulated dashboard environment allowing users to explore the app's potential without needing to sign up immediately.
- **Goal:** Showcase the value of tracking progress/savings instantly.

### 4. Waitlist Integration
- **Inline Newsletter Form:** Integrated into the CTA section and footer for seamless user capture.

---

## 🚀 Getting Started

To run the application locally:

### Prerequisites
- Node.js (v20+ recommended)
- npm, pnpm, or bun

### Installation

1.  Navigate to the project directory (if not already there).

2.  Install dependencies:
    ```bash
    npm install
    # or
    pnpm install
    ```

### Development Server

Start the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🚢 Deployment

The project is optimized for deployment on **Vercel**.

1.  Push code to your git repository.
2.  Import the project into Vercel.
3.  Vercel will automatically detect the Next.js framework and build settings.
4.  Deploy!

---

## 📄 License & Status

**Proprietary Software** - All rights reserved.
Current Phase: **Phase 1 Execution (Marketing Launchpad)**

*Built with intention by Shubh Khatri.*
