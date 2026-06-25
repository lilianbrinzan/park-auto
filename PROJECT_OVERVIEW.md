# park-auto - Platformă Web pentru Servicii Parcare Premium

### Despre Proiect
**park-auto** este o aplicație web modernă creată pentru a oferi o interfață intuitivă și interactivă utilizatorilor care caută un loc de parcare securizat în centrul orașului Chișinău, localizat pe strada Sfatul Țării, nr. 2.

Scopul principal al platformei este de a permite clienților să verifice dispunerea locurilor de parcare în format tridimensional, să obțină instrucțiuni de navigare sigure și rapide prin multiple servicii GPS, și să contacteze direct administrația parcării.

---

### Ce conține proiectul?

Proiectul este o aplicație web de tip Single Page Application (pagină unică) realizată cu tehnologii de ultimă generație. Punctele sale cheie includ:

1. **Vizualizare Interactivă 3D a Parcării (Optimizată pentru Performanță):**
   Aplicația conține o scenă 3D interactivă a parcării, permițând utilizatorilor să vadă dispunerea locurilor direct în browser. Această funcționalitate utilizează React Three Fiber și Three.js, fiind complet optimizată la nivel GPU (prin Instanced Rendering pentru roți și refolosirea globală a geometriilor/materialelor) pentru a elimina consumul ridicat de baterie și scurgerile de memorie pe telefoanele mobile.

2. **Navigare Inteligentă (Smart GPS Navigation):**
   Coordonatele GPS sunt setate cu precizie ridicată la locația exactă: **47.02269, 28.81857**. Utilizatorul poate selecta navigatorul preferat direct din interfață:
   - **Google Maps:** Deschide automat aplicația nativă pe telefoanele iOS/Android (folosind protocolul `geo:`) sau versiunea web pe desktop.
   - **Waze:** Utilizează un link universal web care asigură redirecționarea nativă fără erori de protocol.
   - **Parkopedia:** Oferă acces direct la platforma de indexare a parcărilor cu coordonatele prestabilite.

3. **Canale de Comunicare Securizate direct pe Mobil:**
   Sunt integrate scurtături rapide pentru asistență și interacțiune prin WhatsApp, Telegram și pagina oficială de Facebook a serviciului.

4. **Securitate Sporită la Redirecționare:**
   Toate legăturile externe care se deschid în file noi utilizează atributul de securitate `rel="noopener noreferrer"`, eliminând vulnerabilitatea de tip *Reverse Tabnabbing* și garantând că utilizatorii navighează în siguranță.

5. **Mediu de Execuție Securizat (Docker Sandboxing):**
   Proiectul include un fișier de configurare Docker (`.gemini/sandbox.Dockerfile`) dedicat rulării instrucțiunilor și uneltelor asistentului de dezvoltare într-un mediu complet izolat (sandbox) pentru protecția sistemului gazdă.

---

### Detalii Tehnice (Simplificate)

*   **React & Vite:** Tehnologia de bază folosită pentru construirea interfeței de utilizator, asigurând o încărcare extrem de rapidă și un bundle de producție compact.
*   **React Three Fiber & Three.js:** Biblioteca responsabilă de afișarea parcării în format 3D interactiv direct în canvas-ul HTML5.
*   **Framer Motion:** Folosită pentru tranzițiile și animațiile elegante ale elementelor din pagină.
*   **Lucide React:** O colecție de pictograme moderne folosite pentru o navigare vizuală simplă și curată.
*   **Docker:** Pentru containere securizate în timpul sarcinilor administrative.
