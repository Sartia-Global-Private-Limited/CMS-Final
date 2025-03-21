import React, { useState } from 'react'
import { Col, Form, NavDropdown, NavLink, Row } from 'react-bootstrap'
import { BsPlusCircleFill, BsWindow } from 'react-icons/bs'
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import Modaljs from './Modal';

const CreateNewDashboard = () => {
    const [viewShow, setViewShow] = useState(false);
    const [active, setActive] = useState(true);
    const handleClick = (event) => {
        setActive(event.target.id);
    }
    return (
        <NavDropdown className='my-Dropdown-start me-auto' title={<div className='d-align'><span className='my-btn d-align'><BsWindow /></span></div>} align="start">
            <div className='position-realtive'>
                <SimpleBar>
                    {[1, 2, 3, 4].map((noti) => (
                        <NavLink key={noti} className='py-2 bg-transparent dropdown-item hr-border2'>
                            <div className='d-align justify-content-between'>
                                <span><BsWindow /></span>
                                <span className='ps-2 d-grid'><div className='text-truncate'>Default Dashboard</div></span>
                            </div>
                        </NavLink>
                    ))}
                </SimpleBar>
                <div className='p-4 d-align'>
                    <NavLink onClick={() => setViewShow(true)} className='dropdown-item rounded-bottom bottom-0 active position-absolute'><BsPlusCircleFill /> Add New Dashboard</NavLink>
                </div>
            </div>

            <Modaljs open={viewShow} size={'lg'} closebtn={'Cancel'} Savebtn={'Save'} close={() => setViewShow(false)} title={"Add New Dashboard"}>
                <Form>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm={3}>
                            Title
                        </Form.Label>
                        <Col sm={9}>
                            <Form.Control type="text" />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm={3}>
                            Select Color
                        </Form.Label>
                        <Col sm={9}>
                            <div className='d-align hover-color h-100 justify-content-between gap-2'>
                                {['primary', 'pink', 'red', 'orange', 'secondary', 'success', 'chocolate', 'danger', 'warning', 'pink-light', 'info', 'light',
                                ].map((color, idx) => (
                                    <span key={idx} onClick={handleClick} id={idx} className={`p-2 my-bg-shadow bg-${color} ${active === `${idx}` ? 'active' : null}`} />
                                ))}
                            </div>
                        </Col>
                    </Form.Group>
                </Form>
            </Modaljs>
        </NavDropdown>
    )
}

export default CreateNewDashboard