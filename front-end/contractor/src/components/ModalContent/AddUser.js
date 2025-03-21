import React from 'react'
import { Form, Row, Col } from 'react-bootstrap';
import CardComponent from '../CardComponent';
import UploadPhoto from '../UploadPhoto';
import TextareaAutosize from 'react-textarea-autosize';

const AddUser = () => {
    const addform = [
        {
            id: 1,
            label: 'Name',
            formcontrol: [
                {
                    id: 1,
                    type: 'text',
                    placeholder: 'Name',
                },
            ],
        },
        {
            id: 1,
            label: 'User Email Id',
            formcontrol: [
                {
                    id: 1,
                    type: 'email',
                    placeholder: 'abc24@gmail.com',
                },
            ],
        },
        {
            id: 1,
            label: 'User Address',
            formcontrol: [
                {
                    id: 1,
                    type: 'text',
                    placeholder: 'User Address',
                },
            ],
        },
        {
            id: 1,
            label: 'User Phone Number',
            formcontrol: [
                {
                    id: 1,
                    type: 'text',
                    placeholder: 'User Phone Number',
                },
            ],
        },
        {
            id: 1,
            label: 'Dob',
            formcontrol: [
                {
                    id: 1,
                    type: 'date',
                },
            ],
        },
        {
            id: 2,
            label: 'Select Role',
            select: [{ id: 1, selectmenu: ['Admin', 'Role 2', 'Role 3'] }],
        },
    ]
    return (
        <>
            <Row className="g-4 align-items-center">
                <Col>
                    <Row className="g-4">
                        {addform.map((form, idx) => (
                            <Form.Group key={idx} as={Col} md="6">
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
                <Col md={3}>
                    <UploadPhoto />
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
                                    <Form.Control required type='password' placeholder='password' />
                                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Form.Group as={Col}>
                                <TextareaAutosize minRows={2} className='edit-textarea' placeholder='Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.' />
                            </Form.Group>
                        </Row>
                    </CardComponent>
                </Col>
            </Row>
        </>
    )
}

export default AddUser