import React, { useEffect, useState } from "react";
import {
  getAdminAllModule,
  getAdminCreateTutorials,
  getAdminUpdateTutorials,
  getAllRolesForDropDown,
} from "../services/authapi";
import { Helmet } from "react-helmet";
import { Card, Col, Form, Row, Spinner } from "react-bootstrap";
import CardComponent from "../components/CardComponent";
import { Formik } from "formik";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { getAdminSingleTutorials } from "../services/authapi";
import ReactDropzone from "../components/ReactDropzone";
import { addTutorialsSchema } from "../utils/formSchema";
import ConfirmAlert from "../components/ConfirmAlert";
import { getImageSrc } from "../utils/helper";
import ImageViewer from "../components/ImageViewer";
import MyInput from "../components/MyInput";

const CreateTutorial = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [allRoles, setAllRoles] = useState([]);
  const [allModule, setAllModule] = useState([]);
  const [edit, setEdit] = useState(false);
  const { t } = useTranslation();

  const fetchSingleData = async () => {
    const res = await getAdminSingleTutorials(id);
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit({});
    }
  };

  const handleFileChange = (e, setFieldValue) => {
    if (e.target.files) {
      setFieldValue("attachment", e.target.files[0]);
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
    const res = await getAdminAllModule();
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
    const formData = new FormData();

    Object.entries(values).forEach(([name, value]) => {
      formData.append(name, value);
    });

    if (edit.id) {
      formData.append("id", edit.id);
    }

    // return console.log("formData", ...formData);

    const res = edit.id
      ? await getAdminUpdateTutorials(formData)
      : await getAdminCreateTutorials(formData);
    if (res.status) {
      navigate(-1);
      resetForm();
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    setSubmitting(false);
  };
  function MyCard({ children }) {
    return (
      <Card className="bg-new h-100">
        <Card.Body>{children}</Card.Body>
      </Card>
    );
  }
  return (
    <>
      <Helmet>
        <title>
          {t(`${edit.id ? "Update" : "Create"} Tutorial `)} · CMS Electricals
        </title>
      </Helmet>
      <Col md={12} data-aos="fade-up" data-aos-delay={200}>
        <CardComponent
          title={`${edit.id ? t("Update") : t("Create")} Tutorial `}
        >
          <Formik
            enableReinitialize={true}
            initialValues={{
              user_type: edit.user_type || "",
              application_type: edit.application_type || [],
              module_type: edit.module_type || "",
              tutorial_format: edit.tutorial_format || "",
              attachment: edit.attachment || null,
              description: edit.description || "",
            }}
            validationSchema={addTutorialsSchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props.handleSubmit}>
                <Row className="g-3 py-2">
                  <Col md={12}>
                    <MyCard>
                      <ReactDropzone
                        name="attachment"
                        onChange={(e) =>
                          handleFileChange(e, props.setFieldValue)
                        }
                        className={"text-center"}
                        title={
                          <>
                            <ImageViewer
                              downloadIcon
                              href={getImageSrc(
                                props.values.attachment,
                                edit?.attachment
                              )}
                              src={getImageSrc(
                                props.values.attachment,
                                edit?.attachment
                              )}
                            >
                              <img
                                src={getImageSrc(
                                  props.values.attachment,
                                  edit?.attachment
                                )}
                                className="my-btn object-fit"
                              />
                            </ImageViewer>
                            <div className="mt-3">
                              Upload Pdf Documents, Audio and Video
                            </div>
                          </>
                        }
                      />
                    </MyCard>
                  </Col>
                  <Form.Group as={Col} md={6}>
                    <MyInput
                      isRequired
                      name={"user_type"}
                      formikProps={props}
                      label={t("Software User Type")}
                      customType={"select"}
                      selectProps={{
                        data: allRoles?.map((roles) => ({
                          label: roles.name,
                          value: roles.id,
                        })),
                      }}
                    />
                  </Form.Group>

                  <Form.Group as={Col} md={6}>
                    <MyInput
                      isRequired
                      multiple
                      name={"application_type"}
                      formikProps={props}
                      label={t("Application Type")}
                      customType={"select"}
                      selectProps={{
                        data: [
                          { label: "Mobile", value: "mobile" },
                          { label: "Web", value: "web" },
                        ],
                      }}
                    />
                  </Form.Group>

                  <Form.Group as={Col} md={6}>
                    <MyInput
                      isRequired
                      name={"module_type"}
                      formikProps={props}
                      label={t("Module Type")}
                      customType={"select"}
                      selectProps={{
                        data: allModule?.map((module) => ({
                          label: module.title,
                          value: module.title,
                        })),
                      }}
                    />
                  </Form.Group>

                  <Form.Group as={Col} md={6}>
                    <MyInput
                      isRequired
                      name={"tutorial_format"}
                      formikProps={props}
                      label={t("Tutorial Format")}
                      customType={"select"}
                      selectProps={{
                        data: [
                          { label: "video", value: "video" },
                          { label: "audio", value: "audio" },
                          { label: "text", value: "text" },
                          { label: "pdf", value: "pdf" },
                          { label: "image", value: "image" },
                        ],
                      }}
                    />
                  </Form.Group>

                  <Col md={12}>
                    <MyInput
                      name={"description"}
                      formikProps={props}
                      label={t("Description")}
                      customType={"multiline"}
                    />
                  </Col>
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

export default CreateTutorial;
