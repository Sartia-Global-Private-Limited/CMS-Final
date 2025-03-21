import React, { useEffect, useState } from "react";
import { Col, Form, Row, Spinner, Stack } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import {
  getAdminAllTypesComplaint,
  getAdminDistrictOnSaId,
  getAdminEnergyCompanyassignZone,
  getAllEneryComnies,
  getAllOrderVia,
  getOfficersListOnRo,
  getRoOnZoneId,
  getSalesOnRoId,
} from "../../services/authapi";
import { Field, Formik } from "formik";
import {
  importComplaintTypeForOtherSchema,
  importComplaintTypeSchema,
} from "../../utils/formSchema";
import { getOutletByDistrictId } from "../../services/adminApi";
import CardComponent from "../../components/CardComponent";
import { useNavigate } from "react-router-dom";
import { t } from "i18next";
import MyInput from "../../components/MyInput";
import { uploadComplaint } from "../../services/contractorApi";
import OtherComplaintImport from "./OtherComplaintImport";
import { DOWNLOAD_FILE_WITH_BACKEND } from "../../utils/helper";
import { MdDownload } from "react-icons/md";

const ComplaintImport = () => {
  const navigate = useNavigate();
  const [allEnergy, setAllEnergy] = useState([]);
  const [allZones, setAllZones] = useState([]);
  const [allRo, setAllRo] = useState([]);
  const [allOrderBy, setAllOrderBy] = useState([]);
  const [allSa, setAllSa] = useState([]);
  const [allDistrict, setAllDistrict] = useState([]);
  const [allOutlet, setAllOutlet] = useState([]);
  const [complaintType, setComplaintType] = useState([]);
  const [allOrderVia, setAllOrderVia] = useState([]);
  const [complaintFor, setComplaintFor] = useState("1");

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();
    for (const key in values) {
      formData.append(key, values[key]);
    }

    // return console.log("formData", formData);
    const res = await uploadComplaint(formData);
    if (res.status) {
      toast.success(res.message);
      navigate(-1);
      resetForm();
    } else {
      toast.error(res.message);
    }
    setSubmitting(false);
  };

  // All Zone
  const fetchAllZone = async (id) => {
    const res = await getAdminEnergyCompanyassignZone(id);
    if (res.status) {
      const rData = res.data.map((itm) => {
        return {
          value: itm.zone_id,
          label: itm.zone_name,
        };
      });
      setAllZones(rData);
    } else {
      setAllZones([]);
      toast.error(res.message);
    }
  };

  // All Regional Office
  const fetchAllRO = async (id) => {
    const res = await getRoOnZoneId(id);
    if (res.status) {
      const rData = res.data.map((itm) => {
        return {
          value: itm.ro_id,
          label: itm.regional_office_name,
        };
      });
      setAllRo(rData);
    } else {
      setAllRo([]);
      toast.error(res.message);
    }
  };

  // All Sales Area And OrderBy
  const fetchAllSalesAreaAndOrderBy = async (id) => {
    const res = await getSalesOnRoId(id);
    const res2 = await getOfficersListOnRo(id);
    if (res.status) {
      const rData = res?.data?.map((itm) => {
        return {
          value: itm.id,
          label: itm.sales_area_name,
        };
      });
      setAllSa(rData);
      if (res2.status) {
        const rData2 = res2?.data?.map((itm) => {
          return {
            value: itm.id,
            label: itm.name,
          };
        });
        setAllOrderBy(rData2);
      } else {
        toast.error("Order By Not Found");
        setAllOrderBy([]);
      }
    } else {
      setAllSa([]);
      toast.error("Sales Area Not Found");
    }
  };

  // All District
  const fetchAllDistrict = async (id) => {
    const res = await getAdminDistrictOnSaId(id);
    if (res.status) {
      const rData = res.data.map((itm) => {
        return {
          value: itm.district_id,
          label: itm.district_name,
        };
      });
      setAllDistrict(rData);
    } else {
      setAllDistrict([]);
      toast.error("District Not Found");
    }
  };

  // All Outlet
  const fetchAllOutlet = async (id) => {
    const res = await getOutletByDistrictId(id);
    if (res.status) {
      const rData = res.data.map((itm) => {
        return {
          value: itm.id,
          label: itm.outlet_name,
        };
      });
      setAllOutlet(rData);
    } else {
      setAllOutlet([]);
      toast.error("Outlet Not Found");
    }
  };

  // All Outlet By District Id
  const fetchAllOutletByDistrictId = async (id) => {
    const res = await getOutletByDistrictId(id);
    if (res.status) {
      const rData = res.data.map((itm) => {
        return {
          value: itm.id,
          label: itm.outlet_name,
        };
      });
      setAllOutlet(rData);
    } else {
      setAllOutlet([]);
      toast.error("Outlet Not Found");
    }
  };

  // All Energy Company
  const fetchAllEnergyCompany = async () => {
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

  // All Order Via
  const fetchOrderViaData = async () => {
    const res = await getAllOrderVia();
    if (res.status) {
      const rData = res.data.map((itm) => {
        return {
          value: itm.id,
          label: itm.order_via,
        };
      });
      setAllOrderVia(rData);
    } else {
      setAllOrderVia([]);
    }
  };

  // All Complaint Type
  const fetchAllComplaintType = async () => {
    const res = await getAdminAllTypesComplaint();
    if (res.status) {
      const rData = res.data.map((itm) => {
        return {
          value: itm.id,
          label: itm.complaint_type_name,
        };
      });
      setComplaintType(rData);
    } else {
      setComplaintType([]);
    }
  };

  useEffect(() => {
    fetchAllEnergyCompany();
    fetchOrderViaData();
    fetchAllComplaintType();
  }, []);

  return (
    <>
      <Helmet>
        <title>Import Complaint · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent title={`Import Complaints`}>
          <Formik
            enableReinitialize={true}
            initialValues={{
              energy_company_id: "",
              zone_id: "",
              ro_id: "",
              order_by_id: "",
              order_by: "",
              order_via_id: "",
              sale_area_id: "",
              district_id: "",
              outlet_id: "",
              complaint_type: "",
              complaint_for: "1",
              excel: "",
            }}
            validationSchema={
              complaintFor == "1"
                ? importComplaintTypeSchema
                : importComplaintTypeForOtherSchema
            }
            onSubmit={handleSubmit}
          >
            {(props) => {
              setComplaintFor(props.values.complaint_for);
              return (
                <Form onSubmit={props?.handleSubmit}>
                  <Row className="g-3">
                    <Form.Group as={Col} md={12}>
                      <Stack
                        className={`text-truncate px-0 after-bg-light social-btn-re w-auto h-auto`}
                        direction="horizontal"
                        gap={4}
                      >
                        <span className="ps-3">{t("Complaint For")} : </span>
                        <label className="fw-bolder">
                          <Field
                            type="radio"
                            name="complaint_for"
                            value={"1"}
                            checked={Boolean(
                              props.values.complaint_for === "1"
                            )}
                            onChange={() => {
                              props.resetForm();
                              props.setFieldValue("complaint_for", "1");
                            }}
                            className="form-check-input"
                          />
                          {t("Energy Company")}
                        </label>
                        <div className={`vr hr-shadow`} />
                        <label className="fw-bolder">
                          <Field
                            type="radio"
                            name="complaint_for"
                            value={"2"}
                            checked={Boolean(
                              props.values.complaint_for === "2"
                            )}
                            onChange={() => {
                              props.resetForm();
                              props.setFieldValue("complaint_for", "2");
                            }}
                            className="form-check-input"
                          />
                          {t("Other Company")}
                        </label>
                      </Stack>
                    </Form.Group>
                    {props.values.complaint_for == 1 ? (
                      <>
                        <Form.Group as={Col} md={4}>
                          <MyInput
                            isRequired
                            name={"energy_company_id"}
                            formikProps={props}
                            label={t("Energy Company")}
                            customType={"select"}
                            selectProps={{
                              data: allEnergy,
                              onChange: (e) => {
                                fetchAllZone(e?.value);
                                [
                                  "zone_id",
                                  "ro_id",
                                  "order_by_id",
                                  "sale_area_id",
                                  "district_id",
                                ].forEach((field) =>
                                  props.setFieldValue(`${field}`, "")
                                );
                                setAllZones([]);
                                setAllRo([]);
                                setAllOrderBy([]);
                                setAllSa([]);
                                setAllDistrict([]);
                                setAllOutlet([]);
                              },
                            }}
                          />
                        </Form.Group>

                        <Form.Group as={Col} md={4}>
                          <MyInput
                            isRequired
                            name={"zone_id"}
                            formikProps={props}
                            label={t("Zone")}
                            customType={"select"}
                            selectProps={{
                              data: allZones,
                              onChange: (e) => {
                                fetchAllRO(e?.value);
                                [
                                  "ro_id",
                                  "order_by_id",
                                  "sale_area_id",
                                  "district_id",
                                ].forEach((field) =>
                                  props.setFieldValue(`${field}`, "")
                                );
                                setAllRo([]);
                                setAllOrderBy([]);
                                setAllSa([]);
                                setAllDistrict([]);
                                setAllOutlet([]);
                              },
                            }}
                          />
                        </Form.Group>

                        <Form.Group as={Col} md={4}>
                          <MyInput
                            isRequired
                            name={"ro_id"}
                            formikProps={props}
                            label={t("Regional Office")}
                            customType={"select"}
                            selectProps={{
                              data: allRo,
                              onChange: (e) => {
                                fetchAllSalesAreaAndOrderBy(e?.value);
                                [
                                  "order_by_id",
                                  "sale_area_id",
                                  "district_id",
                                ].forEach((field) =>
                                  props.setFieldValue(`${field}`, "")
                                );
                                setAllOrderBy([]);
                                setAllSa([]);
                                setAllDistrict([]);
                                setAllOutlet([]);
                              },
                            }}
                          />
                        </Form.Group>

                        <Form.Group as={Col} md={4}>
                          <MyInput
                            isRequired
                            name={"order_by_id"}
                            formikProps={props}
                            label={t("Order By")}
                            customType={"select"}
                            selectProps={{
                              data: allOrderBy,
                            }}
                          />
                        </Form.Group>
                        <Form.Group as={Col} md={4}>
                          <MyInput
                            isRequired
                            name={"order_via_id"}
                            formikProps={props}
                            label={t("Order Via")}
                            customType={"select"}
                            selectProps={{
                              data: allOrderVia,
                            }}
                          />
                        </Form.Group>

                        <Form.Group as={Col} md={4}>
                          <MyInput
                            isRequired
                            name={"sale_area_id"}
                            formikProps={props}
                            label={t("Sales Area")}
                            customType={"select"}
                            selectProps={{
                              data: allSa,
                              onChange: (e) => {
                                fetchAllOutlet(e?.value);
                                fetchAllDistrict(e?.value);
                                ["district_id", "outlet_id"].forEach((field) =>
                                  props.setFieldValue(`${field}`, "")
                                );
                                setAllDistrict([]);
                                setAllOutlet([]);
                              },
                            }}
                          />
                        </Form.Group>

                        <Form.Group as={Col} md={4}>
                          <MyInput
                            name={"district_id"}
                            formikProps={props}
                            label={t("District")}
                            customType={"select"}
                            selectProps={{
                              data: allDistrict,
                              onChange: (e) => {
                                fetchAllOutletByDistrictId(e?.value);
                                ["outlet_id"].forEach((field) =>
                                  props.setFieldValue(`${field}`, "")
                                );
                                setAllOutlet([]);
                              },
                            }}
                          />
                        </Form.Group>

                        <Form.Group as={Col} md={4}>
                          <MyInput
                            isRequired
                            name={"outlet_id"}
                            formikProps={props}
                            label={t("Outlet")}
                            customType={"select"}
                            selectProps={{
                              data: allOutlet,
                            }}
                          />
                        </Form.Group>

                        <Form.Group as={Col} md={4}>
                          <MyInput
                            isRequired
                            name={"complaint_type"}
                            formikProps={props}
                            label={t("Complaint Type")}
                            customType={"select"}
                            selectProps={{
                              data: complaintType,
                            }}
                          />
                        </Form.Group>
                      </>
                    ) : (
                      <OtherComplaintImport
                        props={props}
                        complaintType={complaintType}
                        allOrderVia={allOrderVia}
                      />
                    )}

                    <Form.Group
                      as={Col}
                      md={4}
                      className="d-align justify-content-start gap-2"
                    >
                      <MyInput
                        isRequired
                        name={"excel"}
                        formikProps={props}
                        label={t("upload excel file")}
                        accepts={[".csv", ".xls", ".xlsx"]}
                        customType={"fileUpload"}
                      />
                      <button
                        className="shadow border-0 purple-combo cursor-pointer px-2 py-1"
                        type="button"
                        onClick={() => {
                          if (props.values.complaint_for == "1") {
                            DOWNLOAD_FILE_WITH_BACKEND(
                              "energy_complaints_data.xlsx"
                            );
                          } else {
                            DOWNLOAD_FILE_WITH_BACKEND(
                              "other_complaints_data.xlsx"
                            );
                          }
                        }}
                      >
                        <MdDownload className="fs-6" />
                      </button>
                    </Form.Group>

                    <Form.Group as={Col} md={12}>
                      <div className="mt-4 text-center">
                        <button
                          type={`submit`}
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
                            "Import"
                          )}
                        </button>
                      </div>
                    </Form.Group>
                  </Row>
                </Form>
              );
            }}
          </Formik>
        </CardComponent>
      </Col>
    </>
  );
};

export default ComplaintImport;
