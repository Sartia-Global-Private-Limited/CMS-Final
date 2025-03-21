import React, { useEffect, useState } from "react";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { Formik } from "formik";
import Select from "react-select";
import ConfirmAlert from "../../components/ConfirmAlert";
import { useNavigate, useParams } from "react-router-dom";
import CardComponent from "../../components/CardComponent";
import { addTaxesSchema } from "../../utils/formSchema";
import {
  getAllBillingType,
  getSingleTaxesById,
  postTaxes,
  updateTaxes,
} from "../../services/contractorApi";
import { useTranslation } from "react-i18next";

const CreateTaxes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [edit, setEdit] = useState({});
  const [allBilling, setAllBilling] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const { t } = useTranslation();

  const fetchSingleData = async () => {
    const res = await getSingleTaxesById(id);
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit([]);
    }
  };

  //   billing api
  const fetchBillingTypeData = async () => {
    const res = await getAllBillingType();
    if (res.status) {
      setAllBilling(res.data);
    } else {
      setAllBilling([]);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      billing_type_id: values.billing_type_id.value,
      name: values.name,
      value: values.value,
      status: JSON.stringify(values.status.value),
    };

    if (edit.id) {
      sData["id"] = edit.id;
    }
    // return console.log("sData", sData);
    const res = edit.id ? await updateTaxes(sData) : await postTaxes(sData);
    if (res.status) {
      toast.success(res.message);
      navigate(-1);
    } else {
      toast.error(res.message);
    }
    resetForm();
    setSubmitting(false);
  };

  useEffect(() => {
    if (id !== "new") {
      fetchSingleData();
    }
    fetchBillingTypeData();
  }, []);

  return (
    <>
      <Helmet>
        <title>
          {`${edit?.id ? t("UPDATE") : t("Create")} ${t("Taxes")}`} · CMS
          Electricals
        </title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent
          title={`${edit?.id ? t("UPDATE") : t("Create")} ${t("Taxes")}`}
        >
          <Formik
            enableReinitialize={true}
            initialValues={{
              billing_type_id: edit.billing_type_id
                ? {
                    label: edit.billing_name,
                    value: edit.billing_type_id,
                  }
                : "",
              name: edit.name || "",
              value: edit.value || "",
              status: edit.status
                ? {
                    label: edit.status === "1" ? "Active" : "Inactive",
                    value: parseInt(edit.status),
                  }
                : { label: "Active", value: 1 },
            }}
            validationSchema={addTaxesSchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props?.handleSubmit}>
                <Row className="g-2">
                  <Form.Group as={Col} md={12}>
                    <Form.Label>
                      {t("Name")}
                      <span className="text-gray small">({t("optional")})</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name={"name"}
                      value={props.values.name}
                      onChange={props.handleChange}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={12}>
                    <Form.Label>
                      {t("Billing Type")} <span className="text-danger">*</span>
                    </Form.Label>
                    <Select
                      className="text-primary mb-2 w-100"
                      placeholder="-- Select Company --"
                      menuPortalTarget={document.body}
                      name={"billing_type_id"}
                      value={props.values.billing_type_id}
                      options={allBilling?.map((data) => ({
                        label: data.name,
                        value: data.id,
                      }))}
                      onChange={(selectedOption) => {
                        props.setFieldValue("billing_type_id", selectedOption);
                      }}
                      onBlur={props.handleBlur}
                      isInvalid={Boolean(
                        props.touched.billing_type_id &&
                          props.errors.billing_type_id
                      )}
                    />
                    <small className="text-danger">
                      {props.errors.billing_type_id}
                    </small>
                  </Form.Group>
                  <Form.Group as={Col} md={6}>
                    <Form.Label>
                      {t("Value")} <span className="text-gray small">(%)</span>{" "}
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="number"
                      step="any"
                      name={"value"}
                      value={props.values.value}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      isInvalid={Boolean(
                        props.touched.value && props.errors.value
                      )}
                    />
                    <Form.Control.Feedback type="invalid">
                      {props.errors.value}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md={6}>
                    <Form.Label>{t("Status")}</Form.Label>
                    <Select
                      menuPortalTarget={document.body}
                      name={"status"}
                      options={[
                        { label: "Active", value: 1 },
                        { label: "Inactive", value: 0 },
                      ]}
                      value={props.values.status}
                      onChange={(selectedOption) => {
                        props.setFieldValue("status", selectedOption);
                      }}
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

export default CreateTaxes;
