import React from 'react'
import { Col, Row } from 'react-bootstrap'
import CardComponent from '../../components/CardComponent'
import { Helmet } from 'react-helmet'
import { BsTelephoneOutbound } from 'react-icons/bs'


const TeamMembers = () => {
    return (
        <Col md={12} data-aos={"fade-up"}>
            <Helmet>
                <title>Team Members · CMS Electricals</title>
            </Helmet>
            <CardComponent title={'Team Members'}>
                <Row className='g-4'>
                    {[1, 2, 3, 4, 5, 1, 2, 3, 4, 5].map((cards) => (
                        <Col md={3} key={cards}>
                            <div className="bg-new p-3 d-grid gap-2 text-center position-relative">
                                <img className="my-bg p-2 mx-auto rounded-circle" width={100} src="https://i.ibb.co/7Qmnbgz/2115951.png" alt="User-Profile" />
                                <strong className="text-primary">Lorem Ipsum</strong>
                                <a className="small text-decoration-none d-block text-secondary" href={`tel:${'91+ 12345-56478'}`}>
                                    <BsTelephoneOutbound /> {'91+ 12345-56478'}
                                </a>
                                <a href={`mailto:${'LoremIpsum24@gmail.com'}`} className="small text-decoration-none text-gray">
                                    {'LoremIpsum24@gmail.com'}
                                </a>
                            </div>
                        </Col>
                    ))}
                </Row>
            </CardComponent>
        </Col >
    )
}

export default TeamMembers