import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Badge, Col, Table } from "react-bootstrap";
import { BsRecord2 } from "react-icons/bs";
import CardComponent from "../../../components/CardComponent";
import { getDetailsOfMergedInvoice } from "../../../services/contractorApi";

const ViewInvoices = () => {
  const location = useLocation();
  const id = location?.state?.id;

  const [data, setData] = useState();
  const fetchExpenseRequestData = async () => {
    const res = await getDetailsOfMergedInvoice(id);
    if (res.status) {
      setData(res.data);
    } else {
      setData();
    }
  };

  useEffect(() => {
    if (id) fetchExpenseRequestData();
  }, []);

  return (
    <CardComponent showBackButton={true} title={" View Invoice "}>
      <div className="d-flex mb-3">
        <Col md={6}>
          <div className="p-20 shadow rounded h-100">
            <strong className="text-secondary">Details</strong>
            <div className="mt-2">
              <table className="table-sm table">
                <tbody>
                  <tr>
                    <th>po Number :</th>
                    <td>{data?.po_number}</td>
                  </tr>
                  <tr>
                    <th>regional office :</th>
                    <td>{data?.regional_office_name}</td>
                  </tr>

                  <tr>
                    <th>Outlet :</th>
                    <td>
                      {data?.outletDetails?.map((item, idx) => (
                        <li> {item?.outlet_name ?? "--"}</li>
                      )) ?? "--"}
                    </td>
                  </tr>
                  <tr>
                    <th>PI Number :</th>
                    <td>
                      {data?.pi_bill.map((pi) => (
                        <li>{pi}</li>
                      ))}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Col>
        <Col md={6}>
          <div className="p-20 shadow rounded h-100">
            <strong className="text-secondary">Billing Details</strong>
            <div className="mt-2">
              <table className="table-sm table">
                <tbody>
                  <tr>
                    <th>Bill Number :</th>

                    <td>{data?.bill_no}</td>
                  </tr>
                  <tr>
                    <th>financial year :</th>
                    <td>{data?.financial_year}</td>
                  </tr>
                  <tr>
                    <th>billing from :</th>
                    <td>{data?.billing_from?.company_name}</td>
                  </tr>

                  <tr>
                    <th>billing to :</th>
                    <td>{data?.billing_to?.company_name}</td>
                  </tr>
                  <tr>
                    <th>billing to ro :</th>
                    <td>{data?.billing_to_ro_office?.ro_name}</td>
                  </tr>

                  <tr className="border">
                    <th>Complaint id :</th>
                    <td>
                      {data?.complaintDetails?.map((item, idx) => (
                        <li>{item?.complaint_unique_id}</li>
                      ))}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Col>
      </div>

      {data?.getMeasurements.map((Invoice, mainIndex1) => {
        return (
          <>
            <div className="d-flex justify-content-center fw-bold my-2 purple-combo fs-6	">
              Bill Number- {Invoice.invoice_no}
            </div>
            {Invoice.piMeasurements.map((performa, mainIndex) => {
              {
                return (
                  <div className="p-20 shadow rounded h-100 mb-4">
                    <div className="d-flex ">
                      <span className="fw-bold purple-combo">
                        PI number - {performa?.bill_no}
                      </span>
                    </div>

                    {performa.measurements.map(
                      (measurements, measurementIndex) => {
                        return (
                          <>
                            {measurements.items_data.length > 0 && (
                              <>
                                <div className="table-scroll my-2">
                                  <div className="fw-bold my-2">
                                    Complaint number -{" "}
                                    {
                                      measurements?.complaintDetails
                                        .complaint_unique_id
                                    }
                                  </div>
                                  <Table className="text-body my-3 Roles">
                                    <thead>
                                      <tr>
                                        <th style={{ maxWidth: "50px" }}>
                                          Order Line
                                        </th>
                                        <th>Item Name</th>
                                        <th>Unit</th>
                                        <th>No.</th>
                                        <th>Length</th>
                                        <th>Breadth</th>
                                        <th>Depth</th>
                                        <th>Qty</th>
                                        <th>Total Qty</th>
                                        <th>Rate</th>
                                        <th>Amount</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <>
                                        {measurements?.items_data.map(
                                          (main, index) => {
                                            return (
                                              <>
                                                <tr
                                                  key={index}
                                                  className="bg-light"
                                                >
                                                  <td>
                                                    {main.order_line_number}
                                                  </td>
                                                  <td>{main.item_name}</td>
                                                  <td>{main.unit}</td>
                                                  <td></td>
                                                  <td></td>
                                                  <td></td>
                                                  <td></td>
                                                  <td></td>
                                                  <td>{main.total_qty}</td>
                                                  <td>{main.rate}</td>
                                                  <td>
                                                    {parseFloat(
                                                      main?.childArray?.reduce(
                                                        (total, itm) =>
                                                          total + +itm.qty,
                                                        0
                                                      ) * +main.rate
                                                    ).toFixed(2)}
                                                  </td>
                                                </tr>
                                                {main?.childArray?.map(
                                                  (childItem, childIndex) => (
                                                    <tr key={childIndex}>
                                                      <td></td>
                                                      <td colSpan={2}>
                                                        <BsRecord2 />{" "}
                                                        {childItem?.description}
                                                      </td>
                                                      <td>{childItem?.no}</td>
                                                      <td>
                                                        {childItem?.length}
                                                      </td>
                                                      <td>
                                                        {childItem?.breadth}
                                                      </td>
                                                      <td>
                                                        {childItem?.depth}
                                                      </td>
                                                      <td
                                                        className="text-start"
                                                        colSpan={5}
                                                      >
                                                        {childItem.qty}
                                                      </td>
                                                    </tr>
                                                  )
                                                )}
                                              </>
                                            );
                                          }
                                        )}
                                      </>
                                    </tbody>
                                  </Table>
                                </div>
                              </>
                            )}
                          </>
                        );
                      }
                    )}
                  </div>
                );
              }
            })}
          </>
        );
      })}
    </CardComponent>
  );
};

export default ViewInvoices;
