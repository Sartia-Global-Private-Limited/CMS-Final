import React, { useEffect, useState } from "react";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { ErrorMessage, Formik } from "formik";
import TextareaAutosize from "react-textarea-autosize";
import Select from "react-select";
import { useNavigate, useParams } from "react-router-dom";
import CardComponent from "../../../../components/CardComponent";
import { addExpenseCategorySchema } from "../../../../utils/formSchema";
import {
  getSingleExpenseCategoryById,
  postExpenseCategory,
  updateExpenseCategory,
} from "../../../../services/contractorApi";
import ConfirmAlert from "../../../../components/ConfirmAlert";

const CreateExpenseCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [edit, setEdit] = useState({});
  const [showAlert, setShowAlert] = useState(false);

  const fetchSingleData = async () => {
    const res = await getSingleExpenseCategoryById(id);
    if (res.status) {
      setEdit(res.data[0]);
    } else {
      setEdit([]);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      category_name: values.category_name,
      status: JSON.stringify(values.status.value),
      description: values.description,
    };

    if (edit.id) {
      sData["id"] = edit.id;
    }
    // return console.log("sData", sData);
    const res = edit.id
      ? await updateExpenseCategory(sData)
      : await postExpenseCategory(sData);
    if (res.status) {
      toast.success(res.message);
      navigate(-1);
    } else {
      toast.error(res.message);
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
          {`${edit?.id ? "UPDATE" : "Create"} Expense Category`} · CMS
          Electricals
        </title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent
          title={`${edit?.id ? "UPDATE" : "Create"} Expense Category`}
        >
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
              description: edit.description || "",
            }}
            validationSchema={addExpenseCategorySchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props?.handleSubmit}>
                <Row className="g-2">
                  <Form.Group as={Col} md={6}>
                    <Form.Label>
                      Category Name <span className="text-danger small">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name={"category_name"}
                      value={props.values.category_name}
                      onChange={props.handleChange}
                    />
                    <ErrorMessage
                      name="category_name"
                      component="small"
                      className="text-danger"
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={6}>
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
                  <Form.Group as={Col} md={12}>
                    <Form.Label>Description</Form.Label>
                    <TextareaAutosize
                      className="edit-textarea"
                      minRows={3}
                      name="description"
                      value={props.values.description}
                      onChange={props.handleChange}
                    />
                    <ErrorMessage
                      name="description"
                      component="small"
                      className="text-danger"
                    />
                  </Form.Group>
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
                            />{" "}
                            PLEASE WAIT...
                          </>
                        ) : (
                          <>{edit?.id ? "UPDATE" : "SAVE"}</>
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

export default CreateExpenseCategory;
