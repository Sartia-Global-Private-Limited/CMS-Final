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
import {
  getAdminAllHREmployees,
  getAllAppliedLeaves,
} from "../../../services/authapi";
import { BsCalendarDate, BsLightningCharge } from "react-icons/bs";
import moment from "moment";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/auth/authSlice";
import { findMatchingPath } from "../../../utils/helper";

const Leaves = () => {
  const [appliedLeaves, setAppliedLeaves] = useState([]);
  const [detailShow, setDetailShow] = useState(false);
  const [assignShow, setAssignShow] = useState(false);
  const [edit, setEdit] = useState({});
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [refresh, setRefresh] = useState(false);
  const [searchParams] = useSearchParams();
  const [allHrEmployees, setAllHrEmployees] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { userPermission } = useSelector(selectUser);
  const [matchingPathObject, setMatchingPathObject] = useState(null);

  const handleEdit = async (ele) => {
    setEdit(ele);
    setDetailShow(true);
  };

  // for role and permissions
  useEffect(() => {
    if (userPermission) {
      const result = findMatchingPath(userPermission, pathname);
      setMatchingPathObject(result);
    }
  }, [userPermission, pathname, searchParams, navigate]);

  const checkPermission = matchingPathObject;

  const tabs = [
    {
      title: "Request Leave",
      page: (
        <RequestLeave
          checkPermission={checkPermission}
          refresh={refresh}
          setRefresh={setRefresh}
          search={search}
          handleEdit={handleEdit}
          setDetailShow={setDetailShow}
        />
      ),
    },
    {
      title: "Approved Leave",
      page: (
        <ApprovedLeave
          checkPermission={checkPermission}
          refresh={refresh}
          handleEdit={handleEdit}
          setDetailShow={setDetailShow}
          data={appliedLeaves.filter((e) => e.status === "approved")}
        />
      ),
    },
    {
      title: "Rejected Leave",
      page: (
        <RejectedLeave
          checkPermission={checkPermission}
          refresh={refresh}
          handleEdit={handleEdit}
          setDetailShow={setDetailShow}
          data={appliedLeaves.filter((e) => e.status === "rejected")}
        />
      ),
    },
    ,
  ];

  const handleClick = (e, idx) => {
    setActiveTab(idx);
    if (searchParams.has("pageNo")) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("pageNo");
      navigate(`?${newParams.toString()}`, { replace: true });
    }
  };
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

  const fetchData = async () => {
    const res = await getAllAppliedLeaves(search, pageSize, pageNo);
    if (res.status) {
      setAppliedLeaves(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setAppliedLeaves([]);
      setPageDetail({});
    }
  };

  useEffect(() => {
    fetchData();
    fetchAllHrEmployeesData();
  }, [search, pageSize, pageNo, refresh]);

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
            onClick={(e, idx) => handleClick(e, idx)}
            activeTab={activeTab}
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
        title={"View Details"}
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
                    supporting documents
                  </a>
                </small>
              )}

              {edit?.reason && (
                <small className="text-gray">reason - {edit?.reason}</small>
              )}
              <small className="text-gray">
                <BsCalendarDate /> Start date -{" "}
                <span className="text-success fw-bolder">
                  {moment(edit?.start_date).format("DD/MM/YYYY")}
                </span>
              </small>
              <small className="text-gray">
                <BsCalendarDate /> End date -{" "}
                <span className="text-danger fw-bolder">
                  {moment(edit?.end_date).format("DD/MM/YYYY")}
                </span>
              </small>
              <small className="text-gray">
                Duration -{" "}
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
