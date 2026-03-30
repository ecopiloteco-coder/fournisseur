# Ecopilot HR Admin — React Vite + Docker

Template Ecopilot converti vers **React + Vite** avec architecture feature-based (MVC Angular-style), dockerisé avec Nginx.

## 📁 Structure des dossiers

```
react/
├── public/
│   └── assets/              ← Copier depuis templ/assets/
├── src/
│   ├── components/
│   │   ├── layout/          ← Layout, Header, Sidebar
│   │   └── shared/          ← PageStub
│   └── features/            ← Architecture MVC par feature
│       ├── dashboard/       ← Dashboard, DashboardRTL, Analytics
│       ├── employee/        ← Employee
│       ├── attendance/      ← Attendance
│       ├── leave/           ← Leave
│       ├── payroll/         ← Payroll
│       ├── recruitment/     ← Recruitment
│       ├── task-management/ ← TaskManagement
│       ├── calendar/        ← CalendarPage
│       ├── chat/            ← Chat
│       ├── email/           ← Inbox, Compose, ReadEmail
│       ├── ecommerce/       ← Ecommerce
│       ├── profile/         ← Profile
│       ├── settings/        ← Settings
│       ├── roles-permissions/
│       ├── pages/           ← Pricing, Faq, Blog, Error404, ComingSoon, UnderConstruction
│       ├── charts/          ← ApexChart, ChartJs
│       ├── maps/            ← JsVectorMap, Leaflet
│       ├── forms/           ← FormElements, FormFloating, etc.
│       ├── tables/          ← TablesBasic, TablesDatatable
│       ├── components/      ← All 23 UI components (Accordion, Modal, etc.)
│       ├── extended-ui/     ← Avatar, CardAction, DragAndDrop, Swiper, Team
│       ├── icons/           ← FlatIcon, Lucide, FontAwesome
│       └── auth/
│           ├── login/       ← Login, LoginCover, LoginFrame
│           ├── register/    ← (dans AuthVariants.jsx)
│           ├── forgot-password/
│           └── new-password/
├── Dockerfile               ← Multi-stage build (Node → Nginx)
├── docker-compose.yml       ← Port 3000
├── nginx.conf               ← SPA fallback + gzip + cache
└── .dockerignore
```

## ⚙️ Prérequis

1. **Copier les assets** du template :
   ```
   templ/assets/ → react/public/assets/
   ```

2. **Installer Node.js** (v18+) depuis [nodejs.org](https://nodejs.org)

## 🚀 Démarrage local

```bash
cd react
npm install
npm run dev
# → http://localhost:5173
```

## 🐳 Démarrage avec Docker

```bash
cd react
docker compose up --build
# → http://localhost:3000
```

## 🔗 Routes disponibles

| Route | Page |
|-------|------|
| `/dashboard` | Dashboard principal |
| `/employee` | Gestion employés |
| `/attendance` | Présences |
| `/leave` | Congés |
| `/payroll` | Paie |
| `/recruitment` | Recrutement |
| `/task-management` | Tâches |
| `/analytics` | Rapports & Analytics |
| `/chat` | Chat |
| `/calendar` | Calendrier |
| `/email/inbox` | Email Inbox |
| `/auth/login` | Connexion |
| `/auth/register` | Inscription |
| Et plus... | Voir App.jsx |
