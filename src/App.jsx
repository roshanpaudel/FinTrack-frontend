import { ToastContainer } from "react-toastify";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import "./App.css"; // This line imports the CSS file

function App() {
  return (
    <div className="wrapper">
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
