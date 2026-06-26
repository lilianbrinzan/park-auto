# 🚗 Park-Auto — Premium Secured Parking Platform

[![React](https://img.shields.io/badge/React-19-blue.svg?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-r184-black.svg?logo=three.js&logoColor=white)](https://threejs.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF.svg?logo=vite&logoColor=white)](https://vite.dev/)
[![Oxlint](https://img.shields.io/badge/Oxlint-1.69-orange.svg)](https://github.com/oxc-project/oxc)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.txt)

A modern, highly interactive web application designed to help users locate and visually inspect a premium secured parking lot in the center of Chișinău (2 Sfatul Țării Street).

Built for speed, accessibility, and fluid user experience, the application features an interactive 3D scene, device-responsive GPS navigation launchers, and secure communication channels.

---

## ✨ Features

* **🎨 Interactive 3D Parking Layout:** Immersive 3D parking bay visualization built with React Three Fiber. Optimized with GPU-level instanced rendering (for wheels) and reusable geometries/materials.
* **🗺️ Smart GPS Navigation:** 
  * **Google Maps:** Uses the native `geo:` protocol launcher on mobile devices for seamless in-app transition and web fallback on desktops.
  * **Waze:** A universal redirection link preventing native schema resolution issues.
  * **Parkopedia:** Direct linkage to parking index details pre-configured for the exact coordinates.
* **💬 Instant & Secure Communication:** Direct quick-connect buttons for Telegram, WhatsApp, and Facebook.
* **🔒 Strict Security Practices:** External links protected against **Reverse Tabnabbing** using `rel="noopener noreferrer"`.
* **⚡ Type-Safe Architecture:** Entirely written in **TypeScript** to prevent runtime errors and ensure high code quality.

---

## 🛠️ Tech Stack

* **Frontend Framework:** React 19 (Single Page Application)
* **Language:** TypeScript 5 (Strict Mode enabled)
* **3D Rendering:** Three.js & React Three Fiber (R3F) & `@react-three/drei`
* **Animations:** Framer Motion (for smooth micro-interactions and transitions)
* **Iconography:** Lucide React
* **Build Tool:** Vite 8 (extremely fast Hot Module Replacement)
* **Linting:** Oxlint (performance-focused linter running in milliseconds)
* **Testing:** Vitest & React Testing Library (with jsdom environment)

---

## 📂 Project Structure

```bash
park-auto/
├── .oxlintrc.json       # Oxlint configuration
├── tsconfig.json        # TypeScript configuration (Project References)
├── tsconfig.app.json    # TS config for client-side React code
├── tsconfig.node.json   # TS config for Node build tools (Vite)
├── vite.config.ts       # Vite config
├── index.html           # Entry HTML template
├── src/
│   ├── main.tsx         # Application entry point
│   ├── App.tsx          # Main App shell
│   ├── index.css        # Core styles & Design tokens
│   ├── vite-env.d.ts    # Vite environment type declarations
│   ├── App.test.tsx     # Unit tests
│   └── components/
│       └── ParkingScene3D.tsx # Interactive 3D scene (Three.js/R3F)
└── public/              # Static assets (images, icons)
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (version 18+ recommended).

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your browser.

### 3. Build for Production
Compiles TypeScript types and builds the production bundle:
```bash
npm run build
```

### 4. Run Unit Tests
```bash
npm run test
```

### 5. Lint the Codebase
```bash
npm run lint
```

---

## ⚙️ Performance & Security Optimization Details

1. **GPU Instancing:** The wheels of the 3D cars in `ParkingScene3D.tsx` are rendered using `Instances` and `Instance` from `@react-three/drei`. This allows rendering multiple wheels in a single draw call, drastically improving frame rates on low-end mobile devices.
2. **Resource Reuse:** Box and Cylinder geometries, along with standard physical materials, are declared outside the render loop in the module scope to prevent memory leaks and garbage collection stutters.
3. **No-Lag Resize Listeners:** The window resize handler uses `window.matchMedia` query listeners rather than global resize polling, avoiding unnecessary re-renders on mobile browser scroll address-bar resizing.
4. **Vulnerability Mitigation:** Safe external routing prevents malicious window control exploits (`tabnabbing`).

---

## 🌐 Deployment

The application is deployed on **IONOS Hosting** and linked to the domain **[park-auto.site](http://park-auto.site)**.

### How to Deploy Updates:
1. Build the project locally to generate the latest production files:
   ```bash
   npm run build
   ```
2. Open an FTP/SFTP client (like **FileZilla**).
3. Connect to the IONOS server:
   * **Host:** `hosting2504832.online.pro`
   * **Port:** `22` (SFTP) or `21` (FTP)
   * **Username:** `hosting2504832` (or your configured FTP user)
4. Upload all files and folders from the local `dist/` directory into the remote directory:
   ```
   /park-auto/
   ```
   *(Make sure you upload the **contents** of the `dist/` directory, not the `dist/` folder itself, so that `index.html` resides in the root of the `/park-auto` folder).*

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE.txt file for details.

