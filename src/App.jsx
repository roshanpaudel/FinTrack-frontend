import { ToastContainer } from "react-toastify";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import "./App.css"; // This line imports the CSS file
import Signup from "./pages/Signup";
import Dashboard from "./pages/dashboard";
import Transactions from "./pages/transactions";
import Profile from "./pages/Profile";
import { DefaultLayout } from "./layouts/DefaultLayout";
import PrivateRoute from "./components/PrivateRoute";
function App() {
  return (
    <div className="wrapper">
      <Routes>
        <Route path="/" element={<DefaultLayout />}>
          {/* Roshan: Base app routing under the default layout. */}
          {/* Codex: Default to the protected dashboard for the app root. */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          {/* Codex: Auth routes stay public. */}
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          {/* Codex: Protect dashboard behind PrivateRoute. */}
          <Route element={<PrivateRoute />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
