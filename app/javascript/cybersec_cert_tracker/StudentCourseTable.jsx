import React, { useState, useEffect } from "react";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

export default function StudentCourseTable({ coursesInfo }) {

    const [cols, setCols] = useState([]);

    const formatString = (str) => {
        let temp = str.split('_');
        temp = temp.map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase());
        return temp.reduce((previousValue, currentValue) => previousValue + " " + currentValue);
    }

    useEffect(() => {
        if (coursesInfo[0]) {
            let columns = Object.keys(coursesInfo[0]);
            columns = columns.map((col) => {
                let minWidth = 170;
                if (col == 'canvas_course') minWidth = 400;
                return {
                    name: col,
                    minWidth
                }
            })
            setCols(columns);

            //Change boolean values to yes or no
            coursesInfo.map(coursesInfo => {
                Object.entries(coursesInfo).forEach(([key, value]) => {
                    if ((typeof value === "boolean")) {
                        coursesInfo[key] = value ? "yes" : "no";
                    }
                })
            })
        }
    }, [coursesInfo])

    return (
        <div className="student_courses">
            <Paper sx={{ width: '100%', overflow: 'hidden', marginBottom: "20px" }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {cols.map((column) => (
                                    <TableCell
                                        key={column.name}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        <b>{formatString(column.name)}</b>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {coursesInfo
                                .map((row) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row['canvas_course']}>
                                            {cols.map((column) => {
                                                const value = row[column.name];
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        {value}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </div>
    );
}