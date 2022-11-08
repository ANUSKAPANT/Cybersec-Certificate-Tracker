import React, { useEffect, useState } from "react";
import "../table.css";
import DashboardTable from "../DashboardTable";
import { Col, Button, Form, FormGroup, Label, Input, Card, CardBody, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClipLoader from "react-spinners/ClipLoader";
import "../Dashboard.css";
import Jsona from "jsona";
import Select from "react-select";

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

const smcOptions = [
  { label: "Yes", value: true },
  { label: "No", value: false }
];

function Companies({ userData }) {
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [companyInfo, setCompanyInfo] = useState({id: null});


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

  const deleteRecords = (idx) => {
    axios
      .delete(`/companies/${idx}`, {
        headers: { Authorization: `Bearer ${userData.token}` },
      })
      .then(() => {
        toast.success("Successfully Deleted", {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
        });
      })
      .catch(() => {
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
          smc: data.smc
        };
        setCompanyInfo(companyData);
      }).catch(() => {
        toast.error("Error in fetching records", {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
        });
      });
  };

  const editItem = (id) => {
    setOpen(true);
    fetchCompany(id);
  }

  const handleClose = () => {
    setCompanyInfo({ id: null });
    setOpen(false);
  }

  const handleInputChange = (event) => {
    const {name, value} = event.target;
    setCompanyInfo({...companyInfo, [name]: value});
  };

  const handleSelectChange = (value, name) => {
    setCompanyInfo({...companyInfo, [name]: value.value});
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let csrf = "";
    //Not present always
    if (document.querySelector("meta[name='csrf-token']"))
      csrf = document.querySelector("meta[name='csrf-token']").getAttribute("content");
      const {
        id,
        name,
        smc
      } = companyInfo;

      const method = id !== null ? 'patch' : 'post';
      const url = id == null ? '/companies' : `/companies/${id}`;
      const message = id !== null ? 'Updated' : 'Created';
      const data = {
        name,
        smc
      };
      axios.request({
        method,
        url,
        headers: {
          "Content-type": "application/json",
          "X-CSRF-Token": csrf,
        },
        data
      }).then(() => {
        setLoading(true);
        toast.success(`Successfully ${message}`, {
          position: "bottom-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
        });
        fetchRecords();
        handleClose();
      }).catch(() => {
        toast.error("Error Occured", {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
        });
    });
  }

  return (
    <>
      <ToastContainer />
      <Button
        color="success"
        className="csv-button"
        onClick={() => setOpen(true)}
        id="uploadCSVButton"
      >
        + Add Company
      </Button>
      <Modal isOpen={open} toggle={handleClose} size="lg" style={{maxWidth: '700px', width: '100%'}}>
        <ModalHeader toggle={handleClose} style={{border: "none"}}>Add Company</ModalHeader>
        <ModalBody>
          <Form>
            <Card>
              <CardBody>
                <FormGroup row>
                  <Col sm={12}>
                    <Label for="name" sm={5}>Company</Label>
                    <Input name="name" id="name" defaultValue={companyInfo.name} onChange={handleInputChange} />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col sm={12}>
                    <Label for="smc" sm={5}>SMC</Label>
                    <Select
                      name="smc"
                      onChange={(value) => handleSelectChange(value, "smc")}
                      options={smcOptions}
                      value={smcOptions.filter((option) => (companyInfo.smc == option.value))}
                      placeholder="Select SMC"
                    />
                  </Col>
                </FormGroup>
              </CardBody>
            </Card>
          </Form>
        </ModalBody>
        <ModalFooter style={{border: "none"}}>
          <Button color="primary" onClick={handleSubmit}>Submit</Button>{' '}
          <Button color="secondary" onClick={handleClose}>Cancel</Button>
        </ModalFooter>
      </Modal>
      {loading == true ? (
        <div className="spinner-container">
          <div className="spinner">
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
