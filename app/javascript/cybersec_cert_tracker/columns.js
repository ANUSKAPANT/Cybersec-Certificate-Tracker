import React from "react";

export default function Columns(table) {
  switch (table) {
    case "Dashboard":
      return [
        {
          Header: "Cert Name",
          accessor: "cert_name",
        },
        {
          Header: "Full Name",
          accessor: "full_name",
        },
        {
          Header: "Email Address",
          accessor: "email_address",
        },
        {
          Header: "Company Name",
          accessor: "company_name",
        },
        {
          Header: "Registration Date",
          accessor: "registration_date",
        },
      ];

    case "Student":
      return [
        {
          Header: "First Name",
          accessor: "first_name",
        },
        {
          Header: "Last Name",
          accessor: "last_name",
        },
        {
          Header: "Email Address",
          accessor: "email_id",
        },
        {
          Header: "Courses",
          accessor: "courses",
          Cell: ({ row }) => {
            if (row.original.courses.length == 1) {
              return <div>{row.original.courses[0].name}</div>;
            }
            return row.original.courses.map((course, number) => {
              let label = number + 1;
              return (
                <div key={number}>
                  <strong>{label}</strong>
                  {". " + course.name}
                </div>
              );
            });
          },
        },
        {
          Header: "Canvas Id",
          accessor: "canvas_id",
        },
        {
          Header: "Company",
          accessor: "company.name",
        },
      ];

    case "Course":
      return [
        {
          Header: "Course Name",
          accessor: "name",
        },
        {
          Header: "Vendor",
          accessor: "vendor",
        },
      ];

    case "Company":
      return [
        {
          Header: "Company Name",
          accessor: "name",
        },
        {
          Header: "SMC",
          accessor: "smc",
        },
      ];

    case "User":
      return [
        {
          Header: "Email",
          accessor: "email",
        },
        {
          Header: "Role",
          accessor: "role",
        },
      ];

    case "Exam":
      return [
        {
          Header: "Certification Name",
          accessor: "certification_name",
        },
        {
          Header: "Exam Code",
          accessor: "exam_code",
        },
        {
          Header: "Exam Date",
          accessor: "exam_date",
        },
        {
          Header: "Exam Grade",
          accessor: "grade",
        },
        {
          Header: "Certificate Voucher",
          accessor: "cert_voucher",
        },
      ];

    case "Vendor":
      return [
        {
          Header: "Name",
          accessor: "name",
        },
        {
          Header: "Courses",
          accessor: "courses",
          Cell: ({ row }) => {
            if (row.original.courses.length == 1) {
              return <div>{row.original.courses[0].name}</div>;
            }
            return row.original.courses.map((course, number) => {
              let label = number + 1;
              return (
                <div key={number}>
                  <strong>{label}</strong>
                  {". " + course.name}
                </div>
              );
            });
          },
        },
      ];

    case "Certificate_Voucher":
      return[
        {
          Header: "Cert Name",
          accessor: "cert_name",
        },
        {
          Header: "Course",
          accessor: "course",
        },
        {
          Header: "Full Name",
          accessor: "full_name",
        },
        {
          Header: "Created Date",
          accessor: "created_date",
        },
        {
          Header: "Expiry Date",
          accessor: "expiry_date",
        },
      ];

    default:
      break;
  }
}
