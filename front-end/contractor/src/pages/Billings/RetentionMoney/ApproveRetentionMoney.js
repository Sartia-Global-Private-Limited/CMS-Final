import React, { useState } from "react";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import CardComponent from "../../../components/CardComponent";
import { useLocation, useNavigate } from "react-router-dom";
import { approveRetentionAmount } from "../../../services/contractorApi";
import { ErrorMessage, Formik } from "formik";
import ConfirmAlert from "../../../components/ConfirmAlert";
import { toast } from "react-toastify";
import { paymentSchema } from "../../../utils/formSchema";

const ApproveRetentionMoney = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const invoices_id = location.state?.ids;
  const [allInvoices, setAllInvoices] = useState({});
  const [showAlert, setShowAlert] = useState(false);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      payment_reference_number: values.payment_reference_number,
      amount: values.amount,
      date: values.date,
      ids: invoices_id,
    };
    // return console.log("sData1", sData);
    const res = await approveRetentionAmount(sData);

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

  return (
    <>
      <CardComponent title={` Approve retention money`} showBackButton={true}>
        <Formik
          initialValues={
            allInvoices || {
              bill_number: "",
              receipt_date: "",
            }
          }
          enableReinitialize={true}
          onSubmit={handleSubmit}
          //   validationSchema={paymentSchema}
        >
          {(props) => {
            return (
              <>
                <Row className="row-cols-md-5 sticky-top bg-blue shadow g-4 mt-1 pb-3">
                  <Col md={3}>
                    <Form.Label>Payment reference number</Form.Label>
                    <Form.Control
                      type="text"
                      onChange={(e) => {
                        props.setFieldValue(
                          `payment_reference_number`,
                          e.target.value
                        );
                      }}
                      placeholder="enter reference  number"
                    />

                    <ErrorMessage
                      name={`pv_number`}
                      component="small"
                      className="text-danger"
                    />
                  </Col>
                  <Col md={2}>
                    <Form.Label> payment Date</Form.Label>
                    <Form.Control
                      type="date"
                      onChange={(e) => {
                        props.setFieldValue(`date`, e.target.value);
                      }}
                    />

                    <ErrorMessage
                      name={`receipt_date`}
                      component="small"
                      className="text-danger"
                    />
                  </Col>
                  <Col md={2}>
                    <Form.Label> payment Amount </Form.Label>
                    <Form.Control
                      type="number"
                      step="any"
                      onChange={(e) => {
                        props.setFieldValue(`amount`, e.target.value);
                      }}
                      placeholder="enter payment amount"
                    />
                  </Col>
                </Row>

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
                        <>{"payment retention"}</>
                      )}
                    </button>
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

export default ApproveRetentionMoney;
