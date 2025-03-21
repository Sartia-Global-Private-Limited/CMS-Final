import React, { Fragment, useEffect, useState } from "react";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { Formik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import CardComponent from "../../components/CardComponent";
import {
  getAllEndUserBySupervisorId,
  getApprovedComplaintsDetailsById,
  getManagerListWithTotalFreeUser,
  getSupervisorListWithTotalFreeUserByManagerId,
  postHoldComplaintToUser,
} from "../../services/contractorApi";
import { addAllocateSchema } from "../../utils/formSchema";
import { UserDetail, UserDetails } from "../../components/ItemDetail";
import MyInput from "../../components/MyInput";
import { FORMAT_COMPLAINT_OPTION_LABEL } from "../../components/HelperStructure";
import { useTranslation } from "react-i18next";

const HoldComplaints = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [edit, setEdit] = useState({});
  const [allManagers, setAllManagers] = useState([]);
  const [allSupervisors, setAllSupervisors] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  const fetchSingleData = async () => {
    const res = await getApprovedComplaintsDetailsById(id);
    if (res.status) {
      setEdit(res.data);
      if (res.data?.manager_and_supevisor?.areaManagerDetails?.id) {
        fetchAllSupervisors(
          res.data?.manager_and_supevisor?.areaManagerDetails?.id
        );
      }
      if (res.data?.manager_and_supevisor?.superVisorDetails?.id) {
        fetchAllUsers(res.data?.manager_and_supevisor?.superVisorDetails?.id);
      }
    } else {
      setEdit({});
    }
  };

  //All Managers
  const fetchAllManagers = async () => {
    const res = await getManagerListWithTotalFreeUser(id);
    if (res.status) {
      setAllManagers(res.data);
    } else {
      setAllManagers([]);
    }
  };

  //All Supervisors
  const fetchAllSupervisors = async (managerId) => {
    const res = await getSupervisorListWithTotalFreeUserByManagerId(managerId, {
      complaintId: id,
      type: 1,
    });
    if (res.status) {
      setAllSupervisors(res.data);
    } else {
      setAllSupervisors([]);
      toast.error(res.message);
    }
  };

  //All End_Users
  const fetchAllUsers = async (supervisorId) => {
    const res = await getAllEndUserBySupervisorId(supervisorId);
    if (res.status) {
      setAllUsers(res.data);
    } else {
      setAllUsers([]);
      toast.error(res.message);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    values["complaint_id"] = id;

    // return console.log("values", values);

    const res = await postHoldComplaintToUser(values);

    if (res.status) {
      toast.success(res.message);
      navigate(-1);
    } else {
      toast.error(res.message);
    }
    resetForm();
    setSubmitting(false);
  };

  useEffect(() => {
    if (id) {
      fetchSingleData();
    }
    fetchAllManagers();
  }, []);

  return (
    <>
      <Helmet>
        <title>Hold · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent className={"after-bg-light"} title={"Hold Complaint"}>
          <Formik
            enableReinitialize={true}
            initialValues={{
              area_manager_id:
                edit?.manager_and_supevisor?.areaManagerDetails?.id || "",
              supervisor_id:
                edit?.manager_and_supevisor?.superVisorDetails?.id || "",
              user_id: "",
            }}
            validationSchema={addAllocateSchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props?.handleSubmit}>
                <Row className="g-3">
                  <Col md={6}>
                    <div className="p-20 shadow rounded h-100">
                      <strong className="text-secondary">
                        Company Details
                      </strong>
                      <div className="mt-2">
                        <table className="table-sm table">
                          <tbody>
                            {edit?.energy_company_name && (
                              <tr>
                                <th>Company Name :</th>
                                <td>{edit?.energy_company_name}</td>
                              </tr>
                            )}
                            {edit?.regionalOffices && (
                              <tr>
                                <th>Regional Office :</th>
                                <td>
                                  {edit?.regionalOffices?.map((ro, id3) => {
                                    return (
                                      <span key={id3}>
                                        {ro.regional_office_name}
                                      </span>
                                    );
                                  })}
                                </td>
                              </tr>
                            )}
                            {edit?.saleAreas && (
                              <tr>
                                <th>Sales Area :</th>
                                <td>
                                  {edit?.saleAreas?.map((sale, id4) => {
                                    return (
                                      <span key={id4}>
                                        {sale.sales_area_name}
                                      </span>
                                    );
                                  })}
                                </td>
                              </tr>
                            )}
                            {edit?.districts && (
                              <tr>
                                <th>District :</th>
                                <td>
                                  {edit?.districts?.map((dict, id5) => {
                                    return (
                                      <span key={id5}>
                                        {dict.district_name}
                                      </span>
                                    );
                                  })}
                                </td>
                              </tr>
                            )}
                            {edit?.outlets && (
                              <tr>
                                <th>Outlet :</th>
                                <td>
                                  {edit?.outlets?.map((on, id2) => {
                                    return (
                                      <span key={id2}>{on.outlet_name}</span>
                                    );
                                  })}
                                </td>
                              </tr>
                            )}
                            {edit?.order_by_details && (
                              <tr>
                                <th>Order By :</th>
                                <td>{edit?.order_by_details}</td>
                              </tr>
                            )}
                            {edit?.order_via_details && (
                              <tr>
                                <th>Order Via :</th>
                                <td>{edit?.order_via_details}</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="p-20 shadow rounded h-100">
                      <strong className="text-secondary">
                        Complaint Details
                      </strong>
                      <div className="mt-2">
                        <table className="table-sm table">
                          <tbody>
                            {edit?.complaint_raise_by && (
                              <tr>
                                <th>Complaint Raise By :</th>
                                <td>{edit?.complaint_raise_by}</td>
                              </tr>
                            )}
                            {edit?.complaint_type && (
                              <tr>
                                <th>Complaint Type :</th>
                                <td>{edit?.complaint_type}</td>
                              </tr>
                            )}
                            {edit?.complaint_unique_id && (
                              <tr>
                                <th>Complaint Id :</th>
                                <td>{edit?.complaint_unique_id}</td>
                              </tr>
                            )}
                            {edit?.manager_and_supevisor?.areaManagerDetails
                              ?.id && (
                              <tr>
                                <th className="align-middle">Manager :</th>
                                <td>
                                  <UserDetail
                                    img={
                                      edit?.manager_and_supevisor
                                        ?.areaManagerDetails?.image
                                    }
                                    name={
                                      edit?.manager_and_supevisor
                                        ?.areaManagerDetails?.name
                                    }
                                    unique_id={
                                      edit?.manager_and_supevisor
                                        ?.areaManagerDetails?.employee_id
                                    }
                                  />
                                </td>
                              </tr>
                            )}
                            {edit?.manager_and_supevisor?.superVisorDetails
                              ?.id && (
                              <tr>
                                <th className="align-middle">SuperVisor :</th>
                                <td>
                                  <UserDetail
                                    img={
                                      edit?.manager_and_supevisor
                                        ?.superVisorDetails?.image
                                    }
                                    name={
                                      edit?.manager_and_supevisor
                                        ?.superVisorDetails?.name
                                    }
                                    unique_id={
                                      edit?.manager_and_supevisor
                                        ?.superVisorDetails?.employee_id
                                    }
                                  />
                                </td>
                              </tr>
                            )}
                            {edit?.manager_and_supevisor?.endUserDetails && (
                              <tr>
                                <th className="align-middle">End User :</th>
                                <td>
                                  {edit?.manager_and_supevisor?.endUserDetails?.map(
                                    (data, idx) => {
                                      return (
                                        <Fragment key={idx}>
                                          <UserDetails
                                            img={data?.image}
                                            name={data?.name}
                                            id={data?.id}
                                            unique_id={data?.employee_id}
                                          />
                                        </Fragment>
                                      );
                                    }
                                  )}
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </Col>
                  <Form.Group as={Col} md={12}>
                    <MyInput
                      isRequired
                      name={"area_manager_id"}
                      formikProps={props}
                      label={t("Manager")}
                      isDisabled={edit?.isComplaintAssigned}
                      customType={"select"}
                      selectProps={{
                        data: allManagers?.map((user) => ({
                          label: user.name,
                          value: user.id,
                          image: user.image
                            ? `${process.env.REACT_APP_API_URL}${user.image}`
                            : null,
                          isDisabled: user.isAssigned,
                          supervisorUsers: user.supervisorUsers,
                          free_supervisor_users: user.free_supervisor_users,
                          free_end_users: user.free_end_users,
                        })),
                        onChange: (e) => {
                          if (e?.value) {
                            fetchAllSupervisors(e?.value);
                          }
                          props.setFieldValue("supervisor_id", "");
                          props.setFieldValue("user_id", "");
                        },
                      }}
                      formatOptionLabel={FORMAT_COMPLAINT_OPTION_LABEL}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={12}>
                    <MyInput
                      isRequired
                      name={"supervisor_id"}
                      formikProps={props}
                      label={t("Supervisor")}
                      isDisabled={edit?.isComplaintAssigned}
                      customType={"select"}
                      selectProps={{
                        data: allSupervisors?.map((user) => ({
                          label: user.name,
                          value: user.id,
                          image: user.image
                            ? `${process.env.REACT_APP_API_URL}${user.image}`
                            : null,
                          isDisabled: user.isAssigned,
                          free_end_users: user.free_end_users,
                        })),
                        onChange: (e) => {
                          if (e?.value) {
                            fetchAllUsers(e?.value);
                          }
                          props.setFieldValue("user_id", "");
                        },
                      }}
                      formatOptionLabel={FORMAT_COMPLAINT_OPTION_LABEL}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={12}>
                    <MyInput
                      isRequired
                      name={"user_id"}
                      formikProps={props}
                      label={"Free End User"}
                      customType={"select"}
                      selectProps={{
                        data: allUsers?.map((user) => ({
                          value: user.id,
                          label: user.name,
                          employee_id: user.employee_id,
                          image: user.image
                            ? `${process.env.REACT_APP_API_URL}${user.image}`
                            : null,
                          isDisabled: user.isAssigned,
                        })),
                      }}
                      formatOptionLabel={FORMAT_COMPLAINT_OPTION_LABEL}
                    />
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
                            />
                            PLEASE WAIT...
                          </>
                        ) : (
                          "Hold Complaint"
                        )}
                      </button>
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

export default HoldComplaints;
