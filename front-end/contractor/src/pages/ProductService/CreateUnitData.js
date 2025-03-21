import React, { useEffect, useState } from "react";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import CardComponent from "../../components/CardComponent";
import { Formik } from "formik";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import ConfirmAlert from "../../components/ConfirmAlert";
import { addUnitDataSchema } from "../../utils/formSchema";
import {
  getSingleUnitDataById,
  postUnitData,
  updateUnitData,
} from "../../services/contractorApi";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CreateUnitData = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [edit, setEdit] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const fetchUnitData = async () => {
    const res = await getSingleUnitDataById(id);
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit([]);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      name: values.name,
      short_name: values.short_name,
    };

    const res = edit.id
      ? await updateUnitData(edit.id, sData)
      : await postUnitData(sData);
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
      fetchUnitData();
    }
  }, [id]);

  return (
    <>
      <Helmet>
        <title>
          {edit?.id ? "Update" : "Create"} Unit Data · CMS Electricals
        </title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CardComponent title={`${edit?.id ? "Update" : "Create"} Unit Data`}>
          <Formik
            enableReinitialize={true}
            initialValues={{
              name: edit.name || "",
              short_name: edit.short_name || "",
            }}
            validationSchema={addUnitDataSchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props?.handleSubmit}>
                <Row className="g-2">
                  <Form.Group md="12">
                    <Form.Label>
                      {t("Name")} <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name={"name"}
                      value={props.values.name}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      isInvalid={Boolean(
                        props.touched.name && props.errors.name
                      )}
                    />
                    <Form.Control.Feedback type="invalid">
                      {props.errors.name}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group md="12">
                    <Form.Label>
                      {t("Short Name")} <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name={"short_name"}
                      value={props.values.short_name}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      isInvalid={Boolean(
                        props.touched.short_name && props.errors.short_name
                      )}
                    />
                    <Form.Control.Feedback type="invalid">
                      {props.errors.short_name}
                    </Form.Control.Feedback>
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

export default CreateUnitData;
