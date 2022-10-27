import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useStoreContext } from "./Store";
import { setUserData } from "./Actions";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import axios from "axios";
import { Sidebar, Menu, MenuItem, useProSidebar } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import "./CybersecCertTrackerInit.css";

function CybersecCertTrackerInit({ userData, children }) {
  const { dispatch } = useStoreContext();
  const { toggleSidebar } = useProSidebar();

  useEffect(() => {
    setUserData(dispatch, userData);
  }, []);

  const logout = () => {
    let csrf;

    if (document.querySelector("meta[name='csrf-token']"))
      csrf = document
        .querySelector("meta[name='csrf-token']")
        .getAttribute("content");

    axios({
      method: "delete",
      url: "/users/sign_out",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrf,
      },
    }).then(() => {
      window.location.href = "/users/sign_in";
    });
  };

  return (
    <>
      <Navbar color="black" dark style={{ marginBottom: "20px" }}>
        <NavbarBrand href="/" className="me-auto">
          CyberSec
        </NavbarBrand>
        <NavbarToggler onClick={() => toggleSidebar()} className="me-2" />
      </Navbar>
      <div className="sidebar">
        <Sidebar breakPoint="always" backgroundColor="rgb(0, 0, 0, 1)">
          <Menu>
            <MenuItem routerLink={<Link to="/dashboard/students" />}>
              Students
            </MenuItem>
            <MenuItem> Courses</MenuItem>
            <MenuItem> Companies</MenuItem>
            <MenuItem> Certificate Vouchers</MenuItem>
            <MenuItem> Exams</MenuItem>
            <MenuItem> Vendors</MenuItem>
            <MenuItem> Users</MenuItem>
          </Menu>
        </Sidebar>
      </div>
      {children}
    </>
  );
}
export default CybersecCertTrackerInit;

CybersecCertTrackerInit.propTypes = {
  children: PropTypes.node,
  userData: PropTypes.shape({
    role: PropTypes.string,
  }),
};

CybersecCertTrackerInit.defaultProps = {
  children: null,
  userData: {},
};
