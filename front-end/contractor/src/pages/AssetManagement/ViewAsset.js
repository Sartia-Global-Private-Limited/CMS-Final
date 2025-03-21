import React from "react";
import { Col } from "react-bootstrap";
import ImageViewer from "../../components/ImageViewer";
import moment from "moment";
import { useTranslation } from "react-i18next";

const ViewAsset = ({ edit }) => {
  const { t } = useTranslation();
  return (
    <>
      <Col md={12}>
        <div className="p-20 shadow rounded h-100">
          <strong className="text-secondary">{t("Details")}</strong>
          <div className="mt-2">
            <table className="table-sm table">
              <tbody>
                {edit?.asset_name && (
                  <tr>
                    <th> {t("asset name")} :</th>
                    <td>{edit?.asset_name}</td>
                  </tr>
                )}
                {edit?.asset_model_number && (
                  <tr>
                    <th>{t("asset model number")} :</th>
                    <td>{edit?.asset_model_number}</td>
                  </tr>
                )}
                {edit?.asset_uin_number && (
                  <tr>
                    <th>{t("asset uin no")} :</th>
                    <td>{edit?.asset_uin_number}</td>
                  </tr>
                )}
                {edit?.asset_price && (
                  <tr>
                    <th>{t("asset Price")} :</th>
                    <td>{edit?.asset_price}</td>
                  </tr>
                )}
                {edit?.asset_purchase_date && (
                  <tr>
                    <th>{t("asset purchase date")} :</th>
                    <td>{edit?.asset_purchase_date}</td>
                  </tr>
                )}
                {edit?.asset_warranty_guarantee_period && (
                  <tr>
                    <th>{t("warranty guarantee period")} :</th>
                    <td>{edit?.asset_warranty_guarantee_period}</td>
                  </tr>
                )}
                {edit?.asset_warranty_guarantee_start_date && (
                  <tr>
                    <th>{t("warranty guarantee start date")} :</th>
                    <td>{edit?.asset_warranty_guarantee_start_date}</td>
                  </tr>
                )}
                {edit?.asset_warranty_guarantee_end_date && (
                  <tr>
                    <th> {t("warranty guarantee end Date")} :</th>
                    <td>{edit?.asset_warranty_guarantee_end_date}</td>
                  </tr>
                )}
                {edit?.asset_warranty_guarantee_value && (
                  <tr>
                    <th>{t("warranty guarantee value")} :</th>
                    <td>{edit?.asset_warranty_guarantee_value}</td>
                  </tr>
                )}
                {edit?.supplier_name && (
                  <tr>
                    <th>{t("supplier name")} :</th>
                    <td>{edit?.supplier_name}</td>
                  </tr>
                )}

                {edit?.asset_created_at && (
                  <tr>
                    <th>{t("asset created at")} :</th>
                    <td>
                      {moment(edit?.asset_created_at).format("YYYY-MM-DD")}
                    </td>
                  </tr>
                )}
                {edit?.asset_image && (
                  <tr>
                    <th>{t("Asset Image")} :</th>
                    <td>
                      <div
                        className="shadow p-1 d-inline-block success-combo"
                        style={{ borderRadius: "3px" }}
                      >
                        <ImageViewer
                          src={
                            edit.asset_image
                              ? process.env.REACT_APP_API_URL + edit.asset_image
                              : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                          }
                        >
                          <img
                            width={35}
                            height={35}
                            className="object-fit"
                            src={
                              process.env.REACT_APP_API_URL + edit?.asset_image
                            }
                          />
                        </ImageViewer>
                      </div>
                    </td>
                  </tr>
                )}
                {edit?.asset_assign_status && (
                  <tr>
                    <th>{t("asset assign status")} :</th>
                    <td
                      className={`text-${
                        edit.asset_assign_status === "assigned"
                          ? "green"
                          : "danger"
                      }`}
                    >
                      {edit.asset_assign_status === "assigned"
                        ? "Assigned"
                        : "Not Assign"}
                    </td>
                  </tr>
                )}
                {edit?.asset_assign_to && (
                  <tr>
                    <th>{t("asset assign to")} :</th>
                    <td>{edit?.asset_assign_to}</td>
                  </tr>
                )}
                {edit?.asset_assign_at && (
                  <tr>
                    <th>{t("asset assign at")} :</th>
                    <td>{edit?.asset_assign_at}</td>
                  </tr>
                )}
                {edit?.asset_assign_by && (
                  <tr>
                    <th>{t("asset assign by")} :</th>
                    <td>{edit?.asset_assign_by}</td>
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

export default ViewAsset;
