import React from 'react'
import { useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { BsPlus } from 'react-icons/bs'
import ActionButton from '../ActionButton'
import CardComponent from '../CardComponent'
import Modaljs from '../Modal'
import AddEnergyCompany from '../ModalContent/AddEnergyCompany'

const EnergyCompany = () => {
  const [energyShow, setEnergyShow] = useState(false);
  return (
    <Row>
      <Col md={8}>
        <CardComponent title={'Energy Company'} icon={<BsPlus />} onclick={() => setEnergyShow(true)} tag={'Add Company'}>
          <div className='d-grid gap-4'>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((ida) => (
              <div key={ida} className="hstack gap-2">
                <div className='social-btn px-3 w-100 lh-1 text-truncate'>Biomass Energy</div>
                <ActionButton editOnclick={setEnergyShow} eyeOnclick={setEnergyShow} />
              </div>
            ))}
          </div>
        </CardComponent>
      </Col>
      <Col md={4}>
        <Row className='g-4 position-sticky top-0'>
          <Col md={12}>
            <CardComponent title={'Zones'}>
              <div className='d-grid gap-2 last-child-none'>
                {['North Zone', 'South Zone', 'East Zone', 'West Zone', 'central Zone', 'North East Zone'].map((zone) => (
                  <>
                    <p className='mb-0 text-truncate'>{zone}</p>
                    <div className='hr-border2' />
                  </>
                ))}
              </div>
            </CardComponent>
          </Col>
          <Col md={12}>
            <CardComponent title={'Regional Offices - North Zone'}>
              <div className='d-grid gap-2 last-child-none'>
                {['Ajmer', 'gandhi nagar', 'dehradun'].map((office) => (
                  <>
                    <p className='mb-0 text-truncate'>{office}</p>
                    <div className='hr-border2' />
                  </>
                ))}
              </div>
            </CardComponent>
          </Col>
        </Row>
      </Col>


      <Modaljs open={energyShow} size={'xl'} closebtn={'Cancel'} Savebtn={'ADD'} close={() => setEnergyShow(false)} title={"Add New Energy Company"}>
        <AddEnergyCompany />
      </Modaljs>
    </Row>
  )
}

export default EnergyCompany