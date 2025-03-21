import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import Select from "react-select";

import ImageViewer from "../../components/ImageViewer";
import { useParams } from "react-router-dom";
import { getExpenseRequestDetails } from "../../services/contractorApi";
import { Helmet } from "react-helmet";
import CardComponent from "../../components/CardComponent";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { useTranslation } from "react-i18next";

export const ViewExpenseRequest = () => {
  const { t } = useTranslation();
  let currentDate = new Date();

  function isEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  }

  const months = [
    {
      label: "January",
      value: "1",
    },
    {
      label: "February",
      value: "2",
    },
    {
      label: "March",
      value: "3",
    },
    {
      label: "April",
      value: "4",
    },
    {
      label: "May",
      value: "5",
    },
    {
      label: "June",
      value: "6",
    },
    {
      label: "July",
      value: "7",
    },
    {
      label: "August",
      value: "8",
    },
    {
      label: "September",
      value: "9",
    },
    {
      label: "October",
      value: "10",
    },
    {
      label: "November",
      value: "11",
    },
    {
      label: "December",
      value: "12",
    },
  ];

  const getDate = (inputDate) => {
    if (inputDate) {
      const [year, month] = inputDate.split("-");
      const date = new Date(`${month}-01-${year}`);
      const formattedDate = new Intl.DateTimeFormat("en-US", {
        month: "long",
        year: "numeric",
      }).format(date);

      return formattedDate;
    }
  };

  const [item, setItems] = useState([]);
  const [month, setMonth] = useState(
    findMonthByValue(currentDate.getMonth() + 1)
  );
  const [open, setOpen] = useState({ row: false, id: "" });
  const params = useParams();

  useEffect(() => {
    if (params.id) getAllExpenseRequest();
  }, [month]);

  const getAllExpenseRequest = async () => {
    const res = await getExpenseRequestDetails(params?.id, month.value);
    setItems(res.data);
  };

  let statusColor = "";
  let statusText = "";

  switch (+item?.status) {
    case 0:
      statusColor = "#D9512C"; // Pending
      statusText = "Pending";
      break;
    case 1:
      statusColor = "green"; // Approved
      statusText = "Approved";
      break;
    case 2:
      statusColor = "red"; // Reject
      statusText = "Rejected";
      break;
    case 3:
      statusColor = "orange"; // Hold
      statusText = "On Hold";
      break;
    case 4:
      statusColor = "blue"; // Partial
      statusText = "Partial";
      break;
    case 5:
      statusColor = "green"; // Done
      statusText = "Done";
      break;
  }

  function findMonthByValue(value) {
    for (let i = 0; i < months.length; i++) {
      if (months[i].value == value) {
        return months[i];
      }
    }
    return null;
  }

  return (
    <Col md="12">
      <Helmet>
        <title>Expense Request · CMS Electricals</title>
      </Helmet>
      <CardComponent title={"All Expense Request"}>
        <Form.Group as={Col} md={3}>
          <Select
            placeholder="Select Month"
            menuPortalTarget={document.body}
            options={months}
            onChange={(e) => setMonth(e)}
            value={month}
          />
        </Form.Group>

        {item && (
          <Col md={12} className="my-3">
            <div className="p-20 shadow rounded h-100">
              <strong className="text-secondary">{t("Expense Fund")}</strong>
              <div className="mt-2">
                <table className="table-sm table">
                  <tbody>
                    <tr>
                      <th>{t("Name")} :</th>
                      <td style={{ color: statusColor }}>
                        {item?.users?.[0]?.name}
                      </td>
                    </tr>

                    <tr>
                      <th>{t("For Month")} :</th>
                      <td>{month?.label}</td>
                    </tr>

                    <tr>
                      <th>{t("total Amount")} :</th>
                      <td className="text-green">
                        ₹ {item?.currentMonth?.overallTotalSum}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Col>
        )}

        <Col md={12} className="my-3">
          <div className="p-20 shadow rounded h-100">
            <strong className="text-secondary">{t("Items List")}</strong>
            <div className="mt-2">
              <Table className="table-sm table Roles">
                <thead>
                  <tr>
                    <th>{t("Sr No.")}</th>
                    <th>{t("Item Name")}</th>
                    <th>{t("Item Price")}</th>
                    <th>{t("Quantity")}</th>
                    <th>{t("Total")}</th>
                    <th>{t("Final Amount")}</th>
                    <th>{t("Remaining Quantity")}</th>
                    <th>{t("Remaining Amount")}</th>
                    <th>{t("Approve Date")}</th>
                    <th>{t("Action")}</th>
                  </tr>
                </thead>
                <tbody>
                  {!isEmpty(item?.currentMonth?.items) ? (
                    Object.values(item?.currentMonth?.items).map(
                      (main, index) => (
                        <>
                          {main.data.map((itm, idx) => {
                            if (idx == 0)
                              return (
                                <>
                                  <tr key={idx}>
                                    <td>{index + 1}</td>
                                    <td>
                                      <div className="d-flex">
                                        <ImageViewer
                                          src={
                                            itm.item_images
                                              ? process.env.REACT_APP_API_URL +
                                                itm.item_images
                                              : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                          }
                                        >
                                          <img
                                            src={
                                              itm.item_images
                                                ? process.env
                                                    .REACT_APP_API_URL +
                                                  itm.item_images
                                                : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                            }
                                            className="avatar me-2"
                                          />
                                        </ImageViewer>

                                        <span className="small d-grid">
                                          <span>
                                            {itm?.item_name || itm?.new_item}
                                          </span>
                                          <span className="text-gray">
                                            {itm.item_name?.unique_id
                                              ? `(${itm.item_name?.unique_id})`
                                              : "-"}
                                          </span>
                                        </span>
                                      </div>
                                    </td>

                                    <td>₹ {itm?.item_price}</td>
                                    <td> {itm.request_qty}</td>
                                    <td> ₹ {itm?.total_approve_amount}</td>
                                    <td> ₹ {main?.totalSum ?? "--"}</td>
                                    <td>{main?.remainingQty ?? "--"}</td>
                                    <td>{main?.remainingAmount ?? "--"}</td>
                                    <td> {itm?.requested_date}</td>
                                    <td>
                                      {open.row && open.id == index ? (
                                        <BsChevronUp
                                          fontSize={"large"}
                                          className="cursor-pointer"
                                          onClick={() =>
                                            setOpen({
                                              row: !open.row,
                                              id: index,
                                            })
                                          }
                                        />
                                      ) : (
                                        <BsChevronDown
                                          fontSize={"large"}
                                          className="cursor-pointer"
                                          onClick={() =>
                                            setOpen({
                                              row: !open.row,
                                              id: index,
                                            })
                                          }
                                        />
                                      )}
                                    </td>
                                  </tr>
                                </>
                              );
                          })}

                          {/* dropdown data */}

                          {open.row && open.id == index && (
                            <>
                              {main.data.length > 1 ? (
                                main.data.map((itm, idx) => {
                                  if (idx != 0)
                                    return (
                                      <>
                                        <tr
                                          key={idx}
                                          className="fw-bold bg-white"
                                        >
                                          <td></td>
                                          <td className="text-center">--</td>
                                          <td>₹ {itm?.item_price}</td>
                                          <td> {itm.request_qty}</td>
                                          <td>
                                            {" "}
                                            ₹ {itm?.total_approve_amount}
                                          </td>
                                          <td> --</td>
                                          <td>--</td>
                                          <td>--</td>
                                          <td> {itm?.requested_date}</td>
                                          <td> </td>
                                        </tr>
                                      </>
                                    );
                                })
                              ) : (
                                <tr>
                                  {" "}
                                  <td colSpan={8}> {t("No More Data")}</td>
                                </tr>
                              )}
                            </>
                          )}
                        </>
                      )
                    )
                  ) : (
                    <td colSpan={9}>
                      <img
                        className="p-3"
                        alt="no-result"
                        width="200"
                        src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                      />
                    </td>
                  )}

                  {item?.length > 0 && (
                    <tr>
                      <td colSpan={5}></td>
                      <td colSpan={1} className="fw-bold ">
                        {t("total request amt")} -
                      </td>
                      <td className="text-start  fw-bold">
                        <b>
                          ₹{" "}
                          {item[0]?.data.reduce(
                            (userTotal, item) =>
                              userTotal + +item?.item_price * item?.request_qty,
                            0
                          )}{" "}
                        </b>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </div>
        </Col>

        <Col md={12} className="my-3">
          <div className="p-20 shadow rounded h-100">
            <strong className="text-secondary">
              {t("Items List of Previous month")}
            </strong>
            <div className="mt-2">
              <Table className="table-sm table Roles">
                <thead>
                  <tr>
                    <th>{t("Sr No.")}</th>
                    <th>{t("Item Name")}</th>
                    <th>{t("Item Price")}</th>
                    <th>{t("Quantity")}</th>
                    <th>{t("Total")}</th>
                    <th>{t("Final Amount")}</th>
                    <th>{t("Remaining Quantity")}</th>
                    <th>{t("Remaining Amount")}</th>
                    <th>{t("Approve Date")}</th>
                    <th>{t("Action")}</th>
                  </tr>
                </thead>
                <tbody>
                  {!isEmpty(item?.previousMonth?.items) ? (
                    Object?.values(item?.previousMonth?.items).map(
                      (main, index) => (
                        <>
                          {main.data.map((itm, idx) => {
                            if (idx == 0)
                              return (
                                <>
                                  <tr key={idx}>
                                    <td>{index + 1}</td>
                                    <td>
                                      <div className="d-flex">
                                        <ImageViewer
                                          src={
                                            itm.item_images
                                              ? process.env.REACT_APP_API_URL +
                                                itm.item_images
                                              : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                          }
                                        >
                                          <img
                                            src={
                                              itm.item_images
                                                ? process.env
                                                    .REACT_APP_API_URL +
                                                  itm.item_images
                                                : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                            }
                                            className="avatar me-2"
                                          />
                                        </ImageViewer>

                                        <span className="small d-grid">
                                          <span>
                                            {itm?.item_name || itm?.new_item}
                                          </span>
                                          <span className="text-gray">
                                            {itm.item_name?.unique_id
                                              ? `(${itm.item_name?.unique_id})`
                                              : "-"}
                                          </span>
                                        </span>
                                      </div>
                                    </td>

                                    <td>₹ {itm?.item_price}</td>
                                    <td> {itm.request_qty}</td>
                                    <td> ₹ {itm?.total_approve_amount}</td>
                                    <td> ₹ {main?.totalSum ?? "--"}</td>

                                    <td>{main?.remainingQty ?? "--"}</td>
                                    <td>₹ {main?.remainingAmount ?? "--"}</td>

                                    <td> {itm?.requested_date}</td>
                                    <td>
                                      {open.row && open.id == index ? (
                                        <BsChevronUp
                                          fontSize={"large"}
                                          className="cursor-pointer"
                                          onClick={() =>
                                            setOpen({
                                              row: !open.row,
                                              id: index,
                                            })
                                          }
                                        />
                                      ) : (
                                        <BsChevronDown
                                          fontSize={"large"}
                                          className="cursor-pointer"
                                          onClick={() =>
                                            setOpen({
                                              row: !open.row,
                                              id: index,
                                            })
                                          }
                                        />
                                      )}
                                    </td>
                                  </tr>
                                </>
                              );
                          })}

                          {/* dropdown data */}

                          {open.row && open.id == index && (
                            <>
                              {main.data.length > 1 ? (
                                main.data.map((itm, idx) => {
                                  if (idx != 0)
                                    return (
                                      <>
                                        <tr
                                          key={idx}
                                          className=" fw-bold bg-light"
                                        >
                                          <td></td>
                                          <td className="text-center">--</td>
                                          <td>₹ {itm?.item_price}</td>
                                          <td> {itm.request_qty}</td>
                                          <td>
                                            {" "}
                                            ₹ {itm?.total_approve_amount}
                                          </td>
                                          <td> ₹ {itm?.amount ?? "--"}</td>
                                          <td>{itm?.remainingQty ?? "--"}</td>
                                          <td>
                                            {itm?.remainingAmount ?? "--"}
                                          </td>
                                          <td> {itm?.requested_date}</td>
                                          <td> </td>
                                        </tr>
                                      </>
                                    );
                                })
                              ) : (
                                <tr>
                                  {" "}
                                  <td colSpan={8}> {t("No More Data")}</td>
                                </tr>
                              )}
                            </>
                          )}
                        </>
                      )
                    )
                  ) : (
                    <td colSpan={9}>
                      <img
                        className="p-3"
                        alt="no-result"
                        width="200"
                        src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                      />
                    </td>
                  )}

                  {item?.length > 0 && (
                    <tr>
                      <td colSpan={5}></td>
                      <td colSpan={1} className="fw-bold ">
                        {t("total request amt")} -
                      </td>
                      <td className="text-start  fw-bold">
                        <b>
                          ₹{" "}
                          {item[0]?.data.reduce(
                            (userTotal, item) =>
                              userTotal + +item?.item_price * item?.request_qty,
                            0
                          )}{" "}
                        </b>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </div>
        </Col>
      </CardComponent>
    </Col>
  );
};
