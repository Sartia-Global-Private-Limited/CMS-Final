import React, { useState } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import { Button, Table, Form as BootstrapForm, Card } from "react-bootstrap";

const SurveyForm = () => {
  const [previewMode, setPreviewMode] = useState(false); // To toggle preview mode

  // Supported question types
  const questionTypes = [
    { label: "Text", value: "text" },
    { label: "Multiple Choice", value: "radio" },
    { label: "Checkbox", value: "checkbox" },
    { label: "Dropdown", value: "select" },
  ];

  // Initial form values
  const initialValues = {
    questions: [
      {
        label: "Enter your question here",
        type: "text",
        options: [""], // Options for multiple choice, checkbox, or dropdown
        required: false,
      },
    ],
  };

  // Form submission
  const handleSubmit = (values) => {
    console.log("Survey Data:", values);
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {({ values }) => (
        <Form>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4>Survey Form Builder</h4>
            <Button
              variant={previewMode ? "secondary" : "primary"}
              onClick={() => setPreviewMode(!previewMode)}
            >
              {previewMode ? "Edit Mode" : "Preview Mode"}
            </Button>
          </div>

          {!previewMode ? (
            // Form Builder Mode
            <FieldArray name="questions">
              {({ push, remove }) => (
                <>
                  {values.questions.map((question, index) => (
                    <Card className="mb-3" key={index}>
                      <Card.Body>
                        <div className="d-flex justify-content-between">
                          <h5>Question {index + 1}</h5>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => remove(index)}
                          >
                            Delete
                          </Button>
                        </div>

                        <BootstrapForm.Group className="mb-3">
                          <BootstrapForm.Label>
                            Question Label
                          </BootstrapForm.Label>
                          <Field
                            name={`questions.${index}.label`}
                            className="form-control"
                            placeholder="Enter question"
                          />
                        </BootstrapForm.Group>

                        <BootstrapForm.Group className="mb-3">
                          <BootstrapForm.Label>
                            Question Type
                          </BootstrapForm.Label>
                          <Field
                            as="select"
                            name={`questions.${index}.type`}
                            className="form-control"
                          >
                            {questionTypes.map((type) => (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            ))}
                          </Field>
                        </BootstrapForm.Group>

                        {(question.type === "radio" ||
                          question.type === "checkbox" ||
                          question.type === "select") && (
                          <FieldArray name={`questions.${index}.options`}>
                            {({ push: addOption, remove: removeOption }) => (
                              <>
                                <h6>Options</h6>
                                {question.options.map((option, optionIndex) => (
                                  <div
                                    className="d-flex align-items-center mb-2"
                                    key={optionIndex}
                                  >
                                    <Field
                                      name={`questions.${index}.options.${optionIndex}`}
                                      className="form-control me-2"
                                      placeholder={`Option ${optionIndex + 1}`}
                                    />
                                    <Button
                                      variant="danger"
                                      size="sm"
                                      onClick={() => removeOption(optionIndex)}
                                    >
                                      Delete
                                    </Button>
                                  </div>
                                ))}
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => addOption("")}
                                >
                                  Add Option
                                </Button>
                              </>
                            )}
                          </FieldArray>
                        )}

                        <BootstrapForm.Group className="mb-3">
                          <BootstrapForm.Check
                            type="checkbox"
                            label="Required"
                            name={`questions.${index}.required`}
                          />
                        </BootstrapForm.Group>
                      </Card.Body>
                    </Card>
                  ))}

                  <Button
                    variant="primary"
                    onClick={() =>
                      push({
                        label: "Enter your question here",
                        type: "text",
                        options: [""],
                        required: false,
                      })
                    }
                  >
                    Add Question
                  </Button>
                </>
              )}
            </FieldArray>
          ) : (
            // Preview Mode
            <div>
              <h5>Survey Preview</h5>
              {values.questions.map((question, index) => (
                <Card className="mb-3" key={index}>
                  <Card.Body>
                    <h6>
                      {question.label}
                      {question.required && (
                        <span className="text-danger"> *</span>
                      )}
                    </h6>
                    {question.type === "text" && (
                      <Field
                        name={`preview.${index}`}
                        type="text"
                        className="form-control"
                        placeholder="Enter your answer"
                        disabled
                      />
                    )}

                    {question.type === "radio" &&
                      question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="form-check">
                          <Field
                            type="radio"
                            name={`preview.${index}`}
                            value={option}
                            className="form-check-input"
                            disabled
                          />
                          <label className="form-check-label">{option}</label>
                        </div>
                      ))}

                    {question.type === "checkbox" &&
                      question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="form-check">
                          <Field
                            type="checkbox"
                            name={`preview.${index}`}
                            value={option}
                            className="form-check-input"
                            disabled
                          />
                          <label className="form-check-label">{option}</label>
                        </div>
                      ))}

                    {question.type === "select" && (
                      <Field
                        as="select"
                        name={`preview.${index}`}
                        className="form-control"
                        disabled
                      >
                        <option value="">Select an option</option>
                        {question.options.map((option, optionIndex) => (
                          <option key={optionIndex} value={option}>
                            {option}
                          </option>
                        ))}
                      </Field>
                    )}
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}

          {/* Submit Button */}
          {!previewMode && (
            <div className="mt-3">
              <Button type="submit" variant="success">
                Save Survey
              </Button>
            </div>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default SurveyForm;
