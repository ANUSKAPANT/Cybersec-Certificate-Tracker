import React, { useEffect, useState, CSSProperties } from "react";
import "./table.css";
import DashboardTable from "./DashboardTable";
import { Button } from "reactstrap";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { FileUploader } from "react-drag-drop-files";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClipLoader from "react-spinners/ClipLoader";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const fileTypes = ["csv"];

function Dashboard({ userData }) {
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [open, setOpen] = React.useState(false);

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
        },
        data: formData,
      });
      toast.success("Success!", {
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
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <FileUploader
            multiple={true}
            name="csvFile"
            types={fileTypes}
            handleChange={fileUpload}
            id="csvFile"
          />
        </Box>
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
