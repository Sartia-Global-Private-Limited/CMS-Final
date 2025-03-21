import React, { useEffect, useState } from "react";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import { Helmet } from "react-helmet";
import {
  addHrTeam,
  getAdminAllHREmployees,
  getAdminSingleHRTeams,
  getAdminUserListWithoutTeam,
  updateHrTeam,
} from "../../../services/authapi";
import { addHrTeamSchema } from "../../../utils/formSchema";
import { Formik } from "formik";
import { toast } from "react-toastify";
import ConfirmAlert from "../../../components/ConfirmAlert";
import CardComponent from "../../../components/CardComponent";
import { useNavigate, useParams } from "react-router-dom";
import MyInput from "../../../components/MyInput";
import { FORMAT_OPTION_LABEL } from "../../../components/HelperStructure";

const CreateTeams = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [allHrTeamManagers, setAllHrTeamManagers] = useState([]);
  const [allHrTeamMembers, setAllHrTeamMembers] = useState([]);
  const [allHrTeamSupervisors, setAllHrTeamSupervisors] = useState([]);
  const [edit, setEdit] = useState({});
  const [showAlert, setShowAlert] = useState(false);

  const fetchSingleData = async () => {
    const res = await getAdminSingleHRTeams(id);
    if (res.status) {
      setEdit(res.data);
      fetchAllHrTeamsMemebersData(res?.data?.supervisor_id);
    } else {
      setEdit([]);
    }
  };
  //All team managers
  const fetchAllHrTeamsManagersData = async () => {
    const res = await getAdminAllHREmployees({ isDropdown: true, team: 1 });
    if (res.status) {
      const rData = res.data?.map((itm) => {
        return {
          value: itm.id,
          label: itm.name,
          employee_id: itm.employee_id,
          image: itm.image
            ? `${process.env.REACT_APP_API_URL}${itm.image}`
            : null,
        };
      });
      setAllHrTeamManagers(rData);
    } else {
      setAllHrTeamManagers([]);
    }
  };

  //All team members
  const fetchAllHrTeamsMemebersData = async () => {
    const res = await getAdminUserListWithoutTeam();
    if (res.status) {
      const formatMember = (member) => ({
        value: member.id,
        label: member.name,
        employee_id: member.employee_id,
        image: member.image
          ? `${process.env.REACT_APP_API_URL}${member.image}`
          : null,
      });

      const teamMembers = edit?.team_id ? edit.members?.map(formatMember) : [];

      const teamSupervisor = edit?.supervisor_id
        ? {
            value: edit.supervisor_id,
            label: edit.supervisor_name,
            employee_id: edit.supervisor_employee_id,
            image: edit.supervisor_image
              ? `${process.env.REACT_APP_API_URL}${edit.supervisor_image}`
              : null,
          }
        : null;

      const usersWithoutTeams = res.data?.map(formatMember) || [];

      const rData = [...usersWithoutTeams, ...teamMembers];
      const rData2 = [...usersWithoutTeams];
      if (teamSupervisor) rData2.push(teamSupervisor);

      setAllHrTeamMembers(rData);
      setAllHrTeamSupervisors(rData2);
    } else {
      setAllHrTeamMembers([]);
      setAllHrTeamSupervisors([]);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    values["type"] = 1;
    if (edit?.team_id) {
      values["team_id"] = edit?.team_id;
    }
    // return console.log("values", values);

    const res = edit?.team_id
      ? await updateHrTeam(values)
      : await addHrTeam(values);
    if (res.status) {
      toast.success(res.message);
      resetForm();
      navigate(-1);
    } else {
      toast.error(res.message);
    }
    setSubmitting(false);
    setShowAlert(false);
  };

  useEffect(() => {
    if (id !== "new") {
      fetchSingleData();
    }
    fetchAllHrTeamsManagersData();
    fetchAllHrTeamsMemebersData();
  }, [edit?.team_id]);

  return (
    <>
      <Helmet>
        <title>
          {edit?.team_id ? "Update" : "Create"} Team · CMS Electricals
        </title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent title={`${edit?.team_id ? "Update" : "Create"} Team`}>
          <Formik
            enableReinitialize={true}
            initialValues={{
              manager_id: edit?.manager_id || "",
              supervisor_id: edit?.supervisor_id || "",
              members: edit.members?.map((itm) => itm?.id) || [],
              team_name: edit?.team_name || "",
              team_short_description: edit?.team_short_description || "",
            }}
            validationSchema={addHrTeamSchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props?.handleSubmit}>
                <Row className="g-2">
                  <Form.Group as={Col} md={6}>
                    <MyInput
                      isRequired
                      name={"manager_id"}
                      label={"Manager"}
                      formikProps={props}
                      customType={"select"}
                      selectProps={{
                        data: allHrTeamManagers?.filter(
                          (employ) =>
                            employ?.value !== props.values.supervisor_id &&
                            !props.values.members?.includes(employ?.value)
                        ),
                      }}
                      formatOptionLabel={FORMAT_OPTION_LABEL}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={6}>
                    <MyInput
                      isRequired
                      name={"supervisor_id"}
                      label={"Supervisor"}
                      formikProps={props}
                      customType={"select"}
                      selectProps={{
                        data: allHrTeamSupervisors?.filter(
                          (employ) =>
                            employ?.value !== props.values.manager_id &&
                            !props.values.members?.includes(employ?.value)
                        ),
                      }}
                      formatOptionLabel={FORMAT_OPTION_LABEL}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={6}>
                    <MyInput
                      isRequired
                      multiple
                      name={"members"}
                      label={"Team Members"}
                      formikProps={props}
                      customType={"select"}
                      selectProps={{
                        data: allHrTeamMembers?.filter(
                          (employ) =>
                            employ?.value !== props.values.manager_id &&
                            employ?.value !== props.values.supervisor_id
                        ),
                      }}
                      formatOptionLabel={FORMAT_OPTION_LABEL}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={6}>
                    <MyInput
                      isRequired
                      name={"team_name"}
                      label={"Team Name"}
                      formikProps={props}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={12}>
                    <MyInput
                      name={"team_short_description"}
                      label={"Description"}
                      formikProps={props}
                      customType={"multiline"}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={12}>
                    <div className="mt-4 text-center">
                      <button
                        type={`${edit?.team_id ? "button" : "submit"}`}
                        onClick={() => setShowAlert(edit?.team_id && true)}
                        disabled={props?.isSubmitting}
                        className="shadow border-0 purple-combo cursor-pointer px-4 py-1"
                      >
                        {props?.isSubmitting ? (
                          <>
                            <Spinner
                              animation="border"
                              variant="primary"
                              size="sm"
                            />{" "}
                            PLEASE WAIT...
                          </>
                        ) : (
                          <>{edit?.team_id ? "UPDATE" : "SAVE"}</>
                        )}
                      </button>
                      <ConfirmAlert
                        size={"sm"}
                        deleteFunction={props.handleSubmit}
                        hide={setShowAlert}
                        show={showAlert}
                        title={"Confirm UPDATE"}
                        description={"Are you sure you want to update this!!"}
                      />
                    </div>
                  </Form.Group>
                </Row>
              </Form>
            )}
          </Formik>
        </CardComponent>
      </Col>
    </>
  );
};

export default CreateTeams;
