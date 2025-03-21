import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import CardComponent from "../../../components/CardComponent";
import {
  addAdminEnergy,
  getAdminSingleEnergy,
  updateAdminEnergy,
} from "../../../services/authapi";
import { addEnergySchema } from "../../../utils/formSchema";
import TextareaAutosize from "react-textarea-autosize";
import ConfirmAlert from "../../../components/ConfirmAlert";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/auth/authSlice";
import { checkPermission } from "../../../utils/checkPermissions";
import { CREATED, UPDATED } from "../../../utils/constants";
import MyInput from "../../../components/MyInput";
import { useTranslation } from "react-i18next";

const AddEnergyCompany = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  let { pathname } = useLocation();
  const { user } = useSelector(selectUser);
  const [showAlert, setShowAlert] = useState(false);
  const [edit, setEdit] = useState({});
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  const navigate = useNavigate();

  const fetchEnergyById = async () => {
    const res = await getAdminSingleEnergy(id);
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit({});
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();
    formData.append("energy_company_id", edit.ec_id);
    formData.append("id", edit.user_id);
    formData.append("company_name", values.company_name);
    // formData.append("id", edit.ec_id);
    formData.append("website_url", values.website_url);
    formData.append("email", values.email);
    formData.append("username", values.username);
    formData.append("password", values.password);
    formData.append("contact_no", values.contact_no);
    formData.append("alt_number", values.alt_number);
    formData.append("address_1", values.address_1);
    formData.append("gst_number", values.gst_number);
    formData.append("zone_id", values.zone_id);
    formData.append("ro_id", values.ro_id);
    formData.append("sale_area_id", values.sale_area_id);
    formData.append("status", values.status);
    formData.append("country", values.country);
    formData.append("city", values.city);
    formData.append("pin_code", values.pin_code);
    formData.append("description", values.description);

    const res = edit.ec_id
      ? await updateAdminEnergy(formData)
      : await addAdminEnergy(formData);
    if (res.status) {
      toast.success(res.message);
      navigate(-1);
      resetForm();
    } else {
      toast.error(res.message);
      setShowAlert(false);
    }
    setSubmitting(false);
  };

  useEffect(() => {
    if (id !== "new") {
      fetchEnergyById();
    }
  }, [id]);

  return (
    <>
      <Col md={12}>
        <CardComponent
          title={
            edit.ec_id ? "Update - Energy Company" : "Add - Energy Company"
          }
        >
          <Row className="g-3">
            <Formik
              enableReinitialize={true}
              initialValues={{
                company_name: edit.company_name || "",
                website_url: edit.website_url || "",
                email: edit.email || "",
                username: edit.username || "",
                password: edit.password || "",
                contact_no: edit.contact_no || "",
                alt_number: edit.alt_number || "",
                gst_number: edit.gst_number || "",
                address_1: edit.address_1 || "",
                zone_id: edit.zone_id || "",
                ro_id: edit.ro_id || "",
                sale_area_id: edit.sale_area_id || "",
                status: edit.status || 1,
                country: edit.country || "",
                city: edit.city || "",
                pin_code: edit.pin_code || "",
                // image: edit.image || null,
                description: edit.description || "",
              }}
              validationSchema={addEnergySchema(edit?.ec_id)}
              onSubmit={handleSubmit}
            >
              {(props) => (
                <Form onSubmit={props?.handleSubmit}>
                  <Row className="g-3">
                    <Form.Group as={Col} md={4}>
                      <MyInput
                        isRequired
                        name={"company_name"}
                        formikProps={props}
                        label={t("Company Name")}
                      />
                    </Form.Group>
                    <Form.Group as={Col} md={4}>
                      <MyInput
                        name={"website_url"}
                        formikProps={props}
                        label={t("Website Url")}
                        type="url"
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
                    <Form.Group as={Col} md={4}>
                      <MyInput
                        isRequired
                        name={"username"}
                        formikProps={props}
                        label={t("User Name")}
                      />
                    </Form.Group>
                    {!edit.ec_id ? (
                      <Form.Group as={Col} md={4}>
                        <div className="position-relative pass">
                          <MyInput
                            isRequired
                            name={"password"}
                            formikProps={props}
                            label={t("Password")}
                            type={passwordShown ? "text" : "password"}
                          />
                          <div
                            className="float-end text-gray cursor-pointer pass-icon"
                            style={{
                              top:
                                props.errors.password &&
                                props.touched.password &&
                                "40%",
                              zIndex: 99,
                            }}
                            onClick={togglePassword}
                          >
                            {passwordShown ? <BsEye /> : <BsEyeSlash />}
                          </div>
                        </div>
                      </Form.Group>
                    ) : null}
                    <Form.Group as={Col} md={4}>
                      <MyInput
                        isRequired
                        name={"contact_no"}
                        formikProps={props}
                        label={t("Contact Number")}
                        customType={"phone"}
                      />
                    </Form.Group>
                    <Form.Group as={Col} md={4}>
                      <MyInput
                        name={"alt_number"}
                        formikProps={props}
                        label={t("Alt Number")}
                        customType={"phone"}
                      />
                    </Form.Group>
                    <Form.Group as={Col} md={4}>
                      <MyInput
                        name={"gst_number"}
                        formikProps={props}
                        label={t("Gst number")}
                      />
                    </Form.Group>
                    <Form.Group as={Col} md={4}>
                      <MyInput
                        name={"status"}
                        formikProps={props}
                        label={t("Status")}
                        customType={"select"}
                        selectProps={{
                          data: [
                            {
                              value: "1",
                              label: "Active",
                            },
                            {
                              value: "0",
                              label: "Inactive",
                            },
                          ],
                        }}
                      />
                    </Form.Group>
                    <Form.Group as={Col} md={4}>
                      <MyInput
                        name={"country"}
                        formikProps={props}
                        label={t("Country")}
                      />
                    </Form.Group>
                    <Form.Group as={Col} md={4}>
                      <MyInput
                        name={"city"}
                        formikProps={props}
                        label={t("City")}
                      />
                    </Form.Group>
                    <Form.Group as={Col} md={4}>
                      <MyInput
                        name={"pin_code"}
                        formikProps={props}
                        label={t("Pin Code")}
                      />
                    </Form.Group>
                    <Form.Group as={Col} md={4}>
                      <MyInput
                        name={"address_1"}
                        formikProps={props}
                        label={t("Address")}
                        customType={"multiline"}
                      />
                    </Form.Group>
                    <Form.Group as={Col} md={4}>
                      <MyInput
                        name={"description"}
                        formikProps={props}
                        label={t("Description")}
                        customType={"multiline"}
                      />
                    </Form.Group>
                    <Form.Group as={Col} md={12}>
                      <div className="text-center">
                        <button
                          type={`${edit.ec_id ? "button" : "submit"}`}
                          onClick={() => setShowAlert(edit.ec_id && true)}
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
                            <>{edit.ec_id ? "UPDATE" : "SAVE"}</>
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
          </Row>
        </CardComponent>
      </Col>
    </>
  );
};

export default AddEnergyCompany;
