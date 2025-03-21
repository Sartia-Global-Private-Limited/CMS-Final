import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getAreaManagerInEnergyCompanyById } from "../../services/contractorApi";
import CardComponent from "../../components/CardComponent";
import { useTranslation } from "react-i18next";
import { Col, Row } from "react-bootstrap";
import { getDateValue } from "../../utils/helper";

const ViewEnergyTeam = () => {
  const [viewDetails, setViewDetails] = useState({});
  const { t } = useTranslation();
  const location = useLocation();
  const id = location.state.id;
  const energyId = location?.state?.energy_company_id;

  const fetchSingleDetailsData = async () => {
    const res = await getAreaManagerInEnergyCompanyById({id: energyId, user_id:id});
    if (res.status) {
      setViewDetails(res.data);
    } else {
      setViewDetails({});
    }
  };

  useEffect(() => {
    if (id) fetchSingleDetailsData();
  }, []);
  return (
    <CardComponent
      className={"after-bg-light"}
      showBackButton={true}
      title={"View Energy Company user"}
    >
      <Row className="g-3">
        <Col md={6}>
          <div className="p-20 shadow rounded h-100">
            <strong className="text-secondary">{t("User Details")}</strong>
            <div className="mt-2">
              <table className="table-sm table">
                <tbody>
                  <tr>
                    <th>{t("username")} :</th>
                    <td>{viewDetails?.username}</td>
                  </tr>

                  <tr>
                    <th>{t("mobile Number")} :</th>
                    <td>{viewDetails?.mobile}</td>
                  </tr>

                  <tr>
                    <th>{t("alternate Number")} :</th>
                    <td>{viewDetails?.alt_number || "-"}</td>
                  </tr>
                  <tr>
                    <th>{t("email")} :</th>
                    <td>{viewDetails?.email}</td>
                  </tr>
                  <tr>
                    <th>{t("joining date")} :</th>
                    <td>{viewDetails?.joining_date}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Col>
        <Col md={6}>
          <div className="p-20 shadow rounded h-100">
            <strong className="text-secondary">{t("Address Details")}</strong>
            <div className="mt-2">
              <table className="table-sm table">
                <tbody>
                  <tr>
                    <th>{t("city")} :</th>
                    <td>{viewDetails?.city || "-"}</td>
                  </tr>
                  <tr>
                    <th>{t("pincode")} :</th>
                    <td>{viewDetails?.pin_code || "-"}</td>
                  </tr>
                  <tr>
                    <th>{t("address")} :</th>
                    <td>{viewDetails?.address || "-"}</td>
                  </tr>

                  <tr>
                    <th>{t("country")} :</th>
                    <td>{viewDetails?.country || "-"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Col>
        <Col md={12}>
          <div className="p-20 shadow rounded h-100">
            <strong className="text-secondary">{t("Other Details")}</strong>
            <div className="mt-2">
              <table className="table-sm table">
                <tbody>
                  <tr>
                    <th>{t("Created At")} :</th>
                    <td>{getDateValue(viewDetails?.created_at)}</td>
                  </tr>
                  <tr>
                    <th>{t("description")} :</th>
                    <td>{viewDetails?.description || "-"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Col>
      </Row>
    </CardComponent>
  );
};

export default ViewEnergyTeam;
