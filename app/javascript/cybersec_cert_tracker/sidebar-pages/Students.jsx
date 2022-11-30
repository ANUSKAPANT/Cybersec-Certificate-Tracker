import React, { useEffect, useState } from "react";
import "../table.css";
import DashboardTable from "../DashboardTable";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import axios from "axios";
import { Button } from "reactstrap";
import Snackbar from '@mui/material/Snackbar';

import ClipLoader from "react-spinners/ClipLoader";
import Jsona from "jsona";

import StudentForm from "../StudentForm";

const dataFormatter = new Jsona();

function Students({ userData }) {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [studentId, setStudentId] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");

  const fetchRecords = async () => {
    try {
      const response = await axios.get(`/students`, {
        headers: { Authorization: `Bearer ${userData.token}` },
      });
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
          title: student.title,
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
    } catch (error) {
      setOpenSnackbar(true);
      setSnackbarMsg("Something went wrong");
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const deleteRecords = (idx) => {
    axios
      .delete(`/students/${idx}`, {
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

  const deleteItem = (idx) => {
    deleteRecords(idx);
    setStudents((prev) => {
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
    setStudentId(id);
  };

  const onFormSubmission = async () => {
    setLoading(true);
    await fetchRecords();
    setLoading(false);
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
        onClick={() => {
          setStudentId(null);
          setOpen(true);
        }}
        id="add_student_button"
      >
        + Add Student
      </Button>
      <StudentForm
        userData={userData}
        studentId={studentId}
        open={open}
        setOpen={setOpen}
        afterSubmit={onFormSubmission}
      />
      {loading == true ? (
        <div style={spinnerContainer}>
          <div style={spinner}>
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
