import React, { useEffect, useState } from "react";
import "../table.css";
import DashboardTable from "../DashboardTable";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Button } from 'reactstrap';
import "react-toastify/dist/ReactToastify.css";
import ClipLoader from "react-spinners/ClipLoader";
import "../Dashboard.css";
import Jsona from "jsona";
import StudentForm from '../StudentForm'

const dataFormatter = new Jsona();

function Students({ userData }) {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [studentId, setStudentId] = useState(null);

  const fetchRecords = async () => {
    try {
      const response = await axios
        .get(`/students`, {
          headers: { Authorization: `Bearer ${userData.token}` },
        })
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
    } catch (error) {
      toast.error("Error in fetching records", {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
      });
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
    setStudentId(id);
  }

  const onFormSubmission = async () => {
    setLoading(true);
    await fetchRecords();
    setLoading(false);
  }

  return (
    <>
      <ToastContainer />
      <Button
        color="success"
        className="csv-button"
        onClick={() => { setStudentId(null); setOpen(true) }}
        id="add_student_button"
      >
        + Add Student
      </Button>
      <StudentForm userData={userData} studentId={studentId} open={open} setOpen={setOpen} afterSubmit={onFormSubmission} />
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
