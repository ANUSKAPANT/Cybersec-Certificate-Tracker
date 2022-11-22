import React, { useEffect, useState } from "react";
import {
FaUser, FaAddressCard, FaSchool, FaBook, FaDashcube, FaShippingFast, FaFileSignature
} from "react-icons/fa";
import PropTypes from "prop-types";
import { useStoreContext } from "./Store";
import { setUserData } from "./Actions";
import {
  Navbar,
  NavbarToggler,
  NavbarBrand,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
} from "reactstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";

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
  };

  const linkStyle = {
    padding: "8px 8px 25px 32px",
    textDecoration: "none",
    fontSize: "17px",
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
    marginLeft: open == true ? "270px" : "20px",
    marginRight: "20px",
  };

  const crossContainer = {
    display: "flex",
    justifyContent: "end",
    marginRight: "10px",
  };

  return (
    <>
      <Navbar color="black" dark style={{ marginBottom: "20px" }}>
        {userData.role == "admin" && (
          <NavbarToggler onClick={() => setOpen(!open)} className="me-2" />
        )}
        <NavbarBrand href="/" className="me-auto">
          CyberSec
        </NavbarBrand>
        <UncontrolledDropdown setActiveFromChild>
          <DropdownToggle tag="a" className="nav-link text-light" caret>
            {userData.first_name || "User"}
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem
              onClick={() => logout()}
              id="logout_button"
              className="bg-secondary"
              active
            >
              Logout
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </Navbar>
      <div id="mySidenav" style={sideNav}>
        <div style={crossContainer}>
          <CloseIcon
            style={{ color: "white" }}
            onClick={() => setOpen(!open)}
          />
        </div>
        <Link style={linkStyle} to="/dashboard" id="dashboard_nav">
          <FaDashcube />  {' '} Dashboard
        </Link>
        <Link
          style={linkStyle}
          to="/dashboard/students"
          id="students_nav"
        >
          <FaUser /> {' '} Students
        </Link>
        <Link style={linkStyle} to="/dashboard/courses" id="courses_nav">
        <FaBook /> {' '} Courses
        </Link>
        <Link style={linkStyle} to="/dashboard/companies" id="companies_nav">
        <FaSchool /> {' '} Companies
        </Link>
        <Link
          style={linkStyle}
          to="/dashboard/cert_vouchers"
          id="cert_vouchers_nav"
        >
          <FaAddressCard /> {' '} Certificate Vouchers
        </Link>
        <Link style={linkStyle} to="/dashboard/exams" id="exams_nav">
        <FaFileSignature /> {' '} Exams
        </Link>
        <Link style={linkStyle} to="/dashboard/vendors" id="vendors_nav">
        <FaShippingFast /> {' '} Vendors
        </Link>
        <Link style={linkStyle} to="/dashboard/users" id="users_nav">
        <FaUser /> {' '} Users
        </Link>
      </div>

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
