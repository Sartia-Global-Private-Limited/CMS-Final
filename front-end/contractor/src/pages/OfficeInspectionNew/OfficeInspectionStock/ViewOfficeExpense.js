import React, { useEffect, useState } from "react";
import { Col, Table } from "react-bootstrap";
import ImageViewer from "../../../components/ImageViewer";
import { useLocation } from "react-router-dom";
import {
  getOfficeExpenseRequestByOutletIdForApproved,
  getOfficeExpenseRequestByOutletIdForPartial,
  getOfficeExpenseRequestByOutletIdForPending,
} from "../../../services/contractorApi";
import CardComponent from "../../../components/CardComponent";
import { printDiv } from "../../../services/helperFunctions";
import { useTranslation } from "react-i18next";

export default function ViewOfficeExpense() {
  const location = useLocation();
  const outletId = location?.state?.outletId;
  const month = location?.state?.month;
  const allData = location?.state?.allData;
  const type = location?.state?.type;
  const [edit, setEdit] = useState({});
  const { t } = useTranslation();

  const fetchTransferDetails = async () => {
    const res =
      type == "pending"
        ? await getOfficeExpenseRequestByOutletIdForPending({
            outlet_id: outletId,
            month: month.split("-")[1],
            params: { user_id: allData?.user_id },
          })
        : type == "partial"
        ? await getOfficeExpenseRequestByOutletIdForPartial(
            outletId,
            month.split("-")[1]
          )
        : await getOfficeExpenseRequestByOutletIdForApproved(
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
      <CardComponent title={"View Office Expense Punch"} showBackButton={true}>
        {type == "approved" && (
          <div className="d-flex justify-content-end my-2">
            {" "}
            <button
              onClick={() => printDiv("printing")}
              className="shadow border-0 cursor-pointer px-4 py-1 purple-combo "
            >
              {t("Print")}
            </button>
          </div>
        )}

        <div id="printing">
          <div className="sticky-top bg-blue">
            <Col md={12} sm={12}>
              <div className="p-20 shadow rounded h-100">
                <strong className="text-secondary">
                  {t("Outlet Details")}
                </strong>

                <ul className="list-unstyled m-2">
                  <li>
                    {t("outlet Name")}
                    <span className="fw-bold">
                      :{edit?.[0]?.outletDetails?.[0]?.outlet_name}
                    </span>
                  </li>

                  <li>
                    {t("complaint Unique Id")}
                    <span className="fw-bold">
                      : {edit?.[0]?.outletDetails?.[0]?.outlet_unique_id}
                    </span>
                  </li>
                </ul>
              </div>
            </Col>
          </div>
          {edit?.length > 0 &&
            edit.map((data, index) => {
              return (
                <div className="main my-2">
                  <div className="d-flex">
                    <Col md={6} sm={6}>
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
                      <Col md={6} sm={6}>
                        <div className="p-20 shadow rounded h-100">
                          <strong className="text-secondary">
                            {t("Feedback Details")}
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
                                {
                                  data?.confirmDetails?.[0]
                                    ?.contact_person_number
                                }
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
                    )}
                  </div>

                  <Col md={12} className="mb-4">
                    <div className="p-20 shadow rounded h-100">
                      <div className="mt-2">
                        <Table className="table-sm table Roles ">
                          <thead>
                            <tr>
                              <th>{t("Sr No.")}</th>
                              <th>{t("item")}</th>
                              <th>{t("Item Price")}</th>
                              <th>{t("Quantity")}</th>
                              {type === "approved" && (
                                <th>{t("Approved Quantity")}</th>
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
                                    <td>{itm?.approved_qty}</td>

                                    {type == "approved" && (
                                      <td>{itm?.office_approved_qty}</td>
                                    )}
                                    <td>₹ {itm?.total_approved_amount}</td>
                                    <td>{itm?.approved_at ?? "--"}</td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </Table>

                        <div className=" d-flex justify-content-end my-2 fs-6">
                          {t("Total requested Amount")} ₹{" "}
                          <span className="fw-bold mx-1 text-green ">
                            {data?.total}
                          </span>
                        </div>

                        {type == "approved" && (
                          <div className=" d-flex justify-content-end my-2 fs-6">
                            {t("Total Office Approve Amount")} ₹{" "}
                            <span className="fw-bold mx-1 text-green ">
                              {data?.total_office_amount}
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
