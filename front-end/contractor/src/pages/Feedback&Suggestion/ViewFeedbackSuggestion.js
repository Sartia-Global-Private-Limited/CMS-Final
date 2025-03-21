import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getFeedbackSuggestionById } from "../../services/contractorApi";
import CardComponent from "../../components/CardComponent";
import { useTranslation } from "react-i18next";
import { Col } from "react-bootstrap";

const ViewFeedbackSuggestion = () => {
  const [viewDetails, setViewDetails] = useState({});
  const { t } = useTranslation();
  const location = useLocation();
  const id = location.state.id;

  const fetchSingleDetailsData = async () => {
    const res = await getFeedbackSuggestionById(id);
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
    <Col md={12}>
      <CardComponent
        className={"after-bg-light"}
        showBackButton={true}
        title={"View all feedback and suggestion"}
      >
        <div className="mb-3">
          <Col md={12}>
            <div className="p-20 shadow rounded h-100">
              <strong className="text-secondary">{t("Details")}</strong>
              <div className="mt-2">
                <table className="table-sm table">
                  <tbody>
                    <tr>
                      <th>{t("title")} :</th>
                      <td>{viewDetails?.title}</td>
                    </tr>

                    <tr>
                      <th>{t("description")}:</th>
                      <td>{viewDetails?.description}</td>
                    </tr>

                    <tr>
                      <th>{t("Response")} :</th>
                      <td>{viewDetails?.response || "--"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Col>
        </div>
      </CardComponent>
    </Col>
  );
};

export default ViewFeedbackSuggestion;
