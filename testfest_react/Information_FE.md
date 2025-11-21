# Frontend Documentation (testfest_react)

This directory contains the frontend application for Tingtun Testfest, built with React and Vite.

## Tech Stack

- **Framework:** [React](https://react.dev/) (v19)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Routing:** [React Router](https://reactrouter.com/) (v7)
- **HTTP Client:** [Axios](https://axios-http.com/)
- **Internationalization:** [i18next](https://www.i18next.com/) & [react-i18next](https://react.i18next.com/)
- **Styling:** CSS (Custom styles in `src/assets/styles`)

## Prerequisites

- Node.js (v16+)
- npm

## Installation

1. Navigate to the `testfest_react` directory:
   ```bash
   cd testfest_react
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Available Scripts

In the project directory, you can run:

### `npm run dev`
Runs the app in the development mode.
Open [http://localhost:5173](http://localhost:5173) to view it in your browser.
The page will reload when you make changes.

### `npm run build`
Builds the app for production to the `dist` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.


## Project Structure

```
src/
├── assets/          # Static assets (images, styles)
├── components/      # Reusable UI components (Header, ProtectedRoute, etc.)
├── config/          # Configuration files
├── context/         # React Context (AuthContext)
├── hooks/           # Custom React hooks
├── locales/         # Translation files (en, no)
├── pages/           # Page components (Home, Login, Testfester, etc.)
├── services/        # API service calls (brukerService, programService)
├── App.jsx          # Main application component with routing
├── main.jsx         # Entry point
└── i18n.js          # Internationalization configuration
```

## Key Features

- **Authentication:** Handled via `AuthContext` and `ProtectedRoute`.
- **Routing:** Client-side routing using `react-router-dom`.
- **Localization:** Support for multiple languages (English and Norwegian) using `i18next`.
- **API Integration:** `axios` is used to communicate with the backend API.

## Configuration

- **Vite Config:** `vite.config.js` handles the build configuration.
- **ESLint:** `eslint.config.js` handles linting rules.
