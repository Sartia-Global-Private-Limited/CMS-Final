import React, { useEffect, useState } from "react";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import { Formik } from "formik";
import { addContractorsSchema } from "../../utils/formSchema";
import { toast } from "react-toastify";
import moment from "moment";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  addAdminContractors,
  getAdminAllPlanPricing,
  getAdminSingleContractors,
  updateAdminContractors,
} from "../../services/authapi";
import { checkPermission } from "../../utils/checkPermissions";
import { CREATED, UPDATED } from "../../utils/constants";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import { useTranslation } from "react-i18next";
import MyInput from "../../components/MyInput";
import CardComponent from "../../components/CardComponent";
import { getImageSrc } from "../../utils/helper";
import ImageViewer from "../../components/ImageViewer";
import ConfirmAlert from "../../components/ConfirmAlert";

const ContractorForm = () => {
  const { user } = useSelector(selectUser);
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation();
  let { pathname } = useLocation();
  const [edit, setEdit] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [planPricing, setPlanPricing] = useState([]);

  const fetchContractorData = async () => {
    const res = await getAdminSingleContractors(id, "Client");
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit({});
    }
  };

  const fetchPlanPricingData = async () => {
    const res = await getAdminAllPlanPricing();
    if (res.status) {
      setPlanPricing(
        res.data?.map((data) => {
          return {
            value: data?.id,
            label: `${data?.name} (₹ ${data?.price}/${data?.duration})`,
          };
        })
      );
    } else {
      setPlanPricing([]);
    }
  };

  // Sumbit Form
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("contact_no", values.contact_no);
    formData.append("alt_number", values.alt_number);
    formData.append("address_1", values.address_1);
    formData.append("country", values.country);
    formData.append("city", values.city);
    formData.append("pin_code", values.pin_code);
    formData.append("image", values.image);
    formData.append("password", values.password);
    formData.append("id", values.admin_id);
    formData.append("status", values.status);
    formData.append("plan_id", values.plan_id);
    formData.append("type", "Contractor");

    // const params = await checkPermission({
    //   user_id: user.id,
    //   pathname: `/${pathname.split("/")[1]}`,
    // });
    // params["action"] = edit.admin_id ? UPDATED : CREATED;

    // return console.log(sData);
    const res = edit.admin_id
      ? await updateAdminContractors(formData)
      : await addAdminContractors(formData);

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
    if (id) {
      fetchContractorData();
    }
    fetchPlanPricingData();
  }, []);

  return (
    <>
      <Col md={12} data-aos={"fade-up"}>
        <CardComponent
          title={`${edit.admin_id ? "Update" : "Create"} Client`}
          showBackButton={true}
        >
          <Formik
            enableReinitialize={true}
            initialValues={{
              name: edit.name || "",
              email: edit.email || "",
              userType: edit.user_type_number || "",
              contractor_id: edit.contractor_id || "",
              password: edit.password || "",
              contact_no: edit.contact_no || "",
              joining_date: edit.joining_date
                ? moment(edit.joining_date).format("YYYY-MM-DD")
                : "",
              alt_number: edit.alt_number || "",
              address_1: edit.address_1 || "",
              country: edit.country || "",
              city: edit.city || "",
              pin_code: edit.pin_code || "",
              admin_id: edit.admin_id || "",
              plan_id: edit.plan_id || "",
              status: edit.status || "1",
              image: edit.image || null,
            }}
            validationSchema={addContractorsSchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props?.handleSubmit}>
                <Row className="g-3 align-items-end">
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
                      name={"contact_no"}
                      formikProps={props}
                      label={t("contact Number")}
                      customType={"phone"}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={4}>
                    <MyInput
                      isRequired
                      name={"alt_number"}
                      formikProps={props}
                      label={t("Alt Number")}
                      customType={"phone"}
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
                      isRequired
                      name={"plan_id"}
                      formikProps={props}
                      label={t("Plan & Pricing")}
                      customType={"select"}
                      selectProps={{
                        data: planPricing,
                      }}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={4}>
                    <Form.Label>{t("Profile")}</Form.Label>
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
                            />{" "}
                            {t("PLEASE WAIT")}...
                          </>
                        ) : (
                          <>{edit.admin_id ? t("UPDATE") : t("CREATE")}</>
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

export default ContractorForm;
