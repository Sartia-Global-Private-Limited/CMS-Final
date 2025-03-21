import React from 'react'
import { Fragment } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import TextareaAutosize from 'react-textarea-autosize';

const AddFeedback = () => {
    const addform = [
        {
            id: 1,
            label: 'User Type',
            col: 12,
            formcontrol: [1]
        },
        {
            id: 12,
            label: 'Type',
            col: 12,
            select: [
                { id: 1, selectmenu: ['--', 'Feedbacks', 'Suggestions', 'New Feature Required', 'Change Required', 'Complaint'] },
            ],
        },
        {
            id: 3,
            label: 'Suggestions text',
            col: 12,
            textarea: [1]
        },
    ]
    const Options = [
        { label: 'Sub Admin', value: 'sadmin' },
        { label: 'Admin', value: 'admin' },
    ]
    return (
        <>
            <Row className="g-2">
                {addform.map((form, idx) => (
                    <Form.Group key={idx} as={Col} md={form.col}>
                        <Form.Label>{form.label}</Form.Label>
                        {form.formcontrol?.map((text) => (
                            <Select key={text} closeMenuOnSelect={false} defaultValue={[Options[4], Options[5]]} isMulti options={Options} />
                        ))}
                        {form.select?.map((select) => (
                            <Form.Select key={select} aria-label="Default select example" required>
                                {select.selectmenu?.map((menu) => (
                                    <option key={menu}>{menu}</option>
                                ))}
                            </Form.Select>
                        ))}
                        {form.textarea?.map((frm) => (
                            <Fragment key={frm}>
                                <TextareaAutosize minRows={2} className='edit-textarea' required />
                            </Fragment>
                        ))}
                    </Form.Group>
                ))}
            </Row>
        </>
    )
}

export default AddFeedback