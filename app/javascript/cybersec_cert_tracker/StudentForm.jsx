import React, { useState, useEffect } from 'react';
import {
    Col, Button, Form, FormGroup, Label, Input, Card, CardBody, Modal,
    ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';
import Select from "react-select";
import axios from "axios";
import Jsona from "jsona";
import Snackbar from '@mui/material/Snackbar';
import DatePicker from "react-datepicker";

const dataFormatter = new Jsona();

const voucherOptions = [
    { label: "Purchased", value: true },
    { label: "Not Purchased", value: false },
  ];

const completionOptions = [
    { label: "Completed", value: true },
    { label: "Incomplete", value: false },
  ];


function StudentForm({ userData, open, studentId, setOpen, afterSubmit = () => { } }) {

    const [companies, setCompanies] = useState([]);
    const [studentFormInfo, setStudentFormInfo] = useState({});
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState("");

    const handleClose = () => {
        setOpen(false);
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setStudentFormInfo({ ...studentFormInfo, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        let csrf = "";
        //Not present always
        if (document.querySelector("meta[name='csrf-token']"))
            csrf = document.querySelector("meta[name='csrf-token']").getAttribute("content");
        const {
            id,
            first_name,
            last_name,
            email_id,
            canvas_id,
            title,
            voucher_purchased,
            registration_date,
            expiry_date,
            dcldp_code,
            test_result,
            canvas_course_completion,
            company_id,
        } = studentFormInfo;

        const method = id ? 'patch' : 'post';
        const url = id == null ? '/students' : `/students/${id}`;
        const message = id ? 'Updated' : 'Created';
        const data = {
            first_name,
            last_name,
            email_id,
            title,
            voucher_purchased,
            registration_date,
            expiry_date,
            canvas_id,
            dcldp_code,
            test_result,
            canvas_course_completion,
            company_id,
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
            });
            setOpenSnackbar(true);
            setSnackbarMsg(`Successfully ${message}`)
            if (!id) setStudentFormInfo({}); // Means add student is used
            afterSubmit();
            handleClose();
        } catch (error) {
            setOpenSnackbar(true);
            setSnackbarMsg("Something went wrong")
        }
    }

    const handleSelectChange = (value, name) => {
        setStudentFormInfo({ ...studentFormInfo, [name]: value.value });
    };

    const handleDateChange = (date, name) => {
        setStudentFormInfo({ ...studentFormInfo, [name]: date });
      };

    const fetchCompanies = async () => {
        try {
            const response = await axios
                .get(`/companies`, {
                    headers: { Authorization: `Bearer ${userData.token}` },
                });
            const data = dataFormatter.deserialize(response.data);
            const companiesData = data.map((company) => {
                return {
                    id: company.id,
                    label: company.name,
                    value: company.id,
                };
            });
            setCompanies(companiesData);
        } catch (error) {
            console.log(error);
            setOpenSnackbar(true);
            setSnackbarMsg("Something went wrong")
        }
    };

    const fetchStudent = async (id) => {
        try {
            const response = await axios.get(`/students/${id}`, {
                headers: { Authorization: `Bearer ${userData.token}` },
            })
            const data = dataFormatter.deserialize(response.data);
            const studentData = {
                id: data.id,
                first_name: data.first_name,
                last_name: data.last_name,
                email_id: data.email_id,
                title: data.title,
                voucher_purchased: String(data.voucher_purchased),
                canvas_course_completion: String(data.canvas_course_completion),
                registration_date: data.registration_date,
                expiry_date: data.expiry_date,
                canvas_id: data.canvas_id,
                company_id: data.company.id,
            };
            setStudentFormInfo(studentData);
        } catch (error) {
            setOpenSnackbar(true);
            setSnackbarMsg("Something went wrong")
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, [])

    useEffect(() => {
        setStudentFormInfo({});
        if (studentId) {
            fetchStudent(studentId);
        }
    }, [studentId])

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
                <ModalHeader toggle={handleClose} style={{ border: "none" }}>Add Students</ModalHeader>
                <ModalBody>
                    <Form>
                        <Card>
                            <CardBody>
                                <FormGroup row>
                                    <Col sm={6}>
                                        <Label for="first_name" sm={6}>First Name</Label>
                                        <Input name="first_name" id="first_name" defaultValue={studentFormInfo.first_name} onChange={handleInputChange} />
                                    </Col>
                                    <Col sm={6}>
                                        <Label for="last_name" sm={6}>Last Name</Label>
                                        <Input name="last_name" id="last_name" defaultValue={studentFormInfo.last_name} onChange={handleInputChange} />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col sm={12}>
                                        <Label for="email_id" sm={12}>Email</Label>
                                        <Input name="email_id" id="email_id" defaultValue={studentFormInfo.email_id} onChange={handleInputChange} />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col sm={6}>
                                        <Label for="canvas_id" sm={6}>Canvas ID</Label>
                                        <Input name="canvas_id" id="canvas_id" defaultValue={studentFormInfo.canvas_id} onChange={handleInputChange} />
                                    </Col>
                                    <Col sm={6}>
                                        <Label for="title" sm={6}>Title</Label>
                                        <Input name="title" id="title" defaultValue={studentFormInfo.title} onChange={handleInputChange} />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col sm={12}>
                                        <Label for="company_name" sm={12}>Company</Label>
                                        <Select
                                            name="company_id"
                                            id="company_id"
                                            onChange={(value) => handleSelectChange(value, "company_id")}
                                            options={companies}
                                            value={companies.filter((option) => (studentFormInfo.company_id == option.value))}
                                            placeholder="Select Company"
                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col sm={12}>
                                    <Label for="voucher_purchased" sm={12}>
                                        Voucher Purchased
                                    </Label>
                                    <Select
                                    name="voucher_purchased"
                                    onChange={(value) =>
                                        handleSelectChange(value, "voucher_purchased")
                                    }
                                    options={voucherOptions}
                                    value={voucherOptions.filter(
                                        (option) =>
                                        studentFormInfo.voucher_purchased == option.value
                                    )}
                                    placeholder="Select Voucher Purchased"
                                    />
                                    </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                    <Col sm={6}>
                                        <Label for="registration_date" sm={6}>
                                        Registration Date
                                        </Label>
                                        <DatePicker
                                        selected={studentFormInfo.registration_date}
                                        onChange={(date) => handleDateChange(date, "registration_date")}
                                        className="input-date"
                                        isClearable
                                        />
                                    </Col>
                                    <Col sm={6}>
                                        <Label for="expiry_date" sm={6}>
                                        Voucher Expiry Date
                                        </Label>
                                        <DatePicker
                                        selected={studentFormInfo.expiry_date}
                                        onChange={(date) => handleDateChange(date, "expiry_date")}
                                        className="input-date"
                                        isClearable
                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col sm={12}>
                                    <Label for="canvas_course_completion" sm={12}>
                                    Canvas Course Completed
                                    </Label>
                                    <Select
                                    name="canvas_course_completion"
                                    onChange={(value) =>
                                        handleSelectChange(value, "canvas_course_completion")
                                    }
                                    options={completionOptions}
                                    value={completionOptions.filter(
                                        (option) =>
                                        studentFormInfo.canvas_course_completion ==
                                        option.value
                                    )}
                                    placeholder="Select Canvas Course Completion"
                                    />
                                </Col>
                                </FormGroup>
                                <FormGroup row >
                                <Col sm={6}>
                                    <Label for="test_result" sm={6}>
                                    Test Result
                                    </Label>
                                    <Input
                                    name="test_result"
                                    id="test_result"
                                    defaultValue={studentFormInfo.test_result}
                                    onChange={handleInputChange}
                                    />
                                </Col>
                                                        
                                <Col sm={6}>
                                    <Label for="dcldp_code" sm={5}>
                                    DCLDP Code
                                    </Label>
                                    <Input
                                    name="dcldp_code"
                                    id="dcldp_code"
                                    defaultValue={studentFormInfo.dcldp_code}
                                    onChange={handleInputChange}
                                    />
                                </Col>
                                </FormGroup>
                            </CardBody>
                        </Card>
                    </Form>
                </ModalBody>
                <ModalFooter style={{ border: "none" }}>
                    <Button color="primary" onClick={handleSubmit} id="submit">Submit</Button>{' '}
                    <Button color="secondary" onClick={handleClose}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </>
    );
}

export default StudentForm;