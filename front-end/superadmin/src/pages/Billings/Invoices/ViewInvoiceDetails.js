import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Col, Table } from "react-bootstrap";
import { BsRecord2 } from "react-icons/bs";
import CardComponent from "../../../components/CardComponent";
import { getInvoiceDetails } from "../../../services/contractorApi";
import { useTranslation } from "react-i18next";

const ViewInvoiceDetails = () => {
  const location = useLocation();
  const id = location?.state?.id;
  const { t } = useTranslation();
  const [data, setData] = useState();
  const fetchExpenseRequestData = async () => {
    const res = await getInvoiceDetails(id);
    if (res.status) {
      setData(res.data[0]);
    } else {
      setData();
    }
  };

  useEffect(() => {
    if (id) fetchExpenseRequestData();
  }, []);

  return (
    <CardComponent showBackButton={true} title={"View Invoice"}>
      <div className="d-flex">
        <Col md={6}>
          <div className="p-20 shadow rounded h-100">
            <strong className="text-secondary">{t("Details")}</strong>
            <div className="mt-2">
              <table className="table-sm table">
                <tbody>
                  <tr>
                    <th>{t("Bill Number")} :</th>
                    <td>{data?.bill_no}</td>
                  </tr>
                  <tr>
                    <th>{t("financial year")} :</th>
                    <td>{data?.financial_year}</td>
                  </tr>
                  <tr>
                    <th>{t("po Number")} :</th>
                    <td>{data?.po_details?.po_number}</td>
                  </tr>
                  <tr>
                    <th>{t("regional office")} :</th>
                    <td>{data?.billing_to_ro_office?.regional_office_name}</td>
                  </tr>

                  <tr>
                    <th>{t("callup number")} :</th>
                    <td>{data?.callup_number ?? "--"}</td>
                  </tr>

                  <tr>
                    <th>{t("Outlet")} :</th>
                    <td>
                      {data?.outletDetails?.map((item, idx) => (
                        <li> {item?.outlet_name ?? "--"}</li>
                      )) ?? "--"}
                    </td>
                  </tr>
                  <tr>
                    <th>{t("PI Number")} :</th>
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
            <strong className="text-secondary">{t("Billing Details")}</strong>
            <div className="mt-2">
              <table className="table-sm table">
                <tbody>
                  <tr>
                    <th>{t("billing from")} :</th>
                    <td>{data?.billing_from?.company_name}</td>
                  </tr>
                  <tr>
                    <th>{t("billing from state")} :</th>
                    <td>{data?.billing_from_state?.name}</td>
                  </tr>
                  <tr>
                    <th>{t("billing to")} :</th>
                    <td>{data?.billing_to?.company_name}</td>
                  </tr>
                  <tr>
                    <th>{t("billing to ro office")} :</th>
                    <td>{data?.billing_to_ro_office?.regional_office_name}</td>
                  </tr>

                  <tr>
                    <th>{t("Complaint unique id")} :</th>
                    <td>
                      {data?.complaintDetails?.map((item, idx) => {
                        return (
                          <>
                            {item.map((complain) => {
                              return (
                                <li>
                                  {" "}
                                  {complain?.complaint_unique_id ?? "--"}
                                </li>
                              );
                            })}
                          </>
                        );
                      })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Col>
      </div>

      {data?.getMeasurements.map((performa, mainIndex) => {
        return (
          <div className="p-20 shadow rounded h-100 my-3">
            <div className="d-flex ">
              <span className="fw-bold purple-combo ">
                {t("PI Number")} - {performa?.bill_no}
              </span>
            </div>

            {performa.getMeasurements.map((measurements, measurementIndex) => {
              return (
                <>
                  {measurements.items_data.length > 0 && (
                    <>
                      <div className="table-scroll my-2">
                        <div className="fw-bold my-2 ">
                          {t("Complaint number")} -{" "}
                          {measurements?.complaintDetails.complaint_unique_id}
                        </div>
                        <Table className="text-body my-3 Roles">
                          <thead>
                            {/* <tr>
                              <th colSpan={2}></th>
                            </tr> */}
                            <tr>
                              <th style={{ maxWidth: "50px" }}>
                                {t("Order Line")}
                              </th>
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
                            <>
                              {measurements?.items_data.map((main, index) => {
                                return (
                                  <>
                                    <tr key={index} className="bg-light">
                                      <td>{main.order_line_number}</td>
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
                                            (total, itm) => total + +itm.qty,
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
                                          <td>{childItem?.length}</td>
                                          <td>{childItem?.breadth}</td>
                                          <td>{childItem?.depth}</td>
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
                              })}
                            </>
                          </tbody>
                        </Table>
                      </div>
                    </>
                  )}
                </>
              );
            })}
          </div>
        );
      })}
    </CardComponent>
  );
};

export default ViewInvoiceDetails;
