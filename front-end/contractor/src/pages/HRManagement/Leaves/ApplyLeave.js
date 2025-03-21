import React from "react";
import { Col, Form, Row } from "react-bootstrap";
import ReactDropzone from "../../../components/ReactDropzone";
import Select from "react-select";

const ApplyLeave = () => {
  const options = [
    { value: "select", label: "--" },
    { value: "alwp", label: "ALWP" },
    { value: "half-day", label: "Half Day" },
    { value: "office-off", label: "Office Off" },
    { value: "sick-leave", label: "Sick Leave" },
  ];
  return (
    <Col md={7} className="mx-auto">
      <Form.Group as={Row} className="mb-3">
        <Form.Label column>Leave Type</Form.Label>
        <Col md={8}>
          <Select
            className="text-primary"
            defaultValue={options[0]}
            options={options}
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column>Start Date</Form.Label>
        <Col md={8}>
          <Form.Control type="date" placeholder="date" />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column>End Date</Form.Label>
        <Col md={8}>
          <Form.Control type="date" placeholder="date" />
        </Col>
      </Form.Group>
      <Form.Group as={Row}>
        <Col md={12}>
          <ReactDropzone title={"Supporting Document / Upload Pdf"} />
        </Col>
      </Form.Group>
      <Col md={12}>
        <div className="text-center">
          <div className="my-bg px-3 text-secondary d-inline-block">Save</div>
        </div>
      </Col>
    </Col>
  );
};

export default ApplyLeave;
