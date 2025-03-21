import React, { useEffect, useState } from "react";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import { Helmet } from "react-helmet";
import CardComponent from "../../components/CardComponent";
import TextareaAutosize from "react-textarea-autosize";
import { toast } from "react-toastify";
import { Formik } from "formik";
import { addDocumentCategorySchema } from "../../utils/formSchema";
import ConfirmAlert from "../../components/ConfirmAlert";
import {
  getAdminCreateDocument,
  getAdminUpdateDocument,
  getSingleDocumentById,
} from "../../services/authapi";
import { useNavigate, useParams } from "react-router-dom";

const CreateDocumentCategory = () => {
  const [edit, setEdit] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);

  const fetchDocumentData = async () => {
    const res = await getSingleDocumentById(id);
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit([]);
    }
  };

  useEffect(() => {
    if (id !== "new") {
      fetchDocumentData();
    }
  }, []);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      title: values.title,
      description: values.description,
      category: values.category,
    };

    if (edit.id) {
      sData["id"] = edit.id;
    }
    // console.log('sData', sData)
    const res = edit.id
      ? await getAdminUpdateDocument(sData)
      : await getAdminCreateDocument(sData);
    if (res.status) {
      toast.success(res.message);
      navigate(-1);
    } else {
      toast.error(res.message);
    }
    resetForm();
    setSubmitting(false);
    setShowAlert(false);
  };

  return (
    <>
      <Helmet>
        <title>
          {edit?.id ? "Update" : "Create"} Document Category · CMS Electricals
        </title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent
          title={`${edit?.id ? "Update" : "Create"} Document Category`}
        >
          <Formik
            enableReinitialize={true}
            initialValues={{
              id: edit?.id || "",
              title: edit?.title || "",
              category: edit?.category || "",
              description: edit?.description || "",
            }}
            validationSchema={addDocumentCategorySchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props?.handleSubmit}>
                <Row className="g-2">
                  <Form.Group as={Col} md={6}>
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      type="text"
                      name={"title"}
                      value={props.values.title}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      isInvalid={Boolean(
                        props.touched.title && props.errors.title
                      )}
                    />
                    <Form.Control.Feedback type="invalid">
                      {props.errors.title}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md={6}>
                    <Form.Label>
                      Category <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name={"category"}
                      value={props.values.category}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      isInvalid={Boolean(
                        props.touched.category && props.errors.category
                      )}
                    />
                    <Form.Control.Feedback type="invalid">
                      {props.errors.category}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md={12}>
                    <Form.Label>Description</Form.Label>
                    <TextareaAutosize
                      minRows={2}
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
                          <>{edit.id ? "UPDATE" : "Save"}</>
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

export default CreateDocumentCategory;
