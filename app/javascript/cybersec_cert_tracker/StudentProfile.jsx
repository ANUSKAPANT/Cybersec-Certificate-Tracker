import Jsona from 'jsona';
import axios from "axios";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

function StudentProfile({userData}) {
    const dataFormatter = new Jsona();

    const search = useLocation().search;
    const id = new URLSearchParams(search).get("id");

    const fetchProfile = async () =>{
        const response = await axios.get(`/students/${id}`, { headers: { Authorization: `Bearer ${userData.token}` }});
        const data = dataFormatter.deserialize(response.data);
        const courses = data.student_courses.map((student_course) => {
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
        <p>Student</p>
    )
}

export default StudentProfile;
