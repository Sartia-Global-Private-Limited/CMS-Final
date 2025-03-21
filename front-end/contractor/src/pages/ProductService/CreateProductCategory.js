import React, { useEffect } from "react";
import { useState } from "react";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import CardComponent from "../../components/CardComponent";
import { Formik } from "formik";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import Select from "react-select";
import ConfirmAlert from "../../components/ConfirmAlert";
import { addCategoryNameSchema } from "../../utils/formSchema";
import {
  getSingleProductCategoryById,
  postProductCategory,
  updateProductCategory,
} from "../../services/contractorApi";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CreateProductCategory = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [edit, setEdit] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const fetchCategoryData = async () => {
    const res = await getSingleProductCategoryById(id);
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit([]);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      category_name: values.category_name,
      status: JSON.stringify(values.status.value),
    };

    if (edit.id) {
      sData["id"] = edit.id;
    }
    const res = edit.id
      ? await updateProductCategory(sData)
      : await postProductCategory(sData);

    if (res.status) {
      navigate(-1);
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    resetForm();
    setSubmitting(false);
  };

  useEffect(() => {
    if (id !== "new") {
      fetchCategoryData();
    }
  }, [id]);

  return (
    <>
      <Helmet>
        {edit?.id ? "Update" : "Create"} Category · CMS Electricals
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CardComponent title={`${edit?.id ? "Update" : "Create"} Category`}>
          <Formik
            enableReinitialize={true}
            initialValues={{
              category_name: edit.category_name || "",
              status: edit.status
                ? {
                    label: edit.status === "1" ? "Active" : "Inactive",
                    value: parseInt(edit.status),
                  }
                : { label: "Active", value: 1 },
            }}
            validationSchema={addCategoryNameSchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props?.handleSubmit}>
                <Row className="g-2">
                  <Form.Group md="12">
                    <Form.Label>
                      {t("Category Name")}{" "}
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name={"category_name"}
                      value={props.values.category_name}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      isInvalid={Boolean(
                        props.touched.category_name &&
                          props.errors.category_name
                      )}
                    />
                    <Form.Control.Feedback type="invalid">
                      {props.errors.category_name}
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
                            PLEASE WAIT...
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

export default CreateProductCategory;
