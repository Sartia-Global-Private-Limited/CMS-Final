import React from "react";
import { Row, Col, Form, Spinner } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { CreateDeductions } from "../../../services/authapi";
import { FieldArray, Formik } from "formik";
import { toast } from "react-toastify";
import { FORMAT_OPTION_LABEL } from "../../../components/HelperStructure";
import MyInput from "../../../components/MyInput";

const Deductions = ({ allUserData, roles, checkPermission }) => {
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    // return console.log('values', values)
    const res = await CreateDeductions(values);
    if (res.status) {
      toast.success(res.message);
      resetForm();
    } else {
      toast.error(res.message);
    }
    setSubmitting(false);
  };

  return (
    <>
      <Helmet>
        <title>Payroll Master · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <Formik
          enableReinitialize={true}
          initialValues={{
            deduction: [
              {
                name: "Provident Fund",
                applied_type: "",
                applied_on: [],
                value_type: "",
                by_employee: "",
                by_employer: "",
              },
              {
                name: "Employees State Insurance Corporation",
                applied_type: "",
                applied_on: [],
                value_type: "",
                by_employee: "",
                by_employer: "",
              },
              {
                name: "Professional Tax",
                applied_type: "",
                applied_on: [],
                value_type: "",
                by_employee: "",
                by_employer: "",
              },
              {
                name: "Labor Welfare Fund",
                applied_type: "",
                applied_on: [],
                value_type: "",
                by_employee: "",
                by_employer: "",
              },
              {
                name: "National Pension Scheme",
                applied_type: "",
                applied_on: [],
                value_type: "",
                by_employee: "",
                by_employer: "",
              },
              {
                name: "Advance Salary Deductions",
                applied_type: "",
                applied_on: [],
                value_type: "",
                by_employee: "",
                by_employer: "",
              },
              {
                name: "" || "Others",
                applied_type: "",
                applied_on: [],
                value_type: "",
                by_employee: "",
                by_employer: "",
              },
            ],
          }}
          onSubmit={handleSubmit}
        >
          {(props) => (
            <Form onSubmit={props?.handleSubmit}>
              <Row className="g-3">
                <FieldArray name="deduction">
                  {() => (
                    <>
                      {props.values.deduction.length > 0 &&
                        props.values.deduction.map((allow, index) => (
                          <Form.Group as={Col} md={6} key={index}>
                            <div className="shadow p-3">
                              <p className="fw-bold">
                                {index == 6 ? "Others" : allow?.name}
                              </p>
                              <div className="d-align justify-content-start gap-4">
                                <Form.Check
                                  type="radio"
                                  name={`deduction.${index}.applied_type`}
                                  id={`deduction.${index}.applied_type_employee`}
                                  label="Employee-Wise"
                                  checked={
                                    props.values.deduction[index]
                                      .applied_type === 1
                                  }
                                  onChange={() => {
                                    props.setFieldValue(
                                      `deduction.${index}.applied_type`,
                                      1
                                    );
                                    props.setFieldValue(
                                      `deduction.${index}.applied_on`,
                                      []
                                    );
                                  }}
                                />
                                <Form.Check
                                  type="radio"
                                  name={`deduction.${index}.applied_type`}
                                  id={`deduction.${index}.applied_type_designation`}
                                  label="Designation-Wise"
                                  checked={
                                    props.values.deduction[index]
                                      .applied_type === 2
                                  }
                                  onChange={() => {
                                    props.setFieldValue(
                                      `deduction.${index}.applied_type`,
                                      2
                                    );
                                    props.setFieldValue(
                                      `deduction.${index}.applied_on`,
                                      []
                                    );
                                  }}
                                />
                              </div>
                              <Form.Group className="my-3" as={Col} md={12}>
                                {props.values.deduction[index].applied_type ===
                                  1 && (
                                  <>
                                    <MyInput
                                      name={`deduction.${index}.applied_on`}
                                      multiple
                                      formikProps={props}
                                      label={"Select Employee:"}
                                      customType={"select"}
                                      selectProps={{
                                        data: allUserData?.map((user) => ({
                                          label: user.name,
                                          value: user.id,
                                          employee_id: user.employee_id,
                                          image: user.image
                                            ? `${process.env.REACT_APP_API_URL}${user.image}`
                                            : null,
                                        })),
                                      }}
                                      formatOptionLabel={FORMAT_OPTION_LABEL}
                                    />
                                  </>
                                )}
                                {props.values.deduction[index].applied_type ===
                                  2 && (
                                  <>
                                    <MyInput
                                      name={`deduction.${index}.applied_on`}
                                      multiple
                                      formikProps={props}
                                      label={"Select Designation:"}
                                      customType={"select"}
                                      selectProps={{
                                        data: roles?.map((role) => ({
                                          label: role.name,
                                          value: role.id,
                                        })),
                                      }}
                                    />
                                  </>
                                )}
                              </Form.Group>
                              <div className="d-align mb-3 justify-content-start gap-4">
                                <div className="w-100 position-relative">
                                  <MyInput
                                    name={`deduction.${index}.value_type`}
                                    formikProps={props}
                                    label={"Deduction Type:"}
                                    customType={"select"}
                                    selectProps={{
                                      data: [
                                        { value: 1, label: "Fixed Amount" },
                                        {
                                          value: 2,
                                          label: "Percentage of Basic Salary",
                                        },
                                        {
                                          value: 3,
                                          label: "Percentage of Gross Salary",
                                        },
                                      ],
                                    }}
                                  />
                                </div>
                              </div>
                              <Row className="g-3">
                                <Col md={6}>
                                  <MyInput
                                    name={`deduction.${index}.by_employee`}
                                    formikProps={props}
                                    label={"By Employee"}
                                    type="number"
                                  />
                                </Col>
                                <Col md={6}>
                                  <MyInput
                                    name={`deduction.${index}.by_employer`}
                                    formikProps={props}
                                    label={"By Employer"}
                                    type="number"
                                  />
                                </Col>
                                {index == 6 && (
                                  <Col md={12}>
                                    <MyInput
                                      name={`deduction.${index}.name`}
                                      formikProps={props}
                                      label={"Deduction Name"}
                                    />
                                  </Col>
                                )}
                              </Row>
                            </div>
                          </Form.Group>
                        ))}
                    </>
                  )}
                </FieldArray>
                {checkPermission?.create && (
                  <Form.Group as={Col} md={12}>
                    <div className="text-center mt-4">
                      <button
                        type="submit"
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
                          <>SAVE</>
                        )}
                      </button>
                    </div>
                  </Form.Group>
                )}
              </Row>
            </Form>
          )}
        </Formik>
      </Col>
    </>
  );
};

export default Deductions;
