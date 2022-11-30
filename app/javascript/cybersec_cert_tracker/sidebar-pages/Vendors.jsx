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

function Vendors({ userData }) {
  const [loading, setLoading] = useState(true);
  const [vendors, setVendors] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [courseOptions, setCourseOptions] = useState([]);
  const [vendorInfo, setVendorInfo] = useState({ id: null });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [error, setError] = useState({});

  const addError = (name) => {
    return (
      error[`${name}`] ? (
        <div>
          <span className="text-danger label"><span className="text-danger label">{error[`${name}`]}</span></span>
        </div>
      ) : null
    );
  }

  const fetchRecords = () => {
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
      })
      .catch(() => {
        setOpenSnackbar(true);
        setSnackbarMsg("Something went wrong");
      });
  };

  useEffect(() => {
    fetchRecords();
    fetchCourses();
  }, []);

  const deleteRecords = (idx) => {
    axios
      .delete(`/vendors/${idx}`, {
        headers: { Authorization: `Bearer ${userData.token}` },
      })
      .then((res) => {
        setOpenSnackbar(true);
        setSnackbarMsg("Successfully Deleted");
      })
      .catch((err) => {
        setOpenSnackbar(true);
        setSnackbarMsg("Something went wrong");
      });
  };

  const fetchCourses = () => {
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
      })
      .catch(() => {
        setOpenSnackbar(true);
        setSnackbarMsg("Something went wrong");
      });
  };

  const fetchVendor = (id) => {
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
      })
      .catch((error) => {
        setOpenSnackbar(true);
        setSnackbarMsg("Something went wrong");
      });
  };

  const deleteItem = (idx) => {
    deleteRecords(idx);
    setVendors((prev) => {
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
  const editItem = (id) => {
    setOpen(true);
    fetchVendor(id);
  };

  const handleClose = () => {
    setVendorInfo({ id: null });
    setOpen(false);
    setError({});
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setVendorInfo({ ...vendorInfo, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let csrf = "";
    //Not present always
    if (document.querySelector("meta[name='csrf-token']"))
      csrf = document
        .querySelector("meta[name='csrf-token']")
        .getAttribute("content");
    const { id, name, course_ids } = vendorInfo;

    const method = id !== null ? "patch" : "post";
    const url = id == null ? "/vendors" : `/vendors/${id}`;
    const message = id !== null ? "Updated" : "Created";
    const data = { name, course_ids };
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
        setOpenSnackbar(true);
        setSnackbarMsg(`Successfully ${message}`);
        fetchRecords();
        handleClose();
      })
      .catch((err) => {
        debugger
        setError(err.response.data);
        setOpenSnackbar(true);
        setSnackbarMsg("Something went wrong");
      });
  };

  const handleCoursesChange = (value) => {
    const data = value.map((el) => el.value);
    setVendorInfo({ ...vendorInfo, course_ids: data });
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
        style={{ margin: "10px" }}
        className="csv-button"
        onClick={() => setOpen(true)}
        id="add_vendor_button"
      >
        + Add Vendor
      </Button>
      <Modal
        isOpen={open}
        toggle={handleClose}
        size="lg"
        style={{ maxWidth: "700px", width: "100%" }}
      >
        <ModalHeader toggle={handleClose} style={{ border: "none" }}>
          Add Vendor
        </ModalHeader>
        <ModalBody>
          <Form>
            <Card>
              <CardBody>
                <FormGroup row>
                  <Col sm={12}>
                    <Label for="name" sm={6}>
                      Name
                    </Label>
                    <Input
                      name="name"
                      id="name"
                      defaultValue={vendorInfo.name}
                      onChange={handleInputChange}
                    />
                    {error['name'] && addError('name')}
                  </Col>
                </FormGroup>
                {vendorInfo.id && (
                  <FormGroup row>
                    <Col sm={12}>
                      <Label for="courses" sm={10}>
                        Courses
                      </Label>
                      <Select
                        isMulti
                        name="courses"
                        onChange={(value) => handleCoursesChange(value)}
                        options={courseOptions}
                        value={courseOptions.filter((option) =>
                          (vendorInfo.course_ids || []).includes(option.value)
                        )}
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
      ) : vendors.length === 0 ? (
        <div className="">No Table Records to Show</div>
      ) : (
        <DashboardTable
          data={vendors}
          type="Vendor"
          deleteItem={deleteItem}
          editItem={editItem}
        />
      )}
    </>
  );
}

export default Vendors;
