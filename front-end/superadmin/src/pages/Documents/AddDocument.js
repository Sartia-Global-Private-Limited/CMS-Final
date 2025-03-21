import React, { useEffect, useState } from "react";
import { Form, Row, Col, Spinner } from "react-bootstrap";
import { Helmet } from "react-helmet";
import CardComponent from "../../components/CardComponent";
import {
  getAdminAddDocumentList,
  getAdminAllDocument,
  getAllRolesForDropDown,
  getAdminUsersbyRole,
  getAdminUpdateDocumentList,
  getAdminViewDocumentList,
} from "../../services/authapi";
import { Formik } from "formik";
import { toast } from "react-toastify";
import { addDocumentSchema } from "../../utils/formSchema";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MyInput from "../../components/MyInput";
import { FORMAT_OPTION_LABEL } from "../../components/HelperStructure";
import ConfirmAlert from "../../components/ConfirmAlert";

const AddDocument = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [documentData, setDocumentData] = useState([]);
  const [edit, setEdit] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [allUserName, setAllUserName] = useState([]);
  const [userType, setAllUserType] = useState([]);

  const fetchDocumentData = async () => {
    const res = await getAdminAllDocument();
    if (res.status) {
      setDocumentData(res.data);
    } else {
      setDocumentData([]);
    }
  };
  const fetchSingleDocumentData = async () => {
    const res = await getAdminViewDocumentList(id);
    if (res.status) {
      setEdit(res.data);
      fetchUserNameData(res.data.user_type);
    } else {
      setEdit([]);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();

    for (const key in values) {
      if (key !== "images" && key !== "user_id") {
        formData.append(key, values[key]);
      }
    }

    formData.append("user_id", JSON.stringify(values.user_id));

    if (edit?.id) {
      formData.append("id", edit?.id);
    }

    values.images.forEach(function (file) {
      formData.append("images", file);
    });

    // return console.log("formData", ...formData);
    const res = edit?.id
      ? await getAdminUpdateDocumentList(formData)
      : await getAdminAddDocumentList(formData);
    if (res.status) {
      toast.success(res.message);
      resetForm();
      navigate(-1);
    } else {
      toast.error(res.message);
    }
    setSubmitting(false);
    setShowAlert(false);
  };

  const fetchUserTypeData = async () => {
    const res = await getAllRolesForDropDown();
    if (res.status) {
      setAllUserType(res.data);
    } else {
      setAllUserType([]);
      toast.error(res.message);
    }
  };

  const fetchUserNameData = async (id) => {
    const res = await getAdminUsersbyRole(id);
    if (res.status) {
      setAllUserName(res.data);
    } else {
      setAllUserName([]);
      toast.error(res.message);
    }
  };

  useEffect(() => {
    fetchDocumentData();
    fetchUserTypeData();
    if (id) {
      fetchSingleDocumentData();
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Add Document · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent
          showBackButton={true}
          title={`${edit?.id ? t("Edit") : t("Add")} Document`}
        >
          <Formik
            enableReinitialize={true}
            initialValues={{
              category_id: edit?.document_category_id || "",
              user_type: edit?.user_type || "",
              user_id: edit?.users?.map((itm) => itm?.user_id) || [],
              images: edit?.image || [],
              remarks: edit?.remark || "",
            }}
            validationSchema={addDocumentSchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props?.handleSubmit}>
                <Row className="g-4">
                  <Col md={8} data-aos={"fade-up"} data-aos-delay={300}>
                    <Row className="g-3">
                      <Form.Group as={Col} md={12}>
                        <MyInput
                          isRequired
                          name={"category_id"}
                          formikProps={props}
                          label={t("Category")}
                          customType={"select"}
                          selectProps={{
                            data: documentData?.map((itm) => ({
                              label: itm.title,
                              value: itm.id,
                            })),
                          }}
                        />
                      </Form.Group>
                      <Form.Group as={Col} md="6">
                        <MyInput
                          isRequired
                          name={"user_type"}
                          formikProps={props}
                          label={t("User Type")}
                          customType={"select"}
                          selectProps={{
                            data: userType?.map((itm) => ({
                              label: itm.name,
                              value: itm.id,
                            })),
                            onChange: (e) => {
                              if (e?.value) {
                                fetchUserNameData(e?.value);
                              } else {
                                setAllUserName([]);
                                props.setFieldValue("user_id", []);
                              }
                            },
                          }}
                        />
                      </Form.Group>
                      <Form.Group as={Col} md="6">
                        <MyInput
                          isRequired
                          multiple
                          name={"user_id"}
                          formikProps={props}
                          label={t("User")}
                          customType={"select"}
                          selectProps={{
                            data: allUserName?.map((itm) => ({
                              label: itm.user_name,
                              value: itm.user_id,
                              employee_id: itm.employee_id,
                              image: itm.image
                                ? `${process.env.REACT_APP_API_URL}${itm.image}`
                                : null,
                            })),
                          }}
                          formatOptionLabel={FORMAT_OPTION_LABEL}
                        />
                      </Form.Group>
                      <Form.Group as={Col} md={12}>
                        <MyInput
                          isRequired
                          name={"remarks"}
                          formikProps={props}
                          label={t("Remarks")}
                          customType={"multiline"}
                        />
                      </Form.Group>
                    </Row>
                  </Col>
                  <Form.Group as={Col} md={4}>
                    <MyInput
                      name={"images"}
                      allowMultipleFile={true}
                      formikProps={props}
                      label={t("Upload Document")}
                      customType={"fileUpload"}
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
export default AddDocument;
