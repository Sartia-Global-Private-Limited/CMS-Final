import React from 'react'
import Tabs, { Tab } from 'react-best-tabs';
import 'react-best-tabs/dist/index.css';
import { Card, Col, Table } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import ActionButton from '../../components/ActionButton';
import Select from 'react-select';

const SiteExpense = () => {
    const tabs = [
        { title: 'Expense', className: 'fw-bold px-0 pe-none' },
        { title: 'Daily Cash', className: 'ms-auto', page: <DailyCash /> },
        { title: 'Site Expense ', className: 'me-1', page: <SiteExpense /> },
    ]

    function DailyCash() {
        return (
            <div className='overflow-auto p-2'>
                <div className='w-100 mb-3 d-align justify-content-end gap-3'>
                    <Select className='text-primary' placeholder='Select Person...' options={[{ value: "aa", label: 'Altaf Ahmad' }, { value: "am", label: 'Ansarul Mandal' }]} />
                </div>
                <Table className='text-body bg-new  Roles'>
                    <thead className='text-truncate'>
                        <tr>
                            {['Sr No.', 'User Name', 'Item', 'Fund Transactions', 'Action'].map((thead) => (
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
        );
    }
    function SiteExpense() {
        return (
            <div className='overflow-auto p-2'>
                <div className='w-100 mb-3 d-align justify-content-end gap-3'>
                    <Select className='text-primary' placeholder='Select Person...' options={[{ value: "aa", label: 'Altaf Ahmad' }, { value: "am", label: 'Ansarul Mandal' }]} />
                </div>
                <Table className='text-body bg-new  Roles'>
                    <thead className='text-truncate'>
                        <tr>
                            {['Sr No.', 'User Name', 'Item', 'Fund Transactions', 'Action'].map((thead) => (
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
        );
    }

    return (
        <>
            <Helmet>
                <title>Expense · CMS Electricals</title>
            </Helmet>
            <Col md={12} data-aos={"fade-up"}>
                <Card className='card-bg'>
                    <Tabs activeTab="2" ulClassName="border-primary py-1 border-bottom" activityClassName="bg-secondary">
                        {tabs.map((tab, idx) => (
                            <Tab key={idx} title={tab.title} className={tab.className}>
                                <div className="p-3">
                                    {tab.page}
                                </div>
                            </Tab>
                        ))}
                    </Tabs>
                </Card>
            </Col>
        </>
    )
}

export default SiteExpense