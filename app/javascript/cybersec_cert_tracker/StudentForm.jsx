import React, { useState, useEffect } from 'react';
import {
    Col, Button, Form, FormGroup, Label, Input, Card, CardBody, Modal,
    ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';
import Select from "react-select";
import axios from "axios";
import Jsona from "jsona";
import Snackbar from '@mui/material/Snackbar';

const dataFormatter = new Jsona();

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
            company_id
        } = studentFormInfo;

        const method = id ? 'patch' : 'post';
        const url = id == null ? '/students' : `/students/${id}`;
        const message = id ? 'Updated' : 'Created';
        const data = {
            first_name,
            last_name,
            email_id,
            canvas_id,
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
                                        <Label for="first_name" sm={5}>First Name</Label>
                                        <Input name="first_name" id="first_name" defaultValue={studentFormInfo.first_name} onChange={handleInputChange} />
                                    </Col>
                                    <Col sm={6}>
                                        <Label for="last_name" sm={5}>Last Name</Label>
                                        <Input name="last_name" id="last_name" defaultValue={studentFormInfo.last_name} onChange={handleInputChange} />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col sm={6}>
                                        <Label for="email_id" sm={5}>Email</Label>
                                        <Input name="email_id" id="email_id" defaultValue={studentFormInfo.email_id} onChange={handleInputChange} />
                                    </Col>
                                    <Col sm={6}>
                                        <Label for="canvas_id" sm={5}>Canvas Id</Label>
                                        <Input name="canvas_id" id="canvas_id" defaultValue={studentFormInfo.canvas_id} onChange={handleInputChange} />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col sm={6}>
                                        <Label for="company_name" sm={5}>Company</Label>
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