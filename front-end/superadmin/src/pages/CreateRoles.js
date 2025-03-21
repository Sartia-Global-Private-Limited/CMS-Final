import React, { useEffect, useState } from "react";
import {
  getAdminSingleRoles,
  getAdminUpdateRoles,
  getAllModuleByRoleId,
  getAllRolesForDropDown,
  postAdminCreateRoles,
} from "../services/authapi";
import { Helmet } from "react-helmet";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import CardComponent from "../components/CardComponent";
import { ErrorMessage, Formik } from "formik";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { addRolesSchema } from "../utils/formSchema";
import ConfirmAlert from "../components/ConfirmAlert";
import { CREATED, UPDATED } from "../utils/constants";
import { checkPermission } from "../utils/checkPermissions";
import { selectUser } from "../features/auth/authSlice";
import { useSelector } from "react-redux";
import MyInput from "../components/MyInput";

const CreateRoles = () => {
  let { pathname } = useLocation();
  const [rolesData, setRolesData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { userPermission, user } = useSelector(selectUser);

  const [showAlert, setShowAlert] = useState(false);
  const [allRoles, setAllRoles] = useState([]);
  const [allModule, setAllModule] = useState([]);

  const [edit, setEdit] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams();

  const fetchSingleData = async () => {
    const res = await getAdminSingleRoles(id);
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit({});
    }
  };

  const fetchAllRolesData = async () => {
    const res = await getAllRolesForDropDown();

    if (res.status) {
      setAllRoles(res.data);
    } else {
      setAllRoles([]);
    }
  };

  const fetchAllModuleData = async () => {
    const res = await getAllModuleByRoleId(1);
    if (res.status) {
      setAllModule(res.data);
    } else {
      setAllModule([]);
    }
  };

  useEffect(() => {
    if (id !== "new") {
      fetchSingleData();
    }
    fetchAllRolesData();
    fetchAllModuleData();
  }, []);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      name: values.name,
      module: values?.module,
    };

    if (edit.id) {
      sData["role_id"] = edit.id;
    }

    const params = await checkPermission({
      user_id: user.id,
      pathname: `/${pathname.split("/")[1]}`,
    });
    params["action"] = edit.id ? UPDATED : CREATED;

    const res = edit.id
      ? await getAdminUpdateRoles(sData, params)
      : await postAdminCreateRoles(sData, params);
    if (res.status) {
      navigate(-1);
      resetForm();
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    resetForm();
    setSubmitting(false);
    setRolesData(false);
  };

  return (
    <>
      <Helmet>
        <title>
          {t(`${edit.id ? "Update" : "Create"} Roles `)} · CMS Electricals
        </title>
      </Helmet>
      <Col md={12} data-aos="fade-up" data-aos-delay={200}>
        <CardComponent title={`${edit.id ? t("Update") : t("Create")} Roles `}>
          <Formik
            enableReinitialize={true}
            initialValues={{
              id: edit?.id || "",
              name: edit?.name || "",
              module: edit?.modules || [],
            }}
            // validationSchema={addRolesSchema}
            validationSchema={addRolesSchema(edit?.created_for == "3")}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props.handleSubmit}>
                <Row className="g-3 py-2">
                  <Form.Group>
                    <Form.Label>
                      Name <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      onChange={props.handleChange}
                      value={props.values.name}
                      name="name"
                    />
                    <ErrorMessage
                      name="name"
                      component="small"
                      className="text-danger"
                    />
                  </Form.Group>

                  {(!edit?.created_for || edit?.created_for === "1") && (
                    <Form.Group>
                      <MyInput
                        isRequired
                        multiple
                        name={"module"}
                        formikProps={props}
                        label={t("Select module")}
                        customType={"select"}
                        selectProps={{
                          data: allModule?.map((item) => ({
                            label: item.title,
                            value: item.id,
                          })),
                        }}
                        className="false"
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                      />
                    </Form.Group>
                  )}

                  <Form.Group as={Col} md={12}>
                    <div className="mt-4 text-center">
                      <button
                        type={`${edit.id ? "button" : "submit"}`}
                        onClick={() => setShowAlert(edit.id)}
                        disabled={props.isSubmitting}
                        className="shadow border-0 purple-combo cursor-pointer px-4 py-1"
                      >
                        {props.isSubmitting ? (
                          <>
                            <Spinner
                              animation="border"
                              variant="primary"
                              size="sm"
                            />
                            {t("PLEASE WAIT")}...
                          </>
                        ) : (
                          <>{edit.id ? t("UPDATE") : t("CREATE")}</>
                        )}
                      </button>

                      <ConfirmAlert
                        size="sm"
                        deleteFunction={props.handleSubmit}
                        hide={setShowAlert}
                        show={showAlert}
                        title={t("Confirm UPDATE")}
                        description={t(
                          "Are you sure you want to update this!!"
                        )}
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

export default CreateRoles;
