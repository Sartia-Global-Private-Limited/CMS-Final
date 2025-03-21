import React, { useEffect } from "react";
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
import { ViewContactDetails } from "./ViewContactDetails";
import { addContactsSchema } from "../../utils/formSchema";
import { useTranslation } from "react-i18next";
const CreateContacts = () => {
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
      company_id: values.company_id.value,
      first_name: values.first_name,
      last_name: values.last_name,
      position: values.position.value,
      notes: values.notes,
      status: values.status.value,
      phone: values.phone,
      email: values.email,
    };

    if (edit.id) {
      sData["id"] = edit.id;
    }

    // return console.log("sData", ...sData);
    const res = edit?.id
      ? await updateContacts(sData)
      : await postContacts(sData);
    if (res.status) {
      toast.success(res.message);
      navigate(-1);;
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
          {type === "view" ? "View" : edit?.id ? "Update" : "Create"} Contacts ·
          CMS Electricals
        </title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CardComponent
          className={type === "view" && "after-bg-light"}
          title={`${
            type === "view" ? "View" : edit?.id ? "Update" : "Create"
          } Contacts`}
        >
          <Formik
            enableReinitialize={true}
            initialValues={{
              company_id: edit.company_id
                ? {
                    label: edit?.company_name,
                    value: edit.company_id,
                  }
                : "",
              position: edit.position
                ? {
                    label: edit?.position,
                    value: edit.position,
                  }
                : "",
              first_name: edit.first_name || "",
              last_name: edit.last_name || "",
              status: edit.status
                ? {
                    label: edit?.status === "1" ? "Active" : "InActive",
                    value: edit.status,
                  }
                : { label: "Active", value: "1" },
              phone: edit?.phone || [
                {
                  number: "",
                  primary: false,
                },
              ],
              email: edit?.email || [
                {
                  email: "",
                  primary: false,
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
                  <Row className="g-3 align-items-center">
                    {type === "view" ? (
                      <ViewContactDetails edit={edit} />
                    ) : (
                      <>
                        <Form.Group as={Col} md={6}>
                          <div className="shadow p-3">
                            <Row>
                              <Col md={12}>
                                <div className="mb-2">
                                  <Form.Label className="fw-bolder">
                                    Company Name
                                    <span className="text-danger">*</span>
                                  </Form.Label>
                                  <Select
                                    menuPortalTarget={document.body}
                                    className="text-primary"
                                    name="company_id"
                                    value={props.values.company_id}
                                    onChange={(val) => {
                                      props.setFieldValue("company_id", val);
                                    }}
                                    onBlur={props.handleBlur}
                                    options={companyData}
                                    isInvalid={Boolean(
                                      props.touched.company_id &&
                                        props.errors.company_id
                                    )}
                                  />
                                  <ErrorMessage
                                    name="company_id"
                                    component="small"
                                    className="text-danger"
                                  />
                                </div>
                              </Col>
                              <Col md={6}>
                                <Form.Label className="fw-bolder">
                                  First Name
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  name="first_name"
                                  value={props.values.first_name}
                                  onChange={props.handleChange}
                                />
                              </Col>
                              <Col md={6}>
                                <Form.Label className="fw-bolder">
                                  Last Name
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  name="last_name"
                                  value={props.values.last_name}
                                  onChange={props.handleChange}
                                />
                              </Col>
                            </Row>
                          </div>
                        </Form.Group>
                        <Form.Group as={Col} md={6}>
                          <div className="shadow p-3">
                            <div className="mb-2">
                              <Form.Label className="fw-bolder">
                                Type New Position{" "}
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
                            </div>
                            <div>
                              <Form.Label className="fw-bolder">
                                status
                              </Form.Label>
                              <Select
                                className="text-primary w-100"
                                menuPortalTarget={document.body}
                                name={"status"}
                                value={props.values.status}
                                options={[
                                  { label: "Active", value: "1" },
                                  { label: "InActive", value: "0" },
                                ]}
                                onChange={(selectedOption) => {
                                  props.setFieldValue("status", selectedOption);
                                }}
                              />
                            </div>
                          </div>
                        </Form.Group>

                        <Form.Group as={Col} md={12}>
                          <div className="shadow p-2">
                            <Row className="g-0">
                              <Form.Group as={Col} md={6}>
                                <FieldArray name="phone">
                                  {({ remove, push }) => (
                                    <div className="table-scroll p-2">
                                      <Form.Label className="fw-bolder">
                                        Phone
                                      </Form.Label>
                                      {props?.values?.phone?.length > 0 && (
                                        <Table
                                          striped
                                          hover
                                          className="text-body bg-new Roles"
                                        >
                                          <thead>
                                            <tr>
                                              <th>
                                                Phone Number{" "}
                                                <span className="text-danger">
                                                  *
                                                </span>
                                              </th>
                                              <th>Primary</th>
                                              <th>Action</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {props?.values?.phone?.map(
                                              (itm, index) => {
                                                return (
                                                  <tr key={index}>
                                                    <td>
                                                      <Form.Control
                                                        type="number"
                                                        name={`phone.${index}.number`}
                                                        value={itm.number}
                                                        // placeholder="0"
                                                        onChange={(e) => {
                                                          if (
                                                            e.target.value
                                                              .length <= 10
                                                          ) {
                                                            props.handleChange(
                                                              e
                                                            );
                                                          }
                                                        }}
                                                      />
                                                      <ErrorMessage
                                                        name={`phone.${index}.number`}
                                                        component="small"
                                                        className="text-danger"
                                                      />
                                                    </td>
                                                    <td>
                                                      <label>
                                                        <Field
                                                          type="radio"
                                                          name={`phone.${index}.primary`}
                                                          className="form-check-input"
                                                          value="1"
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
                                                                if (
                                                                  i !== index
                                                                ) {
                                                                  props.setFieldValue(
                                                                    `phone.${i}.primary`,
                                                                    "0"
                                                                  );
                                                                }
                                                              }
                                                            );
                                                          }}
                                                        />
                                                        Is Default
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
                                                                primary: false,
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
                                    </div>
                                  )}
                                </FieldArray>
                              </Form.Group>
                              <Form.Group as={Col} md={6}>
                                <FieldArray name="email">
                                  {({ remove, push }) => (
                                    <div className="table-scroll p-2">
                                      <Form.Label className="fw-bolder">
                                        Email
                                      </Form.Label>
                                      {props?.values?.email?.length > 0 && (
                                        <Table
                                          striped
                                          hover
                                          className="text-body bg-new Roles"
                                        >
                                          <thead>
                                            <tr>
                                              <th>
                                                Email{" "}
                                                <span className="text-danger">
                                                  *
                                                </span>
                                              </th>
                                              <th>Primary</th>
                                              <th>Action</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {props?.values?.email?.map(
                                              (itm, index) => (
                                                <tr key={index}>
                                                  <td>
                                                    <Form.Control
                                                      name={`email.${index}.email`}
                                                      value={itm.email}
                                                      // placeholder="0"
                                                      onChange={
                                                        props.handleChange
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name={`email.${index}.email`}
                                                      component="small"
                                                      className="text-danger"
                                                    />
                                                  </td>
                                                  <td>
                                                    <label>
                                                      <Field
                                                        type="radio"
                                                        name={`email.${index}.primary`}
                                                        className="form-check-input"
                                                        value="1"
                                                        checked={
                                                          itm.primary === "1"
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
                                                      Is Default
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
                                                              primary: false,
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
                                    </div>
                                  )}
                                </FieldArray>
                              </Form.Group>
                            </Row>
                          </div>
                        </Form.Group>

                        <Form.Group as={Col} md={12}>
                          <div className="shadow p-3">
                            <Form.Label>notes</Form.Label>
                            <TextareaAutosize
                              className="edit-textarea"
                              minRows={3}
                              name="notes"
                              value={props.values.notes}
                              onChange={props.handleChange}
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
                                  />
                                  PLEASE WAIT...
                                </>
                              ) : (
                                <>{edit.id ? "UPDATE" : "CREATE"}</>
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
