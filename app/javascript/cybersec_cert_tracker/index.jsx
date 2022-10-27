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
import { ProSidebarProvider } from "react-pro-sidebar";
import history from "./history";
import Dashboard from "./Dashboard";
import Student from "./sidebar-pages/Student";

export default function CybersecCertTrackerApp({ data }) {
  return (
    <StoreProvider>
      <ProSidebarProvider>
        <Router history={history}>
          <CybersecCertTrackerInit userData={data}>
            <Routes>
              <Route path="/dashboard">
                <Route index element={<Dashboard userData={data} />} />
                <Route path="students" element={<Student userData={data} />} />
              </Route>
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
          </CybersecCertTrackerInit>
        </Router>
      </ProSidebarProvider>
    </StoreProvider>
  );
}
