import React, { useState, useEffect } from "react";
import moment from "moment";
import { Col, Row } from "react-bootstrap";
import { getAssetsTimelineHistoryById } from "../../services/contractorApi";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { useParams } from "react-router-dom";
import ImageViewer from "../../components/ImageViewer";
import { Helmet } from "react-helmet";
import CardComponent from "../../components/CardComponent";
import { useTranslation } from "react-i18next";

const TimelineAssignedAssets = () => {
  const [edit, setEdit] = useState({});
  const { id } = useParams();
  const { t } = useTranslation();

  const fetchTimelineData = async () => {
    const res = await getAssetsTimelineHistoryById(id);
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit([]);
    }
  };

  useEffect(() => {
    if (id !== "new") {
      fetchTimelineData();
    }
  }, [id]);
  return (
    <>
      <Helmet>
        <title>View Assigned Asset - Details · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CardComponent
          className={"after-bg-light"}
          title={"View Assigned Asset - Details"}
        >
          <Row className="g-3 py-1">
            <Col md={6}>
              <div className="p-20 shadow rounded h-100">
                <strong className="text-secondary">{t("Details")}</strong>
                <div className="mt-2">
                  <table className="table-sm table">
                    <tbody>
                      {edit?.asset_name && (
                        <tr>
                          <th>{t("Asset Name")} :</th>
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
                          <th>{t("asset uin number")} :</th>
                          <td>{edit?.asset_uin_number}</td>
                        </tr>
                      )}
                      {edit?.asset_price && (
                        <tr>
                          <th>{t("asset price")} :</th>
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
                          <th>{t("warranty guarantee end date")} :</th>
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
                      {edit?.asset_status && (
                        <tr>
                          <th>{t("asset status")} :</th>
                          <td
                            className={`text-${
                              edit.asset_status === 1 ? "green" : "danger"
                            }`}
                          >
                            {edit.asset_status === 1 ? "Active" : "DeActive"}
                          </td>
                        </tr>
                      )}
                      {edit?.asset_created_at && (
                        <tr>
                          <th>{t("asset created at")} :</th>
                          <td>
                            {moment(edit?.asset_created_at).format(
                              "YYYY-MM-DD"
                            )}
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
                                    ? process.env.REACT_APP_API_URL +
                                      edit.asset_image
                                    : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                }
                              >
                                <img
                                  width={35}
                                  height={35}
                                  className="object-fit"
                                  src={
                                    process.env.REACT_APP_API_URL +
                                    edit?.asset_image
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
            <Col md={6}>
              <div className="p-20 shadow rounded h-100">
                <SimpleBar className="area">
                  <strong className="text-secondary">
                    {t("Assets Timeline History")}
                  </strong>
                  <div className="ps-3 mt-3">
                    {edit?.asset_timeline_history?.length > 0 ? null : (
                      <div className="text-center">
                        <img
                          className="p-3"
                          alt="no-result"
                          width="290"
                          src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                        />
                      </div>
                    )}
                    {edit?.asset_timeline_history?.map((data) => (
                      <div key={data} className="hstack gap-4">
                        <div className="vr hr-shadow d-align align-items-baseline">
                          <span
                            className={`bg-${data.color} zIndex rounded-circle btn-play d-flex`}
                            style={{ padding: "7px" }}
                          />
                        </div>
                        <div>
                          <p className="mb-2">
                            <strong>{data.asset_name}</strong>{" "}
                            <span className="small text-gray">
                              ({data.asset_model_number})
                            </span>
                          </p>
                          <p className="mb-2 small">
                            <span className="fw-bold">{t("assigned by")}</span>{" "}
                            - {data.asset_assigned_by_name}{" "}
                            <span className="small text-gray">
                              ({data.asset_assigned_at})
                            </span>
                          </p>
                          <p className="small">
                            <span className="fw-bold">{t("notes")}</span> -{" "}
                            {data.notes}
                          </p>
                          <div className="d-flex small align-items-center mt-2 mb-5 hr-border2 pb-4">
                            <span className="fw-bold">
                              {t("assigned to")} -
                            </span>
                            <ImageViewer
                              src={
                                data?.asset_assigned_to_image
                                  ? `${process.env.REACT_APP_API_URL}${data?.asset_assigned_to_image}`
                                  : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                              }
                            >
                              <img
                                className="avatar mx-2"
                                src={
                                  data?.asset_assigned_to_image
                                    ? `${process.env.REACT_APP_API_URL}${data?.asset_assigned_to_image}`
                                    : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                }
                                alt={data.asset_assigned_to_name}
                              />
                            </ImageViewer>
                            <div>{data.asset_assigned_to_name}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </SimpleBar>
              </div>
            </Col>
          </Row>
        </CardComponent>
      </Col>
    </>
  );
};

export default TimelineAssignedAssets;
