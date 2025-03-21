import React, { Fragment, useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { BsPlus, BsSearch } from "react-icons/bs";
import { Helmet } from "react-helmet";
import TooltipComponent from "../../../components/TooltipComponent";
import { deleteTeam, getAdminAllHRTeams } from "../../../services/authapi";
import ImageViewer from "../../../components/ImageViewer";
import { toast } from "react-toastify";
import ConfirmAlert from "../../../components/ConfirmAlert";
import ReactPagination from "../../../components/ReactPagination";
import ActionButton from "../../../components/ActionButton";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const TeamCardWise = () => {
  const [allHrTeams, setAllHrTeams] = useState([]);
  const [idToDelete, setIdToDelete] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  //All teams
  const fetchAllHrTeamsData = async () => {
    const res = await getAdminAllHRTeams({ search, pageSize, pageNo });
    if (res.status) {
      setAllHrTeams(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setAllHrTeams([]);
      setPageDetail({});
    }
    setIsLoading(false);
  };

  // Delete Team
  const handleDelete = async () => {
    const res = await deleteTeam(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setAllHrTeams((prev) =>
        prev.filter((itm) => itm.team_id !== +idToDelete)
      );
      fetchAllHrTeamsData();
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
  };

  useEffect(() => {
    fetchAllHrTeamsData();
  }, [search, pageNo, pageSize]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  return (
    <>
      <Col md={12}>
        <Helmet>
          <title>Teams · CMS Electricals</title>
        </Helmet>

        <span className="d-align mt-3 me-3 justify-content-end gap-2">
          <span className="position-relative">
            <BsSearch className="position-absolute top-50 me-3 end-0 translate-middle-y" />
            <Form.Control
              type="text"
              placeholder={t("Search")}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              className="me-2"
              aria-label="Search"
            />
          </span>
          <Link
            to={`/Teams/create-teams/new`}
            variant="light"
            className={`text-none view-btn shadow rounded-0 px-1 text-orange`}
          >
            <BsPlus /> {t("Create")}
          </Link>
        </span>
        <div className="overflow-auto p-3">
          <Row className="g-3">
            {isLoading ? (
              <div className="text-center">
                <img
                  className="p-3"
                  width="290"
                  src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
                  alt={t("Loading")}
                />
              </div>
            ) : allHrTeams.length > 0 ? (
              <>
                {allHrTeams.map((hrTeams, index) => (
                  <Col md={6} key={index}>
                    <div className="bg-new w-100 p-3 h-100 before-border position-relative">
                      <Row className="align-items-center">
                        <Col md={3} className="text-center">
                          <ImageViewer
                            src={
                              hrTeams.manager_image
                                ? `${process.env.REACT_APP_API_URL}${hrTeams.manager_image}`
                                : "https://i.ibb.co/7Qmnbgz/2115951.png"
                            }
                          >
                            <div className="bg-new p-2">
                              <img
                                width={100}
                                className="img-fluid"
                                src={
                                  hrTeams.manager_image
                                    ? `${process.env.REACT_APP_API_URL}${hrTeams.manager_image}`
                                    : "https://i.ibb.co/7Qmnbgz/2115951.png"
                                }
                                alt="user-img"
                              />
                              <span className="small text-gray">
                                ({hrTeams.manager_role})
                              </span>
                            </div>
                          </ImageViewer>

                          <div className="fw-bolder d-grid small mt-2">
                            {hrTeams.manager_name}
                            <span className="fw-normal text-gray">
                              {hrTeams.manager_employee_id}
                            </span>
                          </div>
                        </Col>
                        <Col>
                          <div className="ms-3">
                            <div>
                              <strong className="text-primary">
                                {hrTeams.team_name}
                              </strong>
                            </div>
                            <div className="mb-2 small text-gray">
                              {hrTeams.team_short_description}
                            </div>
                            <div className="d-align justify-content-between user-hover">
                              <div>
                                <div className="d-flex align-items-center">
                                  {hrTeams?.members
                                    .slice(0, 5)
                                    .map((user, index) => (
                                      <Fragment key={index}>
                                        <TooltipComponent title={user.name}>
                                          <ImageViewer
                                            src={
                                              user.image
                                                ? `${process.env.REACT_APP_API_URL}${user.image}`
                                                : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                            }
                                          >
                                            <img
                                              className="user-hover-btn"
                                              src={
                                                user.image
                                                  ? `${process.env.REACT_APP_API_URL}${user.image}`
                                                  : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                              }
                                            />
                                          </ImageViewer>
                                        </TooltipComponent>
                                      </Fragment>
                                    ))}
                                  <div className="small ms-3 text-gray">
                                    {hrTeams.total_members} {t("Members")}
                                  </div>
                                </div>
                              </div>
                              <ActionButton
                                eyelink={`/Teams/HrTeamMembers/${hrTeams.team_id}`}
                                editlink={`/Teams/create-teams/${hrTeams.team_id}`}
                                deleteOnclick={() => {
                                  setIdToDelete(hrTeams.team_id);
                                  setShowAlert(true);
                                }}
                              />
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                ))}
              </>
            ) : (
              <div className="text-center">
                <img
                  className="p-3"
                  alt="no-result"
                  width="250"
                  src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                />
              </div>
            )}
            <Col md={12}>
              <ReactPagination
                pageSize={pageSize}
                prevClassName={
                  pageNo === 1 ? "danger-combo-disable pe-none" : "red-combo"
                }
                nextClassName={
                  pageSize == pageDetail?.total
                    ? allHrTeams.length - 1 < pageSize
                      ? "danger-combo-disable pe-none"
                      : "success-combo"
                    : allHrTeams.length < pageSize
                    ? "danger-combo-disable pe-none"
                    : "success-combo"
                }
                title={`Showing ${pageDetail?.pageStartResult || 0} to ${
                  pageDetail?.pageEndResult || 0
                } of ${pageDetail?.total || 0}`}
                handlePageSizeChange={handlePageSizeChange}
                prevonClick={() => setPageNo(pageNo - 1)}
                nextonClick={() => setPageNo(pageNo + 1)}
              />
            </Col>
          </Row>
        </div>
      </Col>
      <ConfirmAlert
        size={"sm"}
        deleteFunction={handleDelete}
        hide={setShowAlert}
        show={showAlert}
        title={"Confirm Delete"}
        description={"Are you sure you want to delete this!!"}
      />
    </>
  );
};

export default TeamCardWise;
