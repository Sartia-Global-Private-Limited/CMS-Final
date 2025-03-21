import React from 'react'
import { Card, Col, Form, Row } from 'react-bootstrap'
import CardComponent from '../CardComponent'
import ReactDropzone from '../ReactDropzone'

const AddStock = () => {
    const form = [
        { title: 'Select Item Category', col: 7, select: [{ option: ['one', 'two', 'three'] }] },
        { title: 'Item Name', col: 5, form: [{ type: 'text' }] },
        { title: 'Item Unit', col: 5, form: [{ type: 'text' }] },
        { title: 'Item Qty', col: 5, form: [{ type: 'text' }] },
        { title: 'Item Rate', col: 5, form: [{ type: 'text' }] },
        { title: 'Item Image', col: 5, form: [{ type: 'file' }] },
    ]
    return (
        <Col md={12} data-aos={"fade-up"}>
            <CardComponent title={'Add Stock'}>
                <Row className="g-3">
                    <Col md={8}>
                        <Row className='g-2'>
                            {form.map((input, ipa) => (
                                <Form.Group key={ipa} as={Col} md={12}>
                                    <Form.Label>{input.title}</Form.Label>
                                    {input.form?.map((text, idb) => (
                                        <Form.Control key={idb} type={text.type} required />
                                    ))}
                                    {input.select?.map((idd) => (
                                        <Form.Select key={idd}>
                                            {idd.option?.map((value) => (
                                                <option key={value}>{value}</option>
                                            ))}
                                        </Form.Select>
                                    ))}
                                </Form.Group>
                            ))}
                        </Row>
                    </Col>
                    <Col md={4}>
                        <Card className='bg-new-re h-100 text-center align-items-center d-grid'>
                            <Card.Body>
                                <ReactDropzone title={'Attachment some files here, or click to select files'} />
                            </Card.Body>
                        </Card>
                    </Col>
                    <div className='d-align justify-content-end'>
                        <div className='social-btn w-auto h-auto purple-combo'>Add Item Master</div>
                    </div>
                </Row>
            </CardComponent>
        </Col>
    )
}

export default AddStock