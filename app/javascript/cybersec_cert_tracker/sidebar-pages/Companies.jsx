import React, { useEffect, useState } from "react";
import "../table.css";
import DashboardTable from "../DashboardTable";
import {
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Card,
  CardBody,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import axios from "axios";
import Snackbar from '@mui/material/Snackbar';
import ClipLoader from "react-spinners/ClipLoader";
import Jsona from "jsona";
import Select from "react-select";

const dataFormatter = new Jsona();

const smcOptions = [
  { label: "Yes", value: true },
  { label: "No", value: false },
];

function Companies({ userData }) {
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [companyInfo, setCompanyInfo] = useState({ id: null });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");

  const fetchRecords = () => {
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
        setOpenSnackbar(true);
        setSnackbarMsg("Something went wrong")
      });
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const deleteRecords = (idx) => {
    axios
      .delete(`/companies/${idx}`, {
        headers: { Authorization: `Bearer ${userData.token}` },
      })
      .then(() => {
        setOpenSnackbar(true);
        setSnackbarMsg("Successfully Deleted");
      })
      .catch(() => {
        setOpenSnackbar(true);
        setSnackbarMsg("Something went wrong")
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

  const fetchCompany = (id) => {
    axios
      .get(`/companies/${id}`, {
        headers: { Authorization: `Bearer ${userData.token}` },
      })
      .then((response) => {
        const data = dataFormatter.deserialize(response.data);
        const companyData = {
          id: data.id,
          name: data.name,
          smc: data.smc,
        };
        setCompanyInfo(companyData);
      })
      .catch(() => {
        setOpenSnackbar(true);
        setSnackbarMsg("Something went wrong")
      });
  };

  const editItem = (id) => {
    setOpen(true);
    fetchCompany(id);
  };

  const handleClose = () => {
    setCompanyInfo({ id: null });
    setOpen(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCompanyInfo({ ...companyInfo, [name]: value });
  };

  const handleSelectChange = (value, name) => {
    setCompanyInfo({ ...companyInfo, [name]: value.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let csrf = "";
    //Not present always
    if (document.querySelector("meta[name='csrf-token']"))
      csrf = document
        .querySelector("meta[name='csrf-token']")
        .getAttribute("content");
    const { id, name, smc } = companyInfo;

    const method = id !== null ? "patch" : "post";
    const url = id == null ? "/companies" : `/companies/${id}`;
    const message = id !== null ? "Updated" : "Created";
    const data = {
      name,
      smc,
    };
    axios
      .request({
        method,
        url,
        headers: {
          "Content-type": "application/json",
          "X-CSRF-Token": csrf,
          Authorization: `Bearer ${userData.token}`,
        },
        data,
      })
      .then(() => {
        setLoading(true);
        fetchRecords();
        handleClose();
        setOpenSnackbar(true);
        setSnackbarMsg(`Successfully ${message}`);
      })
      .catch(() => {
        setOpenSnackbar(true);
        setSnackbarMsg("Something went wrong");
      });
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  }
  return (
    <>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMsg}
      />
      <Button
        color="success"
        className="csv-button"
        style={{ margin: "10px" }}
        onClick={() => setOpen(true)}
        id="add_company_button"
      >
        + Add Company
      </Button>
      <Modal
        isOpen={open}
        toggle={handleClose}
        size="lg"
        style={{ maxWidth: "700px", width: "100%" }}
      >
        <ModalHeader toggle={handleClose} style={{ border: "none" }}>
          Add Company
        </ModalHeader>
        <ModalBody>
          <Form>
            <Card>
              <CardBody>
                <FormGroup row>
                  <Col sm={12}>
                    <Label for="name" sm={5}>
                      Company
                    </Label>
                    <Input
                      name="name"
                      id="name"
                      defaultValue={companyInfo.name}
                      onChange={handleInputChange}
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col sm={12}>
                    <Label for="smc" sm={5}>
                      SMC
                    </Label>
                    <Select
                      name="smc"
                      onChange={(value) => handleSelectChange(value, "smc")}
                      options={smcOptions}
                      value={smcOptions.filter(
                        (option) => companyInfo.smc == option.value
                      )}
                      placeholder="Select SMC"
                    />
                  </Col>
                </FormGroup>
              </CardBody>
            </Card>
          </Form>
        </ModalBody>
        <ModalFooter style={{ border: "none" }}>
          <Button color="primary" onClick={handleSubmit} id="submit">
            Submit
          </Button>{" "}
          <Button color="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </ModalFooter>
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
          editItem={editItem}
        />
      )}
    </>
  );
}

export default Companies;
