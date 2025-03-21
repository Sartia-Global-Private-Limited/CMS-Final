import React, { useEffect, useRef, useState } from "react";
import { Form, Col, Row, Spinner, Image, FormText } from "react-bootstrap";
import { Helmet } from "react-helmet";
import CardComponent from "../../components/CardComponent";
import Select from "react-select";
import { ErrorMessage, Formik } from "formik";
import {
  getAdminDistrictOnSaId,
  getAdminEnergyCompanyassignZone,
  getAllEneryComnies,
  getRoOnZoneId,
  getSalesOnRoId,
} from "../../services/authapi";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  getAllOutletById,
  getOutletById,
  postOutlet,
  updateOutlet,
} from "../../services/contractorApi";
import { toast } from "react-toastify";
import ConfirmAlert from "../../components/ConfirmAlert";
import ImageViewer from "../../components/ImageViewer";
import ViewOutlet from "./ViewOutlet";
import { useTranslation } from "react-i18next";
import { addOutletsSchema, updateOutletsSchema } from "../../utils/formSchema";

const CreateOutlet = () => {
  const [outletdata, setOutletData] = useState([]);
  const [edit, setEdit] = useState({});
  const [allEnergy, setAllEnergy] = useState([]);
  const [allZones, setAllZones] = useState([]);
  const [allRo, setAllRo] = useState([]);
  const [allSa, setAllSa] = useState([]);
  const [allDistrict, setAllDistrict] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || null;

  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const image_file_ref = useRef(null);

  const fetchOutletById = async () => {
    const res = await getAllOutletById(id);
    if (res.status) {
      setEdit(res.data);
      fetchZoneData(res.data.energy_company_id);
      fetchRoData(res.data.zone_id);
      fetchSaData(res.data.regional_office_id);
      fetchDistrictData(res.data.sales_area_id);
    } else {
      setEdit([]);
    }
  };
  const fetchEnergyCompanyData = async () => {
    const res = await getAllEneryComnies();
    if (res.status) {
      const rData = res.data.map((data) => {
        return {
          value: data.energy_company_id,
          label: data.name,
        };
      });
      setAllEnergy(rData);
    } else {
      setAllEnergy([]);
    }
  };

  const fetchZoneData = async (value) => {
    const res = await getAdminEnergyCompanyassignZone(value);

    if (res.status) {
      const rData = res.data.map((data) => {
        return {
          value: data.zone_id,
          label: data.zone_name,
        };
      });
      setAllZones(rData);
    } else {
      setAllZones([]);
    }
  };

  const fetchRoData = async (value) => {
    const res = await getRoOnZoneId(value);

    if (res.status) {
      const rData = res.data.map((data) => {
        return {
          value: data.ro_id,
          label: data.regional_office_name,
        };
      });
      setAllRo(rData);
    } else {
      setAllRo([]);
    }
  };

  const fetchSaData = async (value) => {
    const res = await getSalesOnRoId(value);

    if (res.status) {
      const rData = res.data.map((data) => {
        return {
          value: data.id,
          label: data.sales_area_name,
        };
      });
      setAllSa(rData);
    } else {
      setAllSa([]);
    }
  };

  const fetchDistrictData = async (value) => {
    const res = await getAdminDistrictOnSaId(value);
    if (res.status) {
      const rData = res.data.map((data) => {
        return {
          value: data.district_id,
          label: data.district_name,
        };
      });
      setAllDistrict(rData);
    } else {
      setAllDistrict([]);
    }
  };

  const getImageUrl = (file) => {
    const type = file.name ? "new" : "edit";
    if (type == "new") {
      const url = URL.createObjectURL(file);
      return url;
    } else {
      const url = `${process.env.REACT_APP_API_URL}${file}`;
      return url;
    }
  };

  useEffect(() => {
    if (id !== "new") {
      fetchOutletById();
    }
    fetchEnergyCompanyData();
  }, []);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();
    formData.append("energy_company_id", values.energy_company_id.value);
    formData.append("zone_id", Array.of(values.zone_id.value));
    formData.append("regional_id", Array.of(values.regional_id.value));
    formData.append("sales_area_id", Array.of(values.sales_area_id.value));
    formData.append("district_id", Array.of(values.district_id.value));
    formData.append("outlet_name", values.outlet_name);
    formData.append("outlet_unique_id", values.outlet_unique_id);
    formData.append("outlet_contact_number", values.outlet_contact_number);
    formData.append("customer_code", values.customer_code);
    formData.append("outlet_category", values.outlet_category);
    formData.append("outlet_ccnoms", values.outlet_ccnoms);
    formData.append("outlet_ccnohsd", values.outlet_ccnohsd);
    formData.append(
      "outlet_contact_person_name",
      values.outlet_contact_person_name
    );
    formData.append("primary_number", values.primary_number);
    formData.append("secondary_number", values.secondary_number);
    formData.append("primary_email", values.primary_email);
    formData.append("secondary_email", values.secondary_email);
    formData.append("location", values.location);
    formData.append("address", values.address);
    formData.append("outlet_resv", values.outlet_resv);
    formData.append("outlet_longitude", values.outlet_longitude);
    formData.append("outlet_lattitude", values.outlet_lattitude);
    formData.append("status", 1);
    formData.append("image", values.image);
    formData.append("email", values.email);
    formData.append("password", values.password);

    if (edit.id) {
      formData.append("id", edit.id);
    }

    // return console.log(formData, "formdata");
    const res = edit?.id
      ? await updateOutlet(formData)
      : await postOutlet(formData);

    if (res.status) {
      toast.success(res.message);
      navigate(-1);
      resetForm();
    } else {
      toast.error(res.message);
    }
    setSubmitting(false);
    setShowAlert(false);
  };
  return (
    <>
      <Helmet>
        <title>Create Outlet Management · CMS Electricals </title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent
          title={`${
            type === "view" ? "View" : edit?.id ? "Update" : "Create"
          } Outlet`}
          className={type === "view" && "after-bg-light"}
        >
          <Formik
            enableReinitialize={true}
            initialValues={{
              energy_company_id: edit.energy_company_id
                ? {
                    label: edit?.energy_company_name,
                    value: edit?.energy_company_id,
                  }
                : "",
              zone_id: edit.zone_id
                ? {
                    label: edit?.zone_name,
                    value: edit?.zone_id,
                  }
                : "",
              regional_id: edit.regional_office_id
                ? {
                    label: edit?.regional_office_name,
                    value: edit?.regional_office_id,
                  }
                : "",
              sales_area_id: edit.sales_area_id
                ? {
                    label: edit?.sales_area_name,
                    value: edit?.sales_area_id,
                  }
                : "",
              district_id: edit.district_id
                ? {
                    label: edit?.district_name,
                    value: edit?.district_id,
                  }
                : "",
              outlet_name: edit.outlet_name || "",
              password: edit.password || "",
              outlet_unique_id: edit.outlet_unique_id || "",
              outlet_contact_number: edit.outlet_contact_number || "",
              customer_code: edit.customer_code || "",
              outlet_category: edit.outlet_category || "",
              outlet_ccnoms: edit.outlet_ccnoms || "",
              outlet_ccnohsd: edit.outlet_ccnohsd || "",
              outlet_contact_person_name: edit.outlet_contact_person_name || "",
              primary_number: edit.primary_number || "",
              secondary_number: edit.secondary_number || "",
              primary_email: edit.primary_email || "",
              secondary_email: edit.secondary_email || "",
              location: edit.location || "",
              address: edit.address || "",
              outlet_resv: edit.outlet_resv || "",
              outlet_longitude: edit.outlet_longitude || "",
              outlet_lattitude: edit.outlet_lattitude || "",
              image: edit.outlet_image || "",
              email: edit.email || "",
              password: edit.password || "",
            }}
            validationSchema={edit.id ? updateOutletsSchema : addOutletsSchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props?.handleSubmit}>
                <Row className="g-3">
                  {type === "view" ? (
                    <ViewOutlet edit={edit} />
                  ) : (
                    <>
                      <Form.Group as={Col} md={4}>
                        <Form.Label>
                          {t("Energy Company Name")}
                          <span className="text-danger fw-bold">*</span>
                        </Form.Label>

                        <Select
                          menuPortalTarget={document.body}
                          name="energy_company_id"
                          value={props?.values.energy_company_id}
                          className="text-primary "
                          placeholder="--Select--"
                          onChange={(val) => {
                            props.setFieldValue("energy_company_id", val);

                            fetchZoneData(val.value);
                            if (edit.id) {
                              props.setFieldValue("zone_id", "");
                              props.setFieldValue("regional_id", "");
                              props.setFieldValue("sales_area_id", "");
                              props.setFieldValue("district_id", "");
                            }
                          }}
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

                      <Form.Group as={Col} md={4}>
                        <Form.Label>
                          {t("Zone Name")}
                          <span className="text-danger fw-bold">*</span>
                        </Form.Label>
                        <Select
                          menuPortalTarget={document.body}
                          name="zone_id"
                          value={props?.values.zone_id}
                          className="text-primary w-100"
                          placeholder="--Select--"
                          onChange={(val) => {
                            props.setFieldValue("zone_id", val);
                            fetchRoData(val.value);
                            if (edit.id) {
                              props.setFieldValue("sales_area_id", "");
                              props.setFieldValue("district_id", "");
                              props.setFieldValue("regional_id", "");
                            }
                          }}
                          options={allZones}
                          isInvalid={Boolean(
                            props.touched.zone_id && props.errors.zone_id
                          )}
                        />

                        <ErrorMessage
                          name="zone_id"
                          component="small"
                          className="text-danger"
                        />
                      </Form.Group>
                      <Form.Group as={Col} md={4}>
                        <Form.Label>
                          {t("Regional Office Name")}
                          <span className="text-danger fw-bold">*</span>
                        </Form.Label>
                        <Select
                          menuPortalTarget={document.body}
                          name="regional_id"
                          value={props?.values.regional_id}
                          className="text-primary w-100"
                          placeholder="--Select--"
                          onChange={(val) => {
                            props.setFieldValue("regional_id", val);
                            fetchSaData(val.value);
                            if (edit.id) {
                              props.setFieldValue("sales_area_id", "");
                              props.setFieldValue("district_id", "");
                            }
                          }}
                          options={allRo}
                          isInvalid={Boolean(
                            props.touched.regional_id &&
                              props.errors.regional_id
                          )}
                        />

                        <ErrorMessage
                          name="regional_id"
                          component="small"
                          className="text-danger"
                        />
                      </Form.Group>
                      <Form.Group as={Col} md={4}>
                        <Form.Label>
                          {t("Sales Area Name")}
                          <span className="text-danger fw-bold">*</span>
                        </Form.Label>
                        <Select
                          name="sales_area_id"
                          value={props?.values.sales_area_id}
                          onChange={(val) => {
                            props.setFieldValue("sales_area_id", val);
                            fetchDistrictData(val.value);
                            if (edit.id) {
                              props.setFieldValue("district_id", "");
                            }
                          }}
                          className="text-primary w-100"
                          placeholder="--Select--"
                          options={allSa}
                          isInvalid={Boolean(
                            props.touched.sales_area_id &&
                              props.errors.sales_area_id
                          )}
                        />
                        <ErrorMessage
                          name="sales_area_id"
                          component="small"
                          className="text-danger"
                        />
                      </Form.Group>
                      <Form.Group as={Col} md={4}>
                        <Form.Label>
                          {t("District Name")}
                          <span className="text-danger fw-bold">*</span>
                        </Form.Label>
                        <Select
                          name="district_id"
                          value={props?.values.district_id}
                          onChange={(val) => {
                            props.setFieldValue("district_id", val);
                          }}
                          className="text-primary w-100"
                          placeholder="--Select--"
                          options={allDistrict}
                          isInvalid={Boolean(
                            props.touched.district_id &&
                              props.errors.district_id
                          )}
                        />
                        <ErrorMessage
                          name="district_id"
                          component="small"
                          className="text-danger"
                        />
                      </Form.Group>
                      <Form.Group as={Col} md={4}>
                        <Form.Label>
                          {t("Outlet Unique Id")}
                          <span className="text-danger fw-bold">*</span>
                        </Form.Label>
                        <Form.Control
                          name="outlet_unique_id"
                          value={props?.values.outlet_unique_id}
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          type="text"
                          isInvalid={Boolean(
                            props.touched.outlet_unique_id &&
                              props.errors.outlet_unique_id
                          )}
                        />
                        <ErrorMessage
                          name="outlet_unique_id"
                          component="small"
                          className="text-danger"
                        />
                      </Form.Group>

                      <Form.Group as={Col} md={4}>
                        <Form.Label>
                          {t("Outlet Name")}
                          <span className="text-danger fw-bold">*</span>
                        </Form.Label>
                        <Form.Control
                          name="outlet_name"
                          value={props?.values.outlet_name}
                          type="text"
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          isInvalid={Boolean(
                            props.touched.outlet_name &&
                              props.errors.outlet_name
                          )}
                        />
                        <ErrorMessage
                          name="outlet_name"
                          component="small"
                          className="text-danger"
                        />
                      </Form.Group>

                      <Form.Group as={Col} md={4}>
                        <Form.Label>
                          {t("Outlet Contact Number")}
                          <span className="text-danger fw-bold">*</span>
                        </Form.Label>
                        <Form.Control
                          name="outlet_contact_number"
                          value={props?.values.outlet_contact_number}
                          type="number"
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          isInvalid={Boolean(
                            props.touched.outlet_contact_number &&
                              props.errors.outlet_contact_number
                          )}
                        />
                        <ErrorMessage
                          name="outlet_contact_number"
                          component="small"
                          className="text-danger"
                        />
                      </Form.Group>

                      <Form.Group as={Col} md={4}>
                        <Form.Label>
                          {t("Customer Code")}
                          <span className="text-danger fw-bold">*</span>
                        </Form.Label>
                        <Form.Control
                          name="customer_code"
                          value={props?.values.customer_code}
                          type="text"
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          isInvalid={Boolean(
                            props.touched.customer_code &&
                              props.errors.customer_code
                          )}
                        />
                        <ErrorMessage
                          name="customer_code"
                          component="small"
                          className="text-danger"
                        />
                      </Form.Group>
                      <Form.Group as={Col} md={4}>
                        <Form.Label>
                          {t("Outlet Category")}
                          <span className="text-danger fw-bold">*</span>
                        </Form.Label>
                        <Form.Control
                          name="outlet_category"
                          value={props?.values.outlet_category}
                          type="text"
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          isInvalid={Boolean(
                            props.touched.outlet_category &&
                              props.errors.outlet_category
                          )}
                        />
                        <ErrorMessage
                          name="outlet_category"
                          component="small"
                          className="text-danger"
                        />
                      </Form.Group>
                      <Form.Group as={Col} md={4}>
                        <Form.Label>
                          {t("Outlet CCNOMS")}
                          <span className="text-danger fw-bold">*</span>
                        </Form.Label>
                        <Form.Control
                          name="outlet_ccnoms"
                          value={props?.values.outlet_ccnoms}
                          type="text"
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          isInvalid={Boolean(
                            props.touched.outlet_ccnoms &&
                              props.errors.outlet_ccnoms
                          )}
                        />
                        <ErrorMessage
                          name="outlet_ccnoms"
                          component="small"
                          className="text-danger"
                        />
                      </Form.Group>
                      <Form.Group as={Col} md={4}>
                        <Form.Label>
                          {t("Outlet CCNOHSD")}
                          <span className="text-danger fw-bold">*</span>
                        </Form.Label>
                        <Form.Control
                          name="outlet_ccnohsd"
                          value={props?.values.outlet_ccnohsd}
                          type="text"
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          isInvalid={Boolean(
                            props.touched.outlet_ccnohsd &&
                              props.errors.outlet_ccnohsd
                          )}
                        />
                        <ErrorMessage
                          name="outlet_ccnohsd"
                          component="small"
                          className="text-danger"
                        />
                      </Form.Group>

                      <Form.Group as={Col} md={8}>
                        <Form.Label id="image">{t("image")}</Form.Label>

                        <Form.Control
                          ref={image_file_ref}
                          type="file"
                          name="image"
                          accept="image/png, image/jpeg, image/jpg, image/jfif "
                          onChange={(e) => {
                            // setSelectedFile(e.currentTarget.files[0]);
                            props.setFieldValue("image", e.target.files[0]);
                          }}
                        />

                        {props.values.image && (
                          <Form.Group as={Col} md={4}>
                            <div className="position-relative d-flex">
                              <ImageViewer
                                src={getImageUrl(props.values.image)}
                              >
                                <Image
                                  style={{
                                    height: "120px",
                                    width: "100%",
                                    maxWidth: "100%",
                                  }}
                                  className="object-fit mt-1"
                                  src={getImageUrl(props.values.image)}
                                />
                              </ImageViewer>

                              <button
                                type="button"
                                onClick={() => {
                                  props.setFieldValue("image", "");
                                  if (image_file_ref.current) {
                                    image_file_ref.current.value = "";
                                  }
                                }}
                                className="shadow border-0 danger-combo cursor-pointer px-4 py-1 my-1"
                              >
                                X
                              </button>
                            </div>
                          </Form.Group>
                        )}
                      </Form.Group>
                      <Form.Group as={Col} md={4}>
                        <Form.Label>
                          {t("Outlet Contact Person Name")}
                          <span className="text-danger fw-bold">*</span>
                        </Form.Label>
                        <Form.Control
                          name="outlet_contact_person_name"
                          value={props?.values.outlet_contact_person_name}
                          type="text"
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          isInvalid={Boolean(
                            props.touched.outlet_contact_person_name &&
                              props.errors.outlet_contact_person_name
                          )}
                        />
                        <ErrorMessage
                          name="outlet_contact_person_name"
                          component="small"
                          className="text-danger"
                        />
                      </Form.Group>
                      <Form.Group as={Col} md={4}>
                        <Form.Label>
                          {t("Primary Number")}
                          <span className="text-danger fw-bold">*</span>
                        </Form.Label>
                        <Form.Control
                          name="primary_number"
                          value={props?.values.primary_number}
                          type="phone"
                          maxLength={10}
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          isInvalid={Boolean(
                            props.touched.primary_number &&
                              props.errors.primary_number
                          )}
                        />{" "}
                        <ErrorMessage
                          name="primary_number"
                          component="small"
                          className="text-danger"
                        />
                      </Form.Group>
                      <Form.Group as={Col} md={4}>
                        <Form.Label>{t("Secondary Number")}</Form.Label>
                        <Form.Control
                          name="secondary_number"
                          value={props?.values.secondary_number}
                          type="phone"
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          isInvalid={Boolean(
                            props.touched.secondary_number &&
                              props.errors.secondary_number
                          )}
                          maxLength={10}
                        />
                        <ErrorMessage
                          name="secondary_number"
                          component="small"
                          className="text-danger"
                        />
                      </Form.Group>
                      <Form.Group as={Col} md={4}>
                        <Form.Label>
                          {t("Primary Email")}
                          <span className="text-danger fw-bold">*</span>
                        </Form.Label>
                        <Form.Control
                          name="primary_email"
                          value={props?.values.primary_email}
                          type="email"
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          isInvalid={Boolean(
                            props.touched.primary_email &&
                              props.errors.primary_email
                          )}
                        />
                        <ErrorMessage
                          name="primary_email"
                          component="small"
                          className="text-danger"
                        />
                      </Form.Group>
                      <Form.Group as={Col} md={4}>
                        <Form.Label>{t("Secondary Email")}</Form.Label>
                        <Form.Control
                          name="secondary_email"
                          value={props?.values.secondary_email}
                          type="email"
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          isInvalid={Boolean(
                            props.touched.secondary_email &&
                              props.errors.secondary_email
                          )}
                        />
                        <ErrorMessage
                          name="secondary_email"
                          component="small"
                          className="text-danger"
                        />
                      </Form.Group>
                      <Form.Group as={Col} md={4}>
                        <Form.Label>
                          {t("Location")}
                          <span className="text-danger fw-bold">*</span>
                        </Form.Label>
                        <Form.Control
                          name="location"
                          value={props?.values.location}
                          type="text"
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          isInvalid={Boolean(
                            props.touched.location && props.errors.location
                          )}
                        />
                        <ErrorMessage
                          name="location"
                          component="small"
                          className="text-danger"
                        />
                      </Form.Group>
                      <Form.Group as={Col} md={4}>
                        <Form.Label>
                          {t("Address")}{" "}
                          <span className="text-danger fw-bold">*</span>
                        </Form.Label>
                        <Form.Control
                          name="address"
                          value={props?.values.address}
                          type="text"
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          isInvalid={Boolean(
                            props.touched.address && props.errors.address
                          )}
                        />{" "}
                        <ErrorMessage
                          name="address"
                          component="small"
                          className="text-danger"
                        />
                      </Form.Group>
                      <Form.Group as={Col} md={4}>
                        <Form.Label>
                          {t("Outlet RESV")}
                          <span className="text-danger fw-bold"></span>
                        </Form.Label>
                        <Form.Control
                          name="outlet_resv"
                          value={props?.values.outlet_resv}
                          type="text"
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          isInvalid={Boolean(
                            props.touched.outlet_resv &&
                              props.errors.outlet_resv
                          )}
                        />
                        <ErrorMessage
                          name="outlet_resv"
                          component="small"
                          className="text-danger"
                        />
                      </Form.Group>
                      <Form.Group as={Col} md={4}>
                        <Form.Label>
                          {t("Outlet Longitude")}
                          <span className="text-danger fw-bold"></span>
                        </Form.Label>
                        <Form.Control
                          name="outlet_longitude"
                          value={props?.values.outlet_longitude}
                          type="text"
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          isInvalid={Boolean(
                            props.touched.outlet_longitude &&
                              props.errors.outlet_longitude
                          )}
                        />
                        <ErrorMessage
                          name="outlet_longitude"
                          component="small"
                          className="text-danger"
                        />
                      </Form.Group>
                      <Form.Group as={Col} md={4}>
                        <Form.Label>
                          {t("Outlet Lattitude")}
                          <span className="text-danger fw-bold"></span>
                        </Form.Label>
                        <Form.Control
                          name="outlet_lattitude"
                          value={props?.values.outlet_lattitude}
                          type="text"
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          isInvalid={Boolean(
                            props.touched.outlet_lattitude &&
                              props.errors.outlet_lattitude
                          )}
                        />
                        <ErrorMessage
                          name="outlet_lattitude"
                          component="small"
                          className="text-danger"
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
                                {edit?.id ? (
                                  <FormText>
                                    Password is encrypted. If you don't want to
                                    change it, leave it blank.
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
                            description={
                              "Are you sure you want to update this!!"
                            }
                          />
                        </div>
                      </Col>
                    </>
                  )}
                </Row>
              </Form>
            )}
          </Formik>
        </CardComponent>
      </Col>
    </>
  );
};

export default CreateOutlet;
