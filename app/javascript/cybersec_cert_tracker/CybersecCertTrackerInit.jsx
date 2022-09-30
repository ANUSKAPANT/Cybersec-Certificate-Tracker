import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useStoreContext } from "./Store";
import { setUserData } from "./Actions";

function CybersecCertTrackerInit({ userData, children }) {
  const { dispatch } = useStoreContext();

  useEffect(() => {
    setUserData(dispatch, userData);
  }, []);

  return <>{children}</>;
}
export default CybersecCertTrackerInit;

CybersecCertTrackerInit.propTypes = {
  children: PropTypes.node,
  userData: PropTypes.shape({
    role: PropTypes.string,
  }),
};

CybersecCertTrackerInit.defaultProps = {
  children: null,
  userData: {},
};
