import { ToastContainer } from "react-toastify";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import "./App.css"; // This line imports the CSS file
import Signup from "./pages/Signup";
import Dashboard from "./pages/dashboard";
import { DefaultLayout } from "./layouts/DefaultLayout";
import PrivateRoute from "./components/PrivateRoute";
function App() {
  return (
    <div className="wrapper">
      <Routes>
        <Route path="/" element={<DefaultLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* protected routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            {/* <Route path="/transactions" element={/* transactions page */} />
            <Route path="/profile" element={/* profile page */} /> */}
          </Route>

          <Route index element={<Dashboard />} />
        </Route>
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
