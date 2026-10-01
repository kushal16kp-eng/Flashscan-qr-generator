# FlashScan — QR Code Generator

> **Create. Customize. Scan.**  
> Create beautiful, customizable QR codes in seconds — fast, client-side, and completely private in your browser.

FlashScan is a polished, recruitment-ready, frontend-only QR Code Generator and Designer web application built with React, Vite, plain CSS, and `qr-code-styling`. It empowers users to quickly design, customize, preview, inspect, and export high-reliability, branded QR codes for websites, plain text, email messages, phone numbers, and Wi-Fi networks.

## Features

- **⚡ Premium Welcome Intro**:
  - Interactive onboarding screen with CSS-rendered animated glowing backdrop and grid.
  - Quick action to "Start Creating" with smooth transition or "Skip intro".
  - Dedicated header replay button to revisit the welcome experience anytime.
  - Non-intrusive compact banner for returning users.
- **5 QR Code Types**:
  - **URL / Website**: Auto-normalizes URLs with `https://`.
  - **Plain Text**: Multiline notes and messages with live character counter.
  - **Email**: Pre-populates recipient, subject, and body parameters (`mailto:`).
  - **Phone Number**: International phone formatting (`tel:`).
  - **Wi-Fi**: Automatic formatting for WPA, WEP, or Open networks with hidden SSID support (`WIFI:`).
- **🎨 Modern Branded Customization**:
  - **Color Modes**: Solid color, Linear gradient (with customizable angles), or Radial gradient.
  - **Custom Module Shapes**: Square, Rounded, Dots, Classy, or Extra Rounded.
  - **Custom Corner Eyes**: Custom corner squares and center dots for distinct branding.
  - **Centre Logo Overlay**: Upload custom brand logos (PNG, JPG, SVG, WebP) with size slider, margin padding, and automatic Error Correction High (ECC H) protection.
- **Instant Live Preview**: Updates in real-time as you type or adjust design parameters.
- **Dark & Light Mode**:
  - Seamless theme toggle in the header.
  - Automatically respects user OS preference on first visit.
  - Persists preference in `localStorage`.
  - High-contrast, WCAG-compliant color tokens for both themes.
- **Scan Quality Analyzer**:
  - Evaluates contrast distance, canvas sizing, quiet zone margin, and error correction.
  - Displays dynamic ratings: **Excellent**, **Good**, **Needs Attention**, or **Risky**.
  - Provides practical, actionable recommendations to improve scanning performance.
  - Includes advisory test-scan disclaimers for real-world devices.
- **Multi-Format Export & Sharing**:
  - **PNG Download**: Canvas-rendered pixel-perfect PNG (`flashscan-[type]-[date].png`).
  - **Vector SVG Download**: Scalable vector XML export for crisp print and design software.
  - **Copy QR Content**: One-click clipboard copy of raw encoded string.
  - **Web Share Integration**: Native system share sheet with automatic clipboard fallback.
- **Toast Notifications**:
  - Non-intrusive feedback banners for copy, download, delete, and theme actions.
- **Curated Branded Presets**:
  - **Classic Black**: High-contrast black square modules on pure white.
  - **Midnight**: Crisp white rounded modules on dark slate.
  - **Ocean**: Deep blue diagonal gradient with rounded dots on pale cyan.
  - **Purple Glow**: Violet-to-indigo gradient with dots.
  - **Sunset**: Radiant orange-to-rose warm gradient.
  - **Emerald**: Forest green professional corporate styling.
- **Recent QR History**:
  - Persists the latest 6 unique configurations in `localStorage`.
  - Restore any saved QR code with a single click.
  - Delete individual items or clear all with browser confirmation.
  - Corrupt-safe JSON parsing.
- **Pure Plain CSS**:
  - Modern clean dark/light indigo design system.
  - Two-column desktop layout with sticky preview.
  - Responsive single-column mobile layout with zero horizontal overflow.
  - Accessible focus states and semantic HTML.
  - Zero external UI libraries (no Tailwind, Bootstrap, or Material UI).

## Tech Stack

- **React 19**
- **Vite 6+**
- **qr-code-styling**
- **Plain CSS (Vanilla CSS3 with CSS Custom Properties)**

## Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/flashscan.git

# Enter project directory
cd flashscan

# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:3000` (or `http://localhost:5173`) in your browser.

### Building for Production

```bash
npm run build
npm run preview
```

## Folder Structure

```text
src/
├── components/
│   ├── CustomizationPanel.jsx # Sliders, color modes, gradients, shapes, logo upload
│   ├── FlashScanIntro.jsx     # Welcome onboarding screen with CSS glow animations
│   ├── Presets.jsx            # Branded presets (Classic, Midnight, Ocean, Sunset, etc.)
│   ├── QRForm.jsx             # Type tabs & dynamic input fields
│   ├── QRPreview.jsx          # Live qr-code-styling canvas, Scan Quality, PNG/SVG download
│   └── RecentCodes.jsx        # History cards stored in localStorage
├── utils/
│   ├── qrUtils.js             # Payload builders, validation, Scan Quality algorithm
│   └── storage.js             # localStorage persistence & theme helpers
├── App.css                    # Plain CSS stylesheet with Dark/Light theme variables
├── App.jsx                    # Root application component with theme & toast state
└── main.jsx                   # React DOM root entry
```

## License

MIT
