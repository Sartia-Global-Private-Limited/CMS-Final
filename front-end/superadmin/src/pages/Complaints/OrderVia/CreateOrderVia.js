import React, { useEffect, useState } from "react";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { Formik } from "formik";
import Select from "react-select";
import ConfirmAlert from "../../../components/ConfirmAlert";
import { useNavigate, useParams } from "react-router-dom";
import {
  getSingleOrderViaById,
  postOrderVia,
  updateOrderVia,
} from "../../../services/authapi";
import { addOrderViaSchema } from "../../../utils/formSchema";
import CardComponent from "../../../components/CardComponent";
import { useTranslation } from "react-i18next";

const CreateOrderVia = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [edit, setEdit] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const { t } = useTranslation();

  const fetchSingleData = async () => {
    const res = await getSingleOrderViaById(id);
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit([]);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      order_via: values.order_via,
      status: JSON.stringify(values.status.value),
    };

    if (edit.id) {
      sData["id"] = edit.id;
    }

    const res = edit.id
      ? await updateOrderVia(sData)
      : await postOrderVia(sData);
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
  }, []);

  return (
    <>
      <Helmet>
        <title>
          {edit?.id ? "update" : "Create"} Order Via · CMS Electricals
        </title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent
          title={`${edit?.id ? t("UPDATE") : t("Create")} ${t("Order Via")}`}
        >
          <Formik
            enableReinitialize={true}
            initialValues={{
              order_via: edit.order_via || "",
              status: edit.status
                ? {
                    label: edit.status === "1" ? "Active" : "InActive",
                    value: parseInt(edit.status),
                  }
                : { label: "Active", value: 1 },
            }}
            validationSchema={addOrderViaSchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props?.handleSubmit}>
                <Row className="g-2">
                  <Form.Group md="12">
                    <Form.Label>
                      {t("Order Via")} <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name={"order_via"}
                      value={props.values.order_via}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      isInvalid={Boolean(
                        props.touched.order_via && props.errors.order_via
                      )}
                    />
                    <Form.Control.Feedback type="invalid">
                      {props.errors.order_via}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group md="12">
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

export default CreateOrderVia;
