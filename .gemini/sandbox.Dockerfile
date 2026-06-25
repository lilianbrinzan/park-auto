FROM google/gemini-cli-sandbox:latest

# Instalăm Node.js și uneltele necesare pentru proiectul parcului auto
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Setăm directorul de lucru în interiorul containerului
WORKDIR /workspace

# Utilizatorul cu drepturi reduse pentru a preveni accesul root pe gazdă
USER sandboxuser
