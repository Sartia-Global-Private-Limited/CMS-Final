import React, { useEffect, useState } from "react";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import { Helmet } from "react-helmet";
import TextareaAutosize from "react-textarea-autosize";
import { toast } from "react-toastify";
import { ErrorMessage, Formik } from "formik";
import { addRequestCashSchema } from "../../../utils/formSchema";
import ConfirmAlert from "../../../components/ConfirmAlert";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import CardComponent from "../../../components/CardComponent";
import {
  getSingleRequestCashById,
  postRequestCash,
  updateRequestCash,
} from "../../../services/contractorApi";
import { ViewRequestCash } from "./ViewRequestCash";

const CreateRequestCash = () => {
  const [edit, setEdit] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || null;

  const fetchSingleData = async () => {
    const res = await getSingleRequestCashById(id);
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit([]);
    }
  };

  useEffect(() => {
    if (id !== "new") {
      fetchSingleData();
    }
  }, []);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      request_amount: values.request_amount,
      request_purpose: values.request_purpose,
    };

    if (edit?.id) {
      sData["id"] = edit?.id;
    }

    // return console.log("sData", sData);
    const res = edit?.id
      ? await updateRequestCash(sData)
      : await postRequestCash(sData);
    if (res.status) {
      toast.success(res.message);
      navigate(-1);
    } else {
      toast.error(res.message);
      setShowAlert(false);
    }
    resetForm();
    setSubmitting(false);
  };

  return (
    <>
      <Helmet>
        <title>
          {type === "view"
            ? "View"
            : type === "approve"
            ? "Approve"
            : edit?.id
            ? "Update"
            : "Create"}{" "}
          Request Cash · CMS Electricals
        </title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent
          className={type === "view" && "after-bg-light"}
          title={`${
            type === "view" ? "View" : edit?.id ? "Update" : "Create"
          } Request Cash`}
        >
          <Formik
            enableReinitialize={true}
            initialValues={{
              request_amount: edit?.request_amount || "",
              request_purpose: edit?.request_purpose || "",
            }}
            validationSchema={addRequestCashSchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props?.handleSubmit}>
                <Row className="g-2">
                  {type == "view" ? (
                    <ViewRequestCash edit={edit} />
                  ) : (
                    <>
                      <Form.Group as={Col} md={3}>
                        <Form.Label>
                          Request Amount{" "}
                          <span className="text-danger fw-bold">*</span>
                        </Form.Label>
                        <Form.Control
                          type="number"
                          step="any"
                          name={`request_amount`}
                          value={props.values.request_amount}
                          onChange={props.handleChange}
                        />
                        <ErrorMessage
                          name="request_amount"
                          component="small"
                          className="text-danger"
                        />
                      </Form.Group>
                      <Form.Group as={Col} md={12}>
                        <Form.Label>
                          Request Purpose{" "}
                          {/* <span className="text-danger fw-bold">*</span> */}
                        </Form.Label>
                        <TextareaAutosize
                          className="edit-textarea"
                          minRows={3}
                          name={`request_purpose`}
                          value={props.values.request_purpose}
                          onChange={props.handleChange}
                        />
                        <ErrorMessage
                          name="request_purpose"
                          component="small"
                          className="text-danger"
                        />
                      </Form.Group>

                      <Form.Group as={Col} md={12}>
                        <div className="mt-4 text-center">
                          <button
                            type={`${edit.id ? "button" : "submit"}`}
                            onClick={() => setShowAlert(edit.id && true)}
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
                              <>{edit.id ? "UPDATE" : "Save"}</>
                            )}
                          </button>
                          <ConfirmAlert
                            size={"sm"}
                            deleteFunction={props.handleSubmit}
                            hide={setShowAlert}
                            show={showAlert}
                            title={"Confirm UPDATE"}
                            description={
                              "Are you sure you want to update this!!"
                            }
                          />
                        </div>
                      </Form.Group>
                    </>
                  )}
                </Row>
              </Form>
            )}
          </Formik>
        </CardComponent>
      </Col>
    </>
  );
};

export default CreateRequestCash;
