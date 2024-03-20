import React from "react";
import "./App.css";
import LandingPage from "./pages/LandingPage/LandingPage";
import HomePage from "./pages/HomePage/HomePage";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </>
  );
}

export default App;
