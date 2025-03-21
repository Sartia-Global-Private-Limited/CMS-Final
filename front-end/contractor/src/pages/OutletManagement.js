import React, { useState } from 'react'
import { Col, Form, Row, Table } from 'react-bootstrap'
import { BsPlus } from 'react-icons/bs'
import ActionButton from '../components/ActionButton'
import CardComponent from '../components/CardComponent'
import Modaljs from '../components/Modal'

const OutletManagement = () => {
    const [viewCompany, setviewCompany] = useState(false);
    const addform = [
        {
            id: 1,
            label: 'Regional Office',
            type: 'text',
            col: 6,
        },
        {
            id: 2,
            label: 'Sales Area',
            type: 'text',
            col: 6,
        },
    ]

    return (
        <Col md={12} data-aos={"fade-up"}>
            <CardComponent title={'Outlet Management'} icon={<BsPlus />} link={'/CreateOutletManagement'} tag={'Create'}>
                <div className='overflow-auto p-2'>
                    <Table className='text-body bg-new Roles'>
                        <thead className='text-truncate'>
                            <tr>
                                {['Outlet Name', 'Outlet Contact Number', 'Outlet/Customer Code', 'Outlet Category', 'Regional Office', 'Sales Area', 'Outlet CCNOMS', 'Outlet CCNOHSD', 'Action'].map((thead) => (
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
                                    <td>Lorem Ipsum</td>
                                    <td>Lorem Ipsum</td>
                                    <td>Lorem Ipsum</td>
                                    <td>Lorem Ipsum</td>
                                    <td><ActionButton editlink={'/CreateOutletManagement'} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </CardComponent>

            <Modaljs open={viewCompany} size={'lg'} closebtn={'Cancel'} Savebtn={'Submit'} close={() => setviewCompany(false)} title={"Create Outlets"}>
                <Row className="g-4">
                    {addform.map((form, idx) => (
                        <Form.Group key={idx} as={Col} md={form.col} className='mb-3'>
                            <Form.Label>{form.label}</Form.Label>
                            <Form.Control required type={form.type} />
                        </Form.Group>
                    ))}
                </Row>
            </Modaljs>
        </Col>
    )
}

export default OutletManagement