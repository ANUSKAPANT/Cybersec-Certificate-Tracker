import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./login.css";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  FormGroup,
  Form,
  Input,
  InputGroupText,
  InputGroup,
  Col,
  Label,
  FormFeedback,
} from "reactstrap";
import axios from "axios";
import NotificationAlert from "react-notification-alert";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailValidation, setEmailValidation] = useState("");
  const [passValidation, setPassValidation] = useState("");

  let notificationAlert;

  useEffect(() => {
    document.body.classList.toggle("login-page");
    return () => {
      document.body.classList.toggle("login-page");
    };
  }, []);

  const validateEmail = (email) => {
    var pattern = new RegExp(
      /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
    );

    if (!pattern.test(email)) {
      console.log("invalid");
      setEmailValidation("Invalid");
      return "Invalid";
    } else {
      setEmailValidation("");
    }
  };

  const handleSubmit = (event) => {
    const csrf = document
      .querySelector("meta[name='csrf-token']")
      .getAttribute("content");
    event.preventDefault();

    var pattern = new RegExp(
      /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
    );

    if (!pattern.test(email)) {
      console.log("invalid");
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
          console.log(response);
          notify("bc");
        }
      })
      .catch((res) => {
        console.log(res);
        notify("bc", res.response.data["error"]);
      });
  };

  const notify = (place, text) => {
    const type = "danger";
    let options = {};
    options = {
      place,
      message: (
        <div>
          <div>
            <i className="" />
            {text}
          </div>
        </div>
      ),
      type,
      icon: "",
      autoDismiss: 7,
    };
    notificationAlert.notificationAlert(options);
  };

  return (
    <>
      <div className="rna-container">
        <NotificationAlert
          ref={(n) => {
            notificationAlert = n;
          }}
        />
      </div>
      <div className="bg-gradient-info">
        <div className="container d-flex flex-column min-vh-100 justify-content-center align-items-center">
          <Col lg="4" md="6" className="mx-auto my-auto">
            <Card className="bg-white login-card">
              <CardTitle tag="h1">Log in</CardTitle>
              <CardBody>
                <Form role="form">
                  <FormGroup>
                    <Label for="userEmail">Email</Label>
                    <Input
                      type="email"
                      name="email"
                      id="userEmail"
                      placeholder="Please Enter valid Email"
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
                      placeholder="Please Enter Password"
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
