import React from 'react';

import {
  BrowserRouter as Router, Route, Routes, Navigate, Redirect,
} from 'react-router-dom';
import NotificationAlert from 'react-notification-alert';
import { StoreProvider } from './Store';
import CybersecCertTrackerInit from './CybersecCertTrackerInit';
import history from './history';

export default function CybersecCertTrackerApp({ data }) {
  const notificationAlertRef = React.useRef(null);
  return (
    <>
      <div className="rna-container">
        <NotificationAlert ref={notificationAlertRef} />
      </div>
      <StoreProvider>
        <Router history={history}>
          <Routes>
            <Route path="/admin" element = {<CybersecCertTrackerInit userData={data} notificationAlertRef={notificationAlertRef}></CybersecCertTrackerInit>} 
            />
            <Route path="/" element={<Navigate to="/admin/" />} />
          </Routes>
        </Router>
      </StoreProvider>
    </>
  );
};
