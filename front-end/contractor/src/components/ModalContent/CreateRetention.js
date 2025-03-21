import React from 'react'
import { Card, Col, Form, Row } from 'react-bootstrap'
import { BsPlus, BsXLg } from 'react-icons/bs'
import CardComponent from '../CardComponent';
import Select from 'react-select';
import TextareaAutosize from 'react-textarea-autosize';

const CreateRetention = () => {
    const options = [
        { value: "1", label: '20122504-OS-42252/RM' },
        { value: "2", label: '20122511-OS-654151' },
    ]
    return (
        <Col md={12}>
            <CardComponent title={'Create New Retention'}>
                <Row className='g-4'>
                    <Col md={12}>
                        <Form.Label>Select Invoice</Form.Label>
                        <Select className='text-primary' defaultValue={options[0]} options={options} />
                    </Col>
                    <Col md={12}>
                        <Card className='card-bg'>
                            <Card.Body>
                                <div className='hr-border2 pb-4 mb-3'>
                                    <Row className='g-4 row-cols-1 row-cols-md-2'>
                                        <Col>
                                            <Form.Label>Retention Date</Form.Label>
                                            <Form.Control type="date" />
                                        </Col>
                                        <Col>
                                            <Form.Label>Retention Amount</Form.Label>
                                            <Form.Control type="text" defaultValue='₹ 153,000.00' className='fw-bold fs-6' placeholder="Total Amount" />
                                        </Col>
                                    </Row>
                                </div>
                                <Row className='g-4'>
                                    <Col md={12}><span className='fw-bolder'>Other Deductions</span></Col>
                                    <Col md={6}>
                                        <Form.Label>Fee Amount</Form.Label>
                                        <Form.Control type="text" defaultValue='₹ 153,000.00' placeholder="Total Amount" />
                                    </Col>
                                    <Col md={6}>
                                        <Form.Label>Net Amount</Form.Label>
                                        <Form.Control type="text" defaultValue='₹ 153,000.00' placeholder="Total Amount" />
                                    </Col>
                                    <Col md={7}>
                                        <Form.Label>Tax Type</Form.Label>
                                        <Select className='text-primary w-100' options={[{ value: "CGST", label: 'CGST' }, { value: "SGST", label: 'SGST' }, { value: "IGST", label: 'IGST' }]} />
                                    </Col>
                                    <Col md={5}>
                                        <Form.Label>Tax Amount or Percentage</Form.Label>
                                        <span className='d-align gap-2'>
                                            <Form.Control className='fw-bold' type='text' />
                                            <Select className='text-primary w-100' options={[{ value: "18", label: '18%' }, { value: "24", label: '24%' }, { value: "45", label: '45%' }]} />
                                            <div className='shadow p-2 danger-combo d-align'><BsXLg className='cursor-pointer' /></div>
                                        </span>
                                    </Col>
                                    <Col className='text-end'><div className='shadow success-combo d-inline-flex cursor-pointer align-items-center px-3 gap-2'><BsPlus /> Add </div></Col>
                                    <Col md={12}><TextareaAutosize minRows={2} className='mt-4 edit-textarea' /></Col>
                                    <Col className='text-end'><div className='shadow success-combo d-inline-flex cursor-pointer align-items-center px-3 gap-2'><BsPlus /> Add </div></Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </CardComponent>
        </Col>
    )
}

export default CreateRetention