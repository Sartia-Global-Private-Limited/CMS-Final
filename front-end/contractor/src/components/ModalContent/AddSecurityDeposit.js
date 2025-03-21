import React from 'react'
import { Fragment } from 'react'
import { Col, Form, Row } from 'react-bootstrap'
import TextareaAutosize from 'react-textarea-autosize';

const AddSecurityDeposit = () => {
    const form = [
        { title: 'Date', col: 7, form: [{ type: 'date' }] },
        { title: 'Amount', col: 5, form: [{ type: 'text' }] },
        { title: 'Select PO', col: 6, select: [{ option: ['lorem', 'ipsum'] }] },
        { title: 'Method', col: 6, select: [{ option: ['Check', 'Neft', 'Rtgs', 'Imps', 'Upi', 'Cash', 'Other'] }] },
        { title: 'Payment Reference Details', col: 12, form: [{ type: 'text' }] },
    ]
    return (
        <Row className='g-2'>
            {form.map((input, ipa) => (
                <Form.Group key={ipa} as={Col} md={input.col}>
                    <Form.Label>{input.title}</Form.Label>
                    {input.form?.map((text, idb) => (
                        <Form.Control key={idb} type={text.type} required />
                    ))}
                    {input.area?.map((idc) => (
                        <Fragment key={idc}>
                            <TextareaAutosize minRows={2} className='edit-textarea' required />
                        </Fragment>
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
    )
}

export default AddSecurityDeposit