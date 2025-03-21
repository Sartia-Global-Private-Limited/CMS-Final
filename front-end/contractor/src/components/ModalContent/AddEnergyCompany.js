import React from 'react'
import { Form, Row, Col } from 'react-bootstrap';
import CardComponent from '../CardComponent';
import TextareaAutosize from 'react-textarea-autosize';

const AddEnergyCompany = () => {
    const addform = [
        {
            id: 1,
            label: 'Company Name',
            formcontrol: [
                {
                    id: 1,
                    type: 'text',
                    placeholder: 'Company Name',
                },
            ],
        },
        {
            id: 2,
            label: 'Company Web Url',
            formcontrol: [
                {
                    id: 1,
                    type: 'url',
                    placeholder: 'https://',
                },
            ],
        },
        {
            id: 3,
            label: 'Company Email Address',
            formcontrol: [
                {
                    id: 1,
                    type: 'email',
                    placeholder: 'abc24@gmail.com',
                },
            ],
        },
        {
            id: 4,
            label: 'Company Address',
            formcontrol: [
                {
                    id: 1,
                    type: 'text',
                    placeholder: 'Company Address',
                },
            ],
        },
        {
            id: 5,
            label: 'Company Phone Number',
            formcontrol: [
                {
                    id: 1,
                    type: 'text',
                    placeholder: 'Company Phone Number',
                },
            ],
        },
        {
            id: 6,
            label: 'Company Gst Number',
            formcontrol: [
                {
                    id: 1,
                    type: 'text',
                    placeholder: 'Company GST Number',
                },
            ],
        },
        {
            id: 7,
            label: 'Select Zone',
            select: [{ id: 1, selectmenu: ['North Zone', 'South Zone', 'East Zone', 'West Zone', 'central Zone', 'North East Zone'] }],
        },
        {
            id: 8,
            label: 'Select Regional Office',
            select: [{ id: 1, selectmenu: ['Ajmer', 'Gandhi Nagar', 'Dehradun'] }],
        },
    ]
    return (
        <>
            <Row className="g-4 align-items-center">
                <Col md={12}>
                    <Row className="g-4">
                        {addform.map((form, idx) => (
                            <Form.Group key={idx} as={Col} md="4">
                                <Form.Label>{form.label}</Form.Label>
                                {form.formcontrol?.map((frm, form) => (
                                    <Form.Control key={form} required type={frm.type} placeholder={frm.placeholder} />
                                ))}
                                {form.select?.map((select) => (
                                    <Form.Select key={select} aria-label="Default select example">
                                        {select.selectmenu?.map((menu) => (
                                            <option key={menu}>{menu}</option>
                                        ))}
                                    </Form.Select>
                                ))}
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            </Form.Group>
                        ))}
                    </Row>
                </Col>
                <Col md={12}>
                    <CardComponent title={'Login Credentials'}>
                        <Row>
                            <Col md={3}>
                                <Form.Group className='mb-3'>
                                    <Form.Label>User Name</Form.Label>
                                    <Form.Control required type='text' placeholder='User Name' />
                                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control required type='password' placeholder='Password' />
                                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Form.Group as={Col}>
                                <TextareaAutosize minRows={2} className='edit-textarea' placeholder='Add Description...' />
                            </Form.Group>
                        </Row>
                    </CardComponent>
                </Col>
            </Row>
        </>
    )
}

export default AddEnergyCompany