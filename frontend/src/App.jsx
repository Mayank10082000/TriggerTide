import React from "react";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import LoginPage from "./pages/LoginPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage"; // Added missing import
import NavBar from "./components/NavBar";
import { Routes, Route, Navigate } from "react-router-dom";
import CreateFlowCanvas from "./pages/CreateFlowCanvas";
import { useAuthStore } from "./store/useAuthStore";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast"; // Added missing Toaster import

const App = () => {
  const { isCheckingAuth, authUser, checkAuth } = useAuthStore();

  React.useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser });

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div>
      <NavBar />

      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignupPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/create-flow"
          element={authUser ? <CreateFlowCanvas /> : <Navigate to="/login" />}
        />
        <Route
          path="/forgot-password"
          element={
            !authUser ? <ForgotPasswordPage /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/reset-password/:resetToken"
          element={!authUser ? <ResetPasswordPage /> : <Navigate to="/login" />}
        />
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;
