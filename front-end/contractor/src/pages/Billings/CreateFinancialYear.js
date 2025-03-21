import React, { useEffect } from "react";
import { useState } from "react";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import { BsArrowLeftRight, BsCalendarEvent } from "react-icons/bs";
import CardComponent from "../../components/CardComponent";
import { Formik } from "formik";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import ConfirmAlert from "../../components/ConfirmAlert";
import {
  getSingleFinancialYearsById,
  postFinancialYears,
  updateFinancialYears,
} from "../../services/contractorApi";
import { addFinancialYearSchema } from "../../utils/formSchema";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CreateFinancialYear = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [edit, setEdit] = useState({});
  const { t } = useTranslation();

  const fetchSingleData = async () => {
    const res = await getSingleFinancialYearsById(id);
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit([]);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      start_date: values.start_date,
      end_date: values.end_date,
    };

    const res = edit.id
      ? await updateFinancialYears(edit?.id, sData)
      : await postFinancialYears(sData);
    if (res.status) {
      toast.success(res.message);
      navigate(-1);
    } else {
      if (res.message.includes("Financial Year already exists")) {
        toast.warn(res.message);
      } else {
        toast.error(res.message);
      }
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
          {`${edit?.id ? "UPDATE" : "Create"} Financial Year`} · CMS Electricals
        </title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CardComponent
          title={`${edit?.id ? t("UPDATE") : t("Create")} ${t(
            "Financial Year"
          )}`}
        >
          <Formik
            enableReinitialize={true}
            initialValues={{
              start_date: edit.start_date || "",
              end_date: edit.end_date || "",
            }}
            validationSchema={addFinancialYearSchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props?.handleSubmit}>
                <Row className="g-3 py-2 align-items-center">
                  <Form.Group as={Col} md="5">
                    <Form.Label>
                      {t("Start Date")} <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="date"
                      name={"start_date"}
                      value={props.values.start_date}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      isInvalid={Boolean(
                        props.touched.start_date && props.errors.start_date
                      )}
                    />
                    <Form.Control.Feedback type="invalid">
                      {props.errors.start_date}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md="2" className="text-center">
                    <BsArrowLeftRight />
                  </Form.Group>
                  <Form.Group as={Col} md="5">
                    <Form.Label>
                      {t("End Date")} <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="date"
                      name={"end_date"}
                      value={props.values.end_date}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      isInvalid={Boolean(
                        props.touched.end_date && props.errors.end_date
                      )}
                    />
                    <Form.Control.Feedback type="invalid">
                      {props.errors.end_date}
                    </Form.Control.Feedback>
                  </Form.Group>
                  {edit?.id && (
                    <Form.Group as={Col} md="12">
                      <div className="float-end purple-combo p-1 px-2 rounded">
                        <BsCalendarEvent /> {t("Financial Year")} -{" "}
                        {edit?.year_name}
                      </div>
                    </Form.Group>
                  )}
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

export default CreateFinancialYear;
