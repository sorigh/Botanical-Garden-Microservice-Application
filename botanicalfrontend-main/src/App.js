// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import Navigation from "./pages/Navigation";   // <-- import here
import PlantsPage from "./pages/PlantsPage"; 
import SpecimensPage from "./pages/SpecimensPage";
import PlantsAndSpecimensPage from "./pages/PlantsAndSpecimens";
import PersonalDataPage from "./pages/PersonalDataPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import UsersPage from "./pages/UsersPage";

import { ProtectedRoute } from "./LoginLogic/ProtectedRoute";
import { useAuth } from "./LoginLogic/useAuth";

import './i18n';

import './App.css';

function WithNavigation({ children }) {
  return (
    <div>
      <Navigation />  {/* use imported component */}
      <div style={{ marginTop: "1rem" }}>{children}</div>
    </div>
  );
}

function App() {
  const auth = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <WithNavigation>
            <HomePage />
          </WithNavigation>
        } />

        <Route path="/login-page" element={
          <WithNavigation>
            <LoginPage />
          </WithNavigation>
        } />

        <Route path="/plants" element={
          <ProtectedRoute
            allowedRoles={["ROLE_EMPLOYEE", "ROLE_MANAGER"]}
            fallback={
              <WithNavigation>
                <PlantsPage visitorMode={true} />
              </WithNavigation>
            }
          >
            <WithNavigation>
              <PlantsPage />
            </WithNavigation>
          </ProtectedRoute>
        } />

        <Route path="/specimens" element={
          <ProtectedRoute
            allowedRoles={["ROLE_EMPLOYEE", "ROLE_MANAGER"]}
            fallback={
              <WithNavigation>
                <SpecimensPage visitorMode={true} />
              </WithNavigation>
            }
          >
            <WithNavigation>
              <SpecimensPage />
            </WithNavigation>
          </ProtectedRoute>
        } />

        <Route path="/plantsandspecimens" element={
          <ProtectedRoute
            allowedRoles={["ROLE_EMPLOYEE", "ROLE_MANAGER"]}
            fallback={
              <WithNavigation>
                <PlantsAndSpecimensPage visitorMode={true} />
              </WithNavigation>
            }
          >
            <WithNavigation>
               <PlantsAndSpecimensPage manager={true} />
            </WithNavigation>
          </ProtectedRoute>
        } />

        <Route path="/personaldata" element={
          <ProtectedRoute
            allowedRoles={[
              "ROLE_USER",
              "ROLE_EMPLOYEE",
              "ROLE_MANAGER",
              "ROLE_ADMINISTRATOR",
            ]}
          >
            <WithNavigation>
              <PersonalDataPage />
            </WithNavigation>
          </ProtectedRoute>
        } />

        <Route path="/users" element={
          <ProtectedRoute allowedRoles={["ROLE_ADMINISTRATOR"]}>
            <WithNavigation>
              <UsersPage />
            </WithNavigation>
          </ProtectedRoute>
        } />

        <Route path="/dashboard" element={
          auth ? <Navigate to="/plants" replace /> : <Navigate to="/login-page" replace />
        } />
      </Routes>
    </Router>
  );
}

export default App;
