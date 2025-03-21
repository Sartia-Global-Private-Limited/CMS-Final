import React from 'react'
import { Button, Col, Form, Table } from 'react-bootstrap'
import { GrDocumentCsv, GrDocumentPdf, GrPrint } from 'react-icons/gr'
import CardComponent from '../CardComponent'

const ViewPaySlip = () => {
    return (
        <Col md={12}>
            <CardComponent title={'View PaySlip'} custom2={<div className="d-align justify-content-end gap-2">
                <Button className="bg-new text-gray text-uppercase"><GrDocumentCsv className='fs-5' /></Button>
                <div className="vr hr-shadow"></div>
                <Button variant="primary" type="Submit" className="bg-new text-uppercase text-secondary"><GrDocumentPdf className='fs-5' /></Button>
                <div className="vr hr-shadow"></div>
                <Button variant="primary" type="Submit" className="bg-new text-uppercase text-secondary"><GrPrint className='fs-5' /></Button>
            </div>}>
                <div className="invoice-box my-3" data-aos={"fade-up"}>
                    <Table cellPadding={0} cellSpacing={0}>
                        <tbody>
                            <tr className="top">
                                <td colSpan={2} style={{ border: 'none' }}>
                                    <Table>
                                        <tbody>
                                            <tr>
                                                <td align='center' style={{ border: 'none' }}>
                                                    <strong>Payslip for the month of feb 2023</strong>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </td>
                            </tr>
                            <tr className="information">
                                <td colSpan={2} style={{ border: 'none' }}>
                                    <Table>
                                        <tbody>
                                            <tr>
                                                <td style={{ border: 'none' }}>
                                                    <div className='title'>CMS Electricals</div>
                                                    <br />
                                                    Lorem Ipsum Technologies
                                                    <br />
                                                    12345 Lorem Road,
                                                    <br />
                                                    Loremville, CA 12345
                                                    <br />
                                                    <br />
                                                    <strong>Altaf Ahmad</strong>
                                                    <br />
                                                    Web Designer
                                                    <br />
                                                    Employee id: FT-02345
                                                    <br />
                                                    Joining Date: 07 Feb 2022
                                                </td>
                                                <td style={{ border: 'none' }}>
                                                    <strong>Payslip #48256</strong>
                                                    <br />
                                                    Salary month: March, 2023
                                                </td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </td>
                            </tr>
                            <div className='d-flex gap-4 mb-3'>
                                <table width={'50%'}>
                                    <thead>
                                        <tr>
                                            <th scope="col">Earnings</th>
                                        </tr>
                                    </thead>
                                    <tbody className='my-border'>
                                        <tr>
                                            <th>Basic Salary</th>
                                            <td>₹ 10,000</td>
                                        </tr>
                                        <tr>
                                            <th>House Rent Allowance (H.R.A)</th>
                                            <td>₹ 200.00</td>
                                        </tr>
                                        <tr>
                                            <th>Conveyance</th>
                                            <td>₹ 50.00</td>
                                        </tr>
                                        <tr>
                                            <th>Medical Allowance</th>
                                            <td>₹ 500.00</td>
                                        </tr>
                                        <tr>
                                            <th>Children Education Allowance</th>
                                            <td>₹ 1000.00</td>
                                        </tr>
                                        <tr>
                                            <th>Dearness Allowance</th>
                                            <td>00.00</td>
                                        </tr>
                                        <tr>
                                            <th>Pre-Requisites</th>
                                            <td>00.00</td>
                                        </tr>
                                        <tr>
                                            <th>Others</th>
                                            <td>00.00</td>
                                        </tr>
                                        <tr>
                                            <th>Total</th>
                                            <td><b>₹ 10,750</b></td>
                                        </tr>
                                    </tbody>
                                </table>
                                <table width={'50%'}>
                                    <thead>
                                        <tr>
                                            <th scope="col">Deductions</th>
                                        </tr>
                                    </thead>
                                    <tbody className='my-border'>
                                        <tr>
                                            <th>Provident fund</th>
                                            <td>₹ 10,000</td>
                                        </tr>
                                        <tr>
                                            <th>Employees State Insurance Corporation</th>
                                            <td>₹ 200.00</td>
                                        </tr>
                                        <tr>
                                            <th>Professional Tax</th>
                                            <td>₹ 50.00</td>
                                        </tr>
                                        <tr>
                                            <th>Labor Welfare Fund</th>
                                            <td>₹ 500.00</td>
                                        </tr>
                                        <tr>
                                            <th>National Pension Scheme</th>
                                            <td>₹ 1000.00</td>
                                        </tr>
                                        <tr>
                                            <th>Advance Salary Deductions</th>
                                            <td>00.00</td>
                                        </tr>
                                        <tr>
                                            <th>Others</th>
                                            <td>00.00</td>
                                        </tr>
                                        <tr>
                                            <th>Total Deductions</th>
                                            <td><b>₹ 550.00</b></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </tbody>
                        <p className='small'><b>Net Salary:</b> ₹ 10,750 (Ten thousand seven hundred fifty only /-)</p>
                        <table width={'50%'} className='my-4'>
                            <tbody className='my-border'>
                                <tr>
                                    <th>Attendance Self Service</th>
                                </tr>
                                <tr align='center'>
                                    <th colSpan={2} className='fs-4'>208:48:52</th>
                                </tr>
                                <tr>
                                    <th>Total Working Days</th>
                                    <td>31/25</td>
                                </tr>
                                <tr>
                                    <th>Total Absent</th>
                                    <td>01</td>
                                </tr>
                                <tr>
                                    <th>Total Sick Leave</th>
                                    <td>01</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className='d-flex small align-items-end justify-content-between'>
                            <div>
                                <p className='mb-0'>Add Performance Bonus of any amount</p>
                                <Form.Control type="text" />
                            </div>
                            <div className='social-btn-re purple-combo w-auto h-auto'>Mark as Disbursed</div>
                        </div>
                    </Table>
                </div>
            </CardComponent>
        </Col>
    )
}

export default ViewPaySlip