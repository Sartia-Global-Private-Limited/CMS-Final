import React, { useEffect, useState } from "react";
import {
  getAdminCreateTaskCategory,
  getAdminUpdateTaskCategory,
  getSingleTaskCategoryById,
} from "../../services/authapi";
import { Helmet } from "react-helmet";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import CardComponent from "../../components/CardComponent";
import { Formik } from "formik";
import MyInput from "../../components/MyInput";
import { toast } from "react-toastify";
import { addTaskCategorySchema } from "../../utils/formSchema";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmAlert from "../../components/ConfirmAlert";

const CreateTaskCategory = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [edit, setEdit] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams();

  const fetchSingleData = async () => {
    const res = await getSingleTaskCategoryById(id);
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit({});
    }
  };

  useEffect(() => {
    if (id !== "new") {
      fetchSingleData();
    }
  }, []);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    if (edit.id) values["id"] = edit.id;

    const res = edit.id
      ? await getAdminUpdateTaskCategory(values)
      : await getAdminCreateTaskCategory(values);

    if (res.status) {
      toast.success(res.message);
      navigate(-1);
    } else {
      toast.error(res.message);
    }

    resetForm();
    setSubmitting(false);
  };

  return (
    <>
      <Helmet>
        <title>
          {t(`${edit.id ? "Update" : "Create"} Task Category`)} · CMS
          Electricals
        </title>
      </Helmet>
      <Col md={12} data-aos="fade-up" data-aos-delay={200}>
        <CardComponent
          title={`${edit.id ? t("Update") : t("Create")} Task Category`}
        >
          <Formik
            enableReinitialize
            initialValues={{
              id: edit.id || "",
              name: edit.name || "",
              status: edit.status || "0",
            }}
            validationSchema={addTaskCategorySchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props?.handleSubmit}>
                <Row className="g-2">
                  <Form.Group as={Col} md={12}>
                    <MyInput
                      isRequired
                      name="name"
                      formikProps={props}
                      label={t("Name")}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={12}>
                    <MyInput
                      isRequired
                      name="status"
                      formikProps={props}
                      label={t("Select Status")}
                      customType="select"
                      selectProps={{
                        data: [
                          { label: t("Active"), value: "1" },
                          { label: t("Inactive"), value: "0" },
                        ],
                      }}
                    />
                  </Form.Group>
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

export default CreateTaskCategory;
