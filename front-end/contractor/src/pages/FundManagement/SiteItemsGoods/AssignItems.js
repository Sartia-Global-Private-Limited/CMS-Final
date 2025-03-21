import React from 'react'
import Tabs, { Tab } from 'react-best-tabs';
import 'react-best-tabs/dist/index.css';
import { Card, Col, Form, Table, } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { BsCheckLg, BsArrowLeftRight } from 'react-icons/bs';
import FormSelect from '../../../components/FormSelect';
import TooltipComponent from '../../../components/TooltipComponent';


const AssignItems = () => {
    const tabs = [
        { title: 'Assign Items', className: 'fw-bold pe-none' },
        { title: 'Sub-User', className: 'ms-auto', page: <SubUser /> },
        { title: 'Assigned-User', page: <AssignedUser /> },
    ]

    function SubUser() {
        return (
            <div className='overflow-auto p-2'>
                <Table className='text-body bg-new Roles'>
                    <thead className='text-truncate'>
                        <tr>
                            {[<Form.Check type="checkbox" className='mb-0' />, 'Item', 'Item Name', 'Assigned Date', 'Status', 'Description', 'Transfer it to Someone'].map((thead) => (
                                <th key={thead}>{thead}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {[1, 2, 3, 4, 5].map((home) => (
                            <tr key={home}>
                                <td><Form.Check type="checkbox" className='mb-0' /></td>
                                <td><img width={50} className='my-bg p-1 rounded' src='https://i.ibb.co/vYg8PDG/png-clipart-texmo-pipes-and-products-plastic-pipework-piping-and-plumbing-fitting-drip-irrigation-st.png' alt='user-img' /></td>
                                <td>
                                    <div className='text-truncate2 line-clamp-2'>Lorem Ipsum</div>
                                </td>
                                <td>14/12/2023 | 01:35 PM</td>
                                <td><FormSelect option={['Consumed ', 'inposition']} className={'d-none'} /></td>
                                <td><div className='text-truncate2 line-clamp-2'>The Standard Lorem Ipsum Passage</div></td>
                                <td>
                                    <span className='d-align gap-2'>
                                        <TooltipComponent title={'Transfer'}>
                                            <span className='social-btn-re d-align gap-2 px-3 w-auto red-combo'><BsArrowLeftRight /></span>
                                        </TooltipComponent>
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        );
    }
    function AssignedUser() {
        return (
            <div className='overflow-auto p-2'>
                <Table className='text-body bg-new Roles'>
                    <thead className='text-truncate'>
                        <tr>
                            {['Item', 'Item Name', 'Assigned Date', 'Description', 'Transfer it to Someone'].map((thead) => (
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
                                <td>
                                    <span className='d-align gap-2'>
                                        <TooltipComponent title={'Assign Items'}>
                                            <span className='social-btn-re d-align gap-2 px-3 w-auto success-combo'><BsCheckLg /></span>
                                        </TooltipComponent>
                                    </span>
                                </td>
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
                <title>Assign Items · CMS Electricals</title>
            </Helmet>
            <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
                <Card className='card-bg'>
                    <Card.Body>
                        <Tabs activeTab="2" ulClassName="border-primary border-bottom" activityClassName="bg-secondary">
                            {tabs.map((tab, idx) => (
                                <Tab key={idx} title={tab.title} className={tab.className}>
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

export default AssignItems