import React, { useState, useEffect } from "react";
import Tabs, { Tab } from "react-best-tabs";
import "react-best-tabs/dist/index.css";
import { Col } from "react-bootstrap";
import { Helmet } from "react-helmet";
import CardComponent from "../../../components/CardComponent";
import Modaljs from "../../../components/Modal";
import ApprovedLeave from "./ApprovedLeave";
import RequestLeave from "./RequestLeave";
import RejectedLeave from "./RejectedLeave";
import { getAdminAllHREmployees } from "../../../services/authapi";
import { BsCalendarDate, BsLightningCharge } from "react-icons/bs";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";

const Leaves = () => {
  const [detailShow, setDetailShow] = useState(false);
  const [edit, setEdit] = useState({});
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [allHrEmployees, setAllHrEmployees] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const handleEdit = async (ele) => {
    setEdit(ele);
    setDetailShow(true);
  };

  const tabs = [
    {
      title: t("Request Leave"),
      page: (
        <RequestLeave
          refresh={refresh}
          setRefresh={setRefresh}
          search={search}
          handleEdit={handleEdit}
          setDetailShow={setDetailShow}
        />
      ),
    },
    {
      title: t("Approved Leave"),
      page: (
        <ApprovedLeave
          refresh={refresh}
          handleEdit={handleEdit}
          search={search}
          setDetailShow={setDetailShow}
          // data={appliedLeaves.filter((e) => e.status === "approved")}
        />
      ),
    },
    {
      title: t("Rejected Leave"),
      page: (
        <RejectedLeave
          refresh={refresh}
          handleEdit={handleEdit}
          search={search}
          setDetailShow={setDetailShow}
          // data={appliedLeaves.filter((e) => e.status === "rejected")}
        />
      ),
    },
    ,
  ];

  const fetchAllHrEmployeesData = async () => {
    const isDropdown = "false";
    const res = await getAdminAllHREmployees({ isDropdown });
    if (res.status) {
      const rData = res.data.map((itm) => {
        return {
          value: itm.id,
          label: itm.name,
        };
      });

      setAllHrEmployees(rData);
    } else {
      setAllHrEmployees([]);
    }
  };

  const handleClick = (e, idx) => {
    setActiveTab(idx);
    if (searchParams.has("pageNo")) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("pageNo");
      navigate(`?${newParams.toString()}`, { replace: true });
    }
  };

  useEffect(() => {
    fetchAllHrEmployeesData();
  }, [search, refresh]);

  return (
    <>
      <Helmet>
        <title>Leaves · CMS Electricals</title>
      </Helmet>

      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent
          title={"All Employees Leaves"}
          search={true}
          searchOnChange={(e) => {
            setSearch(e.target.value);
          }}
        >
          <Tabs
            activeTab={activeTab}
            onClick={(e, idx) => handleClick(e, idx)}
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

      <Modaljs
        open={detailShow}
        size={"md"}
        closebtn={"Cancel"}
        hideFooter={"d-none"}
        close={() => setDetailShow(false)}
        title={t("View Details")}
      >
        <div className="shadow m-2 after-bg-light">
          <div className="d-align h-100 p-3 gap-5 justify-content-start">
            <div className="my-bg p-2 rounded-circle">
              <img
                className="border-blue object-fit rounded-circle"
                height={100}
                width={100}
                src={
                  edit.user_image
                    ? `${process.env.REACT_APP_API_URL}${edit.user_image}`
                    : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                }
                alt={edit?.applicant_name}
              />
            </div>
            <div className="d-grid gap-2">
              <small className={"text-green"}>
                <BsLightningCharge /> {edit?.leave_type}
              </small>
              {edit?.applicant_name && (
                <p className="mb-0 fw-bold">{edit?.applicant_name}</p>
              )}

              {edit?.supporting_documents && (
                <small className="text-gray">
                  <a
                    className="text-secondary"
                    target="_blank"
                    href={
                      process.env.REACT_APP_API_URL + edit?.supporting_documents
                    }
                  >
                    {"supporting documents"}
                  </a>
                </small>
              )}

              {edit?.reason && (
                <small className="text-gray">
                  {t("reason")} - {edit?.reason}
                </small>
              )}
              <small className="text-gray">
                <BsCalendarDate /> {t("Start date")} -{" "}
                <span className="text-success fw-bolder">
                  {moment(edit?.start_date).format("DD/MM/YYYY")}
                </span>
              </small>
              <small className="text-gray">
                <BsCalendarDate /> {t("End date")} -{" "}
                <span className="text-danger fw-bolder">
                  {moment(edit?.end_date).format("DD/MM/YYYY")}
                </span>
              </small>
              <small className="text-gray">
                {t("Duration")} -{" "}
                <span className="fw-bolder">{edit?.total_days}.00</span> Days{" "}
                <span className="fw-bolder">{edit?.total_hours}</span> Hours
              </small>
            </div>
          </div>
        </div>
      </Modaljs>
    </>
  );
};

export default Leaves;
