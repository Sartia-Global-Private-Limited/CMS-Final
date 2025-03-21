import React, { useState } from 'react'
import { Col, Form, Row } from 'react-bootstrap'
import { BsPlus } from 'react-icons/bs'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import CardComponent from '../../components/CardComponent'
import TooltipComponent from '../../components/TooltipComponent'
import Modaljs from '../../components/Modal'
import TextareaAutosize from 'react-textarea-autosize';

const EnergyTeamMasterdata = () => {
    const [viewCompany, setviewCompany] = useState(false);
    return (
        <Col md={12} data-aos={"fade-up"}>
            <Helmet>
                <title>Energy Teams · CMS Electricals</title>
            </Helmet>
            <CardComponent title={'Energy Teams'} icon={<BsPlus />} onclick={() => setviewCompany(true)} tag={'Create'}>
                <Row className='g-4'>
                    {[1, 2, 3, 4, 5, 1, 2, 3, 4, 5].map((cards) => (
                        <Col md={6} key={cards}>
                            <div className="bg-new p-3 before-border position-relative">
                                <Row className='align-items-center'>
                                    <Col md={3} className='text-center'>
                                        <img className="bg-new p-2" width={100} src="https://i.ibb.co/7Qmnbgz/2115951.png" alt="User-Profile" />
                                    </Col>
                                    <Col>
                                        <div className='ms-3'>
                                            <div>
                                                <strong className="text-primary">Design</strong>
                                            </div>
                                            <div className="mb-2 small text-gray text-truncate2 line-clamp-2">
                                                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                            </div>
                                            <div className="d-align justify-content-between user-hover">
                                                <div>
                                                    <div className='d-flex align-items-center'>
                                                        {[1, 2, 3, 4, 5].map((user) => (
                                                            <TooltipComponent key={user} title={'Altaf Ahmad'}>
                                                                <img key={user} className="user-hover-btn" src="assets/images/default-image.png" alt="User-Profile" />
                                                            </TooltipComponent>
                                                        ))}
                                                        <div className="small ms-3 text-gray">50 Members</div>
                                                    </div>
                                                </div>
                                                <Link to={`/EnergyTeamMasterdata/EnergyTeamMembers${1}`} className='text-secondary text-decoration-none'>View</Link>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    ))}
                </Row>
            </CardComponent>

            <Modaljs open={viewCompany} size={'md'} closebtn={'Cancel'} Savebtn={'Save'} close={() => setviewCompany(false)} title={"Create a Team"}>
                <Row className='g-2'>
                    <Form.Group as={Col} md={6}>
                        <Form.Label>Team Head</Form.Label>
                        <Form.Control type="text" />
                    </Form.Group>
                    <Form.Group as={Col} md={6}>
                        <Form.Label>Team Name</Form.Label>
                        <Form.Control type="text" />
                    </Form.Group>
                    <Form.Group as={Col} md={12}>
                        <Form.Label>Team Short Description</Form.Label>
                        <TextareaAutosize minRows={2} className='edit-textarea' />
                    </Form.Group>
                    <Form.Group as={Col} md={6}>
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" />
                    </Form.Group>
                    <Form.Group as={Col} md={6}>
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" />
                    </Form.Group>
                    <Form.Group as={Col} md={6}>
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" />
                    </Form.Group>
                    <Form.Group as={Col} md={6}>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" />
                    </Form.Group>
                    <Form.Group as={Col} md={12}>
                        <Form.Label>Joining Date</Form.Label>
                        <Form.Control type="date" />
                    </Form.Group>
                </Row>
            </Modaljs>
        </Col>
    )
}

export default EnergyTeamMasterdata