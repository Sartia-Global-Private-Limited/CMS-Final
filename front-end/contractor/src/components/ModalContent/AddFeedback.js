import React from 'react'
import { Form, Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import TextareaAutosize from 'react-textarea-autosize';


const AddFeedback = () => {
    const options = [
        { value: "all", label: 'All' },
        { value: "sa", label: 'Super Admin' },
        { value: "dp", label: 'Dealer Panel' },
        { value: "ec", label: 'Energy Company' },
    ]
    const options2 = [
        { value: "empty", label: '--' },
        { value: "c", label: 'Complaint' },
        { value: "f", label: 'Feedback & Suggestion' },
        { value: "cri", label: 'Change Request & Improvements' },
    ]
    return (
        <Row className="g-2">
            <Form.Group as={Col} md={12}>
                <Form.Label>Select User Type</Form.Label>
                <Select menuPosition="fixed" className='text-primary' defaultValue={options[0]} options={options} />
            </Form.Group>
            <Form.Group as={Col} md={12}>
                <Form.Label>Select Type</Form.Label>
                <Select closeMenuOnSelect={false} menuPosition="fixed" isMulti className='text-primary' options={options2} />
            </Form.Group>
            <Form.Group as={Col} md={12}>
                <TextareaAutosize minRows={2} className='edit-textarea' placeholder='Information Text...' />
            </Form.Group>
        </Row>
    )
}

export default AddFeedback