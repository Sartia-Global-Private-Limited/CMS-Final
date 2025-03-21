import React from 'react'
import { Col, Form, Table } from 'react-bootstrap'
import { Helmet } from 'react-helmet'
import { BsEyeFill } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import CardComponent from '../../../components/CardComponent'
import TooltipComponent from '../../../components/TooltipComponent'

const TimeSheet = () => {

    return (
        <Col md={12} data-aos={"fade-up"}>
            <Helmet>
                <title>Time Sheet · CMS Electricals</title>
            </Helmet>
            <CardComponent title={'Time Sheet'} custom={<div><Form.Control className='ms-4' type="date" /></div>}>
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
                                            <img className='avatar me-2' src='assets/images/default-image.png' alt='user-img' />
                                            Altaf Ahmad
                                        </div>
                                    </td>
                                    <td>02/10/2023</td>
                                    <td>Friday</td>
                                    <td>10:00:12 AM</td>
                                    <td>06:30:00 PM</td>
                                    <td>08:45:30</td>
                                    <td>
                                        <TooltipComponent title={'View Details'}>
                                            <Link to='/UserProfile'><BsEyeFill className='social-btn success-combo' /></Link>
                                        </TooltipComponent>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </CardComponent>
        </Col>
    )
}

export default TimeSheet