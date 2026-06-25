# park-auto - Web Platform for Premium Parking Services

### About the Project
park-auto is a modern web application designed to offer an intuitive and interactive interface for users looking for a secure parking space in the center of Chișinău, located at 2 Sfatul Țării Street.

The main purpose of the platform is to allow customers to check the parking layout in a three-dimensional format, obtain safe and fast navigation routes via multiple GPS services, and directly contact the parking administration.

---

### What does the project include?
The project is a modern Single Page Application (SPA) built with cutting-edge technologies. Its key features include:

1. Interactive 3D Parking Visualization (Performance-Optimized):
The application features an interactive 3D scene of the parking lot, allowing users to view the spatial layout directly in the browser. Built using React Three Fiber and Three.js, this functionality is fully optimized at the GPU level (utilizing Instanced Rendering for wheels and global reuse of geometries/materials) to eliminate high battery consumption and memory leaks on mobile devices.

2. Smart GPS Navigation:
GPS coordinates are precisely set to the exact location: 47.02269, 28.81857. Users can select their preferred navigation app directly from the interface:

 - Google Maps: Automatically opens the native app on iOS/Android devices (using the geo: protocol) or the web version on desktop.

 - Waze: Utilizes a universal web link that ensures error-free native redirection without protocol issues.

 - Parkopedia: Provides direct access to the parking indexing platform with pre-configured coordinates.

3. Secure Mobile Communication Channels:
Quick shortcuts are integrated for support and interaction via WhatsApp, Telegram, and the official Facebook page of the service.

4. Enhanced Redirection Security:
All external links opening in new tabs utilize the rel="noopener noreferrer" security attribute, eliminating Reverse Tabnabbing vulnerabilities and ensuring a safe browsing experience for users.

5. Secure Execution Environment (Docker Sandboxing):
The project includes a dedicated Docker configuration file (.gemini/sandbox.Dockerfile) to run the development assistant's instructions and tools within a completely isolated environment (sandbox), protecting the host system.

---

### Technical Details (Simplified)
 * React & Vite: The core technology used to build the user interface, ensuring extremely fast loading times and a lightweight production bundle.

 * React Three Fiber & Three.js: The library responsible for rendering the interactive 3D parking lot directly within the HTML5 canvas.

 * Framer Motion: Used for smooth and elegant page transitions and UI element animations.

 * Lucide React: A collection of modern icons used to provide clean, straightforward visual navigation.

 * Docker: Utilized for secure containerization during administrative tasks.
