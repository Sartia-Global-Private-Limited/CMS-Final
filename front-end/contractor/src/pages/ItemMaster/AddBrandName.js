import React, { useEffect, useTransition } from "react";
import { useState } from "react";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import CardComponent from "../../components/CardComponent";
import { Formik } from "formik";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import Select from "react-select";
import ConfirmAlert from "../../components/ConfirmAlert";
import { addBrandSchema } from "../../utils/formSchema";
import {
  getSingleBrandById,
  postBrand,
  updateBrand,
} from "../../services/contractorApi";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const AddBrandName = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [edit, setEdit] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const fetchBrandDataById = async () => {
    const res = await getSingleBrandById(id);
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit([]);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      brand_name: values.brand_name,
      status: values.status.value,
    };

    if (edit.id) {
      sData["id"] = edit.id;
    }

    // return console.log(sData, "sdata");
    const res = edit.id ? await updateBrand(sData) : await postBrand(sData);

    if (res.status) {
      navigate(-1);
      toast.success(res.message);
      resetForm();
    } else {
      toast.error(res.message);
    }
    setSubmitting(false);
  };

  useEffect(() => {
    if (id !== "new") {
      fetchBrandDataById();
    }
  }, [id]);

  return (
    <>
      <Helmet>
        {edit?.id ? "Update" : "Create"} Category · CMS Electricals
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CardComponent title={`${edit?.id ? "Update" : "Create"} Brand`}>
          <Formik
            enableReinitialize={true}
            initialValues={{
              brand_name: edit.brand_name || "",
              status: edit.status
                ? {
                    label: edit?.status == "1" ? "Active" : "InActive",
                    value: edit.status,
                  }
                : { label: "Active", value: "1" },
            }}
            validationSchema={addBrandSchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props?.handleSubmit}>
                <Row className="g-2">
                  <Form.Group md="12">
                    <Form.Label>
                      {t("Brand Name")} <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name={"brand_name"}
                      placeholder="--Enter Brand Name--"
                      value={props.values.brand_name}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      isInvalid={Boolean(
                        props.touched.brand_name && props.errors.brand_name
                      )}
                    />
                    <Form.Control.Feedback type="invalid">
                      {props.errors.brand_name}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group md="12">
                    <Form.Label>{t("Status")}</Form.Label>
                    <Select
                      menuPortalTarget={document.body}
                      name={"status"}
                      options={[
                        { label: "Active", value: "1" },
                        { label: "InActive", value: "0" },
                      ]}
                      value={props.values.status}
                      onChange={(selectedOption) => {
                        props.setFieldValue("status", selectedOption);
                      }}
                    />
                  </Form.Group>
                  <Form.Group md="12">
                    <div className="mt-4 text-center">
                      <button
                        type={`${edit.id ? "button" : "submit"}`}
                        onClick={() => setShowAlert(edit.id && true)}
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
                          <>{edit.id ? t("UPDATE") : t("CREATE")}</>
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

export default AddBrandName;
