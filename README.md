# Bakery Bot

An agentic bot that can order bakery items.

## 🚀 Getting Started

### 1) Prerequisites

- **Node.js 18+** (recommended)
- **pnpm** (as the project is configured for pnpm package manager)

### 2) Install dependencies

```bash
pnpm install
```

### 3) Create a `.env` file

Create a `.env` file in the project root and supply the required ElevenLabs settings.

> **Note:** The project is configured to expose `ELEVENLABS_*` variables to the client via Vite (`envPrefix` includes `ELEVENLABS_`).

```env
# Your ElevenLabs API key
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here

# The phone number ID you want to use for outbound calls (Twilio integration)
ELEVENLABS_PHONE_NUMBER_ID=your_phone_number_id_here
```

### 4) Run the development server

```bash
pnpm dev
```

Then open the app at: `http://localhost:5173`

## 🛠️ Common commands

- Run in development mode: `pnpm dev`
- Build for production: `pnpm build`
- Preview production build: `pnpm preview`
- Update the agent configuration (uses `.env`): `pnpm run update-agent`

## 🔐 Environment variables summary

- `ELEVENLABS_API_KEY` – required for the ElevenLabs SDK and API calls.
- `ELEVENLABS_PHONE_NUMBER_ID` – required for making outbound calls through the ElevenLabs-Twilio integration.
