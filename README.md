# 🚀 Shiftly Employee Management System (EMS) Frontend

Welcome to the **Shiftly Employee Management System (EMS)** – a modern, feature-rich, and visually stunning platform for managing employees, projects, timesheets, events, and more. Built with Next.js, MUI, and Tailwind CSS, this app is designed for scalability, performance, and a delightful user experience.

---

## 📸 Preview

![Shiftly EMS Dashboard Preview](public/calendar.png)

---

## 📝 Table of Contents
- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [License](#license)

---

## 🧐 About

**Shiftly EMS** is a comprehensive Employee Management System designed to streamline HR, project, and organizational workflows. It offers:
- Employee profiles & onboarding
- Project & team management
- Timesheet tracking & approvals
- Leave, claim, and letter requests
- Event management & gamification (star points, goals)
- Modern, responsive UI with dark/light mode

---

## ✨ Features

- **Dashboard**: Personalized greetings, motivational quotes, animated progress, to-dos, goals, star points, and event highlights.
- **Employee Management**: View and edit employee profiles, including personal info, experience, education, and skills.
- **Organization**: Visual org chart and team breakdowns.
- **Project Management**: Browse all projects, view details, and manage teams.
- **Timesheet**: Submit, review, and approve timesheets with project breakdowns.
- **Leave Management**: Apply for leave, view leave balances, and track leave history.
- **Claims**: Submit and track expense/medical claims.
- **Letters**: Request official letters (e.g., employment, salary confirmation) and view request history.
- **Events**: Join, create, and view company events and activities.
- **Referrals**: Refer candidates for open positions.
- **Gamification**: Earn star points, set and complete goals, and track progress with confetti and badges.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **UI**: [MUI (Material UI)](https://mui.com/), [Tailwind CSS](https://tailwindcss.com/)
- **State & Forms**: React Context, Formik, Yup
- **Animation**: Framer Motion, canvas-confetti
- **Icons**: MUI Icons, FontAwesome, Heroicons
- **HTTP**: Axios
- **Date/Time**: Day.js
- **Other**: Styled Components, Toolpad Core

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone <repo-url>
cd ems-frontend
```

### 2. Install dependencies
```bash
npm install
# or
yarn install
```

### 3. Run the development server
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 📁 Project Structure

```
ems-frontend/
├── public/                  # Static assets (images, logos, etc.)
├── src/
│   ├── app/
│   │   ├── _components/     # Shared UI components (dialogs, header, inputs, landing)
│   │   ├── _hooks/          # Custom React hooks
│   │   ├── _utils/          # Utilities (API paths, axios, constants, navigation)
│   │   ├── (main)/          # Main app modules
│   │   │   ├── dashboard/   # Dashboard and widgets
│   │   │   ├── employee/    # Employee profile, info, experience, education, skills
│   │   │   ├── organization/# Org chart and teams
│   │   │   ├── project/     # Project management
│   │   │   ├── timesheet/   # Timesheet submission/review
│   │   │   ├── leave/       # Leave requests/history
│   │   │   ├── claim/       # Claim submission/history
│   │   │   ├── letter/      # Letter requests/history
│   │   │   ├── events/      # Event management
│   │   │   ├── refer/       # Candidate referrals
│   │   ├── context/         # Auth context and actions
│   │   ├── globals.css      # Global styles
│   │   ├── layout.jsx       # App layout and theming
│   │   └── page.jsx         # Landing page
│   └── theme.js             # MUI theme customization
├── package.json             # Project metadata and scripts
├── postcss.config.mjs       # PostCSS config
├── tailwind.config.js       # Tailwind CSS config (if present)
├── jsconfig.json            # JS config for path aliases
└── README.md                # This file
```

---

## 🧩 Key Modules & Pages

- **Dashboard**: `/dashboard` – Overview, progress, to-dos, goals, events, star points
- **Employee Profile**: `/employee/profile` – Personal info, experience, education, skills
- **Organization**: `/organization` – Org chart, teams, members
- **Projects**: `/project/all-projects`, `/project/my-projects` – Project details, teams
- **Timesheet**: `/timesheet/update-timesheet`, `/timesheet/review-timesheet` – Submit/review timesheets
- **Leave**: `/leave/request-leave`, `/leave/leave-history` – Apply for/view leave
- **Claims**: `/claim/claim-submission`, `/claim/claim-history` – Submit/view claims
- **Letters**: `/letter/request-letter`, `/letter/request-history` – Request/view letters
- **Events**: `/events/add-event`, `/events/event-history` – Add/join/view events
- **Refer**: `/refer` – Refer candidates

---

## 📦 Scripts

- `npm run dev` – Start development server
- `npm run build` – Build for production
- `npm start` – Start production server
- `npm run lint` – Run ESLint

---

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## 🙏 Credits

- Designed and developed by the Creative Software team.
- Special thanks to all contributors and the open-source community!

---

> _"The only way to do great work is to love what you do."_ – Steve Jobs
