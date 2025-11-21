# Tingtun Testfest - Refactored Version

This is a new and improved (refactored) version of **testfest.no**, a web application for managing "Testfests"-events where website owners and users with disabilities collaborate to test and improve digital services.

## About Testfest

The goal of Testfests is to come together in a pleasant setting to find, understand, and remove errors on websites. Participants include:
- **Website Owners** from various organizations.
- **Users with disabilities** who test using assistive technologies like screen readers, magnification software.

## Key Features

### 📅 **Event & Program Management**
- **Testfest Events:** View upcoming and past events with detailed information.
- **Program Schedule:** Manage and view the schedule for each event.
- **Admin Dashboard:** Comprehensive dashboard for administrators to manage users and programs.

### 👥 **User Management**
- **Role-based Access:** Support for Administrators (SuperUsers), users and guests.
- **Secure Authentication:** JWT-based login system with secure cookie handling.
- **User Administration:** Admins can create, edit, and delete users directly from the dashboard.

### ♿ **Accessibility First**
- **High Contrast:** Optimized color contrast for better readability.
- **Keyboard Navigation:** Enhanced focus visibility and logical tab order.
- **Screen Reader Support:** Built with semantic HTML and ARIA labels where necessary.
- **Consistent Layout:** Predictable navigation and structure across all pages.

### 🌍 **Internationalization**
- **Bilingual Support:** Fully localized for both Norwegian (Bokmål) and English.
- **Language Switcher:** Easy toggling between languages.

## Technical Platform

The project is structured as a monorepo containing a Node.js backend and a React frontend.

- **Frontend:** React (v19), Vite, React Router, Axios, i18next.
- **Backend:** Node.js, Express, MySQL/MariaDB, JWT Authentication.

## Documentation & Setup

For detailed information on setup, installation, and running the application, please refer to the documentation in the respective folders:

- **Frontend (testfest_react):** [Information_FE.md](./testfest_react/Information_FE.md)
- **Backend (backend):** [Information_BE.md](./backend/Information_BE.md)

## Improvements in this Version

### 🎨 **Design**
- Clean and professional design with consistent styling.
- Improved navigation with clear hover effects.
- Responsive design that works seamlessly on all devices.

### 🔧 **Technical**
- **Modern Stack:** Upgraded to React 19 and Vite for faster development and better performance.
- **Code Quality:** Refactored codebase with cleaner component structure and consistent coding standards.
- **Security:** Improved security with input validation.