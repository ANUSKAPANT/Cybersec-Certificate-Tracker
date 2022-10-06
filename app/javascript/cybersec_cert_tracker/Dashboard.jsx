import React from "react";
import "./table.css";
import DashboardTable from "./DashboardTable";
import makeData from "./makeData";

function Dashboard() {
  const data = React.useMemo(() => makeData(100000), []);

  return <DashboardTable data={data} />;
}

export default Dashboard;
