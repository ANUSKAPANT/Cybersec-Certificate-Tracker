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

function StudentCourses({ userData }) {
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = React.useState(false);
  const [studentCourses, setStudentCourses] = useState([]);

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
            voucher_purchased: s.voucher_purchased,
            test_result: s.test_result,
            canvas_course_completion: s.canvas_course_completion,
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

  useEffect(() => {
    fetchRecords();
  }, []);

  const deleteRecords = async (idx) => {
    axios
      .delete(`/student_coursees/${idx}`, {
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
        />
      )}
    </>
  );
}

export default StudentCourses;
