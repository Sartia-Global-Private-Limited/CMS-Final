import React from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import Select from "react-select";
import { Field, FieldArray, Formik } from "formik";

const CreateHeadingResponseModal = ({
  openModal,
  setOpenModal,
  onSubmit,
  initialData,
}) => {
  const handleSubmitSurveyType = (values) => {
    const body = {
      selectType: values?.selectType?.value,
      value:
        values?.selectType?.value === "Heading"
          ? values.heading
          : values?.responseType?.value,
      options: values?.selectType?.value === "Heading" ? [] : values.options,
    };

    onSubmit(body);
  };

  const selectTypeOptions = [
    { value: "Heading", label: "Heading" },
    { value: "Response", label: "Response" },
  ];

  const responseTypeOptions = [
    { value: "ShortTextArea", label: "Short Text Area" },
    { value: "textarea", label: "Long Text Area" },
    { value: "Select", label: "Select" },
    { value: "multiSelect", label: "Multi-Select" },
    { value: "Text", label: "Text" },
    { value: "Email", label: "Email" },
    { value: "Date", label: "Date" },
    { value: "time", label: "Time" },
    { value: "File", label: "File" },
    { value: "url", label: "External Link" },
    { value: "number", label: "Phone Number" },
    { value: "checkbox", label: "Check-box" },
    { value: "radio", label: "Radio" },
  ];

  return (
    <Modal
      show={openModal}
      onHide={() => setOpenModal(false)}
      centered
      backdrop="static"
      className="my-modal modal-area"
    >
      <Modal.Header
        closeButton
        className="table-bg border-4 border-orange border-bottom py-2 m-3"
      >
        <strong>Create</strong>
      </Modal.Header>
      <Modal.Body className="pt-0">
        <Formik
          initialValues={{
            selectType: initialData.selectType
              ? { value: initialData.selectType, label: initialData.selectType }
              : { value: "Heading", label: "Heading" },
            heading:
              initialData.selectType === "Heading" ? initialData.value : "",
            responseType:
              initialData.selectType !== "Heading"
                ? { value: initialData.value, label: initialData.value }
                : null,
            options:
              initialData.options?.length > 0 ? initialData?.options : [""],
          }}
          onSubmit={handleSubmitSurveyType}
        >
          {(props) => {
            const handleSelectTypeChange = (selectedOption) => {
              props.setFieldValue("selectType", selectedOption);
              if (selectedOption.value === "Heading") {
                props.setFieldValue("heading", initialData.value || "");
                props.setFieldValue("responseType", null);
              } else {
                props.setFieldValue(
                  "responseType",
                  initialData.value
                    ? { value: initialData.value, label: initialData.value }
                    : null
                );
                props.setFieldValue("heading", "");
              }
            };

            return (
              <form style={{ marginTop: 20 }} onSubmit={props.handleSubmit}>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label>Select</Form.Label>
                  <Select
                    className="w-100 text-primary"
                    name="selectType"
                    value={props.values.selectType}
                    options={selectTypeOptions}
                    onChange={handleSelectTypeChange}
                  />
                </Form.Group>

                {props.values.selectType?.value === "Heading" ? (
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Label>Type Heading</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Heading"
                      value={props.values.heading}
                      onChange={(e) =>
                        props.setFieldValue("heading", e.target.value)
                      }
                    />
                  </Form.Group>
                ) : (
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Label>Response Type</Form.Label>
                    <Select
                      className="w-100 text-primary"
                      name="responseType"
                      options={responseTypeOptions}
                      value={props.values.responseType}
                      onChange={(selectedOption) => {
                        props.setFieldValue("responseType", selectedOption);
                      }}
                    />
                    {["Select", "checkbox", "radio", "multiSelect"].includes(
                      props.values?.responseType?.value
                    ) && (
                      <Form.Group as={Col} md={12}>
                        <Form.Label className="mt-2">Type Options</Form.Label>
                        <FieldArray
                          name="options"
                          render={(arrayHelpers) => (
                            <div>
                              <Row>
                                {props.values.options &&
                                props.values.options.length > 0
                                  ? props.values.options.map((item, index) => (
                                      <Col md={6} className="mb-2">
                                        <div key={index} className="d-flex">
                                          <Form.Control
                                            type="text"
                                            placeholder="Enter options..."
                                            name={`option.${index}`}
                                            value={item}
                                            onChange={(e) => {
                                              props.setFieldValue(
                                                `options.${index}`,
                                                e.target.value
                                              );
                                            }}
                                          />
                                          {props.values.options.length > 1 && (
                                            <button
                                              className="shadow border-0 p-2 red-combo cursor-pointer d-align gap-2"
                                              type="button"
                                              onClick={() =>
                                                arrayHelpers.remove(index)
                                              } // remove a friend from the list
                                            >
                                              -
                                            </button>
                                          )}
                                          <button
                                            type="button"
                                            className="shadow border-0 p-2 success-combo cursor-pointer d-align gap-2"
                                            onClick={() =>
                                              arrayHelpers.insert(index + 1, "")
                                            } // insert an empty string at a position
                                          >
                                            +
                                          </button>
                                        </div>
                                      </Col>
                                    ))
                                  : null}
                              </Row>
                            </div>
                          )}
                        />
                      </Form.Group>
                    )}
                  </Form.Group>
                )}

                <Modal.Footer>
                  <Button
                    className="bg-new text-uppercase text-gray"
                    onClick={() => setOpenModal(false)}
                  >
                    Close
                  </Button>
                  <Button
                    className="bg-new text-uppercase text-secondary"
                    variant="primary"
                    type="submit"
                  >
                    Save
                  </Button>
                </Modal.Footer>
              </form>
            );
          }}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default CreateHeadingResponseModal;
