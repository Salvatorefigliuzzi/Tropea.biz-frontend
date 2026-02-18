# Analisi Frontend - 1GKR Project

## 1. Panoramica del Progetto
Il frontend è una Single Page Application (SPA) moderna sviluppata con **React 19** e **TypeScript**, costruita utilizzando **Vite 7** per garantire performance elevate in fase di sviluppo e build. L'applicazione gestisce un'interfaccia amministrativa complessa per la gestione di utenti, ruoli e permessi (RBAC), interfacciandosi con le API REST del backend.

## 2. Stack Tecnologico & Dipendenze

### Core
*   **Framework**: React v19.2.0
*   **Language**: TypeScript v5.9
*   **Build Tool**: Vite v7.2.4
*   **State Management**: Redux Toolkit + React Redux

### UI & Styling
*   **Framework CSS**: Bootstrap v5.3 + React Bootstrap
*   **Styling Custom**: SCSS (Sass) con override delle variabili Bootstrap.
*   **Icone**: React Icons (`react-icons/fa` - FontAwesome).
*   **Notifiche**: React Toastify.

### Networking & Routing
*   **Routing**: React Router DOM v7.13.0.
*   **HTTP Client**: Axios v1.13.4 con interceptor per JWT.

## 3. Struttura delle Cartelle

```text
src/
├── api/            # Wrapper per le chiamate API (authApi, usersApi, etc.)
├── components/     # Componenti riutilizzabili divisi per dominio
│   ├── common/     # Modali generici (ConfirmationModal)
│   ├── users/      # Componenti specifici (UserModal, UsersRuoliModal)
│   └── ...
├── features/       # Slice Redux (authSlice)
├── hooks/          # Custom hooks (useAppDispatch, useAppSelector)
├── layouts/        # Layout principali (MainLayout, DashboardLayout)
├── pages/          # Pagine dell'applicazione
│   ├── protected/  # Pagine dashboard (Home, Users, Ruoli)
│   └── public/     # Pagine pubbliche (Login, Register, Landing)
├── routes/         # Definizione delle rotte (AppRoutes)
├── store/          # Configurazione dello store Redux
├── styles/         # File SCSS globali e variabili
├── types/          # Definizioni dei tipi TypeScript
└── utils/          # Funzioni di utilità (passwordValidation)
```

## 4. Architettura e Flussi di Dati

### State Management (Redux)
L'applicazione utilizza un approccio ibrido per la gestione dello stato:
1.  **Global State (Redux)**: Utilizzato per lo stato dell'autenticazione (`authSlice`). Gestisce il token JWT, il refresh token, le informazioni dell'utente corrente e i suoi permessi/gruppi.
2.  **Local State (React `useState`)**: Utilizzato per la gestione dei dati specifici delle pagine (es. lista utenti in `Users.tsx`), stato dei form, modali e filtri di ricerca.

### Autenticazione & Sicurezza
*   **JWT Handling**: Il token di accesso viene salvato in memoria (Redux) e `localStorage`.
*   **Interceptors**: `axiosClient.ts` intercetta ogni richiesta per aggiungere l'header `Authorization: Bearer <token>`.
*   **Auto-Refresh**: Se una richiesta fallisce con 401, l'interceptor tenta automaticamente il refresh del token usando il `refreshToken` e riprova la richiesta originale.
*   **Protected Routes**: Il componente `ProtectedRoute` verifica l'autenticazione. Implementa una logica specifica: se l'utente ha solo il ruolo "USER", viene reindirizzato alla Home pubblica invece che alla Dashboard.

### Routing
*   `/`: Layout pubblico (`MainLayout`) per Landing Page e Auth.
*   `/dashboard`: Layout protetto (`DashboardLayout`) con Sidebar dinamica basata sui gruppi di permessi dell'utente.

## 5. Componenti e UI

### Layouts
*   **DashboardLayout**: Implementa una Sidebar responsive e collassabile. Il menu viene generato dinamicamente in base ai `groups` presenti nello stato Redux dell'utente, garantendo che l'utente veda solo le sezioni per cui ha i permessi.

### Modali
L'interazione per creazione/modifica avviene tramite Modali (es. `UserModal`).
*   Gestiti tramite props `show`, `onHide`, `onSubmit`.
*   Validazione manuale dei form (es. controllo password in `UserModal`).

## 6. Configurazione Build (Vite)

Il file `vite.config.ts` è ottimizzato per la produzione:
*   **Proxy**: Redireziona `/api` su `http://localhost:3000` per evitare problemi di CORS in sviluppo.
*   **Code Splitting**: Configurazione `manualChunks` per separare le dipendenze (vendor) in chunk specifici (`react-vendor`, `ui-vendor`, `icons-vendor`), migliorando il caching e i tempi di caricamento.
*   **SCSS**: Configurato per gestire i warning di deprecazione delle nuove versioni di Sass.

## 7. Modus Operandi & Workflow

### Convenzioni di Codice
*   **Naming**: PascalCase per componenti (`UserModal.tsx`), camelCase per funzioni e variabili.
*   **Tipi**: Uso estensivo di TypeScript. Le interfacce sono definite in `src/types/` e importate dove necessario (`type User`, `type CreateUserPayload`).
*   **Import**: Importazioni assolute non configurate esplicitamente (uso di `../../`), si consiglia l'uso di alias `@/` per pulizia futura.

### Strategia di Sviluppo (Workflow)
1.  **API Integration**: Creare prima le funzioni in `src/api/` tipizzate correttamente.
2.  **Redux (se necessario)**: Se il dato è globale, creare/aggiornare uno slice in `src/features/`.
3.  **UI Component**: Creare il componente (es. Modal) in `src/components/` con props tipizzate.
4.  **Page Implementation**: Assemblare il tutto nella pagina (`src/pages/`), gestendo il fetching dei dati con `useEffect` e stati di `loading`/`error`.
5.  **Styling**: Utilizzare classi Bootstrap per il layout e classi custom (definite in `main.scss`) per dettagli specifici.

### Gestione Errori
*   Gli errori API vengono catturati nei blocchi `try/catch` all'interno delle pagine o thunk.
*   Feedback utente immediato tramite `react-toastify` (es. `toast.error('Errore nel caricamento')`).

### Deployment
*   Build di produzione tramite `npm run build` che genera la cartella `dist/`.
*   La cartella `dist/` contiene asset statici ottimizzati pronti per essere serviti da Nginx, Apache o un servizio statico (Vercel, Netlify).

### Best Practices Implementate
*   **Separazione Logica/UI**: Le chiamate API sono separate dai componenti UI.
*   **Responsive Design**: Utilizzo delle classi grid di Bootstrap.
*   **Security**: Nessuna esposizione di dati sensibili lato client; gestione sicura dei token.
*   **Performance**: Lazy loading dei moduli (chunking) e debounce sulla ricerca utenti.
