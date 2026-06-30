import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Send, 
  X, 
  ShieldAlert, 
  ShieldCheck, 
  Check, 
  Bot,
  User,
  Settings
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { checkSemanticPolicy, validateNavigationParams, NavigationParams } from '../utils/policyEngine';

const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined' && typeof window.localStorage.getItem === 'function') {
      return window.localStorage.getItem(key);
    }
    return null;
  },
  setItem: (key: string, value: string): void => {
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined' && typeof window.localStorage.setItem === 'function') {
      window.localStorage.setItem(key, value);
    }
  },
  removeItem: (key: string): void => {
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined' && typeof window.localStorage.removeItem === 'function') {
      window.localStorage.removeItem(key);
    }
  }
};

interface Message {
  id: string;
  sender: 'user' | 'agent' | 'system';
  text: string;
  timestamp: Date;
  isPolicyError?: boolean;
}

export default function NavigationAgentChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'agent',
      text: 'Salut! Sunt Asistentul tău de Navigație Inteligent. Te pot ajuta să obții traseul optim către parcarea Park-Auto (str. Sfatul Țării 2, Chișinău). Spune-mi de unde vii și ce aplicație preferi (Google Maps sau Waze).',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState(() => safeLocalStorage.getItem('gemini_api_key') || '');

  // State matching current intent
  const [extractedOrigin, setExtractedOrigin] = useState<string | null>(null);
  const [extractedApp, setExtractedApp] = useState<'Google Maps' | 'Waze' | null>(null);

  // State for Human-in-the-Loop Vibe Diff
  const [pendingAction, setPendingAction] = useState<NavigationParams | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isThinking, pendingAction]);

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    if (!textToSend) {
      setInputValue('');
    }

    // 1. Add user message
    const userMsgId = Math.random().toString(36).substring(7);
    const newMessages: Message[] = [
      ...messages,
      {
        id: userMsgId,
        sender: 'user',
        text,
        timestamp: new Date()
      }
    ];
    setMessages(newMessages);

    // 2. Security Check: Semantic Gating
    const policyResult = checkSemanticPolicy(text);
    if (!policyResult.allowed) {
      setIsThinking(true);
      setTimeout(() => {
        setIsThinking(false);
        setMessages(prev => [
          ...prev,
          {
            id: Math.random().toString(36).substring(7),
            sender: 'system',
            text: `[POLICĂ DE SECURITATE] Solicitare blocată: ${policyResult.reason}`,
            timestamp: new Date(),
            isPolicyError: true
          }
        ]);
      }, 600);
      return;
    }

    // 3. Process message
    setIsThinking(true);
    setTimeout(async () => {
      try {
        await processAgentResponse(text, newMessages);
      } catch (err) {
        console.error(err);
      } finally {
        setIsThinking(false);
      }
    }, 1200);
  };

  const runOfflineRuleBased = (userInput: string) => {
    const inputLower = userInput.toLowerCase();

    // 1. Detect language
    let lang: 'ro' | 'en' | 'de' | 'ru' = 'ro'; // Default to Romanian
    if (inputLower.match(/\b(how|get|from|to|hello|hi|street|route|start)\b/)) {
      lang = 'en';
    } else if (inputLower.match(/\b(wie|komme|ich|aus|von|hallo|route|strasse|straße)\b/)) {
      lang = 'de';
    } else if (inputLower.match(/(как|доехать|из|от|привет|здравствуйте|маршрут|улица)/)) {
      lang = 'ru';
    }

    // Translations for offline feedback
    const t = {
      ro: {
        askApp: (origin: string) => `Am înțeles că plecați din **${origin}**. Ce aplicație de navigare preferați să folosiți: **Google Maps** sau **Waze**?`,
        askOrigin: (app: string) => `Voi folosi **${app}** pentru traseu. Îmi puteți spune care este punctul de pornire (orașul, sectorul sau strada)?`,
        askBoth: () => 'Pentru a vă ghida corect, vă rog să îmi spuneți locația de pornire și ce aplicație preferați (Google Maps sau Waze). De exemplu: *"Cum ajung din Orhei cu Waze?"*'
      },
      en: {
        askApp: (origin: string) => `I understand you are starting from **${origin}**. Which navigation app do you prefer: **Google Maps** or **Waze**?`,
        askOrigin: (app: string) => `I will use **${app}** for routing. Could you please specify your starting location (city, district, or street)?`,
        askBoth: () => 'To guide you correctly, please provide your starting location and preferred navigation app (Google Maps or Waze). For example: *"How do I get from Orhei using Waze?"*'
      },
      de: {
        askApp: (origin: string) => `Ich verstehe, dass Sie aus **${origin}** kommen. Welche Navigations-App bevorzugen Sie: **Google Maps** oder **Waze**?`,
        askOrigin: (app: string) => `Ich werde **${app}** für die Route verwenden. Können Sie bitte Ihren Startpunkt (Stadt, Stadtteil oder Straße) angeben?`,
        askBoth: () => 'Um Sie richtig zu leiten, geben Sie bitte Ihren Startpunkt und Ihre bevorzugte Navigations-App (Google Maps oder Waze) an. Zum Beispiel: *"Wie komme ich aus Orhei mit Waze?"*'
      },
      ru: {
        askApp: (origin: string) => `Я понял, что вы едете из **${origin}**. Какое навигационное приложение вы предпочитаете: **Google Maps** или **Waze**?`,
        askOrigin: (app: string) => `Я буду использовать **${app}** для маршрута. Не могли бы вы указать точку отправления (город, район или улицу)?`,
        askBoth: () => 'Чтобы направить вас правильно, пожалуйста, укажите место отправления и предпочитаемое приложение (Google Maps или Waze). Например: *"Как доехать из Оргеева с помощью Waze?"*'
      }
    };

    // Simple NLP extraction for prototype
    let detectedApp: 'Google Maps' | 'Waze' | null = extractedApp;
    if (inputLower.includes('waze')) {
      detectedApp = 'Waze';
      setExtractedApp('Waze');
    } else if (inputLower.includes('google maps') || inputLower.includes('google') || inputLower.includes('maps') || inputLower.includes('harti') || inputLower.includes('hartă') || inputLower.includes('карты') || inputLower.includes('karten')) {
      detectedApp = 'Google Maps';
      setExtractedApp('Google Maps');
    }

    // Exclude noise words from potential origins
    let detectedOrigin: string | null = extractedOrigin;
    const commonWords = [
      'waze', 'google', 'maps', 'harti', 'hartă', 'cum', 'ajung', 'din', 'de', 'la', 'salut', 'buna', 'vă', 'parcare', 'traseu', 'navigatie', 'navigare',
      'how', 'get', 'from', 'to', 'hello', 'hi', 'route', 'navigation', 'start',
      'wie', 'komme', 'ich', 'aus', 'von', 'hallo', 'strasse', 'straße',
      'как', 'доехать', 'из', 'от', 'привет', 'здравствуйте', 'маршрут', 'карты'
    ];
    
    // Attempt to extract origin
    const fromKeywords = [
      // Romanian
      'din', 'la', 'de la', 'de la ', 'vin din', 'plec din',
      // English
      'from', 'starting from', 'coming from', 'start at',
      // German
      'aus', 'von', 'ab', 'starten in',
      // Russian
      'из', 'от', 'с', 'еду из', 'начиная с'
    ];
    let foundOrigin = false;
    for (const keyword of fromKeywords) {
      const index = inputLower.indexOf(keyword);
      if (index !== -1) {
        const remainingText = userInput.substring(index + keyword.length).trim();
        const cleanLocation = remainingText.split(/[,\s.?]+/)[0];
        if (cleanLocation && cleanLocation.length > 2 && !commonWords.includes(cleanLocation.toLowerCase())) {
          detectedOrigin = cleanLocation;
          setExtractedOrigin(cleanLocation);
          foundOrigin = true;
          break;
        }
      }
    }

    // Fallback search
    if (!foundOrigin && !detectedOrigin) {
      const words = userInput.split(/[,\s.?]+/);
      for (const word of words) {
        if (word.length > 2 && !commonWords.includes(word.toLowerCase()) && word[0] === word[0].toUpperCase()) {
          detectedOrigin = word;
          setExtractedOrigin(word);
          break;
        }
      }
    }

    // Decision tree
    if (detectedOrigin && detectedApp) {
      setPendingAction({
        origin: detectedOrigin,
        appType: detectedApp
      });
    } else if (detectedOrigin && !detectedApp) {
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(36).substring(7),
          sender: 'agent',
          text: t[lang].askApp(detectedOrigin!),
          timestamp: new Date()
        }
      ]);
    } else if (!detectedOrigin && detectedApp) {
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(36).substring(7),
          sender: 'agent',
          text: t[lang].askOrigin(detectedApp!),
          timestamp: new Date()
        }
      ]);
    } else {
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(36).substring(7),
          sender: 'agent',
          text: t[lang].askBoth(),
          timestamp: new Date()
        }
      ]);
    }
  };

  const processAgentResponse = async (userInput: string, currentMessages: Message[]) => {
    const savedKey = safeLocalStorage.getItem('gemini_api_key');
    if (savedKey) {
      try {
        const ai = new GoogleGenAI({ apiKey: savedKey });
        
        // Exclude system/error messages from prompt context to avoid confusing the model
        const chatHistory = currentMessages
          .filter(m => m.sender !== 'system')
          .map(m => ({
            role: m.sender === 'user' ? 'user' : 'model',
            parts: [{ text: m.text }]
          }));

        const systemInstruction = `Ești Asistentul de Navigație Inteligent pentru parcarea Park-Auto (str. Sfatul Țării 2, Chișinău). 
Locația exactă a parcării este: latitudinea 47.02269, longitudinea 28.81857.

Sarcina ta este să extragi două informații cheie din conversație:
1. Punctul de pornire al utilizatorului (de exemplu: sectorul Botanica, orașul Orhei, sau strada). Câmpul "origin" din JSON.
2. Aplicația de navigație dorită (care trebuie să fie exact "Google Maps" sau "Waze"). Câmpul "appType" din JSON.

Răspunde ÎNTOTDEAUNA exclusiv sub forma unui obiect JSON valid cu următoarele chei:
- "origin": Numele locației de pornire (string, sau null dacă nu este menționat/clar încă).
- "appType": Aplicația preferată, care poate fi doar "Google Maps" sau "Waze" (string, sau null dacă nu este menționată clar încă).
- "message": Răspunsul tău către utilizator (string). Răspunde ÎNTOTDEAUNA în aceeași limbă în care a comunicat utilizatorul (română, engleză, germană, rusă etc.). Fii politicos și de ajutor. Dacă lipsește una dintre informații (origin sau appType), cere-o politicos în aceeași limbă în "message". Dacă le ai pe amândouă, explică în "message" (în limba utilizatorului) că urmează să generezi ruta de navigare.

Nu adăuga formatări suplimentare în afara JSON-ului brut.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: chatHistory.map(item => ({
            role: item.role,
            parts: item.parts
          })),
          config: {
            systemInstruction: systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: {
              type: 'object',
              properties: {
                origin: { type: ['string', 'null'] },
                appType: { 
                  type: ['string', 'null'], 
                  enum: ['Google Maps', 'Waze', null] 
                },
                message: { type: 'string' }
              },
              required: ['message']
            }
          }
        });

        const responseText = response.text || '';
        const result = JSON.parse(responseText.trim());

        if (result.message) {
          setMessages(prev => [
            ...prev,
            {
              id: Math.random().toString(36).substring(7),
              sender: 'agent',
              text: result.message,
              timestamp: new Date()
            }
          ]);
        }

        let updatedOrigin = extractedOrigin;
        let updatedApp = extractedApp;

        if (result.origin) {
          updatedOrigin = result.origin;
          setExtractedOrigin(result.origin);
        }
        if (result.appType) {
          updatedApp = result.appType;
          setExtractedApp(result.appType);
        }

        if (updatedOrigin && updatedApp) {
          setPendingAction({
            origin: updatedOrigin,
            appType: updatedApp
          });
        }
      } catch (error: any) {
        console.error('Gemini API Error:', error);
        setMessages(prev => [
          ...prev,
          {
            id: Math.random().toString(36).substring(7),
            sender: 'system',
            text: `[EROARE API GEMINI] A apărut o eroare la apelarea modelului AI: ${error.message || error}. Se folosește modul offline ca fallback.`,
            timestamp: new Date(),
            isPolicyError: true
          }
        ]);
        runOfflineRuleBased(userInput);
      }
    } else {
      runOfflineRuleBased(userInput);
    }
  };

  const handleApprove = () => {
    if (!pendingAction) return;

    // Validate parameters (Structural Check)
    if (!validateNavigationParams(pendingAction)) {
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(36).substring(7),
          sender: 'system',
          text: '[EROARE STRUCTURALĂ] Parametrii tool-ului sunt invalizi.',
          timestamp: new Date(),
          isPolicyError: true
        }
      ]);
      setPendingAction(null);
      return;
    }

    const { origin, appType } = pendingAction;
    const lat = 47.02269;
    const lng = 28.81857;
    let url = '';

    if (appType === 'Waze') {
      url = `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
    } else {
      url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${lat},${lng}`;
    }

    // Execute Tool (Open Tab)
    window.open(url, '_blank', 'noopener,noreferrer');

    // Add confirmation messages
    setMessages(prev => [
      ...prev,
      {
        id: Math.random().toString(36).substring(7),
        sender: 'system',
        text: `[EXECUȚIE REUȘITĂ] S-a apelat tool-ul generateNavigationLink pentru ${appType}.`,
        timestamp: new Date()
      },
      {
        id: Math.random().toString(36).substring(7),
        sender: 'agent',
        text: `Am deschis navigația cu **${appType}** pentru traseul de la **${origin}** către parcarea noastră din str. Sfatul Țării 2. Drum bun! 🚗`,
        timestamp: new Date()
      }
    ]);

    // Reset state
    setExtractedOrigin(null);
    setExtractedApp(null);
    setPendingAction(null);
  };

  const handleReject = () => {
    setMessages(prev => [
      ...prev,
      {
        id: Math.random().toString(36).substring(7),
        sender: 'system',
        text: '[EVALUARE AGENT] Acțiunea a fost respinsă de utilizator (Human-in-the-Loop).',
        timestamp: new Date(),
        isPolicyError: true
      },
      {
        id: Math.random().toString(36).substring(7),
        sender: 'agent',
        text: 'Acțiunea a fost anulată. Spune-mi dacă dorești să modificăm traseul sau aplicația de navigare.',
        timestamp: new Date()
      }
    ]);

    setPendingAction(null);
  };

  const resetAgentState = () => {
    setExtractedOrigin(null);
    setExtractedApp(null);
    setPendingAction(null);
    setMessages([
      {
        id: 'welcome',
        sender: 'agent',
        text: 'Salut! Sunt Asistentul tău de Navigație Inteligent. Te pot ajuta să obții traseul optim către parcarea Park-Auto (str. Sfatul Țării 2, Chișinău). Spune-mi de unde vii și ce aplicație preferi (Google Maps sau Waze).',
        timestamp: new Date()
      }
    ]);
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="agent-trigger-container" style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 999 }}>
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className={`agent-chat-button ${isOpen ? 'active' : ''}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
          {!isOpen && <span className="pulse-dot"></span>}
        </motion.button>
      </div>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="agent-chat-window glass-panel"
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              bottom: '90px',
              right: '24px',
              width: '380px',
              height: '520px',
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            {/* Header */}
            <div className="agent-chat-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="header-info">
                <div className="bot-avatar">
                  <Bot size={20} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600 }}>Asistent AI Parcare</h4>
                  <span className="status-badge"><span className="status-dot"></span> Navigație Inteligentă</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button 
                  onClick={() => setShowSettings(!showSettings)} 
                  className={`btn-settings ${showSettings ? 'active' : ''}`}
                  title="Configurare Cheie API"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: showSettings ? '#646CFF' : '#94A3B8',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'color 0.2s'
                  }}
                >
                  <Settings size={18} />
                </button>
                <button onClick={resetAgentState} className="btn-reset" title="Resetează discuția">
                  Reset
                </button>
              </div>
            </div>

            {/* Settings Panel */}
            {showSettings && (
              <div 
                className="settings-panel"
                style={{
                  padding: '16px',
                  backgroundColor: 'rgba(15, 23, 42, 0.95)',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  fontSize: '0.8rem',
                  color: '#E2E8F0',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ fontWeight: 600, color: '#646CFF' }}>CONFIGURARE CHEIE GEMINI API</div>
                <p style={{ margin: 0, color: '#94A3B8', fontSize: '0.75rem', lineHeight: '1.25' }}>
                  Pentru a activa agentul real Gemini (ADK), introduceți cheia dvs. API de la Google AI Studio. Aceasta este salvată doar local în browserul dvs.
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="password"
                    placeholder="Cheie API..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    style={{
                      flex: 1,
                      backgroundColor: 'rgba(0,0,0,0.3)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      color: '#fff',
                      fontSize: '0.75rem',
                      outline: 'none'
                    }}
                  />
                  <button
                    onClick={() => {
                      const trimmedKey = apiKey.trim();
                      if (trimmedKey) {
                        safeLocalStorage.setItem('gemini_api_key', trimmedKey);
                      } else {
                        safeLocalStorage.removeItem('gemini_api_key');
                      }
                      setShowSettings(false);
                      setMessages(prev => [
                        ...prev,
                        {
                          id: Math.random().toString(36).substring(7),
                          sender: 'system',
                          text: trimmedKey 
                            ? 'Cheia API Gemini a fost salvată. Asistentul va rula folosind Gemini AI!'
                            : 'Cheia API a fost ștearsă. Asistentul va rula în modul offline.',
                          timestamp: new Date()
                        }
                      ]);
                    }}
                    style={{
                      backgroundColor: '#646CFF',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '0.75rem'
                    }}
                  >
                    Salvează
                  </button>
                </div>
              </div>
            )}

            {/* Message Area */}
            <div className="agent-messages-container" style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {messages.map((msg) => (
                <div key={msg.id} className={`message-row ${msg.sender}`}>
                  {msg.sender === 'agent' && (
                    <div className="msg-icon bot">
                      <Bot size={14} />
                    </div>
                  )}
                  {msg.sender === 'user' && (
                    <div className="msg-icon user">
                      <User size={14} />
                    </div>
                  )}
                  <div className={`message-bubble ${msg.sender} ${msg.isPolicyError ? 'error' : ''}`}>
                    {msg.sender === 'system' && (
                      <div className="system-indicator">
                        <ShieldAlert size={14} style={{ marginRight: '6px' }} />
                        <strong>Sistem Security</strong>
                      </div>
                    )}
                    <span dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></span>
                  </div>
                </div>
              ))}

              {/* Thinking Indicator */}
              {isThinking && (
                <div className="message-row agent">
                  <div className="msg-icon bot animate-pulse">
                    <Bot size={14} />
                  </div>
                  <div className="message-bubble agent thinking">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}

              {/* Human in the Loop (Vibe Diff Panel) */}
              {pendingAction && (
                <motion.div
                  className="vibe-diff-panel"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    border: '1px solid var(--accent-neon, #646CFF)',
                    borderRadius: '16px',
                    padding: '16px',
                    margin: '8px 0',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.5)'
                  }}
                >
                  <div className="vibe-diff-header" style={{ display: 'flex', alignItems: 'center', color: '#646CFF', marginBottom: '10px', fontSize: '0.85rem', fontWeight: 600 }}>
                    <ShieldCheck size={18} style={{ marginRight: '6px' }} />
                    <span>VERIFICARE SECURITATE (VIBE DIFF)</span>
                  </div>
                  <p style={{ margin: '0 0 8px 0', fontSize: '0.8rem', color: '#94A3B8' }}>
                    Agentul propune apelarea unui tool extern de navigare. Te rugăm să verifici diferența dintre intenția ta și execuția planificată:
                  </p>
                  
                  <div className="diff-box" style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.75rem', backgroundColor: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px', marginBottom: '12px' }}>
                    <div style={{ color: '#E2E8F0' }}>
                      <span style={{ color: '#A7F3D0' }}>[Intenție Utilizator]:</span> Rutează de la <strong>{pendingAction.origin}</strong> prin <strong>{pendingAction.appType}</strong>.
                    </div>
                    <div style={{ color: '#E2E8F0' }}>
                      <span style={{ color: '#FCD34D' }}>[Tool Apelat]:</span> <code>generateNavigationLink(origin: "{pendingAction.origin}", appType: "{pendingAction.appType}")</code>.
                    </div>
                    <div style={{ color: '#E2E8F0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <span style={{ color: '#93C5FD' }}>[Traseu Final URL]:</span> <code title="URL destinație" style={{ fontSize: '0.7rem', color: '#60A5FA' }}>
                        {pendingAction.appType === 'Waze' 
                          ? `waze.com/ul?ll=47.02269,28.81857&navigate=yes` 
                          : `google.com/maps/dir/?api=1&origin=${encodeURIComponent(pendingAction.origin)}...`}
                      </code>
                    </div>
                  </div>

                  <div className="vibe-diff-actions" style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={handleApprove} className="btn-vibe-approve" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '8px', backgroundColor: '#10B981', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                      <Check size={14} /> Aprobă
                    </button>
                    <button onClick={handleReject} className="btn-vibe-reject" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '8px', backgroundColor: '#EF4444', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                      <X size={14} /> Respinge
                    </button>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="agent-chat-input" style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(15, 23, 42, 0.4)', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Scrie un mesaj sau o adresă de pornire..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSend();
                }}
                disabled={isThinking || !!pendingAction}
                style={{
                  flex: 1,
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  color: '#fff',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
              <button
                onClick={() => handleSend()}
                disabled={isThinking || !!pendingAction || !inputValue.trim()}
                className="btn-send-msg"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
