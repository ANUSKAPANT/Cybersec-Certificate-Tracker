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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClipLoader from "react-spinners/ClipLoader";
import Jsona from "jsona";
import Select from "react-select";

const passedOptions = [
  { label: "Passed", value: true },
  { label: "Failed", value: false },
];

const dataFormatter = new Jsona();

function Exams({ userData }) {
  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [examInfo, setExamInfo] = useState({ id: null });
  const [certificateVouchers, setCertificateVouchers] = useState([]);

  const fetchRecords = () => {
    axios
      .get(`/exams`, {
        headers: { Authorization: `Bearer ${userData.token}` },
      })
      .then((response) => {
        const data = dataFormatter.deserialize(response.data);
        const examsData = data.map((exam) => {
          return {
            id: exam.id,
            exam_code: exam.exam_code,
            certification_name: exam.cert_voucher.certification_name,
            exam_date: exam.exam_date,
            grade: exam.exam_grade,
            passed: String(exam.passed),
            cert_voucher: "",
          };
        });
        setLoading(false);
        setExams(examsData);
      })
      .catch((error) => {
        toast.error("Error in fetching records", {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
        });
      });
  };

  const fetchCertVouchers = () => {
    axios
      .get(`/cert_vouchers`, {
        headers: { Authorization: `Bearer ${userData.token}` },
      })
      .then((response) => {
        const data = dataFormatter.deserialize(response.data);
        const certificateVouchersData = data.map((cert_voucher) => {
          return {
            value: cert_voucher.id,
            label: cert_voucher.certification_name,
          };
        });
        setCertificateVouchers(certificateVouchersData);
      })
      .catch((error) => {
        toast.error("Error in fetching records", {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
        });
      });
  };

  const fetchExam = (id) => {
    axios
      .get(`/exams/${id}`, {
        headers: { Authorization: `Bearer ${userData.token}` },
      })
      .then((response) => {
        const exam = dataFormatter.deserialize(response.data);
        const examsData = {
          id: exam.id,
          exam_code: exam.exam_code,
          certification_name: exam.cert_voucher.certification_name,
          exam_date: exam.exam_date,
          exam_grade: exam.exam_grade,
          passed: exam.passed,
          cert_voucher_id: exam.cert_voucher.id,
        };
        setExamInfo(examsData);
      })
      .catch((error) => {
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
    fetchCertVouchers();
  }, []);

  const deleteRecords = (idx) => {
    axios
      .delete(`/exams/${idx}`, {
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
    setExams((prev) => {
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
    fetchExam(id);
  };

  const handleClose = () => {
    setExamInfo({ id: null });
    setOpen(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setExamInfo({ ...examInfo, [name]: value });
  };

  const handleSelectChange = (value, name) => {
    setExamInfo({ ...examInfo, [name]: value.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let csrf = "";
    //Not present always
    if (document.querySelector("meta[name='csrf-token']"))
      csrf = document
        .querySelector("meta[name='csrf-token']")
        .getAttribute("content");
    const { id, cert_voucher_id, exam_code, exam_date, passed, exam_grade } =
      examInfo;

    const method = id !== null ? "patch" : "post";
    const url = id == null ? "/exams" : `/exams/${id}`;
    const message = id !== null ? "Updated" : "Created";
    const data = {
      cert_voucher_id: cert_voucher_id,
      exam_code,
      exam_date,
      passed,
      exam_grade,
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
        toast.success(`Successfully ${message}`, {
          position: "bottom-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
        });
        fetchRecords();
        handleClose();
      })
      .catch((error) => {
        toast.error("Error Occured", {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
        });
      });
  };

  return (
    <>
      <ToastContainer />
      <Button
        color="success"
        className="csv-button"
        style={{ margin: "10px" }}
        onClick={() => setOpen(true)}
      >
        + Add Exam
      </Button>
      <Modal
        isOpen={open}
        toggle={handleClose}
        size="lg"
        style={{ maxWidth: "700px", width: "100%" }}
      >
        <ModalHeader toggle={handleClose} style={{ border: "none" }}>
          Add Exam
        </ModalHeader>
        <ModalBody>
          <Form>
            <Card>
              <CardBody>
                <FormGroup row>
                  <Col sm={6}>
                    <Label for="certification_name" sm={6}>
                      Certification Name
                    </Label>
                    <Select
                      name="certification_name"
                      onChange={(value) =>
                        handleSelectChange(value, "cert_voucher_id")
                      }
                      options={certificateVouchers}
                      value={certificateVouchers.filter(
                        (option) => examInfo.cert_voucher_id == option.value
                      )}
                      placeholder="Select Cetification Name"
                    />
                  </Col>
                  <Col sm={6}>
                    <Label for="exam_code" sm={6}>
                      Exam Code
                    </Label>
                    <Input
                      name="exam_code"
                      id="exam_code"
                      defaultValue={examInfo.exam_code}
                      onChange={handleInputChange}
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col sm={6}>
                    <Label for="exam_date" sm={6}>
                      Exam Date
                    </Label>
                    <Input
                      name="exam_date"
                      id="exam_date"
                      defaultValue={examInfo.exam_date}
                      onChange={handleInputChange}
                    />
                  </Col>
                  <Col sm={6}>
                    <Label for="passed" sm={6}>
                      Passed
                    </Label>
                    <Select
                      name="passed"
                      onChange={(value) => handleSelectChange(value, "passed")}
                      options={passedOptions}
                      value={passedOptions.filter(
                        (option) => examInfo.passed == option.value
                      )}
                      placeholder="Select Passed"
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col sm={6}>
                    <Label for="exam_grade" sm={6}>
                      Exam Grade
                    </Label>
                    <Input
                      name="exam_grade"
                      id="exam_grade"
                      defaultValue={examInfo.exam_grade}
                      onChange={handleInputChange}
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
      ) : exams.length === 0 ? (
        <div className="">No Table Records to Show</div>
      ) : (
        <DashboardTable
          data={exams}
          type="Exam"
          deleteItem={deleteItem}
          editItem={editItem}
        />
      )}
    </>
  );
}

export default Exams;
