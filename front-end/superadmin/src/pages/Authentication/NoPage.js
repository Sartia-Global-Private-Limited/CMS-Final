import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'

const NoPage = () => {
  return (
    <section className='bg-login overflow-hidden'>
      <Helmet>
        <title>404 · CMS Electricals</title>
      </Helmet>
      <Container>
        <Row className='vh-100 text-center d-align'>
          <Col md={12} data-aos="flip-left" data-aos-easing="ease-out-cubic" data-aos-duration="1000">
            <img src='https://i.ibb.co/cYQ6y7L/error.png' alt='404' className='shape1 bg-new2 img-fluid p-4' />
            <h3 className='fw-bold text-gray'>Error Page Not Found</h3>
          </Col>
          <Link to="/" className='fw-bold text-gray text-decoration-none'><img style={{ transform: 'rotate(90deg)' }} className='me-2' width={25} src='https://www.heromotocorp.com/content/dam/hero-aem-website/in/products/sports-adventure/xpulse200-4v/scroll-down-arrow.gif' alt='go back' /> Go Back</Link>
        </Row>
      </Container>
    </section>
  )
}

export default NoPage