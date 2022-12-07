import React from "react";
import ReactDOM from "react-dom";
import CybersecCertTracker from "../cybersec_cert_tracker";
import "./App.css";
import "react-datepicker/dist/react-datepicker.css";

document.addEventListener("DOMContentLoaded", () => {
  const node = document.getElementById("user_data");
  const data = JSON.parse(node.getAttribute("data")) || {};

  ReactDOM.render(
    <CybersecCertTracker data={data} />,
    document.body.appendChild(document.createElement("div"))
  );
});
