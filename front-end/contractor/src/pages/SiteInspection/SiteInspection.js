import React from 'react'
import { Col, Table } from 'react-bootstrap'
import { Helmet } from 'react-helmet'
import { BsCheckLg, BsXLg } from 'react-icons/bs'
import CardComponent from '../../components/CardComponent'
import TooltipComponent from '../../components/TooltipComponent'

const SiteInspection = () => {
    return (
        <>
            <Helmet>
                <title>Site Inspection · CMS Electricals</title>
            </Helmet>
            <Col md={12} data-aos={"fade-up"}>
                <CardComponent title={'Site Inspection'}>
                    <div className='overflow-auto p-2'>
                        <Table className='text-body bg-new  Roles'>
                            <thead className='text-truncate'>
                                <tr>
                                    {['Sr No.', 'User Name', 'Item', 'Fund Transactions', 'Reject / Approve'].map((thead) => (
                                        <th key={thead}>{thead}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {[1, 2, 3, 4, 5].map((home) => (
                                    <tr key={home}>
                                        <td>87C{home}A{home}</td>
                                        <td>
                                            <div className='text-truncate'>
                                                <img className='avatar me-2' src='https://cdn0.iconfinder.com/data/icons/basic-11/97/34-512.png' alt='user-img' />
                                                Altaf Ahmad
                                            </div>
                                        </td>
                                        <td>
                                            <div className='text-truncate2 line-clamp-2'>Lorem Ipsum is simply dummy text.</div>
                                        </td>
                                        <td>
                                            <div className='text-truncate2 line-clamp-2'>Lorem Ipsum is simply dummy text. ₹30,240.52</div>
                                        </td>
                                        <td>
                                            <span className='d-align gap-2'>
                                                <TooltipComponent title={'Reject'}>
                                                    <span className='social-btn-re d-align gap-2 px-3 w-auto red-combo'><BsXLg /></span>
                                                </TooltipComponent>
                                                <div className="vr hr-shadow"></div>
                                                <TooltipComponent title={'Approve'}>
                                                    <span className='social-btn-re d-align gap-2 px-3 w-auto success-combo'><BsCheckLg /></span>
                                                </TooltipComponent>
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </CardComponent>
            </Col >
        </>
    )
}

export default SiteInspection