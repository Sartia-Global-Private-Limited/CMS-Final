import React, { useEffect } from "react";
import { useState } from "react";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import {
  addAdminRO,
  getAdminAllEnergy,
  getAdminEnergyCompanyassignZone,
  getAdminSingleRegionalOffices,
  updateAdminRO,
} from "../../../services/authapi";
import { Formik } from "formik";
import { toast } from "react-toastify";
import ConfirmAlert from "../../../components/ConfirmAlert";
import { addROSchema } from "../../../utils/formSchema";
import { useNavigate, useParams } from "react-router-dom";
import CardComponent from "../../../components/CardComponent";
import MyInput from "../../../components/MyInput";
import { useTranslation } from "react-i18next";

const RegionalForm = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [allEnergy, setAllEnergy] = useState([]);
  const [allZones, setAllZones] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [edit, setEdit] = useState({});

  const fetchRoData = async () => {
    const res = await getAdminSingleRegionalOffices(id);
    if (res.status) {
      setEdit(res.data[0]);
      fetchZoneDataByEc_Id(res.data[0]?.energy_company_id);
    } else {
      setEdit({});
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    if (edit.id) {
      values["regional_id"] = edit.id;
    }

    const res = edit.id
      ? await updateAdminRO(values)
      : await addAdminRO(values);
    if (res.status) {
      toast.success(res.message);
      resetForm();
      navigate(-1);
    } else {
      toast.error(res.message);
    }
    setSubmitting(false);
  };

  const fetchAllEnergyData = async () => {
    const res = await getAdminAllEnergy();
    if (res.status) {
      setAllEnergy(res.data);
    } else {
      setAllEnergy([]);
    }
  };

  const handleEnergyChange = async (val, setFieldValue) => {
    if (setFieldValue) {
      setFieldValue("energy_company_id", val);
    }
    if (!val) return false;
    fetchZoneDataByEc_Id(val);
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

  useEffect(() => {
    fetchAllEnergyData();
    if (id) {
      fetchRoData();
    }
  }, []);

  return (
    <>
      <Col md={12}>
        <CardComponent
          showBackButton={true}
          title={edit.id ? "UPDATE - Regional" : "ADD - Regional"}
        >
          <Formik
            enableReinitialize={true}
            initialValues={{
              energy_company_id: edit?.energy_company_id || "",
              zone_id: edit?.zone_id || "",
              regional_office_name: edit?.regional_office_name || "",
              code: edit?.code || "",
              address_1: edit?.address_1 || "",
              regional_status:
                edit?.status === 0 ? edit?.status : edit?.status || 1,
            }}
            validationSchema={addROSchema}
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
                      label={"Zone Name"}
                      customType={"select"}
                      selectProps={{
                        data: allZones?.map((itm) => {
                          return {
                            value: itm.zone_id,
                            label: itm.zone_name,
                          };
                        }),
                      }}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={4}>
                    <MyInput
                      isRequired
                      name={"regional_office_name"}
                      formikProps={props}
                      label={"Regional Office Name"}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={4}>
                    <MyInput
                      isRequired
                      name={"code"}
                      formikProps={props}
                      label={"Code"}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={4}>
                    <MyInput
                      isRequired
                      name={"regional_status"}
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
                    <MyInput
                      name={"address_1"}
                      formikProps={props}
                      label={"Address"}
                      customType={"multiline"}
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

export default RegionalForm;
