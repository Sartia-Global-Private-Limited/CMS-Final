import React, { Fragment, useEffect, useState } from "react";
import { Card, Col, Form, Row, Table } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { BsCalendar4Week, BsDownload, BsTable } from "react-icons/bs";
import CardComponent from "../../../components/CardComponent";
import TooltipComponent from "../../../components/TooltipComponent";
import { useParams } from "react-router-dom";
import {
  viewSingleCalendarView,
  viewSingleEmployeeAttendance,
  viewSingleUsers,
} from "../../../services/authapi";
import moment from "moment";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useRef } from "react";

const UserAttendance = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [userData, setUserData] = useState({});
  const [userAttendance, setUserAttendance] = useState([]);
  const [calendarView, setCalendarView] = useState([]);
  const [calendarData, setCalendarData] = useState([]);
  const [changeView, setChangeView] = useState(false);
  const [datePicker, setDatePicker] = useState(
    moment(new Date()).format("YYYY-MM")
  );
  const calendarRef = useRef(null);

  const fetchAllData = async () => {
    const res = await viewSingleUsers(id);
    if (res.status) {
      setUserData(res.data);
    } else {
      setUserData({});
    }
  };
  const fetchAllUsersData = async () => {
    const res = await viewSingleEmployeeAttendance(id, datePicker);
    if (res.status) {
      setUserAttendance(res.data);
    } else {
      setUserAttendance([]);
    }
  };
  const fetchCalendarViewData = async () => {
    const res = await viewSingleCalendarView(id, datePicker);
    if (res.status) {
      const aDat = res.data.attendanceReports.map((itm, idx) => {
        // const days = idx;
        const today = new Date();
        const anotherDate = new Date(itm.date);
        return {
          title: today < anotherDate ? itm.title.replace("AB", "") : itm.title,
          start: new Date(itm.date),
          showBg: today < anotherDate,
        };
      });
      setCalendarView(aDat);
      setCalendarData(res.data);
    } else {
      setCalendarView([]);
      setCalendarData([]);
    }
  };

  const handlerMonth = async (e) => {
    const selectedMonth = e.target.value;
    setDatePicker(selectedMonth);

    if (calendarRef.current) {
      calendarRef.current.getApi().gotoDate(selectedMonth);
    }
  };

  function renderEventContent(eventInfo) {
    const showbg = eventInfo.event.extendedProps.showBg;
    return (
      !showbg && (
        <div className="m-auto">
          <h5
            className={`mb-0 text-${
              eventInfo?.event?._def?.title === "AB"
                ? "danger"
                : eventInfo?.event?._def?.title === "HF"
                ? "orange"
                : "green"
            } `}
          >
            {eventInfo.event.title}
          </h5>
        </div>
      )
    );
  }

  useEffect(() => {
    fetchAllData();
    fetchAllUsersData();
    if (changeView) {
      fetchCalendarViewData();
    }
  }, [changeView, datePicker]);

  const proinput = [
    {
      id: 1,
      name: "Name",
      value: userData?.name,
    },
    {
      id: 2,
      name: "Employee Code",
      value: userData?.employee_id,
    },
    {
      id: 3,
      name: "Email",
      value: userData?.email,
    },
    {
      id: 4,
      name: "Mobile Number",
      value: userData?.mobile,
    },
  ];

  return (
    <>
      <Helmet>
        <title>User Profile · CMS Electricals</title>
      </Helmet>

      <Col md={12}>
        <Card
          className="card-bg h-100"
          data-aos={"fade-up"}
          data-aos-delay={100}
        >
          <Card.Body className="py-2">
            <img
              className="img-fluid my-btn"
              src={
                userData?.image
                  ? `${process.env.REACT_APP_API_URL}${userData?.image}`
                  : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
              }
            />
            <span className="ms-2"> {userData?.name} - View Details</span>
          </Card.Body>
        </Card>
      </Col>
      <Col md={4}>
        <Card
          className="card-bg h-100"
          data-aos={"fade-left"}
          data-aos-delay={300}
        >
          <Card.Body>
            <div className="d-flex align-items-center justify-content-center">
              <div className="d-flex flex-column text-center align-items-center justify-content-between ">
                <div className="fs-italic">
                  <h5>
                    <strong>{userData?.name}</strong>
                  </h5>
                  <div className="text-muted-50 mb-3">
                    <small>{userData?.role_name?.name}</small>
                  </div>
                </div>
                <div className="card-profile-progress">
                  <div className="d-align my-bg p-2 rounded-circle">
                    <img
                      className="rounded-circle"
                      height={130}
                      width={130}
                      src={
                        userData?.image
                          ? `${process.env.REACT_APP_API_URL}${userData?.image}`
                          : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                      }
                      alt={userData?.name}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col md={8} data-aos={"fade-right"} data-aos-delay={400}>
        <CardComponent title={t("About User")}>
          <Row className="g-3">
            {proinput.map((input, ida) => (
              <Fragment key={ida}>
                {input.value ? (
                  <Col key={ida} md={12}>
                    <Form.Label>{input.name}</Form.Label>
                    <Form.Control value={input.value} disabled />
                  </Col>
                ) : null}
              </Fragment>
            ))}
          </Row>
        </CardComponent>
      </Col>
      <Col md={12}>
        <CardComponent
          backButton={false}
          title={"View Details"}
          custom2={
            <div className="d-flex gap-3">
              <Form.Control
                value={datePicker}
                onChange={handlerMonth}
                type="month"
              />

              <TooltipComponent
                title={changeView === false ? "Calendar View" : "Table View"}
              >
                <div
                  onClick={() => setChangeView(!changeView)}
                  className={`social-btn-re d-align gap-2 px-3 w-auto ${
                    changeView === false ? "danger" : "success"
                  }-combo`}
                >
                  {changeView === false ? <BsCalendar4Week /> : <BsTable />}
                </div>
              </TooltipComponent>
            </div>
          }
        >
          <div className="overflow-auto calendar p-2">
            {changeView === false ? (
              <Table className="text-body bg-new Roles">
                <thead className="text-truncate">
                  <tr>
                    {[
                      "Sr No.",
                      "Employee Name",
                      "Date",
                      "Day",
                      "Clock in",
                      "Clock Out",
                      "Work Duration",
                      "Action",
                    ].map((thead) => (
                      <th key={thead}>{thead}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {userAttendance?.length > 0 ? null : (
                    <tr>
                      <td colSpan={8}>
                        <img
                          className="p-3"
                          alt="no-result"
                          width="200"
                          src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                        />
                      </td>
                    </tr>
                  )}
                  {userAttendance?.map((data, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>
                        <div className="text-truncate">
                          <img
                            className="avatar me-2"
                            src={
                              data?.image
                                ? `${process.env.REACT_APP_API_URL}${data?.image}`
                                : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                            }
                          />
                          {data?.name}
                        </div>
                      </td>
                      <td>{data?.date}</td>
                      <td>{data?.day}</td>
                      <td>{data?.clockIn}</td>
                      <td>{data?.clockOut}</td>
                      <td>{data?.totalWorkHour}</td>
                      <td className="text-green">
                        <TooltipComponent title={"excel"}>
                          <BsDownload
                            download
                            className="social-btn success-combo"
                          />
                        </TooltipComponent>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <>
                total pay days -{" "}
                <strong className="text-secondary">
                  ({calendarData?.total_pay_days})
                </strong>
                <FullCalendar
                  ref={calendarRef}
                  plugins={[dayGridPlugin]}
                  initialView="dayGridMonth"
                  weekends={true}
                  events={calendarView}
                  eventContent={renderEventContent}
                  headerToolbar={{
                    start: "",
                    center: "",
                    end: "",
                  }}
                />
              </>
            )}
          </div>
        </CardComponent>
      </Col>
    </>
  );
};

export default UserAttendance;
