import React from "react";
import "./table.css";
import DashboardTable from "./DashboardTable";
import makeData from "./makeData";
import { Form, FormGroup, Label, Input } from 'reactstrap';

function Dashboard() {
  const data = React.useMemo(() => makeData(100000), []);

  return <>
  <Label for="exampleCustomFileBrowser">Upload CSV</Label>
  <Input type="file" id="exampleCustomFileBrowser" name="customFile" accept=".csv" multiple/>
  <DashboardTable data={data} />
  </>;
}

export default Dashboard;
