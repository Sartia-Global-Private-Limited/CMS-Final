import React, { useEffect } from "react";
import { useState } from "react";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import {
  addAdminZone,
  getAdminAllEnergy,
  getSingleZones,
  updateAdminZone,
} from "../../../services/authapi";
import { Formik } from "formik";
import { toast } from "react-toastify";
import ConfirmAlert from "../../../components/ConfirmAlert";
import { addZoneSchema } from "../../../utils/formSchema";
import { useNavigate, useParams } from "react-router-dom";
import CardComponent from "../../../components/CardComponent";
import MyInput from "../../../components/MyInput";

const ZoneForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [allEnergy, setAllEnergy] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [edit, setEdit] = useState({});

  const fetchZoneData = async () => {
    const res = await getSingleZones(id);
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit({});
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    if (edit.zone_id) {
      values["id"] = edit.zone_id;
      values["status"] = edit.zone_status;
    }

    const res = edit.zone_id
      ? await updateAdminZone(values)
      : await addAdminZone(values);
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

  useEffect(() => {
    fetchAllEnergyData();
    if (id) {
      fetchZoneData();
    }
  }, []);

  return (
    <>
      <Col md={12}>
        <CardComponent
          showBackButton={true}
          title={edit.zone_id ? "UPDATE - Zone" : "ADD - Zone"}
        >
          <Formik
            enableReinitialize={true}
            initialValues={{
              energy_company_id: edit.energy_company_id || "",
              name: edit.zone_name || "",
              description: edit.zone_description || "",
            }}
            validationSchema={addZoneSchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props?.handleSubmit}>
                <Row className="g-3">
                  <Form.Group as={Col} md={6}>
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
                      }}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={6}>
                    <MyInput
                      isRequired
                      name={"name"}
                      formikProps={props}
                      label={"Zone Name"}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={12}>
                    <MyInput
                      name={"description"}
                      formikProps={props}
                      label={"Description"}
                      customType={"multiline"}
                    />
                  </Form.Group>

                  <Form.Group as={Col} md={12}>
                    <div className="mt-4 text-center">
                      <button
                        type={`${edit.zone_id ? "button" : "submit"}`}
                        onClick={() => setShowAlert(edit.zone_id && true)}
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
                          <>{edit.zone_id ? "UPDATE" : "SAVE"}</>
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

export default ZoneForm;
