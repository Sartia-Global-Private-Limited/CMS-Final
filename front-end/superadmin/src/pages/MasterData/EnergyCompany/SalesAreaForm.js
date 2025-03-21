import { Formik } from "formik";
import React, { useState, useEffect } from "react";
import {
  addAdminSalesArea,
  getAdminAllEnergy,
  getAdminEnergyCompanyassignZone,
  getRoOnZoneId,
  getSingleSalesArea,
  updateAdminSalesArea,
} from "../../../services/authapi";
import { addSalesAreaSchema } from "../../../utils/formSchema";
import { toast } from "react-toastify";
import ConfirmAlert from "../../../components/ConfirmAlert";
import { useTranslation } from "react-i18next";
import CardComponent from "../../../components/CardComponent";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import MyInput from "../../../components/MyInput";
import { useNavigate, useParams } from "react-router-dom";

const SalesAreaForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [allEnergy, setAllEnergy] = useState([]);
  const [edit, setEdit] = useState({});
  const [allZones, setAllZones] = useState([]);
  const [allRo, setAllRo] = useState([]);
  const { t } = useTranslation();

  const fetchSalesAreaData = async () => {
    const res = await getSingleSalesArea(id);
    if (res.status) {
      setEdit(res.data);
      fetchRoData(res.data?.energy_company_id);
      fetchZoneDataByEc_Id(res.data?.energy_company_id);
    } else {
      setEdit({});
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    if (edit.id) {
      values["id"] = edit.id;
    }
    const res = edit.id
      ? await updateAdminSalesArea(values)
      : await addAdminSalesArea(values);
    if (res.status) {
      toast.success(res.message);
      resetForm();
      navigate(-1);
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
  };

  const handleZoneChange = async (val, setFieldValue) => {
    if (setFieldValue) {
      setFieldValue("zone_id", val);
    }
    if (!val) return false;
    fetchRoData(val);
  };

  const fetchZoneDataByEc_Id = async (energy_company_id) => {
    const res = await getAdminEnergyCompanyassignZone(energy_company_id);
    if (res.status) {
      setAllZones(res.data);
    } else {
      setAllZones([]);
      toast.error(res.message);
    }
  };

  // all Energy
  const fetchAllEnergyData = async () => {
    const res = await getAdminAllEnergy();
    if (res.status) {
      setAllEnergy(res.data);
      setEdit(res.data);
    } else {
      setAllEnergy([]);
    }
  };

  // all Regional Office
  const fetchRoData = async (zone_id) => {
    const res = await getRoOnZoneId(zone_id);
    if (res.status) {
      setAllRo(res.data);
    } else {
      setAllRo([]);
      toast.error(res.message);
    }
  };

  useEffect(() => {
    fetchAllEnergyData();
    if (id) {
      fetchSalesAreaData();
    }
  }, []);

  return (
    <>
      <Col md={12}>
        <CardComponent
          showBackButton={true}
          title={edit.id ? "UPDATE - Sales Area" : "ADD - Sales Area"}
        >
          <Formik
            enableReinitialize={true}
            initialValues={{
              energy_company_id: edit?.energy_company_id || "",
              zone_id: edit.zone_id || "",
              regional_office_id: edit.regional_office_id || "",
              sales_area_name: edit.sales_area_name || "",
              sales_area_status:
                edit?.status === 0 ? edit?.status : edit?.status || 1,
            }}
            validationSchema={addSalesAreaSchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props?.handleSubmit}>
                <Row className="g-3">
                  <Form.Group as={Col} md={4}>
                    <MyInput
                      isRequired
                      name={"energy_company_id"}
                      formikProps={props}
                      label={"Energy Company"}
                      customType={"select"}
                      selectProps={{
                        data: allEnergy?.map((itm) => {
                          return {
                            value: itm.energy_company_id,
                            label: itm.name,
                          };
                        }),
                        onChange: (e) => {
                          handleEnergyChange(e?.value, props.setFieldValue);
                        },
                      }}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={4}>
                    <MyInput
                      isRequired
                      name={"zone_id"}
                      formikProps={props}
                      label={"Zone"}
                      customType={"select"}
                      selectProps={{
                        data: allZones?.map((itm) => {
                          return {
                            value: itm.zone_id,
                            label: itm.zone_name,
                          };
                        }),
                        onChange: (e) => {
                          handleZoneChange(e?.value, props.setFieldValue);
                        },
                      }}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={4}>
                    <MyInput
                      isRequired
                      name={"regional_office_id"}
                      formikProps={props}
                      label={"Regional Office"}
                      customType={"select"}
                      selectProps={{
                        data: allRo?.map((itm) => {
                          return {
                            value: itm.ro_id,
                            label: itm.regional_office_name,
                          };
                        }),
                      }}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={4}>
                    <MyInput
                      isRequired
                      name={"sales_area_name"}
                      formikProps={props}
                      label={"Sales Area Name"}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={4}>
                    <MyInput
                      isRequired
                      name={"sales_area_status"}
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
                            />
                            PLEASE WAIT...
                          </>
                        ) : (
                          <>{edit.id ? "UPDATE" : "SAVE"}</>
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

export default SalesAreaForm;
