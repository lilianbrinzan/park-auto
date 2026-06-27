import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Clock, 
  Phone, 
  Navigation, 
  Info,
  Calendar
} from 'lucide-react';
import ParkingScene3D from './components/ParkingScene3D';
import NavigationAgentChat from './components/NavigationAgentChat';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

const FacebookIcon = ({ size = 24, ...props }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const WhatsAppIcon = ({ size = 24, ...props }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    {...props}
  >
    <path d="M12.004 2c-5.518 0-9.996 4.478-9.996 9.996 0 1.764.46 3.474 1.332 4.988l-1.34 4.9L7.1 20.544a9.927 9.927 0 004.904 1.28c5.518 0 9.996-4.478 9.996-9.996S17.522 2 12.004 2zm0 1.666c4.594 0 8.33 3.736 8.33 8.33 0 4.594-3.736 8.33-8.33 8.33a8.27 8.27 0 01-4.224-1.154l-.304-.18-3.136.822.836-3.056-.198-.316A8.267 8.267 0 013.67 11.996c0-4.594 3.736-8.33 8.33-8.33zm-2.073 3.036c-.198.002-.387.01-.563.023-.339.026-.596.223-.746.467-.282.46-.867 1.67-.867 2.946 0 1.276.924 2.505 1.053 2.678.13.172 1.815 2.775 4.398 3.889.615.265 1.096.423 1.47.542.617.197 1.18.17 1.62.104.496-.074 1.524-.622 1.74-1.223.214-.6.214-1.117.15-1.224-.064-.108-.236-.172-.494-.301-.258-.13-1.524-.751-1.76-.837-.236-.086-.408-.13-.58.13-.172.258-.666.837-.816 1.009-.15.172-.301.194-.56.064-.258-.13-1.09-.402-2.077-1.28-.768-.685-1.287-1.531-1.437-1.79-.15-.258-.016-.398.113-.526.116-.115.258-.301.387-.452.13-.15.172-.258.258-.43.086-.172.043-.323-.021-.452-.065-.13-.58-1.4-.796-1.916-.21-.504-.422-.435-.58-.443z" />
  </svg>
);

const TelegramIcon = ({ size = 24, ...props }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    {...props}
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-1-.65-.35-1 .22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.95 1.24-5.51 3.65-.52.36-.99.53-1.41.52-.46-.01-1.35-.26-2.01-.48-.81-.27-1.46-.42-1.4-.88.03-.24.37-.49 1.03-.75 4.04-1.76 6.74-2.92 8.1-3.48 3.84-1.6 4.64-1.88 5.16-1.89.12 0 .37.03.53.16.14.12.18.28.2.4-.02.07-.02.13-.02.19z" />
  </svg>
);

function App() {
  const address = "str. Sfatul Ţării, nr. 2, or. Chişinău, Republica Moldova.";
  const hours = "Luni – Vineri 08:00 – 18:00.";

  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    setIsMobileDevice(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
  }, []);

  const lat = 47.02269;
  const lng = 28.81857;

  const wazeUrl = `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
  const googleMapsUrl = isMobileDevice
    ? `geo:${lat},${lng}?q=${lat},${lng}(Park-Auto)`
    : `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  const parkopediaUrl = `https://www.parkopedia.com/parking/chisinau/?lat=${lat}&lng=${lng}`;
  
  const facebookUrl = "https://www.facebook.com/profile.php?id=61561901774249";
  const whatsappUrl = "https://wa.me/37376782189";
  const telegramUrl = "https://t.me/+37376782189";

  return (
    <div className="app-container">
      {/* Premium Header */}
      <header className="header">
        <div className="logo-container">
          <img src="/Logo.png" alt="park-auto logo" className="logo-img" width="48" height="48" />
          <span className="logo-title">park-auto</span>
        </div>
        <div className="btn-group" style={{ margin: 0, gap: '0.5rem' }}>
          <a 
            href={wazeUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-secondary" 
            style={{ padding: '0.5rem 0.75rem', fontSize: '0.75rem', borderRadius: '12px', gap: '0.35rem' }}
          >
            <Navigation size={12} />
            Waze
          </a>
          <a 
            href={googleMapsUrl} 
            target={isMobileDevice ? "_self" : "_blank"} 
            rel={isMobileDevice ? undefined : "noopener noreferrer"} 
            className="btn btn-secondary" 
            style={{ padding: '0.5rem 0.75rem', fontSize: '0.75rem', borderRadius: '12px', gap: '0.35rem' }}
          >
            <MapPin size={12} />
            Maps
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="hero-badge">Servicii Parcare Premium</div>
          <h1 className="hero-title">
            Parcare securizată în Centru <span>Park Auto</span>
          </h1>
          <p className="hero-subtitle" style={{ fontSize: '1.2rem', fontWeight: 500, color: 'var(--text-primary)' }}>
            Soluție practică pentru cei care caută un loc sigur de parcare!
          </p>
          <p className="hero-subtitle">
            Găsește instant un loc liber și parchează în siguranță în centrul capitalei, pe strada Sfatul Țării nr. 2.
          </p>
          
          <div className="btn-group">
            <a 
              id="btn-waze-hero"
              href={wazeUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-waze"
            >
              <Navigation size={16} />
              Navigare Waze
            </a>
            <a 
              id="btn-google-hero"
              href={googleMapsUrl} 
              target={isMobileDevice ? "_self" : "_blank"} 
              rel={isMobileDevice ? undefined : "noopener noreferrer"} 
              className="btn btn-google-maps"
            >
              <MapPin size={16} />
              Google Maps
            </a>
            <a 
              id="btn-parkopedia-hero"
              href={parkopediaUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-parkopedia"
            >
              <Info size={16} />
              Parkopedia
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <ParkingScene3D />
        </motion.div>
      </section>

      {/* Info Sections */}
      <section className="info-section">
        {/* Card 1: Despre noi */}
        <motion.div 
          className="info-card glass-panel"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="card-icon">
            <Info size={24} />
          </div>
          <h2 className="card-title">Despre Parcare</h2>
          <p className="card-content">
            Oferim servicii de parcare cu plată în Chișinău, strada Sfatul Țării nr. 2.
          </p>
          <p className="card-content" style={{ fontSize: '0.85rem' }}>
            Spațiul nostru este monitorizat și configurat pentru a asigura un flux auto facil și un grad ridicat de protecție pentru vehiculul dumneavoastră.
          </p>
        </motion.div>

        {/* Card 2: Informații Operaționale */}
        <motion.div 
          className="info-card glass-panel"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="card-icon">
            <Clock size={24} />
          </div>
          <h2 className="card-title">Informații</h2>
          <div className="card-content" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div className="info-item">
              <span className="info-item-label"><MapPin size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Adresă</span>
              <span className="info-item-value">{address}</span>
            </div>
            <div className="info-item">
              <span className="info-item-label"><Calendar size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Program</span>
              <span className="info-item-value">{hours}</span>
            </div>
          </div>
        </motion.div>

        {/* Card 3: Canale de Contact & Social Media */}
        <motion.div 
          className="info-card glass-panel"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="card-icon">
            <Phone size={24} />
          </div>
          <h2 className="card-title">Contact</h2>
          <p className="card-content">
            Pentru asistență, disponibilitate locuri și întrebări suplimentare, ne puteți contacta direct sau să ne urmăriți pe Facebook.
          </p>
          <div className="btn-group" style={{ marginTop: '0.5rem' }}>
            <a 
              id="btn-whatsapp"
              href={whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-whatsapp"
              style={{ flex: '1 1 120px' }}
            >
              <WhatsAppIcon size={16} />
              WhatsApp
            </a>
            <a 
              id="btn-telegram"
              href={telegramUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-telegram"
              style={{ flex: '1 1 120px' }}
            >
              <TelegramIcon size={16} />
              Telegram
            </a>
            <a 
              id="btn-facebook"
              href={facebookUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-facebook"
              style={{ width: '100%' }}
            >
              <FacebookIcon size={16} />
              Abonează-te pe Facebook
            </a>
          </div>
        </motion.div>
      </section>

      {/* Premium Footer */}
      <footer className="footer">
        <p>© 2026 park-auto. Toate drepturile rezervate. str. Sfatul Ţării, nr. 2, or. Chişinău, Republica Moldova.</p>
      </footer>

      {/* AI Navigation Assistant Chat Widget */}
      <NavigationAgentChat />
    </div>
  );
}

export default App;
