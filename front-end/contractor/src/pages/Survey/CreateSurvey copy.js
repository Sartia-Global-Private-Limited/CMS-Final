import React, { Fragment, useEffect, useState } from "react";
import { Row, Col, Form, Card, Spinner } from "react-bootstrap";
import Select from "react-select";
import { BsPlusLg, BsTrash, BsXLg } from "react-icons/bs";
import { AiOutlineCopy } from "react-icons/ai";
import Switch from "../../components/Switch";
import TooltipComponent from "../../components/TooltipComponent";
import CardComponent from "../../components/CardComponent";
import { useTranslation } from "react-i18next";
import { FieldArray, Formik } from "formik";
import {
  getAdminCreateSurvey,
  getAdminSingleSurvey,
  getAdminUpdateSurvey,
} from "../../services/authapi";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import CreateSurveyItemTable from "./CreateSurveyItemTable";
import ConfirmAlert from "../../components/ConfirmAlert";

const CreateSurvey = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();
  const [edit, setEdit] = useState({});
  const surveyType = [
    { value: "Add General Field", label: "Add General Field" },
    { value: "Add Item Table", label: "Add Item Table" },
  ];
  const [surveySelected, setSurveySelected] = useState(surveyType[0]);

  const fetchSingleSurveyData = async () => {
    const res = await getAdminSingleSurvey();
    if (res?.status) {
      setEdit(res?.data);
      setSurveySelected({ value: res?.data.format, label: res?.data.format });
    } else {
      setEdit({});
    }
  };

  function MyCard({ children, className }) {
    return (
      <Card className={`bg-new ${className}`}>
        <Card.Body>{children}</Card.Body>
      </Card>
    );
  }

  useEffect(() => {
    if (id !== "new") {
      fetchSingleSurveyData();
    }
  }, [id]);

  const options = [
    { value: "shorttext", label: "Short Text Area" },
    { value: "longtext", label: "Long Text Area" },
    { value: "select", label: "Select" },
    { value: "mselect", label: "Multi-Select" },
    { value: "text", label: "Text" },
    { value: "email", label: "Email" },
    { value: "date", label: "Date" },
    { value: "time", label: "Time" },
    { value: "file", label: "File" },
    { value: "url", label: "External Link" },
    { value: "number", label: "Phone Number" },
    { value: "checkbox", label: "check-box" },
    { value: "radio", label: "radio" },
  ];

  const handleSubmitForm = async (values, { setSubmitting, resetForm }) => {
    // return console.log(values);
    const sData = {
      format: "Add General Field",
      title: values.title,
      description: values.description,
      questions: values.questions,
    };
    if (edit.survey_id) {
      sData["id"] = edit?.survey_id;
    }
    // return console.log('form-Data', sData)
    const res = edit?.survey_id
      ? await getAdminUpdateSurvey(sData)
      : await getAdminCreateSurvey(sData);
    if (res.status) {
      toast.success(res.message);
      navigate(-1);
    } else {
      toast.error(res.message);
    }
    resetForm();
    setSubmitting(false);
  };

  const handleDefaultSelected = async (val, setFieldValue, name) => {
    if (setFieldValue) {
      setFieldValue(name, val);
    }
    if (!val) return false;
  };

  return (
    <Col md={12} data-aos={"fade-up"}>
      <CardComponent
        title={edit.survey_id ? "Update Survey" : "Create Survey"}
        custom2={
          <Select
            name={"format"}
            options={surveyType}
            value={
              edit?.survey_id
                ? { value: edit?.format, label: edit?.format }
                : surveySelected
            }
            isDisabled={edit?.survey_id && true}
            onChange={setSurveySelected}
          />
        }
      >
        {surveySelected.label === "Add General Field" ? (
          <Formik
            enableReinitialize={true}
            initialValues={{
              title: edit?.title || "",
              description: edit.description || "",
              questions: edit?.survey_questions?.map((item) =>
                JSON.parse(item.question)
              ) || [
                {
                  question: {
                    title: "",
                    type: "",
                    answers: [""],
                  },
                },
              ],
            }}
            // validationSchema={addEnergySchema}
            onSubmit={handleSubmitForm}
          >
            {(props) => (
              <Form onSubmit={props?.handleSubmit}>
                <Row className="g-4">
                  <Col className="mx-auto" md={8}>
                    <div className="d-grid gap-2">
                      <MyCard className={"border-info border-5 border-top"}>
                        <Form.Control
                          placeholder="Survey Title"
                          type="text"
                          name={"title"}
                          value={props.values.title}
                          onChange={props.handleChange}
                          className="fs-4 shadow-none border-primary rounded-0 border-1 border-bottom"
                        />
                        <Form.Control
                          type="text"
                          name={"description"}
                          value={props.values.description}
                          onChange={props.handleChange}
                          className="shadow-none border-primary rounded-0 border-1 border-bottom"
                          placeholder="Survey description"
                        />
                      </MyCard>
                      <FieldArray name="questions">
                        {({ push, remove }) => (
                          <div className="d-grid gap-2">
                            {props.values?.questions?.length > 0 &&
                              props.values?.questions?.map(
                                (question, index) => (
                                  <Fragment key={index}>
                                    <MyCard
                                      className={
                                        "border-orange border-5 border-start"
                                      }
                                    >
                                      <Row className="g-3">
                                        <FieldArray
                                          name={`questions[${index}].question.answers`}
                                        >
                                          {({ push, remove }) => (
                                            <>
                                              <Form.Group as={Col} md={6}>
                                                <Form.Label>
                                                  Question Title
                                                </Form.Label>
                                                <Form.Control
                                                  onChange={props.handleChange}
                                                  value={
                                                    question?.question?.title
                                                  }
                                                  name={`questions[${index}].question.title`}
                                                />
                                              </Form.Group>
                                              <Form.Group as={Col} md={6}>
                                                <Form.Label>
                                                  Select Type
                                                </Form.Label>
                                                <Select
                                                  menuPortalTarget={
                                                    document.body
                                                  }
                                                  name={`questions[${index}].question.type`}
                                                  value={
                                                    question?.question?.type
                                                  }
                                                  className="text-primary"
                                                  onChange={(e) => {
                                                    handleDefaultSelected(
                                                      e,
                                                      props.setFieldValue,
                                                      `questions[${index}].question.type`
                                                    );
                                                  }}
                                                  // defaultValue={options[1]}
                                                  options={options}
                                                />
                                                {/* {console.log('question.type', question?.question?.type?.value)} */}
                                              </Form.Group>
                                              <div className="d-grid gap-2">
                                                {/* {console.log("a", question?.question)} */}
                                                {typeof question?.question
                                                  ?.answers === "object" &&
                                                  question?.question?.answers?.map(
                                                    (answer, answerIndex) => (
                                                      <span
                                                        key={answerIndex}
                                                        className="d-flex gap-2"
                                                      >
                                                        {question?.question
                                                          ?.type?.value ===
                                                          "select" ||
                                                        question?.question?.type
                                                          ?.value ===
                                                          "mselect" ||
                                                        question?.question?.type
                                                          ?.value ===
                                                          "checkbox" ||
                                                        question?.question?.type
                                                          ?.value ===
                                                          "radio" ? (
                                                          <Form.Control
                                                            placeholder="Type Answer..."
                                                            onChange={
                                                              props.handleChange
                                                            }
                                                            value={answer}
                                                            type={"text"}
                                                            name={`questions[${index}].question.answers[${answerIndex}]`}
                                                          />
                                                        ) : null}

                                                        {question?.question
                                                          ?.type?.value ===
                                                          "select" ||
                                                        question?.question?.type
                                                          ?.value ===
                                                          "mselect" ||
                                                        question?.question?.type
                                                          ?.value ===
                                                          "checkbox" ||
                                                        question?.question?.type
                                                          ?.value ===
                                                          "radio" ? (
                                                          <TooltipComponent
                                                            title={t("Remove")}
                                                          >
                                                            <div
                                                              onClick={() =>
                                                                answerIndex !==
                                                                  0 &&
                                                                remove(
                                                                  answerIndex
                                                                )
                                                              }
                                                              className="social-btn-re w-auto red-combo d-align"
                                                            >
                                                              <BsXLg className="cursor-pointer" />
                                                            </div>
                                                          </TooltipComponent>
                                                        ) : null}
                                                      </span>
                                                    )
                                                  )}
                                                {question?.question?.type
                                                  ?.value === "select" ||
                                                question?.question?.type
                                                  ?.value === "mselect" ||
                                                question?.question?.type
                                                  ?.value === "checkbox" ||
                                                question?.question?.type
                                                  ?.value === "radio" ? (
                                                  <TooltipComponent
                                                    title={t("Add Option")}
                                                  >
                                                    <div
                                                      onClick={() => push("")}
                                                      className="social-btn-re w-auto success-combo d-align gap-2"
                                                    >
                                                      <BsPlusLg /> Add
                                                    </div>
                                                  </TooltipComponent>
                                                ) : null}
                                              </div>
                                            </>
                                          )}
                                        </FieldArray>

                                        <Col md={12}>
                                          <div className="hr-border2" />
                                        </Col>
                                        <Col md={12}>
                                          <div className="d-align gap-2 justify-content-end">
                                            <TooltipComponent
                                              title={t("Duplicate")}
                                            >
                                              <AiOutlineCopy
                                                onClick={() =>
                                                  push({
                                                    question: {
                                                      title: "",
                                                      type: "",
                                                      answers: [""],
                                                    },
                                                  })
                                                }
                                                className="social-btn success-combo"
                                              />
                                            </TooltipComponent>
                                            <TooltipComponent
                                              title={t("Delete")}
                                            >
                                              <BsTrash
                                                onClick={() =>
                                                  index !== 0 && remove(index)
                                                }
                                                className="social-btn red-combo"
                                              />
                                            </TooltipComponent>
                                            <div className="vr hr-shadow" />
                                            <span>
                                              <Form.Label>
                                                {t("Required")}{" "}
                                              </Form.Label>{" "}
                                              <Switch />
                                            </span>
                                          </div>
                                        </Col>
                                      </Row>
                                    </MyCard>
                                  </Fragment>
                                )
                              )}
                          </div>
                        )}
                      </FieldArray>
                      <div className="text-center mt-3">
                        <button
                          type={`${edit?.survey_id ? "button" : "submit"}`}
                          onClick={() => setShowAlert(edit?.survey_id && true)}
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
                              PLEASE WAIT...
                            </>
                          ) : (
                            <>{edit?.survey_id ? "UPDATE" : "Submit"}</>
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
                    </div>
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
        ) : (
          <CreateSurveyItemTable />
        )}
      </CardComponent>
    </Col>
  );
};

export default CreateSurvey;
