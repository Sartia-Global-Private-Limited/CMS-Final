import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { BsCheckLg, BsClock, BsTools, BsXLg } from "react-icons/bs";
import { Link, useNavigate, useParams } from "react-router-dom";
import CardComponent from "../../../components/CardComponent";
import TooltipComponent from "../../../components/TooltipComponent";
import { getAdminSingleComplaintTypes } from "../../../services/authapi";
import { approvedComplaint } from "../../../services/adminApi";
import { toast } from "react-toastify";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { selectUser } from "../../../features/auth/authSlice";
import { useSelector } from "react-redux";
import moment from "moment";

const ViewUserComplaint = () => {
  const { id } = useParams();
  const [singleComplaint, setSingleComplaint] = useState({});
  const naviagte = useNavigate();
  const { user } = useSelector(selectUser);

  const handleApprovedComplaint = async () => {
    const rData = {
      id: id,
      status: 3,
      status_changed_by: user.id,
    };
    const res = await approvedComplaint(rData);
    if (res.status) {
      toast.success(res.message);
      naviagte("/AllComplaintsMasterdata");
    } else {
      toast.error(res.message);
    }
  };
  const handleRejectedComplaint = async () => {
    const rData = {
      id: id,
      // status: +status === 1 ? 4 : 1,
      status: 4,
      status_changed_by: user.id,
    };
    const res = await approvedComplaint(rData);
    if (res.status) {
      toast.success(res.message);
      naviagte("/AllComplaintsMasterdata");
    } else {
      toast.error(res.message);
    }
  };
  const handleResolvedComplaint = async () => {
    const rData = {
      id: id,
      status: 5,
      status_changed_by: user.id,
    };
    const res = await approvedComplaint(rData);
    if (res.status) {
      toast.success(res.message);
      naviagte("/AllComplaintsMasterdata");
    } else {
      toast.error(res.message);
    }
  };

  const fetchSingleComplaintData = async () => {
    const res = await getAdminSingleComplaintTypes(id);
    if (res.status) {
      setSingleComplaint(res.data);
    } else {
      setSingleComplaint([]);
    }
  };

  useEffect(() => {
    fetchSingleComplaintData();
  }, []);

  function MyCard({ children, className }) {
    return (
      <Card className={`card-bg h-100 ${className}`}>
        <Card.Body>{children}</Card.Body>
      </Card>
    );
  }

  return (
    <Col md={12} data-aos={"fade-up"}>
      <CardComponent title={"View User Complaint"}>
        <Row className="g-4">
          <Col md={12}>
            <MyCard className={"after-bg-light timebar-area"}>
              <Row>
                <Col md={6}>
                  <div className="d-grid gap-2">
                    <p className="mb-0 fw-bold">
                      <span className="fw-normal me-3">Complaint For :</span>{" "}
                      {singleComplaint?.complaint_for == "1"
                        ? "Energy Company"
                        : "Other Company"}
                    </p>
                    <p className="mb-0 fw-bold">
                      <span className="fw-normal me-3">Date :</span>
                      {singleComplaint?.complaint_create_date}
                    </p>
                    {singleComplaint?.zones?.length > 0 && (
                      <div className="mb-0 fw-bold">
                        <span className="fw-normal me-3">Zones :</span>
                        {singleComplaint?.zones?.length > 0 &&
                          singleComplaint?.zones?.map((zone, id1) => {
                            return (
                              <span className="shadow me-2 px-2" key={id1}>
                                {zone.zone_name}
                              </span>
                            );
                          })}
                      </div>
                    )}

                    {singleComplaint?.regionalOffices?.length > 0 && (
                      <div className="mb-0 fw-bold">
                        <span className="fw-normal me-3">
                          Regional Offices :
                        </span>
                        {singleComplaint?.regionalOffices?.length > 0 &&
                          singleComplaint?.regionalOffices?.map((ro, id2) => {
                            return (
                              <span className="shadow me-2 px-2" key={id2}>
                                {ro.regional_office_name}
                              </span>
                            );
                          })}
                      </div>
                    )}
                    {singleComplaint?.saleAreas?.length > 0 && (
                      <div className="mb-0 fw-bold">
                        <span className="fw-normal me-3">Sale Areas :</span>
                        {singleComplaint?.saleAreas?.length > 0 &&
                          singleComplaint?.saleAreas?.map((sa, id3) => {
                            return (
                              <span className="shadow me-2 px-2" key={id3}>
                                {sa.sales_area_name}
                              </span>
                            );
                          })}
                      </div>
                    )}
                    {singleComplaint?.districts?.length > 0 && (
                      <div className="mb-0 fw-bold">
                        <span className="fw-normal me-3">Districts :</span>
                        {singleComplaint?.districts?.length > 0 &&
                          singleComplaint?.districts?.map((district, id4) => {
                            return (
                              <span className="shadow me-2 px-2" key={id4}>
                                {district.district_name}
                              </span>
                            );
                          })}
                      </div>
                    )}
                    {singleComplaint?.outlets?.length > 0 && (
                      <div className="mb-0 fw-bold">
                        <span className="fw-normal me-3">Outlets :</span>
                        {singleComplaint?.outlets?.length > 0 &&
                          singleComplaint?.outlets?.map((outlet, id5) => {
                            return (
                              <span className="shadow me-2 px-2" key={id5}>
                                {outlet.outlet_name}
                              </span>
                            );
                          })}
                      </div>
                    )}

                    <p className="mb-0 fw-bold">
                      <span className="fw-normal me-3">Order By :</span>{" "}
                      {singleComplaint?.order_by}
                    </p>
                    <p className="mb-0 fw-bold">
                      <span className="fw-normal me-3">Order Via :</span>{" "}
                      {singleComplaint?.order_via}
                    </p>

                    <p className="mb-0 fw-bold">
                      <span className="fw-normal me-3">Complaint Type :</span>{" "}
                      {singleComplaint?.complaint_type_name}
                    </p>
                    <p className="mb-0 fw-bold">
                      <span className="fw-normal me-3">Complaint Number :</span>{" "}
                      {singleComplaint?.complaint_unique_id}
                    </p>
                    <p className="mb-0 fw-bold">
                      <span className="fw-normal me-3">Description :</span>{" "}
                      {singleComplaint?.description}
                    </p>
                    <p className="mb-0 fw-bold">
                      {singleComplaint?.status == 1 ? (
                        <div className="d-align mt-3 justify-content-start gap-2">
                          <p className="mb-0 me-3 fw-bold">Reject / Approve</p>
                          <TooltipComponent title={"Reject"}>
                            <span
                              onClick={() =>
                                handleRejectedComplaint(singleComplaint.status)
                              }
                              className="social-btn-re d-align gap-2 px-3 w-auto red-combo"
                            >
                              <BsXLg />
                            </span>
                          </TooltipComponent>
                          <div className="vr hr-shadow" />
                          <TooltipComponent title={"Approve"}>
                            <span
                              onClick={() =>
                                handleApprovedComplaint(singleComplaint.status)
                              }
                              className=" social-btn-re d-align gap-2 px-3 w-auto success-combo"
                            >
                              <BsCheckLg />
                            </span>
                          </TooltipComponent>
                        </div>
                      ) : (
                        <>
                          <span className="fw-normal me-3">Status :</span>
                          {singleComplaint?.status == 5 ? (
                            <span className="text-orange">Resolved</span>
                          ) : singleComplaint?.status == 3 ? (
                            <span className="text-green">Approved</span>
                          ) : singleComplaint?.status == 4 ? (
                            <span className="text-danger">Rejected</span>
                          ) : null}{" "}
                        </>
                      )}
                      {singleComplaint?.status == 3 && (
                        <div className="d-align mt-3 justify-content-start gap-2">
                          <p className="mb-0 me-3 fw-bold">Resolved</p>
                          <TooltipComponent title={"Resolved"}>
                            <Link
                              to={`/AllComplaintsMasterdata/update-resolved/${singleComplaint.id}`}
                              // onClick={() =>
                              //   handleResolvedComplaint(singleComplaint.status)
                              // }
                              className="social-btn-re ms-3 d-align gap-2 px-3 w-auto danger-combo"
                            >
                              <BsTools />
                            </Link>
                          </TooltipComponent>
                        </div>
                      )}
                    </p>
                  </div>
                </Col>
                <Col md={6}>
                  <SimpleBar className="area ps-2 pe-3">
                    <span className="p-2 d-grid justify-content-center text-start">
                      {singleComplaint?.timeline?.length > 0 ? null : (
                        <div className="text-center">
                          <img
                            className="p-3"
                            alt="no-result"
                            width="320"
                            src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                          />
                        </div>
                      )}
                      {singleComplaint?.timeline?.map((data) => (
                        <span key={data?.id} className="hstack gap-4 px-3">
                          <div className="vr hr-shadow d-align align-items-baseline">
                            <span
                              className={`zIndex rounded-circle btn-play d-flex`}
                              style={{
                                padding: "7px",
                                backgroundColor: `#52${data?.id}${data?.id}FF`,
                              }}
                            />
                          </div>
                          <div className="small">
                            <p className="mb-1 text-gray">{data?.remark}</p>
                            <p className="mb-1">
                              Title -{" "}
                              <span className="text-green fw-bold">
                                {data?.title}
                              </span>
                            </p>
                            <p className="text-gray">
                              <BsClock className="text-secondary" />{" "}
                              {moment(data?.created_at).format(
                                "h:mm a | DD/MM/YYYY"
                              )}
                            </p>
                          </div>
                        </span>
                      ))}
                    </span>
                  </SimpleBar>
                </Col>
              </Row>
            </MyCard>
          </Col>
        </Row>
      </CardComponent>
    </Col>
  );
};

export default ViewUserComplaint;
