import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { viewSingleEmployeeDocuments } from "../../../services/authapi";

const ViewDocuments = () => {
  const { id } = useParams();
  const [viewDocuments, setViewDocuments] = useState([]);
  const fetchData = async () => {
    const res = await viewSingleEmployeeDocuments(id);
    if (res.status) {
      setViewDocuments(res.data);
    } else {
      setViewDocuments([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <Row className="g-4">
        <Col md={4}>
          <Card.Title style={{ fontSize: "15px", fontWeight: "bold" }}>
            Doctorate Document
          </Card.Title>
          <Card className="card-bg">
            <Card.Body>
              {" "}
              <img
                src={`${process.env.REACT_APP_API_URL}/${viewDocuments?.doctorate}`}
                alt="documents"
                className="img-fluid"
                style={{ height: "180px", width: "100%" }}
              />
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card.Title style={{ fontSize: "15px", fontWeight: "bold" }}>
            Graduation Document
          </Card.Title>
          <Card className="card-bg">
            <Card.Body>
              <img
                src={`${process.env.REACT_APP_API_URL}/${viewDocuments?.graduation}`}
                alt="documents"
                className="img-fluid"
                style={{ height: "180px", width: "100%" }}
              />
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card.Title style={{ fontSize: "15px", fontWeight: "bold" }}>
            Post Graduation Document
          </Card.Title>
          <Card className="card-bg ">
            <Card.Body>
              <img
                src={`${process.env.REACT_APP_API_URL}/${viewDocuments?.post_graduation}`}
                alt="documents"
                className="img-fluid"
                style={{ height: "180px", width: "100%" }}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="g-4 mt-3">
        <Col md={4}>
          <Card.Title style={{ fontSize: "15px", fontWeight: "bold" }}>
            Aadhar Card Front Image
          </Card.Title>

          <Form.Group className="mb-2">
            {/* <Form.Label> Team</Form.Label> */}
            <Form.Control type="text" value={viewDocuments?.aadhar} readOnly />
          </Form.Group>
          <Card className="card-bg ">
            <Card.Body>
              {" "}
              <img
                src={
                  viewDocuments?.aadhar_card_front_image
                    ? `${process.env.REACT_APP_API_URL}/${viewDocuments?.aadhar_card_front_image}`
                    : "https://i.ibb.co/z88XtSL/dc90103390322e14d7ce016e44e087d9.webp"
                }
                alt="documents"
                className="img-fluid"
                style={{ height: "180px", width: "100%" }}
              />
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card.Title style={{ fontSize: "15px", fontWeight: "bold" }}>
            Aadhar Card Back Image
          </Card.Title>
          <Form.Group className="mb-2">
            {/* <Form.Label> Team</Form.Label> */}
            <Form.Control type="text" value={viewDocuments?.aadhar} readOnly />
          </Form.Group>
          <Card className="card-bg ">
            <Card.Body>
              <img
                src={
                  viewDocuments?.aadhar_card_back_image
                    ? `${process.env.REACT_APP_API_URL}/${viewDocuments?.aadhar_card_back_image}`
                    : "https://i.ibb.co/9w0hLLw/Masked-Aadhaar-Card-1.png"
                }
                alt="documents"
                className="img-fluid"
                style={{ height: "180px", width: "100%" }}
              />
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card.Title style={{ fontSize: "15px", fontWeight: "bold" }}>
            Pan Card Image
          </Card.Title>
          <Form.Group className="mb-2">
            <Form.Control type="text" value={viewDocuments?.pan} readOnly />
          </Form.Group>
          <Card className="card-bg ">
            <Card.Body>
              <img
                src={
                  viewDocuments?.pan_card_image
                    ? `${process.env.REACT_APP_API_URL}/${viewDocuments?.pan_card_image}`
                    : "../../src/assets/images/empty.png"
                }
                alt="documents"
                className="img-fluid"
                style={{ height: "180px", width: "100%" }}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ViewDocuments;
