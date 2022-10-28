import Jsona from 'jsona';
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Col, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

function StudentProfile({userData}) {
    const dataFormatter = new Jsona();
    const [readOnly, setReadOnly] = useState(true);

    const search = useLocation().search;
    const id = new URLSearchParams(search).get("id");


    const fetchProfile = async () =>{
        const response = await axios.get(`/students/${id}`, { headers: { Authorization: `Bearer ${userData.token}` }});
        const data = dataFormatter.deserialize(response.data);
        
        const { canvas_id, company, email_id, first_name, last_name, student_courses } = data;

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
        console.log(courses);
    }

    useEffect(() => {
        fetchProfile();
      }, []);

    return(
        <>
        <Col sm={12} style={{paddingLeft: '100px', paddingRight: '100px'}}>
        <Form>
            <FormGroup row>
            <Label for="exampleEmail" sm={2}>Email</Label>
            <Col sm={10}>
                <Input type="email" name="email" id="exampleEmail" placeholder="with a placeholder" readOnly={readOnly}/>
            </Col>
            </FormGroup>
            <FormGroup row>
            <Label for="examplePassword" sm={2}>Password</Label>
            <Col sm={10}>
                <Input type="password" name="password" id="examplePassword" placeholder="password placeholder" readOnly={readOnly}/>
            </Col>
            </FormGroup>
            <FormGroup row>
            <Label for="exampleSelect" sm={2}>Select</Label>
            <Col sm={10}>
                <Input type="select" name="select" id="exampleSelect" readOnly={readOnly}/>
            </Col>
            </FormGroup>
            <FormGroup row>
            <Label for="exampleText" sm={2}>Text Area</Label>
            <Col sm={10}>
                <Input type="textarea" name="text" id="exampleText" readOnly={readOnly}/>
            </Col>
            </FormGroup>
            {readOnly ? <></> :  
            <FormGroup check row>
            <Col sm={{ size: 10, offset: 2 }}>
                <Button>Submit</Button>
            </Col>
            </FormGroup>}
        </Form>
        </Col>
        </>
    )
}

export default StudentProfile;
