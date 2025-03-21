import React from "react";
import { Col, Stack, Table } from "react-bootstrap";
import { BsRecord2 } from "react-icons/bs";
import { Link } from "react-router-dom";

const ViewInvoice = ({ itemsOnMeasurementId, edit }) => {
  return (
    <>
      <Col md={6}>
        <div className="p-20 shadow rounded h-100">
          <strong className="text-secondary">Invoice Details</strong>
          <div className="mt-2">
            <table className="table-sm table">
              <tbody>
                <tr>
                  <th>invoice no :</th>
                  <td>{edit?.invoice_no}</td>
                </tr>
                <tr>
                  <th>invoice date :</th>
                  <td>{edit?.invoice_date}</td>
                </tr>
                <tr>
                  <th>due date :</th>
                  <td>{edit?.due_date}</td>
                </tr>
                <tr>
                  <th>financial year :</th>
                  <td>{edit?.financial_year}</td>
                </tr>
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
                  <th>regional office :</th>
                  <td>{edit?.regional_office_name}</td>
                </tr>
                <tr>
                  <th>po Number :</th>
                  <td>
                    <Link
                      className="text-secondary text-none"
                      to={`/PurchaseOrder/view-details/${edit?.po_id}?type=purchase-order`}
                    >
                      {edit?.po_number}
                    </Link>
                  </td>
                </tr>
                <tr>
                  <th>callup number :</th>
                  <td>{edit?.callup_number}</td>
                </tr>
                <tr>
                  <th>measurement unique id :</th>
                  <td>
                    <Link
                      className="text-secondary text-none"
                      to={`/Measurements/CreateMeasurement/${edit?.measurement_id}?type=view`}
                    >
                      {edit?.measurement_unique_id}
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Col>
      <Col md={12}>
        <div className="p-20 shadow rounded">
          <strong className="text-secondary">Item List</strong>
          <Stack className="mt-2" direction="horizontal" gap={2}>
            {itemsOnMeasurementId?.items_id?.map((itm, idd) => (
              <span
                key={idd}
                className="social-btn-re text-none w-auto h-auto success-combo"
                bg="success"
              >
                {itm?.label}
              </span>
            ))}
          </Stack>
        </div>
      </Col>
      {itemsOnMeasurementId?.items_data?.length > 0 && (
        <>
          <div className="table-scroll p-2">
            <Table className="text-body bg-new Roles">
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
                  <th>Total Qty</th>
                  <th>Rate</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {itemsOnMeasurementId?.items_data?.map(
                  (parentItem, parentIndex) => (
                    <>
                      <tr key={parentIndex} className="bg-light">
                        <td>{parentIndex + 1}</td>
                        <td>{parentItem.item_name}</td>
                        <td>{parentItem.unit}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>{parentItem.total_qty}</td>
                        <td>{parentItem.rate}</td>
                        <td>
                          {parentItem?.childArray?.reduce(
                            (total, itm) => total + +itm.qty,
                            0
                          ) * +parentItem.rate}
                        </td>
                      </tr>
                      {parentItem?.childArray?.map((childItem, childIndex) => (
                        <tr key={childIndex}>
                          <td></td>
                          <td colSpan={2}>
                            <BsRecord2 /> {childItem?.description}
                          </td>
                          <td>{childItem?.no}</td>
                          <td>{childItem?.length}</td>
                          <td>{childItem?.breadth}</td>
                          <td>{childItem?.depth}</td>
                          <td className="text-start" colSpan={5}>
                            {childItem.qty}
                          </td>
                        </tr>
                      ))}
                    </>
                  )
                )}
              </tbody>
            </Table>
          </div>
        </>
      )}
    </>
  );
};

export default ViewInvoice;
