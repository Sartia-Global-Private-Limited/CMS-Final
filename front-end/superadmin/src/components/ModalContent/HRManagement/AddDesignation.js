import React from 'react'
import { Col, Row, Form } from 'react-bootstrap'

const Reports = () => {
    return (
        <Col md={12} data-aos={"fade-up"}>
            <Row className='g-2'>
                <Col md={5}>
                    <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" />
                    </Form.Group>
                </Col>
                <Col md={7}>
                    <Form.Group>
                        <Form.Label>Title of Designations</Form.Label>
                        <Form.Control type="text" />
                    </Form.Group>
                </Col>
                <Col md={12}>
                    <Form.Group>
                        <Form.Label>Permissions</Form.Label>
                        <div className='d-flex gap-3'>
                            <Form.Check className='d-align' type="checkbox" id='add' label="Add" required />
                            <Form.Check className='d-align' type="checkbox" id='view' label="View" required />
                            <Form.Check className='d-align' type="checkbox" id='edit' label="Edit" required />
                            <Form.Check className='d-align' type="checkbox" id='delete' label="Delete" required />
                        </div>
                    </Form.Group>
                </Col>
            </Row>
        </Col>
    )
}

export default Reports