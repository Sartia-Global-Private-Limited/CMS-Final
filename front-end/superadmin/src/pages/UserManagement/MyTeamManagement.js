import React, { useState } from 'react'
import { Col, Row, } from 'react-bootstrap'
import { BsHourglassSplit, BsPeopleFill, BsPlus } from 'react-icons/bs'
import ActionButton from '../../components/ActionButton'
import CardComponent from '../../components/CardComponent'
import TooltipComponent from '../../components/TooltipComponent'
import { Link } from 'react-router-dom'
import Modaljs from '../../components/Modal'
import AddTeams from '../../components/ModalContent/AddTeams'

const Team = () => {
  const [showaddteams, setshowaddteams] = useState();
  return (
    <>
      <Col md={12}>
        <CardComponent title={'My Team'} onclick={setshowaddteams} icon={<BsPlus />} tag={'Add'}>
          <Row className='g-4'>
            {[1, 2, 3, 4, 5].map((cards) => (
              <Col md={6} key={cards}>
                <div className="d-lg-flex gap-4 bg-new p-4 position-relative">
                  <div className="col-auto text-center d-lg-grid gap-2">
                    <div className="d-align user-hover">
                      {[1, 2, 3, 4].map((user) => (
                        <TooltipComponent key={user} title={'Altaf Ahmad'}>
                          <Link to='/TeamMembers'><img key={user} className="my-btn" src="assets/images/default-image.png" alt="User-Profile" /></Link>
                        </TooltipComponent>
                      ))}
                      <img onClick={setshowaddteams} className="my-btn zIndex" src="https://i.ibb.co/G79HKsb/6543441.png" alt="User-Profile" />
                    </div>
                    <small className='text-gray'><BsPeopleFill /> 5 Members</small>
                    <ActionButton hideEye={'d-none'} editOnclick={setshowaddteams} />
                  </div>
                  <div className="col ps-lg-3 d-flex flex-column position-relative">
                    <strong className="d-inline-block text-primary">UI/UX Design</strong>
                    <div className="mb-1 small text-gray"><BsHourglassSplit /> 4 Month</div>
                    <p className="mb-0 text-truncate2 line-clamp-3">
                      This is a wider card with supporting text below as a natural lead-in to
                      additional content.This is a wider card with supporting text below as a natural lead-in to
                      additional content.This is a wider card with supporting text below as a natural lead-in to
                      additional content.This is a wider card with supporting text below as a natural lead-in to
                      additional content.
                    </p>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </CardComponent>
        <Modaljs open={showaddteams} size={'md'} closebtn={'Cancel'} Savebtn={'Add'} close={() => setshowaddteams(false)} title={"Add New Team"}>
          <AddTeams />
        </Modaljs>
      </Col>
    </>
  )
}

export default Team