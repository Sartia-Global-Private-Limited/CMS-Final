import React from 'react'
import { useState } from 'react'
import { Col, Table } from 'react-bootstrap'
import { BsDownload } from 'react-icons/bs'
import ActionButton from '../ActionButton'
import Modaljs from '../Modal'
import TooltipComponent from '../TooltipComponent'
import ViewInvoice from './ViewInvoice'

const BillingsList = () => {
    const [viewShow, setViewShow] = useState(false);
    return (
        <Col md={12} data-aos={"fade-up"}>
            <div className='overflow-auto p-2'>
                <Table className='text-body bg-new Roles'>
                    <thead className='text-truncate'>
                        <tr>
                            {['Id', 'User Name', 'Issued Date', 'Total', 'Balance', 'Action'].map((thead) => (
                                <th key={thead}>{thead}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {[1, 2, 3, 4, 5].map((home) => (
                            <tr key={home}>
                                <td>#00{home}</td>
                                <td>
                                    <div className='text-truncate'>
                                        <img className='avatar me-2' src='assets/images/default-image.png' alt='user-img' />
                                        Altaf Ahmad
                                    </div>
                                </td>
                                <td>24/11/2022</td>
                                <td>₹5647.48</td>
                                <td>- ₹5647.48</td>
                                <td><ActionButton eyeOnclick={setViewShow} custom={<><div className="vr hr-shadow"></div><TooltipComponent title={'Download'}><BsDownload className='social-btn' /></TooltipComponent></>} /></td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            <Modaljs open={viewShow} size={'lg'} closebtn={'Cancel'} Savebtn={'OK'} close={() => setViewShow(false)} title={"View Invoice"}>
                <ViewInvoice />
            </Modaljs>
        </Col>
    )
}

export default BillingsList