import React, { useState, useEffect } from 'react';
import {
    Col, Button, Form, FormGroup, Label, Input, Card, CardBody, Modal,
    ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';
import Select from "react-select";
import axios from "axios";
import Snackbar from '@mui/material/Snackbar';
import Jsona from "jsona";
const dataFormatter = new Jsona();

const voucherOptions = [
    { label: "Purchased", value: true },
    { label: "Not Purchased", value: false }
]

const completionOptions = [
    { label: "Completed", value: true },
    { label: "Incomplete", value: false }
]


function StudentCourseForm({ userData, open, studentId, setOpen, studentCourseId, afterSubmit = () => { } }) {

    const [courseOptions, setCourseOptions] = useState([]);
    const [studentCourseInfo, setStudentCourseInfo] = useState({ id: null });
    const [courseSelectDisabled, setCourseSelectDisabled] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState("");

    const handleClose = () => {
        setOpen(false);
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setStudentCourseInfo({ ...studentCourseInfo, [name]: value });
    };

    const handleSelectChange = (value, name) => {
        setStudentCourseInfo({ ...studentCourseInfo, [name]: value.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        let csrf = "";
        //Not present always
        if (document.querySelector("meta[name='csrf-token']"))
            csrf = document.querySelector("meta[name='csrf-token']").getAttribute("content");
        const {
            id,
            registration_date,
            voucher_purchased,
            test_result,
            canvas_course_completion,
            dcldp_code,
            student_id,
            course_id,
        } = studentCourseInfo;
        const method = id ? 'patch' : 'post';
        const url = !id ? '/student_courses' : `/student_courses/${id}`;
        const message = id ? 'Updated' : 'Created';
        const data = {
            registration_date,
            voucher_purchased,
            test_result,
            canvas_course_completion,
            dcldp_code,
            student_id,
            course_id,
        };
        try {
            await axios.request({
                method,
                url,
                headers: {
                    "Content-type": "application/json",
                    "X-CSRF-Token": csrf,
                    "Authorization": `Bearer ${userData.token}`,
                },
                data
            })
            afterSubmit();
            setCourseSelectDisabled(false);
            handleClose();
            setOpenSnackbar(true);
            setSnackbarMsg(`Successfully ${message}`);
        } catch (error) {
            setOpenSnackbar(true);
            setSnackbarMsg("Something went wrong")
        }
    }

    const fetchCourses = async () => {
        try {
            const response = await axios
                .get(`/courses`, {
                    headers: { Authorization: `Bearer ${userData.token}` },
                });
            const data = dataFormatter.deserialize(response.data);
            const coursesData = data.map((course) => {
                return {
                    value: course.id,
                    label: course.name,
                };
            });
            setCourseOptions(coursesData);
        } catch (error) {
            setOpenSnackbar(true);
            setSnackbarMsg("Something went wrong")
        }
    };

    const fetchStudentCourse = async (id) => {
        try {
            const response = await axios
                .get(`/student_courses/${id}`, {
                    headers: { Authorization: `Bearer ${userData.token}` },
                })

            const data = dataFormatter.deserialize(response.data);
            const studentData = {
                id: data.id,
                student: data.student,
                course: data.course,
                registration_date: data.registration_date,
                voucher_purchased: data.voucher_purchased,
                test_result: data.test_result,
                canvas_course_completion: data.canvas_course_completion,
                dcldp_code: data.dcldp_code,
                student_id: data.student.id,
                course_id: data.course.id,
            };
            setStudentCourseInfo(studentData);
        } catch (error) {
            setOpenSnackbar(true);
            setSnackbarMsg("Something went wrong");
        }
    };

    useEffect(() => {
        fetchCourses();
    }, [])

    useEffect(() => {
        setStudentCourseInfo({ student_id: studentId })
        if (studentCourseId) {
            setCourseSelectDisabled(true);
            fetchStudentCourse(studentCourseId);
        } else setCourseSelectDisabled(false);
    }, [studentId, studentCourseId])

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    }

    return (
        <>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                message={snackbarMsg}
            />
            <Modal isOpen={open} toggle={handleClose} size="lg" style={{ maxWidth: '700px', width: '100%' }}>
                <ModalHeader toggle={handleClose} style={{ border: "none" }}>Add Student Course</ModalHeader>
                <ModalBody>
                    <Form>
                        <Card>
                            <CardBody>
                                <FormGroup row>
                                    <Col sm={12}>
                                        <Label for="courses" sm={10}>Courses</Label>
                                        <Select
                                            name="courses"
                                            onChange={(value) => handleSelectChange(value, "course_id")}
                                            options={courseOptions}
                                            value={courseOptions.filter((option) => studentCourseInfo.course_id == option.value)}
                                            placeholder="Select Course"
                                            isDisabled={courseSelectDisabled}
                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col sm={12}>
                                        <Label for="registration_date" sm={6}>Registration Date</Label>
                                        <Input name="registration_date" id="registration_date" defaultValue={studentCourseInfo.registration_date} onChange={handleInputChange} />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col sm={6}>
                                        <Label for="voucher_purchased" sm={6}>Voucher Purchased</Label>
                                        <Select
                                            name="voucher_purchased"
                                            onChange={(value) => handleSelectChange(value, "voucher_purchased")}
                                            options={voucherOptions}
                                            value={voucherOptions.filter((option) => studentCourseInfo.voucher_purchased == option.value)}
                                            placeholder="Select Voucher Purchased"
                                        />
                                    </Col>
                                    <Col sm={6}>
                                        <Label for="test_result" sm={6}>Test Result</Label>
                                        <Input name="test_result" id="test_result" defaultValue={studentCourseInfo.test_result} onChange={handleInputChange} />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col sm={6}>
                                        <Label for="dcldp_code" sm={5}>Dcldp Code</Label>
                                        <Input name="dcldp_code" id="dcldp_code" defaultValue={studentCourseInfo.dcldp_code} onChange={handleInputChange} />
                                    </Col>
                                    <Col sm={6}>
                                        <Label for="canvas_course_completion" sm={5}>Canvas Course Completed</Label>
                                        <Select
                                            name="canvas_course_completion"
                                            onChange={(value) => handleSelectChange(value, "canvas_course_completion")}
                                            options={completionOptions}
                                            value={completionOptions.filter((option) => studentCourseInfo.canvas_course_completion == option.value)}
                                            placeholder="Select Canvas Course Completion"
                                        />
                                    </Col>
                                </FormGroup>
                            </CardBody>
                        </Card>
                    </Form>
                </ModalBody>
                <ModalFooter style={{ border: "none" }}>
                    <Button color="primary" onClick={handleSubmit}>Submit</Button>{' '}
                    <Button color="secondary" onClick={handleClose}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </>
    );
}

export default StudentCourseForm;