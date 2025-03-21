import React from 'react'
import Tabs, { Tab } from 'react-best-tabs';
import 'react-best-tabs/dist/index.css';
import { Card, Col, } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import BillingsList from '../components/Billings/BillingsList';
import CreateInvoice from '../components/Billings/CreateInvoice';


const Billings = () => {
    const tabs = [
        { title: 'Billings List', page: <BillingsList /> },
        { title: 'Create Invoice', page: <CreateInvoice /> },
    ]
    return (
        <>
            <Helmet>
                <title>Billings · CMS Electricals</title>
            </Helmet>
            <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
                <Card className='card-bg h-100'>
                    <Card.Body>
                        <Tabs activeTab="1" ulClassName="border-primary border-bottom" activityClassName="bg-secondary">
                            {tabs.map((tab, idx) => (
                                <Tab key={idx} title={tab.title}>
                                    <div className="mt-3">
                                        {tab.page}
                                    </div>
                                </Tab>
                            ))}
                        </Tabs>
                    </Card.Body>
                </Card>
            </Col>
        </>
    )
}

export default Billings