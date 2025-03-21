import React, { useEffect, useState } from "react";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import CardComponent from "../../../components/CardComponent";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getInvoicesDetailsPaymentPaid,
  getPaymentPaidDetails,
  otpVerifyInPaymentPaid,
} from "../../../services/contractorApi";
import { ErrorMessage, Formik } from "formik";
import { toast } from "react-toastify";
import { verifyOtp } from "../../../utils/formSchema";
import Select from "react-select";
import { BsTextarea } from "react-icons/bs";
import { useTranslation } from "react-i18next";

const OtpVerify = () => {
  const [amount, setamount] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();
  const paid_amount = location.state?.paid_amount;
  const manager_id = location.state?.manager_id;
  const ro_id = location.state?.ro_id;
  const id = location.state?.id;
  const { t } = useTranslation();

  const ViewAmount = async () => {
    const res = await getPaymentPaidDetails(id);
    // console.log(res.data[0]?.amount, "amountttt");
    if (res.status) {
      setamount(res.data[0]);
    } else {
      setamount([]);
    }
  };

  useEffect(() => {
    ViewAmount();
  }, []);
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      amount_received: amount.amount,
      otp: values.otp.toString(),
      payment_mode: values.payment_mode.value,
      transaction_id: values.transaction_id,
      remark: values.remark,
      manager_id,
      paid_amount,
      ro_id,
      id,
    };

    const res = await otpVerifyInPaymentPaid(sData);

    if (res.status) {
      toast.success(res.message);
      navigate(-1);
      resetForm();
    } else {
      toast.error(res.message);
    }
    setSubmitting(false);
  };

  return (
    <>
      <Col md={12}>
        <CardComponent title={"verify Otp"} showBackButton={true}>
          <Formik
            initialValues={{
              otp: "",
              amount_received: "",
              payment_mode: "",
              transaction_id: "",
              remark: "",
            }}
            enableReinitialize={true}
            onSubmit={handleSubmit}
            validationSchema={verifyOtp}
          >
            {(props) => {
              return (
                <>
                  <div className="shadow p-3">
                    <Row>
                      <Form.Group as={Col} md={3}>
                        <Form.Label className="fw-bolder">
                          {t("Otp")} <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="number"
                          name="otp"
                          onChange={(e) => {
                            if (e.target.value.length <= 6) {
                              props.setFieldValue("otp", e.target.value);
                            }
                          }}
                          value={props.values.otp}
                          onBlur={props.handleBlur}
                          isInvalid={Boolean(
                            props.touched.otp && props.errors.otp
                          )}
                        />
                        <ErrorMessage
                          name="otp"
                          component="small"
                          className="text-danger"
                        />
                      </Form.Group>

                      <Form.Group as={Col} md={3}>
                        <Form.Label className="fw-bolder">
                          {t("Amount Recieved")}{" "}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="number"
                          name="amount_received"
                          placeholder={amount.amount}
                          disabled
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          isInvalid={Boolean(
                            props.touched.amount_received &&
                              props.errors.amount_received
                          )}
                        />
                        <ErrorMessage
                          name="amount_received"
                          component="small"
                          className="text-danger"
                        />
                      </Form.Group>
                      <Form.Group as={Col} md={3}>
                        <Form.Label className="fw-bolder">
                          {t("payment mode")}{" "}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Select
                          menuPortalTarget={document.body}
                          className="text-primary"
                          name="payment_mode"
                          value={props.values.payment_mode}
                          onChange={(val) => {
                            props.setFieldValue("payment_mode", val);
                          }}
                          onBlur={props.handleBlur}
                          options={[
                            { label: "Cash", value: "cash" },
                            { label: "Online", value: "online" },
                          ]}
                          isInvalid={Boolean(
                            props.touched.payment_mode &&
                              props.errors.payment_mode
                          )}
                        />

                        <ErrorMessage
                          name="payment_mode"
                          component="small"
                          className="text-danger"
                        />
                      </Form.Group>
                      <Form.Group as={Col} md={3}>
                        <Form.Label className="fw-bolder">
                          {t("Transaction Id")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="transaction_id"
                          disabled={props.values.payment_mode?.value == "cash"}
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          isInvalid={Boolean(
                            props.touched.transaction_id &&
                              props.errors.transaction_id
                          )}
                        />
                        <ErrorMessage
                          name="transaction_id"
                          component="small"
                          className="text-danger"
                        />
                      </Form.Group>
                      <Form.Group as={Col} md={12}>
                        <Form.Label className="fw-bolder mt-3">
                          {t("remark")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          type="text"
                          name="remark"
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          isInvalid={Boolean(
                            props.touched.remark && props.errors.remark
                          )}
                        />
                        <ErrorMessage
                          name="remark"
                          component="small"
                          className="text-danger"
                        />
                      </Form.Group>
                    </Row>
                  </div>

                  <Form.Group as={Col} md={12}>
                    <div className="mt-4 text-center">
                      <button
                        type="submit"
                        onClick={() => {
                          props.handleSubmit();
                        }}
                        className={`shadow border-0 px-4 py-1 purple-combo cursor-pointer `}
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
                          <>{t("submit")}</>
                        )}
                      </button>
                      <br />

                      {/* <OtpInput
                      className="fs-5 mx-1"
                      value={otp}
                      isInputNum={true}
                      onChange={setOtp}
                      numInputs={6}
                      renderInput={(props) => <input {...props} />}
                    /> */}
                    </div>
                  </Form.Group>
                </>
              );
            }}
          </Formik>
        </CardComponent>
      </Col>
    </>
  );
};

export default OtpVerify;
