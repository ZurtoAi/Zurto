import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import Landing from "./pages/Landing";
import LandingModern from "./pages/LandingModern";
import NewLanding from "./pages/NewLanding";
import DashboardModern from "./pages/DashboardModern";
import SignIn from "./pages/SignIn";
import ProjectPicker from "./pages/ProjectPicker";
import CanvasView from "./pages/CanvasView";
import AdminPanel from "./pages/AdminPanel";
import Legal from "./pages/Legal";
import NotFound from "./pages/NotFound";
import {
  applyPerformanceClass,
  watchPerformancePreferences,
} from "./utils/performanceDetection";
// Global CSS must be imported first to define CSS variables
import "./styles/global.css";
import "./App.css";

function App() {
  // Apply performance detection on mount
  useEffect(() => {
    const capabilities = applyPerformanceClass();
    console.log("🎮 Performance detected:", capabilities);

    // Watch for preference changes
    const cleanup = watchPerformancePreferences((newCapabilities) => {
      console.log("🎮 Performance preferences changed:", newCapabilities);
    });

    return cleanup;
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<LandingModern />} />
              <Route path="/landing-old" element={<Landing />} />
              <Route path="/newlanding" element={<NewLanding />} />
              <Route path="/signin" element={<SignIn />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardModern />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/projects"
                element={
                  <ProtectedRoute>
                    <ProjectPicker />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/canvas/:projectId"
                element={
                  <ProtectedRoute>
                    <ErrorBoundary>
                      <CanvasView />
                    </ErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/legal/:page" element={<Legal />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
