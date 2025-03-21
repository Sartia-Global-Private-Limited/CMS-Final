import React from "react";
import { Col, Table } from "react-bootstrap";
import { Helmet } from "react-helmet";
import CardComponent from "../../../components/CardComponent";

const Balance = () => {
  return (
    <>
      <Helmet>
        <title>Balance · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CardComponent title={"Balance"}>
          <div className="table-scroll p-2">
            <Table className="text-body bg-new  Roles">
              <thead className="text-truncate">
                <tr>
                  {["Date", "Description", "DR", "CR", "Remaining Balance"].map(
                    (thead) => (
                      <th key={thead}>{thead}</th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((home) => (
                  <tr key={home}>
                    <td>0{home}/02/2023</td>
                    <td>
                      <div className="text-truncate2 line-clamp-2">
                        Lorem Ipsum
                      </div>
                    </td>
                    <td>
                      <div className="text-truncate">₹ 2,000.00</div>
                    </td>
                    <td>₹ 12,000.00</td>
                    <td>₹ 1,2000.00</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </CardComponent>
      </Col>
    </>
  );
};

export default Balance;
