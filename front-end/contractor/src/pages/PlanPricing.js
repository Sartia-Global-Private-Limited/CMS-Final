import React, { useEffect, useState } from "react";
import "react-best-tabs/dist/index.css";
import { Card, Col, Form, Row } from "react-bootstrap";
import { Helmet } from "react-helmet";
import {
  BsCheck2,
  BsPlus,
  BsPlusLg,
  BsWrenchAdjustableCircle,
  BsXLg,
} from "react-icons/bs";
import CardComponent from "../components/CardComponent";
import SwiperSlider from "../components/SwiperSlider";
import { SwiperSlide } from "swiper/react";
import TooltipComponent from "../components/TooltipComponent";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import TextareaAutosize from "react-textarea-autosize";
import {
  getAdminAllModule,
  getAdminAllPlanPricing,
  getAdminCreatePlanPricing,
  getAdminDeletePlanPricing,
  getAdminRenewPlanPricing,
  getAdminSinglePlanPricing,
  getAdminUpdatePlanPricing,
} from "../services/authapi";
import ActionButton from "../components/ActionButton";
import { toast } from "react-toastify";
import ConfirmAlert from "../components/ConfirmAlert";
import { FieldArray, Formik } from "formik";
import { addPlanPricingSchema } from "../utils/formSchema";
import Modaljs from "../components/Modal";
import { useSelector } from "react-redux";
import { selectUser } from "../features/auth/authSlice";

const PlanPricing = () => {
  const { t } = useTranslation();
  const { user } = useSelector(selectUser);
  const [edit, setEdit] = useState({});
  const [allModule, setAllModule] = useState([]);
  const [viewTask, setViewTask] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [showRenewAlert, setShowRenewAlert] = useState(false);
  const [planPricing, setPlanPricing] = useState([]);
  const [search, setSearch] = useState("");

  const fetchPlanPricingData = async () => {
    const res = await getAdminAllPlanPricing(search);
    if (res.status) {
      setPlanPricing(res.data);
    } else {
      setPlanPricing([]);
    }
  };

  const fetchAllModuleData = async () => {
    const res = await getAdminAllModule();
    if (res.status) {
      setAllModule(res.data);
    } else {
      setAllModule([]);
    }
  };

  const handleEdit = async (id) => {
    const res = await getAdminSinglePlanPricing(id);
    if (res.status) {
      const data = { ...res.data };
      const result = data.modules.map((itm) => {
        return {
          value: itm.module_id,
          label: itm.module_name,
        };
      });
      data["modules"] = result;
      setEdit(data);
    } else {
      setEdit({});
      toast.error(res.message);
    }
    setViewTask(true);
  };

  const handleDelete = async () => {
    const res = showRenewAlert
      ? await getAdminRenewPlanPricing({ plan_id: idToDelete })
      : await getAdminDeletePlanPricing(idToDelete);
    if (res.status) {
      toast.success(res.message);
      if (showRenewAlert == false) {
        setPlanPricing((prev) => prev.filter((itm) => itm.id !== +idToDelete));
      }
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
  };

  const handleFileChange = (e, setFieldValue) => {
    if (e.target.files) {
      setFieldValue("image", e.target.files[0]);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const module = values.modules?.map((itm) => itm.value);

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("price", values.price);
    formData.append("duration", values.duration.value);
    formData.append("description", values.description);
    formData.append("image", values.image);
    // formData.append('module', values.modules.value)
    formData.append("module", JSON?.stringify(module));
    formData.append(
      "planCheckLists",
      JSON?.stringify(
        values.planCheckLists?.map((item) => {
          return item?.checklist_name;
        })
      ) || [""]
    );

    if (edit.id) {
      formData.append("id", values.id);
    }

    // return console.log(...formData);

    const res = edit?.id
      ? await getAdminUpdatePlanPricing(formData)
      : await getAdminCreatePlanPricing(formData);
    if (res.status) {
      toast.success(res.message);
      resetForm();
      setViewTask(false);
    } else {
      toast.error(res.message);
    }
    setSubmitting(false);
    fetchPlanPricingData();
  };

  useEffect(() => {
    fetchPlanPricingData();
    fetchAllModuleData();
  }, [search]);

  return (
    <>
      <Helmet>
        <title>Plan & Pricing · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent
          search={true}
          searchOnChange={(e) => {
            setSearch(e.target.value);
          }}
          title={"Plan & Pricing"}
          icon={<BsPlus />}
          onclick={() => {
            setEdit({});
            setViewTask(true);
          }}
          tag={"Create"}
        >
          <SwiperSlider showpage={3}>
            {planPricing?.length > 0 ? null : (
              <div className="text-center">
                <img
                  className="p-3"
                  alt="no-result"
                  width="350"
                  src="assets/images/no-results.png"
                />
              </div>
            )}
            {planPricing?.map((item, ide) => (
              <SwiperSlide>
                <Card key={ide} className="bg-new py-2 text-center">
                  <Card.Body>
                    <ActionButton
                      editOnclick={() => handleEdit(item?.id)}
                      deleteOnclick={() => {
                        setIdToDelete(item.id);
                        setShowAlert(true);
                        setShowRenewAlert(false);
                      }}
                      hideEye={"d-none"}
                      custom={
                        item?.id == user?.plan_id ? (
                          <>
                            <div className={`vr hr-shadow`} />
                            <TooltipComponent title={"Renew your plan"}>
                              <span
                                onClick={() => {
                                  setIdToDelete(item.id);
                                  setShowAlert(true);
                                  setShowRenewAlert(true);
                                }}
                                className={`social-btn success-combo w-auto h-auto`}
                              >
                                Renew
                              </span>
                            </TooltipComponent>
                          </>
                        ) : null
                      }
                    />
                    <img
                      className="shadow p-1 mt-3"
                      width={70}
                      src={
                        item.image
                          ? `${process.env.REACT_APP_API_URL}${item.image}`
                          : "https://i.ibb.co/N9Kk8Zg/vscode-icons-file-type-kite.png"
                      }
                      alt={item.name}
                    />
                    <p className="mt-2 mb-0 text-green fw-bold fs-20">
                      {item.name}
                    </p>
                    {item?.planCheckLists?.map((checklist, id1) => (
                      <p
                        key={id1}
                        className="small text-start mb-0 mt-2 text-truncate2 line-clamp-2"
                      >
                        {/* {checklist?.status === 2 ? */}
                        <BsCheck2 className="social-btn-re p-2 me-2 success-combo" />
                        {/* : <BsX className='social-btn-re p-2 me-2 red-combo' />} */}
                        {checklist?.checklist_name}
                      </p>
                    ))}
                    <div className="hr-border2 pt-0 pb-4" />
                    <p className="mt-2 mb-0 fw-bold text-green fs-20">
                      ₹ {item.price} /{" "}
                      <span className="fs-15 text-orange">{item.duration}</span>
                    </p>
                    <div className="fs-11 text-start p-1 shadow mt-3 text-dark">
                      {t("modules")}:-
                      {item?.modules?.map((moduleData, id2) => (
                        <span key={id2} className="d-block text-gray">
                          <span className="fw-bold pe-1">{id2 + 1}.</span>
                          {moduleData.module_name}
                        </span>
                      ))}
                    </div>
                    <div className="fs-11 text-start p-1 shadow mt-3 text-dark">
                      {t("Description")}:-
                      <span className="d-block text-gray">
                        {item.description}
                      </span>
                    </div>
                  </Card.Body>
                </Card>
              </SwiperSlide>
            ))}
          </SwiperSlider>
        </CardComponent>
      </Col>

      <Formik
        enableReinitialize={true}
        initialValues={{
          id: edit.id || "",
          name: edit.name || "",
          price: edit.price || "",
          duration: edit.duration
            ? { label: edit.duration, value: edit.duration }
            : "",
          description: edit.description || "",
          image: edit.image || null,
          modules: edit.modules || "",
          planCheckLists: edit.planCheckLists || [""],
        }}
        validationSchema={addPlanPricingSchema}
        onSubmit={handleSubmit}
      >
        {(props) => (
          <Modaljs
            formikProps={props}
            open={viewTask}
            size={"md"}
            closebtn={"Cancel"}
            Savebtn={edit.id ? "Update" : "Submit"}
            close={() => setViewTask(false)}
            title={`${edit.id ? t("Update") : t("Create")} ${t(
              "Plan & Pricing"
            )}`}
          >
            <Row className="g-2">
              <Form.Group as={Col} md={12}>
                <Form.Label>{t("Select modules")}</Form.Label>
                <Select
                  isMulti
                  menuPosition="fixed"
                  closeMenuOnSelect={false}
                  name={"modules"}
                  options={allModule.map((module) => ({
                    label: module.title,
                    value: module.id,
                  }))}
                  value={props.values.modules}
                  onChange={(selectedOption) => {
                    props.setFieldValue("modules", selectedOption);
                  }}
                />
              </Form.Group>

              <Form.Group as={Col} md={6}>
                <Form.Label>{t("Name")}</Form.Label>
                <Form.Control
                  type="text"
                  name={"name"}
                  value={props.values.name}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(props.touched.name && props.errors.name)}
                />
                <Form.Control.Feedback type="invalid">
                  {props.errors.name}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md={6}>
                <Form.Label>{t("Price")}</Form.Label>
                <Form.Control
                  type="text"
                  name={"price"}
                  value={props.values.price}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(props.touched.price && props.errors.price)}
                />
                <Form.Control.Feedback type="invalid">
                  {props.errors.price}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md={6}>
                <Form.Label>{t("Duration")}</Form.Label>
                <Select
                  menuPosition="fixed"
                  name={"duration"}
                  options={[
                    { value: "week", label: "Week" },
                    { value: "month", label: "Month" },
                    { value: "year", label: "Year" },
                  ]}
                  value={props.values.duration}
                  onChange={(selectedOption) => {
                    props.setFieldValue("duration", selectedOption);
                  }}
                />
              </Form.Group>

              {edit.id ? (
                <>
                  <Form.Group as={Col} md={2}>
                    <img
                      width={50}
                      className="my-bg p-1 rounded"
                      src={`${process.env.REACT_APP_API_URL}/${edit?.image}`}
                      alt={edit?.name}
                    />{" "}
                  </Form.Group>
                  <Form.Group as={Col} md={4}>
                    <Form.Control
                      type="file"
                      name={"image"}
                      onChange={(e) => handleFileChange(e, props.setFieldValue)}
                    />
                  </Form.Group>
                </>
              ) : (
                <Form.Group as={Col} md={6}>
                  <Form.Label>{t("Upload Module Image")}</Form.Label>
                  <Form.Control
                    type="file"
                    name={"image"}
                    onChange={(e) => handleFileChange(e, props.setFieldValue)}
                  />
                </Form.Group>
              )}

              <Form.Group as={Col} md={12}>
                <Form.Label>{t("Description")}</Form.Label>
                <Col md={12}>
                  <TextareaAutosize
                    onChange={props.handleChange}
                    value={props.values.description}
                    name="description"
                    minRows={2}
                    className="edit-textarea"
                    placeholder="Add Description..."
                  />
                </Col>
              </Form.Group>

              <FieldArray name="planCheckLists">
                {({ remove, push }) => (
                  <Form.Group as={Col} md={12}>
                    <Form.Label>{t("Plan Points")}</Form.Label>
                    {props.values.planCheckLists?.length > 0 &&
                      props.values.planCheckLists?.map((checkList, index) => (
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
                      ))}
                    <button
                      type="button"
                      onClick={() => push("")}
                      className="shadow border-0 mb-3 p-1 success-combo cursor-pointer d-align gap-1"
                    >
                      <BsPlusLg className="cursor-pointer" />{" "}
                      {t("ADD PLAN POINTS")}
                    </button>
                  </Form.Group>
                )}
              </FieldArray>
            </Row>
          </Modaljs>
        )}
      </Formik>

      <ConfirmAlert
        size={"sm"}
        deleteFunction={handleDelete}
        hide={setShowAlert}
        show={showAlert}
        defaultIcon={<BsWrenchAdjustableCircle />}
        title={`Confirm ${showRenewAlert ? "Renew" : "Delete"}`}
        description={`Are you sure you want to ${
          showRenewAlert ? "renew" : "delete"
        } this!!`}
      />
    </>
  );
};

export default PlanPricing;
