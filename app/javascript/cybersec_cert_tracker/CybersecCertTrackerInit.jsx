import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useStoreContext } from "./Store";
import { setUserData } from "./Actions";
import { Navbar, NavbarToggler, NavbarBrand } from "reactstrap";
import axios from "axios";
import { Sidebar, Menu, MenuItem, useProSidebar } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import "./CybersecCertTrackerInit.css";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

function CybersecCertTrackerInit({ userData, children }) {
  const { dispatch } = useStoreContext();
  //   const { toggleSidebar } = useProSidebar();
  const [open, setOpen] = useState(false);

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

  const sideNav = {
    height: "100%",
    width: open === false ? "0px" : "250px",
    position: "fixed",
    zIndex: 1,
    top: 0,
    left: 0,
    backgroundColor: "#111",
    overflowX: "hidden",
    transition: "0.5s",
    paddingTop: "10px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  };

  const linkStyle = {
    padding: "8px 8px 8px 32px",
    textDecoration: "none",
    fontSize: "25px",
    color: "white",
    display: "block",
    transition: "0.3s",
  };

  const logoutStyle = {
    padding: "8px 8px 8px 32px",
    textDecoration: "none",
    fontSize: "25px",
    color: "red",
    display: "block",
    transition: "0.3s",
  };

  const mainStyle = {
    transition: "margin-left .5s",
    marginLeft: open == true ? "250px" : "0px",
  };

  return (
    <>
      <Navbar color="black" dark style={{ marginBottom: "20px" }}>
        <NavbarBrand href="/" className="me-auto">
          CyberSec
        </NavbarBrand>
        <NavbarToggler onClick={() => setOpen(!open)} className="me-2" />
      </Navbar>
      <div id="mySidenav" style={sideNav}>
        <div>
          <Link style={linkStyle} to="/dashboard" id="dashboard_nav">
            Dashboard <KeyboardArrowRightIcon />
          </Link>
          <Link
            style={linkStyle}
            to="/dashboard/students"
            id="students_nav"
            onMouseEnter={() => console.log("lol")}
          >
            Students <KeyboardArrowRightIcon />
          </Link>
          <Link style={linkStyle} to="/dashboard/courses" id="courses_nav">
            Courses <KeyboardArrowRightIcon />
          </Link>
          <Link style={linkStyle} to="/dashboard/companies" id="companies_nav">
            Companies <KeyboardArrowRightIcon />
          </Link>
          <Link
            style={linkStyle}
            to="/dashboard/cert_vouchers"
            id="cert_vouchers_nav"
          >
            Certificate Vouchers <KeyboardArrowRightIcon />
          </Link>
          <Link style={linkStyle} to="/dashboard/exams" id="exams_nav">
            Exams <KeyboardArrowRightIcon />
          </Link>
          <Link style={linkStyle} to="/dashboard/vendors" id="vendors_nav">
            Exams <KeyboardArrowRightIcon />
          </Link>
        </div>
        <div>
          <Link style={logoutStyle} to="/dashboard/users" id="logout_button">
            Logout
          </Link>
        </div>
      </div>

      {/* <MenuItem routerLink={<Link to="/dashboard" />} id="dashboard_nav">
              Dashboard
            </MenuItem>
            <MenuItem
              routerLink={<Link to="/dashboard/students" />}
              id="students_nav"
            >
              Students
            </MenuItem>
            <MenuItem
              routerLink={<Link to="/dashboard/courses" />}
              id="courses_nav"
            >
              Courses
            </MenuItem>
            <MenuItem
              routerLink={<Link to="/dashboard/companies" />}
              id="companies_nav"
            >
              Companies
            </MenuItem>
            <MenuItem
              routerLink={<Link to="/dashboard/cert_vouchers" />}
              id="cert_vouchers_nav"
            >
              Certificate Vouchers
            </MenuItem>
            <MenuItem
              routerLink={<Link to="/dashboard/exams" />}
              id="exams_nav"
            >
              Exams
            </MenuItem>
            <MenuItem
              routerLink={<Link to="/dashboard/vendors" />}
              id="vendors_nav"
            >
              Vendors
            </MenuItem>
            <MenuItem
              routerLink={<Link to="/dashboard/users" />}
              id="users_nav"
            >
              Users
            </MenuItem>
            <MenuItem onClick={() => logout()} id="logout_button">
              Logout
            </MenuItem> */}
      <div style={mainStyle}>{children}</div>
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
