import React, { Fragment, useEffect, useState } from "react";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { Formik } from "formik";
import ConfirmAlert from "../../components/ConfirmAlert";
import { useNavigate, useParams } from "react-router-dom";
import CardComponent from "../../components/CardComponent";
import {
  getAllEndUserBySupervisorId,
  getApprovedComplaintsDetailsById,
  getManagerListWithTotalFreeUser,
  getSupervisorListWithTotalFreeUserByManagerId,
  updateAssignComplaintToUser,
} from "../../services/contractorApi";
import { addAllocateSchema } from "../../utils/formSchema";
import { BsTrash } from "react-icons/bs";
import TooltipComponent from "../../components/TooltipComponent";
import { UserDetail, UserDetails } from "../../components/ItemDetail";
import { FORMAT_COMPLAINT_OPTION_LABEL } from "../../components/HelperStructure";
import MyInput from "../../components/MyInput";
import { useTranslation } from "react-i18next";

const UpdateAllocate = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [edit, setEdit] = useState({});
  const [allSupervisors, setAllSupervisors] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allManagers, setAllManagers] = useState([]);
  const [removeId, setRemoveId] = useState(null);

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
    values["complaints_id"] = +id;
    values["action"] = [
      {
        [removeId ? "remove" : "add"]: {
          assign_to: removeId ? [removeId] : [values.user_id],
        },
      },
    ];

    // return console.log("values", values);
    const res = await updateAssignComplaintToUser(values);

    if (res.status) {
      toast.success(res.message);
      if (!removeId) {
        navigate(-1);
        resetForm();
      } else {
        fetchAllUsers(values?.supervisor_id);
      }
    } else {
      toast.error(res.message);
    }
    setSubmitting(false);
    setShowAlert(false);
    setRemoveId(null);
  };

  const userOption = ({ employee_id, value, image, label, isDisabled }) => (
    <div
      className={`${
        isDisabled ? "danger-combo-disable pe-none1" : ""
      } d-flex justify-content-between px-2 align-items-center cursor-pointer`}
    >
      <span className="d-flex align-items-center">
        <img
          className="avatar me-2"
          src={
            image ||
            `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
          }
          alt={""}
        />
        {employee_id} {employee_id && "-"} {label}{" "}
        {isDisabled && (
          <>
            <div className={`vr hr-shadow mx-1`} />
            <TooltipComponent align="left" title={"Free user"}>
              <span
                onClick={() => {
                  setShowAlert(true);
                  setRemoveId(value);
                }}
                className="text-danger fw-bold"
              >
                <BsTrash fontSize={15} />
              </span>
            </TooltipComponent>
          </>
        )}
      </span>
      {isDisabled && (
        <div className="small">
          <span
            className="badge fw-normal ms-2 rounded-pill bg-success"
            style={{ letterSpacing: 2 }}
          >
            Assigned
          </span>
        </div>
      )}
    </div>
  );

  useEffect(() => {
    if (id) {
      fetchSingleData();
    }
    fetchAllManagers();
  }, []);

  return (
    <>
      <Helmet>
        <title>Update Allocate · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent className={"after-bg-light"} title={`Update Allocate`}>
          <Formik
            enableReinitialize={true}
            initialValues={{
              area_manager_id:
                edit?.manager_and_supevisor?.areaManagerDetails?.id || "",
              supervisor_id:
                edit?.manager_and_supevisor?.superVisorDetails?.id || "",
              user_id: edit?.manager_and_supevisor?.endUserDetails?.id || "",
            }}
            validationSchema={addAllocateSchema(!!removeId)}
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
                                <td className="fw-bolds border-last-child text-dark">
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
                                <td className="fw-bolds border-last-child text-dark">
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
                                <td className="fw-bolds border-last-child text-dark">
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
                                <td className="fw-bolds border-last-child text-dark">
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
                          freeEndUsersCount: user.free_end_users,
                        })),
                      }}
                      formatOptionLabel={userOption}
                    />
                  </Form.Group>

                  <Form.Group as={Col} md={12}>
                    <div className="mt-4 text-center">
                      <button
                        type={`button`}
                        onClick={() => setShowAlert(true)}
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
                          "Update ALLOCATE"
                        )}
                      </button>
                      <ConfirmAlert
                        size={"sm"}
                        deleteFunction={props.handleSubmit}
                        hide={setShowAlert}
                        show={showAlert}
                        title={`Confirm ${removeId ? "Remove" : "Update"}`}
                        description={`Are you sure you want to ${
                          removeId ? "remove" : "update"
                        } this!!`}
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

export default UpdateAllocate;
