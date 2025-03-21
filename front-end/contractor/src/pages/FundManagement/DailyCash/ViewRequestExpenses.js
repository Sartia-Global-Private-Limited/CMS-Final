import React, { useState } from "react";
import Tabs, { Tab } from "react-best-tabs";
import "react-best-tabs/dist/index.css";
import { Card, Col } from "react-bootstrap";
import { Helmet } from "react-helmet";
import ViewRequest from "./ViewRequest";
import ViewExpenses from "./ViewExpenses";

const ViewRequestExpenses = () => {
  const [typeData, setTypeData] = useState("View Request");
  const handleClick = async (e) => {
    setTypeData(e.target.textContent);
  };

  return (
    <>
      <Helmet>
        <title>View Request & Expenses · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <Card className="card-bg">
          <Tabs
            onClick={(e) => handleClick(e)}
            activeTab={"2"}
            ulClassName="border-primary p-2 border-bottom"
            activityClassName="bg-secondary"
          >
            <Tab className="pe-none fs-15 fw-bold" title={"View Cash List"} />

            <Tab className="ms-auto" title={"View Request"}>
              <ViewRequest typeData={typeData} />
            </Tab>
            <Tab title={"View Expenses"}>
              <ViewExpenses typeData={typeData} />
            </Tab>
          </Tabs>
        </Card>
      </Col>
    </>
  );
};

export default ViewRequestExpenses;
