import React from 'react'
import { Card, Col, Form, Row } from 'react-bootstrap'
import { BsUpload } from 'react-icons/bs'

const AssetProfile = () => {
    const form = [
        { title: 'Total Repair Costs', col: 6, form: [{ type: 'text', value: '32,250.00' }] },
        { title: 'Total Repair', col: 6, form: [{ type: 'text', value: '32,250.00' }] },
        { title: 'Current Status', col: 12, form: [{ type: 'text', value: 'Lorem Ipsum' }] },
    ]
    return (
        <Row className='g-4'>
            <Col md={6}>
                <Row className='g-4'>
                    <Col md={12}>
                        <Card className='bg-new-re bg-light h-100'>
                            <Card.Body>
                                <Row className='g-4'>
                                    <Col md={7}>
                                        <div className='d-grid gap-2'>
                                            <Form.Group>
                                                <Form.Label>Model No.</Form.Label>
                                                <Form.Control type='text' className='shadow-none border border-secondary' required />
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label>Date Of Purchase</Form.Label>
                                                <Form.Control type='text' className='shadow-none border border-secondary' required />
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label>Dealer</Form.Label>
                                                <Form.Control type='text' className='shadow-none border border-secondary' required />
                                            </Form.Group>
                                        </div>
                                    </Col>
                                    <Col md={5}>
                                        <div className='d-grid gap-2'>
                                            <Form.Group>
                                                <Form.Label>Stamp Of Vendor</Form.Label>
                                                <Form.Label controlId="uploadphoto" className="border border-secondary p-4 text-center w-100 fs-3 cursor-pointer">
                                                    <BsUpload />
                                                    <Form.Control type='file' className='d-none' />
                                                </Form.Label>
                                            </Form.Group>
                                            <Form.Group className='text-center'>
                                                <img src='https://i.ibb.co/2qCq6p0/download.png' width={80} />
                                            </Form.Group>
                                        </div>
                                    </Col>
                                    <Col md={12}>
                                        <p className='text-center mb-0 small fw-bold'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={12}>
                        <Row className='g-4'>
                            {form.map((input, ipa) => (
                                <Form.Group key={ipa} as={Col} md={input.col}>
                                    <Form.Label>{input.title}</Form.Label>
                                    {input.form?.map((text, idb) => (
                                        <Form.Control key={idb} type={text.type} defaultValue={text.value} required disabled />
                                    ))}
                                </Form.Group>
                            ))}
                        </Row>
                    </Col>
                </Row>
            </Col>
            <Col md={6}>
                <Row className='g-4'>
                    <Form.Group as={Col} md={6}>
                        <Form.Label>Asset Price</Form.Label>
                        <Form.Control defaultValue={'32,250.00'} disabled required />
                    </Form.Group>
                    <Form.Group as={Col} md={6}>
                        <Card className='card-bg p-2'>
                            <Card.Img variant="top" src="https://i.ibb.co/vYg8PDG/png-clipart-texmo-pipes-and-products-plastic-pipework-piping-and-plumbing-fitting-drip-irrigation-st.png" />
                        </Card>
                    </Form.Group>
                    <Form.Group as={Col} md={12}>
                        <Form.Label>Asset Details</Form.Label>
                        <Card className='card-bg'>
                            <Card.Body>
                                <ul>
                                    {Array.from(Array(5)).map((_, index) => (
                                        <li key={index}>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</li>
                                    ))}
                                </ul>
                            </Card.Body>
                        </Card>
                    </Form.Group>
                </Row>
            </Col>
        </Row>
    )
}

export default AssetProfile