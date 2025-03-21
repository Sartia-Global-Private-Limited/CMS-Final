import React, { useEffect, useState } from "react";
import "react-best-tabs/dist/index.css";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import { BsPlusLg, BsXLg } from "react-icons/bs";
import CardComponent from "../../components/CardComponent";
import TooltipComponent from "../../components/TooltipComponent";
import { useTranslation } from "react-i18next";
import {
  getAdminCreatePlanPricing,
  getAdminSinglePlanPricing,
  getAdminUpdatePlanPricing,
  getAllModuleByPlanId,
} from "../../services/authapi";
import { toast } from "react-toastify";
import ConfirmAlert from "../../components/ConfirmAlert";
import { FieldArray, Formik } from "formik";
import { addPlanPricingSchema } from "../../utils/formSchema";
import { useNavigate, useParams } from "react-router-dom";
import { getImageSrc } from "../../utils/helper";
import ImageViewer from "../../components/ImageViewer";
import MyInput from "../../components/MyInput";

const PlanPricingForm = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams();
  const [edit, setEdit] = useState({});
  const [allModule, setAllModule] = useState([]);
  const [showAlert, setShowAlert] = useState(false);

  const fetchPlanPricingData = async () => {
    const res = await getAdminSinglePlanPricing(id);
    if (res.status) {
      const data = { ...res.data };
      const result = data?.modules?.map((itm) => {
        return {
          value: itm.module_id,
          label: itm.module_name,
        };
      });
      data["modules"] = result;
      setEdit(data);
    } else {
      setEdit({});
    }
  };

  const fetchAllModuleData = async () => {
    const res = await getAllModuleByPlanId(3);
    if (res.status) {
      setAllModule(res.data);
    } else {
      setAllModule([]);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("price", values.price);
    formData.append("duration", values.duration);
    formData.append("description", values.description);
    formData.append("image", values.image);
    formData.append("module", JSON?.stringify(values.modules));
    formData.append(
      "planCheckLists",
      JSON?.stringify(
        values.planCheckLists?.map((item) => {
          return item?.checklist_name || "";
        })
      ) || [""]
    );
    if (edit.id) {
      formData?.append("id", values.id);
    }

    // const params =
    //   (await checkPermission({
    //     user_id: user.id,
    //     pathname: `/${pathname.split("/")[1]}`,
    //   })) || {};
    // params["action"] = edit?.id ? UPDATED : CREATED;

    // return console.log("values", params);

    const res = edit?.id
      ? await getAdminUpdatePlanPricing(formData)
      : await getAdminCreatePlanPricing(formData);
    if (res.status) {
      toast.success(res.message);
      navigate(-1);
      resetForm();
    } else {
      toast.error(res.message);
    }
    setSubmitting(false);
  };

  useEffect(() => {
    if (id) {
      fetchPlanPricingData();
    }
    fetchAllModuleData();
  }, []);

  const modifyModules = edit?.modules?.map((itm) => itm?.value);

  return (
    <>
      <Col md={12} data-aos={"fade-up"}>
        <CardComponent
          title={`${edit.id ? "Update" : "Create"} Plan`}
          showBackButton={true}
        >
          <Formik
            enableReinitialize={true}
            initialValues={{
              id: edit.id || "",
              name: edit.name || "",
              price: edit.price || "",
              duration: edit.duration || "",
              description: edit.description || "",
              image: edit.image || null,
              modules: modifyModules || [],
              planCheckLists: edit.planCheckLists || [""],
            }}
            validationSchema={addPlanPricingSchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props?.handleSubmit}>
                <Row className="g-3 align-items-end">
                  <Form.Group as={Col} md={12}>
                    <MyInput
                      isRequired
                      multiple
                      name={"modules"}
                      formikProps={props}
                      label={t("Select modules")}
                      customType={"select"}
                      selectProps={{
                        data: allModule?.map((item) => ({
                          label: item.title,
                          value: item.id,
                        })),
                      }}
                    />
                  </Form.Group>

                  <Form.Group as={Col} md={4}>
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
                    <Form.Control.Feedback type="invalid">
                      {props.errors.name}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} md={2}>
                    <Form.Label>
                      Price <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name={"price"}
                      value={props.values.price}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      isInvalid={Boolean(
                        props.touched.price && props.errors.price
                      )}
                    />
                    <Form.Control.Feedback type="invalid">
                      {props.errors.price}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} md={2}>
                    <MyInput
                      isRequired
                      name={"duration"}
                      formikProps={props}
                      label={t("Duration")}
                      customType={"select"}
                      selectProps={{
                        data: [
                          { value: "Monthly", label: "Monthly" },
                          { value: "Quarterly", label: "Quarterly" },
                          { value: "Half-Yearly", label: "Half-Yearly" },
                          { value: "Yearly", label: "Yearly" },
                          {
                            value: "Trial (15 days)",
                            label: "Trial (15 days)",
                          },
                        ],
                      }}
                    />
                  </Form.Group>

                  <Form.Group as={Col} md={4}>
                    <Form.Label>{t("Upload Module Image")}</Form.Label>
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
                    <MyInput
                      name={"description"}
                      formikProps={props}
                      label={t("Description")}
                      customType={"multiline"}
                    />
                  </Form.Group>

                  <FieldArray name="planCheckLists">
                    {({ remove, push }) => (
                      <Form.Group as={Col} md={12}>
                        <Form.Label>Plan Points</Form.Label>
                        {props.values.planCheckLists?.length > 0 &&
                          props.values.planCheckLists?.map(
                            (checkList, index) => (
                              <span key={index} className="d-align mb-3 gap-2">
                                <Form.Control
                                  onChange={props.handleChange}
                                  value={checkList.checklist_name}
                                  name={`planCheckLists.${index}.checklist_name`}
                                  className="fw-bold"
                                  type="text"
                                />

                                {index === 0 ? null : (
                                  <TooltipComponent title={t("Delete")}>
                                    <button
                                      type="button"
                                      onClick={() => remove(index)}
                                      className="shadow border-0 p-2 red-combo d-align"
                                    >
                                      <BsXLg className="cursor-pointer" />
                                    </button>
                                  </TooltipComponent>
                                )}
                              </span>
                            )
                          )}
                        <button
                          type="button"
                          onClick={() => push("")}
                          className="shadow border-0 mb-3 p-1 success-combo cursor-pointer d-align gap-1"
                        >
                          <BsPlusLg className="cursor-pointer" /> ADD PLAN
                          POINTS
                        </button>
                      </Form.Group>
                    )}
                  </FieldArray>

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
                            />{" "}
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

export default PlanPricingForm;
