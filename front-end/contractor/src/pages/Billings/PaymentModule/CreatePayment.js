import React, { useEffect, useState } from "react";
import { Card, Col, Form, Row, Spinner } from "react-bootstrap";
import CardComponent from "../../../components/CardComponent";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getAllInvoicesData,
  getInvoicesDetails,
  postPaymentRecieved,
  updatePaymentRecieved,
} from "../../../services/contractorApi";
import { ErrorMessage, Formik } from "formik";
import ConfirmAlert from "../../../components/ConfirmAlert";
import { toast } from "react-toastify";
import { paymentSchema } from "../../../utils/formSchema";
import MyInput from "../../../components/MyInput";

const CreatePayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const invoices_id = location.state?.selectedInvoices;
  const type = location.state?.type;
  const [allInvoices, setAllInvoices] = useState({});
  const [showAlert, setShowAlert] = useState(false);

  let FullFinalAmount = 0;
  let allDeductions = 0;

  const fetchInvoicesData = async () => {
    const id = invoices_id?.join(",");
    const res =
      type == "update"
        ? await getInvoicesDetails(id)
        : await getAllInvoicesData(id);

    const pvNumber = res.data?.map((data) => data.payment_voucher_number);
    const receiptDate = res.data?.map((data) => data.voucher_date);
    const pvAmount = res.data?.map((data) => data.pv_amount);
    if (res.status) {
      const result = {
        pv_number: pvNumber[0],
        receipt_date: receiptDate[0],
        pv_amount: pvAmount[0],
        invoiceData: res.data.map((data) => {
          return {
            ...data,
            amount_received: 0,
            tds: data.tds || 2,
            tds_amount:
              data.tds_amount || ((data.net_amount * 2) / 100).toFixed(2),
            tds_on_gst: data.tds_on_gst || 2,
            tds_on_gst_amount:
              data.tds_on_gst_amount ||
              ((data.net_amount * 2) / 100).toFixed(2),
            retention: data.retention || 10,
            retention_amount:
              data.retention_amount ||
              ((data.net_amount * 10) / 100).toFixed(2),
          };
        }),
      };

      setAllInvoices(result);
    } else {
      setAllInvoices({});
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = values.invoiceData.map((data) => {
      return {
        receipt_date: values?.receipt_date,
        pv_amount: values?.pv_amount,
        invoice_number: data.invoice_number,
        invoice_date: data?.created_at,
        invoice_id: data?.id,
        net_amount: data?.net_amount || 0,
        gst_amount: data?.gst_amount || 0,
        gross_amount: data.gross_amount || 0,
        igst: "0",
        sgst: "0",
        cgst: "0",
        received_gst: data?.received_gst || 0,
        retention: data?.retention || 0,
        retention_amount: data?.retention_amount || 0,
        tds: data?.tds || 0,
        tds_amount: data?.tds_amount || 0,
        tds_on_gst: data?.tds_on_gst || 0,
        tds_on_gst_amount: data?.tds_on_gst_amount || 0,
        pv_number: values?.pv_number,
        ld_amount: data?.ld_amount || 0,
        other_deduction: data?.other_deduction || 0,
        hold_amount: data?.hold_amount || 0,
        covid19_amount_hold: data?.covid19_amount_hold || 0,
        amount_received: data?.amount_received || 0,
      };
    });

    if (type == "update") {
      sData[0].id = values.invoiceData[0]?.id;
    }

    // return console.log("sData", sData);
    const res =
      type == "update"
        ? await updatePaymentRecieved(sData)
        : await postPaymentRecieved(sData);
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
      <Col md={12}>
        <CardComponent
          title={` ${type == "update" ? "update" : "create"} Payments`}
          showBackButton={true}
        >
          <Formik
            initialValues={
              allInvoices || {
                pv_number: "",
                receipt_date: "",
              }
            }
            enableReinitialize={true}
            onSubmit={handleSubmit}
            validationSchema={paymentSchema}
          >
            {(props) => {
              const allTdsAmount = props.values?.invoiceData?.reduce(
                (total, item) => total + +item.tds_amount,
                0
              );

              const allTdsOnGStAmount = props.values?.invoiceData?.reduce(
                (total, item) => total + +item.tds_on_gst_amount,
                0
              );

              const allRetentionAmount = props.values?.invoiceData?.reduce(
                (total, item) => total + +item.retention_amount,
                0
              );

              const allCovid19Amount = props.values?.invoiceData?.reduce(
                (total, item) => total + (+item.covid19_amount_hold || 0),
                0
              );

              const allLdAmount = props.values?.invoiceData?.reduce(
                (total, item) => total + (+item.ld_amount || 0),
                0
              );

              const allHoldAmount = props.values?.invoiceData?.reduce(
                (total, item) => total + (+item.hold_amount || 0),
                0
              );

              const allOtherDeductionAmount = props.values?.invoiceData?.reduce(
                (total, item) => total + (+item.other_deduction || 0),
                0
              );

              const finalDeduction =
                allTdsAmount +
                allTdsOnGStAmount +
                allRetentionAmount +
                allCovid19Amount +
                allLdAmount +
                allHoldAmount +
                allOtherDeductionAmount;

              FullFinalAmount =
                props.values?.invoiceData?.reduce(
                  (total, item) => total + +item?.gross_amount,
                  0
                ) - +finalDeduction;

              const total_paid_amount = props.values?.invoiceData?.reduce(
                (total, item) => total + +item?.amount_received,
                0
              );

              return (
                <>
                  <Row className="row-cols-md-5 sticky-top bg-blue shadow g-4 mt-1 pb-3">
                    <Col md={3}>
                      <MyInput
                        isRequired
                        formikProps={props}
                        name="pv_number"
                        label={"Payment Voucher number"}
                      />
                      {/* type="text"
                        // value={props.values[0]?.pv_number}
                        onChange={(e) => {
                          props.setFieldValue(`pv_number`, e.target.value);
                        }}
                        placeholder="enter voucher number"
                      /> */}
                    </Col>
                    <Col md={2}>
                      <MyInput
                        type="date"
                        formikProps={props}
                        name="receipt_date"
                        label={"voucher Date"}
                      />
                      {/* <Form.Control
                        type="date"
                        value={props.values[0]?.receipt_date}
                        onChange={(e) => {
                          props.setFieldValue(`receipt_date`, e.target.value);
                        }}
                      /> */}
                    </Col>
                    <Col md={2}>
                      <MyInput
                        type="number"
                        formikProps={props}
                        name="pv_amount"
                        label={"voucher Amount"}
                      />
                      {/* <Form.Control
                        type="number"
                        value={props.values[0]?.pv_amount}
                        required={true}
                        onChange={(e) => {
                          props.setFieldValue(`pv_amount`, e.target.value);
                        }}
                        placeholder="enter payment amount"
                      /> */}
                    </Col>
                    <Col md={4}>
                      <span className="fw-bold fs-6">
                        total bill amount :{" "}
                        <span className="text-green">
                          ₹{FullFinalAmount.toFixed(2)}
                        </span>
                      </span>

                      <br />

                      <span className="fw-bold fs-6">
                        total pay amount :{" "}
                        <span className="text-green">
                          ₹{parseFloat(total_paid_amount).toFixed(2)}
                        </span>
                      </span>
                      <br />

                      <span>
                        difference : ₹
                        <span className={`text-danger`}>
                          {" "}
                          {(
                            (props.values?.pv_amount || 0) - total_paid_amount
                          ).toFixed(2)}
                        </span>
                      </span>
                    </Col>
                  </Row>

                  {allInvoices?.invoiceData?.map((invoice, index) => {
                    const net_amount = parseFloat(invoice.net_amount).toFixed(
                      2
                    );

                    const total_deduction =
                      (+props.values.invoiceData?.[index]?.tds_amount || 0) +
                      (+props.values.invoiceData?.[index]?.tds_on_gst_amount ||
                        0) +
                      (+props.values.invoiceData?.[index]?.retention_amount ||
                        0) +
                      (+props.values.invoiceData?.[index]
                        ?.covid19_amount_hold || 0) +
                      (+props.values.invoiceData?.[index]?.ld_amount || 0) +
                      (+props.values.invoiceData?.[index]?.hold_amount || 0) +
                      (+props.values.invoiceData?.[index]?.other_deduction ||
                        0);

                    allDeductions = +allDeductions + +total_deduction;

                    return (
                      <React.Fragment key={index}>
                        <Form onSubmit={props?.handleSubmit}>
                          <Row className="g-4  my-3 shadow">
                            <Col md={12}>
                              <Card className="card-bg">
                                <Card.Body>
                                  <div className="mb-4 ">
                                    <span className="fw-bold">
                                      Bill Number :
                                    </span>{" "}
                                    {invoice.invoice_number} <br />
                                    <span className="fw-bold">
                                      Bill Date :{" "}
                                    </span>{" "}
                                    {type == "update"
                                      ? invoice.invoice_date
                                      : invoice.created_at}{" "}
                                    <br />
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
                                        name={`invoiceData.[${index}].tds`}
                                        value={
                                          props.values.invoiceData?.[index]?.tds
                                        }
                                        onChange={(e) => {
                                          props.setFieldValue(
                                            `invoiceData.[${index}].tds`,
                                            e.target.value
                                          );

                                          const tds_amount = (
                                            (net_amount * e.target.value) /
                                            100
                                          ).toFixed(2);

                                          props.setFieldValue(
                                            `invoiceData.[${index}].tds_amount`,
                                            tds_amount
                                          );
                                        }}
                                      />
                                    </Col>

                                    <Col md={2}>
                                      <Form.Label>Tds amount</Form.Label>
                                      <Form.Control
                                        type="number"
                                        step="any"
                                        placeholder="enter amount"
                                        name={`invoiceData.[${index}].tds_amount`}
                                        value={
                                          props.values.invoiceData?.[index]
                                            ?.tds_amount
                                        }
                                        onChange={(e) => {
                                          props.setFieldValue(
                                            `invoiceData.[${index}].tds_amount`,
                                            e.target.value
                                          );
                                          const tds = (
                                            (e.target.value * 100) /
                                            net_amount
                                          ).toFixed(2);
                                          props.setFieldValue(
                                            `invoiceData.[${index}].tds`,
                                            tds
                                          );
                                        }}
                                      />
                                    </Col>

                                    <Col md={2}>
                                      <Form.Label>TDS % on gst</Form.Label>
                                      <Form.Control
                                        type="number"
                                        step="any"
                                        placeholder=" enter tds %"
                                        name={`invoiceData.[${index}].tds_on_gst`}
                                        value={
                                          props.values.invoiceData?.[index]
                                            ?.tds_on_gst
                                        }
                                        onChange={(e) => {
                                          props.setFieldValue(
                                            `invoiceData.[${index}].tds_on_gst`,
                                            e.target.value
                                          );

                                          const tds_on_gst_amount = (
                                            (net_amount * e.target.value) /
                                            100
                                          ).toFixed(2);

                                          props.setFieldValue(
                                            `invoiceData.[${index}].tds_on_gst_amount`,
                                            tds_on_gst_amount
                                          );
                                        }}
                                      />
                                    </Col>

                                    <Col md={2}>
                                      <Form.Label>Tds Gst amount </Form.Label>
                                      <Form.Control
                                        type="number"
                                        step="any"
                                        placeholder="enter amount"
                                        name={`invoiceData.[${index}].tds_on_gst_amount`}
                                        value={
                                          props.values.invoiceData?.[index]
                                            ?.tds_on_gst_amount
                                        }
                                        onChange={(e) => {
                                          props.setFieldValue(
                                            `invoiceData.[${index}].tds_on_gst_amount`,
                                            e.target.value
                                          );
                                          const tds_gst_percent = (
                                            (e.target.value * 100) /
                                            net_amount
                                          ).toFixed(2);
                                          props.setFieldValue(
                                            `invoiceData.[${index}].tds_on_gst`,
                                            tds_gst_percent
                                          );
                                        }}
                                      />
                                    </Col>

                                    <Col md={2}>
                                      <Form.Label>retention %</Form.Label>
                                      <Form.Control
                                        type="number"
                                        step="any"
                                        placeholder="enter %"
                                        name={`invoiceData.[${index}].retention`}
                                        value={
                                          props.values.invoiceData?.[index]
                                            ?.retention
                                        }
                                        onChange={(e) => {
                                          props.setFieldValue(
                                            `invoiceData.[${index}].retention`,
                                            e.target.value
                                          );

                                          const retention_amount = (
                                            (net_amount * e.target.value) /
                                            100
                                          ).toFixed(2);

                                          props.setFieldValue(
                                            `invoiceData.[${index}].retention_amount`,
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
                                        name={`invoiceData.[${index}].retention_amount`}
                                        value={
                                          props.values.invoiceData?.[index]
                                            ?.retention_amount
                                        }
                                        onChange={(e) => {
                                          props.setFieldValue(
                                            `invoiceData.[${index}].retention_amount`,
                                            e.target.value
                                          );
                                          const retention = (
                                            (e.target.value * 100) /
                                            net_amount
                                          ).toFixed(2);
                                          props.setFieldValue(
                                            `invoiceData.[${index}].retention`,
                                            retention
                                          );
                                        }}
                                      />
                                    </Col>

                                    <Col md={2}>
                                      <Form.Label>covid 19 Amount</Form.Label>
                                      <Form.Control
                                        type="number"
                                        step="any"
                                        placeholder="enter amount"
                                        name={`invoiceData.[${index}].covid19_amount_hold`}
                                        value={
                                          props.values.invoiceData?.[index]
                                            ?.covid19_amount_hold
                                        }
                                        onChange={(e) => {
                                          props.setFieldValue(
                                            `invoiceData.[${index}].covid19_amount_hold`,
                                            e.target.value
                                          );
                                        }}
                                      />
                                    </Col>

                                    <Col md={2}>
                                      <Form.Label>Ld amount</Form.Label>
                                      <Form.Control
                                        type="number"
                                        step="any"
                                        placeholder="ld amount"
                                        name={`invoiceData.[${index}].ld_amount`}
                                        value={
                                          props.values.invoiceData?.[index]
                                            ?.ld_amount
                                        }
                                        onChange={(e) => {
                                          props.setFieldValue(
                                            `invoiceData.[${index}].ld_amount`,
                                            e.target.value
                                          );
                                        }}
                                      />
                                    </Col>

                                    <Col md={2}>
                                      <Form.Label>Hold amount</Form.Label>
                                      <Form.Control
                                        type="number"
                                        step="any"
                                        placeholder="hold amount"
                                        name={`invoiceData.[${index}].hold_amount`}
                                        value={
                                          props.values.invoiceData?.[index]
                                            ?.hold_amount
                                        }
                                        onChange={(e) => {
                                          props.setFieldValue(
                                            `invoiceData.[${index}].hold_amount`,
                                            e.target.value
                                          );
                                        }}
                                      />
                                    </Col>

                                    <Col md={3}>
                                      <Form.Label>other deduction</Form.Label>
                                      <Form.Control
                                        type="number"
                                        step="any"
                                        placeholder="other deduction"
                                        name={`invoiceData.[${index}].other_deduction`}
                                        value={
                                          props.values.invoiceData?.[index]
                                            ?.other_deduction
                                        }
                                        onChange={(e) => {
                                          props.setFieldValue(
                                            `invoiceData.[${index}].other_deduction`,
                                            e.target.value
                                          );
                                        }}
                                      />
                                    </Col>
                                  </Row>
                                  <hr></hr>
                                  <Col md={3} className="mt-2 ">
                                    <Form.Label>Payment Amount</Form.Label>
                                    <Form.Control
                                      type="number"
                                      step="any"
                                      placeholder="payment amount"
                                      name={`invoiceData.[${index}].amount_received`}
                                      value={
                                        props.values.invoiceData?.[index]
                                          ?.amount_received
                                      }
                                      onChange={(e) => {
                                        if (type == "update") {
                                          const max_amount = parseFloat(
                                            invoice.gross_amount -
                                              total_deduction -
                                              +props.values.invoiceData?.[index]
                                                ?.received_amount || 0
                                          ).toFixed(2);

                                          if (+e.target.value <= max_amount) {
                                            props.setFieldValue(
                                              `invoiceData.[${index}].amount_received`,
                                              e.target.value
                                            );
                                          } else {
                                            props.setFieldValue(
                                              `invoiceData.[${index}].amount_received`,
                                              max_amount
                                            );
                                          }
                                        } else {
                                          const final_amount = parseFloat(
                                            invoice.gross_amount -
                                              total_deduction
                                          ).toFixed(2);

                                          if (+e.target.value <= final_amount) {
                                            props.setFieldValue(
                                              `invoiceData.[${index}].amount_received`,
                                              e.target.value
                                            );
                                          } else {
                                            props.setFieldValue(
                                              `invoiceData.[${index}].amount_received`,
                                              final_amount
                                            );
                                          }
                                        }
                                      }}
                                    />

                                    <ErrorMessage
                                      name={`invoiceData.[${index}].amount_received`}
                                      component="small"
                                      className="text-danger"
                                    />
                                  </Col>

                                  {type == "update" && (
                                    <div className=" my-2">
                                      <span>Balance Amount : </span>
                                      <span className="fw-bold">
                                        ₹
                                        {parseFloat(
                                          invoice.gross_amount.toFixed(2) -
                                            total_deduction -
                                            +props.values.invoiceData?.[index]
                                              ?.received_amount || 0
                                        ).toFixed(2)}
                                      </span>
                                    </div>
                                  )}
                                  <Row>
                                    <Col md={8}></Col>
                                    <Col md={4}>
                                      <span className="fw-bold">
                                        Net Amount :
                                      </span>
                                      ₹
                                      {parseFloat(invoice.net_amount).toFixed(
                                        2
                                      )}
                                      <br />
                                      <span className="fw-bold">
                                        Gst Amount :{" "}
                                      </span>
                                      ₹
                                      {parseFloat(invoice.gst_amount).toFixed(
                                        2
                                      )}{" "}
                                      <br />{" "}
                                      <span className="fw-bold">
                                        gross Amount :{" "}
                                      </span>{" "}
                                      <span className="text-green fw-bold">
                                        ₹{" "}
                                        {parseFloat(
                                          invoice.gross_amount
                                        ).toFixed(2)}
                                      </span>{" "}
                                      <br />
                                      <span className="fw-bold">
                                        total deduction :{" "}
                                      </span>
                                      ₹{parseFloat(total_deduction).toFixed(2)}{" "}
                                      <hr />
                                      <span className="fw-bold fs-6">
                                        Final Amount :{" "}
                                      </span>{" "}
                                      <span className="text-green fw-bold">
                                        ₹{" "}
                                        {parseFloat(
                                          invoice.gross_amount - total_deduction
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
                                              invoice.received_amount || 0
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
                    );
                  })}

                  <Form.Group as={Col} md={12}>
                    <div className="mt-4 text-center">
                      <button
                        type="submit"
                        onClick={() => props.handleSubmit()}
                        className={`shadow border-0 px-4 py-1 purple-combo cursor-pointer`}
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
      </Col>
    </>
  );
};

export default CreatePayment;
