import { useEffect, useState } from "react";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { Row, Col, Form, Card, Table } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { Formik } from "formik";
import { toast } from "react-toastify";
import Select from "react-select";
import {
  createResponseSurvey,
  getAdminSingleSurvey,
} from "../../services/authapi";
import { Helmet } from "react-helmet";
import CardComponent from "../../components/CardComponent";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";

const ViewAssignedSurvey = () => {
  const [responseData, setResponseData] = useState({});
  const location = useLocation();
  const stateData = location.state;
  const navigate = useNavigate();
  const { user } = useSelector(selectUser);

  useEffect(() => {
    const fetchSurveyById = async () => {
      const response = await getAdminSingleSurvey(stateData?.id);
      setResponseData(response.status ? response.data : {});
    };
    fetchSurveyById();
  }, [stateData?.id]);

  const questions = responseData?.questions || [];

  const initialValues = questions.reduce((acc, item, index) => {
    item.columns.forEach((column, colIndex) => {
      acc[`questions[${index}].columns[${colIndex}].value`] = "";
    });
    return acc;
  }, {});

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const surveyResponse = questions.map((item, index) => ({
      columns: item.columns.map((column, colIndex) => {
        const columnData = {
          selectType:
            column.selectType === "Heading" ? column.selectType : column.value,
          value:
            column.selectType === "Heading"
              ? column.value
              : values.questions?.[index]?.columns?.[colIndex]?.value || "",
        };
        return columnData;
      }),
    }));

    const sData = {
      survey_id: responseData?.survey_id,
      response: surveyResponse,
    };

    const res = await createResponseSurvey(sData);
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
        <title>Survey · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent
          title={
            stateData?.status === "rejected"
              ? "View Response"
              : "Create Response"
          }
          showBackButton
        >
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props.handleSubmit}>
                <Row className="g-2">
                  <div className="table-scroll p-3 my-3">
                    <Table striped hover className="text-body Roles">
                      <thead>
                        {questions.length > 0 ? (
                          questions.map((item, index) => (
                            <tr key={index}>
                              {item.columns.map((column, colIndex) => (
                                <td
                                  key={`${index}-${colIndex}`}
                                  style={{ minWidth: "220px" }}
                                >
                                  <Form.Group>
                                    {column.selectType === "Heading" ? (
                                      <Form.Label>{column.value}</Form.Label>
                                    ) : column.value === "Select" ? (
                                      <Select
                                        menuPortalTarget={document.body}
                                        name={`questions[${index}].columns[${colIndex}].value`}
                                        options={column.options.map((opt) => ({
                                          label: opt,
                                          value: opt,
                                        }))}
                                        isClearable
                                        value={
                                          column.options.find(
                                            (option) =>
                                              option ===
                                              props.values.questions?.[index]
                                                ?.columns?.[colIndex]?.value
                                          )
                                            ? {
                                                label:
                                                  props.values.questions?.[
                                                    index
                                                  ]?.columns?.[colIndex]?.value,
                                                value:
                                                  props.values.questions?.[
                                                    index
                                                  ]?.columns?.[colIndex]?.value,
                                              }
                                            : null
                                        }
                                        onChange={(selectedOption) =>
                                          props.setFieldValue(
                                            `questions[${index}].columns[${colIndex}].value`,
                                            selectedOption?.value || ""
                                          )
                                        }
                                        onBlur={props.handleBlur}
                                      />
                                    ) : column.value === "multiSelect" ? (
                                      <Select
                                        isMulti
                                        menuPortalTarget={document.body}
                                        name={`questions[${index}].columns[${colIndex}].value`}
                                        options={column.options.map((opt) => ({
                                          label: opt,
                                          value: opt,
                                        }))}
                                        isClearable
                                        value={
                                          props.values.questions?.[
                                            index
                                          ]?.columns?.[colIndex]?.value?.map(
                                            (val) => ({
                                              label: val,
                                              value: val,
                                            })
                                          ) || []
                                        }
                                        onChange={(selectedOptions) => {
                                          const selectedValues = selectedOptions
                                            ? selectedOptions.map(
                                                (option) => option.value
                                              )
                                            : [];
                                          props.setFieldValue(
                                            `questions[${index}].columns[${colIndex}].value`,
                                            selectedValues
                                          );
                                        }}
                                        onBlur={props.handleBlur}
                                      />
                                    ) : column.value === "radio" ? (
                                      <Form.Group>
                                        {column.options.map(
                                          (option, optIndex) => (
                                            <Form.Check
                                              key={optIndex}
                                              type="radio"
                                              label={option}
                                              name={`questions[${index}].columns[${colIndex}].value`}
                                              value={option}
                                              checked={
                                                props.values.questions?.[index]
                                                  ?.columns?.[colIndex]
                                                  ?.value === option
                                              }
                                              onChange={() => {
                                                props.setFieldValue(
                                                  `questions[${index}].columns[${colIndex}].value`,
                                                  option
                                                );
                                              }}
                                              onBlur={props.handleBlur}
                                            />
                                          )
                                        )}
                                      </Form.Group>
                                    ) : column.value === "checkbox" ? (
                                      <Form.Group>
                                        {column.options.map(
                                          (option, optIndex) => (
                                            <Form.Check
                                              key={optIndex}
                                              type="checkbox"
                                              label={option}
                                              name={`questions[${index}].columns[${colIndex}].value`}
                                              value={option}
                                              checked={props.values.questions?.[
                                                index
                                              ]?.columns?.[
                                                colIndex
                                              ]?.value?.includes(option)}
                                              onChange={(e) => {
                                                const isChecked =
                                                  e.target.checked;
                                                const currentValues =
                                                  props.values.questions?.[
                                                    index
                                                  ]?.columns?.[colIndex]
                                                    ?.value || [];

                                                if (isChecked) {
                                                  // Add the checked value to the array
                                                  props.setFieldValue(
                                                    `questions[${index}].columns[${colIndex}].value`,
                                                    [...currentValues, option]
                                                  );
                                                } else {
                                                  // Remove the unchecked value from the array
                                                  props.setFieldValue(
                                                    `questions[${index}].columns[${colIndex}].value`,
                                                    currentValues.filter(
                                                      (val) => val !== option
                                                    )
                                                  );
                                                }
                                              }}
                                              onBlur={props.handleBlur}
                                            />
                                          )
                                        )}
                                      </Form.Group>
                                    ) : column.value === "url" ? (
                                      <Form.Control
                                        type="url"
                                        name={`questions[${index}].columns[${colIndex}].value`}
                                        placeholder="https://example.com"
                                        value={
                                          props.values.questions?.[index]
                                            ?.columns?.[colIndex]?.value || ""
                                        }
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        isInvalid={
                                          props.touched.questions?.[index]
                                            ?.columns?.[colIndex]?.value &&
                                          !!props.errors.questions?.[index]
                                            ?.columns?.[colIndex]?.value
                                        }
                                      />
                                    ) : (
                                      // {/* <Form.Control.Feedback type="invalid">
                                      //   {
                                      //     props.errors.questions?.[index]
                                      //       ?.columns?.[colIndex]?.value
                                      //   }
                                      // </Form.Control.Feedback> */}

                                      <Form.Control
                                        name={`questions[${index}].columns[${colIndex}].value`}
                                        type={
                                          column.value !== "textarea"
                                            ? column.value
                                            : "text"
                                        }
                                        as={
                                          column.value === "textarea"
                                            ? column.value
                                            : undefined
                                        }
                                        disabled={
                                          stateData?.status === "rejected"
                                        }
                                        value={
                                          props.values.questions?.[index]
                                            ?.columns?.[colIndex]?.value || ""
                                        }
                                        // onChange={props.handleChange}
                                        onChange={(e) => {
                                          const { value } = e.target;
                                          if (column.value === "number") {
                                            // Restrict input to numeric values and max length of 10 digits
                                            const numericValue = value.replace(
                                              /\D/g,
                                              ""
                                            ); // Removes non-digit characters
                                            if (numericValue.length <= 10) {
                                              props.setFieldValue(
                                                `questions[${index}].columns[${colIndex}].value`,
                                                numericValue
                                              );
                                            }
                                          } else {
                                            props.handleChange(e); // Handle non-number fields normally
                                          }
                                        }}
                                        onBlur={props.handleBlur}
                                        maxLength={
                                          column.value === "number"
                                            ? 10
                                            : undefined
                                        }
                                      />
                                    )}
                                  </Form.Group>
                                </td>
                              ))}
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="100%">No data available</td>
                          </tr>
                        )}
                      </thead>
                    </Table>
                  </div>
                  <Col className="d-flex justify-content-center">
                    {stateData?.status !== "rejected" && (
                      <button
                        type="submit"
                        className="shadow border-0 mx-3 mt-3 purple-combo cursor-pointer px-4 py-1"
                      >
                        Submit
                      </button>
                    )}
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
        </CardComponent>
      </Col>
    </>
  );
};

export default ViewAssignedSurvey;
