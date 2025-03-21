import React from 'react';
import { useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap'
import { BsPencilSquare, BsPlus, BsTrash } from 'react-icons/bs';
import CardComponent from '../CardComponent';
import Modaljs from '../Modal';


const EnergyCompanyTeam = () => {
  const [teamShow, setTeamShow] = useState(false);
  return (
    <Row className='g-4'>
      <Col md={12}>
        <CardComponent title={'All - Energy Company Teams'} icon={<BsPlus />} onclick={() => setTeamShow(true)} tag={'Add Energy Company Teams'}>
          <div className='d-grid gap-4 last-child-none'>
            {[1, 2, 3, 4, 5].map((home) => (
              <div key={home} className='d-align pb-3 justify-content-between hr-border2'>
                <div>
                  <p className='mb-2'><strong>Name</strong> : Lorem Ipsun</p>
                  <p className='mb-0'><strong>Company</strong> : Lorem Ipsun</p>
                </div>
                <div className='d-align gap-2'>
                  <BsPencilSquare onClick={() => setTeamShow(true)} className='social-btn danger-combo' />
                  <div className="vr hr-shadow"></div>
                  <BsTrash className='social-btn red-combo' />
                </div>
              </div>
            ))}
          </div>
        </CardComponent>
      </Col>

      <Modaljs open={teamShow} size={'lg'} closebtn={'Cancel'} Savebtn={'ADD'} close={() => setTeamShow(false)} title={"Add Energy Company Teams"}>
        <Form.Group className="mb-4">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" required />
        </Form.Group>
        <Form.Group className="mb-4">
          <Form.Label>Select Energy Company</Form.Label>
          <Form.Select>
            <option value="1">demo 1</option>
            <option value="2">demo 1</option>
            <option value="3">demo 1</option>
          </Form.Select>
        </Form.Group>
      </Modaljs>
    </Row>
  )
}

export default EnergyCompanyTeam