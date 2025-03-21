import React from 'react'
import { Col, Form, Row } from 'react-bootstrap'
import TextareaAutosize from 'react-textarea-autosize';

const UpdateComplaint = () => {
    return (
        <Row className='g-4'>
            <Col md={4} data-aos={"fade-up"} data-aos-delay={100}>
                <Form.Group className="mb-4" controlId="ComplaintName">
                    <Form.Label>Complaint Name</Form.Label>
                    <Form.Control type="text" defaultValue='Lorem Ipsum' />
                </Form.Group>
                <Form.Group className="mb-4" controlId="SelectContractors">
                    <Form.Label>Select Contractors</Form.Label>
                    <Form.Select aria-label="Default select example">
                        <option value="1">Contractors One</option>
                        <option value="2">Contractors Two</option>
                        <option value="3">Contractors Three</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group controlId="ComplaintName">
                    <Form.Label>Status</Form.Label>
                    <span className='d-flex gap-4'>
                        <Form.Check type="radio" name='status' id='open' label="Open" checked={true} />
                        <Form.Check type="radio" name='status' id='close' label="Close" />
                    </span>
                </Form.Group>
            </Col>
            <Col md={8} data-aos={"fade-up"} data-aos-delay={100}>
                <Form.Label>Complaint Description</Form.Label>
                <TextareaAutosize minRows={7} className='edit-textarea' defaultValue='Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.' />
            </Col>
        </Row>
    )
}

export default UpdateComplaint