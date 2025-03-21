import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getAdminAllHREmployees,
  getAdminAllTaskCategory,
  getAdminCreateTask,
  getAdminUpdateTask,
  getAllUsers,
} from "../../services/authapi";
import { Helmet } from "react-helmet";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import { Formik } from "formik";
import CardComponent from "../../components/CardComponent";
import { toast } from "react-toastify";
import moment from "moment/moment";
import { addTaskSchema } from "../../utils/formSchema";
import ConfirmAlert from "../../components/ConfirmAlert";
import { useTranslation } from "react-i18next";
import MyInput from "../../components/MyInput";

const CreateTask = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [taskCategory, setTaskCategory] = useState([]);
  const [allUserData, setAllUserData] = useState([]);
  const [allHrEmployees, setAllHrEmployees] = useState([]);
  const location = useLocation();
  const list = location.state?.list;
  const { t } = useTranslation();
  const navigate = useNavigate();

  const fetchTaskCategoryData = async () => {
    const isDropdown = true;
    const res = await getAdminAllTaskCategory({ isDropdown });
    if (res.status) {
      setTaskCategory(res.data);
    } else {
      setTaskCategory([]);
    }
  };

  const fetchAllUsersData = async () => {
    const res = await getAllUsers();
    if (res.status) {
      setAllUserData(res.data);
    } else {
      setAllUserData([]);
    }
  };

  const fetchAllHrEmployeesData = async () => {
    const isDropdown = true;
    const res = await getAdminAllHREmployees({ isDropdown });
    if (res.status) {
      setAllHrEmployees(res.data);
    } else {
      setAllHrEmployees([]);
    }
  };

  useEffect(() => {
    fetchAllUsersData();
    fetchAllHrEmployeesData();
    fetchTaskCategoryData();
  }, []);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    if (list?.id) {
      values["id"] = list?.id;
    }

    // return console.log("values", values);

    const res = list?.id
      ? await getAdminUpdateTask(values)
      : await getAdminCreateTask(values);
    if (res.status) {
      toast.success(res.message);
      resetForm();
      navigate(-1);
    } else {
      toast.error(res.message);
    }
    setSubmitting(false);
  };
  return (
    <>
      <Helmet>
        <title>Task Manager · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent title={`${list?.id ? "Update" : "Create"} Task`}>
          <Formik
            enableReinitialize={true}
            initialValues={{
              title: list?.title || "",
              project_name: list?.project_name || "",
              collaborators:
                list?.collaborators_list?.map((itm) => {
                  return itm?.id;
                }) || [],
              assign_to: list?.assign_to || "",
              category_id: list?.category_id || "",
              start_date: list?.start_date
                ? moment(list?.start_date).format("YYYY-MM-DD")
                : "",
              end_date: list?.end_date
                ? moment(list?.end_date).format("YYYY-MM-DD")
                : "",
              status: list?.status || "",
            }}
            validationSchema={addTaskSchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props?.handleSubmit}>
                <Row className="g-3">
                  <Form.Group as={Col} md={6}>
                    <MyInput
                      isRequired
                      name={"category_id"}
                      formikProps={props}
                      label={t("Category")}
                      customType={"select"}
                      selectProps={{
                        data: taskCategory?.map((category) => ({
                          label: category.name,
                          value: category.id,
                        })),
                      }}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={6}>
                    <MyInput
                      isRequired
                      name={"title"}
                      formikProps={props}
                      label={t("Task Title")}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={12}>
                    <MyInput
                      isRequired
                      name={"collaborators"}
                      formikProps={props}
                      label={t("Collaborators")}
                      multiple
                      customType={"select"}
                      selectProps={{
                        data: allHrEmployees?.map((user) => ({
                          label: user.name,
                          value: user.id,
                        })),
                      }}
                    />
                  </Form.Group>

                  <Form.Group as={Col} md={6}>
                    <MyInput
                      isRequired
                      name={"assign_to"}
                      formikProps={props}
                      label={t("Assign To")}
                      customType={"select"}
                      selectProps={{
                        data: allHrEmployees?.map((member) => ({
                          label: member.name,
                          value: member.id,
                        })),
                      }}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={6}>
                    <MyInput
                      isRequired
                      name={"project_name"}
                      formikProps={props}
                      label={t("Project Name")}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={6}>
                    <MyInput
                      isRequired
                      name={"start_date"}
                      formikProps={props}
                      label={t("Start Date")}
                      type="date"
                      onChange={(e) => {
                        props.setFieldValue("start_date", e.target.value);
                        props.setFieldValue("end_date", e.target.value);
                      }}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={6}>
                    <MyInput
                      isRequired
                      name={"end_date"}
                      formikProps={props}
                      label={t("End Date")}
                      type="date"
                      min={props.values.start_date}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={12}>
                    <MyInput
                      name={"status"}
                      formikProps={props}
                      label={t("Select Status")}
                      customType={"select"}
                      selectProps={{
                        data: [
                          { value: "assign", label: "assign" },
                          { value: "in progress", label: "in progress" },
                          { value: "completed", label: "completed" },
                        ],
                      }}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={12}>
                    <div className="mt-4 text-center">
                      <button
                        type={`${list?.id ? "button" : "submit"}`}
                        onClick={() => setShowAlert(list?.id && true)}
                        disabled={props?.isSubmitting}
                        className="shadow border-0 purple-combo cursor-pointer px-4 py-1"
                      >
                        {props?.isSubmitting ? (
                          <>
                            <Spinner
                              animation="border"
                              variant="primary"
                              size="sm"
                            />
                            {t("PLEASE WAIT")}...
                          </>
                        ) : (
                          <>{list?.id ? t("UPDATE") : t("CREATE")}</>
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

export default CreateTask;
