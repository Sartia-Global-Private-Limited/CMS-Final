import React, { useState } from "react";
import Tabs, { Tab } from "react-best-tabs";
import "react-best-tabs/dist/index.css";
import { Col } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import PayRollAllowances from "./PayRollAllowances";
import PayRollDeductions from "./PayRollDeductions";
import { useNavigate, useSearchParams } from "react-router-dom";

const Payroll = ({ checkPermission }) => {
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const tabs = [
    {
      title: t("Allowances"),
      className: "ms-auto",
      page: <PayRollAllowances checkPermission={checkPermission} />,
    },
    {
      title: t("Deductions"),
      page: <PayRollDeductions checkPermission={checkPermission} />,
    },
  ];
  const handleClick = (e, idx) => {
    setActiveTab(idx);
    if (searchParams.has("pageNo")) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("pageNo");
      navigate(`?${newParams.toString()}`, { replace: true });
    }
  };
  return (
    <>
      <Helmet>
        <title>Payroll · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <Tabs
          onClick={(e, idx) => handleClick(e, idx)}
          activeTab={activeTab}
          ulClassName="border-primary py-2 border-bottom"
          activityClassName="bg-secondary"
        >
          {tabs.map((tab, idx) => (
            <Tab key={idx} title={tab.title} className={tab.className}>
              {tab.page}
            </Tab>
          ))}
        </Tabs>
      </Col>
    </>
  );
};

export default Payroll;
