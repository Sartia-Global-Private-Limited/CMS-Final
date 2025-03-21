import React, { useState } from 'react'
import { Table, Col, Form } from 'react-bootstrap'
import { BsPlus } from "react-icons/bs";
import ActionButton from '../../../components/ActionButton';
import CardComponent from '../../../components/CardComponent';
import Modaljs from '../../../components/Modal';

const DealersManagement = () => {
    const [showaddteams, setshowaddteams] = useState(false);
    return (
        <>
            <Col md={12}>
                <CardComponent title={'Dealers Roles Management'} onclick={setshowaddteams} icon={<BsPlus />} tag={'Add'}>
                    <div className='overflow-auto p-2'>
                        <Table className='text-body bg-new Roles'>
                            <thead className='bg-new'>
                                <tr>
                                    {['Sr No.', 'Roles', 'Action'].map((thead) => (
                                        <th key={thead}>{thead}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {['Dealers', 'Energy Company', 'Contractors', 'Super Admin'].map((home) => (
                                    <tr key={home}>
                                        <td>01</td>
                                        <td className='text-truncate'>{home}</td>
                                        <td>
                                            <ActionButton eyelink={'/ViewRolesPermissions'} editOnclick={setshowaddteams} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </CardComponent>
            </Col>
            <Modaljs open={showaddteams} size={'sm'} closebtn={'Cancel'} Savebtn={'Add'} close={() => setshowaddteams(false)} title={"Add New Roles"}>
                <Form.Group as={Col} md={12}>
                    <Form.Label>Roles Type</Form.Label>
                    <Form.Control type='text' />
                </Form.Group>
                <Form.Group as={Col} md={12} className='mt-2'>
                    <Form.Label>Status</Form.Label>
                    <span className='d-flex gap-4'>
                        <Form.Check type="radio" name='status' id='open' label="Activate" checked={true} />
                        <Form.Check type="radio" name='status' id='close' label="De-Actiate" />
                    </span>
                </Form.Group>
            </Modaljs>
        </>
    )
}

export default DealersManagement