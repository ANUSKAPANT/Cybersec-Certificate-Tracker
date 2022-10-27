import React from "react";

export default function Columns(table) {
  switch (table) {
    case "Dashboard":
      return [
        {
          Header: "Cert Name",
          accessor: "cert_name",
          type: "default",
        },
        {
          Header: "Full Name",
          accessor: "full_name",
          type: "default",
        },
        {
          Header: "Email Address",
          accessor: "email_address",
          type: "default",
        },
        {
          Header: "Company Name",
          accessor: "company_name",
          type: "default",
        },
        {
          Header: "Registration Date",
          accessor: "registration_date",
          type: "default",
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
    default:
      break;
  }
}
// [
//       {
//         Header: "Cert Name",
//         accessor: "cert_name",
//       },
//       {
//         Header: "Full Name",
//         accessor: "full_name",
//       },
//       {
//         Header: "Email Address",
//         accessor: "email_address",
//       },
//       {
//         Header: "Company Name",
//         accessor: "company_name",
//       },
//       {
//         Header: "Registration Date",
//         accessor: "registration_date",
//       },
//       // {
//       //   Header: "Age",
//       //   accessor: "age",
//       //   Filter: SliderColumnFilter,
//       //   filter: "equals",
//       // },
//       // {
//       //   Header: "Visits",
//       //   accessor: "visits",
//       //   Filter: NumberRangeColumnFilter,
//       //   filter: "between",
//       // },
//       // {
//       //   Header: "Status",
//       //   accessor: "status",
//       //   Filter: SelectColumnFilter,
//       //   filter: "includes",
//       // },
//       // {
//       //   Header: "Profile Progress",
//       //   accessor: "progress",
//       //   Filter: SliderColumnFilter,
//       //   filter: filterGreaterThan,
//       // },
//     ],
