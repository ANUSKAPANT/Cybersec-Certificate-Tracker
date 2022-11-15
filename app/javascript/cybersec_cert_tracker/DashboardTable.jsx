import React, { useState, useEffect } from "react";
import {
  useTable,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce,
  useSortBy,
} from "react-table";
import { Table, Card } from "reactstrap";
import TextField from "@mui/material/TextField";
import ReactPaginate from "react-paginate";
import Columns from "./columns";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import { useNavigate } from "react-router-dom";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { Button } from "reactstrap";
import SortIcon from "@mui/icons-material/Sort";

// Define a default UI for filtering
function GlobalFilter({ numRows, globalFilter, setGlobalFilter }) {
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  const superContainer = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginLeft: "10px",
  };

  return (
    <div style={superContainer}>
      <div>Search:</div>
      <TextField
        id="outlined-basic"
        variant="outlined"
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`${numRows} records...`}
        size="small"
      />
    </div>
  );
}

// Define a default UI for filtering
// {
//   column: { filterValue, preFilteredRows, setFilter},
// }
function DefaultColumnFilter(filterValue, preFilteredRows, setFilter, numRows) {
  return (
    <input
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${numRows} records...`}
    />
  );
}

// This is a custom filter UI for selecting
// a unique option from a list
function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  // Render a multi-select box
  return (
    <select
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

// This is a custom filter UI that uses a
// slider to set the filter value between a column's
// min and max values
function SliderColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // Calculate the min and max
  // using the preFilteredRows

  const [min, max] = React.useMemo(() => {
    let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    preFilteredRows.forEach((row) => {
      min = Math.min(row.values[id], min);
      max = Math.max(row.values[id], max);
    });
    return [min, max];
  }, [id, preFilteredRows]);

  return (
    <>
      <input
        type="range"
        min={min}
        max={max}
        value={filterValue || min}
        onChange={(e) => {
          setFilter(parseInt(e.target.value, 10));
        }}
      />
      <button onClick={() => setFilter(undefined)}>Off</button>
    </>
  );
}

// This is a custom UI for our 'between' or number range
// filter. It uses two number boxes and filters rows to
// ones that have values between the two
function NumberRangeColumnFilter({
  column: { filterValue = [], preFilteredRows, setFilter, id },
}) {
  const [min, max] = React.useMemo(() => {
    let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    preFilteredRows.forEach((row) => {
      min = Math.min(row.values[id], min);
      max = Math.max(row.values[id], max);
    });
    return [min, max];
  }, [id, preFilteredRows]);

  return (
    <div
      style={{
        display: "flex",
      }}
    >
      <input
        value={filterValue[0] || ""}
        type="number"
        onChange={(e) => {
          const val = e.target.value;
          setFilter((old = []) => [
            val ? parseInt(val, 10) : undefined,
            old[1],
          ]);
        }}
        placeholder={`Min (${min})`}
        style={{
          width: "70px",
          marginRight: "0.5rem",
        }}
      />
      to
      <input
        value={filterValue[1] || ""}
        type="number"
        onChange={(e) => {
          const val = e.target.value;
          setFilter((old = []) => [
            old[0],
            val ? parseInt(val, 10) : undefined,
          ]);
        }}
        placeholder={`Max (${max})`}
        style={{
          width: "70px",
          marginLeft: "0.5rem",
        }}
      />
    </div>
  );
}

// Define a custom filter filter function!
function filterGreaterThan(rows, id, filterValue) {
  return rows.filter((row) => {
    const rowValue = row.values[id];
    return rowValue >= filterValue;
  });
}

// This is an autoRemove method on the filter function that
// when given the new filter value and returns true, the filter
// will be automatically removed. Normally this is just an undefined
// check, but here, we want to remove the filter if it's not a number
filterGreaterThan.autoRemove = (val) => typeof val !== "number";

// Our table component
function DashboardTable({ data, type, deleteItem, editItem }) {
  const [open, setOpen] = useState(false);
  const [currentRowId, setCurrentRowId] = useState(null);
  let col = Columns(type);

  const navigate = useNavigate();

  if (type !== "Dashboard") {
    col.push({
      Header: "",
      id: "edit",
      Cell: ({ row }) => {
        return (
          <div>
            <EditOutlinedIcon onClick={() => editItem(row.original.id)} />
            <RemoveCircleOutlineOutlinedIcon
              onClick={() => {
                setCurrentRowId(row.original.id);
                setOpen(true);
              }}
            />
          </div>
        );
      },
    });
  }

  const columns = React.useMemo(() => col, []);

  const filterTypes = React.useMemo(
    () => ({
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    []
  );

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const {
    getTableProps,
    setAllFilters,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    visibleColumns,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      defaultColumn, // Be sure to pass the defaultColumn option
      filterTypes,
    },
    useFilters, // useFilters!
    useGlobalFilter, // useGlobalFilter!
    useSortBy
  );

  const handleRowClick = (row) => {
    if (type == "Dashboard") {
      const id = row.original.participant_id;
      navigate(`/student/profile?id=${id}`);
    }
  };

  // We don't want to render all of the rows for this example, so cap
  // it for this use case
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [numRecords, setNumRecords] = React.useState(10);
  //   const numRecords = 10;

  useEffect(() => {
    // Fetch items from another resources.
    const endOffset = itemOffset + numRecords;
    setCurrentItems(rows.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(rows.length / numRecords));
  }, [itemOffset, numRecords, rows]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * numRecords) % rows.length;
    setItemOffset(newOffset);
  };

  const handleChange = (event) => {
    if (event.target.value === "All") {
      setNumRecords(rows.length);
    } else {
      setNumRecords(event.target.value);
    }
  };

  const paginationContainer = {
    display: "flex",
    justifyContent: "center",
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const buttonContainer = {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginTop: "20px",
  };

  const cardTableContainer = {
    padding: "20px",
    marginTop: "20px",
    marginBottom: "20px",
  };

  const globalContainer = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const filterContainer = {
    display: "flex",
    gap: "20px",
    alignItems: "center",
  };

  const headerLabelContainer = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const toggleColumnSort = (col) => {
    if (!col.isSorted) {
      col.toggleSortBy(false);
    } else {
      if (col.isSortedDesc) {
        col.toggleSortBy(undefined);
      } else {
        col.toggleSortBy(true);
      }
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          Are you sure you want to delete?
          <div style={buttonContainer}>
            <Button
              color="success"
              id="uploadCSVButton"
              onClick={() => {
                setOpen(false);
                deleteItem(currentRowId);
                setCurrentRowId(null);
              }}
            >
              Yes
            </Button>
            <Button
              color="danger"
              id="uploadCSVButton"
              onClick={() => {
                setOpen(false);
                setCurrentRowId(null);
              }}
            >
              No
            </Button>
          </div>
        </Box>
      </Modal>
      <div style={globalContainer}>
        <div style={filterContainer}>
          <GlobalFilter
            numRows={rows.length}
            globalFilter={state.globalFilter}
            setGlobalFilter={setGlobalFilter}
          />

          <Button
            color="danger"
            onClick={() => {
              setAllFilters([]);
              setGlobalFilter([]);
            }}
          >
            Reset Filters
          </Button>
        </div>
        <div>
          <Select
            id="demo-simple-select"
            size='small'
            value={numRecords === rows.length ? "All" : numRecords}
            onChange={handleChange}
            autoWidth={true}
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
          >
            <MenuItem value={10}>10 rows</MenuItem>
            <MenuItem value={25}>25 rows</MenuItem>
            <MenuItem value={50}>50 rows</MenuItem>
            <MenuItem value={50}>100 rows</MenuItem>
            <MenuItem value={"All"}>All rows</MenuItem>
          </Select>
        </div>
      </div>
      <Card style={cardTableContainer}>
        <Table striped hover responsive {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    <div style={headerLabelContainer}>
                      {column.render("Header")}
                      <div onClick={() => toggleColumnSort(column)}>
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            "🔽"
                          ) : (
                            "🔼"
                          )
                        ) : (
                          <SortIcon />
                        )}
                      </div>
                    </div>
                    <div>
                      {column.canFilter
                        ? DefaultColumnFilter(
                            column.filterValue,
                            column.preFilteredRows,
                            column.setFilter,
                            rows.length
                          )
                        : null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {currentItems.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} onClick={() => handleRowClick(row)}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Card>
      <div style={paginationContainer}>
        <ReactPaginate
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
          pageCount={pageCount}
          previousLabel="< previous"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakLabel="..."
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination"
          activeClassName="active"
          renderOnZeroPageCount={null}
        />
      </div>
      <br />
      {/* <div>Showing the first 10 results of {rows.length} rows</div>
      <div>
        <pre>
          <code>{JSON.stringify(state.filters, null, 2)}</code>
        </pre>
      </div> */}
    </>
  );
}

export default DashboardTable;
