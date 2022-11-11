import React, { useState, useEffect } from 'react';
import {
    Col, Button, Form, FormGroup, Label, Input, Card, CardBody, Modal,
    ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';
import Select from "react-select";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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


function StudentCourseForm({ userData, open, studentId, setOpen, courseId, afterSubmit = () => { } }) {

    const [courseOptions, setCourseOptions] = useState([]);
    const [studentCourseInfo, setStudentCourseInfo] = useState({ id: null });

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
            toast.success(`Successfully ${message}`, {
                position: "bottom-center",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
            });
            afterSubmit();
            handleClose();
        } catch (error) {
            toast.error("Error Occured", {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
            });
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
            toast.error("Error in fetching records", {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
            });
        }
    };

    useEffect(() => {
        fetchCourses();
    }, [])

    useEffect(() => {
        setStudentCourseInfo({ student_id: studentId })
    }, [studentId])

    return (
        <>
            <ToastContainer />
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