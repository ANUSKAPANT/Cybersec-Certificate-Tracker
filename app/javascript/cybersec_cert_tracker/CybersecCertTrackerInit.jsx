import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useStoreContext } from './Store';
import {
  setUserData, setNotificationRef,
} from './Actions';


function CybersecCertTrackerInit({ userData, children, notificationAlertRef }) {
  const { dispatch } = useStoreContext();

  useEffect(
    () => {
      setUserData(dispatch, userData);
      setNotificationRef(dispatch, notificationAlertRef);
    },
    [],
  );

  return (
    <>
      {children}
    </>
  );
}
export default CybersecCertTrackerInit;

CybersecCertTrackerInit.propTypes = {
  children: PropTypes.node,
  userData: PropTypes.shape({
    role: PropTypes.string,
  }),
  notificationAlertRef: PropTypes.shape({}).isRequired,
};

CybersecCertTrackerInit.defaultProps = {
  children: null,
  userData: {},
};
