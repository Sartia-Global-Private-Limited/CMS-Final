import React from "react";
import ImageViewer from "../../components/ImageViewer";
import { Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const ViewProductDetails = ({ edit }) => {
  const { t } = useTranslation();
  return (
    <>
      <Col md={6}>
        <div className="p-20 shadow rounded h-100">
          <strong className="text-secondary">{t("Details")}</strong>
          <div className="mt-2">
            <table className="table-sm table">
              <tbody>
                {edit?.category_name && (
                  <tr>
                    <th>{t("Category Name")} :</th>
                    <td>{edit?.category_name}</td>
                  </tr>
                )}
                {edit?.product_name && (
                  <tr>
                    <th>{t("Product Name")} :</th>
                    <td>{edit?.product_name}</td>
                  </tr>
                )}
                {edit?.price && (
                  <tr>
                    <th>{t("Price")} :</th>
                    <td>{edit?.price}</td>
                  </tr>
                )}
                {edit?.quantity && (
                  <tr>
                    <th>{t("Quantity")} :</th>
                    <td>{edit?.quantity}</td>
                  </tr>
                )}
                {edit?.alert_quantity && (
                  <tr>
                    <th>{t("Alert Quantity")} :</th>
                    <td>{edit?.alert_quantity}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Col>
      <Col md={6}>
        <div className="p-20 shadow rounded h-100">
          <strong className="text-secondary">{t("Bank Details")}</strong>
          <div className="mt-2">
            <table className="table-sm table">
              <tbody>
                {edit?.supplier_name && (
                  <tr>
                    <th>{t("supplier name")} :</th>
                    <td>{edit?.supplier_name}</td>
                  </tr>
                )}
                {edit?.manufacturing_date && (
                  <tr>
                    <th>{t("manufacturing date")} :</th>
                    <td>{edit?.manufacturing_date}</td>
                  </tr>
                )}
                {edit?.expiry_date && (
                  <tr>
                    <th>{t("expiry date")} :</th>
                    <td>{edit?.expiry_date}</td>
                  </tr>
                )}
                {edit?.availability_status && (
                  <tr>
                    <th>{t("Availability Status")} :</th>
                    <td
                      className={`text-${
                        edit.availability_status === "1" ? "green" : "orange"
                      }`}
                    >
                      {edit.availability_status === "1"
                        ? "In Stock"
                        : "Out Stock"}
                    </td>
                  </tr>
                )}
                {edit?.is_published && (
                  <tr>
                    <th>{t("is published")} :</th>
                    <td
                      className={`text-${
                        edit.is_published === "0" ? "danger" : "green"
                      }`}
                    >
                      {edit.is_published === "0"
                        ? "Not published"
                        : "published"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Col>
      <Col md={12}>
        <div className="p-20 shadow rounded h-100">
          <strong className="text-secondary">{t("External Field")}</strong>
          <div className="mt-2">
            <table className="table-sm table">
              <tbody>
                {edit?.created_by_name && (
                  <tr>
                    <th>{t("Created By")} :</th>
                    <td>{edit?.created_by_name}</td>
                  </tr>
                )}
                {edit?.created_at && (
                  <tr>
                    <th>{t("Created At")} :</th>
                    <td>{edit?.created_at}</td>
                  </tr>
                )}
                {edit?.description && (
                  <tr>
                    <th>{t("description")} :</th>
                    <td>{edit?.description}</td>
                  </tr>
                )}
                {edit?.image_url && (
                  <tr>
                    <th>{t("Product Image")} :</th>
                    <td>
                      <div
                        className="shadow p-1 d-inline-block success-combo"
                        style={{ borderRadius: "3px" }}
                      >
                        <ImageViewer
                          src={
                            edit.image_url
                              ? process.env.REACT_APP_API_URL + edit.image_url
                              : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                          }
                        >
                          <img
                            width={35}
                            height={35}
                            className="object-fit"
                            src={
                              process.env.REACT_APP_API_URL + edit?.image_url
                            }
                          />
                        </ImageViewer>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Col>
    </>
  );
};

export default ViewProductDetails;
