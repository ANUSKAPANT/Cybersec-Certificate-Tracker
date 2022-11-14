import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useStoreContext } from "./Store";
import { setUserData } from "./Actions";
import {
  Navbar, NavbarToggler, NavbarBrand, DropdownMenu, DropdownItem, UncontrolledDropdown, DropdownToggle
} from "reactstrap";
import axios from "axios";
import { Sidebar, Menu, MenuItem, useProSidebar } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import {
  FaUserGraduate,
  FaUserAlt,
  FaRegChartBar,
}from "react-icons/fa";

import { 
  IoBusinessSharp,
  IoBookSharp
} from "react-icons/io5";

import { 
  TiVendorMicrosoft 
} from "react-icons/ti";

import { 
  MdDashboard 
} from "react-icons/md";

import{
  TbCertificate
} from "react-icons/tb";

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
        {userData.role == "admin" && (<NavbarToggler onClick={() => toggleSidebar()} className="me-2" />)}
        <NavbarBrand href="/" className="me-auto">
          CyberSec
        </NavbarBrand>
        <UncontrolledDropdown setActiveFromChild>
          <DropdownToggle tag="a" className="nav-link text-light" caret>
            {userData.first_name || "User"}
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem onClick={() => logout()} id="logout_button" className="bg-secondary" active>Logout</DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </Navbar>
      <div className="sidebar">
        <Sidebar breakPoint="always" backgroundColor="rgb(0, 0, 0, 1)">
          <Menu>
            <MenuItem routerLink={<Link to="/dashboard" />} id="dashboard_nav" icon = {<MdDashboard/>}>
              Dashboard
            </MenuItem>
            <MenuItem routerLink={<Link to="/dashboard/students" />} id="students_nav" icon = {<FaUserGraduate/>}>
              Students
            </MenuItem>
            <MenuItem routerLink={<Link to="/dashboard/courses" />} id="courses_nav" icon = {<IoBookSharp/>}>
              Courses
            </MenuItem>
            <MenuItem routerLink={<Link to="/dashboard/companies" />} id="companies_nav" icon = {<IoBusinessSharp/>}>
              Companies
            </MenuItem>
            <MenuItem routerLink={<Link to="/dashboard/cert_vouchers" />} id="cert_vouchers_nav" icon = {<TbCertificate/>}>
              Certificate Vouchers
            </MenuItem>
            <MenuItem routerLink={<Link to="/dashboard/exams" />} id="exams_nav" icon = {<FaRegChartBar/>}>
              Exams
            </MenuItem>
            <MenuItem routerLink={<Link to="/dashboard/vendors" />} id="vendors_nav" icon = {<TiVendorMicrosoft/>}>
              Vendors
            </MenuItem>
            <MenuItem routerLink={<Link to="/dashboard/users" />} id="users_nav" icon = { <FaUserAlt/>}>
              Users
            </MenuItem>
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
