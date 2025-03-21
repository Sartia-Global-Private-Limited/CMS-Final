import React, { useState } from 'react'
import { Card, Col, Form, Row } from 'react-bootstrap'
import Modaljs from '../Modal'
import AddInvoiceTemplates from './AddInvoiceTemplates'

const CreateInvoice = () => {
    const [addTemp, setAddTemp] = useState(false);

    const [file, setFile] = useState()
    const fileHandler = (e) => {
        setFile(e.target.files[0])
    }
    return (
        <Row className='g-4'>
            <Col md={12} className='pt-2'>
                <div className='position-relative'>
                    <Form.Select onClick={() => setAddTemp(true)}>
                        <option>Select Performa Invoices</option>
                    </Form.Select>
                    <span className="position-absolute top-0 mt-1 start-100 translate-middle badge rounded-pill bg-secondary">3</span>
                </div>
            </Col>
            <Col md={12}>
                <Card className='card-bg'>
                    <Card.Body>
                        <Row className='g-4'>
                            <Col md={6}>
                                <div className='p-3 dashed-border d-align gap-4'>
                                    <img src={file ? URL.createObjectURL(file) : 'https://i.ibb.co/Dz7rHNk/s.png'} width={50} alt='logo' />
                                    <Form.Label controlId="uploadphoto" className="mb-0">
                                        <small>Drag Your Logo Here or Select a File</small>
                                        <Form.Control type='file' onChange={fileHandler} className='d-none' />
                                    </Form.Label>
                                </div>
                            </Col>
                            <Col md={6}>
                                <Form.Select className='shadow-none dashed-border mb-3'>
                                    <option>Tax Po</option>
                                    <option value="1">One</option>
                                    <option value="2">Two</option>
                                    <option value="3">Three</option>
                                </Form.Select>
                                <div className='d-align text-truncate gap-2'>
                                    <small>Pi No :</small>
                                    <Form.Control type="text" className='shadow-none dashed-border' placeholder="#002356" />
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className='p-3 dashed-border d-grid gap-2'>
                                    <small>From</small>
                                    <strong>Lorem Ipsum</strong>
                                    <small>Lorem Ipsum is simply dummy location, street, city-110080</small>
                                    <small>Lorem_Ipsum235@gmail.com</small>
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className='p-3 dashed-border d-grid gap-2'>
                                    <small>To</small>
                                    <strong>Lorem Ipsum</strong>
                                    <small>Lorem Ipsum is simply dummy location, street, city-110080</small>
                                    <small>Lorem_Ipsum235@gmail.com</small>
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className='d-align text-truncate gap-2'>
                                    <small>Po Date :</small>
                                    <Form.Control type="date" className='shadow-none dashed-border' />
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className='d-align text-truncate gap-2'>
                                    <small>Due Date :</small>
                                    <Form.Control type="date" className='shadow-none dashed-border' />
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Col>

            <Modaljs open={addTemp} size={'lg'} closebtn={'Discard'} Savebtn={'Merge'} close={() => setAddTemp(false)} title={"Select Performa Invoices"}>
                <AddInvoiceTemplates />
            </Modaljs>
        </Row>
    )
}

export default CreateInvoice