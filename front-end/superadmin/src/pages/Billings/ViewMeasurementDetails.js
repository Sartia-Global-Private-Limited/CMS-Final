import React from "react";
import Select from "react-select";
import { Badge, Col, Form, Stack, Table } from "react-bootstrap";
import { BsRecord2 } from "react-icons/bs";
import { useTranslation } from "react-i18next";

const ViewMeasurementDetails = ({ edit }) => {
  const { t } = useTranslation();
  return (
    <>
      <Col md={6}>
        <div className="p-20 shadow rounded h-100">
          <strong className="text-secondary">{t("Measurement Details")}</strong>
          <div className="mt-2">
            <table className="table-sm table">
              <tbody>
                {edit?.measurement_date && (
                  <tr>
                    <th>{t("measurement date")} :</th>
                    <td>{edit?.measurement_date}</td>
                  </tr>
                )}
                {edit?.financial_year && (
                  <tr>
                    <th>{t("financial year")} :</th>
                    <td>{edit?.financial_year}</td>
                  </tr>
                )}
                {edit?.po_number && (
                  <tr>
                    <th>{t("po number")} :</th>
                    <td>{edit?.po_number}</td>
                  </tr>
                )}
                {edit?.complaint_type_name && (
                  <tr>
                    <th>{t("Complaint Type Name")} :</th>
                    <td>{edit?.complaint_type_name}</td>
                  </tr>
                )}
                {edit?.regional_office_name && (
                  <tr>
                    <th>{t("regional office name")} :</th>
                    <td>{edit?.regional_office_name}</td>
                  </tr>
                )}
                {edit?.sales_area_name && (
                  <tr>
                    <th>{t("sales area name")} :</th>
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
          <strong className="text-secondary">{t("Po Details")}</strong>
          <div className="mt-2">
            <table className="table-sm table">
              <tbody>
                <tr>
                  <th>{t("po Number")} :</th>
                  <td>{edit?.po_details?.po_number}</td>
                </tr>
                <tr>
                  <th>{t("po date")} :</th>
                  <td>{edit?.po_details?.po_date}</td>
                </tr>
                <tr>
                  <th>{t("po limit")} :</th>
                  <td>₹ {edit?.po_details?.po_limit}</td>
                </tr>
                <tr>
                  <th>{t("po used amount")} :</th>
                  <td>₹ {edit?.po_details?.po_amount}</td>
                </tr>
                <tr>
                  <th>{t("po remaining amount")} :</th>
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
          <strong className="text-secondary">{t("Item List")}</strong>
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
                  <th>{t("Sr No.")}</th>
                  <th>{t("Item Name")}</th>
                  <th>{t("Unit")}</th>
                  <th>{t("No.")}</th>
                  <th>{t("Length")}</th>
                  <th>{t("Breadth")}</th>
                  <th>{t("Depth")}</th>
                  <th>{t("Qty")}</th>
                  <th>{t("Total Qty")}</th>
                  <th>{t("Rate")}</th>
                  <th>{t("Amount")}</th>
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
          {/* <Col md={12}>
            <div className="p-20 shadow rounded">
              <strong className="text-secondary">Items Data</strong>
              <div className="mt-2">
                <Table className="table-sm table Roles">
                  <thead>
                    <tr>
                      <th>Sr No.</th>
                      <th>Item Name</th>
                      <th>Unit Name</th>
                      <th>Length</th>
                      <th>Breadth</th>
                      <th>Depth</th>
                      <th>Quantity</th>
                      <th>Rate</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {edit?.items?.map((itm, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>{itm.item_name}</td>
                        <td>{itm.unit_name}</td>
                        <td>{itm.length}</td>
                        <td>{itm.breadth}</td>
                        <td>{itm.depth}</td>
                        <td>{itm.quantity}</td>
                        <td>₹ {itm.rate}</td>
                        <td>₹ {itm.amount}</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={7}></td>
                      <td className="fw-bold">Total Amount</td>
                      <td className="fw-bold">₹ {edit?.measurement_amount}</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </div>
          </Col> */}
        </>
      )}
    </>
  );
};

export default ViewMeasurementDetails;
