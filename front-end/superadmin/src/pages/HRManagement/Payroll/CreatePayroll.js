import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import CardComponent from "../../../components/CardComponent";
import { ErrorMessage, Field, Formik } from "formik";
import { toast } from "react-toastify";
import { addPayrollMasterSettingSchema } from "../../../utils/formSchema";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmAlert from "../../../components/ConfirmAlert";
import {
  CreatePayrollMaster,
  getSinglePayrollMasterById,
  UpdatePayrollMaster,
  UpdatePayrollMasterSetting,
} from "../../../services/authapi";
import Select from "react-select";
import TextareaAutosize from "react-textarea-autosize";

const CreatePayroll = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [edit, setEdit] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams();

  const fetchSingleData = async () => {
    const res = await getSinglePayrollMasterById(id);

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
  }, []);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    // return console.log('values', values)
    const sData = {
      label: values.label,
      active_setting: values.active_setting.value,
      input_type: "radio",
    };

    if (edit.id) {
      sData["id"] = edit.id;
    }
    // return console.log('sData', sData)
    const res = edit.id
      ? await UpdatePayrollMasterSetting(sData)
      : await CreatePayrollMaster(sData);
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
          {t(`${edit.id ? "Update" : "Create"} Task Category`)} · CMS
          Electricals
        </title>
      </Helmet>
      <Col md={12} data-aos="fade-up" data-aos-delay={200}>
        <CardComponent
          showBackButton={true}
          title={`${edit.id ? t("Update") : t("Create")} payroll master `}
        >
          <Formik
            enableReinitialize={true}
            initialValues={{
              label: edit?.label || "",
              active_setting: edit.active_setting
                ? {
                    label: edit.active_setting == "1" ? "Active" : "DeActive",
                    value: edit.active_setting,
                  }
                : { label: "Active", value: "1" },
            }}
            validationSchema={addPayrollMasterSettingSchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props.handleSubmit}>
                <Row className="g-2">
                  <Form.Group as={Col} md={12}>
                    <Form.Label>
                      {t("Payroll Setting Name")}
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <Field
                      as={TextareaAutosize}
                      className="edit-textarea"
                      minRows={1}
                      type="text"
                      name={"label"}
                      onChange={props.handleChange}
                    />
                    <ErrorMessage
                      name="label"
                      component="small"
                      className="text-danger"
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={12}>
                    <Form.Label>{t("Select active setting")}</Form.Label>
                    <Select
                      name={"active_setting"}
                      options={[
                        { label: "DeActive", value: "0" },
                        { label: "Active", value: "1" },
                      ]}
                      value={props.values.active_setting}
                      onChange={(selectedOption) => {
                        props.setFieldValue("active_setting", selectedOption);
                      }}
                    />
                  </Form.Group>
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

export default CreatePayroll;
