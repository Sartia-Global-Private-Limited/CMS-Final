import React from 'react'
import { Col, Table } from 'react-bootstrap'
import { Helmet } from 'react-helmet'
import CardComponent from '../../../components/CardComponent'

const CompanyItemStock = () => {
    return (
        <Col md={12} data-aos={"fade-up"}>
            <Helmet>
                <title>Company Item / Stock · CMS Electricals</title>
            </Helmet>
            <CardComponent title={'Company Item / Stock List'}>
                <div className='overflow-auto p-2'>
                    <Table className='text-body bg-new Roles'>
                        <thead className='text-truncate'>
                            <tr>
                                {['Item', 'Item Name', 'Date', 'Description'].map((thead) => (
                                    <th key={thead}>{thead}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {[1, 2, 3, 4, 5].map((home) => (
                                <tr key={home}>
                                    <td><img width={50} className='my-bg p-1 rounded' src='https://i.ibb.co/vYg8PDG/png-clipart-texmo-pipes-and-products-plastic-pipework-piping-and-plumbing-fitting-drip-irrigation-st.png' alt='user-img' /></td>
                                    <td>
                                        <div className='text-truncate2 line-clamp-2'>Lorem Ipsum</div>
                                    </td>
                                    <td>14/12/2023 | 01:35 PM</td>
                                    <td><div className='text-truncate2 line-clamp-2'>The Standard Lorem Ipsum Passage</div></td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </CardComponent>
        </Col>
    )
}

export default CompanyItemStock