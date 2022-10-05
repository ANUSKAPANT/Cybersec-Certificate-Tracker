import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./login.css";
// reactstrap components
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  FormGroup,
  Form,
  Input,
  Col,
  Label,
  FormFeedback,
} from "reactstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailValidation, setEmailValidation] = useState("");
  const [passValidation, setPassValidation] = useState("");

  useEffect(() => {
    document.body.classList.toggle("login-page");
    return () => {
      document.body.classList.toggle("login-page");
    };
  }, []);

  const notify = (message) => {
    toast.error(message, {
      position: "bottom-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const handleSubmit = (event) => {
    let csrf = "";
    //Not present always
    if (document.querySelector("meta[name='csrf-token']"))
      csrf = document
        .querySelector("meta[name='csrf-token']")
        .getAttribute("content");
    event.preventDefault();

    var pattern = new RegExp(
      /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
    );

    if (!pattern.test(email)) {
      setEmailValidation("Invalid");
      return "Invalid";
    } else {
      setEmailValidation("");
    }

    axios({
      method: "post",
      url: "/users/sign_in.json",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrf,
      },
      data: {
        user: { email, password },
      },
    })
      .then((response) => {
        if (response.status === 201) {
          window.location.href = "/";
        } else {
          notify(res.response.data["error"]);
        }
      })
      .catch((res) => {
        notify(res.response.data["error"]);
      });
  };

  return (
    <>
      <ToastContainer/>
      <div className="bg-gradient-info">
        <div className="container d-flex flex-column min-vh-100 justify-content-center align-items-center">
          <Col lg="4" md="6" className="mx-auto my-auto">
            <Card className="bg-white login-card">
              <CardTitle tag="h1">Log in</CardTitle>
              <CardBody>
                <Form role="form" onSubmit={handleSubmit}>
                  <FormGroup>
                    <Label for="userEmail">Email</Label>
                    <Input
                      type="email"
                      name="email"
                      id="userEmail"
                      placeholder="Enter Email"
                      onChange={(e) => setEmail(e.target.value)}
                      invalid={emailValidation == "Invalid"}
                    />
                    <FormFeedback invalid>
                      Please Enter a valid email
                    </FormFeedback>
                  </FormGroup>
                  <FormGroup>
                    <Label for="userPassword">Password</Label>
                    <Input
                      type="password"
                      name="password"
                      id="userPassword"
                      placeholder="Enter Password"
                      onChange={(e) => setPassword(e.target.value)}
                      invalid={passValidation == "Invalid"}
                    />
                    <FormFeedback invalid>
                      Please Enter a valid password containing BOTH letters and
                      numbers
                    </FormFeedback>
                  </FormGroup>
                  <Button
                    block
                    className="mt-3"
                    color="primary"
                    onClick={handleSubmit}
                    size="lg"
                    type="submit"
                    id="login_button"
                  >
                    Submit
                  </Button>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </div>
      </div>
    </>
  );
}

document.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render(
    <Login />,
    document.body.appendChild(document.createElement("div"))
  );
});
