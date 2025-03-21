import React, { useState } from 'react'
import { Col, Table } from 'react-bootstrap'
import { BsPlus } from "react-icons/bs";
import ActionButton from '../../components/ActionButton';
import CardComponent from '../../components/CardComponent';
import Modaljs from '../../components/Modal';
import AddTeams from '../../components/ModalContent/AddTeams';
import Switch from '../../components/Switch';

const Users = () => {
    const [showaddteams, setshowaddteams] = useState(false);
    return (
        <>
            <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
                <CardComponent title={'Users'} onclick={setshowaddteams} icon={<BsPlus />} tag={'Add'}>
                    <div className='overflow-auto p-2'>
                        <Table className='text-body bg-new Roles'>
                            <thead className='bg-new'>
                                <tr>
                                    {['Sr No.', 'User Name', 'Status', 'Action'].map((thead) => (
                                        <th key={thead}>{thead}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {[1, 2, 3, 4].map((home) => (
                                    <tr key={home}>
                                        <td>{home}</td>
                                        <td className='text-truncate'>Altaf</td>
                                        <td><div><Switch /></div></td>
                                        <td>
                                            <ActionButton editOnclick={setshowaddteams} eyeOnclick={setshowaddteams} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </CardComponent>
            </Col>
            <Modaljs open={showaddteams} size={'md'} closebtn={'Cancel'} Savebtn={'Add'} close={() => setshowaddteams(false)} title={"Add New User"}>
                <AddTeams />
            </Modaljs>
        </>
    )
}

export default Users