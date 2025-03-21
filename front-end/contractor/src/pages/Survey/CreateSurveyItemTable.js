import React, { useState } from "react";
import TooltipComponent from "../../components/TooltipComponent";
import { BsPencilSquare, BsPlusLg, BsXLg } from "react-icons/bs";
import { Formik, FieldArray } from "formik";
import { Card, Col, Row, Form, Spinner, Table } from "react-bootstrap";
import CreateHeadingResponseModal from "../../components/CreateHeadingResponseModal";

const CreateSurveyItemTable = () => {
  const [edit, setEdit] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [currentEdit, setCurrentEdit] = useState(null);
  const [questionData, setQuestionsData] = useState([]);
  const [columns, setColumns] = useState([
    { key: "column1", label: "Column 1" },
  ]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      format: "Add Item Table",
      title: values.title,
      description: values.description,
      questions: values?.questions,
    };
  };

  const handleView = (rowIndex, colIndex) => {
    setCurrentEdit({ rowIndex, colIndex });
    setOpenModal(true);
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        format: edit?.format
          ? { value: edit?.format, label: edit?.format }
          : { value: "Add General Field", label: "Add General Field" },
        title: edit.title || "",
        description: edit.description || "",
        questions:
          questionData.length > 0
            ? questionData
            : [{ columns: [{ key: "", selectType: "", value: "" }] }],
      }}
      onSubmit={handleSubmit}
    >
      {(props) => {
        const handleModalSubmit = (data) => {
          if (currentEdit) {
            const { rowIndex, colIndex } = currentEdit;
            const updatedQuestions = [...props.values.questions];
            if (!updatedQuestions[rowIndex]) {
              updatedQuestions[rowIndex] = { columns: [] };
            }
            if (!updatedQuestions[rowIndex].columns) {
              updatedQuestions[rowIndex].columns = [];
            }
            if (!updatedQuestions[rowIndex].columns[colIndex]) {
              updatedQuestions[rowIndex].columns[colIndex] = {
                key: "",
                value: "",
              };
            }
            updatedQuestions[rowIndex].columns[colIndex] = {
              key: columns[colIndex]?.key,
              selectType: data?.selectType,
              value: data.value,
            };
            props.setFieldValue("questions", updatedQuestions);
            setQuestionsData(updatedQuestions);
          }
          setOpenModal(false);
        };
        return (
          <Form onSubmit={props.handleSubmit}>
            <Row className="g-4">
              <Col className="mx-auto" md={12}>
                <div className="d-grid gap-2">
                  <Card className="bg-new border-info border-5 border-top">
                    <Card.Body>
                      <Form.Control
                        placeholder="Survey Title"
                        type="text"
                        name={"title"}
                        value={props.values.title}
                        onChange={props.handleChange}
                        className="fs-4 shadow-none border-primary rounded-0 border-1 border-bottom"
                      />
                      <Form.Control
                        type="text"
                        name={"description"}
                        value={props.values.description}
                        onChange={props.handleChange}
                        className="shadow-none border-primary rounded-0 border-1 border-bottom"
                        placeholder="Survey description"
                      />
                    </Card.Body>
                  </Card>
                  <FieldArray name="questions">
                    {({ remove, push }) => {
                      const maxColumns = Math.max(
                        ...props.values.questions.map((q) => q.columns.length),
                        columns.length
                      );

                      return (
                        <>
                          <div className="table-scroll">
                            <Row>
                              <Col md={8}>
                                <div className="table-scroll">
                                  <Table
                                    style={{ width: "40rem" }}
                                    className=" text-body bg-new Roles"
                                  >
                                    <thead className="text-truncate">
                                      <tr>
                                        <th>Sr No.</th>
                                        {Array.from(
                                          { length: maxColumns },
                                          (_, index) => (
                                            <th
                                              key={index}
                                              className="text-center"
                                            >
                                              Column {index + 1}
                                            </th>
                                          )
                                        )}
                                        <th className="fixed-buttons">
                                          <TooltipComponent
                                            align="left"
                                            title={"Add Row"}
                                          >
                                            <button
                                              type="button"
                                              onClick={() =>
                                                push({
                                                  columns: Array.from(
                                                    { length: maxColumns },
                                                    (_, index) => ({
                                                      key: `column${index + 1}`,
                                                      selectType: "",
                                                      value: "",
                                                    })
                                                  ),
                                                })
                                              }
                                              className="shadow border-0 p-2 success-combo cursor-pointer d-align gap-2"
                                            >
                                              <BsPlusLg className="cursor-pointer" />
                                            </button>
                                          </TooltipComponent>
                                        </th>
                                      </tr>
                                    </thead>

                                    <tbody>
                                      {props.values.questions.length > 0 &&
                                        props.values.questions.map(
                                          (data, rowIndex) => (
                                            <tr key={rowIndex}>
                                              <td>{rowIndex + 1}</td>
                                              {Array.from(
                                                { length: maxColumns },
                                                (_, colIndex) => (
                                                  <td key={colIndex}>
                                                    <div
                                                      style={{
                                                        display: "flex",
                                                        justifyContent:
                                                          "center",
                                                        alignItems: "center",
                                                      }}
                                                    >
                                                      {data.columns[
                                                        colIndex
                                                      ] ? (
                                                        <>
                                                          <input
                                                            type="text"
                                                            disabled
                                                            style={{
                                                              marginRight: 2,
                                                              width: "12rem",
                                                            }}
                                                            className="form-control"
                                                            value={
                                                              data.columns[
                                                                colIndex
                                                              ]?.value || ""
                                                            }
                                                            onChange={(e) => {
                                                              const updatedQuestions =
                                                                [
                                                                  ...props
                                                                    .values
                                                                    .questions,
                                                                ];
                                                              updatedQuestions[
                                                                rowIndex
                                                              ].columns[
                                                                colIndex
                                                              ].value =
                                                                e.target.value;
                                                              props.setFieldValue(
                                                                "questions",
                                                                updatedQuestions
                                                              );
                                                              setQuestionsData(
                                                                updatedQuestions
                                                              );
                                                            }}
                                                          />
                                                          <TooltipComponent
                                                            title={"Edit"}
                                                          >
                                                            <span
                                                              onClick={() =>
                                                                handleView(
                                                                  rowIndex,
                                                                  colIndex
                                                                )
                                                              }
                                                              className="social-btn danger-combo"
                                                            >
                                                              <BsPencilSquare />
                                                            </span>
                                                          </TooltipComponent>
                                                          {data.columns.length >
                                                            1 && (
                                                            <TooltipComponent
                                                              align="left"
                                                              title={
                                                                "Remove Column"
                                                              }
                                                            >
                                                              <BsXLg
                                                                onClick={() => {
                                                                  const updatedQuestions =
                                                                    [
                                                                      ...props
                                                                        .values
                                                                        .questions,
                                                                    ];
                                                                  updatedQuestions[
                                                                    rowIndex
                                                                  ].columns.splice(
                                                                    colIndex,
                                                                    1
                                                                  );
                                                                  props.setFieldValue(
                                                                    "questions",
                                                                    updatedQuestions
                                                                  );
                                                                }}
                                                                className="social-btn red-combo ms-2"
                                                              />
                                                            </TooltipComponent>
                                                          )}
                                                        </>
                                                      ) : (
                                                        <div></div>
                                                      )}
                                                    </div>
                                                  </td>
                                                )
                                              )}
                                              <td>
                                                <div className="actions">
                                                  <TooltipComponent
                                                    align="left"
                                                    title={"Remove Row"}
                                                  >
                                                    <button
                                                      onClick={() =>
                                                        remove(rowIndex)
                                                      }
                                                      type="button"
                                                      className="shadow border-0 p-2 red-combo cursor-pointer d-align gap-1"
                                                    >
                                                      <BsXLg className="cursor-pointer" />
                                                    </button>
                                                  </TooltipComponent>
                                                  <TooltipComponent
                                                    align="left"
                                                    title={"Add Column"}
                                                  >
                                                    <button
                                                      type="button"
                                                      onClick={() => {
                                                        const updatedQuestions =
                                                          [
                                                            ...props.values
                                                              .questions,
                                                          ];
                                                        updatedQuestions[
                                                          rowIndex
                                                        ].columns.push({
                                                          key: `new_column_${
                                                            updatedQuestions[
                                                              rowIndex
                                                            ].columns.length + 1
                                                          }`,
                                                          selectType: "",
                                                          value: "",
                                                        });
                                                        props.setFieldValue(
                                                          "questions",
                                                          updatedQuestions
                                                        );
                                                      }}
                                                      className="shadow border-0 p-2 purple-combo cursor-pointer d-align gap-1"
                                                    >
                                                      <BsPlusLg className="cursor-pointer" />
                                                    </button>
                                                  </TooltipComponent>
                                                </div>
                                              </td>
                                            </tr>
                                          )
                                        )}
                                    </tbody>
                                  </Table>
                                </div>
                              </Col>
                              <Col md={4}>
                                <Formik>
                                  <Form>
                                    <Row className="g-2">
                                      <Form.Group as={Col} md={12}>
                                        <div className="table-scroll">
                                          <Table className="text-body Roles">
                                            <thead>
                                              {questionData.map(
                                                (item, index) => (
                                                  <tr>
                                                    {item.columns.map(
                                                      (column, colIndex) => (
                                                        <td
                                                          key={`${index}-${colIndex}`}
                                                          style={{
                                                            minWidth: "220px",
                                                          }}
                                                        >
                                                          {column.selectType ==
                                                          "Heading" ? (
                                                            <Form.Label>
                                                              {column.value}
                                                            </Form.Label>
                                                          ) : (
                                                            <Form.Control
                                                              type={
                                                                column.value
                                                              }
                                                              name={
                                                                column.value
                                                              }
                                                              value={""}
                                                              onChange={
                                                                props.handleChange
                                                              }
                                                            />
                                                          )}
                                                        </td>
                                                      )
                                                    )}
                                                  </tr>
                                                )
                                              )}
                                            </thead>
                                          </Table>
                                        </div>
                                      </Form.Group>
                                    </Row>
                                  </Form>
                                </Formik>
                              </Col>
                            </Row>
                          </div>
                        </>
                      );
                    }}
                  </FieldArray>

                  <div className="text-center mt-3">
                    <button
                      type="submit"
                      disabled={props.isSubmitting}
                      className="shadow border-0 purple-combo cursor-pointer px-4 py-1"
                    >
                      {props.isSubmitting ? (
                        <>
                          <Spinner
                            animation="border"
                            variant="primary"
                            size="sm"
                          />
                          PLEASE WAIT...
                        </>
                      ) : (
                        <>Submit</>
                      )}
                    </button>
                  </div>
                </div>
              </Col>
            </Row>

            {/* Modal for editing fields */}
            <CreateHeadingResponseModal
              openModal={openModal}
              setOpenModal={setOpenModal}
              onSubmit={handleModalSubmit}
              initialData={
                props.values.questions[currentEdit?.rowIndex]?.columns[
                  currentEdit?.colIndex
                ] || {}
              }
            />
          </Form>
        );
      }}
    </Formik>
  );
};

export default CreateSurveyItemTable;
