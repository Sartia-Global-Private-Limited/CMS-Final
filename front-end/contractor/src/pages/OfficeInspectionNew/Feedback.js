import { ErrorMessage } from "formik";
import React, { useState } from "react";
import { Col, Form, Row, Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Rating } from "react-simple-star-rating";
import ReactTextareaAutosize from "react-textarea-autosize";

export default function Feedback({ props, index }) {
  const { t } = useTranslation();

  const handleFeedbackRating = (rating, props, subject) => {
    const previousValues =
      props.values?.users[index]?.feedback_details?.feedback || [];

    const newVal = { rating, subject };
    const updateArray =
      previousValues.length > 0 ? [...previousValues, newVal] : [newVal];
    props.setFieldValue(
      `users[${index}].feedback_details.feedback`,
      updateArray
    );
  };

  return (
    <div className="text-body Roles bg-new p-3">
      <h4 className="text-center">{t("feedback_form")}</h4>
      <Row>
        <Form.Group as={Col} md="4" className="mb-1">
          <Form.Label className="small">contact Person name </Form.Label>
          <Form.Control
            placeholder="Enter contact person name"
            type="text"
            onChange={(e) =>
              props.setFieldValue(
                `users[${index}].feedback_details.contact_person_name`,
                e.target.value
              )
            }
          />
        </Form.Group>

        <Form.Group as={Col} md="4" className="mb-1">
          <Form.Label className="small">contact Person Number </Form.Label>
          <Form.Control
            placeholder="Enter contact person number"
            type="number"
            onChange={(e) =>
              props.setFieldValue(
                `users[${index}].feedback_details.contact_person_no`,
                e.target.value
              )
            }
          />
          <ErrorMessage
            name="manager"
            component="small"
            className="text-danger"
          />
        </Form.Group>

        <Form.Group as={Col} md="4" className="mb-1">
          <Form.Label className="small">E-mail id</Form.Label>
          <Form.Control
            placeholder="Enter email Id"
            onChange={(e) =>
              props.setFieldValue(
                `users[${index}].feedback_details.contact_person_email`,
                e.target.value
              )
            }
          />
          <ErrorMessage
            name="manager"
            component="small"
            className="text-danger"
          />
        </Form.Group>

        <Table striped bordered hover className="my-4">
          <thead>
            <tr>
              <th>S.No.</th>
              <th colSpan={2}>{t("subject")}</th>
              <th>{t("rating")}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td colSpan={2}>{t("question1")}</td>
              <td>
                <Rating
                  size={35}
                  onClick={(e) => {
                    const subject =
                      "IN YOUR OPINION HOW IS THE BEHAVIOR OF OUR TEAM AT YOUR OUTLET DURING WORK ?";
                    handleFeedbackRating(e, props, subject);
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>2</td>
              <td colSpan={2}>{t("question2")}</td>
              <td>
                <Rating
                  size={35}
                  onClick={(e) => {
                    const subject =
                      "In Your opinion what about the way of working of our team atyour outlet ?";
                    handleFeedbackRating(e, props, subject);
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>3</td>
              <td colSpan={2}>{t("question3")}</td>
              <td>
                <Rating
                  size={35}
                  onClick={(e) => {
                    const subject =
                      "IN YOUR OPINION WHAT IS THE STANDARDS OF QUALITY OF THE MATERIALS USED AT YOUR OUTLET ?";
                    handleFeedbackRating(e, props, subject);
                  }}
                />
              </td>
            </tr>

            <tr>
              <td>4</td>
              <td colSpan={2}>{t("question4")}</td>
              <td>
                <Rating
                  size={35}
                  onClick={(e) => {
                    const subject =
                      "IN YOUR OPINION HOW MUCH SAFETY CONCERN OUR TEAM DURING CARRYING OUT JOBS AT RETAIL OUTLET ?";
                    handleFeedbackRating(e, props, subject);
                  }}
                />
              </td>
            </tr>

            <tr>
              <td>5</td>
              <td colSpan={2}>{t("question5")}</td>
              <td>
                <Rating
                  size={35}
                  onClick={(e) => {
                    const subject =
                      "IN YOUR OPINION OUR TEAM TIMELY REPORT TO THE OUTLET ON RECEIPT OF COMPLAINTS ?";
                    handleFeedbackRating(e, props, subject);
                  }}
                />
              </td>
            </tr>

            <tr>
              <td>6</td>
              <td colSpan={2}>{t("question6")}</td>
              <td>
                <Rating
                  size={35}
                  onClick={(e) => {
                    const subject =
                      "IN YOUR OPINION HOW MUCH EFFECT COMES ON YOUR SALE DURING WORK EXICUTION AT YOUR OUTLET ?";
                    handleFeedbackRating(e, props, subject);
                  }}
                />
              </td>
            </tr>

            <tr>
              <td>7</td>
              <td colSpan={2}>{t("question7")}</td>
              <td>
                <Rating
                  size={35}
                  onClick={(e) => {
                    const subject =
                      "HOW MUCH GRADE YOU WILL GIVE OVERALL OF OUR TEAM ?";
                    handleFeedbackRating(e, props, subject);
                  }}
                />
              </td>
            </tr>
          </tbody>
        </Table>

        <h6 className="text-center my-3">{t("IF_ANY_COMPLAINTS")}</h6>

        <Form.Group as={Col} md="12">
          <ReactTextareaAutosize
            minRows={3}
            placeholder="type complaints..."
            onChange={(e) =>
              props.setFieldValue(
                `users[${index}].feedback_details.complaints`,
                e.target.value
              )
            }
            className="edit-textarea"
          />
        </Form.Group>

        <h6 className="text-center my-3">{t("IF_ANY_SUGGESTIONS")}</h6>

        <Form.Group as={Col} md="12">
          <ReactTextareaAutosize
            minRows={3}
            placeholder="type suggestions..."
            onChange={(e) =>
              props.setFieldValue(
                `users[${index}].feedback_details.suggestions`,
                e.target.value
              )
            }
            className="edit-textarea"
          />
        </Form.Group>
      </Row>
    </div>
  );
}
