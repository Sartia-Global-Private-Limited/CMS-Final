import React, { useEffect, useState } from "react";
import { Form, Col, Row, Spinner, FormText } from "react-bootstrap";
import { Helmet } from "react-helmet";
import CardComponent from "../../components/CardComponent";
import Select from "react-select";
import { ErrorMessage, Formik } from "formik";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";
import { useTranslation } from "react-i18next";
import ConfirmAlert from "../../components/ConfirmAlert";
import {
  getallAreaManagerInEnergyCompany,
  getAreaManagerInEnergyCompanyById,
  postEnergyCompany,
  updateEnergyCompany,
} from "../../services/contractorApi";
import { toast } from "react-toastify";
import { getAllEneryComnies } from "../../services/authapi";
import { addEnergyCompanySchema } from "../../utils/formSchema";

const CreateTeam = ({ checkPermission }) => {
  const [edit, setEdit] = useState({});
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || null;
  const [showAlert, setShowAlert] = useState(false);
  const [allAreaName, setAllAreaName] = useState([]);
  const [allEnergy, setAllEnergy] = useState([]);
  const [energyCompanyId, setEnergyCompanyId] = useState("");
  const { id } = useParams();
  const location = useLocation();
  const energyId = location?.state?.energy_company_id;

  const { t } = useTranslation();
  const navigate = useNavigate();

  const fetchAllAreaManagerData = async (id, energy_company_id) => {
    const res = await getallAreaManagerInEnergyCompany(id, energy_company_id);
    if (res.status) {
      setAllAreaName(res.data);
    } else {
      setAllAreaName([]);
      toast.error(res.message);
    }
  };
  // console.log(energyId, energyCompanyId, "fetchEnergyCompanyById");

  const fetchEnergyCompanyById = async () => {
    const res = await getAreaManagerInEnergyCompanyById({
      id: energyId,
      user_id: id,
    });
    if (res.status) {
      setEdit(res.data);
      fetchAllAreaManagerData(
        res.data?.area_name_id,
        res.data?.energy_company_id
      );
    } else {
      setEdit([]);
    }
  };
  const fetchEnergyData = async () => {
    const res = await getAllEneryComnies();
    if (res.status) {
      const rData = res.data.map((itm) => {
        return {
          value: itm.energy_company_id,
          label: itm.name,
        };
      });
      setAllEnergy(rData);
    } else {
      setAllEnergy([]);
    }
  };
  useEffect(() => {
    if (id !== "new") {
      fetchEnergyCompanyById();
    }
    fetchEnergyData();
  }, []);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      email: values.email,
      username: values.username,
      password: values.password,
      contact_no: String(values.contact_no),
      alt_number: values.alt_number,
      address: values.address,
      status: values.status.value,
      country: values.country,
      city: values.city,
      pin_code: values.pin_code,
      joining_date: values.joining_date,
      area_name: values.area_name?.value,
      area_selected: values.area_selected?.value,
      energy_company_id: values.energy_company_id.value,
      description: values.description,
      transfer_date: values?.transfer_date,
    };
    if (edit.user_id) {
      sData["id"] = edit.user_id;
    }

    const res = edit?.user_id
      ? await updateEnergyCompany(sData)
      : await postEnergyCompany(sData);
    if (res.status) {
      toast.success(res.message);
      navigate(-1);
      resetForm();
    } else {
      toast.error(res.message);
    }

    setSubmitting(false);
  };
  return (
    <>
      <Helmet>
        <title>Create Energy team management · CMS Electricals </title>
      </Helmet>
      <Col md={12}>
        <CardComponent
          // {edit && showBackButton={true}}

          title={`${
            type === "view" ? "View" : edit.user_id ? "Update" : "Create"
          } Energy team member`}
          className={"my-2"}
        >
          <Col md={12}>
            <Formik
              enableReinitialize={true}
              initialValues={{
                energy_company_id: edit?.energy_company_id
                  ? {
                      label: edit?.energy_company_name,
                      value: edit?.energy_company_id,
                    }
                  : "",
                email: edit.email || "",
                username: edit.username || "",
                password: edit.password || "",
                contact_no: edit.mobile || "",
                alt_number: edit.alt_number || "",
                address: edit.address || "",
                status: edit.status
                  ? {
                      label: edit.status == "1" ? "Active" : "InActive",
                      value: parseInt(edit.status),
                    }
                  : { label: "Active", value: 1 },
                joining_date: edit.joining_date || "",
                area_name: edit?.area_name
                  ? {
                      label: edit?.area_name,
                      value: edit?.area_name_id,
                    }
                  : "",
                area_selected: edit?.area_selected
                  ? {
                      label: edit?.area_selected,
                      value: edit?.area_selected_id,
                    }
                  : "",
                country: edit.country || "",
                city: edit.city || "",
                pin_code: edit.pin_code || "",
                description: edit.description || "",
                transfer_date: edit.transfer_date || "",
              }}
              validationSchema={addEnergyCompanySchema}
              onSubmit={handleSubmit}
            >
              {(props) => (
                <Form onSubmit={props.handleSubmit}>
                  <Row className="mt-2 g-2">
                    <Form.Group as={Col} md="4">
                      <Form.Label>
                        {t("Energy Company Name")}
                        <span className="text-danger fw-bold">*</span>
                      </Form.Label>
                      <Select
                        menuPortalTarget={document.body}
                        className="text-primary"
                        name="energy_company_id"
                        value={props.values.energy_company_id}
                        onChange={(val) => {
                          props.setFieldValue("energy_company_id", val);
                          setEnergyCompanyId(val.value);
                        }}
                        onBlur={props.handleBlur}
                        options={allEnergy}
                        isInvalid={Boolean(
                          props.touched.energy_company_id &&
                            props.errors.energy_company_id
                        )}
                      />
                      <ErrorMessage
                        name="energy_company_id"
                        component="small"
                        className="text-danger"
                      />
                    </Form.Group>

                    <Form.Group as={Col} md="4">
                      <Form.Label>
                        {t("username")} <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name={"username"}
                        value={props.values.username}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        isInvalid={Boolean(
                          props.touched.username && props.errors.username
                        )}
                      />
                      <Form.Control.Feedback type="invalid">
                        {props.errors.username}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col} md="4">
                      <Form.Label>
                        {t("contact no")} <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="number"
                        maxLength={10}
                        name={"contact_no"}
                        value={props.values.contact_no}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        isInvalid={Boolean(
                          props.touched.contact_no && props.errors.contact_no
                        )}
                      />
                      <Form.Control.Feedback type="invalid">
                        {props.errors.contact_no}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col} md="4">
                      <Form.Label>{t("alt number")}</Form.Label>
                      <Form.Control
                        type="text"
                        maxLength={10}
                        name={"alt_number"}
                        value={props.values.alt_number}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        isInvalid={Boolean(
                          props.touched.alt_number && props.errors.alt_number
                        )}
                      />
                      <Form.Control.Feedback type="invalid">
                        {props.errors.alt_number}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col} md="4">
                      <Form.Label>{t("Status")}</Form.Label>
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

                    <Form.Group as={Col} md="4">
                      <Form.Label>{t("country")}</Form.Label>
                      <Form.Control
                        type="text"
                        name={"country"}
                        value={props.values.country}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        isInvalid={Boolean(
                          props.touched.country && props.errors.country
                        )}
                      />
                      <Form.Control.Feedback type="invalid">
                        {props.errors.country}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col} md="4">
                      <Form.Label>{t("city")}</Form.Label>
                      <Form.Control
                        type="text"
                        name={"city"}
                        value={props.values.city}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        isInvalid={Boolean(
                          props.touched.city && props.errors.city
                        )}
                      />
                      <Form.Control.Feedback type="invalid">
                        {props.errors.city}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col} md="4">
                      <Form.Label>{t("pin code")}</Form.Label>
                      <Form.Control
                        type="text"
                        name={"pin_code"}
                        value={props.values.pin_code}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        isInvalid={Boolean(
                          props.touched.pin_code && props.errors.pin_code
                        )}
                      />
                      <Form.Control.Feedback type="invalid">
                        {props.errors.pin_code}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col} md="4">
                      <Form.Label>
                        {t("Joining Date")}{" "}
                        {/* <span className="text-danger">*</span> */}
                      </Form.Label>
                      <Form.Control
                        type="date"
                        name={"joining_date"}
                        value={props.values.joining_date}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        isInvalid={Boolean(
                          props.touched.joining_date &&
                            props.errors.joining_date
                        )}
                      />
                      <Form.Control.Feedback type="invalid">
                        {props.errors.joining_date}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col} md="4">
                      <Form.Label>
                        {t("Area Name")} <span className="text-danger">*</span>
                      </Form.Label>
                      <Select
                        className="text-primary w-100"
                        menuPortalTarget={document.body}
                        name="area_name"
                        options={[
                          {
                            label: "Zone",
                            value: 1,
                          },
                          {
                            label: "Regional",
                            value: 2,
                          },
                          {
                            label: "Sales Area",
                            value: 3,
                          },
                          {
                            label: "District",
                            value: 4,
                          },
                          {
                            label: "Outlets",
                            value: 5,
                          },
                        ]}
                        value={props.values?.area_name}
                        onChange={(val) => {
                          props.setFieldValue("area_name", val);
                          props.setFieldValue("area_selected", "");
                          fetchAllAreaManagerData(
                            val.value,
                            energyCompanyId || energyId
                          );
                        }}
                      />
                      <ErrorMessage
                        name="area_name"
                        component="small"
                        className="text-danger"
                      />
                    </Form.Group>

                    {props.values?.area_name.label ? (
                      <Form.Group as={Col} md="4">
                        <Form.Label>
                          {props.values?.area_name.label}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Select
                          menuPortalTarget={document.body}
                          name={"area_selected"}
                          options={allAreaName.map((data) => ({
                            label: data.area_name,
                            value: data.id,
                          }))}
                          value={props.values.area_selected}
                          onChange={(selectedOption) => {
                            props.setFieldValue(
                              "area_selected",
                              selectedOption
                            );
                          }}
                        />
                        <ErrorMessage
                          name="area_selected"
                          component="small"
                          className="text-danger"
                        />
                      </Form.Group>
                    ) : null}

                    {edit.user_id && (
                      <Form.Group as={Col} md="4">
                        <Form.Label>
                          {t("Transfer Date")}{" "}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="date"
                          name={"transfer_date"}
                          value={props.values.transfer_date}
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          isInvalid={Boolean(
                            props.touched.transfer_date &&
                              props.errors.transfer_date
                          )}
                        />
                        <Form.Control.Feedback type="invalid">
                          {props.errors.transfer_date}
                        </Form.Control.Feedback>
                      </Form.Group>
                    )}

                    <Form.Group as={Col} md="12">
                      <Form.Label>{t("address")}</Form.Label>
                      <TextareaAutosize
                        minRows={2}
                        className="edit-textarea"
                        name={"address"}
                        value={props.values.address}
                        onChange={props.handleChange}
                      />
                    </Form.Group>

                    <Form.Group as={Col} md="12">
                      <Form.Label>{t("Description")}</Form.Label>
                      <TextareaAutosize
                        minRows={2}
                        className="edit-textarea"
                        name={"description"}
                        value={props.values.description}
                        onChange={props.handleChange}
                      />
                    </Form.Group>

                    <Form.Group as={Col} md={12}>
                      <div className="shadow mt-2 p-3">
                        <Form.Group as={Row} className="mb-3">
                          <Form.Label column>
                            {t("User Email")}
                            <span className="text-danger fw-bold">*</span>
                          </Form.Label>
                          <Col sm={8}>
                            <Form.Control
                              type="email"
                              value={props.values.email}
                              onChange={props.handleChange}
                              name={"email"}
                              onBlur={props.handleBlur}
                              isInvalid={Boolean(
                                props.touched.email && props.errors.email
                              )}
                            />
                            <Form.Control.Feedback type="invalid">
                              {props.errors.email}
                            </Form.Control.Feedback>
                          </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                          <Form.Label column>
                            {t("Password")}
                            {edit?.id ? null : (
                              <span className="text-danger fw-bold">*</span>
                            )}
                          </Form.Label>
                          <Col sm={8}>
                            <div className="d-grid gap-1">
                              <Form.Control
                                type="password"
                                value={props.values.password}
                                onChange={props.handleChange}
                                name="password"
                                onBlur={props.handleBlur}
                                isInvalid={Boolean(
                                  props.touched.password &&
                                    props.errors.password
                                )}
                              />
                              <Form.Control.Feedback type="invalid">
                                {props.errors.password}
                              </Form.Control.Feedback>
                              {edit?.user_id ? (
                                <FormText>
                                  {t(
                                    "Password is encrypted. If you don't want to change it, leave it blank"
                                  )}
                                  .
                                </FormText>
                              ) : null}
                            </div>
                          </Col>
                        </Form.Group>
                      </div>
                    </Form.Group>

                    <Col md={12}>
                      <div className="mt-4 text-center">
                        <button
                          type={`${edit.user_id ? "button" : "submit"}`}
                          onClick={() => setShowAlert(edit.user_id && true)}
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
                              {t("PLEASE WAIT")}...
                            </>
                          ) : (
                            <>{edit.user_id ? t("UPDATE") : t("CREATE")}</>
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
                    </Col>
                  </Row>
                </Form>
              )}
            </Formik>
          </Col>
        </CardComponent>
      </Col>
    </>
  );
};

export default CreateTeam;
