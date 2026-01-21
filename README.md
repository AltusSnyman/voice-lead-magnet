# Voice Lead Magnet for Netlify 🎙️

A "Siri-like" Voice AI Agent generator that runs entirely in the browser using React, Vite, and Google's Gemini Live API (WebSockets).

**Demo Features:**
- ⚡ **Zero Backend**: Runs 100% on the client-side (deployable to Netlify).
- 🧠 **Dynamic Persona**: Takes user input (business name, services, etc.) and creates a custom AI receptionist.
- 🗣️ **Real-time Voice**: Uses Gemini Live 2.0 Flash for low-latency voice conversations.

## 🚀 Setup & Installation

### 1. Clone the repo
```bash
git clone https://github.com/AltusSnyman/voice-lead-magnet.git
cd voice-lead-magnet
npm install
```

### 2. Configure API Key 🔑
You must provide a valid Gemini API Key for the app to connect.

**Option A: Local Development**
Create a `.env` file in the root directory:
```bash
VITE_GEMINI_API_KEY=AIzaSy...YourKeyHere
```

**Option B: Netlify Deployment**
In your Netlify Dashboard:
1.  Go to **Site Settings** > **Environment variables**.
2.  Add a new variable:
    -   Key: `VITE_GEMINI_API_KEY`
    -   Value: `AIzaSy...`

### 3. Run Locally
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
# The 'dist' folder is ready for deployment
```

## ⚠️ Important Note
This application uses the API Key **directly in the browser** (Client-Side).
-   **For Demos**: This is fine.
-   **For Production**: You should ideally proxy the WebSocket connection through a backend to keep your API Key secret. However, for a "Lead Magnet" or simple demo running on Netlify, this client-side approach prevents the need for complex server infrastructure.

## Project Structure
-   `src/pages/Onboarding.tsx`: The form that captures business details.
-   `src/pages/Agent.tsx`: The voice agent interface.
-   `src/lib/gemini-live.ts`: WebSocket client logic for Gemini.
-   `src/store/useBusinessStore.ts`: LocalStorage persistence for "Sticky Sessions".
