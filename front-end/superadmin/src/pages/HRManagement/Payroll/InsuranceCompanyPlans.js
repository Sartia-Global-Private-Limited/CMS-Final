import React, { Fragment, useEffect, useState } from "react";
import "react-best-tabs/dist/index.css";
import { Col, Form, Row, Table } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { BsPlus } from "react-icons/bs";
import CardComponent from "../../../components/CardComponent";
import Modaljs from "../../../components/Modal";
import ActionButton from "../../../components/ActionButton";
import {
  getAllInsuranceCompanyPlans,
  CreateInsuranceCompanyPlans,
  DeleteInsuranceCompanyPlans,
  UpdateInsuranceCompanyPlans,
  getAllInsuranceCompany,
} from "../../../services/authapi";
import { toast } from "react-toastify";
import { Formik } from "formik";
import Select from "react-select";
import { addInsuranceCompanyPlansSchema } from "../../../utils/formSchema";
import ConfirmAlert from "../../../components/ConfirmAlert";
import moment from "moment";

const InsuranceCompanyPlans = () => {
  const [insuranceCompanyData, setInsuranceCompanyData] = useState(false);
  const [insuranceCompany, setInsuranceCompany] = useState([]);
  const [insuranceCompanyPlans, setInsuranceCompanyPlans] = useState([]);
  const [edit, setEdit] = useState({});
  const [idToDelete, setIdToDelete] = useState("");
  const [singlePlans, setSinglePlans] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const fetchInsuranceCompanyPlansData = async () => {
    const res = await getAllInsuranceCompanyPlans();
    if (res.status) {
      setInsuranceCompany(res.data);
    } else {
      setInsuranceCompany([]);
    }
  };

  const fetchAllInsuranceCompanyData = async () => {
    const res = await getAllInsuranceCompany();
    if (res.status) {
      setInsuranceCompanyPlans(res.data);
    } else {
      setInsuranceCompanyPlans([]);
    }
  };

  const handleEdit = async (plans) => {
    setEdit(plans);
    setInsuranceCompanyData(true);
  };
  const handleView = async (plans) => {
    setEdit(plans);
    setSinglePlans(true);
  };
  // console.log('edit.plan_id', edit.plan_id)

  const handleDelete = async () => {
    const res = await DeleteInsuranceCompanyPlans(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setInsuranceCompany((prev) =>
        prev.filter((itm) => itm.plan_id !== +idToDelete)
      );
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
  };

  const singleoutletsList = [
    { id: 1, title: "Insurance Company", value: edit?.company_name },
    { id: 11, title: "Policy Name", value: edit?.policy_name },
    { id: 3, title: "Policy Type", value: edit?.policy_type },
    {
      id: 4,
      title: "Policy Start Date",
      value: edit?.policy_start_date
        ? moment(edit?.policy_start_date).format("YYYY-MM-DD")
        : "",
    },
    {
      id: 5,
      title: "Policy End Date",
      value: edit?.policy_end_date
        ? moment(edit?.policy_end_date).format("YYYY-MM-DD")
        : "",
    },
    {
      id: 6,
      title: "Policy Premium Amount",
      value: edit?.policy_premium_amount,
    },
    {
      id: 7,
      title: "Policy Coverage Limits",
      value: edit?.policy_coverage_limits,
    },
    { id: 8, title: "Policy Covered Risks", value: edit?.policy_covered_risks },
    {
      id: 9,
      title: "Policy Deductible Amount",
      value: edit?.policy_deductible_amount,
    },
    {
      id: 10,
      title: "Policy Rrenewal Date",
      value: edit?.policy_renewal_date
        ? moment(edit?.policy_renewal_date).format("YYYY-MM-DD")
        : "",
    },
    { id: 11, title: "Policy Tenure", value: edit?.policy_tenure },
  ];

  useEffect(() => {
    fetchInsuranceCompanyPlansData();
    fetchAllInsuranceCompanyData();
  }, []);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    // return console.log('values', values)
    const sData = {
      insurance_company_id: values.insurance_company_id.value,
      policy_name: values.policy_name,
      policy_type: values.policy_type,
      policy_start_date: values.policy_start_date,
      policy_end_date: values.policy_end_date,
      policy_premium_amount: values.policy_premium_amount,
      policy_coverage_limits: values.policy_coverage_limits,
      policy_covered_risks: values.policy_covered_risks,
      policy_deductible_amount: values.policy_deductible_amount,
      policy_renewal_date: values.policy_renewal_date,
      policy_tenure: values.policy_tenure,
    };

    if (edit.plan_id) {
      sData["id"] = edit.plan_id;
    }
    // return console.log('sData', sData)
    const res = edit.plan_id
      ? await UpdateInsuranceCompanyPlans(sData)
      : await CreateInsuranceCompanyPlans(sData);
    if (res.status) {
      fetchInsuranceCompanyPlansData();
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    resetForm();
    setSubmitting(false);
    setInsuranceCompanyData(false);
  };

  return (
    <>
      <Helmet>
        <title>All Insurance Company Plans · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent
          title={"All Insurance Company Plans"}
          icon={<BsPlus />}
          onclick={() => {
            setEdit({});
            setInsuranceCompanyData(true);
          }}
          tag={"Create"}
        >
          <div className="overflow-auto p-2">
            <Table className="text-body bg-new Roles">
              <thead className="text-truncate">
                <tr>
                  {[
                    "Sr No.",
                    "Policy Name",
                    "Policy Type",
                    "Policy Tenure",
                    "Policy Start Date",
                    "Policy End Date",
                    "Action",
                  ].map((thead) => (
                    <th key={thead}>{thead}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {insuranceCompany?.length > 0 ? null : (
                  <tr>
                    <td colSpan={7}>
                      <img
                        className="p-3"
                        alt="no-result"
                        width="250"
                        src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                      />
                    </td>
                  </tr>
                )}
                {insuranceCompany?.map((plans, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{plans?.policy_name}</td>
                    <td>{plans?.policy_type}</td>
                    <td>{plans?.policy_tenure}</td>
                    <td>
                      {moment(plans.policy_start_date).format("DD-MM-YYYY")}
                    </td>
                    <td>
                      {moment(plans.policy_end_date).format("DD-MM-YYYY")}
                    </td>
                    <td>
                      <ActionButton
                        deleteOnclick={() => {
                          setIdToDelete(plans.plan_id);
                          setShowAlert(true);
                        }}
                        eyeOnclick={() => handleView(plans)}
                        editOnclick={() => handleEdit(plans)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </CardComponent>
      </Col>

      <Formik
        enableReinitialize={true}
        initialValues={{
          id: edit?.plan_id || "",
          insurance_company_id: edit.insurance_company_id
            ? { label: edit.company_name, value: edit.insurance_company_id }
            : {},
          policy_name: edit?.policy_name || "",
          policy_type: edit?.policy_type || "",
          policy_start_date: edit?.policy_start_date
            ? moment(edit?.policy_start_date).format("YYYY-MM-DD")
            : "",
          policy_end_date: edit?.policy_end_date
            ? moment(edit?.policy_end_date).format("YYYY-MM-DD")
            : "",
          policy_premium_amount: edit?.policy_premium_amount || "",
          policy_coverage_limits: edit?.policy_coverage_limits || "",
          policy_covered_risks: edit?.policy_covered_risks || "",
          policy_deductible_amount: edit?.policy_deductible_amount || "",
          policy_renewal_date: edit?.policy_renewal_date
            ? moment(edit?.policy_renewal_date).format("YYYY-MM-DD")
            : "",
          policy_tenure: edit?.policy_tenure || "",
        }}
        validationSchema={addInsuranceCompanyPlansSchema}
        onSubmit={handleSubmit}
      >
        {(props) => (
          <Modaljs
            formikProps={props}
            open={insuranceCompanyData}
            size={"md"}
            closebtn={"Cancel"}
            Savebtn={edit.plan_id ? "Update" : "Save"}
            close={() => setInsuranceCompanyData(false)}
            title={
              edit.plan_id
                ? "Update Insurance Company"
                : "Create Insurance Company"
            }
          >
            <Row className="g-2">
              <Form.Group as={Col} md={12}>
                <Form.Label>Select Insurance Company</Form.Label>
                <Select
                  menuPosition="fixed"
                  name={"insurance_company_id"}
                  options={insuranceCompanyPlans?.map((plan) => ({
                    value: plan.id,
                    label: plan.company_name,
                  }))}
                  value={props.values.insurance_company_id}
                  onChange={(selectedOption) => {
                    props.setFieldValue("insurance_company_id", selectedOption);
                  }}
                />
              </Form.Group>
              <Form.Group as={Col} md={6}>
                <Form.Label>Policy Name</Form.Label>
                <Form.Control
                  type="text"
                  name={"policy_name"}
                  value={props.values.policy_name}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(
                    props.touched.policy_name && props.errors.policy_name
                  )}
                />
                <Form.Control.Feedback type="invalid">
                  {props.errors.policy_name}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md={6}>
                <Form.Label>Policy Type</Form.Label>
                <Form.Control
                  type="text"
                  name={"policy_type"}
                  value={props.values.policy_type}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(
                    props.touched.policy_type && props.errors.policy_type
                  )}
                />
                <Form.Control.Feedback type="invalid">
                  {props.errors.policy_type}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md={6}>
                <Form.Label>Policy Start Date</Form.Label>
                <Form.Control
                  type="date"
                  name={"policy_start_date"}
                  value={props.values.policy_start_date}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(
                    props.touched.policy_start_date &&
                      props.errors.policy_start_date
                  )}
                />
                <Form.Control.Feedback type="invalid">
                  {props.errors.policy_start_date}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md={6}>
                <Form.Label>Policy End Date</Form.Label>
                <Form.Control
                  type="date"
                  name={"policy_end_date"}
                  value={props.values.policy_end_date}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(
                    props.touched.policy_end_date &&
                      props.errors.policy_end_date
                  )}
                />
                <Form.Control.Feedback type="invalid">
                  {props.errors.policy_end_date}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md={6}>
                <Form.Label>Policy Premium Amount</Form.Label>
                <Form.Control
                  type="number"
                  step="any"
                  name={"policy_premium_amount"}
                  value={props.values.policy_premium_amount}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(
                    props.touched.policy_premium_amount &&
                      props.errors.policy_premium_amount
                  )}
                />
                <Form.Control.Feedback type="invalid">
                  {props.errors.policy_premium_amount}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md={6}>
                <Form.Label>Policy Coverage Limits</Form.Label>
                <Form.Control
                  type="number"
                  step="any"
                  name={"policy_coverage_limits"}
                  value={props.values.policy_coverage_limits}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(
                    props.touched.policy_coverage_limits &&
                      props.errors.policy_coverage_limits
                  )}
                />
                <Form.Control.Feedback type="invalid">
                  {props.errors.policy_coverage_limits}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md={6}>
                <Form.Label>Policy Covered Risks</Form.Label>
                <Form.Control
                  type="number"
                  step="any"
                  name={"policy_covered_risks"}
                  value={props.values.policy_covered_risks}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(
                    props.touched.policy_covered_risks &&
                      props.errors.policy_covered_risks
                  )}
                />
                <Form.Control.Feedback type="invalid">
                  {props.errors.policy_covered_risks}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md={6}>
                <Form.Label>Policy Deductible Amount</Form.Label>
                <Form.Control
                  type="text"
                  name={"policy_deductible_amount"}
                  value={props.values.policy_deductible_amount}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(
                    props.touched.policy_deductible_amount &&
                      props.errors.policy_deductible_amount
                  )}
                />
                <Form.Control.Feedback type="invalid">
                  {props.errors.policy_deductible_amount}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md={6}>
                <Form.Label>Policy Rrenewal Date</Form.Label>
                <Form.Control
                  type="date"
                  name={"policy_renewal_date"}
                  value={props.values.policy_renewal_date}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(
                    props.touched.policy_renewal_date &&
                      props.errors.policy_renewal_date
                  )}
                />
                <Form.Control.Feedback type="invalid">
                  {props.errors.policy_renewal_date}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md={6}>
                <Form.Label>Policy Tenure</Form.Label>
                <Form.Control
                  type="text"
                  name={"policy_tenure"}
                  value={props.values.policy_tenure}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(
                    props.touched.policy_tenure && props.errors.policy_tenure
                  )}
                />
                <Form.Control.Feedback type="invalid">
                  {props.errors.policy_tenure}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
          </Modaljs>
        )}
      </Formik>

      <Modaljs
        open={singlePlans}
        size={"md"}
        closebtn={"Cancel"}
        Savebtn={"Ok"}
        close={() => setSinglePlans(false)}
        title={"View Insurance Company Plans"}
      >
        <Row className="g-2 align-items-center">
          {singleoutletsList.map((plansData, id1) => (
            <Fragment key={id1}>
              <Col md={4}>{plansData.title}</Col>
              <Col md={8}>
                <Form.Control
                  type={"text"}
                  className="fw-bolder"
                  size="100"
                  src={plansData.src}
                  value={plansData.value}
                  disabled
                />
              </Col>
            </Fragment>
          ))}
        </Row>
      </Modaljs>

      <ConfirmAlert
        size={"sm"}
        deleteFunction={handleDelete}
        hide={setShowAlert}
        show={showAlert}
        title={"Confirm Delete"}
        description={"Are you sure you want to delete this!!"}
      />
    </>
  );
};

export default InsuranceCompanyPlans;
