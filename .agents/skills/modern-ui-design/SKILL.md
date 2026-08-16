---
name: modern-ui-design
description: Guidelines and best practices for creating stunning, modern, high-aesthetic web interfaces with dark mode, glassmorphism, vibrant gradients, fluid animations, and responsive typography.
---

# Modern UI & Design Systems Skill

This skill provides comprehensive instructions for designing and implementing state-of-the-art web user interfaces that provide a visually impressive user experience.

---

## 🎨 1. Color Palette & Visual Theme

- **Tailored Dark Themes**: Use deep charcoal/slate backgrounds (`#0a0d14`, `#121824`, `#1a2234`) instead of plain `#000000`.
- **Vibrant Accent Tokens**:
  - Cyan: `#06b6d4`
  - Indigo: `#6366f1`
  - Violet/Purple: `#a855f7`
  - Emerald Green: `#10b981`
  - Warm Amber: `#f59e0b`
- **Gradients**: Combine accents into multi-step linear gradients (`linear-gradient(135deg, #06b6d4, #6366f1, #a855f7)`).
- **Glassmorphism**: Combine translucent background fills (`rgba(26, 34, 52, 0.75)`), `backdrop-filter: blur(16px)`, subtle borders (`rgba(255, 255, 255, 0.08)`), and soft drop shadows.

---

## 🔤 2. Typography & Hierarchy

- **Google Fonts**: Load modern geometric and clean fonts:
  - Headings: `Outfit`, `Plus Jakarta Sans`
  - Body Text: `Inter`, `Roboto`
  - Code & Telemetry: `JetBrains Mono`, `Fira Code`
- **Scale & Contrast**:
  - `h1`: `font-size: 2.75rem`, `font-weight: 800`, `letter-spacing: -0.03em`
  - `h2`: `font-size: 1.5rem`, `font-weight: 700`
  - Body: `font-size: 0.95rem`, `line-height: 1.6`, `color: #94a3b8`

---

## ✨ 3. Micro-Interactions & Motion

- **Smooth Transitions**: Apply `transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1)` on buttons, cards, and interactive elements.
- **Card Hover Effects**: Lift elements (`transform: translateY(-3px)`), increase border glow (`border-color: rgba(99, 102, 241, 0.4)`), and expand shadow on hover.
- **Pulse Indicators**: Use keyframe animations for live status indicators, pulse dots, and loading skeletons.

```css
@keyframes pulseGlow {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.85); }
}
```

---

## 📱 4. Responsive Layouts & Grid Systems

- Use **CSS Grid** for auto-responsive dashboard cards:
  `grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))`
- Maintain mobile-first responsive breakpoints (`@media (max-width: 768px)`).
- Use proper ARIA attributes, semantic HTML elements (`<main>`, `<nav>`, `<header>`, `<section>`), and unique IDs for interactive elements.
