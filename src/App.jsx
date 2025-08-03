import "./App.css";
import { Button } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route index element={<Login />}>
        <ToastContainer />
      </Route>
    </Routes>
  );
}

export default App;
