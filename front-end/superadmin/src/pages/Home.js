import React from "react";
import { Col } from "react-bootstrap";
import { Helmet } from "react-helmet";
import TotalComplaint from "../components/BarCharts/TotalComplaint";
import ComplaintTypeStatusCount from "../components/BarCharts/ComplaintTypeStatusCount";
import AreaManagerDashBoard from "../components/BarCharts/AreaManagerDashBoard";
import EndUserDashBoard from "../components/BarCharts/EndUserDashBoard";
import BillingChart from "../components/BarCharts/BillingChart";
import TotalComplaints from "../components/BarCharts/TotalComplaints";
import AreaManagerBillingDashboard from "../components/BarCharts/AreaManagerBillingDashboard";
import RegionalOfficeBilling from "../components/BarCharts/AnalyticsBar/RegionalOfficeBilling";
import { HEADER_TITLE_DEFAULT } from "../data/StaticData";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>{HEADER_TITLE_DEFAULT}</title>
      </Helmet>
      <Col md={12}>
        <TotalComplaints />
      </Col>
      <Col md={12}>
        <ComplaintTypeStatusCount />
      </Col>
      <Col md={6}>
        <TotalComplaint />
      </Col>
      <Col md={6}>
        <BillingChart />
      </Col>
      <Col md={12}>
        <AreaManagerDashBoard />
      </Col>
      <Col md={12}>
        <EndUserDashBoard />
      </Col>
      <Col md={12}>
        <AreaManagerBillingDashboard />
      </Col>
      <Col md={12}>
        <RegionalOfficeBilling />
      </Col>
    </>
  );
};

export default Home;
