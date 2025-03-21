import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import CardComponent from "../../../components/CardComponent";
import { Formik } from "formik";
import MyInput from "../../../components/MyInput";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmAlert from "../../../components/ConfirmAlert";
import {
  getAllUsers,
  getCreateLoans,
  getSingleLoanById,
  getUpdateLoans,
} from "../../../services/authapi";
import { addLoanSchema } from "../../../utils/formSchema";
import { FORMAT_OPTION_LABEL } from "../../../components/HelperStructure";
const CreateLoan = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [edit, setEdit] = useState(false);
  const [allUserData, setAllUserData] = useState([]);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams();

  const fetchAllUsersData = async () => {
    const res = await getAllUsers();
    if (res.status) {
      setAllUserData(res.data);
    } else {
      setAllUserData([]);
    }
  };

  const fetchSingleData = async () => {
    const res = await getSingleLoanById(id);
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit({});
    }
  };

  useEffect(() => {
    if (id !== "new") {
      fetchSingleData();
    }
    fetchAllUsersData();
  }, []);

  const calculateLoanPayment = (data) => {
    if (!data?.loan_amount || !data?.loan_term || !data?.interest_rate) {
      return "";
    }
    const totalWithInterest =
      data?.loan_amount * (1 + data?.interest_rate / 100);
    const periodicPayment = totalWithInterest / data?.loan_term;
    return periodicPayment?.toFixed(2);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    values["emi"] = calculateLoanPayment(values);

    if (edit.id) {
      values["id"] = edit.id;
    }
    // return console.log('values', values)
    const res = edit.id
      ? await getUpdateLoans(values)
      : await getCreateLoans(values);
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
      <Helmet>
        <title>
          {t(`${edit.id ? "Update" : "Create"} Loan`)} · CMS Electricals
        </title>
      </Helmet>
      <Col md={12} data-aos="fade-up" data-aos-delay={200}>
        <CardComponent title={`${edit.id ? t("Update") : t("Create")} Loan `}>
          <Formik
            enableReinitialize={true}
            initialValues={{
              user_id: edit.user_id || "",
              interest_mode: edit.interest_mode || "",
              payment_mode: edit.payment_mode || "",
              loan_amount: edit?.loan_amount || "",
              loan_type: edit?.loan_type || "",
              loan_term: edit?.loan_term || "",
              remarks: edit?.remarks || "",
              loan_date: edit?.loan_date || "",
              emi_start_from: edit?.emi_start_from || "",
              emi: edit?.emi || "",
              interest_rate: edit?.interest_rate || "",
              payment_date: edit?.payment_date || "",
              transaction_id: edit?.transaction_id || "",
              cheque_number: edit?.cheque_number || "",
              cheque_date: edit?.cheque_date || null,
              bank: edit?.bank || "",
              branch: edit?.branch || "",
            }}
            validationSchema={addLoanSchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props.handleSubmit}>
                <Row className="g-2">
                  <Col md={12} className="fw-bold mb-2">
                    {t("Loans Details")}
                  </Col>
                  <Col md={4}>
                    <MyInput
                      isRequired
                      name={"user_id"}
                      formikProps={props}
                      label={t("Select User")}
                      customType={"select"}
                      selectProps={{
                        data: allUserData?.map((user) => ({
                          label: user.name,
                          value: user.id,
                          employee_id: user.employee_id,
                          image: user.image
                            ? `${process.env.REACT_APP_API_URL}${user.image}`
                            : null,
                        })),
                      }}
                      formatOptionLabel={FORMAT_OPTION_LABEL}
                    />
                  </Col>
                  <Col md={4}>
                    <MyInput
                      isRequired
                      name={"loan_amount"}
                      formikProps={props}
                      label={t("loan amount")}
                      type="number"
                    />
                  </Col>
                  <Col md={4}>
                    <MyInput
                      isRequired
                      name={"loan_type"}
                      formikProps={props}
                      label={t("loan type")}
                      customType={"select"}
                      selectProps={{
                        data: [
                          { value: "Home Loan", label: "Home Loan" },
                          {
                            value: "Education Loan",
                            label: "Education Loan",
                          },
                          {
                            value: "Vehicle Loan",
                            label: "Vehicle Loan",
                          },
                          {
                            value: "Gold Loan",
                            label: "Gold Loan",
                          },
                        ],
                      }}
                    />
                  </Col>
                  <Col md={4}>
                    <MyInput
                      isRequired
                      name={"loan_term"}
                      formikProps={props}
                      label={
                        <>
                          {t("loan term")}{" "}
                          <small className="text-gray">({t("in month")})</small>
                        </>
                      }
                    />
                  </Col>
                  <Col md={4}>
                    <MyInput
                      name={"loan_date"}
                      formikProps={props}
                      label={t("loan date")}
                      type="date"
                    />
                  </Col>
                  <Col md={4}>
                    <MyInput
                      name={"emi_start_from"}
                      formikProps={props}
                      label={t("emi start from")}
                      type="date"
                    />
                  </Col>
                  <Col md={4}>
                    <MyInput
                      isRequired
                      name={"interest_mode"}
                      formikProps={props}
                      label={t("Interest Mode")}
                      customType={"select"}
                      selectProps={{
                        data: [
                          { value: "Fixed", label: "Fixed" },
                          {
                            value: "Simple Interest",
                            label: "Simple Interest",
                          },
                          {
                            value: "Accrued Interest",
                            label: "Accrued Interest",
                          },
                          {
                            value: "Compounding Interest",
                            label: "Compounding Interest",
                          },
                        ],
                      }}
                    />
                  </Col>
                  <Col md={4}>
                    <div className="d-flex gap-3">
                      <MyInput
                        name={"interest_rate"}
                        formikProps={props}
                        label={t("Interest Rate")}
                        type="number"
                      />
                      <MyInput
                        name="emi"
                        formikProps={props}
                        label={t("Emi")}
                        disabled
                        value={calculateLoanPayment(props.values)}
                      />
                    </div>
                  </Col>

                  <Col md={12} className="pt-4 mb-2 fw-bold">
                    {t("Payment Details")}
                  </Col>
                  <Col md={4}>
                    <MyInput
                      name={"payment_date"}
                      formikProps={props}
                      label={t("Payment Date")}
                      type="date"
                    />
                  </Col>
                  <Col md={4}>
                    <MyInput
                      isRequired
                      name={"payment_mode"}
                      formikProps={props}
                      label={t("Payment Mode")}
                      customType={"select"}
                      selectProps={{
                        data: [
                          { value: "Online", label: "Online" },
                          { value: "Wallet/Upi", label: "Wallet/Upi" },
                          {
                            value: "Cheque",
                            label: "Cheque",
                          },
                          {
                            value: "Card",
                            label: "Card",
                          },
                        ],
                        onChange: () => {
                          props.setFieldValue("cheque_number", "");
                          props.setFieldValue("cheque_date", null);
                          props.setFieldValue("transaction_id", "");
                        },
                      }}
                    />
                  </Col>
                  <Col md={4}>
                    {props.values.payment_mode == "Online" ||
                    props.values.payment_mode == "Wallet/Upi" ||
                    props.values.payment_mode == "Card" ? (
                      <MyInput
                        name={"transaction_id"}
                        formikProps={props}
                        label={t("Transaction Id")}
                      />
                    ) : (
                      <MyInput
                        name={"cheque_number"}
                        formikProps={props}
                        label={t("Cheque Number")}
                      />
                    )}
                  </Col>

                  {props.values.payment_mode == "Online" ||
                  props.values.payment_mode == "Card" ? null : (
                    <Col md={4}>
                      <MyInput
                        name={"cheque_date"}
                        formikProps={props}
                        label={t("Cheque Date")}
                        type="date"
                      />
                    </Col>
                  )}

                  <Col md={4}>
                    <MyInput
                      name={"bank"}
                      formikProps={props}
                      label={t("Bank")}
                    />
                  </Col>
                  <Col md={4}>
                    <MyInput
                      name={"branch"}
                      formikProps={props}
                      label={t("branch")}
                    />
                  </Col>
                  <Col md={12}>
                    <MyInput
                      isRequired
                      name={"remarks"}
                      formikProps={props}
                      label={t("remarks")}
                      customType={"multiline"}
                    />
                  </Col>
                  <Form.Group as={Col} md={12}>
                    <div className="mt-4 text-center">
                      <button
                        type={`${edit.id ? "button" : "submit"}`}
                        onClick={() => setShowAlert(edit.id)}
                        disabled={props.isSubmitting}
                        className="shadow border-0 purple-combo cursor-pointer px-4 py-1"
                      >
                        {props.isSubmitting ? (
                          <>
                            <Spinner
                              animation="border"
                              variant="primary"
                              size="sm"
                            />
                            {t("PLEASE WAIT")}...
                          </>
                        ) : (
                          <>{edit.id ? t("UPDATE") : t("CREATE")}</>
                        )}
                      </button>
                      <ConfirmAlert
                        size="sm"
                        deleteFunction={props.handleSubmit}
                        hide={setShowAlert}
                        show={showAlert}
                        title={t("Confirm UPDATE")}
                        description={t(
                          "Are you sure you want to update this!!"
                        )}
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

export default CreateLoan;
