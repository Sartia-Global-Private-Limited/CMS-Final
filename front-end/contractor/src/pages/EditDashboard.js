import React, { useState } from "react";
import { Card, Col, Collapse, Form, Row } from "react-bootstrap";
import {
  BsArrowsMove,
  BsEyeFill,
  BsPlusCircleFill,
  BsXLg,
} from "react-icons/bs";
import CardComponent from "../components/CardComponent";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import Modaljs from "../components/Modal";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import EditorToolbar, { formats, modules } from "../components/EditorToolbar";

const EditDashboard = () => {
  const [open, setOpen] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [viewShow, setViewShow] = useState(false);
  const widget = [
    {
      id: 1,
      title: "Date & Time",
    },
    {
      id: 1,
      title: "Total Working Hours",
    },
    {
      id: 1,
      title: "Clock in-out",
    },
    {
      id: 1,
      title: "Work Progress",
    },
    {
      id: 1,
      title: "Total Complaint",
    },
    {
      id: 1,
      title: "Total Complaint Types",
    },
    {
      id: 1,
      title: "Complaint Status Count",
    },
    {
      id: 1,
      title: "Holiday Calender",
    },
    {
      id: 1,
      title: "Complaint Type Status Count",
    },
    {
      id: 1,
      title: "Total Measurement Count",
    },
    {
      id: 1,
      title: "Total Measurement Status Count",
    },
    {
      id: 1,
      title: "Total Performa Invoice Count",
    },
    {
      id: 1,
      title: "Total Performa Invoice Status Count",
    },
    {
      id: 1,
      title: "Total Invoice Count",
    },
    {
      id: 1,
      title: "Total Invoice Status Count",
    },
    {
      id: 1,
      title: "Total Invoice Status Value",
    },
  ];
  return (
    <>
      <Col md={4}>
        <Card className="card-bg widget-area">
          <Card.Body>
            <div
              onClick={() => setViewShow(true)}
              className="social-btn mb-3 h-auto text-center w-auto"
            >
              <BsPlusCircleFill /> Add Widget
            </div>
            <SimpleBar className="area px-2">
              <div className="d-grid gap-2">
                {widget.map((item, idx) => (
                  <div
                    className="d-align small justify-content-between dashed-border p-2"
                    key={idx}
                  >
                    <span className="d-grid">
                      <span className="text-truncate pe-1" title={item.title}>
                        {item.title}
                      </span>
                    </span>
                    <span className="d-align gap-2">
                      <BsEyeFill
                        onClick={() => {
                          setModalIsOpen(item);
                          setModalIsOpen(true);
                        }}
                        className="social-btn success-combo"
                      />{" "}
                      <div className="vr hr-shadow" />
                      <BsArrowsMove className="social-btn success-combo" />
                    </span>
                  </div>
                ))}
              </div>
            </SimpleBar>
          </Card.Body>
        </Card>
      </Col>
      <Col md={8}>
        <CardComponent
          title={"Title"}
          custom2={
            <span className="d-align gap-2">
              <div className="bg-new py-1 px-3 cursor-pointer text-gray text-uppercase">
                Save
              </div>
              <div className="vr hr-shadow" />
              <div className="bg-new py-1 px-3 cursor-pointer text-uppercase text-secondary">
                Save & Show
              </div>
            </span>
          }
        >
          <div className="d-grid gap-2 mb-3">
            <div className="d-align small justify-content-between social-btn w-auto h-auto p-2">
              <Row className="g-3 w-100 text-center">
                <Col md={12}>
                  <div className="d-grid dashed-border p-1">
                    <div className="d-align small justify-content-between border border-light m-1 p-2">
                      <span className="d-grid">
                        <span className="text-truncate pe-1">DATE & TIME</span>
                      </span>
                      <span className="d-align gap-2">
                        <BsEyeFill className="social-btn success-combo" />{" "}
                        <div className="vr hr-shadow" />
                        <BsArrowsMove className="social-btn success-combo" />
                      </span>
                    </div>
                  </div>
                </Col>
              </Row>
              <span className="d-grid gap-2 ms-2">
                <BsXLg className="social-btn red-combo" />
                <span className="hr-border2 mt-1" />
                <BsArrowsMove className="social-btn success-combo" />
              </span>
            </div>
          </div>
          <div
            onClick={() => setOpen(!open)}
            className="social-btn mb-3 purple-combo py-3 w-auto gap-2 d-align"
          >
            <BsPlusCircleFill /> Add Row
          </div>
          <Collapse className="text-center" in={open}>
            <Row className="g-3">
              {[12, 6, 6, 3, 3, 3, 3, 4, 4, 4, 5, 7].map((col) => (
                <Col md={col} className="hover-click">
                  <div className="hover-div">{col}</div>
                </Col>
              ))}
            </Row>
          </Collapse>
        </CardComponent>
      </Col>

      <Modaljs
        open={viewShow}
        size={"lg"}
        closebtn={"Cancel"}
        Savebtn={"Save & SHOW"}
        extrabtn={"Save"}
        close={() => setViewShow(false)}
        title={"Add New Widget"}
      >
        <Form>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3}>
              Title
            </Form.Label>
            <Col sm={9}>
              <Form.Control type="text" />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3}>
              Content
            </Form.Label>
            <Col sm={9}>
              <EditorToolbar />
              <ReactQuill
                style={{ height: "200px" }}
                placeholder={"Write something awesome..."}
                modules={modules}
                formats={formats}
                theme="snow"
                name={"content"}
                value={"content"}
                //  onChange={(getContent) => {
                //     props.setFieldValue("content", getContent)
                // }}
              />
            </Col>
          </Form.Group>
        </Form>
      </Modaljs>
      <Modaljs
        open={modalIsOpen}
        size={"lg"}
        closebtn={"Cancel"}
        Savebtn={"OK"}
        close={() => setModalIsOpen(false)}
        title={"Widget"}
      >
        View Widget
      </Modaljs>
    </>
  );
};

export default EditDashboard;
