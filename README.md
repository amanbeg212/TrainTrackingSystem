# 🚆 TrainTrackingSystem (RailGaadi)

A real-time Indian Railways tracking platform and journey intelligence system inspired by Apple Maps and Flightradar24. Built with React 18, Vite, Tailwind CSS, TypeScript, MapLibre GL, and Express.

---

## 🌟 Key Features

- **🔴 Live Indian Railways Telemetry**: Real-time train positions, speedometers, delay predictions, next halt ETAs, and station schedule progression across 13,500+ trains.
- **🗺️ Interactive MapLibre & MapTiler Integration**: High-resolution vector railway tracks with curvature, completed route glow effects, interactive halt popups, dark/light map toggles, full-screen mode, and camera follow.
- **⚡ Smart Search Normalization**: Search by train number (e.g. `12951`, `#12951`), train name (e.g. `Rajdhani`, `Vande Bharat`), or railway station codes (`NDLS`, `MMCT`, `CSMT`, `HWH`, `SBC`, etc.).
- **🌤️ Atmospheric Weather & Topography**: Station weather conditions (temperature, feels-like, humidity, wind, hourly rain forecast) alongside NASA SRTM 30m route elevation profiles.
- **📍 Geographical Landmarks**: Live Overpass QL queries discovering nearby rivers, lakes, mountains, ghats, bridges, and monuments along the railway corridor.
- **🔗 Journey Sharing & Favourites**: Generate public shareable read-only live tracking links (`/journey/:id`) and manage favorite trains with localStorage persistence.

---

## 📂 Project Architecture

```
TrainTrackingSystem/
├── backend/                  # Standalone Node.js + Express + TypeScript API
│   ├── src/
│   │   ├── config/           # API Keys & rate limit configuration
│   │   ├── middleware/       # Security headers, rate limiting, error handling
│   │   ├── providers/        # RailRadar, OpenWeather, OpenTopography, Overpass
│   │   ├── routes/           # /api/trains, /api/weather, /api/geo, /api/share
│   │   ├── services/         # Journey, analytics, companion services
│   │   ├── types/            # Backend types & API schemas
│   │   ├── app.ts            # Express setup & static SPA fallback
│   │   └── server.ts         # Server entry point
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                 # Standalone React 18 + Vite + Tailwind Client
│   ├── src/
│   │   ├── api/              # API fetch client
│   │   ├── components/       # MapLibre railway map & UI components
│   │   ├── features/         # Search, journey, companion, analytics, sharing
│   │   ├── pages/            # HomePage, JourneyPage, SharedJourneyPage
│   │   ├── types/            # Frontend interfaces & schemas
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── .env.example              # Environment variables template
├── package.json              # Root workspace runner
└── README.md
```

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js**: v18 or newer
- **npm**: v9 or newer

### 2. Installation
Install all dependencies across the root, backend, and frontend:
```bash
npm run install:all
```

### 3. Environment Setup
Create a `.env` file in the root directory (and `backend/.env`):
```bash
cp .env.example .env
```
Fill in your API keys:
- `RAILRADAR_API_KEY`: Real-time train telemetry
- `MAPTILER_API_KEY`: MapLibre vector tiles
- `OPENWEATHER_API_KEY`: Station weather conditions
- `OPENTOPOGRAPHY_API_KEY`: Elevation profiles

### 4. Running the Development Servers

#### Option A: Run Both Concurrently (Recommended)
```bash
npm run dev
```
- **Frontend App**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:4000](http://localhost:4000)

#### Option B: Run in Separate Terminals
```bash
# Terminal 1 - Backend API (port 4000)
cd backend
npm run dev

# Terminal 2 - Frontend App (port 3000)
cd frontend
npm run dev
```

---

## 🛠️ Build Commands

- **Build Full Project**: `npm run build`
- **Build Backend Only**: `npm run build:backend` (or `cd backend && npm run build`)
- **Build Frontend Only**: `npm run build:frontend` (or `cd frontend && npm run build`)

---

## 📄 License
MIT License. Built for Indian Railways passengers and railway enthusiasts.
