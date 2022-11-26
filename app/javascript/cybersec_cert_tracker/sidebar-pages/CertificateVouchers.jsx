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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const dataFormatter = new Jsona();

function CertificateVouchers({ userData }) {
  const [loading, setLoading] = useState(true);
  const [certificateVouchers, setCertificateVouchers] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [studentCourseOptions, setStudentCourseOptions] = useState([]);
  const [certificateVouchersInfo, setCertificateVouchersInfo] = useState({
    id: null,
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");

  const handleClose = () => {
    setCertificateVouchersInfo({ id: null });
    setOpen(false);
  };

  const fetchRecords = () => {
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
        setOpenSnackbar(true);
        setSnackbarMsg("Something went wrong")
      });
  };

  const fetchCertificateVoucher = (id) => {
    axios
      .get(`/cert_vouchers/${id}`, {
        headers: { Authorization: `Bearer ${userData.token}` },
      })
      .then((response) => {
        const data = dataFormatter.deserialize(response.data);
        const certificateVouchersData = {
          id: data.id,
          certification_name: data.certification_name,
          student_course_id: data.student_course_id,
          created_date: data.created_date ? new Date(data.created_date) : null,
          expiry_date: data.created_date ? new Date(data.expiry_date) : null,
        };
        setCertificateVouchersInfo(certificateVouchersData);
      })
      .catch(() => {
        setOpenSnackbar(true);
        setSnackbarMsg("Something went wrong")
      });
  };

  const fetchStudentCourses = () => {
    axios
      .get(`/student_courses`, {
        headers: { Authorization: `Bearer ${userData.token}` },
      })
      .then((response) => {
        const data = dataFormatter.deserialize(response.data);
        const studentCourseData = data.map((data) => {
          return {
            student_course_id: data.id,
            value: data.id,
            label: `${data.student.full_comma_separated_name} (${data.course.name})`,
          };
        });
        setStudentCourseOptions(studentCourseData);
      })
      .catch(() => {
        setOpenSnackbar(true);
        setSnackbarMsg("Something went wrong")
      });
  };

  useEffect(() => {
    fetchRecords();
    fetchStudentCourses();
  }, []);

  const deleteRecords = (idx) => {
    axios
      .delete(`/cert_vouchers/${idx}`, {
        headers: { Authorization: `Bearer ${userData.token}` },
      })
      .then((res) => {
        setOpenSnackbar(true);
        setSnackbarMsg("Successfully Deleted")
      })
      .catch((err) => {
        setOpenSnackbar(true);
        setSnackbarMsg("Something went wrong")
      });
  };

  const deleteItem = (idx) => {
    deleteRecords(idx);
    setCertificateVouchers((prev) => {
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
    fetchCertificateVoucher(id);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let csrf = "";
    //Not present always
    if (document.querySelector("meta[name='csrf-token']"))
      csrf = document
        .querySelector("meta[name='csrf-token']")
        .getAttribute("content");
    const {
      id,
      certification_name,
      created_date,
      expiry_date,
      student_course_id,
    } = certificateVouchersInfo;
    const method = id !== null ? "patch" : "post";
    const url = id == null ? "/cert_vouchers" : `/cert_vouchers/${id}`;
    const message = id !== null ? "Updated" : "Created";
    const data = {
      certification_name,
      created_date,
      expiry_date,
      student_course_id,
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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCertificateVouchersInfo({ ...certificateVouchersInfo, [name]: value });
  };

  const handleSelectChange = (value, name) => {
    setCertificateVouchersInfo({
      ...certificateVouchersInfo,
      [name]: value.value,
    });
  };

  const handleDateChange = (date, name) => {
    setCertificateVouchersInfo({ ...certificateVouchersInfo, [name]: date });
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
      >
        + Add Certificate Voucher
      </Button>
      <Modal
        isOpen={open}
        toggle={handleClose}
        size="lg"
        style={{ maxWidth: "700px", width: "100%" }}
      >
        <ModalHeader toggle={handleClose} style={{ border: "none" }}>
          Add Student Course
        </ModalHeader>
        <ModalBody>
          <Form>
            <Card>
              <CardBody>
                <FormGroup row>
                  <Col sm={12}>
                    <Label for="student_course" sm={10}>
                      Student Course
                    </Label>
                    <Select
                      name="student_course"
                      onChange={(value) =>
                        handleSelectChange(value, "student_course_id")
                      }
                      options={studentCourseOptions}
                      value={studentCourseOptions.filter(
                        (option) =>
                          certificateVouchersInfo.student_course_id ==
                          option.value
                      )}
                      placeholder="Select Student Course"
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col sm={12}>
                    <Label for="certification_name" sm={6}>
                      Certification Name
                    </Label>
                    <Input
                      name="certification_name"
                      id="certification_name"
                      defaultValue={certificateVouchersInfo.certification_name}
                      onChange={handleInputChange}
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col sm={6}>
                    <Label for="created_date" sm={6}>
                      Created Date
                    </Label>
                    <DatePicker
                      selected={certificateVouchersInfo.created_date}
                      onChange={(date) => handleDateChange(date, "created_date")}
                      className="input-date"
                      isClearable
                    />
                  </Col>
                  <Col sm={6}>
                    <Label for="expiry_date" sm={6}>
                      Expiry Date
                    </Label>
                    <DatePicker
                      selected={certificateVouchersInfo.expiry_date}
                      onChange={(date) => handleDateChange(date, "expiry_date")}
                      className="input-date"
                      isClearable
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
      ) : certificateVouchers.length === 0 ? (
        <div className="">No Table Records to Show</div>
      ) : (
        <DashboardTable
          data={certificateVouchers}
          type="Certificate_Voucher"
          deleteItem={deleteItem}
          editItem={editItem}
        />
      )}
    </>
  );
}

export default CertificateVouchers;
