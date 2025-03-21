import React, { useEffect, useState } from "react";
import CardComponent from "../../components/CardComponent";
import { useLocation, useNavigate } from "react-router-dom";
import { getMeasurementTimeHistory } from "../../services/contractorApi";
import { Col, Row, Table } from "react-bootstrap";
import { BsRecord2 } from "react-icons/bs";

export default function ViewTimeLine() {
  const location = useLocation();
  const measurement_id = location?.state?.measurement_id;
  const [edit, setEdit] = useState("");
  const navigate = useNavigate();

  const fetchMeasurementTimeline = async () => {
    const res = await getMeasurementTimeHistory(measurement_id);
    if (res.status) {
      setEdit(res.data[0]);
    } else {
      setEdit([]);
    }
  };

  useEffect(() => {
    fetchMeasurementTimeline();
  }, []);

  return (
    <Col md={12}>
      <CardComponent showBackButton={true} title={"View TimeLine History"}>
        <Row className="g-3">
          <Col md={6}>
            <div className="p-20 shadow rounded h-100">
              <strong className="text-secondary">Measurement Details</strong>
              <div className="mt-2">
                <table className="table-sm table">
                  <tbody>
                    {edit?.measurement_date && (
                      <tr>
                        <th>measurement date :</th>
                        <td>{edit?.measurement_date}</td>
                      </tr>
                    )}
                    {edit?.financial_year && (
                      <tr>
                        <th>financial year :</th>
                        <td>{edit?.financial_year}</td>
                      </tr>
                    )}
                    {edit?.po_number && (
                      <tr>
                        <th>po Number :</th>
                        <td>{edit?.po_number}</td>
                      </tr>
                    )}
                    {edit?.complaint_type_name && (
                      <tr>
                        <th>Complaint Type Name :</th>
                        <td>{edit?.complaint_type_name}</td>
                      </tr>
                    )}
                    {edit?.regional_office_name && (
                      <tr>
                        <th>regional office name :</th>
                        <td>{edit?.regional_office_name}</td>
                      </tr>
                    )}
                    {edit?.sales_area_name && (
                      <tr>
                        <th>sales area name :</th>
                        <td>{edit?.sales_area_name}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </Col>
          <Col md={6}>
            <div className="p-20 shadow rounded h-100">
              <strong className="text-secondary">Po Details</strong>
              <div className="mt-2">
                <table className="table-sm table">
                  <tbody>
                    <tr>
                      <th>po Number :</th>
                      <td>{edit?.po_details?.po_number}</td>
                    </tr>
                    <tr>
                      <th>po date :</th>
                      <td>{edit?.po_details?.po_date}</td>
                    </tr>
                    <tr>
                      <th>po limit :</th>
                      <td>₹ {edit?.po_details?.po_limit}</td>
                    </tr>
                    <tr>
                      <th>po used amount :</th>
                      <td>₹ {edit?.po_details?.po_amount}</td>
                    </tr>
                    <tr>
                      <th>po remaining amount :</th>
                      <td>
                        ₹{" "}
                        {edit?.po_details?.po_limit -
                          edit?.po_details?.po_amount}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Col>
          {edit?.items_data?.length > 0 && (
            <>
              <Col md={12}>
                <div className="p-20 shadow rounded">
                  <strong className="text-secondary">Item List</strong>
                  <div className="mt-2 table-scroll">
                    <Table className="text-body Roles">
                      <thead>
                        <tr>
                          <th>Sr No.</th>
                          <th>Item Name</th>
                          <th>Unit</th>
                          <th>No.</th>
                          <th>Length</th>
                          <th>Breadth</th>
                          <th>Depth</th>
                          <th>Qty</th>
                          {/* <th>Total Qty</th> */}
                          <th>Rate</th>
                          <th>Created At</th>
                        </tr>
                      </thead>

                      <tbody>
                        {edit?.items_data?.map((parentItem, parentIndex) => (
                          <>
                            <tr key={parentIndex} className="bg-light">
                              <td>{parentIndex + 1}</td>
                              <td>{parentItem.item_name}</td>
                              <td>{parentItem.unit}</td>
                              <td></td>
                              <td></td>
                              {/* <td></td> */}
                              <td></td>
                              <td></td>
                              {/* <td>{parentItem.total_qty}</td> */}
                              <td></td>
                              <td>{parentItem.rate}</td>
                              {/* <td>
                        {parentItem?.childArray?.reduce(
                          (total, itm) => total + +itm.qty,
                          0
                        ) * +parentItem.rate}
                      </td> */}
                            </tr>
                            {parentItem?.childArray?.map(
                              (childItem, childIndex) => (
                                <tr key={childIndex}>
                                  {/* <td></td> */}

                                  <td colSpan={2}>
                                    <BsRecord2 /> {childItem?.description}
                                  </td>
                                  <td></td>
                                  <td>{childItem?.no}</td>
                                  <td>{childItem?.length}</td>
                                  <td>{childItem?.breadth}</td>
                                  <td>{childItem?.depth}</td>
                                  <td className="text-start" colSpan={1}>
                                    {parseFloat(childItem.qty).toFixed(2)}
                                  </td>
                                  <td></td>
                                  {/* <td></td> */}
                                  {/* <td></td> */}
                                  <td>{childItem.created_at}</td>
                                </tr>
                              )
                            )}
                          </>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </div>
              </Col>
            </>
          )}
        </Row>
      </CardComponent>
    </Col>
  );
}
