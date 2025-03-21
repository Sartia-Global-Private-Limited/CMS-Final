import React from "react";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import { Helmet } from "react-helmet";
import CardComponent from "../../../../components/CardComponent";
import Select from "react-select";
import Switch from "../../../../components/Switch";
import { useState } from "react";
import { useEffect } from "react";
import {
  CreatePensionRetirment,
  UpdatePensionRetirment,
  getAdminAllHREmployees,
  getAllUsers,
  getSinglePensionRetirment,
} from "../../../../services/authapi";
import { Formik } from "formik";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { addEmployeePensionRetirmentSchema } from "../../../../utils/formSchema";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { selectUser } from "../../../../features/auth/authSlice";
import { checkPermission } from "../../../../utils/checkPermissions";
import { CREATED, UPDATED } from "../../../../utils/constants";
import MyInput from "../../../../components/MyInput";
import { FORMAT_OPTION_LABEL } from "../../../../components/HelperStructure";

const AddEmployeeRetirement = () => {
  let { pathname } = useLocation();
  const { user } = useSelector(selectUser);
  const [allUserData, setAllUserData] = useState([]);
  const [edit, setEdit] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchAllUsersData = async () => {
    const isDropdown = true;
    const res = await getAdminAllHREmployees({ isDropdown });
    if (res.status) {
      setAllUserData(res.data);
    } else {
      setAllUserData([]);
    }
  };

  const fetchSingleData = async () => {
    const res = await getSinglePensionRetirment(id);
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit({});
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    // return console.log('values', values)
    const sData = {
      user_id: values.user_id,
      retirement_date: values.retirement_date,
      asset_recovery: values.asset_recovery,
      pension_amount: values.pension_amount,
      pension_duration: values.pension_duration,
      allow_commutation: values.allow_commutation,
      commute_percentage: values.commute_percentage,
      retirement_gratuity: values.retirement_gratuity,
      service_gratuity: values.service_gratuity,
      pension_status: values.pension_status.value,
    };
    if (edit.id) {
      sData["id"] = edit.id;
    }

    const params = await checkPermission({
      user_id: user.id,
      pathname: `/${pathname.split("/")[1]}`,
    });
    params["action"] = edit.id ? UPDATED : CREATED;

    // return console.log('sData', sData)
    const res = edit.id
      ? await UpdatePensionRetirment(sData, params)
      : await CreatePensionRetirment(sData, params);
    if (res.status) {
      toast.success(res.message);
      navigate(-1);
      resetForm();
    } else {
      toast.error(res.message);
    }
    setSubmitting(false);
  };

  useEffect(() => {
    fetchAllUsersData();
    if (id !== "new") {
      fetchSingleData();
    }
  }, [id]);

  return (
    <Col md={12} data-aos={"fade-up"}>
      <Helmet>
        <title>Add Employee Retirement · CMS Electricals</title>
      </Helmet>
      <CardComponent
        title={
          edit.id ? "Update Employee Retirement" : "Add Employee Retirement"
        }
      >
        <Formik
          enableReinitialize={true}
          initialValues={{
            user_id: edit.user_id || "",
            retirement_date: edit.retirement_date
              ? moment(edit?.retirement_date).format("YYYY-MM-DD")
              : "",
            asset_recovery: edit.asset_recovery || "",
            pension_amount: edit.pension_amount || "",
            pension_duration: edit.pension_duration || "",
            allow_commutation: Boolean(edit.allow_commutation) || false,
            commute_percentage: edit.commute_percentage || "",
            retirement_gratuity: edit.retirement_gratuity || "",
            service_gratuity: edit.service_gratuity || "",
            pension_status: edit.pension_status
              ? {
                  label: +edit.pension_status == "1" ? "Active" : "Inactive",
                  value: edit.pension_status,
                }
              : {},
          }}
          validationSchema={addEmployeePensionRetirmentSchema}
          onSubmit={handleSubmit}
        >
          {(props) => (
            <Form onSubmit={props?.handleSubmit}>
              <Row className="g-3 align-items-end">
                <Col md={4}>
                  <MyInput
                    isRequired
                    name={"user_id"}
                    formikProps={props}
                    label={"Employee Name"}
                    customType={"select"}
                    selectProps={{
                      data: allUserData?.map((user) => ({
                        label: user.name,
                        value: user.id,
                        image: user.image
                          ? `${process.env.REACT_APP_API_URL}${user.image}`
                          : null,
                      })),
                    }}
                    formatOptionLabel={FORMAT_OPTION_LABEL}
                  />
                </Col>
                <Col md={5}>
                  <Form.Label>
                    Retirement Date <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name={"retirement_date"}
                    value={props.values.retirement_date}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    isInvalid={Boolean(
                      props.touched.retirement_date &&
                        props.errors.retirement_date
                    )}
                  />
                  <Form.Control.Feedback type="invalid">
                    {props.errors.retirement_date}
                  </Form.Control.Feedback>
                </Col>
                <Col md={3}>
                  <Form.Label>
                    Asset Recovery <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name={"asset_recovery"}
                    value={props.values.asset_recovery}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    isInvalid={Boolean(
                      props.touched.asset_recovery &&
                        props.errors.asset_recovery
                    )}
                  />
                  <Form.Control.Feedback type="invalid">
                    {props.errors.asset_recovery}
                  </Form.Control.Feedback>
                </Col>
                <Col md={4}>
                  <Form.Label>
                    Pention Amount <small>(Optional)</small>
                  </Form.Label>
                  <Form.Control
                    name={"pension_amount"}
                    value={props.values.pension_amount}
                    onChange={props.handleChange}
                    type="text"
                  />
                </Col>
                <Col md={5}>
                  <Form.Label>
                    Pention Duration <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name={"pension_duration"}
                    value={props.values.pension_duration}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    isInvalid={Boolean(
                      props.touched.pension_duration &&
                        props.errors.pension_duration
                    )}
                  />
                  <Form.Control.Feedback type="invalid">
                    {props.errors.pension_duration}
                  </Form.Control.Feedback>
                </Col>
                <Col md={3}>
                  <Form.Label>Allow Commutation</Form.Label>
                  <div className="py-1">
                    {" "}
                    No{" "}
                    <Switch
                      checked={Boolean(props.values.allow_commutation)}
                      onChange={(event) =>
                        props.setFieldValue(
                          "allow_commutation",
                          event.target.checked
                        )
                      }
                      name="allow_commutation"
                      value={props.values.allow_commutation}
                    />
                    &nbsp;Yes{" "}
                  </div>
                </Col>
                <Col md={6}>
                  <Form.Label>
                    Commutation Percentage <small>(Optional)</small>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name={"commute_percentage"}
                    value={props.values.commute_percentage}
                    onChange={props.handleChange}
                  />
                </Col>
                <Col md={6}>
                  <Form.Label>
                    Retirement Gratuity <small>(Optional)</small>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name={"retirement_gratuity"}
                    value={props.values.retirement_gratuity}
                    onChange={props.handleChange}
                  />
                </Col>
                <Col md={6}>
                  <Form.Label>
                    Service Gratuity <small>(Optional)</small>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name={"service_gratuity"}
                    value={props.values.service_gratuity}
                    onChange={props.handleChange}
                  />
                </Col>
                <Col md={6}>
                  <Form.Label>Select Status</Form.Label>
                  <Select
                    menuPortalTarget={document.body}
                    name={"pension_status"}
                    options={[
                      { value: "1", label: "active" },
                      { value: "0", label: "inactive" },
                    ]}
                    value={props.values.pension_status}
                    onChange={(selectedOption) => {
                      props.setFieldValue("pension_status", selectedOption);
                    }}
                  />
                </Col>

                <Col md={12}>
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
                        <>{edit.id ? "UPDATE" : "Submit"}</>
                      )}
                    </button>
                  </div>
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      </CardComponent>
    </Col>
  );
};

export default AddEmployeeRetirement;
