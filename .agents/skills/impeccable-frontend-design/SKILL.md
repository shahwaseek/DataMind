---
name: impeccable-frontend-design
description: Guidelines and design standards for creating world-class, impeccable frontend interfaces with extraordinary visual taste, dark-mode glassmorphism, fluid animations, typography, and polished UI components.
---

# Impeccable Frontend Design & Aesthetics Skill

This skill defines the visual taste, layout precision, color theory, and interaction standards required to build frontend applications that wow users at first glance.

---

## 🎨 1. Impeccable Color Theory & Dark Mode

- **Background Palette**: Deep luxury obsidian & slate (`#070a11`, `#0d1322`, `#141c2e`).
- **Surface Elevation Fills**:
  - Base Surface: `rgba(20, 28, 46, 0.65)`
  - Elevated Card: `rgba(28, 38, 62, 0.75)`
  - Active / Hover Surface: `rgba(38, 50, 80, 0.85)`
- **Accent Tokens & Neon Glows**:
  - Cyan Burst: `#06b6d4` (`box-shadow: 0 0 25px rgba(6, 182, 212, 0.3)`)
  - Violet Glow: `#8b5cf6` (`box-shadow: 0 0 25px rgba(139, 92, 246, 0.3)`)
  - Emerald Pulse: `#10b981`
- **Text Contrast System**:
  - Primary Headlines: `#f8fafc` (Pure high contrast)
  - Secondary Body: `#94a3b8` (Muted readable text)
  - Captions & Meta: `#64748b` (Subtle metadata)

---

## ✨ 2. Glassmorphism & Depth Engineering

- **Backdrop Blur & Saturation**: Combine `backdrop-filter: blur(20px) saturate(180%)`.
- **Subtle Borders**: Use ultra-thin translucent borders (`border: 1px solid rgba(255, 255, 255, 0.08)`).
- **Interactive Border Glow**: On hover, transition border to accent gradient tint (`border-color: rgba(139, 92, 246, 0.4)`).
- **Multi-Layer Shadowing**:
  `box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.6), 0 0 30px rgba(6, 182, 212, 0.12)`

```css
.impeccable-card {
  background: rgba(20, 28, 46, 0.65);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 1.75rem;
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.6);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
              border-color 0.3s ease,
              box-shadow 0.3s ease;
}

.impeccable-card:hover {
  transform: translateY(-4px);
  border-color: rgba(139, 92, 246, 0.4);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(139, 92, 246, 0.2);
}
```

---

## 🔤 3. Typography & Micro-Layouts

- **Font Pairing**:
  - Display Titles: `Outfit`, `Space Grotesk` (Weight: 700-800, Letter-spacing: `-0.03em`)
  - Body Text: `Inter`, `Plus Jakarta Sans` (Weight: 400-500, Line-height: `1.6`)
  - Code & Data: `JetBrains Mono`
- **Text Gradients**:
  `background: linear-gradient(135deg, #ffffff 40%, #94a3b8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;`

---

## 🌊 4. Fluid Motion & Micro-Interactions

- **Ease Curves**: Avoid `linear` or `ease-in-out`. Use custom spring/cubic-bezier curves:
  `cubic-bezier(0.16, 1, 0.3, 1)` or `cubic-bezier(0.34, 1.56, 0.64, 1)` for snappy popups.
- **Button Feedback**:
  - Active state: `transform: scale(0.97)`
  - Hover state: Glow expansion & slight upward lift
- **Skeleton Shimmers & Pulse**:
  `animation: shimmer 2s infinite linear;` for loading states.
