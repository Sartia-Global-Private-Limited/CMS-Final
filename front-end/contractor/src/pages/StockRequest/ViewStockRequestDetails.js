import React, { useEffect, useState } from "react";
import "simplebar-react/dist/simplebar.min.css";
import { Col, Row, Table } from "react-bootstrap";
import ImageViewer from "../../components/ImageViewer";
import { getAllPreviousItemsStockList } from "../../services/contractorApi";
import { useTranslation } from "react-i18next";
import { GroupTable } from "../../components/GroupTable";

export const ViewStockRequestDetails = ({ edit }) => {
  const { t } = useTranslation();
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

  const [allOldItems, setAllOldItems] = useState([]);
  useEffect(() => {
    fetchAllPreviousItem(edit?.requested_for);
  }, [edit]);

  const fetchAllPreviousItem = async (id) => {
    const res = await getAllPreviousItemsStockList(id);
    if (res.status) {
      setAllOldItems(res.data);
    } else {
      setAllOldItems([]);
    }
  };

  return (
    <>
      <Row className="g-3">
        <Col md={12}>
          <GroupTable data={allOldItems} />
        </Col>

        {(edit?.request_stock?.request_stock?.length > 0 ||
          edit?.request_stock?.new_request_stock?.length > 0) && (
          <Col md={12}>
            <div className="p-20 shadow rounded h-100">
              <strong className="text-secondary">
                {t("Request Stock Field")}
              </strong>
              <div className="mt-2">
                <table className="table-sm table">
                  <tbody>
                    <tr>
                      <th>{t("Status")} :</th>
                      <td style={{ color: statusColor }}>{statusText}</td>
                    </tr>
                    <tr>
                      <th>{t("request tax type")} :</th>
                      <td>
                        {edit?.request_tax_type == "1"
                          ? "Item Wise"
                          : "Overall Price"}
                      </td>
                    </tr>
                    {edit?.request_tax_type == "2" ? (
                      <>
                        <tr>
                          <th>{t("Gst Type")} :</th>
                          <td>{edit?.gst_type}</td>
                        </tr>
                        <tr>
                          <th>{t("Gst %")} :</th>
                          <td>{edit?.gst_percent}</td>
                        </tr>
                      </>
                    ) : null}
                    <tr>
                      <th className="align-middle">{t("Requested For")} :</th>
                      <td>
                        <ImageViewer
                          src={
                            edit?.requested_for_image
                              ? `${process.env.REACT_APP_API_URL}${edit?.requested_for_image}`
                              : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                          }
                        >
                          <img
                            width={35}
                            height={35}
                            className="my-bg object-fit p-1 rounded-circle"
                            src={
                              edit.requested_for_image
                                ? `${process.env.REACT_APP_API_URL}${edit.requested_for_image}`
                                : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                            }
                          />{" "}
                        </ImageViewer>
                        {edit?.requested_for_name} -{" "}
                        {edit?.requested_for_employee_id}
                      </td>
                    </tr>
                    <tr>
                      <th>{t("request date")} :</th>
                      <td>{edit?.request_date}</td>
                    </tr>
                    <tr>
                      <th className="align-middle">
                        {t("Uploaded bill image")} :
                      </th>
                      <td>
                        <ImageViewer
                          src={
                            edit.request_stock_images?.[0]?.item_image
                              ? `${process.env.REACT_APP_API_URL}${edit?.request_stock_images?.[0]?.item_image}`
                              : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                          }
                        >
                          <img
                            width={50}
                            height={50}
                            className="my-bg object-fit p-1 rounded"
                            src={
                              edit.request_stock_images?.[0]?.item_image
                                ? `${process.env.REACT_APP_API_URL}${edit?.request_stock_images?.[0]?.item_image}`
                                : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                            }
                          />{" "}
                        </ImageViewer>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Col>
        )}

        {edit?.request_stock?.request_stock?.length > 0 && (
          <Col md={12}>
            <div className="p-20 shadow rounded h-100">
              <strong className="text-secondary">{t("Requested Item")}</strong>
              <div className="mt-2">
                <Table className="table-sm table Roles">
                  <thead>
                    <tr>
                      <th>{t("Sr No.")}</th>
                      <th>{t("Item Name")}</th>
                      {edit?.request_tax_type == "1" ? (
                        <>
                          <th>{t("Gst Type")}</th>
                          <th>{t("Gst %")}</th>
                        </>
                      ) : null}
                      <th>{t("Prev user stock")}</th>
                      <th>{t("prev item price")}</th>
                      <th>{t("current price")}</th>
                      <th>{t("request stock")}</th>
                      <th>{t("total price")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {edit?.request_stock?.request_stock?.map((itm, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>
                          <td>
                            <div className="d-flex">
                              <ImageViewer
                                src={
                                  itm.item_name?.image
                                    ? `${process.env.REACT_APP_API_URL}/${itm.item_name?.image}`
                                    : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                }
                              >
                                <img
                                  src={
                                    itm.item_name?.image
                                      ? `${process.env.REACT_APP_API_URL}/${itm.item_name?.image}`
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
                        </td>
                        {edit?.request_tax_type == "1" ? (
                          <>
                            <td>{itm.gst_id?.label ?? "--"}</td>
                            <td>{itm?.gst_percent ?? "--"}</td>
                          </>
                        ) : null}
                        <td>{itm.prev_user_stock}</td>
                        <td>{itm.prev_item_price}</td>
                        <td>{itm.current_item_price}</td>
                        <td>{itm.request_quantity}</td>
                        <td>{itm.total_price.toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={edit?.request_tax_type == "1" ? 6 : 4}></td>
                      <td colSpan={1}>{t("total")}</td>
                      <td className="text-start ">
                        <b>{edit?.total_request_quantity}</b>
                      </td>

                      <td className="text-start fs-6">
                        <b>{edit?.total_sum_of_request.toFixed(2)}</b>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </div>
          </Col>
        )}

        {edit?.request_stock?.new_request_stock?.length > 0 && (
          <Col md={12}>
            <div className="p-20 shadow rounded h-100">
              <strong className="text-secondary">
                {t("New Request Item")}
              </strong>
              <div className="mt-2">
                <Table className="table-sm table Roles">
                  <thead>
                    <tr>
                      <th>{t("Sr No.")}</th>
                      <th>{t("Item Name")}</th>
                      <th>{t("current price")}</th>
                      <th>{t("request stock")}</th>
                      <th>{t("total price")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {edit?.request_stock?.new_request_stock.map((itm, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>
                          <td>
                            <div className="d-flex">
                              <ImageViewer
                                src={
                                  itm?.item_image
                                    ? `${process.env.REACT_APP_API_URL}/${itm?.item_image}`
                                    : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                }
                              >
                                <img
                                  src={
                                    itm?.item_image
                                      ? `${process.env.REACT_APP_API_URL}/${itm?.item_image}`
                                      : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                  }
                                  className="avatar me-2"
                                />
                              </ImageViewer>
                              <span className="small d-grid">
                                <span>{itm.item_name?.label}</span>
                                <span className="text-gray">
                                  {itm?.title?.label}
                                </span>
                              </span>
                            </div>
                          </td>
                        </td>
                        {/* {edit?.request_tax_type == "1" ? (
                        <>
                          <td>{itm.gst_id?.label}</td>
                          <td>{itm.gst_percent}</td>
                        </>
                      ) : null} */}
                        <td>{itm?.rate ?? "--"}</td>
                        <td>{itm?.qty ?? "--"}</td>
                        <td>{itm?.rate * itm?.qty}</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={edit?.request_tax_type == "1" ? 3 : 4}></td>
                      <td colSpan={1}>
                        {t("total request qty")}-{" "}
                        <b className="text-start ">
                          {edit?.total_new_request_quantity ?? 0}{" "}
                        </b>
                      </td>
                      <td className=" fs-6">
                        {edit?.total_sum_of_new_request_stock}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={edit?.request_tax_type == "1" ? 3 : 4}></td>
                      <td className="text-start">
                        {t("Final quantity")}-{" "}
                        <b className="text-start fs-6">
                          {edit?.total_sum_of_quantity}
                        </b>
                      </td>
                      <td className="fw-bold fs-5">
                        {edit?.total_sum_of_request_stock}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </div>
          </Col>
        )}

        {/* -----------Approved Field------------- */}

        {edit?.approved_data?.length > 0 && (
          <Col md={12}>
            <div className="p-20 shadow rounded h-100">
              <strong className="text-secondary">
                {t("Approved Stock Field")}
              </strong>
              <div className="mt-2">
                <table className="table-sm table">
                  <tbody>
                    <tr>
                      <th>{t("Status")} :</th>
                      <td style={{ color: statusColor }}>{statusText}</td>
                    </tr>
                    <tr>
                      <th>{t("request tax type")} :</th>
                      <td>
                        {edit?.request_tax_type == "1"
                          ? "Item Wise"
                          : "Overall Price"}
                      </td>
                    </tr>
                    {edit?.request_tax_type == "2" ? (
                      <>
                        <tr>
                          <th>{t("Gst Type")} :</th>
                          <td>{edit?.gst_type}</td>
                        </tr>
                        <tr>
                          <th>{t("Gst %")} :</th>
                          <td>{edit?.gst_percent}</td>
                        </tr>
                      </>
                    ) : null}
                    <tr>
                      <th className="align-middle">{t("Requested For")} :</th>
                      <td>
                        <ImageViewer
                          src={
                            edit.requested_for_image
                              ? `${process.env.REACT_APP_API_URL}${edit.requested_for_image}`
                              : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                          }
                        >
                          <img
                            width={35}
                            height={35}
                            className="my-bg object-fit p-1 rounded-circle"
                            src={
                              edit.requested_for_image
                                ? `${process.env.REACT_APP_API_URL}${edit.requested_for_image}`
                                : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                            }
                          />{" "}
                        </ImageViewer>
                        {edit?.requested_for_name} -{" "}
                        {edit?.requested_for_employee_id}
                      </td>
                    </tr>
                    <tr>
                      <th>{t("request date")} :</th>
                      <td>{edit?.request_date}</td>
                    </tr>
                    <tr>
                      <th className="align-middle">
                        {t("Uploaded bill image")} :
                      </th>
                      <td>
                        <ImageViewer
                          src={
                            edit.request_stock_images?.[0]?.item_image
                              ? `${process.env.REACT_APP_API_URL}${edit?.request_stock_images?.[0]?.item_image}`
                              : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                          }
                        >
                          <img
                            width={50}
                            height={50}
                            className="my-bg object-fit p-1 rounded"
                            src={
                              edit.request_stock_images?.[0]?.item_image
                                ? `${process.env.REACT_APP_API_URL}${edit?.request_stock_images?.[0]?.item_image}`
                                : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                            }
                          />{" "}
                        </ImageViewer>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Col>
        )}

        {/* -----------Approved Field old item ------------- */}

        {edit?.approved_data?.[0]?.request_stock?.length > 0 && (
          <Col md={12}>
            <div className="p-20 shadow rounded h-100">
              <strong className="text-secondary">{t("Approved Item")}</strong>
              <div className="mt-2">
                <Table className="table-sm table Roles">
                  <thead>
                    <tr>
                      <th>{t("Sr No.")}</th>
                      <th>{t("Item Name")}</th>
                      {edit?.request_tax_type == "1" ? (
                        <>
                          <th>{t("Gst Type")}</th>
                          <th>{t("Gst %")}</th>
                        </>
                      ) : null}
                      <th>{t("Prev user stock")}</th>
                      <th>{t("prev item price")}</th>
                      <th>{t("Request price")}</th>
                      <th>{t("request Quantity")}</th>
                      <th>{t("Approved price")}</th>
                      <th>{t("Approved Quantity")}</th>
                      <th>{t("total price")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {edit?.approved_data?.[0]?.request_stock?.map(
                      (itm, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>
                            <td>
                              <div className="d-flex">
                                <ImageViewer
                                  src={
                                    itm.item_name?.image
                                      ? `${process.env.REACT_APP_API_URL}/${itm.item_name?.image}`
                                      : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                  }
                                >
                                  <img
                                    src={
                                      itm.item_name?.image
                                        ? `${process.env.REACT_APP_API_URL}/${itm.item_name?.image}`
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
                          </td>
                          {edit?.request_tax_type == "1" ? (
                            <>
                              <td>{itm.gst_id?.label ?? "--"}</td>
                              <td>{itm?.gst_percent ?? "--"}</td>
                            </>
                          ) : null}
                          <td>{itm?.prev_user_stock}</td>
                          <td>{itm?.prev_item_price}</td>
                          <td>{itm?.current_item_price}</td>
                          <td>{itm?.request_quantity}</td>
                          <td>{itm?.approve_price}</td>
                          <td>{itm?.approve_quantity}</td>
                          <td>
                            {(
                              itm?.approve_price * itm?.approve_quantity
                            )?.toFixed(2)}
                          </td>
                        </tr>
                      )
                    )}
                    <tr>
                      <td colSpan={6}></td>
                      <td colSpan={1}>total</td>
                      <td className="text-start ">
                        <b>
                          {edit?.approved_data?.[0]?.request_stock.reduce(
                            (userTotal, item) =>
                              userTotal + item?.approve_quantity,
                            0
                          )}
                        </b>
                      </td>

                      <td className="text-start">
                        <b>
                          {edit?.approved_data?.[0]?.request_stock
                            .reduce(
                              (userTotal, item) =>
                                userTotal +
                                item?.approve_quantity * item?.approve_price,
                              0
                            )
                            ?.toFixed(2)}
                        </b>
                      </td>
                    </tr>

                    {/* <tr>
                    <td colSpan={7}></td>
                    <td colSpan={1}>total gst amount</td>
                    <td className="fw-bold">{edit?.total_gst_amount}</td>
                  </tr> */}
                  </tbody>
                </Table>
              </div>
            </div>
          </Col>
        )}

        {/* -----------Approved Field New item ------------- */}

        {edit?.approved_data?.[0]?.new_request_stock?.length > 0 && (
          <Col md={12}>
            <div className="p-20 shadow rounded h-100">
              <strong className="text-secondary">
                {t("Approved New Item")}
              </strong>
              <div className="mt-2">
                <Table className="table-sm table Roles">
                  <thead>
                    <tr>
                      <th>{t("Sr No.")}</th>
                      <th>{t("Item Name")}</th>
                      <th>{t("request rate")}</th>
                      <th>{t("request quantity")}</th>
                      <th>{t("Approved rate")}</th>
                      <th>{t("Approved quantity")}</th>
                      <th>{t("total price")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {edit?.approved_data?.[0]?.new_request_stock?.map(
                      (itm, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>
                            <td>
                              <div className="d-flex">
                                <ImageViewer
                                  src={
                                    itm.item_image
                                      ? `${process.env.REACT_APP_API_URL}/${itm?.item_image}`
                                      : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                  }
                                >
                                  <img
                                    src={
                                      itm?.item_image
                                        ? `${process.env.REACT_APP_API_URL}/${itm.item_image}`
                                        : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                    }
                                    className="avatar me-2"
                                  />
                                </ImageViewer>
                                <span className="small d-grid">
                                  <span>{itm.title?.label}</span>
                                </span>
                              </div>
                            </td>
                          </td>
                          {/* {edit?.request_tax_type == "1" ? (
                          <>
                            <td>{itm.gst_id?.label ?? "--"}</td>
                            <td>{itm?.gst_percent ?? "--"}</td>
                          </>
                        ) : null}
                        <td>{itm.prev_user_stock}</td> */}
                          <td>{itm?.requested_rate}</td>
                          <td>{itm?.requested_qty}</td>
                          <td>{itm?.rate}</td>
                          <td>{itm?.qty}</td>

                          <td>{itm?.rate * itm?.qty}</td>
                        </tr>
                      )
                    )}
                    <tr>
                      <td colSpan={6}></td>
                      <td colSpan={1}>
                        {t("total")}{" "}
                        <span className="text-start ">
                          {" "}
                          {edit?.approved_data?.[0]?.new_request_stock.reduce(
                            (userTotal, item) => userTotal + +item?.qty,
                            0
                          )}{" "}
                        </span>
                      </td>

                      <td className="text-start ">
                        <b>
                          {edit?.approved_data?.[0]?.new_request_stock.reduce(
                            (userTotal, item) =>
                              userTotal + item?.rate * item?.qty,
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

        {/* -----------Transfer  Field------------- */}

        {(edit?.transfer_stocks?.request_stock.length > 0 ||
          edit?.transfer_stocks?.new_request_stock.length > 0) && (
          <Col md={12}>
            <div className="p-20 shadow rounded h-100">
              <strong className="text-secondary">
                {t("Transfer Stock Field")}
              </strong>
              <div className="mt-2">
                <table className="table-sm table">
                  <tbody>
                    <tr>
                      <th>{t("Status")} :</th>
                      <td style={{ color: statusColor }}>{statusText}</td>
                    </tr>
                    <tr>
                      <th>{t("request tax type")} :</th>
                      <td>
                        {edit?.request_tax_type == "1"
                          ? "Item Wise"
                          : "Overall Price"}
                      </td>
                    </tr>
                    {edit?.request_tax_type == "2" ? (
                      <>
                        <tr>
                          <th>{t("Gst Type")} :</th>
                          <td>{edit?.gst_type}</td>
                        </tr>
                        <tr>
                          <th>{t("Gst %")} :</th>
                          <td>{edit?.gst_percent}</td>
                        </tr>
                      </>
                    ) : null}
                    <tr>
                      <th className="align-middle">{t("Requested For")} :</th>
                      <td>
                        <ImageViewer
                          src={
                            edit.requested_for_image
                              ? `${process.env.REACT_APP_API_URL}${edit.requested_for_image}`
                              : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                          }
                        >
                          <img
                            width={35}
                            height={35}
                            className="my-bg object-fit p-1 rounded-circle"
                            src={
                              edit.requested_for_image
                                ? `${process.env.REACT_APP_API_URL}${edit.requested_for_image}`
                                : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                            }
                          />{" "}
                        </ImageViewer>
                        {edit?.requested_for_name} -{" "}
                        {edit?.requested_for_employee_id}
                      </td>
                    </tr>
                    <tr>
                      <th>{t("request date")} :</th>
                      <td>{edit?.request_date}</td>
                    </tr>
                    <tr>
                      <th className="align-middle">
                        {t("Uploaded bill image")} :
                      </th>
                      <td>
                        <ImageViewer
                          src={
                            edit.request_stock_images?.[0]?.item_image
                              ? `${process.env.REACT_APP_API_URL}${edit?.request_stock_images?.[0]?.item_image}`
                              : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                          }
                        >
                          <img
                            width={50}
                            height={50}
                            className="my-bg object-fit p-1 rounded"
                            src={
                              edit.request_stock_images?.[0]?.item_image
                                ? `${process.env.REACT_APP_API_URL}${edit?.request_stock_images?.[0]?.item_image}`
                                : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                            }
                          />{" "}
                        </ImageViewer>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Col>
        )}

        {/* -----------Transfer Field old item ------------- */}

        {edit?.transfer_stocks?.request_stock?.length > 0 && (
          <Col md={12}>
            <div className="p-20 shadow rounded h-100">
              <strong className="text-secondary">{t("Transfer Item")}</strong>
              <div className="mt-2">
                <Table className="table-sm table Roles">
                  <thead>
                    <tr>
                      <th>{t("Sr No.")}</th>
                      <th>{t("Item Name")}</th>
                      {edit?.request_tax_type == "1" ? (
                        <>
                          <th>{t("Gst Type")}</th>
                          <th>{t("Gst %")}</th>
                        </>
                      ) : null}
                      <th>{t("Prev user stock")}</th>
                      <th>{t("prev item price")}</th>
                      <th>{t("request price")}</th>
                      <th>{t("request Quantity")}</th>
                      <th>{t("Approved price")}</th>
                      <th>{t("Approved Quantity")}</th>
                      <th>{t("Transfer Quantity")}</th>
                      <th>{t("total price")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {edit?.transfer_stocks?.request_stock?.map((itm, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>
                          <td>
                            <div className="d-flex">
                              <ImageViewer
                                src={
                                  itm.item_name?.image
                                    ? `${process.env.REACT_APP_API_URL}/${itm.item_name?.image}`
                                    : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                }
                              >
                                <img
                                  src={
                                    itm.item_name?.image
                                      ? `${process.env.REACT_APP_API_URL}/${itm.item_name?.image}`
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
                        </td>
                        {edit?.request_tax_type == "1" ? (
                          <>
                            <td>{itm.gst_id?.label ?? "--"}</td>
                            <td>{itm?.gst_percent ?? "--"}</td>
                          </>
                        ) : null}
                        <td>{itm?.prev_user_stock}</td>
                        <td>{itm?.prev_item_price}</td>
                        <td>{itm?.current_item_price}</td>
                        <td>{itm?.request_quantity}</td>
                        <td>{itm?.approve_price}</td>
                        <td>{itm?.approve_quantity}</td>
                        <td>{itm?.transfer_qty ?? "--"}</td>
                        <td>
                          {(itm?.approve_price * itm?.transfer_qty)?.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={7}></td>
                      <td colSpan={1}>{t("total")}</td>
                      <td className="text-start ">
                        <b>
                          {edit?.transfer_stocks?.request_stock.reduce(
                            (userTotal, item) => userTotal + item?.transfer_qty,
                            0
                          )}
                        </b>
                      </td>

                      <td className="text-start ">
                        <b>
                          {edit?.transfer_stocks?.request_stock
                            .reduce(
                              (userTotal, item) =>
                                userTotal +
                                item?.transfer_qty * item?.approve_price,
                              0
                            )
                            .toFixed(2)}
                        </b>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </div>
          </Col>
        )}

        {/* -----------Transfer Field New item ------------- */}

        {edit?.transfer_stocks?.new_request_stock?.length > 0 && (
          <Col md={12}>
            <div className="p-20 shadow rounded h-100">
              <strong className="text-secondary">
                {t("Transfer New Item")}
              </strong>
              <div className="mt-2">
                <Table className="table-sm table Roles">
                  <thead>
                    <tr>
                      <th>{t("Sr No.")}</th>
                      <th>{t("Item Name")}</th>
                      <th>{t("request rate")}</th>
                      <th>{t("request quantity")}</th>
                      <th>{t("Approved rate")}</th>
                      <th>{t("Approved quantity")}</th>
                      <th>{t("Transfer quantity")}</th>
                      <th>{t("total price")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {edit?.transfer_stocks?.new_request_stock?.map(
                      (itm, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>
                            <td>
                              <div className="d-flex">
                                <ImageViewer
                                  src={
                                    itm.item_image
                                      ? `${process.env.REACT_APP_API_URL}/${itm?.item_image}`
                                      : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                  }
                                >
                                  <img
                                    src={
                                      itm?.item_image
                                        ? `${process.env.REACT_APP_API_URL}/${itm.item_image}`
                                        : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                    }
                                    className="avatar me-2"
                                  />
                                </ImageViewer>
                                <span className="small d-grid">
                                  <span>{itm.title?.label}</span>
                                </span>
                              </div>
                            </td>
                          </td>
                          {/* {edit?.request_tax_type == "1" ? (
                          <>
                            <td>{itm.gst_id?.label ?? "--"}</td>
                            <td>{itm?.gst_percent ?? "--"}</td>
                          </>
                        ) : null}
                        <td>{itm.prev_user_stock}</td> */}
                          <td>{itm?.requested_rate}</td>
                          <td>{itm?.requested_qty}</td>
                          <td>{itm?.rate}</td>
                          <td>{itm?.qty}</td>
                          <td>{itm?.transfer_qty}</td>
                          <td>{itm?.rate * itm?.qty}</td>
                        </tr>
                      )
                    )}
                    <tr>
                      <td colSpan={edit?.request_tax_type == "1" ? 4 : 4}></td>
                      <td className="fw-bold">{t("total")} </td>
                      <td className="fw-bold">
                        <span className="text-start ">
                          {" "}
                          {edit?.transfer_stocks?.new_request_stock.reduce(
                            (userTotal, item) => userTotal + +item?.qty,
                            0
                          )}{" "}
                        </span>
                      </td>

                      <td className="text-start ">
                        <b>
                          {edit?.transfer_stocks?.new_request_stock.reduce(
                            (userTotal, item) =>
                              userTotal + item?.rate * item?.qty,
                            0
                          ) || 0}
                        </b>
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={5}></td>
                      <td className="text-start fs-6 fw-bold">
                        {t("Final amount")}
                        <span>
                          {(
                            edit?.transfer_stocks?.new_request_stock.reduce(
                              (userTotal, item) =>
                                userTotal + item?.rate * item?.qty,
                              0
                            ) +
                              edit?.transfer_stocks?.request_stock.reduce(
                                (userTotal, item) =>
                                  userTotal +
                                  item?.transfer_qty * item?.approve_price,
                                0
                              ) || 0
                          )?.toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </div>
          </Col>
        )}
      </Row>
    </>
  );
};
