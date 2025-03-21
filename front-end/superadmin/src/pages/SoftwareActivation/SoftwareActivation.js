import React, { useState } from 'react';
import Tabs, { Tab } from 'react-best-tabs';
import 'react-best-tabs/dist/index.css';
import { Col, Card, } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import PendingRequest from './PendingRequest';
import Approved from './Approved';
import Reject from './Reject';


const SoftwareActivation = () => {
    const [refresh, setRefresh] = useState(false);

    const tabs = [
        { title: 'Software Activation', className: 'fw-bold pe-none' },
        { title: 'Pending Requests', className: 'ms-auto', page: <PendingRequest refresh={refresh} setRefresh={setRefresh} /> },
        { title: 'Approved', page: <Approved refresh={refresh} /> },
        { title: 'Rejected', className: 'me-1', page: <Reject refresh={refresh} /> },
    ]
    return (
        <>
            <Helmet>
                <title>Software Activation · CMS Electricals</title>
            </Helmet>
            <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
                <Card className='card-bg'>
                    <Tabs activeTab="2" ulClassName="border-primary py-2 border-bottom" activityClassName="bg-secondary">
                        {tabs.map((tab, idx) => (
                            <Tab key={idx} title={tab.title} className={tab.className}>
                                <Card.Body className='overflow-auto px-4 mt-3'>
                                    {tab.page}
                                </Card.Body>
                            </Tab>
                        ))}
                    </Tabs>
                </Card>
            </Col>
        </>
    )
}

export default SoftwareActivation