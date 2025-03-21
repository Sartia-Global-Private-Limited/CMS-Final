import React from 'react'
import Tabs, { Tab } from 'react-best-tabs';
import 'react-best-tabs/dist/index.css';
import { Col, Form, Row } from 'react-bootstrap';
import { BsCheck, BsFillEyeFill, BsPlus } from 'react-icons/bs';
import CardComponent from '../CardComponent';


const ComplaintTypes = () => {
    const addform = [
        {
            id: 1,
            label: 'Complaint Name',
            formcontrol: [1]
        },
        {
            id: 2,
            label: 'Select Sector',
            select: [
                { id: 1, selectmenu: ['--', 'Demo 1', 'Demo 2', 'Demo 3'] },
            ],
        },
    ]
    return (
        <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
            <Tabs activeTab="1" ulClassName="border-primary border-bottom" activityClassName="bg-secondary" >
                <Tab title="Types">
                    <div className="mt-4">
                        <Col md={4} data-aos={"fade-up"} data-aos-delay={100}>
                            <div className="d-grid gap-4 mt-2 position-sticky top-0">
                                {addform.map((form, idx) => (
                                    <Form.Group key={idx} md={form.col}>
                                        <Form.Label>{form.label}</Form.Label>
                                        {form.formcontrol?.map((text) => (
                                            <Form.Control key={text} type={text} required />
                                        ))}
                                        {form.select?.map((select) => (
                                            <Form.Select key={select} aria-label="Default select example" required>
                                                {select.selectmenu?.map((menu) => (
                                                    <option key={menu}>{menu}</option>
                                                ))}
                                            </Form.Select>
                                        ))}
                                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                    </Form.Group>
                                ))}
                                <div className='social-btn mt-4 w-auto d-align'><BsPlus /> Add</div>
                            </div>
                        </Col>
                    </div>
                </Tab>
                <Tab title="Access Right">
                    <div className="mt-4">
                        <div className='d-grid gap-2'>
                            <Col md={4} data-aos={"fade-up"} data-aos-delay={100}>
                                <Form.Group className="mb-4" controlId="SelectAssigned">
                                    <Form.Label>Assigned to Users</Form.Label>
                                    <Form.Select aria-label="Default select example">
                                        <option>--</option>
                                        <option value="1">One</option>
                                        <option value="2">Two</option>
                                        <option value="3">Three</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-4" controlId="Access">
                                    <Form.Label>Access</Form.Label>
                                    <span className='d-flex gap-4'>
                                        <Form.Check type="radio" name='aces' id='al' label="Allowed" checked={true} />
                                        <Form.Check type="radio" name='aces' id='dis' label="DisAllowed " />
                                    </span>
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <div className='social-btn purple-combo mt-3 w-auto gap-1 d-align'><BsCheck className='fs-4' /> Save</div>
                            </Col>
                        </div>
                    </div>
                </Tab>
                <Tab title={[<BsFillEyeFill />, 'See Updated']} className='d-align gap-2 ms-auto'>
                    <div className="mt-3 last-child-none">
                        <Row className='g-4'>
                            <Col md={12}>
                                <CardComponent title={'All - Approved Complaints (10)'} custom={<Form.Control style={{ marginRight: '-1.3rem' }} type='date' />}>
                                    {[1, 2, 3, 4, 5].map((home) => (
                                        <div key={home} className='hr-border2 py-3'>
                                            <span className='d-align small gap-2 float-end'>
                                                <span className='text-green'>Date</span>
                                                <div className="vr hr-shadow"></div>
                                                01/12/2022
                                                <div className="vr hr-shadow"></div>
                                                11:32 AM
                                            </span>
                                            {['Complaint Name', 'Complaint Sector'].map((feed) => (
                                                <p className='mb-2'>{feed} : <strong>Lorem Ipsum Complaint</strong></p>
                                            ))}
                                            <p className='mb-2'>User Name : <strong>Lorem Ipsum</strong></p>
                                            <p className='text-green'>Approved By : <strong>Demo1 (Company Name)</strong></p>
                                            <p className='t-align'>THE COMPLAINT MANAGEMENT SYSTEM IS WEBBASED APPLICATION AND IT IS DESIGNED TO KEEP TRACK OF COMPLAINTS REGISTERED BY THE COLLEGE DEPARTMENT/LAB STAFFS, SO THIS SYSTEM NEED TO HAVE DISTRIBUTED PLATFORM INDEPENDENT WEB APPLICATION.</p>
                                        </div>
                                    ))}
                                </CardComponent>
                            </Col>
                        </Row>
                    </div>
                </Tab>
            </Tabs>
        </Col>
    )
}

export default ComplaintTypes