import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AdminSingleSurveyItemMasterById } from "../../services/authapi";
import CardComponent from "../../components/CardComponent";
import { Col, Table, Image, Row } from "react-bootstrap";
import ImageViewer from "../../components/ImageViewer";
import { useTranslation } from "react-i18next";

const ViewAllFunds = () => {
  const [details, setDetails] = useState([]);
  const location = useLocation();
  const id = location?.state?.id;
  const { t } = useTranslation();

  const fetchFundItemDetails = async () => {
    const res = await AdminSingleSurveyItemMasterById(id);
    if (res.status) {
      setDetails(res?.data);
    } else {
      setDetails([]);
    }
  };
  useEffect(() => {
    fetchFundItemDetails();
  }, []);
  return (
    <>
      <Col md={12}>
        <CardComponent
          showBackButton={true}
          title={"View Items"}
          className={"after-bg-light"}
        >
          <div className="mb-3">
            <Col md={12}>
              <div className="p-20 shadow rounded h-100">
                <strong className="text-secondary">{t("Details")}</strong>
                <div className="mt-2">
                  <table className="table-sm table">
                    <tbody>
                      <tr>
                        <th>{t("Item name")} :</th>
                        <td>{details?.name}</td>
                      </tr>
                      <tr>
                        <th>{t("Item Image")} :</th>
                        <td>
                          <ImageViewer
                            src={
                              details.image
                                ? `${process.env.REACT_APP_API_URL}${details.image}`
                                : `${process.env.REACT_APP_API_URL}/assets/images/no-image.png`
                            }
                          >
                            <Image
                              width={50}
                              height={40}
                              className="my-bg p-1 rounded mb-2 text-center"
                              src={
                                details.image
                                  ? `${process.env.REACT_APP_API_URL}${details.image}`
                                  : `${process.env.REACT_APP_API_URL}/assets/images/no-image.png`
                              }
                              alt="no image"
                            />
                          </ImageViewer>
                        </td>
                      </tr>
                      {details?.supplier_name && (
                        <tr>
                          <th>{t("supplier name")} :</th>
                          <td>{details?.supplier_name}</td>
                        </tr>
                      )}
                      <tr>
                        <th>{t("sub category")} :</th>
                        <td>{details?.sub_category || "-"}</td>
                      </tr>
                      <tr>
                        <th>{t("unit name")} :</th>
                        <td>{details?.unit_name}</td>
                      </tr>
                      <tr>
                        <th>{t("hsncode")} :</th>
                        <td>{details?.hsncode}</td>
                      </tr>
                      <tr>
                        <th>{t("rucode")} :</th>
                        <td>{details?.rucode}</td>
                      </tr>
                      <tr>
                        <th>{t("item unique id")} :</th>
                        <td>{details?.unique_id}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </Col>
          </div>

          <div className="shadow p-2 g-4">
            <span className="fw-bold mx-2 text-secondary ">
              {" "}
              {t("Brand rates")}
            </span>

            <div className="mt-2">
              <Table className="table-sm table Roles">
                <thead>
                  <tr>
                    <th>{t("Sr No.")}</th>
                    <th>{t("Brand")}</th>
                    <th className="text-start">{t("Rate")}</th>
                  </tr>
                </thead>
                <tbody>
                  {details.rates?.length > 0 &&
                    details.rates?.map((data, idx) => {
                      return (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>{data?.brand}</td>
                          <td className="text-start">{data?.rate}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
            </div>
          </div>
        </CardComponent>
      </Col>
    </>
  );
};

export default ViewAllFunds;
