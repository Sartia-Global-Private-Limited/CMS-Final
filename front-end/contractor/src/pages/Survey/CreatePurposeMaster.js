import React, { useEffect, useState } from "react";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import { Helmet } from "react-helmet";
import CardComponent from "../../components/CardComponent";
import {
  AdminCreateSurveyPurposeMaster,
  AdminUpdateSurveyPurposeMaster,
  getSingleSurveyPurposeMasterById,
} from "../../services/authapi";
import { Formik } from "formik";
import ConfirmAlert from "../../components/ConfirmAlert";
import { addSurveyPurposeMasterSchema } from "../../utils/formSchema";
import { toast } from "react-toastify";
import Select from "react-select";
import { useNavigate, useParams } from "react-router-dom";

const CreatePurposeMaster = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [edit, setEdit] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchSinglePurposeMasterData = async () => {
    const res = await getSingleSurveyPurposeMasterById(id);
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit([]);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const ItemMasterStatus = values.status.value;
    const sData = {
      name: values.name,
      status: ItemMasterStatus,
    };
    if (edit.id) {
      sData["id"] = edit.id;
    }
    const res = edit?.id
      ? await AdminUpdateSurveyPurposeMaster(sData)
      : await AdminCreateSurveyPurposeMaster(sData);
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
      fetchSinglePurposeMasterData();
    }
  }, [id]);

  return (
    <>
      <Helmet>
        <title>
          {edit?.id ? "Update" : "Create"} Purpose Master · CMS Electricals
        </title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CardComponent
          title={`${edit?.id ? "Update" : "Create"} Purpose Master`}
        >
          <Formik
            enableReinitialize={true}
            initialValues={{
              id: edit?.id || "",
              name: edit?.name || "",
              status:
                edit.status === 0
                  ? {
                      label: edit.status === 1 ? "Active" : "Inactive",
                      value: edit.status,
                    }
                  : { label: "Active", value: 1 },
            }}
            validationSchema={addSurveyPurposeMasterSchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props?.handleSubmit}>
                <Row className="align-items-center g-2">
                  <Form.Group as={Col} md={12}>
                    <Form.Label>
                      Name <span className="text-danger">*</span>
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
                    <small className="text-danger">{props.errors.name}</small>
                  </Form.Group>
                  <Form.Group as={Col} md={12}>
                    <Form.Label>Status</Form.Label>
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
                          <>{edit.id ? "UPDATE" : "CREATE"}</>
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

export default CreatePurposeMaster;
