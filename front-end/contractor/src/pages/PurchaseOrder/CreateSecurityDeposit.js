import React, { useEffect, useState } from "react";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { ErrorMessage, Formik } from "formik";
import Select from "react-select";
import TextareaAutosize from "react-textarea-autosize";
import { useNavigate, useParams } from "react-router-dom";
import CardComponent from "../../components/CardComponent";
import {
  getAllPoDetails,
  getSingleSecurityDepositById,
  postSecurityDeposit,
  updateSecurityDeposit,
} from "../../services/contractorApi";
import { addSecurityDepositSchema } from "../../utils/formSchema";
import ConfirmAlert from "../../components/ConfirmAlert";
import { useTranslation } from "react-i18next";

const CreateSecurityDeposit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [edit, setEdit] = useState({});
  const [poData, setPoData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const { t } = useTranslation();

  const fetchSingleData = async () => {
    const res = await getSingleSecurityDepositById(id);
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit([]);
    }
  };

  const showPOApi = async () => {
    const res = await getAllPoDetails();
    if (res.status) {
      setPoData(res.data);
    } else {
      setPoData([]);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      date: values.date,
      po_id: values.po_id.value,
      amount: values.amount,
      method: values.method,
      security_deposit_status: values.security_deposit_status.value,
      payment_status: values.payment_status.value,
      details: values.details,
    };
    if (edit.id) {
      sData["id"] = edit.id;
    }
    // return console.log("values", sData);
    const res = edit?.id
      ? await updateSecurityDeposit(sData)
      : await postSecurityDeposit(sData);
    if (res.status) {
      toast.success(res.message);
      navigate(-1);
      resetForm();
    } else {
      toast.error(res.message);
    }
    setSubmitting(false);
  };

  useEffect(() => {
    if (id !== "new") {
      fetchSingleData();
    }
    showPOApi();
  }, []);

  return (
    <>
      <Helmet>
        <title>
          {edit?.id ? "Update" : "Create"} Security Deposit · CMS Electricals
        </title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent
          title={`${edit?.id ? t("UPDATE") : t("Create")} ${t(
            "Security Deposit"
          )}`}
        >
          <Formik
            enableReinitialize={true}
            initialValues={{
              date: edit?.date || "",
              po_id: edit.po_id
                ? {
                    label: edit.po_number,
                    value: edit.po_id,
                  }
                : "",
              amount: edit?.amount || "",
              method: edit?.method || "",
              security_deposit_status: edit.security_deposit_status
                ? {
                    label: edit.security_deposit_status,
                    value: parseInt(edit.security_deposit_status_id),
                  }
                : "",
              payment_status: edit.payment_status
                ? {
                    label: edit.payment_status,
                    value: parseInt(edit.payment_status_id),
                  }
                : {
                    label: "Unpaid",
                    value: 3,
                  },
              details: edit?.details || "",
            }}
            validationSchema={addSecurityDepositSchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props?.handleSubmit}>
                <Row className="g-2">
                  <Form.Group as={Col} md={6}>
                    <Form.Label>
                      {t("Date")}: <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="date"
                      name={"date"}
                      value={props.values.date}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      isInvalid={Boolean(
                        props.touched.date && props.errors.date
                      )}
                    />
                    <Form.Control.Feedback type="invalid">
                      {props.errors.date}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md={6}>
                    <Form.Label>
                      {t("PO Number")}: <span className="text-danger">*</span>
                    </Form.Label>
                    <Select
                      menuPortalTarget={document.body}
                      name={"po_id"}
                      value={props.values.po_id}
                      options={poData?.map((itm) => ({
                        label: itm.po_number,
                        value: itm.id,
                      }))}
                      onChange={(selectedOption) => {
                        props.setFieldValue("po_id", selectedOption);
                      }}
                    />
                    <ErrorMessage
                      name="po_id"
                      component="small"
                      className="text-danger"
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={6}>
                    <Form.Label>
                      {t("Amount")}: <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="number"
                      name={"amount"}
                      value={props.values.amount}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      isInvalid={Boolean(
                        props.touched.amount && props.errors.amount
                      )}
                    />
                    <Form.Control.Feedback type="invalid">
                      {props.errors.amount}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md={6}>
                    <Form.Label>
                      {t("method")}: <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name={"method"}
                      value={props.values.method}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      isInvalid={Boolean(
                        props.touched.method && props.errors.method
                      )}
                    />
                    <ErrorMessage
                      name="method"
                      component="small"
                      className="text-danger"
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={6}>
                    <Form.Label>
                      {t("security deposit status")}:
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <Select
                      menuPortalTarget={document.body}
                      name={"security_deposit_status"}
                      value={props.values.security_deposit_status}
                      options={[
                        { label: "Partially Received", value: 1 },
                        { label: "Transit", value: 2 },
                        { label: "Received", value: 3 },
                      ]}
                      onChange={(selectedOption) => {
                        props.setFieldValue(
                          "security_deposit_status",
                          selectedOption
                        );
                      }}
                    />
                    <ErrorMessage
                      name="security_deposit_status"
                      component="small"
                      className="text-danger"
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={6}>
                    <Form.Label>{t("payment status")}:</Form.Label>
                    <Select
                      menuPortalTarget={document.body}
                      name={"payment_status"}
                      value={props.values.payment_status}
                      options={[
                        { label: "Pending", value: 1 },
                        { label: "Paid", value: 2 },
                        { label: "Unpaid", value: 3 },
                      ]}
                      onChange={(selectedOption) => {
                        props.setFieldValue("payment_status", selectedOption);
                      }}
                    />
                    <ErrorMessage
                      name="payment_status"
                      component="small"
                      className="text-danger"
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={12}>
                    <Form.Label>{t("Details")}:</Form.Label>
                    <TextareaAutosize
                      className="edit-textarea"
                      name="details"
                      value={props.values.details}
                      onChange={props.handleChange}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={12}>
                    <div className="mt-4 text-center">
                      <button
                        type={`${edit?.id ? "button" : "submit"}`}
                        onClick={() => setShowAlert(edit?.id && true)}
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
                          <>{edit?.id ? t("UPDATE") : t("CREATE")}</>
                        )}
                      </button>
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
                </Row>
              </Form>
            )}
          </Formik>
        </CardComponent>
      </Col>
    </>
  );
};

export default CreateSecurityDeposit;
