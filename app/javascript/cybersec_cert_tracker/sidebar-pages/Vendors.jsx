import React, { useEffect, useState } from "react";
import "../table.css";
import DashboardTable from "../DashboardTable";
import { Col, Button, Form, FormGroup, Label, Input, Card, CardBody, Modal,
  ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
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

function Vendors({ userData }) {
  const [loading, setLoading] = useState(true);
  const [vendors, setVendors] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [courseOptions, setCourseOptions] = useState([]);
  const [vendorInfo, setVendorInfo] = useState({id: null});

  const fetchRecords = async () => {
    axios
      .get(`/vendors`, {
        headers: { Authorization: `Bearer ${userData.token}` },
      })
      .then((response) => {
        const data = dataFormatter.deserialize(response.data);
        const vendorsData = data.map((vendor) => {
          return {
            id: vendor.id,
            name: vendor.name,
            courses: vendor.courses.map((course) => {
              return {
                id: course.id,
                name: course.name,
              };
            }),
          };
        });
        setLoading(false);
        setVendors(vendorsData);
      }).catch(() => {
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
    fetchCourses();
  }, []);

  const deleteRecords = async (idx) => {
    axios
      .delete(`/vendors/${idx}`, {
        headers: { Authorization: `Bearer ${userData.token}` },
      })
      .then((res) => {
        toast.success("Successfully Deleted", {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
        });
      })
      .catch((err) => {
        toast.error("Error in deletingrecords", {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
        });
      });
  };

  const fetchCourses = async () => {
    axios
      .get(`/courses`, {
        headers: { Authorization: `Bearer ${userData.token}` },
      })
      .then((response) => {
        const data = dataFormatter.deserialize(response.data);
        const coursesData = data.map((course) => {
          return {
            id: course.id,
            value: course.id,
            label: course.name,
          };
        });
        setCourseOptions(coursesData);
      }).catch(() => {
        toast.error("Error in fetching records", {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
        });
      });
  };

  const fetchVendor = async (id) => {
    axios
      .get(`/vendors/${id}`, {
        headers: { Authorization: `Bearer ${userData.token}` },
      })
      .then((response) => {
        const vendor = dataFormatter.deserialize(response.data);
        const vendorData = {
          id: vendor.id,
          name: vendor.name,
          course_ids: vendor.courses.map((el) => el.id),
        };
        setVendorInfo(vendorData);
      }).catch((error) => {
        toast.error("Error in fetching records", {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
        });
      });
  };

  const deleteItem = (idx) => {
    deleteRecords(idx);
    setVendors((prev) => {
      const tempArray = prev.slice();
      return tempArray.filter((item) => item.id !== idx);
    });
  };

  const editItem = (id) => {
    setOpen(true);
    fetchVendor(id);
  }

  const handleClose = () => {
    setVendorInfo({ id: null });
    setOpen(false);
  }

  const handleInputChange = (event) => {
    const {name, value} = event.target;
    setVendorInfo({...vendorInfo, [name]: value});
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let csrf = "";
    //Not present always
    if (document.querySelector("meta[name='csrf-token']"))
      csrf = document.querySelector("meta[name='csrf-token']").getAttribute("content");
      const { id, name, course_ids } = vendorInfo;
  
      const method = id !== null ? 'patch' : 'post';
      const url = id == null ? '/vendors' : `/vendors/${id}`;
      const message = id !== null ? 'Updated' : 'Created';
      const data = { name, course_ids };
      axios.request({
        method,
        url,
        headers: {
          "Content-type": "application/json",
          "X-CSRF-Token": csrf,
        },
        data
      }).then(() => {
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

  const handleCoursesChange = (value) => {
    const data = value.map((el) => el.value);
    setVendorInfo({...vendorInfo, course_ids: data});
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
        + Add Vendor
      </Button>
      <Modal isOpen={open} toggle={handleClose} size="lg" style={{maxWidth: '700px', width: '100%'}}>
        <ModalHeader toggle={handleClose} style={{border: "none"}}>Add Vendor</ModalHeader>
        <ModalBody>
          <Form>
            <Card>
              <CardBody>
                <FormGroup row>
                  <Col sm={12}>
                    <Label for="name" sm={6}>Name</Label>
                    <Input name="name" id="name" defaultValue={vendorInfo.name} onChange={handleInputChange}/>
                  </Col>
                </FormGroup>
                {vendorInfo.id && (
                  <FormGroup row>
                    <Col sm={12}>
                      <Label for="courses" sm={10}>Courses</Label>
                      <Select
                        isMulti
                        name="courses"
                        onChange={(value) => handleCoursesChange(value)}
                        options={courseOptions}
                        value={courseOptions.filter((option) => (vendorInfo.course_ids || []).includes(option.value))}
                        placeholder="Select Courses"
                        isDisabled
                      />
                    </Col>
                  </FormGroup>
                )}
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
      ) : vendors.length === 0 ? (
        <div className="">No Table Records to Show</div>
      ) : (
        <DashboardTable data={vendors} type="Vendor" deleteItem={deleteItem} editItem={editItem}/>
      )}
    </>
  );
}

export default Vendors;
