import React, { useState } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { BsCheck2 } from 'react-icons/bs'

const AddInvoiceTemplates = () => {

    const [Check, setCheck] = useState([1, 2, 3]);
    const toggleClass = (temp) => {
        if (!Check.includes(temp)) {
            setCheck([...Check, temp])
        } else {
            setCheck((prev) => prev.filter(itm => itm !== temp))
        }
        // setCheck(temp);
    };
    return (
        <Col md={12} className='pt-2'>
            <Row className='g-4 row-cols-2 row-cols-md-4'>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((temp, idx) => (
                    <Col key={idx}>
                        <Card className='card-bg p-2 pb-0' onClick={() => toggleClass(temp)}>
                            <Card.Img variant="top" src="https://i.ibb.co/BwcNwLq/self-employed-invoice-template-f393accd90caf6d78643dd776fd524cf.png" />
                            <Card.Body className='text-center p-2'>
                                <a className='text-secondary small text-decoration-none' href='https://i.ibb.co/BwcNwLq/self-employed-invoice-template-f393accd90caf6d78643dd776fd524cf.png' target='_blank'>PI #{temp}</a>
                                {Check.includes(temp) ? <span className="position-absolute text-white mt-1 top-0 fs-6 start-100 translate-middle p-1 rounded-circle d-align bg-secondary"><BsCheck2 /></span> : null}
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Col>
    )
}

export default AddInvoiceTemplates