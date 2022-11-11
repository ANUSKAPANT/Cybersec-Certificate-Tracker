import React, { useState, useEffect } from 'react';
import {
    Col, Button, Form, FormGroup, Label, Input, Card, CardBody, Modal,
    ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';
import Select from "react-select";
import axios from "axios";
import { toast } from "react-toastify";
import Jsona from "jsona";
const dataFormatter = new Jsona();

function StudentForm({ userData, open, handleClose, handleSubmit, handleSelectChange, handleInputChange, studentInfo }) {

    const [companies, setCompanies] = useState([]);

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
            toast.error("Error in fetching records", {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
            });
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, [])

    return (
        <Modal isOpen={open} toggle={handleClose} size="lg" style={{ maxWidth: '700px', width: '100%' }}>
            <ModalHeader toggle={handleClose} style={{ border: "none" }}>Add Students</ModalHeader>
            <ModalBody>
                <Form>
                    <Card>
                        <CardBody>
                            <FormGroup row>
                                <Col sm={6}>
                                    <Label for="first_name" sm={5}>First Name</Label>
                                    <Input name="first_name" id="first_name" defaultValue={studentInfo.first_name} onChange={handleInputChange} />
                                </Col>
                                <Col sm={6}>
                                    <Label for="last_name" sm={5}>Last Name</Label>
                                    <Input name="last_name" id="last_name" defaultValue={studentInfo.last_name} onChange={handleInputChange} />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Col sm={6}>
                                    <Label for="email_id" sm={5}>Email</Label>
                                    <Input name="email_id" id="email_id" defaultValue={studentInfo.email_id} onChange={handleInputChange} />
                                </Col>
                                <Col sm={6}>
                                    <Label for="canvas_id" sm={5}>Canvas Id</Label>
                                    <Input name="canvas_id" id="canvas_id" defaultValue={studentInfo.canvas_id} onChange={handleInputChange} />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Col sm={6}>
                                    <Label for="company_name" sm={5}>Company</Label>
                                    <Select
                                        name="company_id"
                                        onChange={(value) => handleSelectChange(value, "company_id")}
                                        options={companies}
                                        value={companies.filter((option) => (studentInfo.company_id == option.value))}
                                        placeholder="Select Passed"
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
    );
}

export default StudentForm;