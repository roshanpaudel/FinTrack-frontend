# Basic Finance Tracker – Frontend (React)

This is the **frontend** for a simple finance tracking web application built with React. It allows users to track income and expenses, view summaries, and manage their transactions with an intuitive and responsive user interface.

---

## Features

- User registration and login (via JWT authentication)
- Add, edit, and delete income and expense transactions
- Filter transactions by date and type
- Dashboard showing total income, expenses, and balance
- Responsive and clean UI with modern design
- React Context API for global state management

---

## Tech Stack

- **Frontend:** React, React Router, Context API
- **HTTP Requests:** Axios
- **Styling:** CSS Modules / Tailwind / or your preferred styling solution
- **State Management:** React useState and useContext

---

## Getting Started

### Prerequisites

- **Node.js** and **npm** or **Yarn** installed

### Installation

1. Clone the repository:

```bash
git clone https://github.com/roshanpaudel/FinTrack-frontend.git
cd FinTrack-frontend
```

2. Install frontend dependencies:

```bash
npm install
# or
yarn install
```

3. Start the React development server:

```bash
npm start
# or
yarn start
```

By default, the app runs on:  
**http://localhost:3000**

Make sure the backend API is running at **http://localhost:5000** or update the API base URL in the frontend code accordingly.

---

## Folder Structure

```bash
frontend/
├── public/               # Static files
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/            # App pages (Login, Dashboard, etc.)
│   ├── context/          # React context for auth and global state
│   ├── App.js            # Main app component
│   ├── index.js          # Entry point
├── .env                  # (Optional) Environment variables
├── package.json
```

---

## Usage

- Register a new user account
- Log in to access your dashboard
- Add transactions (amount, type, category, description)
- Edit or delete existing transactions
- Filter transactions by date or type
- View total income, expenses, and current balance on the dashboard

---

## License

This project is licensed under the **MIT License**.

---

## Contact

For any questions or suggestions, feel free to open an issue or contact:  
📧 **paudelroshan93@gmail.com**
