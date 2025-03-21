import React, { useEffect } from "react";
import { useState } from "react";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import {
  addUserContractors,
  getAdminSingleContractors,
  updateAdminContractors,
} from "../../services/authapi";
import { Formik } from "formik";
import { toast } from "react-toastify";
import ConfirmAlert from "../../components/ConfirmAlert";
import { useNavigate, useParams } from "react-router-dom";
import CardComponent from "../../components/CardComponent";
import MyInput from "../../components/MyInput";
import { addContractorUserSchema } from "../../utils/formSchema";
import ImageViewer from "../../components/ImageViewer";
import { getImageSrc } from "../../utils/helper";
import { useTranslation } from "react-i18next";
import moment from "moment";

const ClientUserForm = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [edit, setEdit] = useState({});

  const fetchSingleData = async () => {
    const res = await getAdminSingleContractors(id, "User");
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit({});
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("joining_date", values.joining_date);
    formData.append("password", values.password);
    formData.append("id", edit?.admin_id);
    formData.append("contractor_id", edit?.admin_id);
    formData.append("image", values.image);
    formData.append("status", values.status);
    formData.append("type", "User");

    if (edit?.admin_id) {
      formData.append("contact_no", values?.mobile);
    } else {
      formData.append("mobile", values.mobile);
    }
    // return console.log(values);

    const res = edit.admin_id
      ? await updateAdminContractors(formData)
      : await addUserContractors(formData);

    if (res.status) {
      toast.success(res.message);
      resetForm();
      navigate(-1);
    } else {
      toast.error(res.message);
    }
    setSubmitting(false);
  };

  useEffect(() => {
    if (id) {
      fetchSingleData();
    }
  }, []);

  return (
    <>
      <Col md={12}>
        <CardComponent
          showBackButton={true}
          title={edit.admin_id ? "UPDATE Client User" : "Create Client User"}
        >
          <Formik
            enableReinitialize={true}
            initialValues={{
              name: edit.name || "",
              email: edit.email || "",
              userType: edit.user_type_number || "",
              contractor_id: edit.contractor_id || "",
              password: edit.password || "",
              mobile: edit.mobile || "",
              joining_date: edit.joining_date
                ? moment(edit.joining_date).format("YYYY-MM-DD")
                : "",
              image: edit.image || null,
              status: `${edit.status}` || "1",
            }}
            validationSchema={addContractorUserSchema(edit?.admin_id)}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props?.handleSubmit}>
                <Row className="g-2 align-items-end pb-1">
                  <Form.Group as={Col} md={4}>
                    <MyInput
                      isRequired
                      name={"name"}
                      formikProps={props}
                      label={t("Name")}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={4}>
                    <MyInput
                      isRequired
                      type="email"
                      name={"email"}
                      formikProps={props}
                      label={t("Email")}
                    />
                  </Form.Group>
                  {!edit.admin_id ? (
                    <Form.Group as={Col} md={4}>
                      <MyInput
                        isRequired
                        type="password"
                        name={"password"}
                        formikProps={props}
                        label={t("Password")}
                      />
                    </Form.Group>
                  ) : null}

                  <Form.Group as={Col} md={4}>
                    <MyInput
                      isRequired
                      name={"mobile"}
                      formikProps={props}
                      label={t("mobile Number")}
                      customType={"phone"}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={4}>
                    <MyInput
                      isRequired
                      customType={"date"}
                      name={"joining_date"}
                      label={"Joining Date"}
                      formikProps={props}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={4}>
                    <MyInput
                      isRequired
                      name={"status"}
                      formikProps={props}
                      label={t("Status")}
                      customType={"select"}
                      selectProps={{
                        data: [
                          {
                            label: "Active",
                            value: "1",
                          },
                          {
                            label: "InActive",
                            value: "0",
                          },
                        ],
                      }}
                    />
                  </Form.Group>

                  <Form.Group as={Col} md={4}>
                    <Form.Label>{t("Upload Profile Photo")}</Form.Label>

                    <div className="d-flex gap-2">
                      <ImageViewer
                        downloadIcon
                        href={getImageSrc(props.values.image, edit?.image)}
                        src={getImageSrc(props.values.image, edit?.image)}
                      >
                        <img
                          src={getImageSrc(props.values.image, edit?.image)}
                          className="my-btn object-fit"
                        />
                      </ImageViewer>
                      <Form.Control
                        type="file"
                        name={"image"}
                        accept="image/*"
                        onChange={(e) =>
                          props.setFieldValue("image", e.target.files[0])
                        }
                      />
                    </div>
                  </Form.Group>

                  <Form.Group as={Col} md={12}>
                    <div className="mt-4 text-center">
                      <button
                        type={`${edit.admin_id ? "button" : "submit"}`}
                        onClick={() => setShowAlert(edit.admin_id && true)}
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
                          <>{edit.admin_id ? "UPDATE" : "SAVE"}</>
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

export default ClientUserForm;
