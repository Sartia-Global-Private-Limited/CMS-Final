import React, { useEffect, useState } from "react";
import { Col, Form, Row, Spinner, Stack } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import TextareaAutosize from "react-textarea-autosize";
import {
  addComplaintType,
  getAdminAllTypesComplaint,
  getAdminDistrictOnSaId,
  getAdminEnergyCompanyassignZone,
  getSingleComplaint,
  getAllEneryComnies,
  getAllOrderVia,
  getOfficersListOnRo,
  getRoOnZoneId,
  getSalesOnRoId,
  updateComplaintType,
} from "../../../services/authapi";
import { ErrorMessage, Field, Formik } from "formik";
import {
  addComplaintTypeForOtherSchema,
  addComplaintTypeSchema,
} from "../../../utils/formSchema";
import Select from "react-select";
import { getOutletByDistrictId } from "../../../services/adminApi";
import CardComponent from "../../../components/CardComponent";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ConfirmAlert from "../../../components/ConfirmAlert";
import CreateOtherComplaint from "./CreateOtherComplaint";
import { checkPermission } from "../../../utils/checkPermissions";
import { CREATED, UPDATED } from "../../../utils/constants";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/auth/authSlice";

const AddComplaintsMasterdata = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  let { pathname } = useLocation();
  const { user } = useSelector(selectUser);
  const [allEnergy, setAllEnergy] = useState([]);
  const [allZones, setAllZones] = useState([]);
  const [allRo, setAllRo] = useState([]);
  const [allOrderBy, setAllOrderBy] = useState([]);
  const [allSa, setAllSa] = useState([]);
  const [allDistrict, setAllDistrict] = useState([]);
  const [allOutlet, setOutlet] = useState([]);
  const [complaintType, setComplaintType] = useState([]);
  const [edit, setEdit] = useState({});
  const [allOrderVia, setAllOrderVia] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [complaintFor, setComplaintFor] = useState("1");

  const fetchSingleData = async () => {
    const res = await getSingleComplaint(id);
    if (res.status) {
      setEdit(res.data);
      // fetchUserNameData(res.data.user_type);
      handleEneryChange(res.data.energy_company_id);
      handleZoneChange(res.data.zones[0].zone_id);
      handleRoChange(res.data.regionalOffices[0].ro_id);
      handleSaChange(res.data.saleAreas[0].sale_area_id_id);
      handleDistrictChange(res.data.districts[0].district_id);
    } else {
      setEdit({});
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    // const zonesValues = values.zone_id?.map((item) => item.value);
    // const roValues = values.ro_id?.map((item) => item.value);
    // const salesValues = values.sale_area_id?.map((item) => item.value);
    // const districtValues = values.district_id?.map((item) => item.value);
    // const outletValues = values.outlet_id?.map((item) => item.value);

    const sData = {
      energy_company_id: values.energy_company_id.value,
      zone_id: Array.of(values.zone_id.value),
      ro_id: Array.of(values.ro_id.value),
      order_by_id: values.order_by_id.value,
      order_by: values.order_by,
      order_via_id: values.order_via_id.value,
      sale_area_id: Array.of(values.sale_area_id.value),
      district_id: Array.of(values.district_id.value),
      outlet_id: Array.of(values.outlet_id.value),
      complaint_type: JSON.stringify(values.complaint_type.value),
      work_permit: values.work_permit,
      complaint_for: values.complaint_for,
      description: values.description,
    };
    if (edit.id) {
      sData["id"] = edit.id;
    }

    const params = await checkPermission({
      user_id: user.id,
      pathname: `/${pathname.split("/")[1]}`,
    });
    params["action"] = edit.id ? UPDATED : CREATED;

    // return console.log("sData", sData);
    const res = edit.id
      ? await updateComplaintType(sData, params)
      : await addComplaintType(sData, params);
    if (res.status) {
      toast.success(res.message);
      navigate(-1);
      resetForm();
    } else {
      toast.error(res.message);
    }
    setSubmitting(false);
  };

  // get Zone name data on Change
  const handleEneryChange = async (value, setvalue) => {
    if (setvalue) {
      setvalue("energy_company_id", value);
      setvalue("zone_id", value);
      setvalue("ro_id", value);
      setvalue("order_by_id", value);
      setvalue("sale_area_id", value);
      setvalue("district_id", value);
      setvalue("outlet_id", value);
    }
    // setAllZones([])
    setAllRo([]);
    setAllOrderBy([]);
    setAllSa([]);
    setAllDistrict([]);
    setOutlet([]);
    if (!value) return setAllZones([]);
    const res = await getAdminEnergyCompanyassignZone(value);
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
      setvalue("energy_company_id", "");
      toast.error(res.message);
    }
  };

  // get Regional Office name data
  const handleZoneChange = async (value, setvalue) => {
    if (setvalue) {
      setvalue("zone_id", value);
      setvalue("ro_id", value);
      setvalue("order_by_id", value);
      setvalue("sale_area_id", value);
      setvalue("district_id", value);
      setvalue("outlet_id", value);
    }
    if (!value) return;
    setAllRo([]);
    setAllOrderBy([]);
    setAllSa([]);
    setAllDistrict([]);
    setOutlet([]);
    const res = await getRoOnZoneId(value);

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
      setvalue("zone_id", "");
      toast.error(res.message);
    }
  };

  //   get Sales area name data
  const handleRoChange = async (value, setvalue) => {
    if (setvalue) {
      setvalue("ro_id", value);
      setvalue("order_by_id", value);
      setvalue("sale_area_id", value);
      setvalue("district_id", value);
      setvalue("outlet_id", value);
    }
    if (!value) return;
    setAllSa([]);
    setAllOrderBy([]);
    setAllSa([]);
    setAllDistrict([]);
    setOutlet([]);
    const res = await getSalesOnRoId(value);
    const res2 = await getOfficersListOnRo(value);

    if (res.status) {
      const rData = res?.data?.map((itm) => {
        return {
          value: itm.id,
          label: itm.sales_area_name,
        };
      });
      //   console.log(rData);
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
        setAllOrderBy([]);
        toast.error(res2.message);
      }
      // console.log(rData2);
    } else {
      setAllSa([]);
      setvalue("ro_id", "");
      setvalue("order_by_id", "");
      toast.error(res.message);
    }
  };

  //   get District Name Data
  const handleSaChange = async (value, setvalue) => {
    if (setvalue) {
      setvalue("sale_area_id", value);
      setvalue("district_id", value);
      setvalue("outlet_id", value);
    }
    if (!value) return;
    setAllDistrict([]);
    setOutlet([]);
    const res = await getAdminDistrictOnSaId(value);

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
      setvalue("sale_area_id", "");
      toast.error(res.message);
    }
  };

  //   get Outlet Name Data
  const handleDistrictChange = async (value, setvalue) => {
    if (setvalue) {
      setvalue("district_id", value);
      setvalue("outlet_id", value);
    }
    if (!value) return setOutlet([]);
    const res = await getOutletByDistrictId(value);

    if (res.status) {
      const rData = res.data.map((itm) => {
        return {
          value: itm.id,
          label: itm.outlet_name,
        };
      });
      setOutlet(rData);
    } else {
      setOutlet([]);
      setvalue("district_id", "");
      toast.error(res.message);
    }
  };

  // get Energy Company Data
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

  //   fetch Order Via Data
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

  //   fetch Complain Type Data
  const fetchComplainTypeData = async () => {
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
    fetchEnergyData();
    fetchOrderViaData();
    fetchComplainTypeData();
    if (id !== "new") {
      fetchSingleData();
    }
    if (id == "new") {
      setEdit({});
    }
  }, [id]);

  return (
    <>
      <Helmet>
        <title>Complaint Types · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent title={"Create Complaints"}>
          <Formik
            enableReinitialize={true}
            initialValues={{
              energy_company_id: edit?.energy_company_id
                ? {
                    label: edit?.energy_company_name,
                    value: edit?.energy_company_id,
                  }
                : "",
              zone_id: edit?.zones
                ? {
                    label: edit?.zones[0]?.zone_name,
                    value: edit?.zones[0]?.zone_id,
                  }
                : "",
              ro_id: edit?.regionalOffices
                ? {
                    label: edit?.regionalOffices[0]?.regional_office_name,
                    value: edit?.regionalOffices[0]?.id,
                  }
                : "",
              order_by_id: edit?.order_by_id
                ? {
                    label: edit?.order_by_details,
                    value: edit?.order_by_id,
                  }
                : "",
              order_by: edit?.order_by_details || "",

              order_via_id: edit?.order_via_id
                ? {
                    label: edit?.getOrderViaDetails,
                    value: edit?.order_via_id,
                  }
                : "",
              sale_area_id: edit?.saleAreas
                ? {
                    label: edit?.saleAreas[0]?.sales_area_name,
                    value: edit?.saleAreas[0]?.id,
                  }
                : "",
              district_id: edit?.districts
                ? {
                    label: edit?.districts[0]?.district_name,
                    value: edit?.districts[0]?.district_id,
                  }
                : "",
              outlet_id: edit?.outlets
                ? {
                    label: edit?.outlets[0]?.outlet_name,
                    value: edit?.outlets[0]?.id,
                  }
                : "",
              complaint_type: edit?.complaint_type
                ? {
                    label: edit?.complaint_type,
                    value: edit?.complaint_type_id,
                  }
                : "",
              description: edit?.description || "",
              work_permit: edit?.work_permit || "",
              complaint_for: edit?.complaint_for || "1",
            }}
            // validationSchema={
            //   complaintFor == "1"
            //     ? addComplaintTypeSchema
            //     : addComplaintTypeForOtherSchema
            // }
            onSubmit={handleSubmit}
          >
            {(props) => {
              setComplaintFor(props.values.complaint_for);
              return (
                <Form onSubmit={props?.handleSubmit}>
                  <Row className="g-3">
                    <Form.Group as={Col} md={12}>
                      <Stack
                        className={`text-truncate px-0 after-bg-light social-btn-re w-auto h-auto ${
                          edit?.id ? "cursor-none" : null
                        }`}
                        direction="horizontal"
                        gap={4}
                      >
                        <span className="ps-3">Complaint For : </span>
                        <label className="fw-bolder">
                          <Field
                            type="radio"
                            name="complaint_for"
                            value={"1"}
                            disabled={Boolean(edit?.id)}
                            checked={Boolean(
                              props.values.complaint_for === "1"
                            )}
                            onChange={() => {
                              props.resetForm();
                              props.setFieldValue("complaint_for", "1");
                            }}
                            className="form-check-input"
                          />
                          Energy Company
                        </label>
                        <div className={`vr hr-shadow`} />
                        <label className="fw-bolder">
                          <Field
                            type="radio"
                            name="complaint_for"
                            value={"2"}
                            disabled={Boolean(edit?.id)}
                            checked={Boolean(
                              props.values.complaint_for === "2"
                            )}
                            onChange={() => {
                              props.resetForm();
                              props.setFieldValue("complaint_for", "2");
                            }}
                            className="form-check-input"
                          />
                          Other Company
                        </label>
                      </Stack>
                    </Form.Group>
                    {props.values.complaint_for == 1 ? (
                      <>
                        <Form.Group as={Col} md="6">
                          <Form.Label>
                            Energy Company Name{" "}
                            <span className="text-danger fw-bold">*</span>
                          </Form.Label>
                          <Select
                            menuPortalTarget={document.body}
                            className="text-primary"
                            name="energy_company_id"
                            value={props.values.energy_company_id}
                            onChange={(val) => {
                              handleEneryChange(val.value, props.setFieldValue);
                              props.setFieldValue("energy_company_id", val);
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

                        <Form.Group as={Col} md="6">
                          <Form.Label>
                            Zone Name{" "}
                            <span className="text-danger fw-bold">*</span>
                          </Form.Label>
                          <Select
                            menuPortalTarget={document.body}
                            className="text-primary"
                            name="zone_id"
                            value={props.values.zone_id}
                            onChange={(val) => {
                              handleZoneChange(val.value, props.setFieldValue);
                              props.setFieldValue("zone_id", val);
                            }}
                            options={allZones}
                          />
                          <ErrorMessage
                            name="zone_id"
                            component="small"
                            className="text-danger"
                          />
                        </Form.Group>

                        <Form.Group as={Col} md="6">
                          <Form.Label>
                            Regional Office Name{" "}
                            <span className="text-danger fw-bold">*</span>
                          </Form.Label>
                          <Select
                            menuPortalTarget={document.body}
                            className="text-primary"
                            name="ro_id"
                            value={props.values.ro_id}
                            onChange={(val) => {
                              handleRoChange(val.value, props.setFieldValue);
                              props.setFieldValue("ro_id", val);
                            }}
                            options={allRo}
                          />
                          <ErrorMessage
                            name="ro_id"
                            component="small"
                            className="text-danger"
                          />
                        </Form.Group>

                        <Form.Group as={Col} md="6">
                          <Form.Label>
                            Order By{" "}
                            <span className="text-danger fw-bold">*</span>
                          </Form.Label>
                          <Select
                            menuPortalTarget={document.body}
                            className="text-primary"
                            name="order_by_id"
                            value={props.values.order_by_id}
                            onChange={(val) =>
                              props.setFieldValue("order_by_id", val)
                            }
                            options={allOrderBy}
                          />
                          <ErrorMessage
                            name="order_by_id"
                            component="small"
                            className="text-danger"
                          />
                        </Form.Group>

                        <Form.Group as={Col} md="6">
                          <Form.Label>
                            Order Via{" "}
                            <span className="text-danger fw-bold">*</span>
                          </Form.Label>
                          <Select
                            menuPortalTarget={document.body}
                            className="text-primary"
                            name="order_via_id"
                            value={props.values.order_via_id}
                            onChange={(val) => {
                              props.setFieldValue("order_via_id", val);
                            }}
                            options={allOrderVia}
                          />
                          <ErrorMessage
                            name="order_via_id"
                            component="small"
                            className="text-danger"
                          />
                        </Form.Group>

                        <Form.Group as={Col} md="6">
                          <Form.Label>
                            Sales Area Name{" "}
                            <span className="text-danger fw-bold">*</span>
                          </Form.Label>
                          <Select
                            menuPortalTarget={document.body}
                            className="text-primary"
                            name="sale_area_id"
                            value={props.values.sale_area_id}
                            onChange={(val) => {
                              handleSaChange(val.value, props.setFieldValue);
                              props.setFieldValue("sale_area_id", val);
                            }}
                            options={allSa}
                          />

                          <ErrorMessage
                            name="sale_area_id"
                            component="small"
                            className="text-danger"
                          />
                        </Form.Group>

                        <Form.Group as={Col} md="4">
                          <Form.Label>
                            District Name{" "}
                            {/* <span className="text-danger fw-bold">*</span> */}
                          </Form.Label>
                          <Select
                            menuPortalTarget={document.body}
                            className="text-primary"
                            name="district_id"
                            value={props.values.district_id}
                            onChange={(val) => {
                              handleDistrictChange(
                                val.value,
                                props.setFieldValue
                              );
                              props.setFieldValue("district_id", val);
                            }}
                            options={allDistrict}
                          />
                          <ErrorMessage
                            name="district_id"
                            component="small"
                            className="text-danger"
                          />
                        </Form.Group>

                        <Form.Group as={Col} md="4">
                          <Form.Label>
                            Outlet Name{" "}
                            <span className="text-danger fw-bold">*</span>
                          </Form.Label>
                          <Select
                            menuPortalTarget={document.body}
                            name={"outlet_id"}
                            options={allOutlet}
                            value={props.values.outlet_id}
                            onChange={(val) =>
                              props.setFieldValue("outlet_id", val)
                            }
                          />
                          <ErrorMessage
                            name="outlet_id"
                            component="small"
                            className="text-danger"
                          />
                        </Form.Group>

                        <Form.Group as={Col} md="4">
                          <Form.Label>Complaint Type</Form.Label>
                          <Select
                            menuPortalTarget={document.body}
                            className="text-primary"
                            name="complaint_type"
                            value={props.values.complaint_type}
                            onChange={(val) => {
                              props.setFieldValue("complaint_type", val);
                            }}
                            options={complaintType}
                          />
                        </Form.Group>
                        <Form.Group as={Col} md="4">
                          <Form.Label>Work Permit</Form.Label>
                          <Form.Control
                            type="text"
                            name={"work_permit"}
                            value={props.values.work_permit}
                            onChange={props.handleChange}
                          />
                        </Form.Group>

                        <Form.Group as={Col} md="12">
                          <TextareaAutosize
                            minRows={3}
                            className="edit-textarea"
                            placeholder="Description..."
                            name={"description"}
                            value={props.values.description}
                            onChange={props.handleChange}
                          />
                        </Form.Group>
                      </>
                    ) : (
                      <CreateOtherComplaint
                        props={props}
                        complaintType={complaintType}
                        allOrderVia={allOrderVia}
                      />
                    )}

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
                            <>{edit?.id ? "UPDATE" : "CREATE"}</>
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
              );
            }}
          </Formik>
        </CardComponent>
      </Col>
    </>
  );
};

export default AddComplaintsMasterdata;
