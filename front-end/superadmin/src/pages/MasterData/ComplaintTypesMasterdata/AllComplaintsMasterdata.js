import React from "react";
import Tabs, { Tab } from "react-best-tabs";
import "react-best-tabs/dist/index.css";
import { Col } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { BsPlus } from "react-icons/bs";
import CardComponent from "../../../components/CardComponent";
import ApprovedComplaint from "./ApprovedComplaint";
import RejectedComplaint from "./RejectedComplaint";
import AllNewComplaint from "./AllNewComplaint";
import ResolvedComplaint from "./ResolvedComplaint";
import PendingComplaint from "./PendingComplaint";
import AssignComplaint from "./AssignComplaint";

const AllComplaintsMasterdata = () => {
  const tabs = [
    {
      title: "New Complaint",
      page: <AllNewComplaint />,
    },
    {
      title: "Pending",
      page: <PendingComplaint />,
    },
    {
      title: "Approved",
      page: <ApprovedComplaint />,
    },
    {
      title: "Rejected",
      page: <RejectedComplaint />,
    },
    {
      title: "Resolved",
      page: <ResolvedComplaint />,
    },
    {
      title: "Set Approval",
      page: <AssignComplaint />,
    },
  ];

  return (
    <>
      <Helmet>
        <title>Complaint Types · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent
          title={"All Complaints"}
          icon={<BsPlus />}
          link={`/AllComplaintsMasterdata/AddComplaintsMasterdata/new`}
          tag={"Create"}
        >
          <Tabs
            activeTab="1"
            ulClassName="border-primary me-1 border-bottom"
            activityClassName="bg-secondary"
          >
            {tabs.map((tab, idx) => (
              <Tab key={idx} title={tab.title} className={tab.className}>
                <div className="mt-4">{tab.page}</div>
              </Tab>
            ))}
          </Tabs>
        </CardComponent>
      </Col>
    </>
  );
};

export default AllComplaintsMasterdata;
