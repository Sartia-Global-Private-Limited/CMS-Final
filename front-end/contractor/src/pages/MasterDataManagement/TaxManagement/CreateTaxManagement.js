import React, { useEffect, useState } from "react";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { Formik } from "formik";
import ConfirmAlert from "../../../components/ConfirmAlert";
import { useNavigate, useParams } from "react-router-dom";
import CardComponent from "../../../components/CardComponent";
import { addTaxManagementSchema } from "../../../utils/formSchema";
import {
  getSingleTaxManagementById,
  postTaxManagement,
  updateTaxManagement,
} from "../../../services/contractorApi";
import { useTranslation } from "react-i18next";

const CreateTaxManagement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [edit, setEdit] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const { t } = useTranslation();

  const fetchSingleData = async () => {
    const res = await getSingleTaxManagementById(id);
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit([]);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      title: values.title,
      percentage: values.percentage,
    };

    if (edit.id) {
      sData["id"] = edit.id;
    }
    // return console.log("sData", sData);
    const res = edit.id
      ? await updateTaxManagement(sData)
      : await postTaxManagement(sData);
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
        <title>Create Tax Management · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent
          title={`${edit?.id ? t("UPDATE") : t("Create")} ${t(
            "Tax Management"
          )}`}
        >
          <Formik
            enableReinitialize={true}
            initialValues={{
              title: edit.title || "",
              percentage: edit.percentage || "",
            }}
            validationSchema={addTaxManagementSchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props?.handleSubmit}>
                <Row className="g-2">
                  <Form.Group as={Col} md={6}>
                    <Form.Label>
                      {t("Gst Title")} <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name={"title"}
                      value={props.values.title}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      isInvalid={Boolean(
                        props.touched.title && props.errors.title
                      )}
                    />
                    <Form.Control.Feedback type="invalid">
                      {props.errors.title}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md={6}>
                    <Form.Label>
                      {t("Gst")} <span className="text-gray small">(%)</span>{" "}
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="number"
                      step="any"
                      name={"percentage"}
                      value={props.values.percentage}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      isInvalid={Boolean(
                        props.touched.percentage && props.errors.percentage
                      )}
                    />
                    <Form.Control.Feedback type="invalid">
                      {props.errors.percentage}
                    </Form.Control.Feedback>
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
                            />{" "}
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

export default CreateTaxManagement;
