import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import CardComponent from "../../../components/CardComponent";
import { ErrorMessage, Formik } from "formik";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmAlert from "../../../components/ConfirmAlert";
import TextareaAutosize from "react-textarea-autosize";

import {
  getAdminAllEnergy,
  getAdminCreateTypesComplaint,
  getAdminUpdateTypesComplaint,
  getSingleComplaintTypeById,
} from "../../../services/authapi";
import { addTypesComplaintSchema } from "../../../utils/formSchema";
import Select from "react-select";

const CreateComplaintType = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [edit, setEdit] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams();
  const [companyData, setCompanyData] = useState([]);

  const fetchMyCompaniesData = async () => {
    const res = await getAdminAllEnergy();
    if (res.status) {
      const rData = res.data.map((itm) => {
        return {
          value: itm.energy_company_id,
          label: itm.name,
        };
      });
      setCompanyData(rData);
    } else {
      setCompanyData([]);
    }
  };
  const fetchSingleData = async () => {
    const res = await getSingleComplaintTypeById(id);
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
    fetchMyCompaniesData();
  }, []);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      complaint_type_name: values.complaint_type_name,
      energy_company_id: values.energy_company_id.value,
    };

    if (edit?.id) {
      sData["id"] = edit?.id;
    }
    // console.log('sData', sData)
    const res = edit?.id
      ? await getAdminUpdateTypesComplaint(sData)
      : await getAdminCreateTypesComplaint(sData);
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
          title={`${edit.id ? t("Update") : t("Create")} Complaint Type`}
        >
          <Formik
            enableReinitialize={true}
            initialValues={{
              id: edit?.id || "",
              complaint_type_name: edit?.complaint_type_name || "",
              energy_company_id: edit?.energy_company_id
                ? {
                    label: edit?.energy_company_name,
                    value: edit?.energy_company_id,
                  }
                : "",
            }}
            validationSchema={addTypesComplaintSchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props.handleSubmit}>
                <Form.Group className="mb-2" as={Col} md={12}>
                  <Form.Label>
                    Energy Company Name <span className="text-danger">*</span>
                  </Form.Label>
                  <Select
                    className="text-primary"
                    name="energy_company_id"
                    value={props.values.energy_company_id}
                    onChange={(val) =>
                      props.setFieldValue("energy_company_id", val)
                    }
                    options={companyData}
                  />
                  <ErrorMessage
                    name="energy_company_id"
                    component="small"
                    className="text-danger"
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>
                    Complaint Type Name <span className="text-danger">*</span>
                  </Form.Label>
                  <TextareaAutosize
                    onChange={props.handleChange}
                    value={props.values.complaint_type_name}
                    name="complaint_type_name"
                    className="edit-textarea"
                  />
                  <ErrorMessage
                    name="complaint_type_name"
                    component="small"
                    className="text-danger"
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
                      description={t("Are you sure you want to update this!!")}
                    />
                  </div>
                </Form.Group>
              </Form>
            )}
          </Formik>
        </CardComponent>
      </Col>
    </>
  );
};

export default CreateComplaintType;
