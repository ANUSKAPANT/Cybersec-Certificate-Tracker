import React from "react";

export default function Columns(table) {
  switch (table) {
    case "Dashboard":
      return [
        {
          Header: "Full Name",
          accessor: "full_name",
        },
        {
          Header: "Canvas Id",
          accessor: "canvas_id",
        },
        {
          Header: "Title",
          accessor: "title",
        },
        {
          Header: "Company Name",
          accessor: "company_name",
        },
        {
          Header: "Email Address",
          accessor: "email_address",
        },
        {
          Header: "Course Name",
          accessor: "canvas_course_enrollment",
        },
        {
          Header: "Registration Date",
          accessor: "registration_date",
        },
        {
          Header: "DLDCP_code",
          accessor: "dldcp_code",
        },
        {
          Header: "Voucher Purchased",
          accessor: "voucher_purchased",
          Cell: ({ row }) => {
            const status = row.original.voucher_purchased
              ? "Purchased"
              : "False";
            return status;
          },
        },
        {
          Header: "Voucher Code",
          accessor: "voucher_code",
          Cell: ({ row }) => {
            const status = row.original.voucher_code
              ? row.original.voucher_code
              : "N/A";
            return status;
          },
        },
        {
          Header: "Cert Name",
          accessor: "cert_name",
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
          Header: "Test Result",
          accessor: "test_result",
        },
        {
          Header: "Score",
          accessor: "score",
          Cell: ({ row }) => {
            const status = row.original.score ? row.original.score : "N/A";
            return status;
          },
        },
        {
          Header: "Test Center ID",
          accessor: "test_center_id",
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

    case "Student Course":
      return [
        {
          Header: "Student",
          accessor: "student_name",
        },
        {
          Header: "Course",
          accessor: "course_name",
        },
        {
          Header: "Registration Date",
          accessor: "registration_date",
        },
        {
          Header: "Canvas Course Completion",
          accessor: "canvas_course_completion",
        },
        {
          Header: "Dcldp Code",
          accessor: "dcldp_code",
        },
        {
          Header: "Voucher Purchased",
          accessor: "voucher_purchased",
        },
        {
          Header: "Test Result",
          accessor: "test_result",
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
          Header: "First Name",
          accessor: "first_name",
        },
        {
          Header: "Last Name",
          accessor: "last_name",
        },
        {
          Header: "Email",
          accessor: "email",
        },
        {
          Header: "Role",
          accessor: "role",
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
      return [
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
          Header: "Voucher Code",
          accessor: "voucher_code",
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
          Header: "Score",
          accessor: "score",
        },
        {
          Header: "Test Result",
          accessor: "test_result",
        },
        {
          Header: "Test Center",
          accessor: "test_center_id",
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
