import React from 'react';
import { useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap'
import { BsPencilSquare, BsPlus, BsTrash } from 'react-icons/bs';
import CardComponent from '../CardComponent';
import Modaljs from '../Modal';


const SalesArea = () => {
  const [salesShow, setSalesShow] = useState(false);
  return (
    <Row className='g-4'>
      <Col md={12}>
        <CardComponent title={'All - Sales Area'} icon={<BsPlus />} onclick={() => setSalesShow(true)} tag={'Add Sales Area'}>
          <div className='d-grid gap-4 last-child-none'>
            {[1, 2, 3, 4, 5].map((home) => (
              <div key={home} className='d-align pb-3 justify-content-between hr-border2'>
                <div><strong>North Zone</strong>
                  <p className='my-2 small text-gray'>Lorem Ipsum MANAGEMENT SYSTEM IS WEBBASED APPLICATION AND IT IS DESIGNED TO KEEP TRACK OF COMPLAINTS REGISTERED BY THE COLLEGE DEPARTMENT/LAB STAFFS, SO THIS SYSTEM NEED TO HAVE DISTRIBUTED PLATFORM INDEPENDENT WEB APPLICATION.</p>
                </div>
                <div className='d-align gap-2'>
                  <BsPencilSquare onClick={() => setSalesShow(true)} className='social-btn danger-combo' />
                  <div className="vr hr-shadow"></div>
                  <BsTrash className='social-btn red-combo' />
                </div>
              </div>
            ))}
          </div>
        </CardComponent>
      </Col>

      <Modaljs open={salesShow} size={'lg'} closebtn={'Cancel'} Savebtn={'ADD'} close={() => setSalesShow(false)} title={"Add Sales Area"}>
        <Form.Group className="mb-4">
          <Form.Label>Select Zone</Form.Label>
          <Form.Select>
            <option value="1">North Zone</option>
            <option value="2">South Zone</option>
            <option value="3">East Zone</option>
            <option value="3">West Zone</option>
            <option value="3">central Zone</option>
            <option value="3">North East Zone</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-4">
          <Form.Label>Select Regional Office</Form.Label>
          <Form.Select>
            <option value="1">Ajmer</option>
            <option value="2">Gandhi Nagar</option>
            <option value="3">Dehradun</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-4">
          <Form.Label>Add Sales Area</Form.Label>
          <Form.Control type="text" required />
        </Form.Group>
      </Modaljs>
    </Row>
  )
}

export default SalesArea