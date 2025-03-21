import React from "react";
import { Col, Row } from "react-bootstrap";
import { Helmet } from "react-helmet";
import CardComponent from "../../../components/CardComponent";
import "simplebar-react/dist/simplebar.min.css";
import { getSingleEmployeeLogs } from "../../../services/authapi";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import { useTranslation } from "react-i18next";

const EmployeeActivity = () => {
  const { id } = useParams();
  const [employeeLogs, setEmployeeLogs] = useState({});
  const { t } = useTranslation();
  const fetchSingleEmployeeLogsData = async () => {
    const res = await getSingleEmployeeLogs(id);
    if (res.status) {
      setEmployeeLogs(res.data);
    } else {
      setEmployeeLogs({});
    }
  };

  useEffect(() => {
    fetchSingleEmployeeLogsData();
  }, []);
  return (
    <>
      <Helmet>
        <title>Employee Activities · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CardComponent title={"Employee Activities"}>
          <div className="p-2">
            <div className="shadow after-bg-light">
              <div className="d-align h-100 p-3 gap-5 justify-content-start">
                <div className="my-bg p-2 rounded-circle">
                  <img
                    className="border-blue object-fit rounded-circle"
                    height={100}
                    width={100}
                    src={
                      employeeLogs?.image
                        ? `${process.env.REACT_APP_API_URL}${employeeLogs?.image}`
                        : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                    }
                    alt={employeeLogs?.user_name}
                  />
                </div>
                <div className="d-grid gap-2">
                  <p className="mb-0 fw-bold">
                    {employeeLogs?.user_name}{" "}
                    <small className="text-gray fw-lighter">
                      ({employeeLogs?.role})
                    </small>
                    <small className="float-end fw-lighter text-gray">
                      {moment
                        .unix(employeeLogs?.timestamp)
                        .format("h:mm a | DD/MM/YYYY")}
                    </small>
                  </p>
                  <small className="text-gray">
                    {t("Description")} -{" "}
                    <span className="fw-bold text-dark">
                      {employeeLogs?.action}
                    </span>
                  </small>
                  <small className="text-gray">
                    {t("user agent")} -{" "}
                    <span className="fw-bold text-dark">
                      {employeeLogs?.user_agent}
                    </span>
                  </small>
                  <small className="text-gray">
                    {t("result")} -{" "}
                    <span className="fw-bold text-dark">
                      {employeeLogs?.result}
                    </span>
                  </small>
                  <small className="text-gray">
                    {t("ip address")} -{" "}
                    <span className="fw-bold text-dark">
                      {employeeLogs?.ip_address}
                    </span>
                  </small>
                </div>
              </div>
            </div>
          </div>
        </CardComponent>
      </Col>
    </>
  );
};

export default EmployeeActivity;
