import React, { useEffect } from "react";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import Select from "react-select";
import { ErrorMessage, Formik } from "formik";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  getAllFinancialYears,
  postPiToMerge,
} from "../../services/contractorApi";
import { toast } from "react-toastify";
import { useState } from "react";
import { addPiToMergeSchema } from "../../utils/formSchema";
import CardComponent from "../../components/CardComponent";
import ConfirmAlert from "../../components/ConfirmAlert";
import { Helmet } from "react-helmet";
import { BsQuestionLg } from "react-icons/bs";

const PiToMerge = () => {
  const navigate = useNavigate();
  const stateData = useLocation();
  const piData = stateData?.state?.selectedItems;
  const poId = stateData?.state?.poId;
  const [allFinancialYear, setAllFinancialYear] = useState([]);
  const [showAlert, setShowAlert] = useState(false);

  const showFinancialYearApi = async () => {
    const res = await getAllFinancialYears();
    if (res.status) {
      setAllFinancialYear(res.data);
    } else {
      setAllFinancialYear([]);
    }
  };

  useEffect(() => {
    showFinancialYearApi();
  }, []);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      pi_ids: piData,
      po_id: poId,
      invoice_date: values.invoice_date,
      due_date: values.due_date,
      financial_year: values.financial_year.value,
      callup_number: values.callup_number,
    };
    // return console.log("values", sData);
    const res = await postPiToMerge(sData);
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
      <Helmet>
        <title>Pi to Merge · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CardComponent title={`Pi to Merge`}>
          <Formik
            enableReinitialize={true}
            initialValues={{
              invoice_date: "",
              due_date: "",
              financial_year: "",
              callup_number: "",
            }}
            validationSchema={addPiToMergeSchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props?.handleSubmit}>
                <Row className="g-3">
                  <Form.Group as={Col} md={6}>
                    <div className="shadow p-3">
                      <Form.Label className="fw-bolder">
                        invoice date <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="date"
                        name="invoice_date"
                        value={props.values.invoice_date}
                        onChange={(e) => {
                          props.setFieldValue("due_date", e.target.value);
                          props.setFieldValue("invoice_date", e.target.value);
                        }}
                        onBlur={props.handleBlur}
                        isInvalid={Boolean(
                          props.touched.invoice_date &&
                            props.errors.invoice_date
                        )}
                      />
                      <ErrorMessage
                        name="invoice_date"
                        component="small"
                        className="text-danger"
                      />
                    </div>
                  </Form.Group>
                  <Form.Group as={Col} md={6}>
                    <div className="shadow p-3">
                      <Form.Label className="fw-bolder">
                        due date <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="date"
                        name="due_date"
                        value={props.values.due_date}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        isInvalid={Boolean(
                          props.touched.due_date && props.errors.due_date
                        )}
                      />
                      <ErrorMessage
                        name="due_date"
                        component="small"
                        className="text-danger"
                      />
                    </div>
                  </Form.Group>

                  <Form.Group as={Col} md={12}>
                    <div className="shadow p-3">
                      <Row className="g-3 align-items-center">
                        <Form.Group as={Col} md={6}>
                          <Form.Label>
                            Financial Year{" "}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Select
                            menuPortalTarget={document.body}
                            name={"financial_year"}
                            value={props.values.financial_year}
                            options={allFinancialYear?.map((year) => ({
                              label: year.year_name,
                              value: year.year_name,
                            }))}
                            onChange={(selectedOption) => {
                              props.setFieldValue(
                                "financial_year",
                                selectedOption
                              );
                            }}
                          />
                          <ErrorMessage
                            name="financial_year"
                            component="small"
                            className="text-danger"
                          />
                        </Form.Group>
                        <Form.Group as={Col} md={6}>
                          <Form.Label>
                            Callup Number <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            maxLength={10}
                            placeholder="(123) 456-7890"
                            type="text"
                            name="callup_number"
                            value={props.values.callup_number}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            isInvalid={Boolean(
                              props.touched.callup_number &&
                                props.errors.callup_number
                            )}
                          />
                          <ErrorMessage
                            name="callup_number"
                            component="small"
                            className="text-danger"
                          />
                        </Form.Group>
                      </Row>
                    </div>
                  </Form.Group>

                  <Form.Group as={Col} md={12}>
                    <div className="mt-4 text-center">
                      <button
                        type={`button`}
                        onClick={() => setShowAlert(true)}
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
                          <>Merge</>
                        )}
                      </button>
                      <ConfirmAlert
                        size={"sm"}
                        defaultIcon={<BsQuestionLg />}
                        deleteFunction={props.handleSubmit}
                        hide={setShowAlert}
                        show={showAlert}
                        title={"Confirm Merge"}
                        description={"Are you sure you want to merge this!!"}
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

export default PiToMerge;
