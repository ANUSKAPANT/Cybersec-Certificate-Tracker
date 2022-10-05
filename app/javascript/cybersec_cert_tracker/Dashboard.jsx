import React, { useEffect } from "react";
import { Button } from "reactstrap";
import "./table.css";
import { useStoreContext } from "./Store";
import { setUserData } from "./Actions";

function Dashboard() {
  const { globalState, dispatch } = useStoreContext();

  return <div>Dashboard</div>;
}

export default Dashboard;
