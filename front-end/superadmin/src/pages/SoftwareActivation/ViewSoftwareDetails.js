import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Col } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import CardComponent from '../../components/CardComponent'
import { getAdminSingleSoftwareActivation } from '../../services/authapi'
import ImageViewer from '../../components/ImageViewer'

const ViewSoftwareDetails = () => {
    const { id } = useParams()
    const [singledata, setSingledata] = useState([])

    const fetchSingleSoftwareActivationData = async () => {
        const res = await getAdminSingleSoftwareActivation(id)
        if (res.status) {
            setSingledata(res.data)
        } else {
            setSingledata([])
        }
    }

    useEffect(() => {
        if (id) {
            fetchSingleSoftwareActivationData()
        }
    }, [])


    return (
        <Col md={12} className='my-accordion' data-aos={"fade-up"}>
            <CardComponent title={'View Software Details'}>
                <div className="p-2">
                    <div className="shadow after-bg-light">
                        <div className="d-align h-100 p-3 gap-5 justify-content-start">
                            <div className="my-bg p-2 rounded-circle">
                                <ImageViewer src={`${process.env.REACT_APP_API_URL}/${singledata[0]?.image}`}>
                                    <img width={100} height={100} className='border-blue object-fit rounded-circle' src={singledata[0]?.image ?
                                        `${process.env.REACT_APP_API_URL}${singledata[0]?.image}`
                                        : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`} />
                                </ImageViewer>
                            </div>
                            <div className="d-grid w-100 gap-2">
                                <p className="mb-0 fw-bold">
                                    {singledata[0]?.user_name}{" "}
                                    <small className="text-gray fw-lighter">
                                        ({singledata[0]?.name})
                                    </small>
                                    <small className='float-end fw-lighter text-gray'>{moment(singledata[0]?.requested_date).format('DD/MM/YYYY | h:mm:ss a')}</small>
                                </p>
                                {singledata[0]?.remark &&
                                    <small className="text-gray">
                                        Remark - <span className='fw-bold text-dark'>{singledata[0]?.remark}</span>
                                    </small>}
                                {singledata[0]?.module_name &&
                                    <>
                                        <small className="text-gray">Module Name - </small>
                                        <ol className='ps-3 d-grid gap-1'>
                                            <li className='shadow fw-bolder px-1'>{singledata[0]?.module_name}</li>
                                            {singledata[0]?.sub_module?.map((subModule, index) => {
                                                return <ul className='d-grid gap-1'>
                                                    <li key={index} className='shadow fw-bolder px-1'>{subModule?.title}</li>
                                                </ul>
                                            })}
                                        </ol>
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </CardComponent>
        </Col>
    )
}

export default ViewSoftwareDetails