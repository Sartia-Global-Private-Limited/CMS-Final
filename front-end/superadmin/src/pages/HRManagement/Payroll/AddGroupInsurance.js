import React, { useEffect, useRef, useState } from "react";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import { Helmet } from "react-helmet";
import CardComponent from "../../../components/CardComponent";
import { Formik } from "formik";
import {
  CreateGroupInsurance,
  UpdateGroupInsurance,
  getAllRolesForDropDown,
  getAllDetailsGroupInsurance,
  getAllDetailsInsuranceCompanyPlans,
  getAllInsuranceCompany,
  getSingleDetailsGroupInsurance,
  getAdminAllHREmployees,
} from "../../../services/authapi";
import { toast } from "react-toastify";
import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmAlert from "../../../components/ConfirmAlert";
import { addGroupInsuranceSchema } from "../../../utils/formSchema";
import MyInput from "../../../components/MyInput";
import { FORMAT_OPTION_LABEL } from "../../../components/HelperStructure";

const AddGroupInsurance = () => {
  const { id } = useParams();
  const [insuranceCompany, setInsuranceCompany] = useState([]);
  const [detailsInsurance, setDetailsInsurance] = useState([]);
  const [detailsInsurancePlans, setDetailsInsurancePlans] = useState([]);
  const [allUserData, setAllUserData] = useState([]);
  const [edit, setEdit] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [roles, setRoles] = useState([]);
  const selectRef = useRef(null);
  const select2Refs = useRef(null);
  const navigate = useNavigate();

  const fetchRolesData = async () => {
    const res = await getAllRolesForDropDown();
    if (res.status) {
      setRoles(res.data);
    } else {
      setRoles([]);
    }
  };

  const fetchAllUsersData = async () => {
    const isDropdown = true;
    const res = await getAdminAllHREmployees({ isDropdown });
    if (res.status) {
      setAllUserData(res.data);
    } else {
      setAllUserData([]);
    }
  };
  const fetchSingleData = async () => {
    const res = await getSingleDetailsGroupInsurance(id);
    if (res.status) {
      fetchDetailsInsurancePlansData(res.data.insurance_plan_id);
      fetchDetailsInsuranceData(res.data.insurance_company_id);
      setEdit(res.data);
    } else {
      setEdit({});
    }
  };

  const fetchInsuranceCompanyData = async () => {
    const res = await getAllInsuranceCompany();
    if (res.status) {
      setInsuranceCompany(res.data);
    } else {
      setInsuranceCompany([]);
    }
  };
  const fetchDetailsInsuranceData = async (insurance_company_id) => {
    const res = await getAllDetailsGroupInsurance(insurance_company_id);
    if (res.status) {
      setDetailsInsurance(res.data);
    } else {
      setDetailsInsurance([]);
      toast.error(res.message);
    }
    if (selectRef.current) {
      selectRef.current.setValue([]);
      select2Refs.current.setValue([]);
    }
  };
  const fetchDetailsInsurancePlansData = async (insurance_plan_id) => {
    const res = await getAllDetailsInsuranceCompanyPlans(insurance_plan_id);
    if (res.status) {
      setDetailsInsurancePlans(res.data);
    } else {
      setDetailsInsurancePlans([]);
      toast.error(res.message);
    }
  };

  const handleInsurancePlansChange = async (e, setFieldValue) => {
    const Value = e.value;
    if (setFieldValue) {
      setFieldValue("insurance_plan_id", e);
    }
    if (!Value) return false;
    fetchDetailsInsurancePlansData(Value);
  };
  const handleInsuranceChange = async (e, setFieldValue) => {
    const Value = e.value;
    if (setFieldValue) {
      setFieldValue("insurance_company_id", e);
    }
    if (!Value) return false;
    setDetailsInsurancePlans([]);
    fetchDetailsInsuranceData(Value);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      insurance_for: values?.insurance_for == "Employee Wise" ? 1 : 2,
      insurance_applied_on: JSON.stringify(values.insurance_applied_on).replace(
        /[\[\]']+/g,
        ""
      ),
      insurance_deduction_amount: values.insurance_deduction_amount,
      insurance_company_id: values.insurance_company_id,
      insurance_plan_id: values.insurance_plan_id,
    };
    if (edit?.id) {
      sData["id"] = edit?.id;
    }

    const res = edit?.id
      ? await UpdateGroupInsurance(sData)
      : await CreateGroupInsurance(sData);
    if (res.status) {
      toast.success(res.message);
      navigate(-1);
      resetForm();
    } else {
      toast.error(res.message);
    }
    setSubmitting(false);
  };

  const singleoutletsList = [
    {
      id: 1,
      col: 12,
      title: "Insurance Company",
      value: detailsInsurancePlans?.company_name
        ? detailsInsurancePlans?.company_name
        : "",
    },
    {
      id: 11,
      col: 12,
      title: "Policy Name",
      value: detailsInsurancePlans?.policy_name
        ? detailsInsurancePlans?.policy_name
        : "",
    },
    {
      id: 3,
      col: 12,
      title: "Policy Type",
      value: detailsInsurancePlans?.policy_type
        ? detailsInsurancePlans?.policy_type
        : "",
    },
    {
      id: 4,
      col: 6,
      title: "Policy Start Date",
      value: detailsInsurancePlans?.policy_start_date
        ? moment(detailsInsurancePlans?.policy_start_date).format("YYYY-MM-DD")
        : "",
    },
    {
      id: 5,
      col: 6,
      title: "Policy End Date",
      value: detailsInsurancePlans?.policy_end_date
        ? moment(detailsInsurancePlans?.policy_end_date).format("YYYY-MM-DD")
        : "",
    },
    {
      id: 6,
      col: 6,
      title: "Policy Premium Amount",
      value: detailsInsurancePlans?.policy_premium_amount
        ? detailsInsurancePlans?.policy_premium_amount
        : "",
    },
    {
      id: 7,
      col: 6,
      title: "Policy Coverage Limits",
      value: detailsInsurancePlans?.policy_coverage_limits
        ? detailsInsurancePlans?.policy_coverage_limits
        : "",
    },
    {
      id: 8,
      col: 6,
      title: "Policy Covered Risks",
      value: detailsInsurancePlans?.policy_covered_risks
        ? detailsInsurancePlans?.policy_covered_risks
        : "",
    },
    {
      id: 9,
      col: 6,
      title: "Policy Deductible Amount",
      value: detailsInsurancePlans?.policy_deductible_amount
        ? detailsInsurancePlans?.policy_deductible_amount
        : "",
    },
    {
      id: 10,
      col: 6,
      title: "Policy Rrenewal Date",
      value: detailsInsurancePlans?.policy_renewal_date
        ? moment(detailsInsurancePlans?.policy_renewal_date).format(
            "YYYY-MM-DD"
          )
        : "",
    },
    {
      id: 11,
      col: 6,
      title: "Policy Tenure",
      value: detailsInsurancePlans?.policy_tenure
        ? detailsInsurancePlans?.policy_tenure
        : "",
    },
  ];

  useEffect((val) => {
    fetchRolesData();
    fetchInsuranceCompanyData();
    fetchAllUsersData();
    if (val) {
      fetchDetailsInsuranceData();
      fetchDetailsInsurancePlansData();
    }
    if (id) {
      fetchSingleData();
    }
  }, []);

  return (
    <Col md={12} data-aos={"fade-up"}>
      <Helmet>
        <title>Group Insurance · CMS Electricals</title>
      </Helmet>
      <CardComponent
        title={id ? "UPDATE Group Insurance" : "Add Group Insurance"}
      >
        <div className="d-flex align-items-center">
          <div className="flex-grow-1 d-grid gap-2">
            <Formik
              enableReinitialize={true}
              initialValues={{
                insurance_for: edit?.insurance_for || "Employee Wise",
                insurance_company_id: edit.insurance_company_id || "",
                insurance_deduction_amount:
                  edit.insurance_deduction_amount || "",
                insurance_plan_id: edit.insurance_plan_id || "",
                insurance_applied_on:
                  edit.insurance_applied_on?.map((itm) => itm.id) || "",
              }}
              validationSchema={addGroupInsuranceSchema}
              onSubmit={handleSubmit}
            >
              {(props) => (
                <Form onSubmit={props?.handleSubmit}>
                  <Row className="g-3">
                    <Col md={6}>
                      <Row className="g-3">
                        <Form.Group as={Col} md={12}>
                          <div className="d-align justify-content-start gap-4">
                            <Form.Check
                              type="radio"
                              name="insurance_for"
                              id="employee-wise"
                              label="Employee-Wise"
                              value={props.values.insurance_for}
                              checked={
                                edit?.id
                                  ? Boolean(
                                      props.values.insurance_for ==
                                        "Employee Wise"
                                    )
                                  : props.values.insurance_for ===
                                    "Employee Wise"
                              }
                              onChange={() => {
                                props.setFieldValue(
                                  "insurance_for",
                                  "Employee Wise"
                                );
                                props.setFieldValue(
                                  "insurance_applied_on",
                                  null
                                );
                              }}
                            />
                            <Form.Check
                              type="radio"
                              name="insurance_for"
                              id="designation-wise"
                              label="Designation-Wise"
                              value={props.values.insurance_for}
                              checked={Boolean(
                                props.values.insurance_for == "Designation Wise"
                              )}
                              onChange={() => {
                                props.setFieldValue(
                                  "insurance_for",
                                  "Designation Wise"
                                );
                                props.setFieldValue(
                                  "insurance_applied_on",
                                  null
                                );
                              }}
                            />

                            <div className="flex-shrink-0">
                              <img
                                src="https://i.ibb.co/mDqmLrF/insurance-icon-png-16.png"
                                width={100}
                                alt=""
                              />
                            </div>
                          </div>
                        </Form.Group>
                        <Form.Group as={Col} md={12}>
                          {props.values.insurance_for === "Employee Wise" && (
                            <MyInput
                              isRequired
                              multiple
                              name={"insurance_applied_on"}
                              formikProps={props}
                              label={"Select Users"}
                              customType={"select"}
                              selectProps={{
                                data: allUserData?.map((user) => ({
                                  label: user.name,
                                  value: user.id,
                                  image: user.image
                                    ? `${process.env.REACT_APP_API_URL}${user.image}`
                                    : null,
                                })),
                              }}
                              formatOptionLabel={FORMAT_OPTION_LABEL}
                            />
                          )}

                          {props.values.insurance_for ===
                            "Designation Wise" && (
                            <MyInput
                              isRequired
                              multiple
                              name={"insurance_applied_on"}
                              formikProps={props}
                              label={"Select Roles"}
                              customType={"select"}
                              selectProps={{
                                data: roles?.map((user) => ({
                                  label: user.name,
                                  value: user.id,
                                })),
                              }}
                            />
                          )}
                        </Form.Group>

                        <Form.Group as={Col} md={6}>
                          <MyInput
                            isRequired
                            name={"insurance_company_id"}
                            formikProps={props}
                            label={"Insurance Company"}
                            customType={"select"}
                            selectProps={{
                              data: insuranceCompany?.map((itm) => ({
                                label: itm.company_name,
                                value: itm.id,
                              })),
                              onChange: (e) => {
                                handleInsuranceChange(e, props.setFieldValue);
                              },
                            }}
                          />
                        </Form.Group>
                        <Form.Group as={Col} md={6}>
                          <MyInput
                            isRequired
                            name={"insurance_plan_id"}
                            formikProps={props}
                            label={"Select Plans"}
                            customType={"select"}
                            selectProps={{
                              data: detailsInsurance?.map((itm) => ({
                                label: itm.policy_name,
                                value: itm.plan_id,
                              })),
                              onChange: (e) => {
                                handleInsurancePlansChange(
                                  e,
                                  props.setFieldValue
                                );
                              },
                            }}
                          />
                        </Form.Group>
                        <Form.Group as={Col} md={12}>
                          <MyInput
                            isRequired
                            name={"insurance_deduction_amount"}
                            formikProps={props}
                            label={"insurance deduction amount"}
                            type={"number"}
                            ref={select2Refs}
                          />
                        </Form.Group>
                        <Form.Group as={Col} md={12}>
                          <div className="text-center">
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
                                  PLEASE WAIT...
                                </>
                              ) : (
                                <>{edit.id ? "UPDATE" : "SAVE"}</>
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
                      </Row>
                    </Col>
                    <Form.Group as={Col} md={6}>
                      <Row className="g-2">
                        {singleoutletsList?.map((plansData, id1) => {
                          return (
                            <Form.Group key={id1} as={Col} md={plansData.col}>
                              <MyInput
                                disabled
                                name={plansData.title}
                                value={plansData.value}
                                formikProps={props}
                                label={plansData.title}
                                ref={select2Refs}
                                className="fw-bolder"
                              />
                            </Form.Group>
                          );
                        })}
                      </Row>
                    </Form.Group>
                  </Row>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </CardComponent>
    </Col>
  );
};

export default AddGroupInsurance;
