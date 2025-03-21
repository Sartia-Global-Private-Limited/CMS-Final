import React, { useEffect, useState } from "react";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import { Helmet } from "react-helmet";
import CardComponent from "../../../components/CardComponent";
import { toast } from "react-toastify";
import { Formik } from "formik";
import { addBankDataSchema } from "../../../utils/formSchema";
import ConfirmAlert from "../../../components/ConfirmAlert";
import { useNavigate, useParams } from "react-router-dom";
import {
  getSingleBankListById,
  postBankList,
  updateBankList,
} from "../../../services/contractorApi";
import ImageViewer from "../../../components/ImageViewer";
import { useTranslation } from "react-i18next";

const CreateBankManagement = () => {
  const [edit, setEdit] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const { t } = useTranslation();

  const fetchDetailsData = async () => {
    const res = await getSingleBankListById(id);
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit([]);
    }
  };

  useEffect(() => {
    if (id !== "new") {
      fetchDetailsData();
    }
  }, []);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();
    formData.append("bank_name", values.bank_name);
    formData.append("website", values.website);
    formData.append("logo", values.logo);

    if (edit.id) {
      formData.append("id", edit.id);
    }
    // console.log('formData', formData)
    const res = edit.id
      ? await updateBankList(formData)
      : await postBankList(formData);
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
        <title>
          {edit?.id ? "Update" : "Create"} Bank Data · CMS Electricals
        </title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent
          title={`${edit?.id ? t("Update") : t("Create")} ${t("Bank Data")}`}
        >
          <Formik
            enableReinitialize={true}
            initialValues={{
              bank_name: edit?.bank_name || "",
              website: edit?.website || "",
              logo: edit?.logo || "",
            }}
            validationSchema={addBankDataSchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props?.handleSubmit}>
                <Row className="g-2">
                  <Form.Group as={Col} md={6}>
                    <Form.Label>
                      {t("Bank Name")} <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name={"bank_name"}
                      value={props.values.bank_name}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      isInvalid={Boolean(
                        props.touched.bank_name && props.errors.bank_name
                      )}
                    />
                    <Form.Control.Feedback type="invalid">
                      {props.errors.bank_name}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md={6}>
                    <Form.Label>
                      {t("Website")} <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="url"
                      name={"website"}
                      value={props.values.website}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      isInvalid={Boolean(
                        props.touched.website && props.errors.website
                      )}
                    />
                    <Form.Control.Feedback type="invalid">
                      {props.errors.website}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md={6}>
                    <Form.Label>{t("Logo")}</Form.Label>
                    <div className={"d-flex align-items-center gap-2"}>
                      {edit.id || selectedFile ? (
                        <ImageViewer
                          src={
                            selectedFile &&
                            selectedFile.type.startsWith("image/")
                              ? URL.createObjectURL(selectedFile)
                              : edit.logo
                              ? process.env.REACT_APP_API_URL + edit.logo
                              : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                          }
                        >
                          <img
                            width={35}
                            height={35}
                            className="rounded-circle object-fit"
                            src={
                              (selectedFile &&
                                selectedFile.type.startsWith("image/") &&
                                URL.createObjectURL(selectedFile)) ||
                              process.env.REACT_APP_API_URL + edit?.logo
                            }
                          />
                        </ImageViewer>
                      ) : null}
                      <Form.Control
                        type="file"
                        name="logo"
                        onChange={(e) => {
                          setSelectedFile(e.currentTarget.files[0]);
                          props.setFieldValue("logo", e.target.files[0]);
                        }}
                      />
                    </div>
                    <Form.Control.Feedback type="invalid">
                      {props.errors.logo}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} md={12}>
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

export default CreateBankManagement;
