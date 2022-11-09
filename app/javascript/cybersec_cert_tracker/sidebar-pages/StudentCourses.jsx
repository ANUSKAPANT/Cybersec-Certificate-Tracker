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

const voucherOptions = [
  {label: "Purchased", value: true},
  {label: "Not Purchased", value: false}
]

const completionOptions = [
  {label: "Completed", value: true},
  {label: "Incomplete", value: false}
]

const dataFormatter = new Jsona();

function StudentCourses({ userData }) {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [courseOptions, setCourseOptions] = useState([]);
  const [studentOptions, setStudentOptions] = useState([]);
  const [studentCourseInfo, setStudentCourseInfo] = useState({id: null});
  const [studentCourses, setStudentCourses] = useState([]);


  const handleClose = () => {
    setStudentCourseInfo({});
    setOpen(false);
  }

  const fetchRecords = () => {
    axios
      .get(`/student_courses`, {
        headers: { Authorization: `Bearer ${userData.token}` },
      })
      .then((response) => {
        const data = dataFormatter.deserialize(response.data);
        const studentCourseData = data.map((s) => {
          return {
            id: s.id,
            student: s.student,
            course: s.course,
            student_name: s.student.full_comma_separated_name,
            course_name: s.course.name,
            registration_date: s.registration_date,
            voucher_purchased: String(s.voucher_purchased),
            test_result: s.test_result,
            canvas_course_completion: String(s.canvas_course_completion),
            dcldp_code: s.dcldp_code, 
          };
        });
        setLoading(false);
        setStudentCourses(studentCourseData);
      }).catch(() => {
        toast.error("Error in fetching records", {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
        });
      });
  };

  const fetchStudents = () => {
    axios
      .get(`/students`, {
        headers: { Authorization: `Bearer ${userData.token}` },
      })
      .then((response) => {
        const data = dataFormatter.deserialize(response.data);
        const studentData = data.map((student) => {
          return {
            id: student.id,
            label: student.full_comma_separated_name,
            value: student.id,
            email_id: student.email_id,
          };
        });
        setStudentOptions(studentData);
      }).catch(() => {
        toast.error("Error in fetching records", {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
        });
      });
  };

  const fetchStudentCourse = (id) => {
    axios
      .get(`/student_courses/${id}`, {
        headers: { Authorization: `Bearer ${userData.token}` },
      })
      .then((response) => {
        const data = dataFormatter.deserialize(response.data);
        const studentData = {
          id: data.id,
          student: data.student,
          course: data.course,
          registration_date: data.registration_date,
          voucher_purchased: data.voucher_purchased,
          test_result: data.test_result,
          canvas_course_completion: data.canvas_course_completion,
          dcldp_code: data.dcldp_code, 
          student_id: data.student.id,
          course_id: data.course.id,
        };
        setStudentCourseInfo(studentData);
      }).catch(() => {
        toast.error("Error in fetching records", {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
        });
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
    fetchStudents();
    fetchCourses();
  }, []);

  const deleteRecords = (idx) => {
    axios
      .delete(`/student_courses/${idx}`, {
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
    fetchStudentCourse(id);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    let csrf = "";
    //Not present always
    if (document.querySelector("meta[name='csrf-token']"))
      csrf = document.querySelector("meta[name='csrf-token']").getAttribute("content");
      const {
        id,
        registration_date,
        voucher_purchased,
        test_result,
        canvas_course_completion,
        dcldp_code,
        student_id,
        course_id,
      } = studentCourseInfo;
      const method = id !== null ? 'patch' : 'post';
      const url = id == null ? '/student_courses' : `/student_courses/${id}`;
      const message = id !== null ? 'Updated' : 'Created';
      const data = {
        registration_date,
        voucher_purchased,
        test_result,
        canvas_course_completion,
        dcldp_code,
        student_id,
        course_id,
      };
      axios.request({
        method,
        url,
        headers: {
          "Content-type": "application/json",
          "X-CSRF-Token": csrf,
          "Authorization": `Bearer ${userData.token}`,
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
    setStudentCourseInfo({...studentCourseInfo, [name]: value});
  };

  const handleSelectChange = (value, name) => {
    setStudentCourseInfo({...studentCourseInfo, [name]: value.value});
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
        + Add Student Course
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
                      value={studentOptions.filter((option) => studentCourseInfo.student_id == option.value)}
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
                      value={courseOptions.filter((option) => studentCourseInfo.course_id == option.value)}
                      placeholder="Select Course"
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col sm={12}>
                    <Label for="registration_date" sm={6}>Registration Date</Label>
                    <Input name="registration_date" id="registration_date" defaultValue={studentCourseInfo.registration_date}  onChange={handleInputChange} />
                  </Col>
                </FormGroup>
                <FormGroup row>
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
                </FormGroup>
                <FormGroup row>
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
      ) : studentCourses.length === 0 ? (
        <div className="">No Table Records to Show</div>
      ) : (
        <DashboardTable
          data={studentCourses}
          type="Student Course"
          deleteItem={deleteItem}
          editItem={editItem}
        />
      )}
    </>
  );
}

export default StudentCourses;
