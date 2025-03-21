import React, { useState } from 'react'
import { Col, Form, Row, Table } from 'react-bootstrap'
import { BsPlus } from 'react-icons/bs'
import CardComponent from '../components/CardComponent'
import Modaljs from '../components/Modal'
import Select from 'react-select';

const EnergyCompanyTeam = () => {
    const [addEnergyC, setAddEnergyC] = useState(false);
    return (
        <Col md={12} data-aos={"fade-up"}>
            <CardComponent title={'Energy Company Team'} icon={<BsPlus />} onclick={() => setAddEnergyC(true)} tag={'Create'}>
                <div className='overflow-auto p-2'>
                    <Table className='text-body bg-new Roles'>
                        <thead className='text-truncate'>
                            <tr>
                                {['Name', 'Regional Office', 'Sales Area’s', 'Officer Designation', 'Email', 'Mobile Number'].map((thead) => (
                                    <th key={thead}>{thead}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {[1, 2, 3, 4, 5].map((home) => (
                                <tr key={home}>
                                    <td>Lorem Ipsum</td>
                                    <td>Lorem Ipsum</td>
                                    <td>Lorem Ipsum</td>
                                    <td>Lorem Ipsum</td>
                                    <td>loremipsum74@gmail.com</td>
                                    <td>91+ 456 651 6645</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </CardComponent>
            <Modaljs open={addEnergyC} size={'md'} closebtn={'Cancel'} Savebtn={'Add'} close={() => setAddEnergyC(false)} title={"Add Energy Company Team"}>
                <Row className="g-2">
                    <Form.Group as={Col} md={12}>
                        <Form.Label>Add Name</Form.Label>
                        <Form.Control required type='text' />
                    </Form.Group>
                    <Form.Group as={Col} md={6}>
                        <Form.Label>Select Regional Office</Form.Label>
                        <Select className='text-primary w-100' placeholder='--Select--' options={[{ value: "no_data", label: 'No Data' }]} />
                    </Form.Group>
                    <Form.Group as={Col} md={6}>
                        <Form.Label>Sales Area’s</Form.Label>
                        <Select className='text-primary w-100' placeholder='--Select--' options={[{ value: "no_data", label: 'No Data' }]} />
                    </Form.Group>
                    <Form.Group as={Col} md={12}>
                        <Form.Label>Select Officer Designation</Form.Label>
                        <Select className='text-primary w-100' placeholder='--Select--' options={[{ value: "no_data", label: 'No Data' }]} />
                    </Form.Group>
                    <Form.Group as={Col} md={6}>
                        <Form.Label>Mobile Number</Form.Label>
                        <Form.Control required type='number' />
                    </Form.Group>
                    <Form.Group as={Col} md={6}>
                        <Form.Label>Email</Form.Label>
                        <Form.Control required type='email' />
                    </Form.Group>
                </Row>
            </Modaljs>
        </Col>
    )
}

export default EnergyCompanyTeam