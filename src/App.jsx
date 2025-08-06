import { ToastContainer } from "react-toastify";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import "./App.css"; // This line imports the CSS file
import Signup from "./pages/Signup";

const quotes = [
  {
    quote: "Price is what you pay; value is what you get.",
    author: "Warren Buffett",
  },
  {
    quote:
      "Do not save what is left after spending, but spend what is left after saving.",
    author: "Warren Buffett",
  },
  {
    quote:
      "It's not your salary that makes you rich; it's your spending habits.",
    author: "Charles A. Jaffe",
  },
  {
    quote: "Beware of little expenses; a small leak will sink a great ship.",
    author: "Benjamin Franklin",
  },
  {
    quote: "Money is a terrible master but an excellent servant.",
    author: "P.T. Barnum",
  },
  {
    quote:
      "You must gain control over your money, or the lack of it will forever control you.",
    author: "Dave Ramsey",
  },
  {
    quote:
      "The stock market is filled with individuals who know the price of everything, but the value of nothing.",
    author: "Philip Fisher",
  },
  {
    quote: "An investment in knowledge pays the best interest.",
    author: "Benjamin Franklin",
  },
  {
    quote:
      "A budget is telling your money where to go instead of wondering where it went.",
    author: "John C. Maxwell",
  },
  {
    quote:
      "Financial freedom is available to those who learn about it and work for it.",
    author: "Robert Kiyosaki",
  },
];
function App() {
  return (
    <div className="wrapper">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
