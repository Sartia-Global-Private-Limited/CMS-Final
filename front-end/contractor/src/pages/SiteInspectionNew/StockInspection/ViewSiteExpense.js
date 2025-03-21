import React, { useEffect, useState } from "react";
import { Col, Row, Table } from "react-bootstrap";
import ImageViewer from "../../../components/ImageViewer";
import { useLocation, useParams } from "react-router-dom";

import {
  getApprovedSiteExpenseRequestData,
  getPartialSiteExpenseRequestData,
  getPendingSiteExpenseRequestData,
} from "../../../services/contractorApi";
import CardComponent from "../../../components/CardComponent";
import { printDiv } from "../../../services/helperFunctions";
import { useTranslation } from "react-i18next";

export default function ViewSiteExpense() {
  const location = useLocation();
  const outletId = location?.state?.outletId;
  const month = location?.state?.month;
  const type = location?.state?.type;
  const [edit, setEdit] = useState({});
  const { t } = useTranslation();

  const selected = JSON.parse(localStorage.getItem("body-bg"));
  const bg = `rgba(${selected?.r || 233},${selected?.g || 233},${
    selected?.b || 240
  },${selected?.a || 1})`;

  const fetchTransferDetails = async () => {
    const res =
      type == "pending"
        ? await getPendingSiteExpenseRequestData(outletId, month.split("-")[1])
        : type == "partial"
        ? await getPartialSiteExpenseRequestData(outletId, month.split("-")[1])
        : await getApprovedSiteExpenseRequestData(
            outletId,
            month.split("-")[1]
          );
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit([]);
    }
  };

  useEffect(() => {
    fetchTransferDetails();
  }, []);

  return (
    <div>
      <CardComponent title={"View Site Inspection"} showBackButton={true}>
        {type == "approved" && (
          <div className="d-flex justify-content-end my-2">
            {" "}
            <button
              type="button"
              onClick={() => {
                printDiv("printing");
              }}
              className="shadow border-0 cursor-pointer px-4 py-1 purple-combo "
            >
              {t("Print")}
            </button>
          </div>
        )}
        <div id="printing">
          {edit?.length > 0 &&
            edit.map((data, index) => {
              return (
                <div className="main my-2">
                  <Row className="">
                    <Col md={6} className="my-1">
                      <div className="p-20 shadow rounded h-100">
                        <strong className="text-secondary">
                          {t("User Details")}
                        </strong>

                        <ul className="list-unstyled m-2">
                          <li>
                            {t("Employee Name")}
                            <span className="fw-bold">
                              :{data?.userDetails?.[0]?.username}
                            </span>
                          </li>
                          <li>
                            {t("Employee Id")}
                            <span className="fw-bold">
                              : {data?.userDetails?.[0]?.employee_id}
                            </span>{" "}
                          </li>
                          <li>
                            {t("complaint Unique Id")}
                            <span className="fw-bold">
                              : {data.itemDetails?.[0].complaint_unique_id}
                            </span>
                          </li>
                        </ul>
                      </div>
                    </Col>

                    {type == "approved" && (
                      <Col md={6} className="my-1">
                        <div className="p-20 shadow rounded h-100">
                          <strong className="text-secondary my-2">
                            {" "}
                            {t("Complaint Assigned")}
                          </strong>
                          <br />
                          <span>
                            {t("Employee Name")}-
                            {data?.getAssignDetail[0]?.office_user_name ||
                              data.getAssignDetail?.[0]?.end_user_name ||
                              data.getAssignDetail?.[0]?.supervisor_name ||
                              data.getAssignDetail?.[0]?.area_manager_name}
                          </span>
                          <br />
                        </div>
                      </Col>
                    )}

                    <Col md={6} sm={6} className="my-1">
                      <div className="p-20 shadow rounded h-100">
                        <strong className="text-secondary">
                          {t("Feedback Details By Office")}
                        </strong>

                        <ul className="list-unstyled m-2">
                          <li>
                            {t("contact Person Name")}
                            <span className="fw-bold">
                              :{data?.confirmDetails?.[0]?.contact_person}
                            </span>
                          </li>
                          <li>
                            {t("contact Person phone")}
                            <span className="fw-bold">
                              :{" "}
                              {data?.confirmDetails?.[0]?.contact_person_number}
                            </span>{" "}
                          </li>

                          <li>
                            {t("contact person email")}
                            <span className="fw-bold">
                              : {data?.confirmDetails?.[0]?.email}
                            </span>{" "}
                          </li>
                        </ul>
                      </div>
                    </Col>

                    {type == "approved" && (
                      <Col md={6} sm={6} className="my-1">
                        <div className="p-20 shadow rounded h-100">
                          <strong className="text-secondary">
                            {t("Feedback Details By Site User")}
                          </strong>

                          <ul className="list-unstyled m-2">
                            <li>
                              {t("Area Manager Name")}
                              <span className="fw-bold">
                                :{data?.confirmDetails?.[0]?.area_manager_name}
                              </span>
                            </li>
                            <li>
                              {t("supervisor name")}
                              <span className="fw-bold">
                                : {data?.confirmDetails?.[0]?.supervisor_name}
                              </span>{" "}
                            </li>

                            <li>
                              {t("Enduser name")}{" "}
                              <span className="fw-bold">
                                : {data?.confirmDetails?.[0]?.end_user_name}
                              </span>{" "}
                            </li>
                            <li>
                              {t("contact Number")}
                              <span className="fw-bold">
                                : {data?.confirmDetails?.[0]?.contact_number}
                              </span>
                            </li>
                          </ul>
                        </div>
                      </Col>
                    )}
                  </Row>

                  <Col md={12} className="my-2">
                    <div className="p-20 shadow rounded h-100">
                      <div className="mt-2">
                        <Table className="table-sm table Roles">
                          <thead>
                            <tr>
                              <th>{t("Sr No.")}</th>
                              <th>{t("item")}</th>
                              <th>{t("Item Price")}</th>
                              <th>{t("Item Quantity")}</th>
                              <th>{t("Office Approve Qty")}</th>
                              {type === "approved" && (
                                <th>{t("Site Approved Quantity")}</th>
                              )}
                              <th>{t("Total")}</th>
                              <th>{t("Approved Date & Time")}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data?.itemDetails?.length > 0 &&
                              data?.itemDetails?.map((itm, idx) => {
                                return (
                                  <tr key={idx}>
                                    <td>{idx + 1}</td>
                                    <td>
                                      <ImageViewer
                                        src={
                                          itm?.item_image
                                            ? `${process.env.REACT_APP_API_URL}${itm?.item_image}`
                                            : `${process.env.REACT_APP_API_URL}/assets/images/no-image.png`
                                        }
                                      >
                                        <img
                                          width={30}
                                          height={30}
                                          className="my-bg object-fit p-1 rounded-circle"
                                          src={
                                            itm?.item_image
                                              ? `${process.env.REACT_APP_API_URL}${itm?.item_image}`
                                              : `${process.env.REACT_APP_API_URL}/assets/images/no-image.png`
                                          }
                                        />{" "}
                                        {itm?.item_name}
                                      </ImageViewer>
                                    </td>

                                    <td>₹{itm?.item_rate}</td>
                                    <td>{itm?.item_qty}</td>
                                    <td>{itm?.office_approved_qty}</td>

                                    {type == "approved" && (
                                      <td>{itm?.site_approved_qty}</td>
                                    )}
                                    <td>
                                      ₹ {itm?.total_office_approved_amounts}
                                    </td>
                                    <td>{itm?.approved_at ?? "--"}</td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </Table>

                        <div className=" d-flex justify-content-end my-2 fs-6">
                          {t("Total Office Approve Amount")}
                          <span className="fw-bold mx-1 text-green ">
                            ₹ {data?.total}
                          </span>
                        </div>

                        {type == "approved" && (
                          <div className=" d-flex justify-content-end my-2 fs-6">
                            {t("Total Site Approve Amount")}
                            <span className="fw-bold mx-1 text-green ">
                              ₹ {data?.total_site_amount}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Col>
                </div>
              );
            })}
        </div>
      </CardComponent>
    </div>
  );
}
