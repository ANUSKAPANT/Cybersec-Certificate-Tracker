import React, { useEffect, useState } from "react";
import "./table.css";
import DashboardTable from "./DashboardTable";
import makeData from "./makeData";
import { Label, Input } from 'reactstrap';
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Dashboard({userData}) {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    axios.get('/records.json', { headers: {"Authorization" : `Bearer ${userData.token}`}})
      .then((res) => {
        const { records } = res.data;
        console.log(records);
        setTableData(records);
      }).catch((error) => {
        console.log(error);
      });
  }, []);

  const fileUpload = async (event) => {
    let csrf;

    if (document.querySelector("meta[name='csrf-token']"))
      csrf = document
        .querySelector("meta[name='csrf-token']")
        .getAttribute("content");

    const formData = new FormData();
    
    Object.entries(event.target.files).forEach( ([key, file]) => {
      formData.append('file_name', file.name);
      formData.append('body', file);
      formData.append('user_id', 1);
    })
    
    try {
      await axios({
        method: "POST",
        url: "/csv_files.json",
        headers: {
          "Content-type" : "multipart/form-data",
          "X-CSRF-Token": csrf,
        },
        data: formData,
      });
      toast.success("Success!", {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
      });
    } catch (error) {
      toast.error("Something went wrong", {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
      });
    }
  }

  return <>
  <ToastContainer/>
  <Label for="exampleCustomFileBrowser">Upload CSV</Label>
  <Input type="file" id="exampleCustomFileBrowser" name="customFile" accept=".csv" multiple onChange={fileUpload}/>
  <DashboardTable data={tableData} />
  </>;
}

export default Dashboard;
