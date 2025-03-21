import React from "react";
import FormSelect from "../FormSelect";
import { Col, Form, Row } from "react-bootstrap";

const CreateSurvey = () => {
  return (
    <Row className="g-4">
      <Col md={12}>
        <Form.Label>Assign User Name</Form.Label>
        <Form.Control type="text" required />
      </Col>
      <Col md={12}>
        <FormSelect label={"Select Survey"} option={["Sub Users", "Outlets"]} />
      </Col>
      <Col md={12}>
        <Form.Label>Mobile Number</Form.Label>
        <Form.Control type="number" required />
      </Col>
    </Row>
  );
};

export default CreateSurvey;
