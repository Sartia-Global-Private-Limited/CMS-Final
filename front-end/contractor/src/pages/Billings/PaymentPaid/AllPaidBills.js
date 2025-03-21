import React, { useState } from "react";
import { Card, Col } from "react-bootstrap";
import { Helmet } from "react-helmet";
import Tabs, { Tab } from "react-best-tabs";
import "react-best-tabs/dist/index.css";
import { useTranslation } from "react-i18next";
import DonePayments from "./DonePayments";
import PaymentProcess from "./PaymentProcess";
import PaidBills from "./PaidBills";
import { useNavigate, useSearchParams } from "react-router-dom";

const AllPaidBills = ({ checkPermission }) => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("last_tab") || "2"
  );
  const navigate = useNavigate();

  const handleClick = async (e, tab) => {
    localStorage.setItem("last_tab", tab);
    setActiveTab(tab);

    if (searchParams.has("pageNo")) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("pageNo");
      navigate(`?${newParams.toString()}`, { replace: true });
    }
  };

  return (
    <>
      <Helmet>
        <title>Billing Management CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <Card className="card-bg">
          <Tabs
            onClick={(e, tab) => handleClick(e, tab)}
            activeTab={activeTab}
            ulClassName="border-primary p-2 border-bottom"
            activityClassName="bg-secondary"
          >
            <Tab className="pe-none fs-15 fw-bold " title={t("payment paid")} />
            <Tab className="ms-auto" title={t("All paid bills")}>
              <PaidBills checkPermission={checkPermission} />
            </Tab>

            <Tab title={t("payment process")}>
              {activeTab == "3" && (
                <PaymentProcess checkPermission={checkPermission} />
              )}
            </Tab>

            <Tab title={t("done payments")}>
              {activeTab == "4" && (
                <DonePayments checkPermission={checkPermission} />
              )}
            </Tab>
          </Tabs>
        </Card>
      </Col>
    </>
  );
};

export default AllPaidBills;
