import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Spinner, Form } from "react-bootstrap";
import CardComponent from "../../components/CardComponent";
import { Helmet } from "react-helmet";
import { ErrorMessage, Formik } from "formik";
import { useTranslation } from "react-i18next";
import { BiPaperPlane } from "react-icons/bi";
import Select from "react-select";
import { toast } from "react-toastify";
import { postFeedbackSuggestion } from "../../services/contractorApi";
import { addFeedback } from "../../utils/formSchema";

const FeedbackSuggestion = () => {
  const [edit, setEdit] = useState({});
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      title: values.title,
      description: values.description,
      status: JSON.stringify(values.status.value),
    };
    const res = await postFeedbackSuggestion(sData);
    if (res.status) {
      navigate(-1);
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    resetForm();
    setSubmitting(false);
  };
  return (
    <>
      <Helmet>
        <title>Contacts · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CardComponent showBackButton={true} title={"Feedback And Suggestion"}>
          <Formik
            enableReinitialize={true}
            initialValues={{
              title: edit.title || "",
              description: edit.description || "",
              status: edit.status || "",
            }}
            validationSchema={addFeedback}
            onSubmit={handleSubmit}
          >
            {(props) => {
              return (
                <Form onSubmit={props?.handleSubmit}>
                  <div className="shadow p-3">
                    <Form.Group as={Col} md={12}>
                      <div className="p-3 mb-3  rounded h-900">
                        <Form.Group as={Col} md={4}>
                          <Form.Label>
                            {t("Type")}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Select
                            menuPortalTarget={document.body}
                            name={"status"}
                            options={[
                              { label: "Feedback", value: 1 },
                              { label: "Suggestion", value: 2 },
                            ]}
                            value={props.values.status}
                            onChange={(selectedOption) => {
                              props.setFieldValue("status", selectedOption);
                            }}
                            onBlur={props.handleBlur}
                            isInvalid={Boolean(
                              props.touched.status && props.errors.status
                            )}
                          />
                          <ErrorMessage
                            name="status"
                            component="small"
                            className="text-danger"
                          />
                        </Form.Group>
                      </div>
                      <Col md={12}>
                        <Form.Label className="fw-bolder ">
                          {t("Title")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className=" rounded h-100">
                          <Form.Control
                            type="text"
                            name="title"
                            value={props.values.title}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            isInvalid={Boolean(
                              props.touched.title && props.errors.title
                            )}
                          />
                          <Form.Control.Feedback type="invalid">
                            {props.errors.title}
                          </Form.Control.Feedback>
                        </div>
                      </Col>
                      <Col md={12}>
                        <Form.Label className="fw-bolder my-3">
                          {t("description")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className=" rounded h-100">
                          <Form.Control
                            as="textarea"
                            rows={4}
                            name="description"
                            value={props.values.description}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            isInvalid={Boolean(
                              props.touched.description &&
                                props.errors.description
                            )}
                          />
                          <Form.Control.Feedback type="invalid">
                            {props.errors.description}
                          </Form.Control.Feedback>
                        </div>
                      </Col>
                    </Form.Group>
                  </div>
                  <Form.Group as={Col} md={12}>
                    <div className="mt-4 text-center">
                      <button
                        type={`submit`}
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
                          <>
                            {t("Send")} <BiPaperPlane />
                          </>
                        )}
                      </button>
                    </div>
                  </Form.Group>
                </Form>
              );
            }}
          </Formik>
        </CardComponent>
      </Col>
    </>
  );
};

export default FeedbackSuggestion;
