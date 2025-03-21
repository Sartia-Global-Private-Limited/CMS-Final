import React, { useState } from "react";
import { Col, Row, Table } from "react-bootstrap";
import ImageViewer from "../../../components/ImageViewer";
import ActionButton from "../../../components/ActionButton";
import { BsDashLg, BsPlusLg } from "react-icons/bs";
import { useTranslation } from "react-i18next";

export const ViewFundRequest = ({ edit }) => {
  let statusColor = "";
  let statusText = "";

  switch (+edit?.status) {
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

  const [collapsedRows, setCollapsedRows] = useState([]);
  const { t } = useTranslation();
  const toggleRow = (index) => {
    setCollapsedRows((prev) => {
      const isCollapsed = prev.includes(index);
      if (isCollapsed) {
        return prev.filter((rowIndex) => rowIndex !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  return (
    <Row className="g-3">
      <Col md={12}>
        <div className="p-20 shadow rounded h-100">
          <strong className="text-secondary">{t("Request Fund")}</strong>
          <div className="mt-2">
            <table className="table-sm table">
              <tbody>
                <tr>
                  <th>{t("Status")} :</th>
                  <td style={{ color: statusColor }}>{statusText}</td>
                </tr>
                <tr>
                  <th className="align-middle">{t("Requested By")} :</th>
                  <td>
                    <ImageViewer
                      src={
                        edit.user_image
                          ? `${process.env.REACT_APP_API_URL}${edit.user_image}`
                          : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                      }
                    >
                      <img
                        width={35}
                        height={35}
                        className="my-bg object-fit p-1 rounded-circle"
                        src={
                          edit.user_image
                            ? `${process.env.REACT_APP_API_URL}${edit.user_image}`
                            : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                        }
                      />
                    </ImageViewer>
                    {edit?.request_by}
                  </td>
                </tr>
                <tr>
                  <th>{t("request date")} :</th>
                  <td>{edit?.request_date}</td>
                </tr>
                <tr>
                  <th>{t("last balance")} :</th>
                  <td>{edit?.user_balance || "0"}</td>
                </tr>
                <tr></tr>
              </tbody>
            </table>
          </div>
        </div>
      </Col>

      {edit?.request_fund?.request_fund?.length > 0 && (
        <Col md={12}>
          <div className="p-20 shadow rounded h-100">
            <strong className="text-secondary">{t("Request Data")}</strong>
            <div className="mt-2">
              <Table className="table-sm table Roles">
                <thead>
                  <tr>
                    <th>{t("Sr No.")}</th>
                    <th>{t("Item Name")}</th>
                    <th>{t("prev Price")}</th>
                    <th>{t("Prev user stock")}</th>
                    <th>{t("request price")}</th>
                    <th>{t("request stock")}</th>
                    <th>{t("request amount")}</th>
                    <th>{t("Action")}</th>
                  </tr>
                </thead>
                <tbody>
                  {edit?.request_fund?.request_fund?.map((itm, idx) => (
                    <>
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>
                          <div className="d-flex">
                            <ImageViewer
                              src={
                                itm.item_name?.image
                                  ? process.env.REACT_APP_API_URL +
                                    itm.item_name?.image
                                  : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                              }
                            >
                              <img
                                src={
                                  itm.item_name?.image
                                    ? process.env.REACT_APP_API_URL +
                                      itm.item_name?.image
                                    : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                }
                                className="avatar me-2"
                              />
                            </ImageViewer>
                            <span className="small d-grid">
                              <span>{itm.item_name?.label}</span>
                              <span className="text-gray">
                                {itm.item_name?.unique_id
                                  ? `(${itm.item_name?.unique_id})`
                                  : "-"}
                              </span>
                            </span>
                          </div>
                        </td>
                        <td>₹ {itm.previous_price}</td>
                        <td>₹ {itm.current_user_stock}</td>
                        <td>₹ {itm.new_price}</td>
                        <td>{itm.request_quantity}</td>
                        <td>₹ {itm.fund_amount}</td>
                        <td>
                          <span
                            className={`cursor-pointer text-${
                              collapsedRows.includes(idx) ? "danger" : "green"
                            }`}
                            onClick={() => toggleRow(idx)}
                          >
                            {collapsedRows.includes(idx) ? (
                              <BsDashLg fontSize={"large"} />
                            ) : (
                              <BsPlusLg fontSize={"large"} />
                            )}
                          </span>
                        </td>
                      </tr>
                      {collapsedRows.includes(idx) && (
                        <tr>
                          <td className="text-start" colSpan="8">
                            <span className="fw-bold">{t("Description")}:</span>{" "}
                            {itm.description}
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                  <tr>
                    <td colSpan={5}></td>
                    <td colSpan={1} className="fw-bold ">
                      {t("total request amt")} -
                    </td>
                    <td className="text-start  fw-bold">
                      <b>
                        ₹{" "}
                        {edit?.request_fund?.request_fund.reduce(
                          (userTotal, item) => userTotal + +item.fund_amount,
                          0
                        )}{" "}
                      </b>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </div>
        </Col>
      )}

      {edit?.request_fund?.new_request_fund?.length > 0 && (
        <Col md={12}>
          <div className="p-20 shadow rounded h-100">
            <strong className="text-secondary"> {t("New Request Data")}</strong>
            <div className="mt-2">
              <Table className="table-sm table Roles">
                <thead>
                  <tr>
                    <th>{t("Sr No.")}</th>
                    <th>{t("Item Name")}</th>
                    <th>{t("request price")}</th>
                    <th>{t("request stock")}</th>
                    <th>{t("request amount")}</th>
                    <th>{t("Action")}</th>
                  </tr>
                </thead>
                <tbody>
                  {edit?.request_fund?.new_request_fund?.map((itm, idx) => (
                    <>
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>
                          <div className="d-flex">
                            <ImageViewer
                              src={
                                itm?.item_image
                                  ? itm?.item_image
                                  : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                              }
                            >
                              <img
                                width={35}
                                height={35}
                                className="my-bg object-fit p-1 rounded-circle"
                                src={
                                  itm?.item_image
                                    ? itm?.item_image
                                    : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                }
                              />{" "}
                            </ImageViewer>
                            <span className="m-2 ">{itm?.title?.value}</span>
                          </div>
                        </td>

                        <td>₹ {itm?.rate}</td>
                        <td>{itm?.qty}</td>
                        <td>₹ {itm.fund_amount}</td>
                        <td>
                          <span
                            className={`cursor-pointer text-${
                              collapsedRows.includes(idx) ? "danger" : "green"
                            }`}
                            onClick={() => toggleRow(idx)}
                          >
                            {collapsedRows.includes(idx) ? (
                              <BsDashLg fontSize={"large"} />
                            ) : (
                              <BsPlusLg fontSize={"large"} />
                            )}
                          </span>
                        </td>
                      </tr>
                      {collapsedRows.includes(idx) && (
                        <tr>
                          <td className="text-start" colSpan="8">
                            <span className="fw-bold">{t("Description")}:</span>{" "}
                            {itm?.description}
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                  <tr>
                    <td colSpan={3}></td>
                    <td colSpan={1} className="fw-bold">
                      {t("total request amt")} -
                    </td>
                    <td className="text-start ">
                      <b>
                        ₹{" "}
                        {edit?.request_fund?.new_request_fund.reduce(
                          (userTotal, item) => userTotal + +item.fund_amount,
                          0
                        )}
                      </b>
                    </td>
                  </tr>

                  <tr>
                    <td colSpan={3}></td>
                    <td colSpan={1} className="fw-bold fs-6">
                      {t("Final Amount")} -
                    </td>
                    <td className="text-start fw-bold fs-6">
                      ₹ {edit?.total_request_amount}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </div>
        </Col>
      )}

      {(edit?.approved_data?.request_fund?.length > 0 ||
        edit?.approved_data?.new_request_fund?.length > 0) && (
        <>
          <Col md={12}>
            <div className="p-20 shadow rounded h-100">
              <strong className="text-secondary">{t("Approved Fund")}</strong>
              <div className="mt-2">
                <table className="table-sm table">
                  <tbody>
                    <tr>
                      <th>{t("Status")} :</th>
                      <td style={{ color: statusColor }}>{statusText}</td>
                    </tr>
                    <tr>
                      <th>{t("approved by")} :</th>
                      <td>
                        <ImageViewer
                          src={
                            edit.approved_image
                              ? `${process.env.REACT_APP_API_URL}${edit.approved_image}`
                              : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                          }
                        >
                          <img
                            width={35}
                            height={35}
                            className="my-bg object-fit p-1 rounded-circle"
                            src={
                              edit.approved_image
                                ? `${process.env.REACT_APP_API_URL}${edit.approved_image}`
                                : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                            }
                          />{" "}
                        </ImageViewer>
                        {edit?.approved_by_name} - {edit?.approved_employee_id}
                      </td>
                    </tr>
                    <tr>
                      <th>{t("approved at")} :</th>
                      <td>{edit?.approved_at}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Col>

          {edit?.approved_data?.request_fund?.length > 0 && (
            <Col md={12}>
              <div className="p-20 shadow rounded h-100">
                <strong className="text-secondary">{t("Approved Item")}</strong>
                <div className="mt-2">
                  <Table className="table-sm table Roles">
                    <thead>
                      <tr>
                        <th>{t("Sr No.")}</th>
                        <th>{t("Item Name")}</th>
                        <th>{t("Description")}</th>
                        <th>{t("Previous Price")}</th>
                        <th>{t("Request Price")}</th>
                        <th>{t("Request quantity")}</th>
                        <th>{t("approve price")}</th>
                        <th>{t("approve quantity")}</th>
                        <th>{t("Fund Amount")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {edit?.approved_data?.request_fund.map((itm, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>
                            <div className="d-flex">
                              <ImageViewer
                                src={
                                  itm.item_name?.image
                                    ? process.env.REACT_APP_API_URL +
                                      itm.item_name?.image
                                    : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                }
                              >
                                <img
                                  src={
                                    itm.item_name?.image
                                      ? process.env.REACT_APP_API_URL +
                                        itm.item_name?.image
                                      : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                  }
                                  className="avatar me-2"
                                />
                              </ImageViewer>
                              <span className="small d-grid">
                                <span>{itm.item_name?.label}</span>
                                <span className="text-gray">
                                  {itm.item_name?.unique_id
                                    ? `(${itm.item_name?.unique_id})`
                                    : "-"}
                                </span>
                              </span>
                            </div>
                          </td>
                          <td>{itm?.description ?? "--"}</td>

                          <td>{itm?.previous_price}</td>
                          <td>₹{itm?.new_price}</td>

                          <td> {itm.request_quantity}</td>
                          <td>₹{itm.price}</td>
                          <td> {itm.quantity}</td>
                          <td>₹ {itm.price * itm.quantity}</td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan={7}></td>
                        <td colSpan={1} className="fw-bold">
                          {t("total approved amt")}.
                        </td>
                        <td className="text-start fw-bold">
                          <b>
                            ₹{" "}
                            {edit?.approved_data?.request_fund.reduce(
                              (userTotal, item) =>
                                userTotal + +item?.quantity * item?.price,
                              0
                            )}
                          </b>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </div>
            </Col>
          )}

          {edit?.approved_data?.new_request_fund?.length > 0 && (
            <Col md={12}>
              <div className="p-20 shadow rounded h-100">
                <strong className="text-secondary">
                  {t("New Approved Item")}
                </strong>
                <div className="mt-2">
                  <Table className="table-sm table Roles">
                    <thead>
                      <tr>
                        <th>{t("Sr No.")}</th>
                        <th>{t("Item Name")}</th>
                        <th>{t("HSN Code")}</th>
                        <th>{t("Requested Price")}</th>
                        <th>{t("Requested quantity")}</th>
                        <th>{t("total request amount")}</th>
                        <th>{t("Approved Price")}</th>
                        <th>{t("Approved quantity")}</th>
                        <th>{t("total approved amount")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {edit?.approved_data?.new_request_fund.map((itm, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>
                            <div className="d-flex">
                              <ImageViewer
                                src={
                                  itm?.item_image
                                    ? itm?.item_image
                                    : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                }
                              >
                                <img
                                  width={35}
                                  height={35}
                                  className="my-bg object-fit p-1 rounded-circle"
                                  src={
                                    itm?.item_image
                                      ? itm?.item_image
                                      : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                  }
                                />{" "}
                              </ImageViewer>

                              <span className="m-2">{itm?.title?.value}</span>
                            </div>
                          </td>
                          <td>{itm?.hsncode}</td>
                          <td>{itm?.requested_rate}</td>
                          <td>{itm?.requested_qty}</td>
                          <td>₹ {itm.requested_rate * itm.requested_qty}</td>
                          <td>₹ {itm?.rate}</td>
                          <td>{itm?.qty}</td>
                          <td>₹ {itm?.rate * itm?.qty}</td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan={6}></td>
                        <td colSpan={2} className="fw-bold">
                          {t("total approved amt")}.
                        </td>
                        <td className="text-start fw-bold">
                          <b>
                            ₹{" "}
                            {edit?.approved_data?.new_request_fund.reduce(
                              (userTotal, item) =>
                                userTotal + +item?.qty * item?.rate,
                              0
                            )}
                          </b>
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={6}></td>
                        <td colSpan={2} className="fs-6 fw-bold">
                          {t("Final Approved Amount")}
                        </td>
                        <td className="text-start fs-6 fw-bold" colSpan={2}>
                          <b>₹ {edit?.total_approved_amount}</b>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </div>
            </Col>
          )}
        </>
      )}

      {(edit?.transfer_data?.transfer_fund?.length > 0 ||
        edit?.transfer_data?.new_transfer_fund?.length) > 0 && (
        <>
          <Col md={12}>
            <div className="p-20 shadow rounded h-100">
              <strong className="text-secondary">{t("Transfer Fund")}</strong>
              <div className="mt-2">
                <table className="table-sm table">
                  <tbody>
                    <tr>
                      <th>{t("Status")} :</th>
                      <td style={{ color: statusColor }}>{statusText}</td>
                    </tr>
                    <tr>
                      <th>{t("approved by")} :</th>
                      <td>
                        <ImageViewer
                          src={
                            edit.approved_image
                              ? `${process.env.REACT_APP_API_URL}${edit.approved_image}`
                              : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                          }
                        >
                          <img
                            width={35}
                            height={35}
                            className="my-bg object-fit p-1 rounded-circle"
                            src={
                              edit.approved_image
                                ? `${process.env.REACT_APP_API_URL}${edit.approved_image}`
                                : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                            }
                          />{" "}
                        </ImageViewer>
                        {edit?.approved_by_name} - {edit?.approved_employee_id}
                      </td>
                    </tr>
                    <tr>
                      <th>{t("approved at")} :</th>
                      <td>{edit?.approved_at}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Col>

          {edit?.transfer_data?.transfer_fund?.length > 0 && (
            <Col md={12}>
              <div className="p-20 shadow rounded h-100">
                <strong className="text-secondary">
                  {" "}
                  {t("Transfer Item")}{" "}
                </strong>
                <div className="mt-2">
                  <Table className="table-sm table Roles">
                    <thead>
                      <tr>
                        <th>{t("Sr No.")}</th>
                        <th>{t("Item Name")}</th>
                        <th>{t("Description")}</th>
                        <th>{t("HSN Code")}</th>
                        <th>{t("prev price")}</th>
                        <th>{t("current stock")}</th>
                        <th>{t("Item rate")}</th>
                        <th>{t("request qty")}</th>
                        <th>{t("total request amount")}</th>
                        <th>{t("approve qty")}</th>
                        <th>{t("approve price")}</th>
                        <th>{t("Transfer Quantity")}</th>
                        <th>{t("total transfer amount")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {edit?.transfer_data?.transfer_fund.map((itm, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>
                            <div className="d-flex">
                              <ImageViewer
                                src={
                                  itm.item_name?.image
                                    ? process.env.REACT_APP_API_URL +
                                      itm.item_name?.image
                                    : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                }
                              >
                                <img
                                  src={
                                    itm.item_name?.image
                                      ? process.env.REACT_APP_API_URL +
                                        itm.item_name?.image
                                      : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                  }
                                  className="avatar me-2"
                                />
                              </ImageViewer>
                              <span className="small d-grid">
                                <span>{itm.item_name?.label}</span>
                                <span className="text-gray">
                                  {itm.item_name?.unique_id
                                    ? `(${itm.item_name?.unique_id})`
                                    : "-"}
                                </span>
                              </span>
                            </div>
                          </td>
                          <td>{itm?.item_name.description}</td>

                          <td>{itm?.item_name?.hsncode}</td>
                          <td>₹ {itm.previous_price}</td>
                          <td>{itm.current_user_stock}</td>
                          <td>₹ {itm.new_price}</td>
                          <td>{itm.request_quantity}</td>
                          <td>₹ {itm.fund_amount}</td>
                          <td>{itm.quantity}</td>
                          <td>₹ {itm.price}</td>
                          <td> {itm.transfer_quantity}</td>
                          <td>₹ {itm.price * itm.transfer_quantity}</td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan={10}></td>
                        <td colSpan={1} className="fw-bold">
                          total Transfer amt.
                        </td>
                        <td className="text-start fw-bold">
                          <b>
                            ₹{" "}
                            {edit?.transfer_data?.transfer_fund.reduce(
                              (userTotal, item) =>
                                userTotal + +item?.request_transfer_fund,
                              0
                            ) || 0}
                          </b>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </div>
            </Col>
          )}

          {edit?.transfer_data?.new_transfer_fund?.length > 0 && (
            <Col md={12}>
              <div className="p-20 shadow rounded h-100">
                <strong className="text-secondary">
                  {t("New Transfer Item")}
                </strong>
                <div className="mt-2">
                  <Table className="table-sm table Roles">
                    <thead>
                      <tr>
                        <th>{t("Sr No.")}</th>
                        <th>{t("Item Name")}</th>
                        <th>{t("HSN Code")}</th>
                        <th>{t("Requested Price")}</th>
                        <th>{t("Requested Quantity")}</th>
                        <th>{t("Item rate")}</th>
                        <th>{t("Approved Quantity")}</th>
                        <th>{t("Transfer Quantity")}</th>
                        <th>{t("total transfer amount")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {edit?.transfer_data?.new_transfer_fund.map(
                        (itm, idx) => (
                          <tr key={idx}>
                            <td>{idx + 1}</td>
                            <td>
                              <div className="d-flex">
                                <ImageViewer
                                  src={
                                    itm?.item_image
                                      ? itm?.item_image
                                      : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                  }
                                >
                                  <img
                                    width={35}
                                    height={35}
                                    className="my-bg object-fit p-1 rounded-circle"
                                    src={
                                      itm?.item_image
                                        ? itm?.item_image
                                        : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                    }
                                  />{" "}
                                </ImageViewer>

                                <span className="m-2">{itm?.title?.value}</span>
                              </div>
                            </td>
                            <td>{itm?.hsncode}</td>
                            <td>₹{itm?.requested_rate}</td>
                            <td>{itm?.requested_qty}</td>
                            <td>₹ {itm?.rate}</td>
                            <td>{itm?.qty}</td>
                            <td>{itm?.transfer_quantity}</td>
                            <td>₹ {itm.request_transfer_fund}</td>
                          </tr>
                        )
                      )}
                      <tr>
                        <td colSpan={6}></td>
                        <td colSpan={2} className="fw-bold">
                          {t("total transfer amt")}.
                        </td>
                        <td className="text-start ">
                          <b>
                            ₹{" "}
                            {edit?.transfer_data?.new_transfer_fund
                              ? edit?.transfer_data?.new_transfer_fund.reduce(
                                  (userTotal, item) =>
                                    userTotal + item?.request_transfer_fund,
                                  0
                                )
                              : 0}
                          </b>
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={6}></td>
                        <td colSpan={2} className="fs-6 fw-bold">
                          {t("Final transfer Amount")}
                        </td>

                        <td className="text-start  fs-6 fw-bold" colSpan={2}>
                          <b>
                            ₹
                            {(edit?.transfer_data?.transfer_fund.reduce(
                              (userTotal, item) =>
                                userTotal + +item?.request_transfer_fund,
                              0
                            ) || 0) +
                              edit?.transfer_data?.new_transfer_fund.reduce(
                                (userTotal, item) =>
                                  userTotal + item.request_transfer_fund,
                                0
                              ) || 0}
                          </b>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </div>
            </Col>
          )}
        </>
      )}
    </Row>
  );
};
