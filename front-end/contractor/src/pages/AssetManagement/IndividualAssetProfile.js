import React, { useState } from 'react'
import { Col, Table } from 'react-bootstrap'
import { BsEyeFill } from 'react-icons/bs'
import CardComponent from '../../components/CardComponent'
import Modaljs from '../../components/Modal'
import AssetProfile from '../../components/ModalContent/AllAssets/AssetProfile'
import TooltipComponent from '../../components/TooltipComponent'

const IndividualAssetProfile = () => {
    const [addShow, setAddTemp] = useState(false);

    return (
        <Col md={12}>
            <CardComponent title={'Individual Asset Profile'}>
                <div className='overflow-auto p-2'>
                    <Table className='text-body bg-new Roles'>
                        <thead className='text-truncate'>
                            <tr>
                                {['Assets Name', 'Asset Model Number', 'Asset Uin', 'Asset Price', 'Asset Purchase Date', 'Asset Warranty / Guarantee Period', 'Current Status', 'Action'].map((thead) => (
                                    <th key={thead}>{thead}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {[1, 2, 3, 4, 5].map((home) => (
                                <tr key={home}>
                                    <td><div className='text-truncate'>Lorem Ipsum</div></td>
                                    <td>P0{home}60</td>
                                    <td>203{home}60</td>
                                    <td>33,322.00</td>
                                    <td>03/12/2022</td>
                                    <td>5 Years</td>
                                    <td><div className='text-truncate'>Lorem Ipsum</div></td>
                                    <td>
                                        <TooltipComponent align={'left'} title={'Details'}>
                                            <BsEyeFill onClick={() => setAddTemp(true)} className='social-btn success-combo' />
                                        </TooltipComponent>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </CardComponent>


            <Modaljs open={addShow} size={'xl'} closebtn={'Cancel'} Savebtn={'Save'} close={() => setAddTemp(false)} title={"Asset Profile"}>
                <AssetProfile />
            </Modaljs>
        </Col>
    )
}

export default IndividualAssetProfile