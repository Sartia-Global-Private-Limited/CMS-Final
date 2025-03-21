import { FieldArray, Formik } from "formik";
import React from "react";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { CreateAllowances } from "../../../services/authapi";
import MyInput from "../../../components/MyInput";
import { FORMAT_OPTION_LABEL } from "../../../components/HelperStructure";

const Allowances = ({ allUserData, roles, checkPermission }) => {
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    // return console.log("values", values);
    const res = await CreateAllowances(values);
    if (res.status) {
      toast.success(res.message);
      resetForm();
    } else {
      toast.error(res.message);
    }
    setSubmitting(false);
  };

  return (
    <Col md={12}>
      <Formik
        enableReinitialize={true}
        initialValues={{
          allowance: [
            {
              name: "House Rent Allowance",
              applied_type: "",
              applied_on: [],
              value_type: "",
              value: "",
            },
            {
              name: "Medical Allowance",
              applied_type: "",
              applied_on: [],
              value_type: "",
              value: "",
            },
            {
              name: "Leave Travel Allowance",
              applied_type: "",
              applied_on: [],
              value_type: "",
              value: "",
            },
            {
              name: "Conveyance",
              applied_type: "",
              applied_on: [],
              value_type: "",
              value: "",
            },
            {
              name: "Dearness Allowance",
              applied_type: "",
              applied_on: [],
              value_type: "",
              value: "",
            },
            {
              name: "Children Education Allowance",
              applied_type: "",
              applied_on: [],
              value_type: "",
              value: "",
            },
            {
              name: "Pre-Requisites",
              applied_type: "",
              applied_on: [],
              value_type: "",
              value: "",
            },
            {
              name: "" || "Others",
              applied_type: "",
              applied_on: [],
              value_type: "",
              value: "",
            },
          ],
        }}
        onSubmit={handleSubmit}
      >
        {(props) => (
          <Form onSubmit={props?.handleSubmit}>
            <Row className="g-3">
              <FieldArray name="allowance">
                {() => (
                  <>
                    {props.values.allowance.length > 0 &&
                      props.values.allowance.map((allow, index) => (
                        <Form.Group as={Col} md={6} key={index}>
                          <div className="shadow p-3">
                            <p className="fw-bold">
                              {index == 7 ? "Others" : allow?.name}
                            </p>
                            <div className="d-align justify-content-start gap-4">
                              <Form.Check
                                type="radio"
                                name={`allowance.${index}.applied_type`}
                                id={`allowance.${index}.applied_type_employee`}
                                label="Employee-Wise"
                                checked={
                                  props.values.allowance[index].applied_type ===
                                  1
                                }
                                onChange={() => {
                                  props.setFieldValue(
                                    `allowance.${index}.applied_type`,
                                    1
                                  );
                                  props.setFieldValue(
                                    `allowance.${index}.applied_on`,
                                    []
                                  );
                                }}
                              />
                              <Form.Check
                                type="radio"
                                name={`allowance.${index}.applied_type`}
                                id={`allowance.${index}.applied_type_designation`}
                                label="Designation-Wise"
                                checked={
                                  props.values.allowance[index].applied_type ===
                                  2
                                }
                                onChange={() => {
                                  props.setFieldValue(
                                    `allowance.${index}.applied_type`,
                                    2
                                  );
                                  props.setFieldValue(
                                    `allowance.${index}.applied_on`,
                                    []
                                  );
                                }}
                              />
                            </div>
                            <Form.Group className="my-3" as={Col} md={12}>
                              {props.values.allowance[index].applied_type ===
                                1 && (
                                <>
                                  <MyInput
                                    name={`allowance.${index}.applied_on`}
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
                              {props.values.allowance[index].applied_type ===
                                2 && (
                                <>
                                  <MyInput
                                    name={`allowance.${index}.applied_on`}
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
                            <div className="d-align justify-content-start gap-4">
                              <div className="w-100 position-relative">
                                <MyInput
                                  name={`allowance.${index}.value_type`}
                                  formikProps={props}
                                  label={"Allowance Type:"}
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
                              <div>
                                <MyInput
                                  name={`allowance.${index}.value`}
                                  formikProps={props}
                                  label={"Value"}
                                  type="number"
                                  step="any"
                                />
                              </div>
                            </div>
                            {index == 7 && (
                              <Col md={12} className="mt-3">
                                <MyInput
                                  name={`allowance.${index}.name`}
                                  formikProps={props}
                                  label={"Allowance Name"}
                                />
                              </Col>
                            )}
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
  );
};

export default Allowances;
