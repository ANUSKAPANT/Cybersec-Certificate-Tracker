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
  const [error, setError] = useState({});

  const handleClose = () => {
    setCertificateVouchersInfo({ id: null });
    setOpen(false);
    setError({});
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
            voucher_code: cert_voucher.voucher_code,
            exam_code: cert_voucher.exam_code,
            exam_date: cert_voucher.exam_date,
            test_center:cert_voucher.test_center_id,
            score: cert_voucher.score,
            test_result: cert_voucher.test_result,
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
          exam_date: data.exam_date ? new Date(data.exam_date) : null,
          voucher_code: data.voucher_code,
          exam_code: data.exam_code,
          exam_date: data.exam_date,
          test_center: data.test_center_id,
          score: data.score,
          test_result: data.test_result,
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
      exam_code,
      exam_date,
      score,
      test_center_id,
      test_result,
      voucher_code,
    } = certificateVouchersInfo;
    const method = id !== null ? "patch" : "post";
    const url = id == null ? "/cert_vouchers" : `/cert_vouchers/${id}`;
    const message = id !== null ? "Updated" : "Created";
    const data = {
      certification_name,
      created_date,
      expiry_date,
      student_course_id,
      exam_code,
      exam_date,
      score,
      test_center_id,
      test_result,
      voucher_code,
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
      .catch((err) => {
        setError(err.response.data);
        setOpenSnackbar(true);
        setSnackbarMsg("Something went wrong");
      });
  };

  const passedOptions = [
    { label: "Pass", value: "pass" },
    { label: "Fail", value: "fail" },
    { label: "TBD", value: "TBD" },
  ];
  
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

  const addError = (name) => {
    return (
      error[`${name}`] ? (
        <div>
          <span className="text-danger label"><span className="text-danger label">{error[`${name}`]}</span></span>
        </div>
      ) : null
    );
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
          Add Certificate Voucher
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
                   {error['student_course'] && addError('student_course')}
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
                   {error['certification_name'] && addError('certification_name')}
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
                    {error['created_date'] && addError('created_date')}
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
                    {error['expiry_date'] && addError('expiry_date')}
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col sm={6}>
                    <Label for="test_center" sm={6}>
                      Test Center
                    </Label>
                    <Input
                      name="test_center_id"
                      id="test_center_id"
                      defaultValue={certificateVouchersInfo.test_center_id}
                      onChange={handleInputChange}
                    />
                  </Col>
                  {error['test_center'] && addError('test_center')}
                  <Col sm={6}>
                    <Label for="exam_date" sm={6}>
                      Exam Date
                    </Label>
                    <DatePicker
                      selected={certificateVouchersInfo.expiry_date}
                      onChange={(date) => handleDateChange(date, "exam_date")}
                      className="input-date"
                      isClearable
                    />
                    {error['exam_date'] && addError('exam_date')}
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col sm={6}>
                    <Label for="voucher_code" sm={6}>
                      Voucher Code
                    </Label>
                    <Input
                      name="voucher_code"
                      id="voucher_code"
                      defaultValue={certificateVouchersInfo.voucher_code}
                      onChange={handleInputChange}
                    />
                    {error['voucher_code'] && addError('voucher_code')}
                  </Col>
                  <Col sm={6}>
                    <Label for="exam_code" sm={6}>
                      Exam Code
                    </Label>
                    <Input
                      name="exam_code"
                      id="exam_code"
                      defaultValue={certificateVouchersInfo.exam_code}
                      onChange={handleInputChange}
                    />
                    {error['exam_code'] && addError('exam_code')}
                  </Col>
                  <Col sm={6}>
                    <Label for="score" sm={6}>
                      Exam Grade
                    </Label>
                    <Input
                      name="score"
                      id="score"
                      defaultValue={certificateVouchersInfo.score}
                      onChange={handleInputChange}
                    />
                    {error['score'] && addError('score')}
                  </Col>
                  <Col sm={6}>
                    <Label for="test_result" sm={6}>
                      Test Result
                    </Label>
                    <Select
                      name="test_result"
                      onChange={(value) => handleSelectChange(value, "test_result")}
                      options={passedOptions}
                      value={passedOptions.filter(
                        (option) => certificateVouchersInfo.test_result == option.value
                      )}
                      placeholder="Select Test Result"
                    />
                    {error['test_result'] && addError('test_result')}
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
