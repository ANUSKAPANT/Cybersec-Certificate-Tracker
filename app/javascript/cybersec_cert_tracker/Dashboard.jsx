import React from "react";
import "./table.css";
import DashboardTable from "./DashboardTable";
import makeData from "./makeData";
import { Form, FormGroup, Label, Input } from 'reactstrap';
import axios from "axios";

function Dashboard() {
  const data = React.useMemo(() => makeData(100000), []);

  const fileUpload = async (event) => {
    let csrf;

    if (document.querySelector("meta[name='csrf-token']"))
      csrf = document
        .querySelector("meta[name='csrf-token']")
        .getAttribute("content");

    const formData = new FormData();
    formData.append("selectedFile", event.target.files[0]);

    const res =  await axios({
      method: "post",
      url: "/dashboard/upload_file",
      headers: {
        "Content-type":"multipart/form-data",
        "X-CSRF-Token": csrf,
        data: formData,
      },
    });
    console.log("🚀 ~ file: Dashboard.jsx ~ line 21 ~ fileUpload ~ res", res)
  }

  return <>
  <Label for="exampleCustomFileBrowser">Upload CSV</Label>
  <Input type="file" id="exampleCustomFileBrowser" name="customFile" accept=".csv" multiple onChange={fileUpload}/>
  <DashboardTable data={data} />
  </>;
}

export default Dashboard;
