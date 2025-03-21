import React from 'react'
import { Table } from 'react-bootstrap'

const ViewCertificates = () => {
    return (
        <div className="invoice-box mt-n5" data-aos={"fade-up"}>
            <Table cellPadding={0} cellSpacing={0}>
                <tbody>
                    <tr className="top">
                        <td colSpan={2}>
                            <Table>
                                <tbody>
                                    <tr>
                                        <td className="title">
                                            CERTIFICATE
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </td>
                    </tr>
                    <tr className="information">
                        <td colSpan={2}>
                            <Table>
                                <tbody>
                                    <tr>
                                        <td>
                                            Sparksuite, Inc.
                                            <br />
                                            12345 Sunny Road
                                            <br />
                                            Sunnyville, CA 12345
                                        </td>
                                        <td>
                                            Acme Corp.
                                            <br />
                                            John Doe
                                            <br />
                                            john@example.com
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </td>
                    </tr>
                    <tr className="heading">
                        <td>Payment Method</td>
                        <td>Check #</td>
                    </tr>
                    <tr className="details">
                        <td>Check</td>
                        <td>1000</td>
                    </tr>
                    <tr className="heading">
                        <td>Item</td>
                        <td>Price</td>
                    </tr>
                    <tr className="item">
                        <td>Website design</td>
                        <td>$300.00</td>
                    </tr>
                    <tr className="item">
                        <td>Hosting (3 months)</td>
                        <td>$75.00</td>
                    </tr>
                    <tr className="item last">
                        <td>Domain name (1 year)</td>
                        <td>$10.00</td>
                    </tr>
                    <tr className="total">
                        <td />
                        <td>Total: $385.00</td>
                    </tr>
                </tbody>
            </Table>
        </div>
    )
}

export default ViewCertificates