import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import CardComponent from "../../components/CardComponent";
import { Helmet } from "react-helmet";
import { BsPlus, BsTelephoneOutbound, BsTrash } from "react-icons/bs";
import {
  deleteAdminSingleHRTeams,
  getAdminSingleHRTeams,
} from "../../services/authapi";
import { useParams } from "react-router-dom";
import TooltipComponent from "../../components/TooltipComponent";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ConfirmAlert from "../../components/ConfirmAlert";
import { UserDetail } from "../../components/ItemDetail";

const HrTeamMembers = () => {
  const [singleData, setSingleData] = useState({});
  const [idToDelete, setIdToDelete] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { id } = useParams();
  const { t } = useTranslation();

  const fetchSingleHrTeamsData = async () => {
    const res = await getAdminSingleHRTeams(id, search);
    setSingleData(res.status ? res.data : {});
    setIsLoading(false);
  };

  const handleDelete = async () => {
    const res = await deleteAdminSingleHRTeams({
      team_id: id,
      user_id: idToDelete,
    });
    res.status ? toast.success(res.message) : toast.error(res.message);
    setShowAlert(false);
    fetchSingleHrTeamsData();
  };

  useEffect(() => {
    fetchSingleHrTeamsData();
  }, [search]);

  return (
    <Col md={12} data-aos="fade-up">
      <Helmet>
        <title>Team Members · CMS Electricals</title>
      </Helmet>

      <CardComponent
        className="after-bg-light"
        title={`Team Members - ${singleData?.team_name}`}
        icon={<BsPlus />}
        search
        searchOnChange={(e) => setSearch(e.target.value)}
        link={`/Teams/HrTeamMembers/${id}/add`}
        tag="Create"
      >
        <Row className="g-3">
          <Col md={12}>
            <div className="p-20 shadow rounded h-100">
              <strong className="text-secondary">Team Details</strong>
              <div className="mt-2">
                <table className="table-sm table">
                  <tbody>
                    <tr>
                      <th className="align-middle">Team Name :</th>
                      <td>{singleData?.team_name}</td>
                    </tr>
                    <tr>
                      <th className="align-middle">Manager :</th>
                      <td>
                        <UserDetail
                          img={singleData?.manager_image}
                          name={singleData?.manager_name}
                          id={singleData?.manager_id}
                          unique_id={singleData?.manager_employee_id}
                        />
                      </td>
                    </tr>
                    <tr>
                      <th className="align-middle">Supervisor :</th>
                      <td>
                        <UserDetail
                          img={singleData?.supervisor_image}
                          name={singleData?.supervisor_name}
                          id={singleData?.supervisor_id}
                          unique_id={singleData?.supervisor_employee_id}
                        />
                      </td>
                    </tr>
                    <tr>
                      <th className="align-middle">Description :</th>
                      <td>{singleData?.team_short_description || "-"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Col>

          {isLoading ? (
            <div className="text-center">
              <img
                className="p-3"
                width="250"
                src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
                alt="Loading"
              />
            </div>
          ) : singleData?.members?.length > 0 ? (
            singleData?.members?.map((team) => (
              <Col md={3} key={team.id}>
                <div
                  className="bg-new h-100 p-3 text-center position-relative"
                  style={{
                    backgroundColor: "#FFDEE9",
                    backgroundImage:
                      "linear-gradient(0deg, #FFDEE9 0%, #B5FFFC 100%)",
                  }}
                >
                  <span className="position-absolute top-0 end-0">
                    <TooltipComponent align="left" title={t("Remove")}>
                      <BsTrash
                        onClick={() => {
                          setIdToDelete(team.id);
                          setShowAlert(true);
                        }}
                        className="social-btn red-combo"
                      />
                    </TooltipComponent>
                  </span>
                  <div
                    className="mx-auto rounded-circle"
                    style={{ width: 100, height: 100 }}
                  >
                    <img
                      width={100}
                      height={100}
                      className="rounded-circle object-fit p-2 shadow"
                      src={
                        team.image
                          ? `${process.env.REACT_APP_API_URL}${team.image}`
                          : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                      }
                      alt="Team member"
                    />
                  </div>
                  <strong className="d-block py-2 text-black">
                    {team.name}
                    <span className="small text-muted fw-lighter">
                      {" "}
                      ({team.role})
                    </span>
                  </strong>
                  <span className="d-block text-black">{team.employee_id}</span>
                  {team.mobile && (
                    <a
                      className="small text-decoration-none d-block text-secondary"
                      href={`tel:${team.mobile}`}
                    >
                      <BsTelephoneOutbound /> {team.mobile}
                    </a>
                  )}
                  {team.email && (
                    <a
                      href={`mailto:${team.email}`}
                      className="small text-decoration-none text-gray"
                    >
                      {team.email}
                    </a>
                  )}
                </div>
              </Col>
            ))
          ) : (
            <div className="text-center">
              <img
                className="p-3"
                width="250"
                alt="No results"
                src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
              />
            </div>
          )}
        </Row>
      </CardComponent>

      <ConfirmAlert
        size="sm"
        deleteFunction={handleDelete}
        hide={setShowAlert}
        show={showAlert}
        title="Confirm Remove"
        description="Are you sure you want to remove this!!"
      />
    </Col>
  );
};

export default HrTeamMembers;
