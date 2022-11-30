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
import Students from "./sidebar-pages/Students";
import Courses from "./sidebar-pages/Courses";
import Companies from "./sidebar-pages/Companies";
import CertificateVouchers from "./sidebar-pages/CertificateVouchers";
import Vendors from "./sidebar-pages/Vendors";
import Users from "./sidebar-pages/Users";
import StudentProfile from "./StudentProfile";

export default function CybersecCertTrackerApp({ data }) {
  return (
    <StoreProvider>
      <ProSidebarProvider>
        <Router history={history}>
          <CybersecCertTrackerInit userData={data}>
            <Routes>
              <Route path="/dashboard">
                <Route index element={<Dashboard userData={data} />} />
                {data.role == "admin" && (
                  <>
                    <Route path="students" element={<Students userData={data} />} />
                    <Route path="courses" element={<Courses userData={data} />} />
                    <Route
                      path="companies"
                      element={<Companies userData={data} />}
                    />
                    <Route
                      path="cert_vouchers"
                      element={<CertificateVouchers userData={data} />}
                    />
                    <Route path="vendors" element={<Vendors userData={data} />} />
                    <Route path="users" element={<Users userData={data} />} />
                  </>
                )}
              </Route>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route
                path="/student/profile"
                element={<StudentProfile userData={data} />}
              />
            </Routes>
          </CybersecCertTrackerInit>
        </Router>
      </ProSidebarProvider>
    </StoreProvider>
  );
}
