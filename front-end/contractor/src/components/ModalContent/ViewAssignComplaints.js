import React from 'react'
import { Card, Col } from 'react-bootstrap'
import { BsLightningCharge } from 'react-icons/bs'

const ViewAssignComplaints = () => {
    return (
        <Col md={12}>
            <Card className='card-bg'>
                <Card.Body className='d-grid gap-4 last-child-none'>
                    {[1, 2, 3, 4, 5].map((home) => (
                        <div key={home} className='hr-border2'>
                            <span className='d-align gap-2 float-end'>
                                <span className='text-green'><BsLightningCharge /> Approved</span> <div className="vr hr-shadow"></div> 02/14/2023
                            </span>
                            <p className='mb-1'>Regional Office Selection : <strong>Agra</strong></p>
                            <p className='mb-1'>Sales Area Selection : <strong>Faridabad</strong></p>
                            <p className='mb-1'>Outlet Name : <strong>Lorem Ipsum</strong></p>
                            <p className='mb-1'>District : <strong>Lorem Ipsum</strong></p>
                            <p className='mb-1'>Location : <strong>Lorem Ipsum</strong></p>
                            <p className='mb-1'>Complaint Type : <strong>Pipe Line Test</strong></p>
                            <p className='mb-1'>Order By : <strong>Lorem Ipsum</strong></p>
                            <p className='mb-1'>Contractor Name : <strong>Lorem Ipsum</strong></p>
                            <p className='mb-1'>Approved By : <strong>Energy Company Team</strong></p>
                            <div className='d-grid'>
                                <p className='fw-bold mb-2'>Work</p>
                                <p className='mb-4 text-truncate2 line-clamp-2'>THE COMPLAINT MANAGEMENT SYSTEM IS WEBBASED APPLICATION AND IT IS DESIGNED TO KEEP TRACK OF COMPLAINTS REGISTERED BY THE COLLEGE DEPARTMENT/LAB STAFFS, SO THIS SYSTEM NEED TO HAVE DISTRIBUTED PLATFORM INDEPENDENT WEB APPLICATION.</p>
                            </div>
                            <div className='d-grid'>
                                <p className='fw-bold mb-2'>Remarks</p>
                                <p className='mb-4 text-truncate2 line-clamp-2'>THE COMPLAINT MANAGEMENT SYSTEM IS WEBBASED APPLICATION AND IT IS DESIGNED TO KEEP TRACK OF COMPLAINTS REGISTERED BY THE COLLEGE DEPARTMENT/LAB STAFFS, SO THIS SYSTEM NEED TO HAVE DISTRIBUTED PLATFORM INDEPENDENT WEB APPLICATION.</p>
                            </div>
                        </div>
                    ))}
                </Card.Body>
            </Card>
        </Col>
    )
}

export default ViewAssignComplaints