import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import {
  addAdminDistrict,
  getAdminAllEnergy,
  getAdminEnergyCompanyassignZone,
  getRoOnZoneId,
  getSalesOnRoId,
  getSingleDistrictById,
  updateAdminDistrict,
} from "../../../services/authapi";
import { toast } from "react-toastify";
import ConfirmAlert from "../../../components/ConfirmAlert";
import { addDistrictSchema } from "../../../utils/formSchema";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/auth/authSlice";
import { checkPermission } from "../../../utils/checkPermissions";
import { CREATED, UPDATED } from "../../../utils/constants";
import { useTranslation } from "react-i18next";
import CardComponent from "../../../components/CardComponent";
import MyInput from "../../../components/MyInput";

const DistrictForm = () => {
  let { pathname } = useLocation();
  const { user } = useSelector(selectUser);
  const { id } = useParams();
  const [showAlert, setShowAlert] = useState(false);
  const [allEnergy, setAllEnergy] = useState([]);
  const navigate = useNavigate();
  const [edit, setEdit] = useState({});
  const [allZones, setAllZones] = useState([]);
  const [allRo, setAllRo] = useState([]);
  const [allSa, setAllSa] = useState([]);
  const { t } = useTranslation();

  const fetchDistrictsData = async () => {
    const res = await getSingleDistrictById(id);
    if (res?.data) {
      setEdit(res?.data);
      await fetchZoneDataByEc_Id(res?.data?.energy_company_id);
      await fetchRoData(res?.data?.zone_id);
      await fetchSaData(res?.data?.ro_id);
    } else {
      setEdit({});
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      energy_company_id: values.energy_company_id,
      zone_id: values.zone_id,
      regional_office_id: values.ro_id,
      sales_area_id: values.sales_area_id,
      district_name: values.district_name,
      status: values.status,
    };

    if (edit.id) {
      sData["district_id"] = edit.id;
    }

    // const params = await checkPermission({
    //   user_id: user.id,
    //   pathname: `/${pathname.split("/")[1]}`,
    // });
    // console.log("params", params);
    // params["action"] = edit?.id ? UPDATED : CREATED;

    // return console.log(sData);
    const res = edit.id
      ? await updateAdminDistrict(sData)
      : await addAdminDistrict(sData);
    if (res.status) {
      toast.success(res.message);
      navigate(-1);
      resetForm();
    } else {
      toast.error(res.message);
    }
    setSubmitting(false);
  };

  const handleEnergyChange = async (val, setFieldValue) => {
    if (setFieldValue) {
      setFieldValue("energy_company_id", val);
    }
    if (!val) return false;
    fetchZoneDataByEc_Id(val);
    setAllRo([]);
    setAllSa([]);
  };

  const handleZoneChange = async (val, setFieldValue) => {
    if (setFieldValue) {
      setFieldValue("zone_id", val);
    }
    if (!val) return false;
    fetchRoData(val);
    setAllSa([]);
  };
  const handleRoChange = async (val, setFieldValue) => {
    if (setFieldValue) {
      setFieldValue("ro_id", val);
    }
    if (!val) return false;
    fetchSaData(val);
  };

  // all Energy
  const fetchAllEnergyData = async () => {
    const res = await getAdminAllEnergy();
    if (res.status) {
      setAllEnergy(res.data);
    } else {
      setAllEnergy([]);
      // toast.error(res.message);
    }
  };

  // Only Use for Zone Name
  const fetchZoneDataByEc_Id = async (energy_company_id) => {
    const res = await getAdminEnergyCompanyassignZone(energy_company_id);
    if (res.status) {
      setAllZones(res.data);
      // setEdit
    } else {
      setAllZones([]);
      toast.error(res.message);
    }
  };

  // Only Use for Regional Office
  const fetchRoData = async (zone_id) => {
    const res = await getRoOnZoneId(zone_id);
    if (res.status) {
      setAllRo(res.data);
    } else {
      setAllRo([]);
      toast.error(res.message);
    }
    // console.log("ro", allRo);
  };

  // Only Use for Sales Area
  const fetchSaData = async (ro_id) => {
    const res = await getSalesOnRoId(ro_id);
    if (res.status) {
      setAllSa(res.data);
      // toast.success(res.message);
    } else {
      setAllSa([]);
      toast.error(res.message);
    }
  };

  useEffect(() => {
    fetchAllEnergyData();
    if (id) {
      fetchDistrictsData();
    }
  }, []);

  return (
    <>
      <Col md={12} data-aos={"fade-up"}>
        <CardComponent
          title={`${edit.id ? "Update" : "Create"} District`}
          showBackButton={true}
        >
          <Formik
            enableReinitialize={true}
            initialValues={{
              energy_company_id: edit.energy_company_id || "",
              zone_id: edit.zone_id || "",
              ro_id: edit.ro_id || "",
              sales_area_id: edit.sale_area_id || "",
              district_name: edit.district_name || "",
              status: edit?.status || "1",
            }}
            validationSchema={addDistrictSchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props?.handleSubmit}>
                <Row className="g-3 align-items-end">
                  <Form.Group as={Col} md="4">
                    <MyInput
                      isRequired
                      name={"energy_company_id"}
                      formikProps={props}
                      label={t("Energy Company")}
                      customType={"select"}
                      selectProps={{
                        data: allEnergy?.map((data) => {
                          return {
                            value: data?.energy_company_id,
                            label: data?.name,
                          };
                        }),
                        onChange: (e) => {
                          handleEnergyChange(e?.value, props.setFieldValue);
                        },
                      }}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md="4">
                    <MyInput
                      isRequired
                      name={"zone_id"}
                      formikProps={props}
                      label={t("Zone")}
                      customType={"select"}
                      selectProps={{
                        data: allZones?.map((data) => {
                          return {
                            value: data?.zone_id,
                            label: data?.zone_name,
                          };
                        }),
                        onChange: (e) => {
                          handleZoneChange(e?.value, props.setFieldValue);
                        },
                      }}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md="4">
                    <MyInput
                      isRequired
                      name={"ro_id"}
                      formikProps={props}
                      label={t("Regional Office")}
                      customType={"select"}
                      selectProps={{
                        data: allRo?.map((data) => {
                          return {
                            value: data?.ro_id,
                            label: data?.regional_office_name,
                          };
                        }),
                        onChange: (e) => {
                          handleRoChange(e?.value, props.setFieldValue);
                        },
                      }}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md="4">
                    <MyInput
                      isRequired
                      name={"sales_area_id"}
                      formikProps={props}
                      label={t("Sales Area")}
                      customType={"select"}
                      selectProps={{
                        data: allSa?.map((data) => {
                          return {
                            value: data?.id,
                            label: data?.sales_area_name,
                          };
                        }),
                      }}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md="4">
                    <MyInput
                      isRequired
                      name={"district_name"}
                      formikProps={props}
                      label={t("District Name")}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md="4">
                    <MyInput
                      isRequired
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

export default DistrictForm;
