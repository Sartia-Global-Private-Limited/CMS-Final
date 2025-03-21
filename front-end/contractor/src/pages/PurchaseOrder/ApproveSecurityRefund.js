import React, { useState } from "react";
import { PostApproveSecurityRefund } from "../../services/contractorApi";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import { ErrorMessage, Formik } from "formik";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import CardComponent from "../../components/CardComponent";
import { useLocation, useNavigate } from "react-router-dom";
import { addApproveSecurityRefund } from "../../utils/formSchema";

const ApproveSecurityRefund = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state.id;

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      po_ids: id,
      payment_reference_number: values?.payment_reference_number,
      date: values?.date,
      amount: values?.amount,
    };

    const res = await PostApproveSecurityRefund(sData);
    if (res.status) {
      toast.success(res.message);
      resetForm();
      navigate(-1);
      localStorage.setItem("last_tab", "5");
    } else {
      toast.error(res.message);
    }

    setSubmitting(false);
  };

  return (
    <>
      <Helmet>
        <title>Create Security Deposit · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent title={"Create Security"} showBackButton={true}>
          <Formik
            enableReinitialize={true}
            validationSchema={addApproveSecurityRefund}
            // validationSchema={addApproveSecurityRefund}
            onSubmit={handleSubmit}
            initialValues={() => {}}
          >
            {(props) => (
              <Form onSubmit={props?.handleSubmit}>
                <Row className="g-2">
                  <Form.Group as={Col} md={4}>
                    <Form.Label>
                      {t("payment reference number")}
                      <span className="text-danger fw-bold">*</span>
                    </Form.Label>
                    <Form.Control
                      name="payment_reference_number"
                      value={props.values?.payment_reference_number}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      type="text"
                      isInvalid={Boolean(
                        props.touched.payment_reference_number &&
                          props.errors.payment_reference_number
                      )}
                    />
                    <ErrorMessage
                      name="payment_reference_number"
                      component="small"
                      className="text-danger"
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={4}>
                    <Form.Label>
                      {t("Date")}
                      <span className="text-danger fw-bold">*</span>
                    </Form.Label>
                    <Form.Control
                      name="date"
                      value={props.values?.date}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      type="date"
                      isInvalid={Boolean(
                        props.touched.date && props.errors.date
                      )}
                    />
                    <ErrorMessage
                      name="date"
                      component="small"
                      className="text-danger"
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={4}>
                    <Form.Label>
                      {t("Amount")}
                      <span className="text-danger fw-bold">*</span>
                    </Form.Label>
                    <Form.Control
                      name="amount"
                      value={props.values?.amount}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      type="text"
                      isInvalid={Boolean(
                        props.touched.amount && props.errors.amount
                      )}
                    />
                    <ErrorMessage
                      name="amount"
                      component="small"
                      className="text-danger"
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={12}>
                    <div className="mt-4 text-center">
                      <button
                        type="submit"
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
                          <>{t("CREATE")}</>
                        )}
                      </button>
                    </div>
                  </Form.Group>
                </Row>
              </Form>
            )}
          </Formik>
        </CardComponent>
      </Col>
    </>
  );
};

export default ApproveSecurityRefund;
