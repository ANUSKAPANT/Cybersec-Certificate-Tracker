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

const dataFormatter = new Jsona();

function Courses({ userData }) {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [courseInfo, setCourseInfo] = useState({id: null});
  const [vendorOptions, setVendorOptions] = useState([]);

  const fetchRecords = () => {
    axios
      .get(`/courses`, {
        headers: { Authorization: `Bearer ${userData.token}` },
      })
      .then((response) => {
        const data = dataFormatter.deserialize(response.data);
        const coursesData = data.map((course) => {
          return {
            id: course.id,
            name: course.name,
            vendor: course.vendor.name,
          };
        });
        setLoading(false);
        setCourses(coursesData);
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
    fetchVendors();
  }, []);

  const deleteRecords = (idx) => {
    axios
      .delete(`/courses/${idx}`, {
        headers: { Authorization: `Bearer ${userData.token}` },
      })
      .then(() => {
        toast.success("Successfully Deleted", {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
        });
      }).catch(() => {
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
    setCourses((prev) => {
      const tempArray = prev.slice();
      return tempArray.filter((item) => item.id !== idx);
    });
  };

  const fetchCourse = (id) => {
    axios
      .get(`/courses/${id}`, {
        headers: { Authorization: `Bearer ${userData.token}` },
      })
      .then((response) => {
        const course = dataFormatter.deserialize(response.data);
        const courseData = {
          id: course.id,
          name: course.name,
          vendor_id: course.vendor.id,
        };
        setCourseInfo(courseData);
      }).catch(() => {
        toast.error("Error in fetching records", {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
        });
      });
  };

  const fetchVendors = () => {
    axios
      .get(`/vendors`, {
        headers: { Authorization: `Bearer ${userData.token}` },
      })
      .then((response) => {
        const data = dataFormatter.deserialize(response.data);
        const vendorsData = data.map((vendor) => {
          return {
            id: vendor.id,
            value: vendor.id,
            label: vendor.name,
          };
        });
        setVendorOptions(vendorsData);
      }).catch((error) => {
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
    fetchCourse(id);
  }

  const handleClose = () => {
    setCourseInfo({ id: null });
    setOpen(false);
  }

  const handleInputChange = (event) => {
    const {name, value} = event.target;
    setCourseInfo({...courseInfo, [name]: value});
  };

  const handleSelectChange = (value) => {
    setCourseInfo({...courseInfo, vendor_id: value.value});
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let csrf = "";
    //Not present always
    if (document.querySelector("meta[name='csrf-token']"))
      csrf = document.querySelector("meta[name='csrf-token']").getAttribute("content");
      const { id, name, vendor_id } = courseInfo;
  
      const method = id !== null ? 'patch' : 'post';
      const url = id == null ? '/courses' : `/courses/${id}`;
      const message = id !== null ? 'Updated' : 'Created';
      const data = { name, vendor_id };
      axios.request({
        method,
        url,
        headers: {
          "Content-type": "application/json",
          "X-CSRF-Token": csrf,
          "Authorization": `Bearer ${userData.token}`,
        },
        data
      }).then((res) => {
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
        + Add Course
      </Button>
      <Modal isOpen={open} toggle={handleClose} size="lg" style={{maxWidth: '700px', width: '100%'}}>
        <ModalHeader toggle={handleClose} style={{border: "none"}}>Add Course</ModalHeader>
        <ModalBody>
          <Form>
            <Card>
              <CardBody>
                <FormGroup row>
                  <Col sm={12}>
                    <Label for="name" sm={12}>Course Name</Label>
                    <Input name="name" id="course_name" defaultValue={courseInfo.name} onChange={handleInputChange}/>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col sm={12}>
                    <Label for="vendor" sm={12}>Vendor</Label>
                    <Select
                      name="vendor_id"
                      onChange={(value) => handleSelectChange(value)}
                      options={vendorOptions}
                      value={vendorOptions.filter((option) => (courseInfo.vendor_id == option.value))}
                      placeholder="Select Vendor"
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
      ) : courses.length === 0 ? (
        <div className="">No Table Records to Show</div>
      ) : (
        <DashboardTable data={courses} type="Course" deleteItem={deleteItem} editItem={editItem}/>
      )}
    </>
  );
}

export default Courses;
