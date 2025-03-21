import React, { useEffect, useState } from "react";
import ImageViewer from "../../components/ImageViewer";
import { Badge, Col, Row, Table } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { getSingleStockById } from "../../services/contractorApi";
import CardComponent from "../../components/CardComponent";
import { Helmet } from "react-helmet";

const ViewStock = () => {
  const { id } = useParams();
  const [edit, setEdit] = useState({});

  const fetchStockData = async () => {
    const res = await getSingleStockById(id);
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit({});
    }
  };

  useEffect(() => {
    if (id) {
      fetchStockData();
    }
  }, [id]);
  return (
    <>
      <Helmet>
        <title>View Stocks · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CardComponent
          className={"after-bg-light"}
          title={"View Stocks - Details"}
        >
          <Row className="g-3">
            <Col md={6}>
              <div className="p-20 shadow rounded h-100">
                <strong className="text-secondary">Item Details</strong>
                <div className="mt-2">
                  <table className="table-sm table">
                    <tbody>
                      {edit?.name && (
                        <tr>
                          <th>Item Name :</th>
                          <td>{edit?.name}</td>
                        </tr>
                      )}
                      {edit?.rate ? (
                        <tr>
                          <th>Item Rate :</th>
                          <td>{edit?.rate}</td>
                        </tr>
                      ) : null}
                      {edit?.qty ? (
                        <tr>
                          <th>Item qty :</th>
                          <td>{edit?.qty}</td>
                        </tr>
                      ) : null}
                      {edit?.unit_name && (
                        <tr>
                          <th>unit name :</th>
                          <td>{edit?.unit_name}</td>
                        </tr>
                      )}
                      {edit?.unit_short_name && (
                        <tr>
                          <th>unit short name :</th>
                          <td>{edit?.unit_short_name}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="p-20 shadow rounded h-100">
                <strong className="text-secondary">Details</strong>
                <div className="mt-2">
                  <table className="table-sm table">
                    <tbody>
                      <tr>
                        <th>total Used Items :</th>
                        <td>{edit?.totalUsedItems}</td>
                      </tr>
                      {edit.stockAlertStatus == false && (
                        <tr>
                          <th>stock Alert Status :</th>
                          <td className={`text-danger`}>
                            <Badge pill bg="warning" text="dark">
                              Low Quantity
                            </Badge>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </Col>
            <Col md={12}>
              <div className="p-20 shadow rounded h-100">
                <strong className="text-secondary">item Used Details</strong>
                <div className="mt-2">
                  <Table className="table-sm table Roles">
                    <thead>
                      <tr>
                        <th>Sr No.</th>
                        <th>complaint id</th>
                        <th>quantity</th>
                        <th>item price</th>
                        <th>created at</th>
                        <th>complaint type name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {edit?.itemUsedDetails?.map((itm, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>{itm.complaint_unique_id}</td>
                          <td>{itm.quantity}</td>
                          <td>{itm.item_price}</td>
                          <td>{itm.created_at}</td>
                          <td>{itm.complaint_type_name}</td>
                        </tr>
                      ))}
                      {edit?.itemUsedDetails?.length > 0 ? null : (
                        <tr>
                          <td colSpan={6}>
                            <img
                              className="p-3"
                              alt="no-result"
                              width="200"
                              src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                            />
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              </div>
            </Col>
          </Row>
        </CardComponent>
      </Col>
    </>
  );
};

export default ViewStock;
