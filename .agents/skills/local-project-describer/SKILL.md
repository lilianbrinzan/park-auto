---
name: local-project-describer
description: Generates a non-technical project description and overview for park-auto and saves it locally in the workspace root as PROJECT_OVERVIEW.md. Trigger this skill when the user asks to analyze the project, document the repository locally for non-technical stakeholders, or create/update the project overview file.
---

# Local Project Describer Skill

This skill analyzes the `park-auto` repository, compiles a comprehensive, non-technical description of the project, and saves it locally as a markdown file (`PROJECT_OVERVIEW.md`) at the root of the workspace.

## Workflow

Follow these steps to execute the skill:

### 1. Analyze the Workspace
Examine the following key files in the repository to build a complete mental model of the project:
*   [package.json](file:///c:/Project/park-auto/package.json) - Determine dependencies (React, Vite, React Three Fiber, Three.js, Lucide React, Framer Motion).
*   [README.md](file:///c:/Project/park-auto/README.md) - Identify the template and core setup.
*   [index.html](file:///c:/Project/park-auto/index.html) - View main entry layout.
*   [src/App.jsx](file:///c:/Project/park-auto/src/App.jsx) - Analyze page content, navigation links, contact info, and structural design.
*   [src/components/ParkingScene3D.jsx](file:///c:/Project/park-auto/src/components/ParkingScene3D.jsx) - Understand the 3D parking space visualization.

### 2. Synthesize the Non-Technical Description
Draft a project overview in Romanian (or English, based on user preference) using simple, plain language. Explain:
*   **What is the project?** A premium, modern web landing page for a private parking service called **park-auto** in central Chișinău, Moldova.
*   **Key Features & Functionality:**
    *   An interactive 3D scene visualizing the parking lot structure.
    *   Direct navigation integration (Waze and Parkopedia support).
    *   Social media/contact options (WhatsApp, Telegram, Facebook).
    *   Details on working hours and address (Strada Sfatul Țării nr. 2).
*   **What it contains:** The repository structure, source files, assets, and technologies described without overly complex developer jargon.

### 3. Write to PROJECT_OVERVIEW.md
1. Save the generated description to the file:
   `c:\Project\park-auto\PROJECT_OVERVIEW.md`
2. Provide a clickable link to [PROJECT_OVERVIEW.md](file:///c:/Project/park-auto/PROJECT_OVERVIEW.md) so the user can easily open it.
