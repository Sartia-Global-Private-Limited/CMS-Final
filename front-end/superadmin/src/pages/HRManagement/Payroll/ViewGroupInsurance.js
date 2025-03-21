import React, { useEffect, useState } from 'react'
import { Col, Form, Row } from 'react-bootstrap'
import { Helmet } from 'react-helmet'
import CardComponent from '../../../components/CardComponent'
import { getAllDetailsInsuranceCompanyPlans, getSingleDetailsGroupInsurance } from '../../../services/authapi'
import moment from 'moment'
import { useParams } from 'react-router-dom'

const ViewGroupInsurance = () => {
    const { id } = useParams();
    const [edit, setEdit] = useState({})
    const [detailsInsurancePlans, setDetailsInsurancePlans] = useState([])

    const fetchSingleData = async () => {
        const res = await getSingleDetailsGroupInsurance(id);
        if (res.status) {
            setEdit(res.data);
            fetchDetailsInsurancePlansData(res.data.insurance_plan_id)
        } else {
            setEdit({});
        }
    }

    const fetchDetailsInsurancePlansData = async (insurance_plan_id) => {
        const res = await getAllDetailsInsuranceCompanyPlans(insurance_plan_id);
        if (res.status) {
            setDetailsInsurancePlans(res.data)
        } else {
            setDetailsInsurancePlans([])
        }
    }

    const singleoutletsList = [
        { id: 1, col: 12, title: 'Insurance Company', value: detailsInsurancePlans?.company_name ? detailsInsurancePlans?.company_name : "" },
        { id: 11, col: 12, title: 'Policy Name', value: detailsInsurancePlans?.policy_name ? detailsInsurancePlans?.policy_name : "" },
        { id: 3, col: 12, title: 'Policy Type', value: detailsInsurancePlans?.policy_type ? detailsInsurancePlans?.policy_type : "" },
        { id: 4, col: 6, title: 'Policy Start Date', value: detailsInsurancePlans?.policy_start_date ? moment(detailsInsurancePlans?.policy_start_date).format('YYYY-MM-DD') : "" },
        { id: 5, col: 6, title: 'Policy End Date', value: detailsInsurancePlans?.policy_end_date ? moment(detailsInsurancePlans?.policy_end_date).format('YYYY-MM-DD') : "" },
        { id: 6, col: 6, title: 'Policy Premium Amount', value: detailsInsurancePlans?.policy_premium_amount ? detailsInsurancePlans?.policy_premium_amount : "" },
        { id: 7, col: 6, title: 'Policy Coverage Limits', value: detailsInsurancePlans?.policy_coverage_limits ? detailsInsurancePlans?.policy_coverage_limits : "" },
        { id: 8, col: 6, title: 'Policy Covered Risks', value: detailsInsurancePlans?.policy_covered_risks ? detailsInsurancePlans?.policy_covered_risks : "" },
        { id: 9, col: 6, title: 'Policy Deductible Amount', value: detailsInsurancePlans?.policy_deductible_amount ? detailsInsurancePlans?.policy_deductible_amount : "" },
        { id: 10, col: 6, title: 'Policy Rrenewal Date', value: detailsInsurancePlans?.policy_renewal_date ? moment(detailsInsurancePlans?.policy_renewal_date).format('YYYY-MM-DD') : "" },
        { id: 11, col: 6, title: 'Policy Tenure', value: detailsInsurancePlans?.policy_tenure ? detailsInsurancePlans?.policy_tenure : "" },
    ]

    useEffect(() => {
        if (id) {
            fetchSingleData();
        }
    }, [])


    return (
        <Col md={12} data-aos={"fade-up"}>
            <Helmet>
                <title>Group Insurance · CMS Electricals</title>
            </Helmet>
            <CardComponent title={"View Group Insurance"}>
                <Row className="g-3">
                    <Col md={6}>
                        <Row className="g-3">
                            <Form.Group as={Col} md={12}>
                                <div className='d-align justify-content-start gap-4'>
                                    <Form.Check disabled type='radio' name="insurance_for" id="employee-wise" label='Employee-Wise'
                                        checked={
                                            Boolean(edit?.insurance_for == 'Employee Wise')
                                        }
                                    />

                                    <Form.Check disabled type='radio' name="insurance_for" id="designation-wise" label='Designation-Wise'
                                        checked={
                                            Boolean(edit?.insurance_for == 'Designation Wise')
                                        }
                                    />

                                    <div className="flex-shrink-0">
                                        <img src="https://i.ibb.co/mDqmLrF/insurance-icon-png-16.png" width={100} alt="Joint Life Policy :" />
                                    </div>
                                </div>
                            </Form.Group>


                            <Form.Group as={Col} md={12}>
                                <Form.Label className='d-block'>Select {edit?.insurance_for}:</Form.Label>
                                <div className='bg-primary-light form-shadow text-gray small fw-bold px-2 py-1'>
                                    {edit?.insurance_applied_on?.map((itm, id2) => {
                                        return <span key={itm?.id} className='d-block'><span className='fw-bold pe-1'>{id2 + 1}.</span>{itm?.employee_name || itm?.designation_name}</span>
                                    })}
                                </div>
                            </Form.Group>

                            <Form.Group as={Col} md={6}>
                                <Form.Label>Select Insurance Company</Form.Label>
                                <div className='bg-primary-light form-shadow text-gray small fw-bold px-2 py-1'>{edit?.insurance_company_name ? edit?.insurance_company_name : '--'}</div>
                            </Form.Group>
                            <Form.Group as={Col} md={6}>
                                <Form.Label>Select Plans</Form.Label>
                                <div className='bg-primary-light form-shadow text-gray small fw-bold px-2 py-1'>{edit?.insurance_plan_name ? edit?.insurance_plan_name : '--'}</div>
                            </Form.Group>
                            <Form.Group as={Col} md={12}>
                                <Form.Label>insurance deduction amount</Form.Label>
                                <Form.Control disabled name='insurance_deduction_amount' type={'number'} className='fw-bolder'
                                    value={edit?.insurance_deduction_amount}
                                />
                            </Form.Group>
                        </Row>
                    </Col>
                    <Form.Group as={Col} md={6}>
                        <Row className="g-2">
                            {
                                singleoutletsList.map((plansData, id1) => {
                                    return (
                                        <Form.Group key={id1} as={Col} md={plansData.col}>
                                            <Form.Label>{plansData.title}</Form.Label>
                                            <Form.Control type={'text'} className='fw-bolder' value={plansData.value} disabled />
                                        </Form.Group>
                                    )
                                })
                            }
                        </Row>
                    </Form.Group>
                </Row>
            </CardComponent>
        </Col>
    )
}

export default ViewGroupInsurance