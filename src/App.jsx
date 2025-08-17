import { ToastContainer } from "react-toastify";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import "./App.css"; // This line imports the CSS file
import Signup from "./pages/Signup";

function App() {
  return (
    <div className="wrapper">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
