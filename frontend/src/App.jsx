import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";

import Navbar from "./components/Navbar";

function App() {
  return (
     <BrowserRouter>
     <div className="min-h-screen bg-gray-100 text-white relative overflow-hidden">
      
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;