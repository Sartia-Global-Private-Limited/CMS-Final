import React, { useEffect, useState } from "react";
import {
  getAdminCreateLeavesType,
  getAdminUpdateLeavesType,
  getSingleLeaveTypeById,
} from "../../../services/authapi";
import { Helmet } from "react-helmet";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import CardComponent from "../../../components/CardComponent";
import { Formik } from "formik";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmAlert from "../../../components/ConfirmAlert";
import { addRolesSchema } from "../../../utils/formSchema";
import Select from "react-select";
import TextareaAutosize from "react-textarea-autosize";
const CreateLeavesType = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [edit, setEdit] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams();

  const fetchSingleData = async () => {
    const res = await getSingleLeaveTypeById(id);
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
    const leaveStatus = values.status.value;
    const sData = {
      leave_type: values.name,
      description: values.description,
      status: leaveStatus,
    };

    if (edit.id) {
      sData["id"] = edit.id;
    }
    // console.log('sData', sData)
    const res = edit.id
      ? await getAdminUpdateLeavesType(sData)
      : await getAdminCreateLeavesType(sData);
    if (res.status) {
      navigate(-1);
      toast.success(res.message);
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
          {t(`${edit.id ? "Update" : "Create"} Leave Type`)} · CMS Electricals
        </title>
      </Helmet>
      <Col md={12} data-aos="fade-up" data-aos-delay={200}>
        <CardComponent
          title={`${edit.id ? t("Update") : t("Create")} Leave Type`}
        >
          <Formik
            enableReinitialize={true}
            initialValues={{
              id: edit?.id || "",
              name: edit?.leave_type || "",
              description: edit?.description || "",
              status:
                +edit.status === 1
                  ? { label: "Active", value: 1 }
                  : { label: "InActive", value: 0 } || {
                      label: "InActive",
                      value: 0,
                    },
            }}
            validationSchema={addRolesSchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props.handleSubmit}>
                <Row className="g-2">
                  <Form.Group as={Col} md={6}>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={props.values.name}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={6}>
                    <Form.Label>Status</Form.Label>
                    <Select
                      // ref={selectRef}
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
                  <Form.Group as={Col} md={12}>
                    <Form.Label>Description</Form.Label>
                    <TextareaAutosize
                      onChange={props.handleChange}
                      value={props.values.description}
                      name="description"
                      className="edit-textarea"
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

export default CreateLeavesType;
