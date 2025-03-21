import React from 'react'
import { Col, Table } from 'react-bootstrap'
import CardComponent from '../../components/CardComponent'
import { Helmet } from 'react-helmet'


const MasterOutletManagement = () => {
    return (
        <Col md={12} data-aos={"fade-up"}>
            <Helmet>
                <title>Outlet Management · CMS Electricals</title>
            </Helmet>
            <CardComponent title={'Outlet Management'}>
                <div className='overflow-auto p-2'>
                    <Table className='text-body bg-new Roles'>
                        <thead className='text-truncate'>
                            <tr>
                                {['Sr No.', 'Daily Expense Categories', 'Site Goods Categories', 'Document Categories', 'User Designation', 'Office Designation', 'Task Categories', 'Assets Categories',].map((thead) => (
                                    <th key={thead}>{thead}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {[1, 2, 3, 4, 5].map((home) => (
                                <tr key={home}>
                                    <td>{home}</td>
                                    <td>Lorem Ipsum</td>
                                    <td>Lorem Ipsum</td>
                                    <td>Lorem Ipsum</td>
                                    <td>Lorem Ipsum</td>
                                    <td>Lorem Ipsum</td>
                                    <td>Lorem Ipsum</td>
                                    <td>Lorem Ipsum</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </CardComponent>
        </Col>
    )
}

export default MasterOutletManagement