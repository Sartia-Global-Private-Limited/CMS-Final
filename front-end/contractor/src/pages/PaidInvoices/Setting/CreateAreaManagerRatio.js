import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import CardComponent from "../../../components/CardComponent";
import { Helmet } from "react-helmet";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import { ErrorMessage, Formik } from "formik";
import Select from "react-select";
import ConfirmAlert from "../../../components/ConfirmAlert";
import {
  getAllAreaManagerList,
  getPromotionalSettingById,
  postPromotionalManagerSetting,
  updatePromotionalSetting,
} from "../../../services/contractorApi";
import { toast } from "react-toastify";
import { addAreaRatio } from "../../../utils/formSchema";

const CreateAreaManagerRatio = ({ checkPermission }) => {
  const [allAreaManager, setAllAreaManager] = useState([]);
  const [edit, setEdit] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || null;
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const fetchAllAreaManager = async () => {
    const res = await getAllAreaManagerList();
    if (res?.status) {
      setAllAreaManager(res?.data);
    } else {
      setAllAreaManager([]);
    }
  };

  const fetchPromotionalSettingById = async () => {
    const res = await getPromotionalSettingById(id);
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit({});
    }
  };

  useEffect(() => {
    if (id !== "new") {
      fetchPromotionalSettingById();
    }
    fetchAllAreaManager();
  }, [id]);
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      manager_id: values.manager_id?.value,
      manager_ratio: values.manager_ratio,
      company_ratio: 100 - values.manager_ratio,
    };
    if (edit.id) {
      sData["id"] = edit.id;
    }
    const res = edit?.id
      ? await updatePromotionalSetting(sData)
      : await postPromotionalManagerSetting(sData);

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
          {type === "view" ? "view" : edit?.id ? "Update" : "Create"} Area
          Manager · CMS Electricals
        </title>
      </Helmet>
      <CardComponent
        className={type === "view" && "after-bg-light"}
        title={`${
          type === "view" ? "View" : edit?.id ? "Update" : "Create"
        } Area Manager Ratio`}
      >
        <Formik
          enableReinitialize={true}
          initialValues={{
            manager_id: edit.manager_id
              ? {
                  label: edit.manager_name,
                  value: edit.manager_id,
                }
              : "",
            manager_ratio: edit.manager_ratio || "",
            company_ratio: edit.company_ratio || "",
          }}
          validationSchema={addAreaRatio}
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
                        {t("Area Manager")}
                        <span className="text-danger fw-bold">*</span>
                      </Form.Label>
                      <Select
                        menuPortalTarget={document.body}
                        name="manager_id"
                        value={props.values.manager_id}
                        className="text-primary"
                        placeholder="--Select--"
                        onBlur={props.handleBlur}
                        onChange={(val) => {
                          props.setFieldValue("manager_id", val);
                        }}
                        options={allAreaManager.map((data) => ({
                          label: data.name,
                          value: data.id,
                        }))}
                        isInvalid={Boolean(
                          props.touched.manager_id && props.errors.manager_id
                        )}
                      />
                      <ErrorMessage
                        name="manager_id"
                        component="small"
                        className="text-danger"
                      />
                    </Form.Group>
                    <Form.Group as={Col} md={4}>
                      <Form.Label>
                        {t("Manager Ratio")}
                        <span className="text-danger fw-bold">*</span>
                      </Form.Label>

                      <Form.Control
                        name="manager_ratio"
                        value={props?.values.manager_ratio}
                        onChange={(e) => {
                          if (e.target.value <= 100) {
                            props.setFieldValue(
                              "manager_ratio",
                              e.target.value
                            );
                            props.setFieldValue(
                              "company_ratio",
                              100 - e.target.value
                            );
                          } else {
                            props.setFieldValue("manager_ratio", 100);
                            props.setFieldValue("company_ratio", 0);
                          }
                        }}
                        onBlur={props.handleBlur}
                        type="number"
                        isInvalid={Boolean(
                          props.touched.manager_ratio &&
                            props.errors.manager_ratio
                        )}
                      />
                      <ErrorMessage
                        name="manager_ratio"
                        component="small"
                        className="text-danger"
                      />
                    </Form.Group>
                    <Form.Group as={Col} md={4}>
                      <Form.Label>
                        {t("Company Ratio")}
                        <span className="text-danger fw-bold">*</span>
                      </Form.Label>
                      <Form.Control
                        name="company_ratio"
                        value={props.values.company_ratio}
                        disabled
                        onBlur={props.handleBlur}
                        type="number"
                        isInvalid={Boolean(
                          props.touched.company_ratio &&
                            props.errors.company_ratio
                        )}
                      />
                      <ErrorMessage
                        name="company_ratio"
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

export default CreateAreaManagerRatio;
