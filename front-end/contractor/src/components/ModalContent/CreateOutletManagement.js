import React from 'react'
import { Form, Row, Col } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import CardComponent from '../../components/CardComponent';
import Select from 'react-select';

const CreateOutletManagement = () => {
    return (
        <>
            <Helmet>
                <title>Create Outlet Management · CMS Electricals</title>
            </Helmet>
            <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
                <Row className='g-4'>
                    <Col md={12} data-aos={"fade-up"} data-aos-delay={300}>
                        <CardComponent title={'Create Outlet Management'}>
                            <Row className='g-3'>
                                <Form.Group as={Col} md={4}>
                                    <Form.Label>Select Energy Company</Form.Label>
                                    <Select className='text-primary w-100' placeholder='--Select--' options={[{ value: "no_data", label: 'No Data' }]} />
                                </Form.Group>
                                <Form.Group as={Col} md={4}>
                                    <Form.Label>Select Regional Office</Form.Label>
                                    <Select className='text-primary w-100' placeholder='--Select--' options={[{ value: "no_data", label: 'No Data' }]} />
                                </Form.Group>
                                <Form.Group as={Col} md={4}>
                                    <Form.Label>Select Sales area</Form.Label>
                                    <Select className='text-primary w-100' placeholder='--Select--' options={[{ value: "no_data", label: 'No Data' }]} />
                                </Form.Group>
                                <Form.Group as={Col} md={4}>
                                    <Form.Label>Outlet Name <small className='text-danger'>*</small></Form.Label>
                                    <Form.Control type='text' required />
                                </Form.Group>
                                <Form.Group as={Col} md={4}>
                                    <Form.Label>Contact Person Name</Form.Label>
                                    <Form.Control type='text' required />
                                </Form.Group>
                                <Form.Group as={Col} md={4}>
                                    <Form.Label>Outlet Contact Number <small className='text-danger'>*</small></Form.Label>
                                    <Form.Control type='text' required />
                                </Form.Group>
                                <Form.Group as={Col} md={4}>
                                    <Form.Label>Primary Mobile Number</Form.Label>
                                    <Form.Control type='text' required />
                                </Form.Group>
                                <Form.Group as={Col} md={4}>
                                    <Form.Label>Secondary Mobile Number</Form.Label>
                                    <Form.Control type='number' required />
                                </Form.Group>
                                <Form.Group as={Col} md={4}>
                                    <Form.Label>Primary Email</Form.Label>
                                    <Form.Control type='email' required />
                                </Form.Group>
                                <Form.Group as={Col} md={4}>
                                    <Form.Label>Secondary Email</Form.Label>
                                    <Form.Control type='email' required />
                                </Form.Group>
                                <Form.Group as={Col} md={4}>
                                    <Form.Label>Outlet/Customer Code <small className='text-danger'>*</small></Form.Label>
                                    <Form.Control type='text' required />
                                </Form.Group>
                                <Form.Group as={Col} md={4}>
                                    <Form.Label>Outlet Category <small className='text-danger'>*</small></Form.Label>
                                    <Form.Control type='text' required />
                                </Form.Group>
                                <Form.Group as={Col} md={4}>
                                    <Form.Label>Regional Office <small className='text-danger'>*</small></Form.Label>
                                    <Form.Control type='text' required />
                                </Form.Group>
                                <Form.Group as={Col} md={4}>
                                    <Form.Label>Sales Area <small className='text-danger'>*</small></Form.Label>
                                    <Form.Control type='text' required />
                                </Form.Group>
                                <Form.Group as={Col} md={4}>
                                    <Form.Label>District <small>(Optional)</small></Form.Label>
                                    <Form.Control type='text' required />
                                </Form.Group>
                                <Form.Group as={Col} md={4}>
                                    <Form.Label>Location</Form.Label>
                                    <Form.Control type='text' required />
                                </Form.Group>
                                <Form.Group as={Col} md={4}>
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control type='text' required />
                                </Form.Group>
                                <Form.Group as={Col} md={4}>
                                    <Form.Label>Outlet CCNOMS <small className='text-danger'>*</small></Form.Label>
                                    <Form.Control type='text' required />
                                </Form.Group>
                                <Form.Group as={Col} md={4}>
                                    <Form.Label>Outlet CCNOHSD <small className='text-danger'>*</small></Form.Label>
                                    <Form.Control type='text' required />
                                </Form.Group>
                                <Form.Group as={Col} md={4}>
                                    <Form.Label>Outlet RESV</Form.Label>
                                    <Form.Control type='text' required />
                                </Form.Group>
                                <Form.Group as={Col} md={4}>
                                    <Form.Label>Outlet Longitude</Form.Label>
                                    <Form.Control type='text' required />
                                </Form.Group>
                                <Form.Group as={Col} md={4}>
                                    <Form.Label>Outlet Latitude</Form.Label>
                                    <Form.Control type='text' required />
                                </Form.Group>
                                <Form.Group as={Col} md={4}>
                                    <Form.Label>Outlet Image</Form.Label>
                                    <Form.Control type='file' required />
                                </Form.Group>
                            </Row>
                        </CardComponent>
                    </Col>
                    <Col md={12}>
                        <div className='d-align'>
                            <div className='shadow cursor-pointer my-4 px-3 py-1 purple-combo'>Request For Approval</div>
                        </div>
                    </Col>
                </Row>
            </Col>
        </>
    )
}

export default CreateOutletManagement