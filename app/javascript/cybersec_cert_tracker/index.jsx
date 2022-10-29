import React from "react";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Redirect,
} from "react-router-dom";
import { StoreProvider } from "./Store";
import CybersecCertTrackerInit from "./CybersecCertTrackerInit";

import history from "./history";
import Dashboard from "./Dashboard";
import StudentProfile from "./StudentProfile";

export default function CybersecCertTrackerApp({ data }) {
  return (
    <StoreProvider>
      <CybersecCertTrackerInit userData={data}>
        <Router history={history}>
          <Routes>
            <Route path="/dashboard" element={<Dashboard userData={data}/>} />
            <Route path="/student/profile" element={<StudentProfile userData={data}/>} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Router>
      </CybersecCertTrackerInit>
    </StoreProvider>
  );
}
