import React from 'react'
import { Form, Row, Col } from 'react-bootstrap';

const CreateRoles = () => {
    const addform = [
        { id: 1, label: 'Name', type: 'text', },
        { id: 2, label: 'Email Address', type: 'email', },
        { id: 3, label: 'Mobile Number', type: 'number', },
        { id: 4, label: 'Login ID', type: 'text', },
        { id: 5, label: 'Login Password', type: 'password', },
        { id: 6, label: 'Joining Date', type: 'date', },
    ]

    return (
        <Row className="g-2">
            {addform.map((form, idx) => (
                <Form.Group key={idx} as={Col} md="6">
                    <Form.Label>{form.label}</Form.Label>
                    <Form.Control required type={form.type} />
                </Form.Group>
            ))}
        </Row>
    )
}

export default CreateRoles