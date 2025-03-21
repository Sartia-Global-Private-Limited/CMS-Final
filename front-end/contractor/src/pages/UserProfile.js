import React from 'react'
import { Card, Col, Form, Row, Table, } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { BsDownload } from 'react-icons/bs';
import CardComponent from '../components/CardComponent'
import TooltipComponent from '../components/TooltipComponent';


const UserProfile = () => {
    const { t } = useTranslation();
    const proinput = [
        {
            id: 1,
            name: "Name",
            value: "Altaf Ahmad",
        },
        {
            id: 2,
            name: "Email",
            value: "ahmad74@gmail.com",
        },
        {
            id: 3,
            name: "Mobile Number",
            value: "(91) 4544 565 456",
        },
    ];

    return (
        <>
            <Helmet>
                <title>User Profile · CMS Electricals</title>
            </Helmet>
            <Col md={12}>
                <Card className="card-bg h-100" data-aos={"fade-up"} data-aos-delay={100}>
                    <Card.Body className='py-2'>
                        <img src="https://cdn0.iconfinder.com/data/icons/basic-11/97/34-512.png" alt="User-Profile" className="img-fluid my-btn" />
                        <span className="ms-2"> {t('profile_name')}</span>
                    </Card.Body>
                </Card>
            </Col>
            <Col md={4}>
                <Card className="card-bg h-100" data-aos={"fade-left"} data-aos-delay={300}>
                    <Card.Body>
                        <div className="d-flex align-items-center justify-content-center">
                            <div className="d-flex flex-column text-center align-items-center justify-content-between ">
                                <div className="fs-italic">
                                    <h5><strong>{t('profile_name')}</strong></h5>
                                    <div className="text-muted-50 mb-3">
                                        <small>Website Designer</small>
                                    </div>
                                </div>
                                <div className="card-profile-progress">
                                    <div className="d-align my-bg p-2 rounded-circle">
                                        <img className="rounded-circle" height={130} width={130} src="https://cdn0.iconfinder.com/data/icons/basic-11/97/34-512.png" alt="User-Profile" />
                                    </div>
                                </div>
                                <div className="mt-3 text-center text-muted-50">
                                    <small>{t('Profile_text')}</small>
                                </div>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
            <Col md={8} data-aos={"fade-right"} data-aos-delay={400}>
                <CardComponent title={t('About User')}>
                    <Row className="g-3">
                        {proinput.map((input, ida) => (
                            <Col key={ida} md={12}>
                                <Form.Label>{input.name}</Form.Label>
                                <Form.Control defaultValue={input.value} disabled />
                            </Col>
                        ))}
                    </Row>
                </CardComponent>
            </Col>
            <Col md={12} data-aos={"fade-bottom"} data-aos-delay={500}>
                <CardComponent title={'View Details'} custom={<div><Form.Control className='ms-4' type="date" /></div>}>
                    <div className='overflow-auto p-2'>
                        <Table className='text-body bg-new Roles'>
                            <thead className='text-truncate'>
                                <tr>
                                    {['Sr No.', 'Employee Name', 'Date', 'Day', 'Clock in', 'Clock Out', 'Work Duration', 'Action'].map((thead) => (
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
                                                <img className='avatar me-2' src='https://cdn0.iconfinder.com/data/icons/basic-11/97/34-512.png' alt='user-img' />
                                                Altaf Ahmad
                                            </div>
                                        </td>
                                        <td>02/10/2023</td>
                                        <td>Friday</td>
                                        <td>10:00:12 AM</td>
                                        <td>06:30:00 PM</td>
                                        <td>08:45:30</td>
                                        <td className='text-green'>
                                            <TooltipComponent title={'excel'}>
                                                <BsDownload className='social-btn success-combo' />
                                            </TooltipComponent>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </CardComponent>
            </Col>
        </>
    )
}

export default UserProfile