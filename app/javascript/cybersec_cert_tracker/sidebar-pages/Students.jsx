import React, { useEffect, useState } from "react";
import "../table.css";
import DashboardTable from "../DashboardTable";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Col, Button, Form, FormGroup, Label, Input, Card, CardBody, Modal,
  ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
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

function Students({ userData }) {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [studentInfo, setStudentInfo] = useState({ id: null });
  const [companies, setCompanies] = useState([]);

  const fetchRecords = async () => {
    axios
      .get(`/students`, {
        headers: { Authorization: `Bearer ${userData.token}` },
      })
      .then((response) => {
        const data = dataFormatter.deserialize(response.data);
        const studentData = data.map((student) => {
          return {
            id: student.id,
            full_name: student.full_comma_separated_name,
            first_name: student.first_name,
            last_name: student.last_name,
            email_id: student.email_id,
            canvas_id: student.canvas_id,
            company: student.company,
            courses: student.student_courses.map((sc) => {
              return {
                id: sc.course.id,
                name: sc.course.name,
              };
            }),
          };
        });
        setLoading(false);
        setStudents(studentData);
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
    fetchCompanies();
  }, []);

  const deleteRecords = async (idx) => {
    axios
      .delete(`/students/${idx}`, {
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
    setStudents((prev) => {
      const tempArray = prev.slice();
      return tempArray.filter((item) => item.id !== idx);
    });
  };

  const editItem = (id) => {
    setOpen(true);
    fetchStudent(id);
  }

  const fetchCompanies = async () => {
    axios
      .get(`/companies`, {
        headers: { Authorization: `Bearer ${userData.token}` },
      })
      .then((response) => {
        const data = dataFormatter.deserialize(response.data);
        const companiesData = data.map((company) => {
          return {
            id: company.id,
            label: company.name,
            value: company.id,
          };
        });
        setCompanies(companiesData);
      }).catch((error) => {
        console.log(error);
        toast.error("Error in fetching records", {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
        });
      });
  };

  const fetchStudent = async (id) => {
    axios
      .get(`/students/${id}`, {
        headers: { Authorization: `Bearer ${userData.token}` },
      })
      .then((response) => {
        const data = dataFormatter.deserialize(response.data);
        const studentData = {
          id: data.id,
          first_name: data.first_name,
          last_name: data.last_name,
          email_id: data.email_id,
          canvas_id: data.canvas_id,
          company_id: data.company.id,
        };
        setStudentInfo(studentData);
      }).catch(() => {
        toast.error("Error in fetching records", {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
        });
      });
  };

  const handleClose = () => {
    setStudentInfo({ id: null });
    setOpen(false);
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setStudentInfo({...studentInfo, [name]: value});
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let csrf = "";
    //Not present always
    if (document.querySelector("meta[name='csrf-token']"))
      csrf = document.querySelector("meta[name='csrf-token']").getAttribute("content");
      const {
        id,
        first_name,
        last_name,
        email_id,
        canvas_id,
        company_id
      } = studentInfo;

      const method = id !== null ? 'patch' : 'post';
      const url = id == null ? '/students' : `/students/${id}`;
      const message = id !== null ? 'Updated' : 'Created';
      const data = {
        first_name,
        last_name,
        email_id,
        canvas_id,
        company_id,
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

  const handleSelectChange = (value, name) => {
    setStudentInfo({...studentInfo, [name]: value.value});
  };

  return (
    <>
      <ToastContainer />
      <Button
        color="success"
        className="csv-button"
        onClick={() => setOpen(true)}
        id="add_student_button"
      >
        + Add Student
      </Button>
      <Modal isOpen={open} toggle={handleClose} size="lg" style={{maxWidth: '700px', width: '100%'}}>
        <ModalHeader toggle={handleClose} style={{border: "none"}}>Add Students</ModalHeader>
        <ModalBody>
          <Form>
            <Card>
              <CardBody>
                <FormGroup row>
                  <Col sm={6}>
                    <Label for="first_name" sm={5}>First Name</Label>
                    <Input name="first_name" id="first_name" defaultValue={studentInfo.first_name}  onChange={handleInputChange}/>
                  </Col>
                  <Col sm={6}>
                    <Label for="last_name" sm={5}>Last Name</Label>
                    <Input name="last_name" id="last_name" defaultValue={studentInfo.last_name} onChange={handleInputChange} />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col sm={6}>
                    <Label for="email_id" sm={5}>Email</Label>
                    <Input name="email_id" id="email_id" defaultValue={studentInfo.email_id}  onChange={handleInputChange} />
                  </Col>
                  <Col sm={6}>
                    <Label for="canvas_id" sm={5}>Canvas Id</Label>
                    <Input name="canvas_id" id="canvas_id" defaultValue={studentInfo.canvas_id}  onChange={handleInputChange} />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col sm={6}>
                    <Label for="company_name" sm={5}>Company</Label>
                    <Select
                      name="company_id"
                      onChange={(value) => handleSelectChange(value, "company_id")}
                      options={companies}
                      value={companies.filter((option) => (studentInfo.company_id == option.value))}
                      placeholder="Select Passed"
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
      ) : students.length === 0 ? (
        <div className="">No Table Records to Show</div>
      ) : (
        <DashboardTable
          data={students}
          type="Student"
          deleteItem={deleteItem}
          editItem={editItem}
        />
      )}
    </>
  );
}

export default Students;
