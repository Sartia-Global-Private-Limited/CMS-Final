import { FieldArray, Formik } from "formik";
import React, { Fragment, useEffect, useState } from "react";
import { Col, Form, FormText, Row, Spinner } from "react-bootstrap";
import { BsPlusLg, BsXLg } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import CardComponent from "../../../components/CardComponent";
import TooltipComponent from "../../../components/TooltipComponent";
import {
  addAdminMyCompanies,
  getAdminCompanyTypes,
  getAdminSingleMyCompanies,
  updateAdminMyCompanies,
} from "../../../services/authapi";
import { addMyCompanySchema } from "../../../utils/formSchema";
import { toast } from "react-toastify";
import ConfirmAlert from "../../../components/ConfirmAlert";
import Switch from "../../../components/Switch";
import { useTranslation } from "react-i18next";
import MyInput from "../../../components/MyInput";
import { GST_TREATMENT_TYPE } from "../../../data/StaticData";
import {
  getAllCitiesByStateId,
  getAllStates,
} from "../../../services/generalApi";
import { FormikSubmitButton } from "../../../components/FormikSubmitButton";

const AddMyCompany = () => {
  const [edit, setEdit] = useState({});
  const [types, setTypes] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [allState, setAllState] = useState([]);
  const [allCity, setAllCity] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const fetchCompaniesData = async () => {
    const module = "my_company";
    const res = await getAdminSingleMyCompanies(id, module);
    if (res.status) {
      setEdit(res.data);
      fetchCityData(res.data?.state);
    } else {
      setEdit([]);
    }
  };

  const fetchStateData = async () => {
    const res = await getAllStates();
    if (res.status) {
      setAllState(
        res?.data?.map((state) => {
          return { value: state.id, label: state.name };
        })
      );
    } else {
      setAllState([]);
    }
  };

  const fetchCityData = async (id) => {
    const res = await getAllCitiesByStateId(id);
    if (res.status) {
      setAllCity(
        res?.data?.map((state) => {
          return { value: state.id, label: state.name };
        })
      );
    } else {
      setAllCity([]);
    }
  };

  const fetchCompanyTypesData = async () => {
    const res = await getAdminCompanyTypes();
    if (res.status) {
      setTypes(res.data);
    } else {
      setTypes([]);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    values["my_company"] = 1;
    values["id"] = edit?.company_id;
    values["enable_company_type"] = +values.enable_company_type;

    if (edit?.company_id) {
      values["login_id"] = edit?.login_id;
    }

    if (values.enable_company_type == "0") {
      values["email"] = null;
      values["password"] = null;
    }

    // return console.log("values", values);
    const module = "my-company";
    const res = edit?.company_id
      ? await updateAdminMyCompanies(values)
      : await addAdminMyCompanies(values, module);
    if (res.status) {
      toast.success(res.message);
      navigate(-1);
      resetForm();
    } else {
      toast.error(res.message);
    }
    setSubmitting(false);
  };

  useEffect(() => {
    fetchCompanyTypesData();
    fetchStateData();
    if (id !== "new") {
      fetchCompaniesData();
    }
  }, []);

  return (
    <Col md={12} data-aos={"fade-up"}>
      <CardComponent title={`${edit.company_id ? "Update" : "Add"} My Company`}>
        <Formik
          enableReinitialize={true}
          initialValues={{
            company_name: edit.company_name || "",
            company_email: edit.company_email || "",
            company_contact: edit.company_contact || "",
            company_mobile: edit.company_mobile || "",
            company_address: edit.company_address || "",
            company_contact_person: edit.company_contact_person || "",
            primary_contact_number: edit.primary_contact_number || "",
            primary_contact_email: edit.primary_contact_email || "",
            designation: edit.designation || "",
            department: edit.department || "",
            company_website: edit.company_website || "",
            gst_treatment_type: edit.gst_treatment_type || "",
            business_legal_name: edit.business_legal_name || "",
            business_trade_name: edit.business_trade_name || "",
            pan_number: edit.pan_number || "",
            place_of_supply: edit.place_of_supply || "",
            enable_company_type: edit.is_company_login_enable || "0",
            email: edit.email ? edit.email : edit.primary_contact_email || "",
            password: "",
            state: edit.state || "",
            city: edit.city || "",
            pin_code: edit.pin_code || "",
            company_type: edit.company_type || "",
            gst_details: edit.gst_details || [
              {
                gst_number: "",
                shipping_address: "",
                billing_address: "",
                is_default: "1",
              },
            ],
          }}
          validationSchema={addMyCompanySchema}
          onSubmit={handleSubmit}
        >
          {(props) => (
            <Form onSubmit={props?.handleSubmit}>
              <Row className="g-3 align-items-center">
                <Form.Group as={Col} md={4}>
                  <MyInput
                    isRequired
                    name={"company_name"}
                    formikProps={props}
                    label={t("Company Name")}
                  />
                </Form.Group>
                <Form.Group as={Col} md={4}>
                  <MyInput
                    name={"company_email"}
                    formikProps={props}
                    label={t("Company Email")}
                    type="email"
                  />
                </Form.Group>
                <Form.Group as={Col} md={4}>
                  <MyInput
                    isRequired
                    name={"company_contact"}
                    formikProps={props}
                    label={t("Company Contact")}
                    customType={"phone"}
                  />
                </Form.Group>
                <Form.Group as={Col} md={4}>
                  <MyInput
                    isRequired
                    name={"company_mobile"}
                    formikProps={props}
                    label={t("Company Mobile")}
                    customType={"phone"}
                  />
                </Form.Group>
                <Form.Group as={Col} md={4}>
                  <MyInput
                    name={"company_website"}
                    formikProps={props}
                    label={t("Company Website")}
                    type="url"
                  />
                </Form.Group>
                <Form.Group as={Col} md={4}>
                  <MyInput
                    isRequired
                    name={"company_contact_person"}
                    formikProps={props}
                    label={t("Company Contact Person")}
                  />
                </Form.Group>
                <Form.Group as={Col} md={4}>
                  <MyInput
                    isRequired
                    name={"state"}
                    formikProps={props}
                    label={t("State")}
                    customType={"select"}
                    selectProps={{
                      data: allState,
                      onChange: (e) => {
                        fetchCityData(e?.value);
                      },
                    }}
                  />
                </Form.Group>
                <Form.Group as={Col} md={4}>
                  <MyInput
                    isRequired
                    name={"city"}
                    formikProps={props}
                    label={t("City")}
                    customType={"select"}
                    selectProps={{
                      data: allCity,
                    }}
                  />
                </Form.Group>
                <Form.Group as={Col} md={4}>
                  <MyInput
                    isRequired
                    name={"pin_code"}
                    formikProps={props}
                    label={t("Pin Code")}
                  />
                </Form.Group>
                <Form.Group as={Col} md={12}>
                  <MyInput
                    isRequired
                    name={"company_address"}
                    formikProps={props}
                    label={t("Company Address")}
                    customType={"multiline"}
                  />
                </Form.Group>

                <Form.Group as={Col} md={4}>
                  <MyInput
                    isRequired
                    name={"primary_contact_number"}
                    formikProps={props}
                    label={t("primary contact number")}
                    customType={"phone"}
                  />
                </Form.Group>

                <Form.Group as={Col} md={4}>
                  <MyInput
                    name={"primary_contact_email"}
                    formikProps={props}
                    label={t("primary contact email")}
                    type="email"
                    onChange={(e) => {
                      props.setFieldValue("email", e.target.value);
                      props.setFieldValue(
                        "primary_contact_email",
                        e.target.value
                      );
                    }}
                  />
                </Form.Group>
                <Form.Group as={Col} md={4}>
                  <MyInput
                    name={"designation"}
                    formikProps={props}
                    label={t("designation")}
                  />
                </Form.Group>
                <Form.Group as={Col} md={4}>
                  <MyInput
                    name={"department"}
                    formikProps={props}
                    label={t("department")}
                  />
                </Form.Group>
                <Form.Group as={Col} md={4}>
                  <MyInput
                    isRequired
                    name={"gst_treatment_type"}
                    formikProps={props}
                    label={t("GST Treatment Type")}
                    customType={"select"}
                    selectProps={{
                      data: GST_TREATMENT_TYPE,
                    }}
                  />
                </Form.Group>
                <Form.Group as={Col} md={4}>
                  <MyInput
                    isRequired
                    name={"business_legal_name"}
                    formikProps={props}
                    label={t("business legal name")}
                  />
                </Form.Group>
                <Form.Group as={Col} md={4}>
                  <MyInput
                    name={"business_trade_name"}
                    formikProps={props}
                    label={t("business trade name")}
                  />
                </Form.Group>
                <Form.Group as={Col} md={4}>
                  <MyInput
                    isRequired
                    name={"pan_number"}
                    formikProps={props}
                    label={t("pan number")}
                    maxLength={10}
                  />
                </Form.Group>
                <Form.Group as={Col} md={4}>
                  <MyInput
                    name={"place_of_supply"}
                    formikProps={props}
                    label={t("place of supply")}
                  />
                </Form.Group>

                <div className="hr-border2 mt-3" />
                <Form.Group as={Col} md={12}>
                  <Form.Label className="fw-bold pb-2">
                    {t("Enable Company Login")}{" "}
                    <Switch
                      name={"enable_company_type"}
                      checked={
                        props.values.enable_company_type == "1" ? true : false
                      }
                      onChange={(e) =>
                        props.setFieldValue(
                          "enable_company_type",
                          e.target.checked ? "1" : "0"
                        )
                      }
                    />
                  </Form.Label>
                  {props.values.enable_company_type == "1" && (
                    <div className="shadow p-3">
                      <Form.Group as={Row} className="mb-3">
                        <Form.Label column>{t("User Email")}</Form.Label>
                        <Col sm={8}>
                          <MyInput
                            isRequired
                            name={"email"}
                            formikProps={props}
                            type="email"
                          />
                        </Col>
                      </Form.Group>
                      <Form.Group as={Row} className="mb-3">
                        <Form.Label column>{t("Password")}</Form.Label>
                        <Col sm={8}>
                          <div className="d-grid gap-1">
                            <MyInput
                              name={"password"}
                              formikProps={props}
                              type="password"
                            />

                            {edit?.company_id ? (
                              <FormText>
                                Password is encrypted. If you don't want to
                                change it, leave it blank.
                              </FormText>
                            ) : null}
                          </div>
                        </Col>
                      </Form.Group>
                    </div>
                  )}
                </Form.Group>

                <FieldArray name="gst_details">
                  {({ remove, push }) => (
                    <>
                      {props.values.gst_details.length > 0 &&
                        props.values.gst_details.map((gst, index) => (
                          <Row key={index} className="align-items-center g-3">
                            <div className="hr-border2 mt-3" />
                            <Form.Group as={Col} md={12}>
                              <MyInput
                                isRequired
                                name={`gst_details.${index}.gst_number`}
                                formikProps={props}
                                label={t("gst number")}
                                maxLength={15}
                              />
                            </Form.Group>
                            <Form.Group as={Col} md={5}>
                              <MyInput
                                isRequired
                                name={`gst_details.${index}.billing_address`}
                                formikProps={props}
                                label={t("billings address")}
                                customType={"multiline"}
                              />
                            </Form.Group>

                            <Form.Group as={Col} md={1} className="text-center">
                              <Form.Check
                                type="checkbox"
                                onChange={(e) => {
                                  const updatedGstDetails = [
                                    ...props.values.gst_details,
                                  ];
                                  if (e.target.checked) {
                                    updatedGstDetails[index].shipping_address =
                                      updatedGstDetails[index].billing_address;
                                  } else {
                                    updatedGstDetails[index].shipping_address =
                                      "";
                                  }
                                  props.setFieldValue(
                                    "gst_details",
                                    updatedGstDetails
                                  );
                                }}
                                id={`same${index}`}
                                label={t("Same")}
                              />
                            </Form.Group>

                            <Form.Group as={Col} md={index === 0 ? null : "5"}>
                              <MyInput
                                name={`gst_details.${index}.shipping_address`}
                                formikProps={props}
                                label={t("shipping address")}
                                customType={"multiline"}
                              />
                            </Form.Group>
                            {index === 0 ? null : (
                              <Form.Group
                                as={Col}
                                md={1}
                                className="text-center mb-2 m-auto"
                              >
                                <TooltipComponent
                                  align="left"
                                  title={"Delete Row"}
                                >
                                  <BsXLg
                                    onClick={() => remove(index)}
                                    className="social-btn red-combo"
                                  />
                                </TooltipComponent>
                              </Form.Group>
                            )}

                            <Form.Group as={Col} md={6}>
                              <Form.Check
                                label={t("Mark Default")}
                                type="radio"
                                name={`gst_details.${index}.is_default`}
                                id={`gst_details.${index}.is_default`}
                                checked={+gst.is_default === 1}
                                onChange={(e) => {
                                  const updatedGstDetails = [
                                    ...props.values.gst_details,
                                  ];
                                  updatedGstDetails.forEach((item, idx) => {
                                    if (idx === index) {
                                      item.is_default = "1";
                                    } else {
                                      item.is_default = "0";
                                    }
                                  });
                                  props.setFieldValue(
                                    "gst_details",
                                    updatedGstDetails
                                  );
                                }}
                              />
                            </Form.Group>
                          </Row>
                        ))}
                      <Form.Group as={Col} md={3} className="ms-auto">
                        <div
                          onClick={() =>
                            push({
                              gst_number: "",
                              shipping_address: "",
                              billing_address: "",
                              is_default: "0",
                            })
                          }
                          className="shadow py-1 px-3 success-combo cursor-pointer d-align gap-1"
                        >
                          <BsPlusLg className="cursor-pointer" /> {t("Add")}
                        </div>
                      </Form.Group>
                    </>
                  )}
                </FieldArray>

                <div className="hr-border2 mt-3" />
                <Form.Group as={Col} md={12}>
                  <div className="my-4 text-truncate d-grid d-md-flex d-align gap-3">
                    {types?.map((companytyp, index) => (
                      <Fragment key={index}>
                        <Form.Check
                          inline
                          label={companytyp.company_type_name}
                          name="company_type"
                          type="radio"
                          checked={
                            +props.values.company_type ===
                            companytyp.company_type_id
                          }
                          id={companytyp.company_type_id}
                          value={companytyp.company_type_id}
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          isInvalid={Boolean(
                            props.touched.company_type &&
                              props.errors.company_type
                          )}
                        />
                        <Form.Control.Feedback type="invalid">
                          {props.errors.company_type}
                        </Form.Control.Feedback>
                      </Fragment>
                    ))}
                  </div>
                </Form.Group>
                <FormikSubmitButton id={edit?.company_id} props={props} />
              </Row>
            </Form>
          )}
        </Formik>
      </CardComponent>
    </Col>
  );
};

export default AddMyCompany;
