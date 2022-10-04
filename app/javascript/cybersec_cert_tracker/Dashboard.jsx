import React, { useEffect } from "react";
import { Button } from "reactstrap";
import DashboardTable from "./DashboardTable";
import "./table.css";
import { useStoreContext } from "./Store";
import { setUserData } from "./Actions";
import axios from "axios";
import makeData from "./makeData";

function Dashboard() {
  const { globalState, dispatch } = useStoreContext();
  const data = React.useMemo(() => makeData(100000), []);

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
      <DashboardTable data={data} />;
    </div>
  );
}

export default Dashboard;
