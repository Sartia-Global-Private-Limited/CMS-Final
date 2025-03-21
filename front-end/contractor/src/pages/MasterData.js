import React from "react";
import Tabs, { Tab } from "react-best-tabs";
import "react-best-tabs/dist/index.css";
import { Col } from "react-bootstrap";
import { Helmet } from "react-helmet";
import EnergyCompany from "../components/MasterData/EnergyCompany";
import Zones from "../components/MasterData/Zones";
import RegionalOffices from "../components/MasterData/RegionalOffices";
import SalesArea from "../components/MasterData/SalesArea";
import District from "../components/MasterData/District";
import Outlets from "../components/MasterData/Outlets";
import EnergyCompanyTeam from "../components/MasterData/EnergyCompanyTeam";
import ComplaintTypes from "../components/MasterData/ComplaintTypes";

const MasterData = () => {
  const tabs = [
    { title: "Energy Company", page: <EnergyCompany /> },
    { title: "Zones", page: <Zones /> },
    { title: "Regional Offices", page: <RegionalOffices /> },
    { title: "Sales Area", page: <SalesArea /> },
    { title: "District", page: <District /> },
    { title: "Outlets", page: <Outlets /> },
    { title: "Energy Company Team", page: <EnergyCompanyTeam /> },
    { title: "Complaint Types", page: <ComplaintTypes /> },
  ];
  return (
    <>
      <Helmet>
        <title>Master Data · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <Tabs
          activeTab="1"
          ulClassName="border-primary border-bottom"
          activityClassName="bg-secondary"
        >
          {tabs.map((tab, idx) => (
            <Tab key={idx} title={tab.title}>
              <div className="mt-3">{tab.page}</div>
            </Tab>
          ))}
        </Tabs>
      </Col>
    </>
  );
};

export default MasterData;
