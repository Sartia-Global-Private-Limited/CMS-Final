import React, { useEffect, useState } from "react";
import { getsingleAppliedLeaves } from "../../../services/authapi";
import { useLocation, useParams } from "react-router-dom";
import { Col, Form, Row } from "react-bootstrap";
import ImageViewer from "../../../components/ImageViewer";

import { useTranslation } from "react-i18next";
import moment from "moment";
import CardComponent from "../../../components/CardComponent";
import { BsCalendarDate, BsLightningCharge } from "react-icons/bs";

const ViewLeave = () => {
  const [edit, setEdit] = useState({});
  const { id } = useParams();
  const { t } = useTranslation();
  const location = useLocation();
  const status = location.state?.status;

  const fetchSingleData = async () => {
    const res = await getsingleAppliedLeaves(id, status);
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit({});
    }
  };

  useEffect(() => {
    fetchSingleData();
  }, []);

  return (
    <Col md={12}>
      <CardComponent showBackButton={true} title={t("Leave Details")}>
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
                alt={""}
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
      </CardComponent>
    </Col>
  );
};

export default ViewLeave;
