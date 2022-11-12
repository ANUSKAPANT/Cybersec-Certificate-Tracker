import React, { useEffect, useState } from "react";
import "../table.css";
import DashboardTable from "../DashboardTable";
import { Button } from "reactstrap";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClipLoader from "react-spinners/ClipLoader";
import Jsona from "jsona";

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

const dataFormatter = new Jsona();

function Companies({ userData }) {
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [open, setOpen] = React.useState(false);

  const fetchRecords = async () => {
    axios
      .get(`/companies`, {
        headers: { Authorization: `Bearer ${userData.token}` },
      })
      .then((response) => {
        const data = dataFormatter.deserialize(response.data);
        const companiesData = data.map((company) => {
          return {
            id: company.id,
            name: company.name,
            smc: String(company.smc),
          };
        });

        setLoading(false);
        setCompanies(companiesData);
      })

      .catch((error) => {
        console.log(error);
        toast.error("Error in fetching records", {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
        });
      });
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const deleteRecords = async (idx) => {
    axios
      .delete(`/companies/${idx}`, {
        headers: { Authorization: `Bearer ${userData.token}` },
      })
      .then((res) => {
        console.log(res);
        toast.success("Successfully Deleted", {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
        });
      })
      .catch((err) => {
        console.log(err.response.data);
        toast.error("Error in deletingrecords", {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
        });
      });
  };

  const deleteItem = (idx) => {
    deleteRecords(idx);
    setCompanies((prev) => {
      const tempArray = prev.slice();
      return tempArray.filter((item) => item.id !== idx);
    });
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
        className="csv-button"
        style={{ margin: "10px" }}
        onClick={() => setOpen(true)}
        id="uploadCSVButton"
      >
        + Add Companies
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}></Box>
      </Modal>
      {loading == true ? (
        <div style={spinnerContainer}>
          <div style={spinner}>
            <ClipLoader color="blue" />
          </div>
          <div>Fetching the data...</div>
        </div>
      ) : companies.length === 0 ? (
        <div className="">No Table Records to Show</div>
      ) : (
        <DashboardTable
          data={companies}
          type="Company"
          deleteItem={deleteItem}
        />
      )}
    </>
  );
}

export default Companies;
