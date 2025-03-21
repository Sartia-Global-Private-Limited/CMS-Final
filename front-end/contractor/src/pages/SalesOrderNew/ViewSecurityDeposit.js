import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getSingleSalesOrderById } from "../../services/contractorApi";
import CardComponent from "../../components/CardComponent";
import { useTranslation } from "react-i18next";
import { Col } from "react-bootstrap";

const ViewSecurityDeposit = () => {
  const [viewDetails, setViewDetails] = useState({});
  const { t } = useTranslation();
  const location = useLocation();
  const id = location.state.id;

  const fetchSingleDetailsData = async () => {
    const res = await getSingleSalesOrderById(id);
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
        showBackButton={true}
        title={"View Security Deposit"}
        className={"after-bg-light"}
      >
        <div className="mb-3">
          <Col md={12}>
            <div className="p-20 shadow rounded h-100">
              <strong className="text-secondary">{t("Details")}</strong>
              <div className="mt-2">
                <table className="table-sm table">
                  <tbody>
                    {viewDetails?.regional_office_name && (
                      <tr>
                        <th>{t("regional office name")} :</th>
                        <td>{viewDetails?.regional_office_name}</td>
                      </tr>
                    )}
                    {viewDetails?.po_number && (
                      <tr>
                        <th>{t("PO Number")} :</th>
                        <td>{viewDetails?.po_number}</td>
                      </tr>
                    )}
                    {viewDetails?.tender_date && (
                      <tr>
                        <th>{t("Tender Date")} :</th>
                        <td>{viewDetails?.tender_date}</td>
                      </tr>
                    )}
                    {viewDetails?.tender_number && (
                      <tr>
                        <th>{t("Tender Number")} :</th>
                        <td>{viewDetails?.tender_number}</td>
                      </tr>
                    )}
                    {viewDetails?.security_deposit_date && (
                      <tr>
                        <th>{t("security deposit date")} :</th>
                        <td>{viewDetails?.security_deposit_date}</td>
                      </tr>
                    )}
                    <tr>
                      <th>{t("security deposit amount")} :</th>
                      <td>{viewDetails?.security_deposit_amount}</td>
                    </tr>
                    {viewDetails?.bank_name && (
                      <tr>
                        <th>{t("Bank Name")} :</th>
                        <td>{viewDetails?.bank_name}</td>
                      </tr>
                    )}
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

export default ViewSecurityDeposit;
