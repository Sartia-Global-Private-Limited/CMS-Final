import React, { Fragment, useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { BsPlus } from "react-icons/bs";
import CardComponent from "../../components/CardComponent";
import Modaljs from "../../components/Modal";
import { Helmet } from "react-helmet";
import TooltipComponent from "../../components/TooltipComponent";
import { Link } from "react-router-dom";
import Select from "react-select";
import {
  getAdminAllHREmployees,
  getAdminAllHRTeamManagers,
  getAdminAllHRTeams,
} from "../../services/authapi";
import ImageViewer from "../../components/ImageViewer";
import { addHrTeamSchema } from "../../utils/formSchema";
import { Formik } from "formik";

const Teams = () => {
  const [viewCompany, setviewCompany] = useState(false);
  const [allHrTeams, setAllHrTeams] = useState([]);
  const [allHrTeamManagers, setAllHrTeamManagers] = useState([]);
  const [allHrTeamMembers, setAllHrTeamMembers] = useState([]);

  //All teams
  const fetchAllHrTeamsData = async () => {
    const res = await getAdminAllHRTeams({});
    if (res.status) {
      setAllHrTeams(res.data);
    } else {
      setAllHrTeams([]);
    }
  };

  //All team managers
  const fetchAllHrTeamsManagersData = async () => {
    const res = await getAdminAllHRTeamManagers();
    if (res.status) {
      const rData = res.data
        .filter((itm) => itm.id !== 1)
        .map((itm) => {
          return {
            value: itm.id,
            label: itm.name,
          };
        });
      setAllHrTeamManagers(rData);
    } else {
      setAllHrTeamManagers([]);
    }
  };

  //All team members
  const fetchAllHrTeamsMemebersData = async () => {
    const res = await getAdminAllHREmployees({});
    if (res.status) {
      const rData = res.data
        .filter((itm) => itm.id !== 1)
        .map((itm) => {
          return {
            value: itm.id,
            label: itm.name,
          };
        });
      setAllHrTeamMembers(rData);
    } else {
      setAllHrTeamMembers([]);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    values.preventDefault();
    console.log("values", values);
  };

  useEffect(() => {
    fetchAllHrTeamsData();
    fetchAllHrTeamsManagersData();
    fetchAllHrTeamsMemebersData();
  }, []);

  return (
    <Col md={12} data-aos={"fade-up"}>
      <Helmet>
        <title>Teams · CMS Electricals</title>
      </Helmet>
      <CardComponent
        title={"Teams"}
        icon={<BsPlus />}
        onclick={() => setviewCompany(true)}
        tag={"Create Teams"}
      >
        <Row className="g-4">
          {allHrTeams.length > 0 ? null : (
            <div className="text-center">
              <img
                className="p-3"
                alt="no-result"
                width="250"
                src="assets/images/no-results.png"
              />
            </div>
          )}

          {allHrTeams.map((hrTeams, index) => (
            <Col md={6} key={index}>
              <div className="bg-new p-3 h-100 before-border position-relative">
                <Row className="align-items-center">
                  <Col md={3} className="text-center">
                    <ImageViewer
                      src={
                        hrTeams.image
                          ? `${process.env.REACT_APP_API_URL}${hrTeams.image}`
                          : "https://i.ibb.co/7Qmnbgz/2115951.png"
                      }
                    >
                      <img
                        width={100}
                        className="bg-new p-2"
                        src={
                          hrTeams.image
                            ? `${process.env.REACT_APP_API_URL}${hrTeams.image}`
                            : "https://i.ibb.co/7Qmnbgz/2115951.png"
                        }
                        alt="user-img"
                      />
                    </ImageViewer>

                    <div className="fw-bolder small mt-2">
                      {hrTeams.manager_name}
                    </div>
                  </Col>
                  <Col>
                    <div className="ms-3">
                      <div>
                        <strong className="text-primary">
                          {hrTeams.team_name}
                        </strong>
                      </div>
                      <div className="mb-2 small text-gray text-truncate2 line-clamp-2">
                        {hrTeams.team_short_description}
                      </div>
                      <div className="d-align justify-content-between user-hover">
                        <div>
                          <div className="d-flex align-items-center">
                            {hrTeams?.members.map((user, index) => (
                              <Fragment key={index}>
                                <TooltipComponent title={user.name}>
                                  <ImageViewer
                                    src={
                                      user.image
                                        ? `${process.env.REACT_APP_API_URL}${user.image}`
                                        : "assets/images/default-image.png"
                                    }
                                  >
                                    <img
                                      className="user-hover-btn"
                                      src={
                                        user.image
                                          ? `${process.env.REACT_APP_API_URL}${user.image}`
                                          : "assets/images/default-image.png"
                                      }
                                      alt="user-img"
                                    />
                                  </ImageViewer>
                                </TooltipComponent>
                              </Fragment>
                            ))}
                            <div className="small ms-3 text-gray">
                              {hrTeams.total_members} Members
                            </div>
                          </div>
                        </div>
                        <Link
                          to={`/HrTeamMembers/${hrTeams.team_id}`}
                          className="text-secondary text-decoration-none"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          ))}
        </Row>
      </CardComponent>

      <Modaljs
        open={viewCompany}
        size={"sm"}
        closebtn={"Cancel"}
        Savebtn={"Save"}
        close={() => setviewCompany(false)}
        title={"Create a Team"}
      >
        <Formik
          enableReinitialize={true}
          initialValues={{
            team_name: "",
            team_short_description: "",
            team_member: "",
            manager_id: "",
          }}
          validationSchema={addHrTeamSchema}
          onSubmit={handleSubmit}
        >
          {/* {console.log(initialValues)} */}
          {(props) => (
            <form onSubmit={props?.handleSubmit}>
              <Row className="g-2">
                <Form.Group as={Col} md={12}>
                  <Form.Control
                    type="text"
                    placeholder="Team Name"
                    name="team_name"
                    value={props.values.team_name}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                  />
                  <Form.Control.Feedback type="invalid">
                    {props.errors.team_name}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md={12}>
                  <Form.Label>Team Members</Form.Label>
                  <Select
                    menuPosition="fixed"
                    closeMenuOnSelect={false}
                    isMulti
                    name="team_member"
                    className="text-primary"
                    // defaultValue={options[0]}
                    options={allHrTeamMembers}
                  />
                  <Form.Control.Feedback type="invalid">
                    {props.errors.team_member}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md={12}>
                  <Form.Label>Team Manager</Form.Label>
                  <Select
                    menuPosition="fixed"
                    className="text-primary"
                    name="manager_id"
                    // defaultValue={allHrTeamManagers[0]}
                    options={allHrTeamManagers}
                  />
                  <Form.Control.Feedback type="invalid">
                    {props.errors.team_member}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
            </form>
          )}
        </Formik>
      </Modaljs>
    </Col>
  );
};

export default Teams;
