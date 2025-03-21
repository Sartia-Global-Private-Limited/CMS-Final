import React from 'react'
import { Col, Table } from 'react-bootstrap'
import { BsEyeFill, BsPencilSquare, BsPlus } from 'react-icons/bs'
import { useTranslation } from 'react-i18next'
import CardComponent from '../../components/CardComponent'
import TooltipComponent from '../../components/TooltipComponent'
import { Link } from 'react-router-dom'

const Retention = () => {
    const { t } = useTranslation();
    return (
        <Col md={12}>
            <CardComponent title={'Retention'} icon={<BsPlus />} link={'/CreateRetention'} tag={'Create'}>
                <div className='overflow-auto p-2'>
                    <Table className='text-body bg-new Roles'>
                        <thead className='text-truncate'>
                            <tr>
                                {['Invoice', 'Retention Date', 'Retention Amount', 'Action'].map((thead) => (
                                    <th key={thead}>{thead}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {[1, 2, 3, 4, 5].map((home) => (
                                <tr key={home}>
                                    <td>P0{home}60</td>
                                    <td>03/12/2022</td>
                                    <td>43,541.00</td>
                                    <td>
                                        <span className='d-align gap-2'>
                                            <TooltipComponent title={t('View')}>
                                                <a href='https://i.ibb.co/BwcNwLq/self-employed-invoice-template-f393accd90caf6d78643dd776fd524cf.png' target='_blank'><BsEyeFill className='social-btn success-combo' /></a>
                                            </TooltipComponent>
                                            <div className='vr hr-shadow'></div>
                                            <TooltipComponent title={t('Edit')}>
                                                <Link to='/CreateRetention'><BsPencilSquare className='social-btn danger-combo' /></Link>
                                            </TooltipComponent>
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </CardComponent>
        </Col>
    )
}

export default Retention