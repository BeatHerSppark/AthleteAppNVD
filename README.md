# Athlete360

Athlete360 is a full-stack health and performance tracking platform for athletes, built to connect doctors and patients around structured medical reports, mood tracking, and personalized recommendations.

## Overview

Doctors create detailed athlete health reports, generate AI-assisted summaries, and issue personalized training/diet/supplement recommendations. Patients track their daily mood and sleep, view their reports and recommendations, and monitor their progress over time. An admin panel manages user roles and pending account approvals.

## Tech Stack

**Backend**
- Kotlin + Spring Boot
- Spring Security with JWT authentication
- PostgreSQL with Flyway migrations
- REST API architecture
- AI integration for automated report summaries

**Frontend**
- Vue 3 + TypeScript (Composition API)
- Vue Router with role-based route guards
- Pinia
- Axios
- Bootstrap 5 for styling and layout
- Rich text editing (Quill) for report summaries
- Client-side PDF export for printable medical reports

## Features

- 🔐 Role-based authentication (Admin, Doctor, Patient) with JWT
- 🧑‍⚕️ Doctor dashboard for managing assigned patients and reports
- 📋 Detailed athlete health reports (cardiovascular, strength, body composition, lab results)
- 🤖 AI-generated report summaries with manual editing support
- 💊 Personalized recommendations (training, diet, supplements) with cost, duration, and effectiveness tracking
- 😊 Patient mood tracking with filtering, statistics, and visual charts
- 📄 Exportable, print-ready PDF report documents
- 🛠️ Admin panel for approving accounts and managing user roles
- 📱 Fully responsive UI across devices
