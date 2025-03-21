import { Formik } from "formik";
import React, { useEffect } from "react";
import ReactQuill from "react-quill";
import EditorToolbar, {
  modules,
  formats,
} from "../../components/EditorToolbar";
import "react-quill/dist/quill.snow.css";
import { addTermConditionSchema } from "../../utils/formSchema";
import {
  getAdminCreateTermConditions,
  getAdminSingleTermConditions,
  getAdminUpdateTermConditions,
} from "../../services/authapi";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import CardComponent from "../../components/CardComponent";
import { toast } from "react-toastify";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmAlert from "../../components/ConfirmAlert";

const AddTermConditions = () => {
  const { id } = useParams();
  const [data, setData] = useState({});
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);

  const fetchSingleData = async () => {
    const res = await getAdminSingleTermConditions(id);
    if (res.status) {
      setData(res.data);
    } else {
      setData({});
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      title: values.title,
      content: values.content,
      status: +values.status,
    };

    if (data?.id) {
      sData["id"] = data?.id;
    }
    // return console.log('sData', sData)
    const res = data?.id
      ? await getAdminUpdateTermConditions(sData)
      : await getAdminCreateTermConditions(sData);
    if (res.status) {
      fetchSingleData();
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
  }, [id]);
  return (
    <Col md={12}>
      <CardComponent
        title={data?.id ? "Update Term & Condition" : "Create Term & Condition"}
      >
        <Formik
          enableReinitialize={true}
          initialValues={{
            id: data?.id || "",
            title: data?.title || "",
            content: data?.content || "",
            status: data?.status || null,
          }}
          validationSchema={addTermConditionSchema}
          onSubmit={handleSubmit}
        >
          {(props) => (
            <Form onSubmit={props?.handleSubmit}>
              <Row className="g-3">
                <Form.Group as={Col} md={12}>
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
                    {props.errors.name}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Content</Form.Label>
                  <EditorToolbar />
                  <ReactQuill
                    style={{ height: "200px" }}
                    placeholder={"Write something awesome..."}
                    modules={modules}
                    formats={formats}
                    theme="snow"
                    name={"content"}
                    value={props.values.content}
                    onChange={(getContent) => {
                      props.setFieldValue("content", getContent);
                    }}
                  />
                </Form.Group>
                <Form.Group as={Col} md={12}>
                  <div className="text-center">
                    <button
                      type={`${data?.id ? "button" : "submit"}`}
                      onClick={() => setShowAlert(data?.id && true)}
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
                        <>{data?.id ? "UPDATE" : "SAVE"}</>
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
  );
};

export default AddTermConditions;
