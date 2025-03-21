import React from 'react'
import { Col, Form, Row } from 'react-bootstrap'
import Select from 'react-select';
import CardComponent from '../../components/CardComponent';
import TextareaAutosize from 'react-textarea-autosize';

const CreateContacts = () => {
    const options = [
        { value: "energy", label: 'Energy' },
        { value: "dealer", label: 'Dealer' },
    ]
    return (
        <Col md={12} data-aos={"fade-up"} data-aos-delay={100}>
            <CardComponent title={'Create Contacts'}>
                <Row className='g-2'>
                    <Form.Group as={Col} md={12}>
                        <Form.Label>User Type</Form.Label>
                        <Select className='text-primary' defaultValue={options[0]} options={options} />
                    </Form.Group>
                    <Form.Group as={Col} md={6}>
                        <Form.Label>Email</Form.Label>
                        <Form.Control type='email' />
                    </Form.Group>
                    <Form.Group as={Col} md={6}>
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control type='number' />
                    </Form.Group>
                    <Form.Group as={Col} md={12}>
                        <Form.Label>Address</Form.Label>
                        <TextareaAutosize minRows={2} className='edit-textarea' />
                    </Form.Group>
                </Row>
                <div className='social-btn purple-combo px-5 mt-3 d-align mx-auto'>Save</div>
            </CardComponent>
        </Col>
    )
}

export default CreateContacts