import React from 'react'
import { Col, Table } from 'react-bootstrap'
import { BsPlus } from 'react-icons/bs';
import CardComponent from '../../components/CardComponent'
import ActionButton from '../../components/ActionButton'

const AllContacts = () => {
    return (
        <Col md={12} data-aos={"fade-up"}>
            <CardComponent title={'All Contacts'}>
                <div className='overflow-auto p-2'>
                    <Table className='text-body bg-new Roles'>
                        <thead className='text-truncate'>
                            <tr>
                                {['User Name', 'Zone', 'Regional Office', 'Sales Area', 'User Type', 'Action'].map((thead) => (
                                    <th key={thead}>{thead}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {[1, 2, 3, 4, 5].map((home) => (
                                <tr key={home}>
                                    <td>
                                        <div className='text-truncate'>
                                            <img className='avatar me-2' src='assets/images/default-image.png' alt='user-img' />
                                            Altaf Ahmad
                                        </div>
                                    </td>
                                    <td>Agra</td>
                                    <td>Faridabad</td>
                                    <td>Haryana</td>
                                    <td>Lorem Ipsum</td>
                                    <td>
                                        <ActionButton eyelink={'/ViewContact'} editlink={'/CreateContacts'} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </CardComponent>
        </Col >
    )
}

export default AllContacts