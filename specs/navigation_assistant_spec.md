# Specificație: Asistent de Navigație Inteligent (Agent AI)

Această specificație BDD (Behavior-Driven Development) folosește sintaxa Gherkin pentru a defini comportamentul asistentului de navigare din platforma **park-auto**.

## Caracteristici Generale
Asistentul AI trebuie să ofere utilizatorului îndrumări privind navigația către locația parcării (strada Sfatul Țării nr. 2, Chișinău), să preia aplicația de navigație dorită (Google Maps, Waze, Parkopedia) și să genereze linkul de redirecționare corespunzător. Pentru securitate, se aplică un motor de politici și un pas de confirmare (Vibe Diff) înainte de a executa navigația.

---

## Scenarii BDD

### Scenario 1: Utilizatorul cere indicații din Chișinău folosind Google Maps
  Given utilizatorul deschide chat-ul cu asistentul AI
  When utilizatorul scrie: "Cum ajung din sectorul Botanica cu Google Maps?"
  Then asistentul analizează cererea și identifică:
    | Parametru | Valoare      |
    | Origin    | Botanica     |
    | AppType   | Google Maps  |
  And asistentul propune acțiunea `generateNavigationLink` cu parametrii identificați
  And asistentul afișează panoul de aprobare "Vibe Diff"
  When utilizatorul apasă butonul "Aprobă traseul"
  Then asistentul deschide aplicația Google Maps configurată pentru ruta Botanica -> Sfatul Țării 2
  And asistentul adaugă în chat un mesaj de succes cu link-ul generat.

### Scenario 2: Utilizatorul cere indicații fără a specifica aplicația preferată
  Given utilizatorul deschide chat-ul cu asistentul AI
  When utilizatorul scrie: "Cum ajung la voi din Bălți?"
  Then asistentul observă că nu a fost specificată o aplicație de navigație
  And asistentul întreabă utilizatorul: "Ce aplicație de navigare preferați să folosiți? (Google Maps sau Waze?)"
  When utilizatorul răspunde: "Waze"
  Then asistentul continuă procesul propunând acțiunea `generateNavigationLink` pentru Waze cu originea "Bălți".

### Scenario 3: Tentativă de Prompt Injection sau Scurgere de Date Sensibile (PII)
  Given utilizatorul deschide chat-ul cu asistentul AI
  When utilizatorul introduce o adresă de e-mail sau date cu caracter personal, de exemplu: "Trimite indicațiile pentru navigare de la biroul meu la adresa ion.popescu@companie.md"
  Then Policy Engine (Semantic Gating) interceptează solicitarea înainte ca agentul să proceseze datele
  And solicitarea este blocată din motive de confidențialitate (PII Detectat)
  And asistentul afișează un mesaj de eroare: "Solicitare respinsă. Politica de securitate interzice partajarea de date cu caracter personal (adrese de e-mail)."
