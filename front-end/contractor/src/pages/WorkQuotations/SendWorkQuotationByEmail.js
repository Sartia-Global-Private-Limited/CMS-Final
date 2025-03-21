import React, { useState } from "react";
import { Form, Col, Row, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import ConfirmAlert from "../../components/ConfirmAlert";
import { Formik } from "formik";
import { Helmet } from "react-helmet";
import CardComponent from "../../components/CardComponent";
import TextareaAutosize from "react-textarea-autosize";
import { addWorkQuotationSchema } from "../../utils/formSchema";
import { getSendByEmailQuotation } from "../../services/contractorApi";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import EditorToolbar, {
  formats,
  modules,
} from "../../components/EditorToolbar";
import { BsEnvelope } from "react-icons/bs";

const SendWorkQuotationByEmail = () => {
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      to: values.to,
      subject: values.subject,
      html: values.html,
    };

    const res = await getSendByEmailQuotation(sData);
    if (res.status) {
      toast.success(res.message);
      resetForm();
      navigate(-1);
    } else {
      toast.error(res.message);
    }
    setSubmitting(false);
  };

  return (
    <>
      <Helmet>
        <title>Quotation Send By Email · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent title={"Quotation Send By Email"}>
          <Formik
            enableReinitialize={true}
            initialValues={{
              to: "",
              subject: "",
              html: "",
            }}
            validationSchema={addWorkQuotationSchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props?.handleSubmit}>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm={2}>
                    To:
                  </Form.Label>
                  <Col sm={10}>
                    <Form.Control
                      type="email"
                      name={"to"}
                      value={props.values.to}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      isInvalid={Boolean(props.touched.to && props.errors.to)}
                    />
                    <Form.Control.Feedback type="invalid">
                      {props.errors.to}
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm={2}>
                    Subject:
                  </Form.Label>
                  <Col sm={10}>
                    <TextareaAutosize
                      className="edit-textarea"
                      name="subject"
                      value={props.values.subject}
                      onChange={props.handleChange}
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row}>
                  <Col md={12}>
                    <EditorToolbar />
                    <ReactQuill
                      style={{ height: "150px" }}
                      placeholder={"Write something awesome..."}
                      modules={modules}
                      formats={formats}
                      theme="snow"
                      name={"html"}
                      value={props.values.html}
                      onChange={(getContent) => {
                        props.setFieldValue("html", getContent);
                      }}
                    />
                  </Col>
                  <Col md={12}>
                    <div className="mt-4 text-center">
                      <button
                        type={`button`}
                        onClick={() => setShowAlert(true)}
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
                          <>Send</>
                        )}
                      </button>
                      <ConfirmAlert
                        size={"sm"}
                        deleteFunction={props.handleSubmit}
                        hide={setShowAlert}
                        show={showAlert}
                        title={"Confirm ?"}
                        description={"Are you sure you want to send this!!"}
                        defaultIcon={<BsEnvelope />}
                      />
                    </div>
                  </Col>
                </Form.Group>
              </Form>
            )}
          </Formik>
        </CardComponent>
      </Col>
    </>
  );
};

export default SendWorkQuotationByEmail;
