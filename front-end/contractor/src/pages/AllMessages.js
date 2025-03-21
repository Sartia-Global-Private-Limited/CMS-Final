import React, { useState } from 'react'
import { Col, Row, Form } from 'react-bootstrap'
import { Helmet } from 'react-helmet'
import { BsPlus } from 'react-icons/bs'
import Select from 'react-select';
import CardComponent from '../components/CardComponent'
import Modaljs from '../components/Modal'
import TextareaAutosize from 'react-textarea-autosize';


const AllMessages = () => {
    const [sendMessages, setsendMessages] = useState(false);
    const options = [
        { value: "all", label: 'All' },
        { value: "sa", label: 'Super Admin' },
        { value: "dp", label: 'Dealer Panel' },
        { value: "ec", label: 'Energy Company' },
    ]
    const options2 = [
        // { value: "all", label: 'All' },
        { value: "aa", label: 'Altaf Ahmad' },
        { value: "am", label: 'Ansarul Mandal' },
        { value: "rr", label: 'Rahul Rawat' },
        { value: "rs", label: 'Rohit Singh' },
        { value: "mk", label: 'Mohit Kumar' },
    ]
    return (
        <Col md={12} data-aos={"fade-up"}>
            <Helmet>
                <title>Messages · CMS Electricals</title>
            </Helmet>
            <CardComponent title={'Today'} icon={<BsPlus />} onclick={() => setsendMessages(true)} tag={'Send Messages'}>
                <div className='d-grid gap-2 last-child-none'>
                    {[1, 2, 3, 4, 5].map((home) => (
                        <div className='hr-border2' key={home}>
                            <p className='mb-2'><img className='avatar me-2' src='https://cdn0.iconfinder.com/data/icons/basic-11/97/34-512.png' alt='user-img' />
                                <strong>Altaf Ahmad </strong>(lorem ipsum)
                                <span className='d-align small gap-2 float-end'>
                                    01/12/2022
                                    <div className="vr hr-shadow"></div>
                                    11:32 AM
                                </span>
                            </p>
                            <p className='mb-3 small t-align'>THE COMPLAINT MANAGEMENT SYSTEM IS WEBBASED APPLICATION AND IT IS DESIGNED TO KEEP TRACK OF COMPLAINTS REGISTERED BY THE COLLEGE DEPARTMENT/LAB STAFFS, SO THIS SYSTEM NEED TO HAVE DISTRIBUTED PLATFORM INDEPENDENT WEB APPLICATION.</p>
                        </div>
                    ))}
                </div>
            </CardComponent>

            <Modaljs open={sendMessages} size={'sm'} closebtn={'Cancel'} Savebtn={'Send'} close={() => setsendMessages(false)} title={"Send Messages"}>
                <Row className="g-2">
                    <Form.Group as={Col} md={12}>
                        <Form.Label>Select User Type</Form.Label>
                        <Select menuPosition="fixed" className='text-primary' defaultValue={options[0]} options={options} />
                    </Form.Group>
                    <Form.Group as={Col} md={12}>
                        <Form.Label>User</Form.Label>
                        <Select closeMenuOnSelect={false} menuPosition="fixed" isMulti className='text-primary' options={options2} />
                    </Form.Group>
                    <Form.Group as={Col} md={12}>
                        <TextareaAutosize minRows={2} className='edit-textarea' placeholder='Type Message...' />
                    </Form.Group>
                </Row>
            </Modaljs>
        </Col>
    )
}

export default AllMessages