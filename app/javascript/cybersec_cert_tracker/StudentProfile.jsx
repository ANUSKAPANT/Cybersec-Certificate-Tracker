import Jsona from 'jsona';
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Col, Button, Form, FormGroup, Label, Input, Card, CardBody } from 'reactstrap';
import "./StudentProfile.css";
import StudentCourseTable from './StudentCourseTable';

function StudentProfile({ userData }) {
    const dataFormatter = new Jsona();
    const [studentInfo, setStudentInfo] = useState({});
    const [coursesInfo, setCoursesInfo] = useState([]);

    const [readOnly, setReadOnly] = useState(true);

    const search = useLocation().search;
    const id = new URLSearchParams(search).get("id");


    const fetchProfile = async () => {
        const response = await axios.get(`/students/${id}`, { headers: { Authorization: `Bearer ${userData.token}` } });
        const data = dataFormatter.deserialize(response.data);

        const { canvas_id, company, email_id, first_name, last_name, student_courses } = data;
        setStudentInfo({ canvas_id, company_name: company.name, email_id, first_name, last_name });
        const courses = student_courses.map((student_course) => {
            return ({
                canvas_course: student_course.course.name,
                course_progress: student_course.canvas_course_completion,
                cert_name: student_course.cert_vouchers.map((cv) => cv.certification_name),
                registration_date: student_course.registration_date,
                voucher_purchased: student_course.voucher_purchased || false,
                test_result: student_course.test_result,
                cert_voucher_id: student_course.cert_vouchers.map((cv) => cv.voucher_id),
                voucher_use_by: student_course.cert_vouchers.map((cv) => cv.expiry_date),
                exam_code: student_course.cert_vouchers.map((cv) => cv.exam.exam_code),
                exam_date: student_course.cert_vouchers.map((cv) => cv.exam.exam_date),
                exam_grade: student_course.cert_vouchers.map((cv) => cv.exam.exam_grade),
                passed: student_course.cert_vouchers.map((cv) => cv.exam.passed),
            });
        });
        setCoursesInfo(courses);
    }

    useEffect(() => {
        fetchProfile();
    }, []);

    return (
        <>
            <Col sm={12} style={{ paddingLeft: '100px', paddingRight: '100px' }}>
                <h4 className="heading">Overview</h4>
                <Form>
                    <Card>
                        <CardBody>
                            <FormGroup row>
                                <Label for="first_name" sm={2}>First Name</Label>
                                <Col sm={10}>
                                    <Input name="first_name" id="first_name" defaultValue={studentInfo.first_name} readOnly={readOnly} />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="last_name" sm={2}>Last Name</Label>
                                <Col sm={10}>
                                    <Input name="last_name" id="last_name" defaultValue={studentInfo.last_name} readOnly={readOnly} />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="email_id" sm={2}>Email</Label>
                                <Col sm={10}>
                                    <Input name="email_id" id="email_id" defaultValue={studentInfo.email_id} readOnly={readOnly} />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="company_name" sm={2}>Company</Label><Col sm={10}>
                                    <Input name="company_name" id="company_name" defaultValue={studentInfo.company_name} readOnly={readOnly} />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="canvas_id" sm={2}>Canvas Id</Label>
                                <Col sm={10}>
                                    <Input name="canvas_id" id="canvas_id" defaultValue={studentInfo.canvas_id} readOnly={readOnly} />
                                </Col>
                            </FormGroup>
                        </CardBody>
                    </Card>
                    <StudentCourseTable coursesInfo={coursesInfo} />
                </Form>
            </Col>
        </>
    )
}

export default StudentProfile;
