import React, { useEffect } from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import {
  BsCheckLg,
  BsDownload,
  BsTelephoneOutbound,
  BsXLg,
} from "react-icons/bs";
import { Link, useParams } from "react-router-dom";
import CardComponent from "../../../components/CardComponent";
import TooltipComponent from "../../../components/TooltipComponent";
import { useState } from "react";
import { viewSingleEmployeeLeave } from "../../../services/authapi";
import moment from "moment";
import ImageViewer from "../../../components/ImageViewer";

const ViewEmployeeLeave = () => {
  const { id } = useParams();

  const [viewLeave, setViewLeave] = useState("");

  const allViewData = async () => {
    const res = await viewSingleEmployeeLeave(id);
    if (res.status) {
      setViewLeave(res.data);
    } else {
      setViewLeave([]);
    }
  };

  // console.log(viewLeave);

  function MyCard({ children, className }) {
    return (
      <Card className={`card-bg h-100 ${className}`}>
        <Card.Body>{children}</Card.Body>
      </Card>
    );
  }

  useEffect(() => {
    allViewData();
  }, []);

  return (
    <Col md={12} data-aos={"fade-up"}>
      <CardComponent title={"View Employee Leave"}>
        <Row className="g-4">
          <Col md={6}>
            <MyCard className={"after-bg-light"}>
              <div className="d-align h-100 p-3 gap-5 justify-content-start">
                <div className="my-bg p-2 rounded-circle">
                  <ImageViewer
                    src={
                      viewLeave?.user_image
                        ? `${process.env.REACT_APP_API_URL}${viewLeave?.user_image}`
                        : "https://i.ibb.co/7Qmnbgz/2115951.png"
                    }
                  >
                    <img
                      className="border-blue object-fit rounded-circle"
                      width={120}
                      height={120}
                      src={
                        viewLeave?.user_image
                          ? `${process.env.REACT_APP_API_URL}${viewLeave?.user_image}`
                          : "https://i.ibb.co/7Qmnbgz/2115951.png"
                      }
                      alt={viewLeave?.applicant_name}
                    />
                  </ImageViewer>
                </div>
                <div className="d-grid gap-2">
                  {/* <div>
                    <div className="blue-btn-shadow text-truncate px-2 border-blue text-secondary small w-auto h-auto">
                      Website Designer
                    </div>
                  </div> */}
                  <div className="d-block">
                    <p className="mb-0 fw-bold">{viewLeave?.applicant_name}</p>
                    <a
                      href={`mailto:${viewLeave.email}`}
                      className="small text-decoration-none text-gray"
                    >
                      {viewLeave.email}
                    </a>
                  </div>
                  <a
                    className="small text-decoration-none d-block text-secondary"
                    href={`tel:${viewLeave.phone}`}
                  >
                    <BsTelephoneOutbound /> {viewLeave?.phone}
                  </a>
                  {/* <p>{viewLeave?.phone}</p> */}
                </div>
              </div>
            </MyCard>
          </Col>
          <Col md={6}>
            <MyCard className={"after-bg-light"}>
              <div className="d-grid gap-2">
                <p className="mb-0 fw-bold">
                  <span className="fw-normal me-3">Duration :</span>
                  {viewLeave?.total_days}.00 Days ({viewLeave?.total_hours}{" "}
                  Hours)
                </p>
                <p className="mb-0 fw-bold">
                  <span className="fw-normal me-3">Start Date :</span>{" "}
                  {moment(viewLeave?.start_date).format("DD/MM/YYYY")}
                </p>
                <p className="mb-0 fw-bold">
                  <span className="fw-normal me-3">End Date :</span>{" "}
                  {moment(viewLeave?.end_date).format("DD/MM/YYYY")}
                </p>
                <p className="mb-0 fw-bold">
                  <span className="fw-normal me-3">Leave Type :</span>
                  {viewLeave?.leave_type}
                </p>
                {viewLeave?.supporting_documents === null ? (
                  ""
                ) : (
                  <p className="mb-0 fw-bold">
                    <span className="fw-normal me-3">
                      Supporting Document :
                    </span>{" "}
                    <img
                      src={`${process.env.REACT_APP_API_URL}${viewLeave?.supporting_documents}`}
                    />
                    {/* <BsDownload className="cursor-pointer fs-5 text-orange" /> */}
                  </p>
                )}

                <div className="d-align mt-3 justify-content-start gap-2">
                  <p className="mb-0 me-3 fw-bold">Reject / Approve</p>
                  <TooltipComponent title={"Reject"}>
                    <span className="social-btn-re d-align gap-2 px-3 w-auto red-combo">
                      <BsXLg />
                    </span>
                  </TooltipComponent>
                  <div className="vr hr-shadow" />
                  <TooltipComponent title={"Approve"}>
                    <span className="social-btn-re d-align gap-2 px-3 w-auto success-combo">
                      <BsCheckLg />
                    </span>
                  </TooltipComponent>
                </div>
              </div>
            </MyCard>
          </Col>
        </Row>
      </CardComponent>
    </Col>
  );
};

export default ViewEmployeeLeave;
