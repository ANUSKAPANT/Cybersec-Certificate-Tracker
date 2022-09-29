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

export default function CybersecCertTrackerApp({ data }) {
  return (
    <StoreProvider>
      <Router history={history}>
        <Routes>
          <Route
            path="/admin"
            element={
              <CybersecCertTrackerInit
                userData={data}
              ></CybersecCertTrackerInit>
            }
          />
          <Route path="/" element={<Navigate to="/admin/" />} />
        </Routes>
      </Router>
    </StoreProvider>
  );
}
