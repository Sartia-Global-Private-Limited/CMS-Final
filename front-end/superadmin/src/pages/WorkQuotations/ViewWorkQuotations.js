import moment from "moment/moment";
import React from "react";
import { Col, Row, Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { BsRecord2 } from "react-icons/bs";
import { formatNumberToINR } from "../../utils/helper";

const ViewWorkQuotations = ({ edit }) => {
  const { t } = useTranslation();
  return (
    <>
      <Row>
        <Col md={6}>
          <div className="p-20 shadow rounded h-100">
            <strong className="text-secondary">{t("Company Details")}</strong>
            <div className="">
              <table className="table-sm table">
                <tbody>
                  <tr>
                    <th>{t("company from")}:</th>
                    <td>{edit?.company_from_name}</td>
                  </tr>
                  <tr>
                    <th>{t("company from state")} :</th>
                    <td>{edit?.state_name}</td>
                  </tr>
                  <tr>
                    <th>{t("company to")} :</th>
                    <td>{edit?.company_to_name}</td>
                  </tr>
                  <tr>
                    <th>{t("company to regional office")} :</th>
                    <td>{edit?.company_to_regional_office_name}</td>
                  </tr>
                  {edit?.quotation_date && (
                    <tr>
                      <th>{t("quotation date")} :</th>
                      <td>{edit?.quotation_date}</td>
                    </tr>
                  )}
                  {edit?.quotations_number && (
                    <tr>
                      <th>{t("Quotation Number")} :</th>
                      <td>{edit?.quotations_number}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Col>
        <Col md={6}>
          <div className="p-20 shadow rounded h-100">
            <strong className="text-secondary">{t("Details")}</strong>
            <div className="">
              <table className="table-sm table">
                <tbody>
                  <tr>
                    <th>{t("regional office name")} :</th>
                    <td>{edit?.regional_office_name}</td>
                  </tr>
                  <tr>
                    <th>{t("sales area name")}:</th>
                    <td>{edit?.sales_area_name}</td>
                  </tr>
                  <tr>
                    <th>{t("outlet")} :</th>
                    <td>{edit?.outlet_name}</td>
                  </tr>
                  <tr>
                    <th>{t("po number")} :</th>
                    <td>{edit?.po_number}</td>
                  </tr>
                  <tr>
                    <th>{t("created by")} :</th>
                    <td>{edit?.created_by_name}</td>
                  </tr>
                  {edit?.updated_by ? (
                    <tr>
                      <th>{t("updated by")} :</th>
                      <td>{edit?.updated_by_name}</td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        </Col>
      </Row>
      <Col md={12}>
        <div className="table-scroll p-2">
          <strong className="text-secondary">{t("Item List")}</strong>
          <Table className="text-body Roles mt-2">
            <thead>
              <tr>
                <th style={{ maxWidth: "50px" }}>{t("Order Line Number")}</th>
                <th> {t("Item Name")}</th>
                <th> {t("Unit")}</th>
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
              {edit?.items_data?.length > 0 ? (
                edit?.items_data?.map((parentItem, parentIndex) => (
                  <>
                    <tr key={parentIndex} className="bg-light">
                      <td>{parentItem.order_line_number}</td>
                      <td>{parentItem.item_name}</td>
                      <td>{parentItem.unit}</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>
                        {parseFloat(
                          parentItem?.childArray?.reduce(
                            (total, item) => +item.qty + total,
                            0
                          )
                        ).toFixed(2)}
                      </td>
                      <td>{parentItem.rate}</td>
                      <td>
                        {(
                          parentItem?.childArray?.reduce(
                            (total, itm) => total + +itm.qty,
                            0
                          ) * +parentItem.rate
                        ).toFixed(2)}
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
                          {parseFloat(childItem.qty).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </>
                ))
              ) : (
                <tr>
                  <td colSpan={15}>No Data Available</td>
                </tr>
              )}
            </tbody>
          </Table>
          <div className="d-flex my-2 justify-content-end fw-bold fs-5">
            {t("Total Amount")} : {formatNumberToINR(edit?.amount)}
          </div>
        </div>
      </Col>
      <Col md={12}>
        <div className="p-20 shadow rounded h-100">
          <strong className="text-secondary">{t("External Field")}</strong>
          <div className="mt-2">
            <table className="table-sm table">
              <tbody>
                <tr>
                  <th>{t("created at")} :</th>
                  <td>{moment(edit?.created_at).format("DD-MM-YYYY")}</td>
                </tr>
                {edit?.complaint_type_name ? (
                  <tr>
                    <th>{t("complaint type")} :</th>
                    <td>{edit?.complaint_type_name}</td>
                  </tr>
                ) : null}
                {edit?.remark ? (
                  <tr>
                    <th>{t("remark")} :</th>
                    <td>{edit?.remark}</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </Col>
    </>
  );
};

export default ViewWorkQuotations;
