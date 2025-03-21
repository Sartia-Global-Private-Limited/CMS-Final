import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Col, Spinner, Form } from "react-bootstrap";
import CardComponent from "../../components/CardComponent";
import { Helmet } from "react-helmet";
import { Formik } from "formik";
import { useTranslation } from "react-i18next";
import { BiPaperPlane } from "react-icons/bi";
import { toast } from "react-toastify";
import {
  getFeedbackSuggestionById,
  postResponse,
} from "../../services/contractorApi";
import { addResponse } from "../../utils/formSchema";

const Response = () => {
  const [viewDetails, setViewDetails] = useState({});
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state.id;

  const fetchSingleDetailsData = async () => {
    const res = await getFeedbackSuggestionById(id);
    if (res.status) {
      setViewDetails(res.data);
    } else {
      setViewDetails({});
    }
  };
  useEffect(() => {
    if (id) fetchSingleDetailsData();
  }, []);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      response: values.response,
    };

    const res = await postResponse(id, sData);

    if (res.status) {
      navigate(-1);
      toast.success(res.message);
      resetForm();
    } else {
      toast.error(res.message);
    }
    setSubmitting(false);
  };
  return (
    <>
      <Helmet>
        <title>Contacts · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CardComponent showBackButton={true} title={"Response"}>
          <div className="mt-2 mb-4 rounded shadow p-3">
            <table className="table-sm table">
              <tbody>
                <tr>
                  <th>{t("title")} :</th>
                  <td>{viewDetails?.title}</td>
                </tr>

                <tr>
                  <th>{t("description")}:</th>
                  <td>{viewDetails?.description}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <Formik
            enableReinitialize={true}
            initialValues={{ response: "" }}
            validationSchema={addResponse}
            onSubmit={handleSubmit}
          >
            {(props) => {
              return (
                <Form onSubmit={props?.handleSubmit}>
                  <div className="shadow p-3">
                    <Form.Group as={Col} md={12}>
                      <Col md={12}>
                        <Form.Label className="fw-bolder ms-3">
                          {t("Response")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="   p-3  rounded h-100">
                          <Form.Control
                            as="textarea"
                            rows={4}
                            name="response"
                            value={props.values.response}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            isInvalid={Boolean(
                              props.touched.response && props.errors.response
                            )}
                          />
                          <Form.Control.Feedback type="invalid">
                            {props.errors.response}
                          </Form.Control.Feedback>
                        </div>
                      </Col>
                    </Form.Group>
                  </div>
                  <Form.Group as={Col} md={12}>
                    <div className="mt-4 text-center">
                      <button
                        type={`submit`}
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
                            {t("PLEASE WAIT")}...
                          </>
                        ) : (
                          <>
                            {t("Send")} <BiPaperPlane />
                          </>
                        )}
                      </button>
                      {/* <ConfirmAlert
                      size={"sm"}
                      deleteFunction={props.handleSubmit}
                      hide={setShowAlert}
                      show={showAlert}
                      title={"Confirm UPDATE"}
                      description={"Are you sure you want to update this!!"}
                    /> */}
                    </div>
                  </Form.Group>
                </Form>
              );
            }}
          </Formik>
        </CardComponent>
      </Col>
    </>
  );
};

export default Response;
