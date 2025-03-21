import React, { useEffect, useState } from "react";
import { Badge, Col, Form, Stack, Table } from "react-bootstrap";
import { BsRecord2 } from "react-icons/bs";
import CardComponent from "../../components/CardComponent";
import { getAllDiscardMeasurementDetails } from "../../services/contractorApi";
import { useLocation } from "react-router-dom";

export default function ViewDiscardsDetails() {
  const location = useLocation();
  const id = location?.state?.id;
  const [edit, setEdit] = useState("");

  const fetchExpenseRequestData = async () => {
    const res = await getAllDiscardMeasurementDetails(id);
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit([]);
    }
  };

  useEffect(() => {
    fetchExpenseRequestData();
  }, [id]);
  return (
    <CardComponent showBackButton={true} title={"View Details"}>
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
                    ₹ {edit?.po_details?.po_limit - edit?.po_details?.po_amount}
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
            {edit?.items_id?.map((itm, idd) => (
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
      {edit?.items_data?.length > 0 && (
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
                {edit?.items_data?.map((parentItem, parentIndex) => (
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
                ))}
              </tbody>
            </Table>
          </div>
        </>
      )}
    </CardComponent>
  );
}
