import React, { useState } from 'react'
import { Col, Table } from 'react-bootstrap'
import { BsPlus } from 'react-icons/bs'
import ActionButton from '../../components/ActionButton'
import CardComponent from '../../components/CardComponent'
import Modaljs from '../../components/Modal'
import AddDesignation from '../../components/ModalContent/HRManagement/AddDesignation'
import Switch from '../../components/Switch'
import { Helmet } from 'react-helmet'


const DesignationPermissions = () => {
    const [viewCompany, setviewCompany] = useState(false);

    return (
        <Col md={12} data-aos={"fade-up"}>
            <Helmet>
                <title>Designation & Permissions · CMS Electricals</title>
            </Helmet>
            <CardComponent title={'Designation & Permissions'} icon={<BsPlus />} onclick={() => setviewCompany(true)} tag={'Add Designation'}>
                <div className='overflow-auto p-2'>
                    <Table className='text-body bg-new Roles'>
                        <thead className='text-truncate'>
                            <tr>
                                {['Sr No.', 'User Name', 'Title of Designations', 'Permissions'].map((thead) => (
                                    <th key={thead}>{thead}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {[1, 2, 3, 4, 5].map((home) => (
                                <tr key={home}>
                                    <td>{home}</td>
                                    <td>
                                        <div className='text-truncate'>
                                            <img className='avatar me-2' src='assets/images/default-image.png' alt='user-img' />
                                            Altaf Ahmad
                                        </div>
                                    </td>
                                    <td>
                                        <div className='text-truncate2 line-clamp-2'>Lorem Ipsum is simply dummy text.</div>
                                    </td>
                                    <td>
                                        <ActionButton />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </CardComponent>

            <Modaljs open={viewCompany} size={'md'} closebtn={'Cancel'} Savebtn={'Submit'} close={() => setviewCompany(false)} title={"Add Designations & Permissions"}>
                <AddDesignation />
            </Modaljs>
        </Col>
    )
}

export default DesignationPermissions