import React, { useEffect, useState } from "react";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import CardComponent from "../../../components/CardComponent";
import { ErrorMessage, Formik } from "formik";
import Select from "react-select";
import ConfirmAlert from "../../../components/ConfirmAlert";
import {
  getAllRegionalOfficeList,
  getPaymentsettingById,
  postPaymentSetting,
  updatePaymentSetting,
} from "../../../services/contractorApi";
import { toast } from "react-toastify";
import { addPromotionSchema } from "../../../utils/formSchema";

const CreatePromotion = () => {
  const [allRegionalOffice, setAllRegionalOffice] = useState([]);
  const [edit, setEdit] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || null;

  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const fetchAllRegionalOffice = async () => {
    const res = await getAllRegionalOfficeList();
    if (res?.status) {
      setAllRegionalOffice(res?.data);
    } else {
      setAllRegionalOffice([]);
    }
  };

  const fetchPaymentSettingById = async () => {
    const res = await getPaymentsettingById(id);
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit({});
    }
  };

  useEffect(() => {
    if (id !== "new") {
      fetchPaymentSettingById();
    }
    fetchAllRegionalOffice();
  }, [id]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      ro_id: values.ro_id?.value,
      gst: values?.gst,
      tds: values?.tds,
      tds_with_gst: values.tds_with_gst,
      retention_money: values.retention_money,
      promotion_expense: values.promotion_expense,
      man_power: 0,
      site_expense: 0,
      site_stock: 0,
    };
    if (edit.id) {
      sData["id"] = edit.id;
    }

    const res = edit?.id
      ? await updatePaymentSetting(sData)
      : await postPaymentSetting(sData);

    if (res?.status) {
      toast.success(res.message);
      navigate(-1);
      resetForm();
    } else {
      toast.error(res?.message);
    }
    setSubmitting(false);
    setShowAlert(false);
  };

  return (
    <Col>
      <Helmet>
        <title>
          {type === "view" ? "view" : edit?.id ? "Update" : "Create"} promotion
          · CMS Electricals
        </title>
      </Helmet>
      <CardComponent
        className={type === "view" && "after-bg-light"}
        title={`${
          type === "view" ? "View" : edit?.id ? "Update" : "Create"
        } Promotion`}
      >
        <Formik
          enableReinitialize={true}
          initialValues={{
            ro_id: edit.ro_id
              ? {
                  label: edit.regional_office,
                  value: edit.ro_id,
                }
              : "",
            gst: edit.gst || "",
            tds: edit.tds || "",
            tds_with_gst: edit.tds_with_gst || "",
            retention_money: edit.retention_money || "",
            promotion_expense: edit.promotion_expense || "",
            man_power: edit.man_power || "",
            site_expense: edit.site_expense || "",
            site_stock: edit.site_stock || "",
          }}
          validationSchema={addPromotionSchema}
          onSubmit={handleSubmit}
        >
          {(props) => (
            <Form onSubmit={props?.handleSubmit}>
              <Row className="g-3">
                {type === "view" ? (
                  "component"
                ) : (
                  <>
                    <Form.Group as={Col} md={4}>
                      <Form.Label>
                        {t("Regional Office")}
                        <span className="text-danger fw-bold">*</span>
                      </Form.Label>
                      <Select
                        menuPortalTarget={document.body}
                        name="ro_id"
                        value={props.values.ro_id}
                        className="text-primary"
                        placeholder="--Select--"
                        onBlur={props.handleBlur}
                        onChange={(val) => {
                          props.setFieldValue("ro_id", val);
                        }}
                        options={allRegionalOffice.map((data) => ({
                          label: data?.regional_office_name,
                          value: data?.id,
                        }))}
                        isInvalid={Boolean(
                          props.touched.ro_id && props.errors.ro_id
                        )}
                      />
                      <ErrorMessage
                        name="ro_id"
                        component="small"
                        className="text-danger"
                      />
                    </Form.Group>
                    <Form.Group as={Col} md={4}>
                      <Form.Label>
                        {t("gst")} %
                        <span className="text-danger fw-bold">*</span>
                      </Form.Label>
                      <Form.Control
                        name="gst"
                        value={props?.values?.gst}
                        onChange={(e) => {
                          if (e.target.value <= 100) {
                            props.setFieldValue("gst", e.target.value);
                          } else {
                            props.setFieldValue("gst", 100);
                          }
                        }}
                        onBlur={props.handleBlur}
                        type="text"
                        isInvalid={Boolean(
                          props.touched.gst && props.errors.gst
                        )}
                      />
                      <ErrorMessage
                        name="gst"
                        component="small"
                        className="text-danger"
                      />
                    </Form.Group>
                    <Form.Group as={Col} md={4}>
                      <Form.Label>
                        {t("tds")} %
                        <span className="text-danger fw-bold">*</span>
                      </Form.Label>
                      <Form.Control
                        name="tds"
                        value={props?.values.tds}
                        onChange={(e) => {
                          if (e.target.value <= 100) {
                            props.setFieldValue("tds", e.target.value);
                          } else {
                            props.setFieldValue("tds", 100);
                          }
                        }}
                        onBlur={props.handleBlur}
                        type="number"
                        isInvalid={Boolean(
                          props.touched.tds && props.errors.tds
                        )}
                      />
                      <ErrorMessage
                        name="tds"
                        component="small"
                        className="text-danger"
                      />
                    </Form.Group>
                    <Form.Group as={Col} md={4}>
                      <Form.Label>
                        {t("tds with gst")} %
                        <span className="text-danger fw-bold">*</span>
                      </Form.Label>
                      <Form.Control
                        name="tds_with_gst"
                        value={props?.values?.tds_with_gst}
                        onChange={(e) => {
                          if (e.target.value <= 100) {
                            props.setFieldValue("tds_with_gst", e.target.value);
                          } else {
                            props.setFieldValue("tds_with_gst", 100);
                          }
                        }}
                        onBlur={props.handleBlur}
                        type="number"
                        isInvalid={Boolean(
                          props.touched.tds_with_gst &&
                            props.errors.tds_with_gst
                        )}
                      />
                      <ErrorMessage
                        name="tds_with_gst"
                        component="small"
                        className="text-danger"
                      />
                    </Form.Group>
                    <Form.Group as={Col} md={4}>
                      <Form.Label>
                        {t("Retention")} %
                        <span className="text-danger fw-bold">*</span>
                      </Form.Label>
                      <Form.Control
                        name="retention_money"
                        value={props?.values.retention_money}
                        onChange={(e) => {
                          if (e.target.value <= 100) {
                            props.setFieldValue(
                              "retention_money",
                              e.target.value
                            );
                          } else {
                            props.setFieldValue("retention_money", 100);
                          }
                        }}
                        onBlur={props.handleBlur}
                        type="number"
                        isInvalid={Boolean(
                          props.touched.retention_money &&
                            props.errors.retention_money
                        )}
                      />
                      <ErrorMessage
                        name="retention_money"
                        component="small"
                        className="text-danger"
                      />
                    </Form.Group>
                    <Form.Group as={Col} md={4}>
                      <Form.Label>
                        {t("Promotion Expense")} %
                        <span className="text-danger fw-bold">*</span>
                      </Form.Label>
                      <Form.Control
                        name="promotion_expense"
                        value={props?.values.promotion_expense}
                        onChange={(e) => {
                          if (e.target.value <= 100) {
                            props.setFieldValue(
                              "promotion_expense",
                              e.target.value
                            );
                          } else {
                            props.setFieldValue("promotion_expense", 100);
                          }
                        }}
                        onBlur={props.handleBlur}
                        type="number"
                        isInvalid={Boolean(
                          props.touched.promotion_expense &&
                            props.errors.promotion_expense
                        )}
                      />
                      <ErrorMessage
                        name="promotion_expense"
                        component="small"
                        className="text-danger"
                      />
                    </Form.Group>
                    <Form.Group as={Col} md={4}>
                      <Form.Label>
                        {t("Site Expense")}
                        <span className="text-danger fw-bold">*</span>
                      </Form.Label>
                      <Form.Control
                        name="site_expense"
                        placeholder="0"
                        value={props?.values?.site_expense}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        type="number"
                        disabled
                        isInvalid={Boolean(
                          props.touched.site_expense &&
                            props.errors.site_expense
                        )}
                      />
                      <ErrorMessage
                        name="site_expense"
                        component="small"
                        className="text-danger"
                      />
                    </Form.Group>
                    <Form.Group as={Col} md={4}>
                      <Form.Label>
                        {t("Site Stock")}
                        <span className="text-danger fw-bold">*</span>
                      </Form.Label>
                      <Form.Control
                        name="site_stock"
                        placeholder="0"
                        value={props?.values.site_stock}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        type="number"
                        disabled
                        isInvalid={Boolean(
                          props.touched.site_stock && props.errors.site_stock
                        )}
                      />
                      <ErrorMessage
                        name="site_stock"
                        component="small"
                        className="text-danger"
                      />
                    </Form.Group>
                    <Form.Group as={Col} md={4}>
                      <Form.Label>
                        {t("Man Power")}
                        <span className="text-danger fw-bold">*</span>
                      </Form.Label>
                      <Form.Control
                        name="man_power"
                        placeholder="0"
                        value={props?.values.man_power}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        type="number"
                        disabled
                        isInvalid={Boolean(
                          props.touched.man_power && props.errors.man_power
                        )}
                      />
                      <ErrorMessage
                        name="man_power"
                        component="small"
                        className="text-danger"
                      />
                    </Form.Group>

                    <Col md={12}>
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
                    </Col>
                  </>
                )}
              </Row>
            </Form>
          )}
        </Formik>
      </CardComponent>
    </Col>
  );
};

export default CreatePromotion;
