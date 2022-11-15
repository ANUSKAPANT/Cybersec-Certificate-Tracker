import React, { useEffect, useState } from "react";
import "../table.css";
import DashboardTable from "../DashboardTable";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Button } from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import ClipLoader from "react-spinners/ClipLoader";
import Jsona from "jsona";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";

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
import StudentForm from "../StudentForm";

const dataFormatter = new Jsona();

function Students({ userData }) {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [show, setShow] = useState(false);
  const [formValue, setFormValue] = useState({});

  const handleClose = () => setOpen(false);

  const submitData = async () => {
    let csrf = "";
    //Not present always
    if (document.querySelector("meta[name='csrf-token']"))
      csrf = document
        .querySelector("meta[name='csrf-token']")
        .getAttribute("content");

    //await axios.post(`/students`, { headers: { Authorization: `Bearer ${userData.token}`, "X-CSRF-Token": csrf}, data:{...formValue} });
    const response = await axios({
      method: "POST",
      url: "/students.json",
      headers: {
        "Content-type": "application/json",
        "X-CSRF-Token": csrf,
      },
      data: { ...formValue },
    });

    console.log(response);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setOpen(false);
    console.log(event);
    console.log(formValue);
    submitData();
  };

  const handleChange = (field, event) => {
    const temp = formValue;
    temp[field] = event.target.value;
    setFormValue(temp);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 900,
    height: 700,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };
  const [studentId, setStudentId] = useState(null);

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

  return (
    <>
      <ToastContainer />
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
