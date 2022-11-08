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

function CertificateVouchers({ userData }) {
  const [loading, setLoading] = useState(true);
  const [certificateVouchers, setCertificateVouchers] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [courseOptions, setCourseOptions] = useState([]);
  const [studentOptions, setStudentOptions] = useState([]);
  const [certificateOptions, setCertificateOptions] = useState([]);
  const [certificateVouchersInfo, setCertificateVouchersInfo] = useState({id: null});

  const handleClose = () => {
    setCertificateVouchersInfo({});
    setOpen(false);
  }

  const fetchRecords = async () => {
    axios
      .get(`/cert_vouchers`, {
        headers: { Authorization: `Bearer ${userData.token}` },
      })
      .then((response) => {
        const data = dataFormatter.deserialize(response.data);
        const certificateVouchersData = data.map((cert_voucher) => {
          return {
            id: cert_voucher.id,
            cert_name: cert_voucher.certification_name,
            course: cert_voucher.student_course.course.name,
            created_date: cert_voucher.created_date,
            expiry_date: cert_voucher.expiry_date,
          };
        });
        setLoading(false);
        setCertificateVouchers(certificateVouchersData);
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

  const fetchCertificateVouchers = async (id) => {
    axios
      .get(`/cert_vouchers/${id}`, {
        headers: { Authorization: `Bearer ${userData.token}` },
      })
      .then((response) => {
        const data = dataFormatter.deserialize(response.data);
        const certificateVouchersData = data.map((cert_voucher) => {
          return {
            id: cert_voucher.id,
            cert_name: cert_voucher.certification_name,
            course: cert_voucher.student_course.course.name,
            created_date: cert_voucher.created_date,
            expiry_date: cert_voucher.expiry_date,
          };
        });
        setCertificateVouchersInfo(certificateVouchersData);
      }).catch(() => {
        toast.error("Error in fetching records", {
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

  useEffect(() => {
    fetchRecords();
    fetchCourses();
  }, []);

  const deleteRecords = async (idx) => {
    axios
      .delete(`/cert_vouchers/${idx}`, {
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

  const deleteItem = (idx) => {
    deleteRecords(idx);
    setCertificateVouchers((prev) => {
      const tempArray = prev.slice();
      return tempArray.filter((item) => item.id !== idx);
    });
  };

  const editItem = (id) => {
    setOpen(true);
    fetchCertificateVouchers(id);
  }


  const handleSubmit = (event) => {
    event.preventDefault();
    let csrf = "";
    //Not present always
    if (document.querySelector("meta[name='csrf-token']"))
      csrf = document.querySelector("meta[name='csrf-token']").getAttribute("content");
      const {
        id,
        student_id,
        course_id,
        cert_name,
        created_date,
        expiry_date,
        course
      } = certificateVouchersInfo;
      const method = id !== null ? 'patch' : 'post';
      const url = id == null ? '/student_courses' : `/student_courses/${id}`;
      const message = id !== null ? 'Updated' : 'Created';
      const data = {
        student_id,
        course_id,
        cert_name,
        created_date,
        expiry_date,
        course
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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCertificateVouchersInfo({...certificateVouchersInfo, [name]: value});
  };

  const handleSelectChange = (value, name) => {
    setCertificateVouchersInfo({...certificateVouchersInfo, [name]: value.value});
  };


  return (
    <>
      <ToastContainer />
      <Button
        color="success"
        className="csv-button"
        onClick={() => setOpen(true)}
        id="uploadCSVButton"
      >
        + Add Certificate Voucher
      </Button>
      <Modal isOpen={open} toggle={handleClose} size="lg" style={{maxWidth: '700px', width: '100%'}}>
        <ModalHeader toggle={handleClose} style={{border: "none"}}>Add Student Course</ModalHeader>
        <ModalBody>
          <Form>
            <Card>
              <CardBody>
              <FormGroup row>
                  <Col sm={12}>
                    <Label for="student" sm={10}>Student</Label>
                    <Select
                      name="student"
                      onChange={(value) => handleSelectChange(value, "student_id")}
                      options={studentOptions}
                      value={studentOptions.filter((option) => certificateVouchersInfo.student_id == option.value)}
                      placeholder="Select Student"
                    />
                  </Col>
                </FormGroup>

                <FormGroup row>
                  <Col sm={12}>
                    <Label for="courses" sm={10}>Courses</Label>
                    <Select
                      name="courses"
                      onChange={(value) => handleSelectChange(value, "course_id")}
                      options={courseOptions}
                      value={courseOptions.filter((option) => certificateVouchersInfo.course_id == option.value)}
                      placeholder="Select Course"
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col sm={6}>
                    <Label for="create_date" sm={6}>Create Date</Label>
                    <Input name="create_date" id="create_date" defaultValue={certificateVouchersInfo.create_date}  onChange={handleInputChange} />
                  </Col>

                  <Col sm={6}>
                    <Label for="expiry_date" sm={6}>Expiry Date</Label>
                    <Input name="expiry_date" id="expiry_date" defaultValue={certificateVouchersInfo.expiry_date}  onChange={handleInputChange} />
                  </Col>
                </FormGroup>

                <FormGroup row>
                  <Col sm={12}>
                    <Label for="cert_name" sm={10}>Certificate Name</Label>
                    <Select
                      name="cert_name"
                      onChange={(value) => handleSelectChange(value, "cert_name")}
                      options={certificateOptions}
                      value={certificateOptions.filter((option) => certificateVouchersInfo.cert_name == option.value)}
                      placeholder="Select Certificate"
                    />
                  </Col>
                </FormGroup>

                {/* <FormGroup row>
                  <Col sm={6}>
                    <Label for="voucher_purchased" sm={6}>Voucher Purchased</Label>
                    <Select
                      name="voucher_purchased"
                      onChange={(value) => handleSelectChange(value, "voucher_purchased")}
                      options={voucherOptions}
                      value={voucherOptions.filter((option) => studentCourseInfo.voucher_purchased == option.value)}
                      placeholder="Select Voucher Purchased"
                    />
                  </Col>
                  <Col sm={6}>
                    <Label for="test_result" sm={6}>Test Result</Label>
                    <Input name="test_result" id="test_result" defaultValue={studentCourseInfo.test_result} onChange={handleInputChange} />
                  </Col>
                </FormGroup> */}
                {/* <FormGroup row>
                  <Col sm={6}>
                    <Label for="dcldp_code" sm={5}>Dcldp Code</Label>
                    <Input name="dcldp_code" id="dcldp_code" defaultValue={studentCourseInfo.dcldp_code}  onChange={handleInputChange} />
                  </Col>
                  <Col sm={6}>
                    <Label for="canvas_course_completion" sm={5}>Canvas Course Completed</Label>
                    <Select
                      name="canvas_course_completion"
                      onChange={(value) => handleSelectChange(value, "canvas_course_completion")}
                      options={completionOptions}
                      value={completionOptions.filter((option) => studentCourseInfo.canvas_course_completion == option.value)}
                      placeholder="Select Canvas Course Completion"
                    />
                  </Col>
                </FormGroup> */}
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
      ) : certificateVouchers.length === 0 ? (
        <div className="">No Table Records to Show</div>
      ) : (
        <DashboardTable
          data={certificateVouchers}
          type="Certificate_Voucher"
          deleteItem={deleteItem}
        />
      )}
    </>
  );
}

export default CertificateVouchers;
