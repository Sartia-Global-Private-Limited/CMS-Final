import React from 'react';
import { useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap'
import { BsPencilSquare, BsPlus, BsTrash } from 'react-icons/bs';
import CardComponent from '../CardComponent';
import Modaljs from '../Modal';
import TextareaAutosize from 'react-textarea-autosize';


const Zones = () => {
  const [zoneShow, setZoneShow] = useState(false);
  return (
    <Row className='g-4'>
      <Col md={12}>
        <CardComponent title={'All - Zones'} icon={<BsPlus />} onclick={() => setZoneShow(true)} tag={'Add Zones'}>
          <div className='d-grid gap-4 last-child-none'>
            {[1, 2, 3, 4, 5].map((home) => (
              <div key={home} className='d-align pb-3 justify-content-between hr-border2'>
                <div><strong>North Zone</strong>
                  <p className='my-2 small text-gray'>Lorem Ipsum MANAGEMENT SYSTEM IS WEBBASED APPLICATION AND IT IS DESIGNED TO KEEP TRACK OF COMPLAINTS REGISTERED BY THE COLLEGE DEPARTMENT/LAB STAFFS, SO THIS SYSTEM NEED TO HAVE DISTRIBUTED PLATFORM INDEPENDENT WEB APPLICATION.</p>
                </div>
                <div className='d-align gap-2'>
                  <BsPencilSquare onClick={() => setZoneShow(true)} className='social-btn danger-combo' />
                  <div className="vr hr-shadow"></div>
                  <BsTrash className='social-btn red-combo' />
                </div>
              </div>
            ))}
          </div>
        </CardComponent>
      </Col>

      <Modaljs open={zoneShow} size={'lg'} closebtn={'Cancel'} Savebtn={'ADD'} close={() => setZoneShow(false)} title={"Zone"}>
        <Form.Group className="mb-4">
          <Form.Label>Zone Name</Form.Label>
          <Form.Control type="text" required />
        </Form.Group>
        <Form.Group className="mb-4">
          <Form.Label>Description</Form.Label>
          <TextareaAutosize minRows={2} className='edit-textarea' required />
        </Form.Group>
      </Modaljs>
    </Row>
  )
}

export default Zones