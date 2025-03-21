import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { BsDownload } from "react-icons/bs";
import CardComponent from "../../../components/CardComponent";
import TooltipComponent from "../../../components/TooltipComponent";
import { useParams } from "react-router-dom";
import {
  viewSingleEmployeeAttendance,
  viewSingleUsers,
} from "../../../services/authapi";
import moment from "moment";
import CustomTable from "../../../components/DataTable/CustomTable";
import { createColumnHelper } from "@tanstack/react-table";

const UserAttendance = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [userData, setUserData] = useState({});
  const [userAttendance, setUserAttendance] = useState([]);
  const columnHelper = createColumnHelper();
  const [datePicker, setDatePicker] = useState(
    moment(new Date()).format("YYYY-MM")
  );

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

  const handlerMonth = async (e) => {
    const selectedMonth = e.target.value;
    setDatePicker(selectedMonth);
  };

  useEffect(() => {
    fetchAllData();
    fetchAllUsersData();
  }, [datePicker]);

  const proinput = [
    {
      id: 1,
      name: t("Name"),
      value: userData?.name,
    },
    {
      id: 2,
      name: t("Employee Code"),
      value: userData?.employee_id,
    },
    {
      id: 3,
      name: t("Email"),
      value: userData?.email,
    },
    {
      id: 4,
      name: t("Mobile Number"),
      value: userData?.mobile,
    },
  ];

  const columns = useMemo(
    () => [
      columnHelper.accessor("sr_no", {
        header: t("Sr No."),
        cell: (info) => info.row.index + 1,
      }),
      columnHelper.accessor("name", {
        header: t("Employee Name"),
        cell: (info) => (
          <div className="text-truncate text-start">
            <img
              className="avatar me-2"
              src={
                info.row.original?.image
                  ? `${process.env.REACT_APP_API_URL}${info.row.original?.image}`
                  : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
              }
            />
            {info.row.original?.name}
          </div>
        ),
      }),
      columnHelper.accessor("date", {
        header: t("Date"),
      }),
      columnHelper.accessor("day", {
        header: t("Day"),
      }),
      columnHelper.accessor("clockIn", {
        header: t("Clock In"),
      }),
      columnHelper.accessor("clockOut", {
        header: t("Clock Out"),
      }),
      columnHelper.accessor("totalWorkHour", {
        header: t("Work Duration"),
      }),
      columnHelper.accessor("action", {
        header: t("Action"),
        cell: (info) => (
          <TooltipComponent title={"excel"}>
            <BsDownload download className="social-btn success-combo" />
          </TooltipComponent>
        ),
      }),
    ],
    [userAttendance?.length]
  );

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
            <span className="ms-2">
              {" "}
              {userData?.name} - {t("View Details")}
            </span>
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

      <Col md={12} data-aos={"fade-bottom"} data-aos-delay={500}>
        <CardComponent
          backButton={false}
          title={"View Details"}
          custom2={
            <Form.Control
              value={datePicker}
              onChange={handlerMonth}
              type="month"
            />
          }
        >
          <div className="table-scroll p-2">
            {userAttendance?.length > 0 && (
              <CustomTable
                id={"user_attendance"}
                rows={userAttendance || []}
                columns={columns}
                pagination={{
                  hideFooter: false,
                }}
                hideFilters={false}
              />
            )}
          </div>
        </CardComponent>
      </Col>
    </>
  );
};

export default UserAttendance;
