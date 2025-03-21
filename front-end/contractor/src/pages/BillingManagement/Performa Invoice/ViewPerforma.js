import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Col, Stack, Table } from "react-bootstrap";
import { BsRecord2 } from "react-icons/bs";
import {
  getDetailPerforma,
  getDetailsOfFinalMergeToPI,
} from "../../../services/contractorApi";
import CardComponent from "../../../components/CardComponent";
import { useTranslation } from "react-i18next";

const ViewPerforma = () => {
  const location = useLocation();
  const id = location?.state?.id;
  const show = location.state?.show;
  const navigate = useNavigate();
  const [data, setData] = useState();
  const { t } = useTranslation();
  const fetchExpenseRequestData = async () => {
    const res =
      show == "finalPI"
        ? await getDetailsOfFinalMergeToPI(id)
        : await getDetailPerforma(id);
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
    <CardComponent showBackButton={true} title={"Performa Details"}>
      <div className="d-flex">
        <Col md={6}>
          <div className="p-20 shadow rounded h-100">
            <strong className="text-secondary">{t("Details")}</strong>
            <div className="mt-2">
              <table className="table-sm table">
                <tbody>
                  <tr>
                    <th>{t("financial year")} :</th>
                    <td>{data?.financial_year}</td>
                  </tr>
                  <tr>
                    <th>{t("po Number")} :</th>
                    <td>{data?.po_number}</td>
                  </tr>
                  <tr>
                    <th>{t("regional office")} :</th>
                    <td>{data?.regional_office_name}</td>
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
                    <th>{t("Complaint unique id")} :</th>
                    <td>
                      {data?.complaintDetails?.map((item, idx) => (
                        <li> {item?.complaint_unique_id ?? "--"}</li>
                      )) ?? "--"}
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
                    <th>{t("PI Number")} :</th>
                    <td>{data?.bill_no}</td>
                  </tr>
                  <tr>
                    <th>{t("Bill from")} :</th>
                    <td>{data?.billing_from?.company_name}</td>
                  </tr>
                  <tr>
                    <th>{t("billing from state")} :</th>
                    <td>{data?.billing_from_state}</td>
                  </tr>
                  <tr>
                    <th>{t("billing to")} :</th>
                    <td>{data?.billing_to?.company_name}</td>
                  </tr>
                  <tr>
                    <th>{t("billing to ro office")}: </th>
                    <td>{data?.billing_to_ro_office?.ro_name}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Col>
      </div>
      {data?.getMeasurements?.map((parentItem, parentIndex) => {
        return (
          <>
            <Col md={12}>
              <div className="p-20 shadow rounded">
                <strong className="text-secondary">{t("Item List")}</strong>
                <br />
                <span>
                  {t("COMPLAINT ID")} :{" "}
                  {parentItem?.complaintDetails?.complaint_unique_id}
                </span>
              </div>
            </Col>
            {data?.getMeasurements?.length > 0 && (
              <>
                <div className="table-scroll ">
                  <Table className="text-body my-3 Roles">
                    <thead>
                      <tr>
                        <th>{t("Order Line")}</th>
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
                        {parentItem?.items_data.map((main, index) => {
                          return (
                            <>
                              <tr key={index} className="bg-light">
                                <td>{main?.order_line_number}</td>
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
      <Col md={12}>
        <div className="p-20 shadow rounded h-100">
          <strong className="text-secondary">{t("External Field")}</strong>
          <div className="mt-2">
            <table className="table-sm table">
              <tbody>
                <tr>
                  <th>{t("created by")} :</th>
                  <td>{data?.created_by_name}</td>
                </tr>
                <tr>
                  <th>{t("work")} :</th>
                  <td>{data?.work}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Col>
    </CardComponent>
  );
};

export default ViewPerforma;
