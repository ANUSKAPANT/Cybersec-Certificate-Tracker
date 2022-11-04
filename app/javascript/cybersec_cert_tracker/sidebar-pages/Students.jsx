import React, { useEffect, useState } from "react";
import "../table.css";
import DashboardTable from "../DashboardTable";
import { Button } from "reactstrap";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClipLoader from "react-spinners/ClipLoader";
import "../Dashboard.css";
import Jsona from "jsona";
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';

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
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    setOpen(false);
    console.log(event);
    console.log(formValue)
    submitData();
  }

  const handleChange = (field, event) => {
    const temp = formValue;
    temp[field] = event.target.value
    setFormValue(temp);
  };



  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 900,
    height: 700,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };

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

  useEffect(() => {
    fetchRecords();
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

  return (
    <>
      <ToastContainer />
      <Button
        color="success"
        className="csv-button"
        onClick={() => setOpen(true)}
        id="add_student_button"
      >
        + Add Students
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box
          component="form"
          sx={{
            ...style,
            '& .MuiTextField-root': { m: 1, width: '40ch' }, display: 'flex', flexWrap: 'wrap'
          }}
          noValidate
          autoComplete="off"
        >
          <div>
            <h2>Add Student Information</h2>
            <TextField
              label="First Name"
              value={formValue.first_name}
              id="first_name"
              onChange={(e) => { handleChange('first_name', e) }}
            />
            <TextField
              label="Last Name"
              value={formValue.last_name}
              id="last_name"
              onChange={(e) => { handleChange('last_name', e) }}
            />

            <TextField
              label="Email Address"
              value={formValue.email}
              id="email"
              onChange={(e) => { handleChange('email', e) }}
            />

            <TextField
              label="Company ID"
              value={formValue.company_id}
              id="company_id"
              onChange={(e) => { handleChange('company_id', e) }}
            />

            <div></div>

            <FormControl fullWidth sx={{ m: 1, width: '50ch' }}>
              <InputLabel id="demo-simple-select-label">Canvas Course Enrollment</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={formValue.canvas_course}
                onChange={(e) => { handleChange('canvas_course', e) }}
                label="Canvas Course Enrollment"
              >
                <MenuItem value={10}>CYBER: CompTIA Network+ Certificate Prep Course</MenuItem>
                <MenuItem value={20}>CYBER: CompTIA Security+ Certificate Prep Course</MenuItem>
              </Select>
            </FormControl>

            <div></div>
            <TextField
              label="Title"
              value={formValue.title}
              id="title"
              onChange={(e) => { handleChange('title', e) }}
            />

            <TextField
              label="Canvas ID"
              value={formValue.canvas_id}
              id="canvas_id"
              onChange={(e) => { handleChange('canvas_id', e) }}
            />

            <div></div>
            <FormControl fullWidth sx={{ m: 1, width: '50ch' }}>
              <InputLabel id="demo-simple-select-label">Canvas Course Progress</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={formValue.course_progress}
                onChange={(e) => { handleChange('course_progress', e) }}
                label="Canvas Course Progress"
              >
                <MenuItem value={10}>Completed</MenuItem>
                <MenuItem value={20}>Not Completed</MenuItem>
              </Select>
            </FormControl>
            <div></div>
            <TextField
              label="SMC"
              value={formValue.smc}
              id="smc"
              onChange={(e) => { handleChange('smc', e) }}
            />

            <TextField
              label="Registration Date"
              value={formValue.reg_date}
              onChange={(e) => { handleChange('reg_date', e) }}
            />

            <TextField
              label="DCLDP Code"
              value={formValue.dcldp}
              onChange={(e) => { handleChange('dcldp', e) }}
            />

            <TextField
              label="Voucher Purchased Date"
              value={formValue.voucher_purchase_date}
              onChange={(e) => { handleChange('voucher_purchase_date', e) }}
            />

            <TextField
              label="Voucher Use By"
              value={formValue.voucher_use_by}
              onChange={(e) => { handleChange('voucher_use_by', e) }}
            />
            <div></div>
            <Stack direction="row" spacing={2}>
              <Button variant="contained" onClick={handleClose}>Close</Button>
              <Button variant="contained" onClick={handleSubmit} id="form_submit">Submit</Button>
            </Stack>
          </div>
        </Box>
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
        />
      )}
    </>
  );
}

export default Students;
