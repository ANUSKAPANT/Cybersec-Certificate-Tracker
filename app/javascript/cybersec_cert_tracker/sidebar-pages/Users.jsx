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

  const fetchRecords = () => {
    axios
      .get(`/users.json`, {
        headers: { Authorization: `Bearer ${userData.token}` },
      })
      .then((response) => {
        const data = dataFormatter.deserialize(response.data);
        const userData = data.map((user) => {
          return {
            id: user.id,
            email: user.email,
            role: user.role,
          };
        });
        setLoading(false);
        setUsers(userData);
      })
      .catch(() => {
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
        console.log(userData);
        setUserInfo(userData);
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

  const editItem = (id) => {
    setOpen(true);
    fetchUser(id);
  };

  const handleClose = () => {
    setUserInfo({ id: null });
    setOpen(false);
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
        console.log(res);
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
        console.log(error);
        toast.error("Error Occured", {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
        });
      });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSelectChange = (value, name) => {
    setUserInfo({ ...userInfo, [name]: value.value });
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
                  </Col>
                </FormGroup>
              </CardBody>
            </Card>
          </Form>
        </ModalBody>
        <ModalFooter style={{ border: "none" }}>
          <Button color="primary" onClick={handleSubmit}>
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
