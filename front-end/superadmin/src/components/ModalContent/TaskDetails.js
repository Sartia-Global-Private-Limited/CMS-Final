import React from 'react'
import { Fragment } from 'react'
import { Col, Form, Row } from 'react-bootstrap'
import TextareaAutosize from 'react-textarea-autosize';

const TaskDetails = () => {
    const form = [
        { title: 'Task Name', col: 4, form: [{ type: 'text', defaultValue: 'Lorem Ipsum' }] },
        { title: 'Task Date', col: 4, form: [{ type: 'date', defaultValue: 'Lorem Ipsum' }] },
        { title: 'Task End Date', col: 4, form: [{ type: 'date', defaultValue: 'Lorem Ipsum' }] },
        { title: 'Task Assign User Name', col: 4, form: [{ type: 'text', defaultValue: 'Lorem Ipsum' }] },
        { title: 'Task Title', col: 4, form: [{ type: 'text', defaultValue: 'Lorem Ipsum' }] },
        { title: 'Task Description', col: 4, area: [{ rows: 4, defaultValue: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s,' }] },
    ]
    return (
        <Col md={12}>
            <Row className="g-4">
                <Col md={12}>
                    <div className='d-align lh-1 justify-content-between'>
                        <span className='d-align gap-2 lh-1'>
                            <div className='social-btn purple-combo w-auto'>Start Time</div>
                            <div className='social-btn purple-combo w-auto'>End Time</div>
                        </span>
                        <div className='social-btn fs-20 lh-1 purple-combo px-5 fw-bold w-auto'>00:00:00</div>
                    </div>
                </Col>
                <Col md={12}>
                    <Row className='g-4'>
                        <Form.Group as={Col} md={12}>
                            <Form.Label>Comments</Form.Label>
                            <div className='form-shadow position-relative'>
                                <Form.Control className='shadow-none resize-none' as="textarea" rows={4} required />
                                <div className='p-3'>
                                    <div className='social-btn Position-absolute bottom-0 purple-combo d-align ms-auto px-5'>Send</div>
                                </div>
                            </div>
                        </Form.Group>
                        {form.map((input, ipa) => (
                            <Form.Group key={ipa} as={Col} md={input.col}>
                                <Form.Label>{input.title}</Form.Label>
                                {input.form?.map((text, idb) => (
                                    <Form.Control key={idb} defaultValue={text.defaultValue} type={text.type} required />
                                ))}
                                {input.area?.map((area, idc) => (
                                    <Fragment key={idc}>
                                        <TextareaAutosize minRows={area.rows} className='edit-textarea' defaultValue={area.defaultValue} required />
                                    </Fragment>
                                ))}
                            </Form.Group>
                        ))}
                    </Row>
                </Col>
            </Row>
        </Col>
    )
}

export default TaskDetails