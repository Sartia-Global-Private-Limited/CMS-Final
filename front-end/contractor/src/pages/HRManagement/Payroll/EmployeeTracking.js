import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Helmet } from "react-helmet";
import CardComponent from "../../../components/CardComponent";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import Select from "react-select";
import { getAllUsers, getEmployeeTracking } from "../../../services/authapi";
import moment from "moment";

const EmployeeTracking = () => {
  const [allUserData, setAllUserData] = useState([]);
  const [selected, setSelected] = useState([]);
  const [trackingData, setTrackingData] = useState([]);

  const fetchAllUsersData = async () => {
    const res = await getAllUsers();
    if (res.status) {
      setAllUserData(res.data);
    } else {
      setAllUserData([]);
    }
  };
  const fetchEmployeeHistory = async (user_id) => {
    const res = await getEmployeeTracking(user_id);
    if (res.status) {
      setTrackingData(res.data);
    } else {
      setTrackingData([]);
    }
  };

  const handlerFieldValue = async (val) => {
    if (!val) return false;
    fetchEmployeeHistory(val.value);
    setSelected(val.label);
  };

  useEffect(() => {
    fetchAllUsersData();
  }, []);
  return (
    <>
      <Helmet>
        <title>Employee Tracking · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CardComponent classbody={"timebar-area"} title={"Employee Tracking"}>
          <Row className="g-4">
            <Col md={12}>
              <Select
                className="text-primary"
                menuPortalTarget={document.body}
                name="user_id"
                onChange={(val) => handlerFieldValue(val, "user_id")}
                options={allUserData?.map((user) => ({
                  value: user.id,
                  label: user.name,
                }))}
                placeholder="--Select Employee--"
              />
            </Col>
            {selected.includes("") ? (
              <>
                <Col md={5}>
                  <SimpleBar className="area ps-2 pe-3">
                    <p className="hr-border2 text-secondary fw-bolder pb-2">
                      Location History
                    </p>
                    <div className="ps-2">
                      {trackingData?.length > 0 ? null : (
                        <div className="text-center">
                          <img
                            className="p-3"
                            alt="no-result"
                            width="280"
                            src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                          />
                        </div>
                      )}
                      {trackingData?.map((timeline) => (
                        <div key={timeline?.id} className="hstack gap-4">
                          <div className="vr hr-shadow d-align align-items-baseline">
                            <span
                              className={`zIndex rounded-circle btn-play d-flex`}
                              style={{
                                padding: "7px",
                                backgroundColor: timeline?.color_code,
                              }}
                            />
                          </div>
                          <div className="small">
                            <p className="mb-1">{timeline?.remarks}</p>
                            <p className="mb-1">
                              <span className="fw-bold">latitude -</span>{" "}
                              {timeline?.latitude}
                            </p>
                            <p className="mb-1">
                              <span className="fw-bold">longitude -</span>{" "}
                              {timeline?.longitude}
                            </p>
                            <p>
                              {moment
                                .unix(timeline?.timestamp)
                                .format("h:mm a | DD/MM/YYYY")}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </SimpleBar>
                </Col>
                <Col md={7}>
                  <div className="bg-new p-2 rounded-0">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d56044.409394520524!2d77.35084839999999!3d28.6065084!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1672737497425!5m2!1sen!2sin"
                      height={300}
                      style={{ border: 0 }}
                      loading="lazy"
                      className="w-100"
                    />
                  </div>
                </Col>
              </>
            ) : (
              <Col md={12} className="text-center">
                <img
                  alt="no-result"
                  width="390"
                  src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                />
              </Col>
            )}
          </Row>
        </CardComponent>
      </Col>
    </>
  );
};

export default EmployeeTracking;
