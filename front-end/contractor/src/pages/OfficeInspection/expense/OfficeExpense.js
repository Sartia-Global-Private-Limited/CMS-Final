import React, { useState } from "react";
import Tabs, { Tab } from "react-best-tabs";
import "react-best-tabs/dist/index.css";
import { Card, Col } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { useEffect } from "react";
import PendingExpense from "./PendingExpense";

const OfficeExpense = () => {
  const [getValue, setGetValue] = useState("");
  const tabs = [
    { title: "Office Expense", className: "fw-bold px-0 pe-none" },
    {
      title: "Pending",
      className: "ms-auto",
      page: <PendingExpense getValue={getValue} />,
    },
    {
      title: "Approved",
      className: "me-1",
      page: <PendingExpense getValue={getValue} />,
    },
  ];

  function handleClick(e) {
    setGetValue(e.target.textContent);
  }

  useEffect(() => {
    const firstTab = document.querySelector(
      "ul.border-primary li:nth-child(2)"
    );
    if (firstTab) {
      firstTab.click();
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Office Expense · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <Card className="card-bg">
          <Tabs
            onClick={(e) => handleClick(e)}
            activeTab="2"
            ulClassName="border-primary p-2 border-bottom"
            activityClassName="bg-secondary"
          >
            {tabs.map((tab, idx) => (
              <Tab key={idx} title={tab.title} className={tab.className}>
                <div className="p-2">{tab.page}</div>
              </Tab>
            ))}
          </Tabs>
        </Card>
      </Col>
    </>
  );
};

export default OfficeExpense;
