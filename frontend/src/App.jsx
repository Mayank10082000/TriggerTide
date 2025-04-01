import React from "react";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import LoginPage from "./pages/LoginPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import SignupPage from "./pages/SignupPage";
import NavBar from "./components/NavBar";
import { Routes, Route, Navigate } from "react-router-dom";
import CreateFlowCanvas from "./pages/CreateFlowCanvas";
import { useAuthStore } from "./store/useAuthStore";
import { Home, Loader } from "lucide-react";

const App = () => {
  const { isCheckingAuth, authUser, checkAuth } = useAuthStore();

  React.useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser });

  if (isCheckingAuth && !authUser)
    return (
      <div>
        <Loader classname="size-10 animate-spin" />
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
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
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
          path="/reset-password/:token"
          element={!authUser ? <ResetPasswordPage /> : <Navigate to="/login" />}
        />
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;
