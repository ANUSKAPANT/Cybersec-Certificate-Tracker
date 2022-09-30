import React from "react";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { StoreProvider } from "./Store";
import CybersecCertTrackerInit from "./CybersecCertTrackerInit";

import history from "./history";
import Dashboard from "./Dashboard";

export default function CybersecCertTrackerApp({ data }) {
  return (
    <StoreProvider>
      <CybersecCertTrackerInit userData={data}>
        <Router history={history}>
          <Routes>
            <Route path="/dashboard" element={<Dashboard></Dashboard>} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Router>
      </CybersecCertTrackerInit>
    </StoreProvider>
  );
}
