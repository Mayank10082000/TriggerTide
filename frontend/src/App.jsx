import React from "react";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import LoginPage from "./pages/LoginPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import SignupPage from "./pages/SignupPage";
import NavBar from "./components/NavBar";
import { Routes, Route } from "react-router-dom";
import CreateFlowCanvas from "./pages/CreateFlowCanvas";

const App = () => {
  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token?" element={<ResetPasswordPage />} />
        <Route path="/create-flow" element={<CreateFlowCanvas />} />
      </Routes>
    </div>
  );
};

export default App;
