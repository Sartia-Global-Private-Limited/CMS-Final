import React from 'react'
import { Card, Col, Form, Row } from 'react-bootstrap';
import { BsChatDotsFill, BsFacebook, BsInstagram } from 'react-icons/bs';
import CardComponent from '../CardComponent';
import TextareaAutosize from 'react-textarea-autosize';

const UserProfile = () => {
    const proinput = [
        {
            id: 1,
            name: "User Name:",
            value: "Admin",
        },
        {
            id: 2,
            name: "Job Title:",
            value: "Website Designer",
        },
        {
            id: 3,
            name: "Email:",
            value: "ahmad74@gmail.com",
        },
        {
            id: 4,
            name: "Contact:",
            value: "(91) 4544 565 456",
        },
    ];
    return (
        <Row className='g-4'>
            <Col md={4} data-aos={"fade-up"} data-aos-delay={200}>
                <Card className="bg-new-re h-100">
                    <Card.Body>
                        <div className="d-align flex-column text-center">
                            <h5><strong>Admin</strong></h5>
                            <p><small>Website Designer</small></p>
                            <div className="d-align my-bg p-2 rounded-circle">
                                <img className="rounded-circle" height={120} width={120} src="https://cdn0.iconfinder.com/data/icons/basic-11/97/34-512.png" alt="User-Profile" />
                            </div>
                            <p className='small mt-3'>Slate helps you see how many more days you need</p>
                            <div className="d-flex gap-4">
                                <a href="#" className="d-align my-btn">
                                    <BsFacebook className="text-secondary fs-6" />
                                </a>
                                <a href="#" className="d-align my-btn">
                                    <BsInstagram className="text-danger fs-6" />
                                </a>
                                <a href="#" className="d-align my-btn">
                                    <BsChatDotsFill className="text-success fs-6" />
                                </a>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
            <Col md={8} data-aos={"fade-up"} data-aos-delay={300}>
                <CardComponent title={'About User'}>
                    <Row className="g-3">
                        {proinput.map((input, ida) => (
                            <Col key={ida} md={12}>
                                <Form.Label>{input.name}</Form.Label>
                                <Form.Control defaultValue={input.value} disabled />
                            </Col>
                        ))}
                    </Row>
                </CardComponent>
            </Col>
            <Col md={12}>
                <CardComponent title={'Login Credentials'}>
                    <Row>
                        <Col md={3}>
                            <Form.Group className='mb-3'>
                                <Form.Label>User Name</Form.Label>
                                <Form.Control required type='text' defaultValue='Super Admin' disabled />
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Password</Form.Label>
                                <Form.Control required type='text' defaultValue='Admin123' disabled />
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Form.Group as={Col}>
                            <TextareaAutosize minRows={4} className='edit-textarea' disabled defaultValue='Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.' />
                        </Form.Group>
                    </Row>
                </CardComponent>
            </Col>
        </Row>
    )
}

export default UserProfile