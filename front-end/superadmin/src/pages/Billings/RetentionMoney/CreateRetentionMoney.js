import React, { useEffect, useState } from "react";
import { Card, Col, Form, Row, Spinner } from "react-bootstrap";
import CardComponent from "../../../components/CardComponent";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getInvoiceDetailForRetention,
  postPaymentRecieved,
  postRetentionMoney,
  updatePaymentRecieved,
} from "../../../services/contractorApi";
import { ErrorMessage, Formik } from "formik";
import ConfirmAlert from "../../../components/ConfirmAlert";
import { toast } from "react-toastify";
import { paymentSchema } from "../../../utils/formSchema";

const CreateRetentionMoney = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const invoices_id = location.state?.selectedInvoices;
  const type = location.state?.type;
  const [allInvoices, setAllInvoices] = useState({});
  const [showAlert, setShowAlert] = useState(false);

  let final_amount = 0;
  let allDeductions = 0;

  const fetchInvoicesData = async () => {
    const id = invoices_id.join(",");
    const res = await getInvoiceDetailForRetention(id);

    if (res.status) {
      setAllInvoices(res.data);
    } else {
      setAllInvoices({});
    }
  };
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    // console.log(values, "values");
    const sData = {
      id: values.id,
      pv_amount: values.pv_amount,
      pv_number: values.payment_voucher_number,
      receipt_date: values.voucher_date,
      retention: values.retention,
      retention_amount: values.retention_amount,
    };

    // return console.log("sData", sData);
    const res = await postRetentionMoney(sData);
    if (res.status) {
      toast.success(res.message);
      navigate(-1);
      resetForm();
    } else {
      toast.error(res.message);
    }
    setSubmitting(false);
    setShowAlert(false);
  };

  useEffect(() => {
    fetchInvoicesData();
  }, []);

  return (
    <>
      <CardComponent
        title={` ${type == "update" ? "update" : "create"} retention`}
        showBackButton={true}
      >
        <Formik
          initialValues={
            allInvoices || {
              bill_number: "",
              receipt_date: "",
            }
          }
          enableReinitialize={true}
          onSubmit={handleSubmit}
          // validationSchema={paymentSchema}
        >
          {(props) => {
            const net_amount = parseFloat(props.values?.net_amount).toFixed(2);
            const total_deduction =
              (+props.values?.tds_amount || 0) +
              (+props.values?.tds_on_gst_amount || 0) +
              (+props.values?.retention_amount || 0) +
              (+props.values?.covid19_amount_hold || 0) +
              (+props.values?.ld_amount || 0) +
              (+props.values?.hold_amount || 0) +
              (+props.values?.other_deduction || 0);

            allDeductions = +allDeductions + +total_deduction;

            final_amount = props.values?.gross_amount - total_deduction;

            return (
              <>
                <Row className="row-cols-md-5 sticky-top bg-blue shadow g-4 mt-1 pb-3">
                  <Col md={3}>
                    <Form.Label>Payment Voucher number</Form.Label>
                    <Form.Control
                      type="text"
                      name="payment_voucher_number"
                      value={props.values?.payment_voucher_number}
                      onChange={(e) => {
                        props.setFieldValue(
                          `payment_voucher_number`,
                          e.target.value
                        );
                      }}
                      placeholder="enter voucher number"
                    />

                    <ErrorMessage
                      name={`payment_voucher_number`}
                      component="small"
                      className="text-danger"
                    />
                  </Col>

                  <Col md={2}>
                    <Form.Label> voucher Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={props.values?.voucher_date}
                      onChange={(e) => {
                        props.setFieldValue(`voucher_date`, e.target.value);
                      }}
                    />

                    <ErrorMessage
                      name={`voucher_date`}
                      component="small"
                      className="text-danger"
                    />
                  </Col>
                  <Col md={2}>
                    <Form.Label> voucher Amount </Form.Label>
                    <Form.Control
                      type="number"
                      step="any"
                      value={props.values?.pv_amount}
                      required={true}
                      onChange={(e) => {
                        props.setFieldValue(`pv_amount`, e.target.value);
                      }}
                      placeholder="enter payment amount"
                    />
                  </Col>
                </Row>

                <React.Fragment>
                  <Form onSubmit={props?.handleSubmit}>
                    <Row className="g-4  my-3 shadow">
                      <Col md={12}>
                        <Card className="card-bg">
                          <Card.Body>
                            <div className="mb-4 ">
                              <span className="fw-bold">Bill Number :</span>{" "}
                              {props.values?.invoice_number} <br />
                              <span className="fw-bold">Bill Date : </span>{" "}
                              {props.values?.invoice_date} <br />
                            </div>
                            <Row className="g-4">
                              <Col md={12}>
                                <span className="fw-bolder">
                                  Other Deductions
                                </span>
                              </Col>

                              <Col md={2}>
                                <Form.Label>TDS %</Form.Label>
                                <Form.Control
                                  type="number"
                                  step="any"
                                  placeholder="enter %"
                                  name={`invoiceData.tds`}
                                  value={props.values?.tds}
                                  disabled
                                />
                              </Col>

                              <Col md={2}>
                                <Form.Label>Tds amount</Form.Label>
                                <Form.Control
                                  type="number"
                                  step="any"
                                  placeholder="enter amount"
                                  name={`invoiceData.tds_amount`}
                                  value={props.values?.tds_amount}
                                  disabled
                                />
                              </Col>

                              <Col md={2}>
                                <Form.Label>TDS % on gst</Form.Label>
                                <Form.Control
                                  type="number"
                                  step="any"
                                  placeholder=" enter tds %"
                                  name={`invoiceData.tds_on_gst`}
                                  value={props.values?.tds_on_gst}
                                  disabled
                                />
                              </Col>

                              <Col md={2}>
                                <Form.Label>Tds Gst amount </Form.Label>
                                <Form.Control
                                  type="number"
                                  step="any"
                                  placeholder="enter amount"
                                  name={`invoiceData.tds_on_gst_amount`}
                                  value={props.values?.tds_on_gst_amount}
                                  disabled
                                />
                              </Col>

                              <Col md={2}>
                                <Form.Label>retention %</Form.Label>
                                <Form.Control
                                  type="number"
                                  step="any"
                                  placeholder="enter %"
                                  name={`retention`}
                                  value={props.values?.retention}
                                  onChange={(e) => {
                                    props.setFieldValue(
                                      `retention`,
                                      e.target.value
                                    );

                                    const retention_amount = (
                                      (net_amount * e.target.value) /
                                      100
                                    ).toFixed(2);

                                    props.setFieldValue(
                                      `retention_amount`,
                                      retention_amount
                                    );
                                  }}
                                />
                              </Col>

                              <Col md={2}>
                                <Form.Label>retention </Form.Label>
                                <Form.Control
                                  type="number"
                                  step="any"
                                  placeholder="enter amount"
                                  name={`retention_amount`}
                                  value={props.values?.retention_amount}
                                  onChange={(e) => {
                                    props.setFieldValue(
                                      `retention_amount`,
                                      e.target.value
                                    );
                                    const retention = (
                                      (e.target.value * 100) /
                                      net_amount
                                    ).toFixed(2);
                                    props.setFieldValue(`retention`, retention);
                                  }}
                                />
                              </Col>

                              <Col md={2}>
                                <Form.Label>covid 19 Amount</Form.Label>
                                <Form.Control
                                  type="number"
                                  step="any"
                                  placeholder="enter amount"
                                  name={`invoiceData.covid19_amount_hold`}
                                  value={props.values?.covid19_amount_hold}
                                  disabled
                                />
                              </Col>

                              <Col md={2}>
                                <Form.Label>Ld amount</Form.Label>
                                <Form.Control
                                  type="number"
                                  step="any"
                                  placeholder="ld amount"
                                  name={`invoiceData.ld_amount`}
                                  value={props.values?.ld_amount}
                                  disabled
                                />
                              </Col>

                              <Col md={2}>
                                <Form.Label>Hold amount</Form.Label>
                                <Form.Control
                                  type="number"
                                  step="any"
                                  placeholder="hold amount"
                                  name={`invoiceData.hold_amount`}
                                  value={props.values?.hold_amount}
                                  disabled
                                />
                              </Col>

                              <Col md={3}>
                                <Form.Label>other deduction</Form.Label>
                                <Form.Control
                                  type="number"
                                  step="any"
                                  placeholder="other deduction"
                                  name={`invoiceData.other_deduction`}
                                  value={props.values?.other_deduction}
                                  disabled
                                />
                              </Col>
                            </Row>
                            <hr></hr>
                            {/* <Col md={3} className="mt-2 ">
                              <Form.Label>Payment Amount</Form.Label>
                              <Form.Control
                                type="number"
                                step="any"
                                placeholder="payment amount"
                                name={`invoiceData.amount_received`}
                                value={props.values?.amount_received}
                                disabled
                              />

                              <ErrorMessage
                                name={`invoiceData.amount_received`}
                                component="small"
                                className="text-danger"
                              />
                            </Col> */}

                            {type == "update" && (
                              <div className=" my-2">
                                <span>Balance Amount : </span>
                                <span className="fw-bold">
                                  ₹
                                  {parseFloat(
                                    props.values?.gross_amount -
                                      total_deduction -
                                      +props.values?.received_amount || 0
                                  ).toFixed(2)}
                                </span>
                              </div>
                            )}
                            <Row>
                              <Col md={8}></Col>
                              <Col md={4}>
                                <span className="fw-bold">Net Amount :</span>₹
                                {parseFloat(props.values?.net_amount).toFixed(
                                  2
                                )}
                                <br />
                                <span className="fw-bold">Gst Amount : </span>₹
                                {parseFloat(props.values?.gst_amount).toFixed(
                                  2
                                )}{" "}
                                <br />{" "}
                                <span className="fw-bold">gross Amount : </span>{" "}
                                <span className="text-green fw-bold">
                                  ₹{" "}
                                  {parseFloat(
                                    props.values?.gross_amount
                                  ).toFixed(2)}
                                </span>{" "}
                                <br />
                                <span className="fw-bold">
                                  total deduction :{" "}
                                </span>
                                ₹{parseFloat(total_deduction).toFixed(2)} <hr />
                                <span className="fw-bold fs-6">
                                  Final Amount :{" "}
                                </span>{" "}
                                <span className="text-green fw-bold">
                                  ₹{" "}
                                  {parseFloat(
                                    props.values?.gross_amount - total_deduction
                                  ).toFixed(2)}
                                </span>{" "}
                                <br />
                                {type == "update" && (
                                  <>
                                    <span className="fw-bold ">
                                      paid Amount :{" "}
                                    </span>{" "}
                                    <span className="text-green fw-bold">
                                      ₹{" "}
                                      {parseFloat(
                                        props.values?.received_amount || 0
                                      ).toFixed(2)}
                                    </span>{" "}
                                  </>
                                )}
                                <br />
                              </Col>
                            </Row>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </Form>
                </React.Fragment>

                <Form.Group as={Col} md={12}>
                  <div className="mt-4 text-center">
                    <button
                      type="submit"
                      onClick={() => props.handleSubmit()}
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
                        <>{"payment update"}</>
                      )}
                    </button>
                    <br />

                    <ConfirmAlert
                      size={"sm"}
                      deleteFunction={props.handleSubmit}
                      hide={setShowAlert}
                      show={showAlert}
                      title={"Confirm UPDATE"}
                      description={"Are you sure you want to update this!!"}
                    />
                  </div>
                </Form.Group>
              </>
            );
          }}
        </Formik>
      </CardComponent>
    </>
  );
};

export default CreateRetentionMoney;
