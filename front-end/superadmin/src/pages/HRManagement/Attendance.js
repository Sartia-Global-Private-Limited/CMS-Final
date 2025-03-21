import React, { useEffect, useState } from "react";
import Tabs, { Tab } from "react-best-tabs";
import "react-best-tabs/dist/index.css";
import { Col, Form, Row } from "react-bootstrap";
import { Helmet } from "react-helmet";
import CardComponent from "../../components/CardComponent";
import { BsPlus } from "react-icons/bs";
import TextareaAutosize from "react-textarea-autosize";
import { ErrorMessage, Formik } from "formik";
import Modaljs from "../../components/Modal";
import Select from "react-select";
import { createManuallySchema } from "../../utils/formSchema";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import {
  getAdminCreateMarkManually,
  getAdminTodayClockIn,
  getAdminTodayClockOut,
  getAllUsers,
  getDashboardData,
} from "../../services/authapi";
import { toast } from "react-toastify";
import TimeCard from "./Attendance/TimeCard";
import MemberClockIn from "./Attendance/MemberClockIn";
import MemberClockOut from "./Attendance/MemberClockOut";
import moment from "moment";
import { checkPermission } from "../../utils/checkPermissions";
import { CREATED, UPDATED } from "../../utils/constants";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { findMatchingPath } from "../../utils/helper";

const Attendance = () => {
  let { pathname } = useLocation();
  const { user } = useSelector(selectUser);
  const { userPermission } = useSelector(selectUser);
  const [matchingPathObject, setMatchingPathObject] = useState(null);
  const [getData, setGetData] = useState([]);
  const [getValue, setGetValue] = useState({});
  const [openAdd, setOpenAdd] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [refresh2, setRefresh2] = useState(false);
  const [allUserData, setAllUserData] = useState([]);
  const [clockIn, setClockIn] = useState([]);
  const [searchParams] = useSearchParams();
  const [clockOut, setClockOut] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();
  const fetchData = async () => {
    const res = await getDashboardData();
    if (res.status) {
      setGetData(res.data[0]);
    } else {
      setGetData([]);
    }
  };

  // for role and permissions
  useEffect(() => {
    if (userPermission) {
      const result = findMatchingPath(userPermission, pathname);
      setMatchingPathObject(result);
    }
  }, [userPermission, pathname, searchParams, navigate]);

  const checkPermission = matchingPathObject;

  const fetchAllUsersData = async () => {
    const res = await getAllUsers();
    if (res.status) {
      setAllUserData(res.data);
    } else {
      setAllUserData([]);
    }
  };  

  const tabs = [
    {
      title: "Time Card",
      page: <TimeCard checkPermission={checkPermission} refresh2={refresh2} />,
    },
    {
      title: "Members (Clock-In)",
      page: (
        <MemberClockIn
          // checkPermission={checkPermission}
          setRefresh={setRefresh}
          refresh={refresh}
          clockIn={clockIn}
        />
      ),
    },
    {
      title: "Members (Clock-Out)",
      page: (
        <MemberClockOut
          // checkPermission={checkPermission}
          clockOut={clockOut}
          setRefresh={setRefresh}
          refresh={refresh}
        />
      ),
    },
  ];

  const fetchClockInData = async () => {
    const res = await getAdminTodayClockIn();
    if (res.status) {
      setClockIn(res.data);
    } else {
      setClockIn([]);
    }
  };

  const fetchClockOutData = async () => {
    const res = await getAdminTodayClockOut();
    if (res.status) {
      setClockOut(res.data);
    } else {
      setClockOut([]);
    }
  };

  function handleClick(e, idx) {
    setGetValue(e.target);
    setActiveTab(idx);
    if (searchParams.has("pageNo")) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("pageNo");
      navigate(`?${newParams.toString()}`, { replace: true });
    }
    // if (e.target.textContent === "Time Card") {
    //     fetchAllUsersData();
    // }
    if (e.target.textContent === "Members (Clock-In)") {
      fetchClockInData();
    }
    if (e.target.textContent === "Members (Clock-Out)") {
      fetchClockOutData();
    }
  }

  useEffect(() => {
    fetchData();
    fetchAllUsersData();
    if (getValue && getValue.textContent === "Members (Clock-In)") {
      fetchClockInData();
    }
    if (getValue && getValue.textContent === "Members (Clock-Out)") {
      fetchClockOutData();
    }
  }, [refresh]);

  const options = [
    { label: "Absent", value: 1 },
    { label: "Present", value: 2 },
    { label: "Half Day", value: 3 },
  ];

  const defaultOption = options.find((option) => option.value === 1);

  return (
    <>
      <Helmet>
        <title>Attendance · CMS Electricals</title>
      </Helmet>

      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent
          title={"Attendance"}
          icon={<BsPlus />}
          onclick={() => navigate("/Attendance/create")}
          tag={checkPermission?.create ? "Create" : null}
        >
          <Tabs
            activeTab={activeTab}
            onClick={(e, idx) => handleClick(e, idx)}
            ulClassName="border-primary border-bottom"
            activityClassName="bg-secondary"
          >
            {tabs.map((tab, idx) => (
              <Tab key={idx} title={tab.title} className={tab.className}>
                <div className="mt-3">{tab.page}</div>
              </Tab>
            ))}
          </Tabs>

          {/* <Formik
            enableReinitialize={true}
            initialValues={{
              user_ids: "",
              in_time: moment().format(`YYYY-MM-DD 09:00`) || "",
              out_time: moment().format(`YYYY-MM-DD 18:00`) || "",
              is_default_time: false,
              note: "",
              attendance_status: defaultOption,
            }}
            validationSchema={createManuallySchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Modaljs
                open={openAdd}
                size={"md"}
                closebtn={"Cancel"}
                Savebtn={"Save"}
                close={() => setOpenAdd(false)}
                title={"Create Manually"}
                formikProps={props}
              >
                <Row className="g-3">
                  <Form.Group as={Col} md={12}>
                    <Form.Label>
                      User Name <span className="text-danger">*</span>
                    </Form.Label>

                    <Select
                      menuPosition="fixed"
                      isMulti
                      closeMenuOnSelect={false}
                      className="text-primary"
                      name="user_ids"
                      value={props.values.user_ids}
                      onChange={(val) => props.setFieldValue("user_ids", val)}
                      options={allUserData?.map((user) => ({
                        value: user.id,
                        label: user.name,
                      }))}
                    />
                    <ErrorMessage
                      name="user_ids"
                      component="small"
                      className="text-danger"
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={12}>
                    <Form.Label>
                      Attendance Status{" "}
                      <span className="text-danger fw-bold">*</span>
                    </Form.Label>
                    <Select
                      menuPosition="fixed"
                      name="attendance_status"
                      options={options}
                      onChange={(selectedOption) => {
                        props.setFieldValue(
                          "attendance_status",
                          selectedOption
                        );
                        props.setFieldValue(
                          "out_time",
                          moment().format(
                            `YYYY-MM-DD ${
                              selectedOption.value === 3 ? "14:00" : "18:00"
                            }`
                          )
                        );
                      }}
                      value={props.values.attendance_status}
                    />
                    <ErrorMessage
                      name="attendance_status"
                      component="small"
                      className="text-danger"
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={12}>
                    <Form.Check
                      id="is_default_time"
                      type="checkbox"
                      label="Is Default Time"
                      name={"is_default_time"}
                      onChange={props.handleChange}
                    />
                  </Form.Group>
                  {!props.values.is_default_time && (
                    <>
                      <Form.Group as={Col} md={6}>
                        <Form.Label>In Time</Form.Label>
                        <Form.Control
                          type="datetime-local"
                          name={"in_time"}
                          value={props.values.in_time}
                          onChange={props.handleChange}
                        />
                      </Form.Group>
                      <Form.Group as={Col} md={6}>
                        <Form.Label>Out Time</Form.Label>
                        <Form.Control
                          type="datetime-local"
                          name={"out_time"}
                          value={props.values.out_time}
                          onChange={props.handleChange}
                        />
                      </Form.Group>
                    </>
                  )}
                  <Form.Group as={Col} md={12}>
                    <Form.Label>Note</Form.Label>
                    <TextareaAutosize
                      minRows={2}
                      className="edit-textarea"
                      name={"note"}
                      value={props.values.note}
                      onChange={props.handleChange}
                    />
                  </Form.Group>
                </Row>
              </Modaljs>
            )}
          </Formik> */}
        </CardComponent>
      </Col>
    </>
  );
};

export default Attendance;
