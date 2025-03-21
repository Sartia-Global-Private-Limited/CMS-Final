import React from 'react'
import Tabs, { Tab } from 'react-best-tabs';
import 'react-best-tabs/dist/index.css';
import { Card, Col, Form, Row } from 'react-bootstrap'
import { BsSearch } from 'react-icons/bs'
import { AiOutlineMergeCells } from "react-icons/ai";
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import { Helmet } from 'react-helmet';


const Tutorials = () => {
  const tabs = [
    { title: 'MERGE INVOICE', className: 'fw-bold pe-none' },
    { title: 'Merge Management', className: 'ms-auto', page: <TutorialsBox /> },
    { title: 'Merge PI', page: <TutorialsBox /> },
    { title: 'Merge Invoice', className: 'me-1', page: <TutorialsBox /> },
  ]

  function TutorialsBox() {
    return (
      <Col md={12}>
        <Row className='g-2'>
          <Col md={12} className='text-end'>
            <div className='shadow d-inline-flex align-items-center justify-content-end mb-3 gap-2 px-4 text-orange'><AiOutlineMergeCells /> Merge</div>
          </Col>
          <Col md={4} className='search-invoice'>
            <Card className='card-bg last-child-none position-sticky top-0'>
              <Card.Body>
                <div className='pb-3'>
                  <span className='position-relative'>
                    <BsSearch className='position-absolute top-50 me-3 end-0 translate-middle-y' />
                    <Form.Control type="search" placeholder="Search Invoice..." className="me-2" />
                  </span>
                </div>
                <SimpleBar className='area px-3'>
                  {Array.from(Array(12)).map((_, index) => (
                    <div key={index} className='d-align py-3 hr-border2 justify-content-between'>
                      <span>
                        Invoice No: #001
                        <small className='d-block'>Date: 7/12/2022</small>
                      </span>
                      <span><input type="checkbox" className="form-check-input m-0" /></span>
                    </div>
                  ))}
                </SimpleBar>
              </Card.Body>
            </Card>
          </Col>
          <Col md={8} className='chat-area'>
            <SimpleBar className='area px-3'>
              <Row className='g-4 row-cols-2 row-cols-md-5'>
                {Array.from(Array(100)).map((_, index) => (
                  <Col key={index}>
                    <Card className='card-bg p-2'>
                      <Card.Img variant="top" src="https://i.ibb.co/BwcNwLq/self-employed-invoice-template-f393accd90caf6d78643dd776fd524cf.png" />
                    </Card>
                  </Col>
                ))}
              </Row>
            </SimpleBar>
          </Col>
        </Row>
      </Col>
    );
  }
  return (
    <>
      <Helmet>
        <title>Tutorials · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <Card className='bg-new-re'>
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

export default Tutorials