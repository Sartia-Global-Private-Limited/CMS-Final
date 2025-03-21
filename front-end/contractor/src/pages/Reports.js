import React, { useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { Helmet } from 'react-helmet';
import { BsCardChecklist } from "react-icons/bs";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight } from "react-icons/fa";
import CardComponent from '../components/CardComponent';
import 'simplebar-react/dist/simplebar.min.css';
import { useTranslation } from 'react-i18next';
import DualListBox from 'react-dual-listbox';
import 'react-dual-listbox/lib/react-dual-listbox.css';

const Reports = () => {
    const { t } = useTranslation();
    const options = [
        { value: 'one', label: 'Option One' },
        { value: 'two', label: 'Option Two' },
    ];
    const [selected, setSelected] = useState([]);
    return (
        <Col md={12} data-aos={"fade-up"}>
            <Helmet>
                <title>Reports · CMS Electricals</title>
            </Helmet>
            <CardComponent title={'Reports'}>
                <Row className='g-4'>
                    <Col md={12}>
                        <DualListBox
                            options={options}
                            selected={selected}
                            onChange={(selected) => setSelected(selected)}
                            icons={{
                                moveLeft: <FaAngleLeft className='social-btn-re d-align w-auto danger-combo' />,
                                moveAllLeft: [
                                    <FaAngleDoubleLeft key={0} />,
                                ],
                                moveRight: <FaAngleRight className='social-btn-re d-align w-auto success-combo' />,
                                moveAllRight: [
                                    <FaAngleDoubleRight key={1} />
                                ],
                            }}
                        />
                    </Col>
                    <Col md={3} className='ms-auto'>
                        <div className='social-btn purple-combo w-auto gap-2 d-align'><BsCardChecklist className='fs-5' /> {t('Generate Reports')}</div>
                    </Col>
                </Row>
            </CardComponent>
        </Col>
    )
}

export default Reports