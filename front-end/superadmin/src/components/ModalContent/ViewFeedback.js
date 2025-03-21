import React from 'react';
import { Col, Card, Form, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';
import CardComponent from '../CardComponent';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

const ViewFeedback = () => {
    const { t } = useTranslation();
    return (
        <>
            <Col md={12}>
                <CardComponent className={'position-relative feedback-area'} title={'View Feedback & Suggestions'}>
                    <SimpleBar className='area pe-3 d-grid last-child-none'>
                        {[1, 2, 3, 4, 5].map((home) => (
                            <div key={home} className='hr-border2 py-2'>
                                <span className='d-align small gap-2 float-end'>
                                    01/12/2022
                                    <div className="vr hr-shadow"></div>
                                    11:32 AM
                                </span>
                                <p className='mb-2'><img className='avatar me-2' src='assets/images/default-image.png' alt='user-img' />
                                    <strong>Altaf Ahmad </strong>(lorem ipsum)</p>
                                <p className='mb-0 t-align'>THE COMPLAINT MANAGEMENT SYSTEM IS WEBBASED APPLICATION AND IT IS DESIGNED TO KEEP TRACK OF COMPLAINTS REGISTERED BY THE COLLEGE DEPARTMENT/LAB STAFFS, SO THIS SYSTEM NEED TO HAVE DISTRIBUTED PLATFORM INDEPENDENT WEB APPLICATION.</p>
                            </div>
                        ))}
                    </SimpleBar>
                    <Card.Footer className="table-bg d-align py-1 mt-2 gap-2">
                        <Form.Control size="lg" type="text" placeholder="Type your comments..." />
                        <Button variant="primary" type="Submit" className="bg-new text-uppercase text-secondary">{t('Update')}</Button>
                    </Card.Footer>
                </CardComponent>
            </Col>
        </>
    )
}

export default ViewFeedback