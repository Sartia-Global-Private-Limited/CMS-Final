import React from 'react'
import { Form, Row, Col } from 'react-bootstrap';
import CardComponent from '../CardComponent';
import UploadPhoto from '../UploadPhoto';
import TextareaAutosize from 'react-textarea-autosize';

const Dispending = () => {
    return (
        <>
            <Row className="g-4">
                <Col md={5}>
                    <div className='bg-new-re p-3 h-100 d-grid align-items-center'>
                        <div className="text-center">
                            <h5 className='fw-bold'>Admin</h5>
                            <small>Website Designer</small>
                        </div>
                        <UploadPhoto />
                    </div>
                </Col>
                <Col>
                    <CardComponent title={'Dispending Credentials'}>
                        <Row className='row-cols-1 gap-4'>
                            <Form.Group as={Col}>
                                <Form.Label>Unique Identification Number</Form.Label>
                                <Form.Control required type='number' placeholder='UIN' />
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col}>
                                <TextareaAutosize minRows={2} className='edit-textarea' placeholder='Description...' />
                            </Form.Group>
                        </Row>
                    </CardComponent>
                </Col>
            </Row>
        </>
    )
}

export default Dispending