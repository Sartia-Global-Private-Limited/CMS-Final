import React, { Fragment, useEffect } from "react";
import { Col, Form, Row, Spinner, Table } from "react-bootstrap";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import CardComponent from "../../components/CardComponent";
import { ErrorMessage, Field, FieldArray, Formik } from "formik";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  getAllComapnyData,
  getAllStoredContactsPositions,
  getSingleContactsById,
  postContacts,
  updateContacts,
} from "../../services/contractorApi";
import { toast } from "react-toastify";
import { useState } from "react";
import ConfirmAlert from "../../components/ConfirmAlert";
import TextareaAutosize from "react-textarea-autosize";
import { Helmet } from "react-helmet";
import { BsDashLg, BsPlusLg } from "react-icons/bs";
import TooltipComponent from "../../components/TooltipComponent";
import { addContactsSchema } from "../../utils/formSchema";
import { ViewContactDetails } from "../Contacts/ViewContactDetails";
import { useTranslation } from "react-i18next";
import MyInput from "../../components/MyInput";
import { STATUS_TYPE } from "../../data/StaticData";

const CreateContacts = ({ checkPermission }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || null;
  const [edit, setEdit] = useState({});
  const [positionData, setPositionData] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const { t } = useTranslation();

  const fetchContactsData = async () => {
    const res = await getSingleContactsById(id);
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit([]);
    }
  };

  const fetchCompanyData = async () => {
    const res = await getAllComapnyData();
    if (res.status) {
      const rData = res.data.map((itm) => {
        return {
          value: itm.company_id,
          label: itm.company_name,
        };
      });
      setCompanyData(rData);
    } else {
      setCompanyData([]);
    }
  };

  const fetchPositionData = async () => {
    const res = await getAllStoredContactsPositions();
    if (res.status) {
      setPositionData(res.data);
    } else {
      setPositionData([]);
    }
  };

  useEffect(() => {
    if (id !== "new") {
      fetchContactsData();
    }
    fetchPositionData();
    fetchCompanyData();
  }, [id]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      ...values,
      position: values.position.value,
    };

    if (edit.id) {
      sData["id"] = edit.id;
    }
    const res = edit?.id
      ? await updateContacts(sData)
      : await postContacts(sData);
    if (res.status) {
      toast.success(res.message);
      navigate(-1);
      resetForm();
    } else {
      toast.error(res.message);
    }

    setSubmitting(false);
  };

  return (
    <>
      <Helmet>
        <title>
          {type === "view"
            ? "View"
            : edit?.id
            ? t("update contacts")
            : t("create contacts")}{" "}
          Contacts · CMS Electricals
        </title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CardComponent
          className={type === "view" && "after-bg-light"}
          title={`${
            type === "view"
              ? "View"
              : edit?.id
              ? t("Update Contacts")
              : t("create contacts")
          } `}
        >
          <Formik
            enableReinitialize={true}
            initialValues={{
              company_id: edit.company_id || "",
              first_name: edit.first_name || "",
              last_name: edit.last_name || "",
              position: edit.position
                ? {
                    label: edit?.position,
                    value: edit.position,
                  }
                : "",
              status: edit.status || "1",
              phone: edit?.phone || [
                {
                  number: "",
                  primary: "1",
                },
              ],
              email: edit?.email || [
                {
                  email: "",
                  primary: "1",
                },
              ],
              notes: edit.notes || "",
            }}
            validationSchema={addContactsSchema}
            onSubmit={handleSubmit}
          >
            {(props) => {
              return (
                <Form onSubmit={props?.handleSubmit}>
                  <Row className="g-3">
                    {type === "view" ? (
                      <ViewContactDetails edit={edit} />
                    ) : (
                      <>
                        <Form.Group as={Col} md={6}>
                          <div className="shadow p-3">
                            <Row className="g-3">
                              <Form.Group as={Col} md={12}>
                                <MyInput
                                  isRequired
                                  name={"company_id"}
                                  formikProps={props}
                                  label={t("COMPANY NAME")}
                                  customType={"select"}
                                  selectProps={{
                                    data: companyData,
                                  }}
                                />
                              </Form.Group>
                              <Form.Group as={Col} md={6}>
                                <MyInput
                                  isRequired
                                  name={"first_name"}
                                  formikProps={props}
                                  label={t("first name")}
                                />
                              </Form.Group>
                              <Form.Group as={Col} md={6}>
                                <MyInput
                                  name={"last_name"}
                                  formikProps={props}
                                  label={t("last name")}
                                />
                              </Form.Group>
                            </Row>
                          </div>
                        </Form.Group>
                        <Form.Group as={Col} md={6}>
                          <div className="shadow p-3">
                            <Row className="g-3">
                              <Form.Group as={Col} md={12}>
                                <Form.Label>
                                  {t("designation")}{" "}
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <CreatableSelect
                                  isClearable
                                  className="text-primary w-100"
                                  menuPortalTarget={document.body}
                                  name={"position"}
                                  value={props.values.position}
                                  options={positionData?.map((itm) => ({
                                    label: itm.position,
                                    value: itm.position,
                                  }))}
                                  onChange={(selectedOption) => {
                                    props.setFieldValue(
                                      "position",
                                      selectedOption
                                    );
                                  }}
                                  onBlur={props.handleBlur}
                                  isInvalid={Boolean(
                                    props.touched.position &&
                                      props.errors.position
                                  )}
                                />
                                <ErrorMessage
                                  name="position"
                                  component="small"
                                  className="text-danger"
                                />
                              </Form.Group>
                              <Form.Group as={Col} md={12}>
                                <MyInput
                                  isRequired
                                  name={"status"}
                                  formikProps={props}
                                  label={t("status")}
                                  customType={"select"}
                                  selectProps={{
                                    data: STATUS_TYPE,
                                  }}
                                />
                              </Form.Group>
                            </Row>
                          </div>
                        </Form.Group>

                        <Form.Group as={Col} md={12}>
                          <Row className="g-3">
                            <Form.Group as={Col} md={6}>
                              <FieldArray name="phone">
                                {({ remove, push }) => (
                                  <Fragment>
                                    {props?.values?.phone?.length > 0 && (
                                      <Table
                                        striped
                                        hover
                                        className="text-body bg-new Roles"
                                      >
                                        <thead>
                                          <tr>
                                            <th className="text-start">
                                              {t("phone number")}{" "}
                                              <span className="text-danger">
                                                *
                                              </span>
                                            </th>
                                            <th>{t("primary")}</th>
                                            <th>{t("Action")}</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {props?.values?.phone?.map(
                                            (itm, index) => {
                                              return (
                                                <tr key={index}>
                                                  <td
                                                    style={{ width: 250 }}
                                                    className="text-start"
                                                  >
                                                    <MyInput
                                                      isRequired
                                                      name={`phone.${index}.number`}
                                                      formikProps={props}
                                                      type="number"
                                                      onChange={(e) => {
                                                        if (
                                                          e.target.value
                                                            .length <= 10
                                                        ) {
                                                          props.handleChange(e);
                                                        }
                                                      }}
                                                    />
                                                  </td>
                                                  <td>
                                                    <label>
                                                      <Field
                                                        type="radio"
                                                        name={`phone.${index}.primary`}
                                                        className="form-check-input"
                                                        checked={
                                                          itm.primary === "1"
                                                        }
                                                        onChange={() => {
                                                          props.setFieldValue(
                                                            `phone.${index}.primary`,
                                                            "1"
                                                          );
                                                          props.values.phone.forEach(
                                                            (_, i) => {
                                                              if (i !== index) {
                                                                props.setFieldValue(
                                                                  `phone.${i}.primary`,
                                                                  "0"
                                                                );
                                                              }
                                                            }
                                                          );
                                                        }}
                                                      />
                                                      {t("is default")}
                                                    </label>
                                                  </td>
                                                  <td className="text-center">
                                                    {index === 0 ? (
                                                      <TooltipComponent
                                                        title={"Add"}
                                                      >
                                                        <BsPlusLg
                                                          onClick={() =>
                                                            push({
                                                              number: "",
                                                              primary: "0",
                                                            })
                                                          }
                                                          className={`social-btn success-combo`}
                                                        />
                                                      </TooltipComponent>
                                                    ) : (
                                                      <TooltipComponent
                                                        title={"Remove"}
                                                      >
                                                        <BsDashLg
                                                          onClick={() =>
                                                            remove(index)
                                                          }
                                                          className={`social-btn red-combo`}
                                                        />
                                                      </TooltipComponent>
                                                    )}
                                                  </td>
                                                </tr>
                                              );
                                            }
                                          )}
                                        </tbody>
                                      </Table>
                                    )}
                                  </Fragment>
                                )}
                              </FieldArray>
                            </Form.Group>
                            <Form.Group as={Col} md={6}>
                              <FieldArray name="email">
                                {({ remove, push }) => (
                                  <Fragment>
                                    {props?.values?.email?.length > 0 && (
                                      <Table
                                        striped
                                        hover
                                        className="text-body bg-new Roles"
                                      >
                                        <thead>
                                          <tr>
                                            <th className="text-start">
                                              {t("email")}{" "}
                                              <span className="text-danger">
                                                *
                                              </span>
                                            </th>
                                            <th>{t("primary")}</th>
                                            <th>{t("Action")}</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {props?.values?.email?.map(
                                            (itm, index) => (
                                              <tr key={index}>
                                                <td className="text-start">
                                                  <MyInput
                                                    isRequired
                                                    name={`email.${index}.email`}
                                                    formikProps={props}
                                                    type="email"
                                                  />
                                                </td>
                                                <td>
                                                  <label>
                                                    <Field
                                                      type="radio"
                                                      name={`email.${index}.primary`}
                                                      className="form-check-input"
                                                      checked={
                                                        itm.primary == "1"
                                                      }
                                                      onChange={() => {
                                                        props.setFieldValue(
                                                          `email.${index}.primary`,
                                                          "1"
                                                        );
                                                        props.values.email.forEach(
                                                          (_, i) => {
                                                            if (i !== index) {
                                                              props.setFieldValue(
                                                                `email.${i}.primary`,
                                                                "0"
                                                              );
                                                            }
                                                          }
                                                        );
                                                      }}
                                                    />
                                                    {t("is default")}
                                                  </label>
                                                </td>
                                                <td className="text-center">
                                                  {index === 0 ? (
                                                    <TooltipComponent
                                                      title={"Add"}
                                                    >
                                                      <BsPlusLg
                                                        onClick={() =>
                                                          push({
                                                            email: "",
                                                            primary: "0",
                                                          })
                                                        }
                                                        className={`social-btn success-combo`}
                                                      />
                                                    </TooltipComponent>
                                                  ) : (
                                                    <TooltipComponent
                                                      title={"Remove"}
                                                    >
                                                      <BsDashLg
                                                        onClick={() =>
                                                          remove(index)
                                                        }
                                                        className={`social-btn red-combo`}
                                                      />
                                                    </TooltipComponent>
                                                  )}
                                                </td>
                                              </tr>
                                            )
                                          )}
                                        </tbody>
                                      </Table>
                                    )}
                                  </Fragment>
                                )}
                              </FieldArray>
                            </Form.Group>
                          </Row>
                        </Form.Group>

                        <Form.Group as={Col} md={12}>
                          <div className="shadow p-3">
                            <MyInput
                              name={"notes"}
                              formikProps={props}
                              label={t("notes")}
                              customType={"multiline"}
                            />
                          </div>
                        </Form.Group>

                        <Form.Group as={Col} md={12}>
                          <div className="mt-4 text-center">
                            <button
                              type={`${edit.id ? "button" : "submit"}`}
                              onClick={() => setShowAlert(edit.id && true)}
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
                                <>{edit.id ? t("Update") : t("Create")}</>
                              )}
                            </button>
                            <ConfirmAlert
                              size={"sm"}
                              deleteFunction={props.handleSubmit}
                              hide={setShowAlert}
                              show={showAlert}
                              title={"Confirm UPDATE"}
                              description={
                                "Are you sure you want to update this!!"
                              }
                            />
                          </div>
                        </Form.Group>
                      </>
                    )}
                  </Row>
                </Form>
              );
            }}
          </Formik>
        </CardComponent>
      </Col>
    </>
  );
};

export default CreateContacts;
