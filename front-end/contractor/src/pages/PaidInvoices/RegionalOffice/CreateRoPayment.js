import React from "react";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { ErrorMessage, Formik } from "formik";
import { toast } from "react-toastify";
import Select from "react-select";
import CardComponent from "../../components/CardComponent";
import { PostPaymentForRo } from "../../services/contractorApi";
import { PayROAmount } from "../../utils/formSchema";

const CreateRoPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const paid_amount = location.state?.paid_amount;
  const po_id = location.state?.po_id;
  const ro_id = location.state?.ro_id;
  const id = location.state?.id;

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      amount_received: paid_amount,
      payment_mode: values.payment_mode.value,
      transaction_id: values.transaction_id,
      remark: values.remark,
      ro_id,
      po_id,
      id,
    };

    // return console.log(res.data, "response ");
    const res = await PostPaymentForRo(sData);

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
      <CardComponent
        title={"create regional office payment"}
        showBackButton={true}
      >
        <Formik
          initialValues={{
            amount_received: paid_amount,
            payment_mode: "",
            transaction_id: "",
            remark: "",
          }}
          enableReinitialize={true}
          onSubmit={handleSubmit}
          validationSchema={PayROAmount}
        >
          {(props) => {
            return (
              <>
                <div className="shadow p-3">
                  <Row>
                    <Form.Group as={Col} md={3}>
                      <Form.Label className="fw-bolder">
                        Amount Recieved <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="number"
                        name="amount_received"
                        placeholder={paid_amount}
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
                        payment mode <span className="text-danger">*</span>
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
                        Transaction Id<span className="text-danger">*</span>
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
                        Remark<span className="text-danger">*</span>
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
                        <>{"submit"}</>
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

export default CreateRoPayment;
