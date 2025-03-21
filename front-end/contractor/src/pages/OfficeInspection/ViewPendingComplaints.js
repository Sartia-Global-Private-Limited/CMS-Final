import React, { useEffect, useState } from "react";
import { Badge, Col, Row, Table } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { getSingleOfficeInspectionItemsStock } from "../../services/contractorApi";
import CardComponent from "../../components/CardComponent";
import { Helmet } from "react-helmet";
import ImageViewer from "../../components/ImageViewer";

const ViewPendingComplaints = () => {
  const { id, status } = useParams();
  const [edit, setEdit] = useState({});

  const fetchStockData = async () => {
    const res = await getSingleOfficeInspectionItemsStock(id, status);
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
        <title>View Complaints · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CardComponent
          className={"after-bg-light"}
          title={"View Complaints - Details"}
        >
          <Row className="g-3">
            <Col md={6}>
              <div className="p-20 shadow rounded h-100">
                <strong className="text-secondary">stock punch Details</strong>
                <div className="mt-2">
                  <table className="table-sm table">
                    <tbody>
                      <tr>
                        <th>complaint unique id :</th>
                        <td>{edit?.complaint_unique_id}</td>
                      </tr>
                      <tr>
                        <th>punch at :</th>
                        <td>{edit?.punch_at}</td>
                      </tr>
                      {edit?.employee_id ? (
                        <tr>
                          <th>employee id :</th>
                          <td>{edit?.employee_id}</td>
                        </tr>
                      ) : null}
                      <tr>
                        <th>User :</th>
                        <td>
                          <ImageViewer
                            src={
                              edit.user_image
                                ? `${process.env.REACT_APP_API_URL}${edit.user_image}`
                                : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                            }
                          >
                            <img
                              width={30}
                              height={30}
                              className="my-bg object-fit p-1 rounded-circle"
                              src={
                                edit.user_image
                                  ? `${process.env.REACT_APP_API_URL}${edit.user_image}`
                                  : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                              }
                            />{" "}
                            {edit?.user_name}
                          </ImageViewer>
                        </td>
                      </tr>
                      <tr>
                        <th>status :</th>
                        <td
                          className={`text-${
                            edit.status === "1" ? "green" : "orange"
                          }`}
                        >
                          {edit.status === "1" ? "Approved" : "Pending"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </Col>
            {edit.status === "1" && (
              <Col md={6}>
                <div className="p-20 shadow rounded h-100">
                  <strong className="text-secondary">
                    stock punch Approved Details
                  </strong>
                  <div className="mt-2">
                    <table className="table-sm table">
                      <tbody>
                        <tr>
                          <th>employee id :</th>
                          <td>{edit?.approved_by_employee_id}</td>
                        </tr>
                        <tr>
                          <th>approved by :</th>
                          <td>
                            <ImageViewer
                              src={
                                edit.approved_by_image
                                  ? `${process.env.REACT_APP_API_URL}${edit.approved_by_image}`
                                  : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                              }
                            >
                              <img
                                width={30}
                                height={30}
                                className="my-bg object-fit p-1 rounded-circle"
                                src={
                                  edit.approved_by_image
                                    ? `${process.env.REACT_APP_API_URL}${edit.approved_by_image}`
                                    : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                }
                              />{" "}
                              {edit?.approved_by_name}
                            </ImageViewer>
                          </td>
                        </tr>
                        <tr>
                          <th>approved at :</th>
                          <td>{edit?.approved_at}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </Col>
            )}
            <Col md={12}>
              <div className="p-20 shadow rounded h-100">
                <strong className="text-secondary">Item Details</strong>
                <div className="mt-2">
                  <Table className="table-sm table Roles">
                    <thead>
                      <tr>
                        <th>Sr No.</th>
                        <th>item name</th>
                        <th>quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {edit?.stock_punch_detail?.map((itm, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>{itm.item_name?.label}</td>
                          <td>{itm.item_qty}</td>
                        </tr>
                      ))}
                      {edit?.stock_punch_detail?.length > 0 ? null : (
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

export default ViewPendingComplaints;
