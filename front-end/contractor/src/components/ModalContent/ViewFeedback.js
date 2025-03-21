import React from 'react';
import { Col, Card } from 'react-bootstrap'

const ViewFeedback = () => {
    return (
        <>
            <Col md={12}>
                <Card className='card-bg'>
                    <Card.Body className='d-grid gap-4 last-child-none'>
                        {[1, 2, 3, 4, 5].map((home) => (
                            <div key={home} className='hr-border2'>
                                <span className='d-align small gap-2 float-end'>
                                    01/12/2022
                                    <div className="vr hr-shadow"></div>
                                    11:32 AM
                                </span>
                                <p className='mb-2'><img className='avatar me-2' src='https://cdn0.iconfinder.com/data/icons/basic-11/97/34-512.png' alt='user-img' />
                                    <strong>Altaf Ahmad </strong>(lorem ipsum)</p>
                                <p className='mb-4 t-align'>THE COMPLAINT MANAGEMENT SYSTEM IS WEBBASED APPLICATION AND IT IS DESIGNED TO KEEP TRACK OF COMPLAINTS REGISTERED BY THE COLLEGE DEPARTMENT/LAB STAFFS, SO THIS SYSTEM NEED TO HAVE DISTRIBUTED PLATFORM INDEPENDENT WEB APPLICATION.</p>
                            </div>
                        ))}
                    </Card.Body>
                </Card>
            </Col>
        </>
    )
}

export default ViewFeedback