import React, { useEffect, useState } from 'react'
import CardComponent from '../../components/CardComponent'
import { Col } from 'react-bootstrap'
import { useParams } from 'react-router-dom';
import { getAdminSingleTermConditions } from '../../services/authapi';

const ViewTermConditions = () => {
    const { id } = useParams();
    const [data, setData] = useState({})

    const fetchSingleData = async () => {
        const res = await getAdminSingleTermConditions(id)
        if (res.status) {
            setData(res.data)
        } else {
            setData({})
        }
    }

    useEffect(() => {
        fetchSingleData();
    }, [])

    return (
        <Col md={12}>
            <CardComponent title={`View ${data.title}`}>
                <div dangerouslySetInnerHTML={{ __html: data.content }} />
            </CardComponent>
        </Col>
    )
}

export default ViewTermConditions