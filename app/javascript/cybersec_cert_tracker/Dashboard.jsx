import React, { useEffect, useState } from "react";
import "./table.css";
import DashboardTable from "./DashboardTable";
import makeData from "./makeData";
import { Label, Input, Button, Modal } from 'reactstrap';
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Dashboard({userData}) {
  const [tableData, setTableData] = useState([]);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

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
  <Input type="file" id="exampleCustomFileBrowser" name="csvFile" accept=".csv" multiple onChange={fileUpload}/>
  <Button onClick={() => setShow(true)}>Add Form</Button>
    <Modal show={show}
    onHide={handleClose}
    dialogClassName="modal-90w"
    aria-labelledby="example-custom-modal-styling-title"
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-custom-modal-styling-title">
          Custom Modal Styling
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Hello
        </p>
      </Modal.Body> 
    </Modal> 
  <DashboardTable data={tableData} />
  </>;
}

export default Dashboard;
