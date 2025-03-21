import React, { useEffect, useState } from "react";
import { Col, Table } from "react-bootstrap";
import ImageViewer from "../../components/ImageViewer";

import { useLocation } from "react-router-dom";
import {
  getApproveStockPunchDetails,
  getStockPunchTransferedDetails,
} from "../../services/contractorApi";
import CardComponent from "../../components/CardComponent";
import { useTranslation } from "react-i18next";

const ViewStockPunchTransfer = () => {
  const location = useLocation();
  const transfer_by_id = location?.state?.transfer_by_id;
  const transfer_to_id = location?.state?.transfer_to_id;
  const [edit, setEdit] = useState({});
  const { t } = useTranslation();

  const fetchTransferDetails = async () => {
    const res = await getStockPunchTransferedDetails(
      transfer_by_id,
      transfer_to_id
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
    <CardComponent
      title={t("Stock Punch Transfer Details")}
      showBackButton={true}
    >
      <div className="d-flex my-3  ">
        <Col md={5} className="">
          <div className="p-20 shadow rounded h-100">
            <strong className="text-secondary">{t("Transfer By")}</strong>
            <div className="mt-2">
              <table className="table-sm table">
                <tbody>
                  {edit?.[0]?.transfer_by && (
                    <>
                      <tr>
                        <th>{t("Name")} :</th>
                        <td>
                          <ImageViewer
                            src={
                              edit?.[0]?.transfer_by.image
                                ? `${process.env.REACT_APP_API_URL}${edit?.[0]?.transfer_by.image}`
                                : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                            }
                          >
                            <span className="d-flex align-items-center gap-2">
                              <img
                                width={30}
                                height={30}
                                className="my-bg object-fit p-1 rounded-circle"
                                src={
                                  edit?.[0]?.transfer_by.image
                                    ? `${process.env.REACT_APP_API_URL}${edit?.[0]?.transfer_by.image}`
                                    : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                }
                              />{" "}
                              <span className="d-grid">
                                {edit?.[0]?.transfer_by.name}{" "}
                              </span>
                            </span>
                          </ImageViewer>
                        </td>
                      </tr>

                      <tr>
                        <th>{t("employee Id")} :</th>
                        <td>{edit?.[0]?.transfer_by.employee_id}</td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Col>

        <Col md={5} className="mx-3">
          <div className="p-20 shadow rounded h-100">
            <strong className="text-secondary">{t("Transfer To")}</strong>
            <div className="mt-2">
              <table className="table-sm table">
                <tbody>
                  {edit?.[0]?.transfer_to_details && (
                    <>
                      <tr>
                        <th>{t("Name")} :</th>
                        <td>
                          <ImageViewer
                            src={
                              edit?.[0]?.transfer_to_details.image
                                ? `${process.env.REACT_APP_API_URL}${edit?.[0]?.transfer_to_details.image}`
                                : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                            }
                          >
                            <span className="d-flex align-items-center gap-2">
                              <img
                                width={30}
                                height={30}
                                className="my-bg object-fit p-1 rounded-circle"
                                src={
                                  edit?.[0]?.transfer_to_details.image
                                    ? `${process.env.REACT_APP_API_URL}${edit?.[0]?.transfer_to_details.image}`
                                    : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                }
                              />{" "}
                              <span className="d-grid">
                                {edit?.[0]?.transfer_to_details.name}{" "}
                              </span>
                            </span>
                          </ImageViewer>
                        </td>
                      </tr>

                      <tr>
                        <th>{t("employee Id")} :</th>
                        <td>{edit?.[0]?.transfer_to_details.employee_id}</td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Col>
      </div>

      <Col md={12}>
        <div className="p-20 shadow rounded h-100">
          <div className="mt-2">
            <Table className="table-sm table Roles">
              <thead>
                <tr>
                  <th>{t("Sr No.")}</th>
                  <th>{t("item")}</th>
                  <th>{t("Item Price")}</th>
                  <th>
                    {t("Transfer")}
                    <br />
                    {t("Quantity")}
                  </th>
                  <th>{t("Total")}</th>
                  <th>{t("Supplier Name")}</th>
                  <th>{t("Transfer Date & Time")}</th>
                </tr>
              </thead>
              <tbody>
                {edit.length > 0 &&
                  edit.map((itm, idx) => {
                    return (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>
                          <ImageViewer
                            src={
                              itm?.item_images
                                ? `${process.env.REACT_APP_API_URL}${itm?.item_images}`
                                : `${process.env.REACT_APP_API_URL}/assets/images/no-image.png`
                            }
                          >
                            <img
                              width={30}
                              height={30}
                              className="my-bg object-fit p-1 rounded-circle"
                              src={
                                itm?.item_images
                                  ? `${process.env.REACT_APP_API_URL}${itm?.item_images}`
                                  : `${process.env.REACT_APP_API_URL}/assets/images/no-image.png`
                              }
                            />{" "}
                            {itm?.item_name}
                          </ImageViewer>
                        </td>

                        <td>₹{itm?.item_price}</td>
                        <td>{itm.transfer_quantity}</td>
                        <td>₹ {itm.transfer_amounts}</td>
                        <td>{itm?.supplier_name ?? "--"}</td>
                        <td>{itm?.transfered_date ?? "--"}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
            <div className=" d-flex justify-content-end my-2 fs-6">
              {t("Total Transfer Quantity")}
              <span className="fw-bold mx-1 text-green ">
                {" "}
                {edit.length > 0 &&
                  edit?.reduce(
                    (total, itm) => total + itm.transfer_quantity,
                    0
                  )}
              </span>
            </div>
          </div>
        </div>
      </Col>
    </CardComponent>
  );
};

export default ViewStockPunchTransfer;
