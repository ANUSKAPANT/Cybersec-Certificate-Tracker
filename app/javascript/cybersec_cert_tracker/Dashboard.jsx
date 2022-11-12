import React, { useEffect, useState } from "react";
import "./table.css";
import DashboardTable from "./DashboardTable";
import { Button } from "reactstrap";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import { FileUploader } from "react-drag-drop-files";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClipLoader from "react-spinners/ClipLoader";

const fileTypes = ["csv"];

function Dashboard({ userData }) {
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchRecords = async () => {
    try {
      const res = await axios.get("/records.json", {
        headers: { Authorization: `Bearer ${userData.token}` },
      });
      const { records } = res.data;
      setLoading(false);
      setTableData(records);
    } catch (error) {
      console.log(error);
      toast.error("Error in fetching records", {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
      });
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const fileUpload = async (event) => {
    setUploading(true);
    let csrf;
    if (document.querySelector("meta[name='csrf-token']"))
      csrf = document
        .querySelector("meta[name='csrf-token']")
        .getAttribute("content");

    if (Object.entries(event).length == 0) {
      return;
    }
    const formData = new FormData();
    Object.entries(event).forEach(([key, file]) => {
      formData.append("file_name", file.name);
      formData.append("body", file);
      formData.append("user_id", userData.id);
    });

    try {
      await axios({
        method: "POST",
        url: "/csv_files.json",
        headers: {
          "Content-type": "multipart/form-data",
          "X-CSRF-Token": csrf,
          Authorization: `Bearer ${userData.token}`,
        },
        data: formData,
      });
      setUploading(false);
      toast.success("Successfully Uploaded!", {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
      });
      fetchRecords();
    } catch (error) {
      toast.error("Something went wrong", {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
      });
    }
  };

  const spinnerContainer = {
    textAlign: "center",
    marginTop: "20px",
  };

  const spinner = {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <ToastContainer />
      <Button
        color="success"
        style={{ margin: "10px" }}
        onClick={() => setOpen(true)}
        id="uploadCSVButton"
      >
        + Upload CSV
      </Button>
      <Modal
        isOpen={open}
        toggle={handleClose}
        size="lg"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <ModalHeader toggle={handleClose} style={{ border: "none" }}>
          <span>CSV Upload </span>
          {uploading == true ? (
            <span
              className="spinner-border spinner-border-sm text-primary"
              role="status"
            />
          ) : null}
        </ModalHeader>
        <ModalBody className="mb-5">
          <FileUploader
            multiple={true}
            name="csvFile"
            types={fileTypes}
            handleChange={fileUpload}
            id="csvFile"
          />
        </ModalBody>
      </Modal>
      {loading == true ? (
        <div style={spinnerContainer}>
          <div style={spinner}>
            <ClipLoader color="blue" />
          </div>
          <div>Fetching the data...</div>
        </div>
      ) : tableData.length === 0 ? (
        <div className="">No Table Records to Show</div>
      ) : (
        <DashboardTable data={tableData} type="Dashboard" />
      )}
    </>
  );
}

export default Dashboard;
