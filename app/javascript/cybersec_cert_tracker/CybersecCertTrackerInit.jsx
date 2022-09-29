import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useStoreContext } from "./Store";
import { setUserData } from "./Actions";
import { Table, Button } from "reactstrap";
import "./table.css";

function CybersecCertTrackerInit({ userData, children }) {
  const { dispatch, globalState } = useStoreContext();

  console.log(globalState.userData);

  useEffect(() => {
    setUserData(dispatch, userData);
  }, []);

  return (
    <div className="table-container">
      <h1>Hello {globalState.userData.role}!</h1>
      {globalState.userData.role == "admin" && (
        <div>
          <Button color="primary" size="lg" className="btn-1 ">
            + Import CSV
          </Button>{" "}
          <Button color="success" size="lg" className="btn-2 mx-2">
            Add Data
          </Button>
        </div>
      )}
      <Table striped hover responsive className="table mx-auto my-4">
        <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Username</th>
            <th>Username</th>
            <th>Username</th>
            <th>Username</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">1</th>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
            <td>@mdo</td>
            <td>@mdo</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <th scope="row">2</th>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
            <td>@fat</td>
            <td>@fat</td>
            <td>@fat</td>
          </tr>
          <tr>
            <th scope="row">3</th>
            <td>Larry</td>
            <td>the Bird</td>
            <td>@twitter</td>
            <td>@twitter</td>
            <td>@twitter</td>
            <td>@twitter</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
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
