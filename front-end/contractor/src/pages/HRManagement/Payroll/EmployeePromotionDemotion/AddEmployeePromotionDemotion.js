import React, { useEffect, useState } from "react";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import CardComponent from "../../../../components/CardComponent";
import { Helmet } from "react-helmet";
import { Formik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import {
  CreateEmployeePromotionDemotion,
  UpdateEmployeePromotionDemotion,
  getAdminAllHREmployees,
  getAdminAllHRTeams,
  getAllRolesForDropDown,
  getSingleDetailsEmployeePromotionDemotion,
} from "../../../../services/authapi";
import { toast } from "react-toastify";
import { addEmployeePromotionDemotionSchema } from "../../../../utils/formSchema";
import MyInput from "../../../../components/MyInput";
import { FORMAT_OPTION_LABEL } from "../../../../components/HelperStructure";
import ConfirmAlert from "../../../../components/ConfirmAlert";
import { useTranslation } from "react-i18next";

const AddEmployeePromotionDemotion = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [edit, setEdit] = useState({});
  const [allUserData, setAllUserData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [roles, setRoles] = useState([]);
  const [allHrTeams, setAllHrTeams] = useState([]);

  const fetchAllUsersData = async () => {
    const isDropdown = true;
    const res = await getAdminAllHREmployees({ isDropdown });
    if (res.status) {
      setAllUserData(res.data);
    } else {
      setAllUserData([]);
    }
  };

  const fetchRolesData = async () => {
    const res = await getAllRolesForDropDown();
    if (res.status) {
      setRoles(res.data);
    } else {
      setRoles([]);
    }
  };

  const fetchAllHrTeamsData = async () => {
    const res = await getAdminAllHRTeams({ isDropdown: "true" });
    if (res.status) {
      setAllHrTeams(res.data);
    } else {
      setAllHrTeams([]);
    }
  };

  const fetchSingleData = async () => {
    const res = await getSingleDetailsEmployeePromotionDemotion(id);
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit({});
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();
    for (const key in values) {
      formData.append(key, values[key]);
    }

    if (edit?.id) {
      formData.append("id", edit?.id);
    }

    // return console.log("sData", ...formData);
    const res = edit?.id
      ? await UpdateEmployeePromotionDemotion(formData)
      : await CreateEmployeePromotionDemotion(formData);
    if (res.status) {
      toast.success(res.message);
      navigate(-1);
      resetForm();
    } else {
      toast.error(res.message);
    }
    setSubmitting(false);
    setSubmitting(false);
  };

  useEffect(() => {
    fetchAllUsersData();
    fetchRolesData();
    fetchAllHrTeamsData();
    if (id !== "new") {
      fetchSingleData();
    }
  }, []);

  return (
    <Col md={12} data-aos={"fade-up"}>
      <Helmet>
        <title>Employee Promotion/Demotion · CMS Electricals</title>
      </Helmet>
      <CardComponent
        title={
          edit?.id
            ? t("Update Employee Promotion / Demotion")
            : t("Add Employee Promotion / Demotion")
        }
      >
        <Formik
          enableReinitialize={true}
          initialValues={{
            user_id: edit.user_id || "",
            purpose: edit.purpose || "",
            new_designation: edit.new_designation || "",
            new_team: edit.new_team || "",
            change_in_salary: edit.change_in_salary || "",
            change_in_salary_type: edit.change_in_salary_type || "",
            change_in_salary_value: edit.change_in_salary_value || "",
            document: edit.document || null,
            reason: edit.reason || "",
          }}
          validationSchema={addEmployeePromotionDemotionSchema}
          onSubmit={handleSubmit}
        >
          {(props) => (
            <Form onSubmit={props?.handleSubmit}>
              <Row className="g-4">
                <Col md={12}>
                  <Row className="g-4">
                    <Form.Group as={Col} md={4}>
                      <MyInput
                        isRequired
                        name={"user_id"}
                        formikProps={props}
                        label={"Select User"}
                        customType={"select"}
                        selectProps={{
                          data: allUserData?.map((user) => ({
                            label: user.name,
                            value: user.id,
                            employee_id: user.employee_id,
                            image: user.image
                              ? `${process.env.REACT_APP_API_URL}${user.image}`
                              : null,
                          })),
                        }}
                        formatOptionLabel={FORMAT_OPTION_LABEL}
                      />
                    </Form.Group>

                    <Form.Group as={Col} md={4}>
                      <MyInput
                        isRequired
                        name={"purpose"}
                        formikProps={props}
                        label={"PURPOSE"}
                        customType={"select"}
                        selectProps={{
                          data: [
                            { value: "promotion", label: "Promotion" },
                            { value: "demotion", label: "Demotion" },
                          ],
                        }}
                      />
                    </Form.Group>

                    <Form.Group as={Col} md={4}>
                      <MyInput
                        isRequired
                        name={"new_designation"}
                        formikProps={props}
                        label={"New Designation"}
                        customType={"select"}
                        selectProps={{
                          data: roles?.map((role) => ({
                            label: role.name,
                            value: role.id,
                          })),
                        }}
                      />
                    </Form.Group>

                    <Form.Group as={Col} md={4}>
                      <MyInput
                        isRequired
                        name={"new_team"}
                        formikProps={props}
                        label={"New Team"}
                        customType={"select"}
                        selectProps={{
                          data: allHrTeams?.map((team) => ({
                            label: team.team_name,
                            value: team.team_id,
                          })),
                        }}
                      />
                    </Form.Group>

                    <Form.Group as={Col} md={4}>
                      <MyInput
                        isRequired
                        name={"change_in_salary"}
                        formikProps={props}
                        label={"Changes in Salary (Basic)"}
                        customType={"select"}
                        selectProps={{
                          data: [
                            { value: "hike", label: "hike" },
                            { value: "deduction", label: "deduction" },
                          ],
                        }}
                      />
                    </Form.Group>

                    {props.values.change_in_salary === "hike" ||
                    props.values.change_in_salary === "deduction" ? (
                      <>
                        <Form.Group as={Col} md={2}>
                          <MyInput
                            isRequired
                            name={"change_in_salary_type"}
                            formikProps={props}
                            label={"PERCENTAGE/AMOUNT"}
                            customType={"select"}
                            selectProps={{
                              data: [
                                { value: "percentage", label: "Percentage" },
                                { value: "amount", label: "Amount" },
                              ],
                            }}
                          />
                        </Form.Group>

                        <Form.Group as={Col} md={2}>
                          <MyInput
                            isRequired
                            name={"change_in_salary_value"}
                            formikProps={props}
                            label={"Value"}
                          />
                        </Form.Group>
                      </>
                    ) : null}

                    <Form.Group as={Col} md={4}>
                      <MyInput
                        name={"document"}
                        formikProps={props}
                        label={"Relevant Documents / Upload"}
                        customType={"fileUpload"}
                      />
                    </Form.Group>
                    <Form.Group as={Col} md={8}>
                      <MyInput
                        isRequired
                        name={"reason"}
                        formikProps={props}
                        label={"REASON"}
                        customType={"multiline"}
                      />
                    </Form.Group>
                  </Row>
                </Col>
                <div className="hr-border2" />

                <Form.Group as={Col} md={12}>
                  <div className="text-center">
                    <button
                      type={`${edit?.id ? "button" : "submit"}`}
                      onClick={() => setShowAlert(edit?.id && true)}
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
                          {t("PLEASE WAIT")}...
                        </>
                      ) : (
                        <>{edit?.id ? t("UPDATE") : t("CREATE")}</>
                      )}
                    </button>
                    <ConfirmAlert
                      size={"sm"}
                      deleteFunction={
                        props.isValid ? props.handleSubmit : setShowAlert(false)
                      }
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
  );
};

export default AddEmployeePromotionDemotion;
