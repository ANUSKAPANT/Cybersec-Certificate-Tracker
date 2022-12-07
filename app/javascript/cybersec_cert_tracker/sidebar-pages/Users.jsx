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

const role = [
  { label: "User", value: "user" },
  { label: "Admin", value: "admin" },
];

const dataFormatter = new Jsona();

function Users({ userData }) {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [userInfo, setUserInfo] = useState({ id: null });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [error, setError] = useState({});

  const addError = (name) => {
    return (
      error[`${name}`] ? (
        <div>
          <span className="text-danger label"><span className="text-danger label">{error[`${name}`]}</span></span>
        </div>
      ) : null
    );
  }

  const fetchRecords = () => {
    axios
      .get(`/users.json`, {
        headers: { Authorization: `Bearer ${userData.token}` },
      })
      .then((response) => {
        const data = dataFormatter.deserialize(response.data);
        const userData = data.map((user) => {
          return {
            first_name: user.first_name || "",
            last_name: user.last_name || "",
            id: user.id,
            email: user.email,
            role: user.role,
          };
        });
        setLoading(false);
        setUsers(userData);
      })
      .catch(() => {
        setOpenSnackbar(true);
        setSnackbarMsg("Something went wrong");
      });
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const deleteRecords = (idx) => {
    let csrf = "";
    if (document.querySelector("meta[name='csrf-token']"))
      csrf = document
        .querySelector("meta[name='csrf-token']")
        .getAttribute("content");
    axios
      .delete(`/users/${idx}`, {
        headers: {
          Authorization: `Bearer ${userData.token}`,
          "X-CSRF-Token": csrf,
        },
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
    setUsers((prev) => {
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

  const fetchUser = async (id) => {
    axios
      .get(`/users/${id}`, {
        headers: { Authorization: `Bearer ${userData.token}` },
      })
      .then((response) => {
        const user = dataFormatter.deserialize(response.data);
        const userData = {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          role: user.role,
        };
        setUserInfo(userData);
      })
      .catch((error) => {
        setOpenSnackbar(true);
        setSnackbarMsg("Something went wrong");
      });
  };

  const editItem = (id) => {
    setOpen(true);
    fetchUser(id);
  };

  const handleClose = () => {
    setUserInfo({ id: null });
    setOpen(false);
    setError({});
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let csrf = "";
    //Not present always
    if (document.querySelector("meta[name='csrf-token']"))
      csrf = document
        .querySelector("meta[name='csrf-token']")
        .getAttribute("content");
    const { id, first_name, last_name, email, password, role } = userInfo;

    const method = id !== null ? "patch" : "post";
    const url = id == null ? "/create_user" : `/users/${id}`;
    const message = id !== null ? "Updated" : "Created";
    const data = { first_name, last_name, email, password, role };
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
      .then((res) => {
        setOpenSnackbar(true);
        setSnackbarMsg(`Successfully ${message}`);
        onFormSubmission(res, method);
        handleClose();
      })
      .catch((err) => {
        setError(err.response.data);
        setOpenSnackbar(true);
        setSnackbarMsg("Something went wrong");
      });
  };

  const onFormSubmission = (response, method) => {
    const data = dataFormatter.deserialize(response.data);
    const userData = {
      first_name: data.first_name || "",
      last_name: data.last_name || "",
      id: data.id,
      email: data.email,
      role: data.role,
    };
    let newData = [...users];
    if(method == "post") {
      newData = [ userData, ...newData];
    } else {
      newData = newData.map(el => (el.id === userData.id ? {...el, ...userData} : el));
    }
    setUsers(newData);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSelectChange = (value, name) => {
    setUserInfo({ ...userInfo, [name]: value.value });
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
        + Add User
      </Button>
      <Modal
        isOpen={open}
        toggle={handleClose}
        size="lg"
        style={{ maxWidth: "700px", width: "100%" }}
      >
        <ModalHeader toggle={handleClose} style={{ border: "none" }}>
          Add User
        </ModalHeader>
        <ModalBody>
          <Form>
            <Card>
              <CardBody>
                <FormGroup row>
                  <Col sm={6}>
                    <Label for="first_name" sm={5}>
                      First Name
                    </Label>
                    <Input
                      name="first_name"
                      id="first_name"
                      defaultValue={userInfo.first_name}
                      onChange={handleInputChange}
                    />
                    {error['first_name'] && addError('first_name')}
                  </Col>
                  <Col sm={6}>
                    <Label for="last_name" sm={5}>
                      Last Name
                    </Label>
                    <Input
                      name="last_name"
                      id="last_name"
                      defaultValue={userInfo.last_name}
                      onChange={handleInputChange}
                    />
                    {error['last_name'] && addError('last_name')}
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col sm={6}>
                    <Label for="email" sm={5}>
                      Email
                    </Label>
                    <Input
                      name="email"
                      id="email"
                      type="email"
                      defaultValue={userInfo.email}
                      onChange={handleInputChange}
                    />
                    {error['email'] && addError('email')}
                  </Col>
                  <Col sm={6}>
                    <Label for="password" sm={5}>
                      Password
                    </Label>
                    <Input
                      name="password"
                      id="password"
                      type="password"
                      defaultValue={userInfo.password}
                      onChange={handleInputChange}
                    />
                    {error['password'] && addError('password')}
                  </Col>
                  <Col sm={6}>
                    <Label for="role" sm={6}>
                      Role
                    </Label>
                    <Select
                      name="role"
                      onChange={(value) => handleSelectChange(value, "role")}
                      options={role}
                      value={role.filter(
                        (option) => userInfo.role == option.value
                      )}
                      placeholder="Select Role"
                    />
                    {error['role'] && addError('role')}
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
      ) : users.length === 0 ? (
        <div className="">No Table Records to Show</div>
      ) : (
        <DashboardTable
          data={users}
          type="User"
          deleteItem={deleteItem}
          editItem={editItem}
        />
      )}
    </>
  );
}

export default Users;
