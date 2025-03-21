import React from 'react'
import { Card, Col, Container, Form, Row } from 'react-bootstrap'

const CreateRoles = () => {
    return (
        <Container fluid>
            <Row className='g-4'>
                <Col>
                    <div>
                        <Form.Label className='fw-bold'>ROLES NAME</Form.Label>
                        <Form.Control type="text" placeholder="ROLE NAME" required/>
                    </div>
                </Col>
                <Col md={12}>
                    <Card.Body className='bg-new-re p-3'>
                        {[1, 2, 3, 4, 5, 1, 2, 3, 4, 5].map((roles) => (
                            <div key={roles}><Form.Check className='mb-3' type="checkbox" id={roles} label="At vero eos et accusamus et iusto odio dignissimos ducimus" required/></div>
                        ))}
                    </Card.Body>
                </Col>
            </Row>
        </Container>
    )
}

export default CreateRoles