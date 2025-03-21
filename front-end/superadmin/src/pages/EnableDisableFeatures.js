import React, { useEffect, useRef, useState } from "react";
import { Col, Accordion, Spinner, Form } from "react-bootstrap";
import { Helmet } from "react-helmet";
import CardComponent from "../components/CardComponent";
import Switch from "../components/Switch";
import Select from "react-select";
import {
  AdminCreateEnableDisable,
  AdminUpdateEnableDisable,
  getAdminAllEnableDisable,
  getAdminEnableDisablebyRole,
  getAdminEnableDisablebyAdmin,
} from "../services/authapi";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { FieldArray, Formik } from "formik";
import { toast } from "react-toastify";
import { addEnableDisableSchema } from "../utils/formSchema";

const EnableDisableFeatures = () => {
  const [enableDisable, setEnableDisable] = useState([]);
  const [userType, setAllUserType] = useState([]);
  const [userName, setUserName] = useState("");
  const userTypeRef = useRef(null);
  const userNameRef = useRef(null);
  const [allUserName, setAllUserName] = useState([]);

  const fetchEnableDisableData = async () => {
    const res = await getAdminAllEnableDisable();
    if (res.status) {
      setEnableDisable(res.data);
    } else {
      setEnableDisable([]);
    }
  };

  const fetchUserTypeData = async (id, setFieldValue) => {
    const res = await getAdminEnableDisablebyRole(id);
    if (res.status) {
      setAllUserType(res.data);
    } else {
      setAllUserType([]);
      toast.error(res.message);
      setFieldValue("id", "");
    }
    userTypeRef.current.clearValue();
    userNameRef.current.clearValue();
  };

  const fetchUserNameData = async (id, setFieldValue) => {
    const res = await getAdminEnableDisablebyAdmin(id);
    if (res.status) {
      setAllUserName(res.data);
    } else {
      setAllUserName([]);
      toast.error(res.message);
      setFieldValue("id", "");
    }
    userNameRef.current.clearValue();
  };

  const handlePanelTypeChange = async (val, setFieldValue) => {
    if (setFieldValue) {
      setFieldValue("panel_type", val);
    }
    if (!val) return false;
    fetchUserTypeData(val.value, setFieldValue);
  };

  const handleUserTypeChange = async (val, setFieldValue) => {
    if (setFieldValue) {
      setFieldValue("admin_name", val);
    }
    if (!val) return false;
    fetchUserNameData(val.value, setFieldValue);
  };

  const handleUserNameChange = async (e, setFieldValue) => {
    if (setFieldValue) {
      setFieldValue("user_name", e);
    }
    setUserName(e?.value);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      panel_type: values.panel_type.value,
      admin_name: values.admin_name.value,
      user_name: values.user_name.value,
      moduleName: enableDisable,
    };
    // return console.log('sData', sData);
    const res = await AdminCreateEnableDisable(sData);
    if (res.status) {
      toast.success(res.message);
      fetchEnableDisableData();
      resetForm();
    } else {
      toast.error(res.message);
    }
    setSubmitting(false);
  };

  useEffect(() => {
    fetchEnableDisableData();
  }, []);

  const handleChange = (event, parentIndex, childIndex, subChildIndex) => {
    const { checked } = event.target;

    setEnableDisable((prevState) =>
      prevState.map((firstData, i1) => {
        if (i1 === parentIndex) {
          const updatedSubmodules = firstData.submodules.map(
            (secondData, i2) => {
              if (i2 === childIndex) {
                const updatedModulesOfSubModule =
                  secondData.modulesOfSubModule.map((thirdData, i3) => {
                    if (i3 === subChildIndex) {
                      return { ...thirdData, checked };
                    }
                    return thirdData;
                  });

                const anyModulesChecked = updatedModulesOfSubModule.some(
                  (thirdData) => thirdData.checked
                );
                return {
                  ...secondData,
                  checked: anyModulesChecked ? true : checked,
                  modulesOfSubModule: updatedModulesOfSubModule,
                };
              }
              return secondData;
            }
          );

          const anySubmodulesChecked = updatedSubmodules.some(
            (secondData) => secondData.checked
          );
          return {
            ...firstData,
            checked: anySubmodulesChecked ? true : checked,
            submodules: updatedSubmodules,
          };
        }

        return firstData;
      })
    );
  };

  return (
    <>
      <Helmet>
        <title>Enable & Disable Features · CMS Electricals</title>
      </Helmet>
      <Col
        md={12}
        className="my-accordion EnableDisable-area"
        data-aos={"fade-up"}
      >
        <Formik
          enableReinitialize={true}
          initialValues={{
            panel_type: "",
            admin_name: "",
            user_name: "",
            moduleName: [],
          }}
          validationSchema={addEnableDisableSchema}
          onSubmit={handleSubmit}
        >
          {(props) => (
            <Form onSubmit={props?.handleSubmit}>
              <CardComponent
                title={"Enable & Disable Features"}
                custom2={
                  <>
                    <Select
                      menuPortalTarget={document.body}
                      className="text-primary"
                      name={"panel_type"}
                      options={[
                        { label: "Energy Company", value: 2 },
                        { label: "Contractor", value: 3 },
                        { label: "Dealer", value: 4 },
                      ]}
                      value={props.values.panel_type}
                      onChange={(e) => {
                        handlePanelTypeChange(e, props.setFieldValue);
                      }}
                    />
                    <Select
                      ref={userTypeRef}
                      menuPortalTarget={document.body}
                      className="text-primary"
                      name={"admin_name"}
                      options={userType.map((admin) => ({
                        label: admin.admin_name,
                        value: admin.admin_id,
                      }))}
                      value={props.values.admin_name}
                      onChange={(e) => {
                        handleUserTypeChange(e, props.setFieldValue);
                      }}
                    />

                    <Select
                      ref={userNameRef}
                      placeholder="--Select--"
                      menuPortalTarget={document.body}
                      name={"user_name"}
                      options={allUserName.map((usert) => ({
                        label: usert.user_name,
                        value: usert.user_id,
                      }))}
                      value={props.values.user_name}
                      onChange={(e) => {
                        handleUserNameChange(e, props.setFieldValue);
                      }}
                    />
                  </>
                }
              >
                {userName ? (
                  <>
                    <FieldArray name="moduleName">
                      {() => (
                        <SimpleBar className="area p-3">
                          {enableDisable?.map((firstData, i1) =>
                            firstData?.submodules?.length > 0 ? (
                              <Accordion key={i1} className="mb-2">
                                <Accordion.Item eventKey="0">
                                  <Accordion.Header>
                                    <span className="d-inline-flex justify-content-between w-100 me-3">
                                      <Switch
                                        name={`moduleName.${i1}.${firstData?.title}`}
                                        onChange={(event) =>
                                          handleChange(event, i1)
                                        }
                                        idFor={firstData?.title}
                                        title={firstData?.title}
                                        checked={firstData.checked}
                                      />
                                    </span>
                                  </Accordion.Header>
                                  <Accordion.Body>
                                    {/* Second data */}
                                    {firstData?.submodules?.map(
                                      (secondData, i2) =>
                                        secondData?.modulesOfSubModule?.length >
                                        0 ? (
                                          <Accordion key={i2} className="mb-2">
                                            <Accordion.Item eventKey="0">
                                              <Accordion.Header>
                                                <span className="d-inline-flex justify-content-between w-100 me-3">
                                                  <Switch
                                                    name={`moduleName.${i1}.submodules.${i2}.${secondData?.title}`}
                                                    onChange={(event) =>
                                                      handleChange(
                                                        event,
                                                        i1,
                                                        i2
                                                      )
                                                    }
                                                    idFor={secondData?.title}
                                                    title={secondData?.title}
                                                    checked={secondData.checked}
                                                  />
                                                </span>
                                              </Accordion.Header>
                                              <Accordion.Body>
                                                {/* Third data */}
                                                {secondData?.modulesOfSubModule?.map(
                                                  (thirdData, i3) => (
                                                    <div
                                                      key={i3}
                                                      style={{
                                                        padding:
                                                          "0.7rem 0.7rem",
                                                      }}
                                                      className="shadow text-gray mb-2 rounded"
                                                    >
                                                      <span className="d-inline-flex justify-content-between w-100 me-3">
                                                        <Switch
                                                          name={`moduleName.${i1}.submodules.${i2}.modulesOfSubModule.${i3}.${thirdData?.title}`}
                                                          onChange={(event) =>
                                                            handleChange(
                                                              event,
                                                              i1,
                                                              i2,
                                                              i3
                                                            )
                                                          }
                                                          idFor={
                                                            thirdData?.title
                                                          }
                                                          title={
                                                            thirdData?.title
                                                          }
                                                          checked={
                                                            thirdData.checked
                                                          }
                                                        />
                                                      </span>
                                                    </div>
                                                  )
                                                )}
                                                {/* Third end data */}
                                              </Accordion.Body>
                                            </Accordion.Item>
                                          </Accordion>
                                        ) : (
                                          <div
                                            key={i2}
                                            style={{ padding: "0.7rem 0.7rem" }}
                                            className="shadow text-gray mb-2 rounded"
                                          >
                                            <span className="d-inline-flex justify-content-between w-100 me-3">
                                              <Switch
                                                name={`moduleName.${i1}.submodules.${i2}.${secondData?.title}`}
                                                onChange={(event) =>
                                                  handleChange(event, i1, i2)
                                                }
                                                idFor={secondData?.title}
                                                title={secondData?.title}
                                                checked={secondData.checked}
                                              />
                                            </span>
                                          </div>
                                        )
                                    )}
                                    {/* Second end data */}
                                  </Accordion.Body>
                                </Accordion.Item>
                              </Accordion>
                            ) : (
                              <div
                                key={i1}
                                style={{ padding: "0.7rem 0.7rem" }}
                                className="shadow text-gray mb-2 rounded"
                              >
                                <span className="d-inline-flex justify-content-between w-100 me-3">
                                  <Switch
                                    name={`moduleName.${i1}.${firstData?.title}`}
                                    onChange={(event) =>
                                      handleChange(event, i1)
                                    }
                                    idFor={firstData?.title}
                                    title={firstData?.title}
                                    checked={firstData.checked}
                                  />
                                </span>
                              </div>
                            )
                          )}
                        </SimpleBar>
                      )}
                    </FieldArray>
                    <Form.Group as={Col} md={12}>
                      <div className="text-center mt-4">
                        <button
                          type="submit"
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
                            <>{"SAVE Permissions"}</>
                          )}
                        </button>
                      </div>
                    </Form.Group>
                  </>
                ) : (
                  <div className="text-center">
                    <img
                      className="mb-3 p-3"
                      alt="no-result"
                      width="400"
                      src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                    />
                  </div>
                )}
              </CardComponent>
            </Form>
          )}
        </Formik>
      </Col>
    </>
  );
};

export default EnableDisableFeatures;
