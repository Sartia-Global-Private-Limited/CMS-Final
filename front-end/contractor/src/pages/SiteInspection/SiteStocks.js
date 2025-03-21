import React from 'react'
import { Col, Table } from 'react-bootstrap'
import { Helmet } from 'react-helmet'
import CardComponent from '../../components/CardComponent'
import ActionButton from '../../components/ActionButton';
import Select from 'react-select';

const SiteStocks = () => {
    return (
        <>
            <Helmet>
                <title>Stocks · CMS Electricals</title>
            </Helmet>
            <Col md={12} data-aos={"fade-up"}>
                <CardComponent title={'Stocks'} custom2={
                    <div className='w-100 d-align justify-content-end gap-3'>
                        <Select className='text-primary' placeholder='Select Person...' options={[{ value: "aa", label: 'Altaf Ahmad' }, { value: "am", label: 'Ansarul Mandal' }]} />
                    </div>
                }>
                    <div className='overflow-auto p-2'>
                        <Table className='text-body bg-new  Roles'>
                            <thead className='text-truncate'>
                                <tr>
                                    {['Sr No.', 'User Name', 'Item', 'Fund Transactions', 'Reject / Approve'].map((thead) => (
                                        <th key={thead}>{thead}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {[1, 2, 3, 4, 5].map((home) => (
                                    <tr key={home}>
                                        <td>87C{home}A{home}</td>
                                        <td>
                                            <div className='text-truncate'>
                                                <img className='avatar me-2' src='https://cdn0.iconfinder.com/data/icons/basic-11/97/34-512.png' alt='user-img' />
                                                Altaf Ahmad
                                            </div>
                                        </td>
                                        <td>
                                            <div className='text-truncate2 line-clamp-2'>Lorem Ipsum is simply dummy text.</div>
                                        </td>
                                        <td>
                                            <div className='text-truncate2 line-clamp-2'>Lorem Ipsum is simply dummy text. ₹30,240.52</div>
                                        </td>
                                        <td><ActionButton hideDelete={'d-none'} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </CardComponent>
            </Col >
        </>
    )
}

export default SiteStocks