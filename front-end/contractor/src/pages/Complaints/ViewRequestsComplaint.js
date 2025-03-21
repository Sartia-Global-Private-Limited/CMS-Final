import React, { useState, useEffect, Fragment } from "react";
import { Col, Card, Row, Table } from "react-bootstrap";
import { Helmet } from "react-helmet";
import "simplebar-react/dist/simplebar.min.css";
import SimpleBar from "simplebar-react";
import TextareaAutosize from "react-textarea-autosize";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  getApprovedComplaintsDetailsById,
  getComplaintsDetailsById,
  getComplaintsTimelineById,
  getTotalMemberOnSingleComplaintById,
  postApprovedComplaints,
  postRejectApprovedComplaints,
  postRejectComplaints,
} from "../../services/contractorApi";
import {
  BsArrowLeft,
  BsCheckLg,
  BsClock,
  BsDashLg,
  BsLightningCharge,
  BsPlusLg,
  BsXLg,
} from "react-icons/bs";
import Tabs, { Tab } from "react-best-tabs";
import "react-best-tabs/dist/index.css";
import CardComponent from "../../components/CardComponent";
import ImageViewer from "../../components/ImageViewer";
import ActionButton from "../../components/ActionButton";
import TooltipComponent from "../../components/TooltipComponent";
import { toast } from "react-toastify";
import ConfirmAlert from "../../components/ConfirmAlert";
import { Formik } from "formik";
import { addRemarkSchema } from "../../utils/formSchema";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import { ViewUpdateStatus } from "./ViewUpdateStatus";
import {
  ItemDetail,
  UserDetail,
  UserDetails,
} from "../../components/ItemDetail";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import { formatNumberToINR, TOGGLE_ROW_HELPER } from "../../utils/helper";

const ViewRequestsComplaint = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { user } = useSelector(selectUser);
  const type = searchParams.get("type") || null;
  const [dataById, setDataById] = useState({});
  const [timelineData, setTimelineData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [showRejectAlert, setShowRejectAlert] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [actionStatus, setActionStatus] = useState(null);
  const [totalMemberData, setTotalMemberData] = useState("");
  const { t } = useTranslation();

  const fetchSingleData = async () => {
    const res = type
      ? await getApprovedComplaintsDetailsById(id)
      : await getComplaintsDetailsById(id);
    if (res.status) {
      setDataById(res.data);
    } else {
      setDataById({});
    }
  };
  const fetchTimelineData = async () => {
    const res = await getComplaintsTimelineById(id);
    if (res.status) {
      setTimelineData(res.data);
    } else {
      setTimelineData({});
    }
  };

  const fetchTotalMemberData = async () => {
    const res = await getTotalMemberOnSingleComplaintById(id);
    if (res.status) {
      setTotalMemberData(res.data);
    } else {
      setTotalMemberData([]);
    }
  };

  const history = useNavigate();

  useEffect(() => {
    fetchSingleData();
    if (type) {
      fetchTimelineData();
      fetchTotalMemberData();
    }
  }, []);

  const [collapsedFundRows, setCollapsedFundRows] = useState([]);
  const [collapsedStockRows, setCollapsedStockRows] = useState([]);

  const tabs = [
    {
      title: (
        <>
          <BsArrowLeft
            title="back"
            fontSize={22}
            onClick={() => history(-1)}
            className="me-2 pe-auto cursor-pointer"
          />
          {dataById?.energy_company_name} - {t("Details")}
        </>
      ),
      className: "pe-none fw-bold",
    },
    {
      title: `${dataById?.complaint_for === "1" ? t("Energy") : t("Other")} ${t(
        "Company Details"
      )}`,
      className: "ms-auto",
      page: <PersonalInfo />,
    },
    {
      title: t("Complaints Timeline"),
      className: !type && "d-none",
      page: <TimelineHistory />,
    },
  ];

  const handleCheckboxChange = (data, status) => {
    setActionStatus(status);
    setShowAlert(true);
    setSelectedRows(data);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {};

    if (actionStatus === 4) {
      sData["id"] = selectedRows?.id;
      sData["rejected_remark"] = values.remark;
      sData["status"] = 4;
    } else {
      sData["complaint_id"] = selectedRows?.id;
    }

    // return console.log("sData", sData);
    const res =
      actionStatus === 4
        ? await postRejectComplaints(sData)
        : await postApprovedComplaints(sData);
    if (res.status) {
      toast.success(res.message);
      fetchSingleData();
    } else {
      toast.error(res.message);
    }
    setShowAlert(false);
    resetForm();
    setSubmitting(false);
  };
  const handleSubmitRejectData = async (
    values,
    { setSubmitting, resetForm }
  ) => {
    const sData = {
      id: id,
      status: 4,
      rejected_remark: values.remark,
    };

    // return console.log("sData", sData);
    const res = await postRejectApprovedComplaints(sData);
    if (res.status) {
      toast.success(res.message);
      fetchSingleData();
    } else {
      toast.error(res.message);
    }
    resetForm();
    setShowRejectAlert(false);
    setSubmitting(false);
  };

  function PersonalInfo() {
    return (
      <Row className="g-3 py-1">
        <Formik
          enableReinitialize={true}
          initialValues={{
            remark: "",
          }}
          validationSchema={actionStatus === 4 ? addRemarkSchema : null}
          onSubmit={handleSubmit}
        >
          {(props) => (
            <ConfirmAlert
              formikProps={props}
              size={"sm"}
              hide={setShowAlert}
              show={showAlert}
              type="submit"
              title={`Confirm ${actionStatus === 4 ? "Reject" : "Approve"}`}
              description={
                <>
                  Are you sure you want to{" "}
                  {actionStatus === 4 ? "reject" : "approve"} this!!
                  {actionStatus === 4 ? (
                    <>
                      <TextareaAutosize
                        minRows={3}
                        placeholder="type remarks..."
                        onChange={props.handleChange}
                        name="remark"
                        className="edit-textarea mt-3"
                        onBlur={props.handleBlur}
                        isInvalid={Boolean(
                          props.touched.remark && props.errors.remark
                        )}
                      />
                      <small className="text-danger">
                        {props.errors.remark}
                      </small>
                    </>
                  ) : null}
                </>
              }
            />
          )}
        </Formik>
        <Col md={6}>
          <div className="p-20 shadow rounded h-100">
            <strong className="text-secondary">{t("Company Details")}</strong>
            <div className="mt-2">
              <table className="table-sm table">
                <tbody>
                  <tr>
                    <th>{t("Company Name")} :</th>
                    <td>{dataById?.energy_company_name || "-"}</td>
                  </tr>

                  <tr>
                    <th>{t("Company Address")} :</th>
                    <td>{dataById?.company_address || "-"}</td>
                  </tr>

                  {dataById?.regionalOffices && (
                    <tr>
                      <th>{t("Regional Office Name")} :</th>
                      <td className="fw-bolds border-last-child text-dark">
                        {dataById?.regionalOffices?.map((ro, id3) => {
                          return (
                            <span key={id3} className="hr-border">
                              {ro.regional_office_name}
                            </span>
                          );
                        })}
                      </td>
                    </tr>
                  )}
                  {dataById?.saleAreas && (
                    <tr>
                      <th>{t("Sales Area Name")} :</th>
                      <td className="fw-bolds border-last-child text-dark">
                        {dataById?.saleAreas?.map((sale, id4) => {
                          return (
                            <span key={id4} className="hr-border">
                              {sale.sales_area_name}
                            </span>
                          );
                        })}
                      </td>
                    </tr>
                  )}
                  {dataById?.districts && (
                    <tr>
                      <th>{t("District Name")} :</th>
                      <td className="fw-bolds border-last-child text-dark">
                        {dataById?.districts?.map((dict, id5) => {
                          return (
                            <span key={id5} className="hr-border">
                              {dict.district_name || "-"}
                            </span>
                          );
                        })}
                      </td>
                    </tr>
                  )}
                  {dataById?.outlets && (
                    <>
                      <tr>
                        <th>{t("Outlet Name")} :</th>
                        <td className="fw-bolds border-last-child text-dark">
                          {dataById?.outlets?.map((on, id2) => {
                            return (
                              <span key={id2} className="hr-border">
                                {on.outlet_name}
                              </span>
                            );
                          })}
                        </td>
                      </tr>
                      <tr>
                        <th>{t("Outlet Address")} :</th>
                        <td className="fw-bolds border-last-child text-dark">
                          {dataById?.outlets?.map((on, id2) => {
                            return (
                              <span key={id2} className="hr-border">
                                {on.address}
                              </span>
                            );
                          })}
                        </td>
                      </tr>
                      <tr>
                        <th>{t("Outlet ccnohsd")} :</th>
                        <td className="fw-bolds border-last-child text-dark">
                          {dataById?.outlets?.map((on, id2) => {
                            return (
                              <span key={id2} className="hr-border">
                                {on.outlet_ccnohsd}
                              </span>
                            );
                          })}
                        </td>
                      </tr>
                      <tr>
                        <th>{t("Outlet ccnoms")} :</th>
                        <td className="fw-bolds border-last-child text-dark">
                          {dataById?.outlets?.map((on, id2) => {
                            return (
                              <span key={id2} className="hr-border">
                                {on.outlet_ccnohsd}
                              </span>
                            );
                          })}
                        </td>
                      </tr>
                    </>
                  )}

                  <tr>
                    <th>{t("Order By")} :</th>
                    <td>{dataById?.order_by_details || "-"}</td>
                  </tr>

                  {dataById?.order_via_details && (
                    <tr>
                      <th>{t("Order Via")} :</th>
                      <td>{dataById?.order_via_details}</td>
                    </tr>
                  )}
                  {dataById?.getOrderViaDetails && (
                    <tr>
                      <th>{t("Order Via")} :</th>
                      <td>{dataById?.getOrderViaDetails}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Col>
        <Col md={6}>
          <div className="p-20 shadow rounded h-100">
            <strong className="text-secondary">{t("Complaint Details")}</strong>
            <div className="mt-2">
              <table className="table-sm table">
                <tbody>
                  {dataById?.complaint_raise_by && (
                    <tr>
                      <th>{t("Complaint Raise By")} :</th>
                      <td>{dataById?.complaint_raise_by}</td>
                    </tr>
                  )}
                  {dataById?.complaint_type && (
                    <tr>
                      <th>{t("Complaint Type")} :</th>
                      <td>{dataById?.complaint_type}</td>
                    </tr>
                  )}
                  {dataById?.complaint_unique_id && (
                    <tr>
                      <th>{t("Complaint Id")} :</th>
                      <td>{dataById?.complaint_unique_id}</td>
                    </tr>
                  )}
                  {dataById?.manager_and_supevisor?.areaManagerDetails?.id && (
                    <tr>
                      <th className="align-middle">{t("Area manager")} :</th>
                      <td>
                        <UserDetail
                          img={
                            dataById?.manager_and_supevisor?.areaManagerDetails
                              ?.image
                          }
                          name={
                            dataById?.manager_and_supevisor?.areaManagerDetails
                              ?.name
                          }
                          id={
                            dataById?.manager_and_supevisor?.areaManagerDetails
                              ?.id
                          }
                          unique_id={
                            dataById?.manager_and_supevisor?.areaManagerDetails
                              ?.employee_id
                          }
                        />
                      </td>
                    </tr>
                  )}

                  {dataById?.manager_and_supevisor?.superVisorDetails?.id && (
                    <tr>
                      <th className="align-middle">{t("Supervisor")} :</th>
                      <td>
                        <UserDetail
                          img={
                            dataById?.manager_and_supevisor?.superVisorDetails
                              ?.image
                          }
                          name={
                            dataById?.manager_and_supevisor?.superVisorDetails
                              ?.name
                          }
                          id={
                            dataById?.manager_and_supevisor?.superVisorDetails
                              ?.id
                          }
                          unique_id={
                            dataById?.manager_and_supevisor?.superVisorDetails
                              ?.employee_id
                          }
                        />
                      </td>
                    </tr>
                  )}

                  {dataById?.manager_and_supevisor?.endUserDetails && (
                    <tr>
                      <th className="align-middle">{t("End User")} :</th>
                      <td>
                        {dataById?.manager_and_supevisor?.endUserDetails?.map(
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

                  {dataById?.status === "rejected" ||
                  dataById?.status === "resolved" ? null : (
                    <tr>
                      <th className="align-middle">{t("Action")} :</th>
                      <td>
                        <ActionButton
                          gap={1}
                          className="justify-content-start"
                          hideEye={"d-none"}
                          editlink={`/create-complaint/${dataById.id}`}
                          hideDelete={"d-none"}
                          custom={
                            type || dataById?.status === "working" ? null : (
                              <>
                                <div className={`vr hr-shadow`} />
                                <TooltipComponent title={"Approve"}>
                                  <span
                                    onClick={() =>
                                      handleCheckboxChange(dataById, 1)
                                    }
                                    // onClick={() => setShowAlert(true)}
                                    className={`social-btn ${
                                      dataById.hasComplaintApprovedAccess
                                        ? "success-combo"
                                        : "danger-combo-disable pe-none"
                                    }`}
                                  >
                                    <BsCheckLg />
                                  </span>
                                </TooltipComponent>
                                <div className={`vr hr-shadow`} />
                                <TooltipComponent title={"Reject"}>
                                  <span
                                    onClick={() =>
                                      handleCheckboxChange(dataById, 4)
                                    }
                                    className={`social-btn ${
                                      dataById.hasComplaintApprovedAccess
                                        ? "red-combo"
                                        : "danger-combo-disable pe-none"
                                    }`}
                                  >
                                    <BsXLg />
                                  </span>
                                </TooltipComponent>
                              </>
                            )
                          }
                        />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Col>
        <Col md={12}>
          <div className="p-20 shadow rounded h-100">
            <strong className="text-secondary">{t("Other Details")}</strong>
            <div className="mt-2">
              <table className="table-sm table">
                <tbody>
                  {dataById?.created_at && (
                    <tr>
                      <th>{t("Created At")} :</th>
                      <td>{dataById?.created_at}</td>
                    </tr>
                  )}
                  {dataById?.description && (
                    <tr>
                      <th>{t("Description")} :</th>
                      <td>{dataById?.description}</td>
                    </tr>
                  )}
                  {dataById?.status && (
                    <tr>
                      <th>{t("status")} :</th>
                      <td
                        className={`text-${
                          dataById.status === "rejected"
                            ? "danger"
                            : dataById.status === "done" ||
                              dataById.status === "resolved"
                            ? "green"
                            : "orange"
                        }`}
                      >
                        <BsLightningCharge />
                        {dataById?.status}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Col>
      </Row>
    );
  }
  function TimelineHistory() {
    return (
      <Row className="g-2">
        <Col md={6}>
          <div className="d-grid gap-3">
            <CardComponent
              heading2={
                <span className="text-secondary">{t("Complaint Details")}</span>
              }
              backButton={false}
              custom2={
                <>
                  {t("members Count")} : <b>{totalMemberData}</b>
                </>
              }
            >
              <table className="table-sm table">
                <tbody>
                  {dataById?.complaint_unique_id && (
                    <tr>
                      <th>{t("Complaint Id")} :</th>
                      <td>{dataById?.complaint_unique_id}</td>
                    </tr>
                  )}
                  {timelineData?.complaintDetails?.complaint_type ? (
                    <tr>
                      <th>{t("complaint type")} :</th>
                      <td>{timelineData?.complaintDetails?.complaint_type}</td>
                    </tr>
                  ) : null}
                  {timelineData?.complaintDetails?.complaint_description ? (
                    <tr>
                      <th>{t("complaint description")} :</th>
                      <td>
                        {timelineData?.complaintDetails?.complaint_description}
                      </td>
                    </tr>
                  ) : null}
                  {timelineData?.complaintDetails?.complaint_Status ? (
                    <tr>
                      <th>{t("complaint Status")} :</th>
                      <td
                        className={`text-${
                          timelineData?.complaintDetails?.complaint_Status ===
                          "rejected"
                            ? "danger"
                            : timelineData?.complaintDetails
                                ?.complaint_Status === "done" ||
                              timelineData?.complaintDetails
                                ?.complaint_Status === "resolved"
                            ? "green"
                            : "orange"
                        }`}
                      >
                        <BsLightningCharge />
                        {timelineData?.complaintDetails?.complaint_Status}
                      </td>
                    </tr>
                  ) : null}
                  {timelineData?.complaintDetails?.complaint_generated_at ? (
                    <tr>
                      <th>{t("complaint generated at")} :</th>
                      <td>
                        {timelineData?.complaintDetails?.complaint_generated_at}
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </CardComponent>
            <CardComponent
              backButton={false}
              heading2={
                <span className="text-secondary">
                  {t("Complaint Raiser Details")}
                </span>
              }
            >
              <table className="table-sm table">
                <tbody>
                  {timelineData?.complaintRaiserDetails?.name ? (
                    <tr>
                      <th>{t("Name")} :</th>
                      <td>{timelineData?.complaintRaiserDetails?.name}</td>
                    </tr>
                  ) : null}
                  {timelineData?.complaintRaiserDetails?.image ? (
                    <tr>
                      <th>{t("image")} :</th>
                      <td>
                        <ImageViewer
                          src={
                            timelineData?.complaintRaiserDetails?.image
                              ? `${process.env.REACT_APP_API_URL}${timelineData?.complaintRaiserDetails?.image}`
                              : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                          }
                        >
                          <img
                            className="my-btn object-fit"
                            src={
                              timelineData?.complaintRaiserDetails?.image
                                ? `${process.env.REACT_APP_API_URL}${timelineData?.complaintRaiserDetails?.image}`
                                : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                            }
                            alt={""}
                          />
                        </ImageViewer>
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </CardComponent>
            <CardComponent
              backButton={false}
              heading2={
                <span className="text-secondary">
                  {t("Complaint")}-
                  {timelineData?.complaintDetails?.complaint_Status ===
                  t("rejected")
                    ? t("Rejected")
                    : t("Approved")}{" "}
                  {t("Details")}
                </span>
              }
            >
              <table className="table-sm table">
                <tbody>
                  {timelineData?.complaintApprovalData?.name ? (
                    <tr>
                      <th>{t("Name")} :</th>
                      <td>{timelineData?.complaintApprovalData?.name}</td>
                    </tr>
                  ) : null}
                  {timelineData?.complaintApprovalData?.image ? (
                    <tr>
                      <th>{t("image")} :</th>
                      <td>
                        <ImageViewer
                          src={
                            timelineData?.complaintApprovalData?.image
                              ? `${process.env.REACT_APP_API_URL}${timelineData?.complaintApprovalData?.image}`
                              : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                          }
                        >
                          <img
                            className="my-btn object-fit"
                            src={
                              timelineData?.complaintApprovalData?.image
                                ? `${process.env.REACT_APP_API_URL}${timelineData?.complaintApprovalData?.image}`
                                : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                            }
                            alt={""}
                          />
                        </ImageViewer>
                      </td>
                    </tr>
                  ) : null}
                  {timelineData?.complaintApprovalData?.approve_title ? (
                    <tr>
                      <th>{t("title")} :</th>
                      <td>
                        {timelineData?.complaintApprovalData?.approve_title}
                      </td>
                    </tr>
                  ) : null}
                  {timelineData?.complaintApprovalData?.approve_remarks ? (
                    <tr>
                      <th>{t("Remark")} :</th>
                      <td>
                        {timelineData?.complaintApprovalData?.approve_remarks}
                      </td>
                    </tr>
                  ) : null}
                  {timelineData?.complaintApprovalData?.approved_at ? (
                    <tr>
                      <th>
                        {timelineData?.complaintDetails?.complaint_Status ===
                        "rejected"
                          ? t("Rejected")
                          : t("Approved")}{" "}
                        {t("at")} :
                      </th>
                      <td>
                        {timelineData?.complaintApprovalData?.approved_at}
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </CardComponent>
          </div>
        </Col>
        <Col md={6}>
          <CardComponent
            backButton={false}
            heading2={
              <span className="text-secondary">
                {t("Complaint Assign Details")}
              </span>
            }
            custom2={
              timelineData?.complaintDetails?.complaint_Status === "rejected" ||
              timelineData?.complaintDetails?.complaint_Status ===
                "resolved" ? null : (
                <ActionButton
                  hideDelete={"d-none"}
                  hideEye={"d-none"}
                  hideEdit={"d-none"}
                  hideAssignLine={false}
                  assignLink={`/ApprovedComplaints/CreateAllocate/${id}`}
                  rejectOnclick={
                    dataById?.isComplaintAssigned
                      ? () => setShowRejectAlert(true)
                      : null
                  }
                />
              )
            }
            classbody={"timeline-area"}
          >
            <SimpleBar className="area">
              <span className="p-2 d-grid justify-content-center text-start">
                {timelineData?.complaintAssignDetails?.assignData?.length >
                0 ? null : (
                  <div className="text-center">
                    <img
                      className="p-3"
                      alt="no-result"
                      width="280"
                      src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                    />
                  </div>
                )}
                {timelineData?.complaintAssignDetails?.assignData?.map(
                  (data, index) => (
                    <span key={data?.id} className="hstack gap-4 px-3">
                      <div className="vr hr-shadow d-align align-items-baseline">
                        <span
                          className={`zIndex rounded-circle btn-play d-flex`}
                          style={{
                            padding: "7px",
                            backgroundColor: `#52${data?.id}${data?.id}FF`,
                          }}
                        />
                      </div>
                      <div className="small">
                        {data?.title && (
                          <p className="mb-1 fw-bold">
                            {t("title")} -{" "}
                            <span className="fw-normal">{data?.title}</span>
                          </p>
                        )}
                        {data?.remark && (
                          <p className="mb-1 fw-bold">
                            {t("Remark")} -{" "}
                            <span className="fw-normal">{data?.remark}</span>
                          </p>
                        )}
                        {data?.assigned_by && (
                          <div className="d-flex gap-2 mb-1">
                            {t("assigned by")} -{" "}
                            <UserDetail
                              img={data?.assigned_by_image}
                              name={data?.assigned_by}
                              id={data?.id}
                              unique_id={data?.assigned_by_employee_id}
                              login_id={user?.id}
                            />
                          </div>
                        )}
                        {data?.assigned_to && (
                          <div className="d-flex gap-2 mb-1">
                            {t("assigned to")} -{" "}
                            <UserDetail
                              img={data?.assigned_to_image}
                              name={data?.assigned_to}
                              id={data?.assigned_to_id}
                              unique_id={data?.assigned_to_employee_id}
                            />
                          </div>
                        )}

                        {data?.status && (
                          <p className="mb-1 fw-bold">
                            {t("status")} -{" "}
                            <span
                              className={`fw-normal text-${
                                data?.status == "assigned" ? "green" : "orange"
                              }`}
                            >
                              {data?.status == "resolved" ? (
                                data?.status
                              ) : index !==
                                timelineData?.complaintAssignDetails?.assignData
                                  .length -
                                  1 ? (
                                <del className="text-orange">
                                  {" "}
                                  {data?.status}{" "}
                                </del>
                              ) : (
                                data?.status
                              )}
                            </span>
                          </p>
                        )}
                        <p className="text-gray">
                          <BsClock className="text-orange" />{" "}
                          {data?.assigned_at}
                        </p>
                      </div>
                    </span>
                  )
                )}
              </span>
            </SimpleBar>
          </CardComponent>
        </Col>
        {timelineData?.fundExpensePunchHistory?.length > 0 && (
          <Col md={12}>
            <div className="p-20 shadow rounded h-100">
              <strong className="text-secondary">
                {t("Fund Expense Punch History")}
              </strong>
              <div className="mt-2">
                <Table className="table-sm table Roles">
                  <thead>
                    <tr>
                      <th>{t("Sr No.")}</th>
                      <th>{t("Punch At")}</th>
                      <th>{t("Punch By")}</th>
                      <th>{t("expense punch detail")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timelineData?.fundExpensePunchHistory?.map((itm, idx) => (
                      <>
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>{itm.punch_at}</td>
                          <td>
                            <UserDetail
                              img={itm?.punch_by_image}
                              name={itm?.punch_by}
                              id={itm?.punch_by_id}
                              unique_id={itm?.punch_by_employee_id}
                              login_id={user?.id}
                            />
                          </td>
                          <td>
                            <span
                              className={`cursor-pointer text-${
                                collapsedFundRows?.includes(idx)
                                  ? "danger"
                                  : "green"
                              }`}
                              onClick={() =>
                                setCollapsedFundRows((prev) =>
                                  TOGGLE_ROW_HELPER(prev, idx)
                                )
                              }
                            >
                              {collapsedFundRows?.includes(idx) ? (
                                <BsDashLg fontSize={"large"} />
                              ) : (
                                <BsPlusLg fontSize={"large"} />
                              )}
                            </span>
                          </td>
                        </tr>
                        {collapsedFundRows?.includes(idx) && (
                          <tr>
                            <td className="w-100 bg-light" colSpan={5}>
                              <Table>
                                <thead>
                                  <tr>
                                    <th className="text-start">{t("item")}</th>
                                    <th>{t("amount")}</th>
                                    <th>{t("qty")}</th>
                                    <th>{t("sub total")}</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {itm?.expense_punch_detail?.map((detail) => (
                                    <tr>
                                      <td>
                                        <ItemDetail
                                          img={detail?.item_image}
                                          name={detail?.item_name}
                                          unique_id={detail?.item_unique_id}
                                        />
                                      </td>
                                      <td>
                                        {formatNumberToINR(detail?.amount)}
                                      </td>
                                      <td>{detail?.qty}</td>
                                      <td>
                                        {formatNumberToINR(
                                          +detail?.amount * +detail?.qty
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </Table>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          </Col>
        )}
        {timelineData?.itemStockPunchHistory?.length > 0 && (
          <Col md={12}>
            <div className="p-20 shadow rounded h-100">
              <strong className="text-secondary">
                {t("Item Stock Punch History")}
              </strong>
              <div className="mt-2">
                <Table className="table-sm table Roles">
                  <thead>
                    <tr>
                      <th>{t("Sr No.")}</th>
                      <th>{t("Punch At")}</th>
                      <th>{t("Punch By")}</th>
                      <th>{t("Stock Punch Detail")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timelineData?.itemStockPunchHistory?.map((itm, idx) => (
                      <>
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>{itm.punch_at}</td>
                          <td>
                            <UserDetail
                              img={itm?.punch_by_image}
                              name={itm?.punch_by}
                              id={itm?.punch_by_id}
                              unique_id={itm?.punch_by_employee_id}
                              login_id={user?.id}
                            />
                          </td>
                          <td>
                            <span
                              className={`cursor-pointer text-${
                                collapsedStockRows?.includes(idx)
                                  ? "danger"
                                  : "green"
                              }`}
                              onClick={() =>
                                setCollapsedStockRows((prev) =>
                                  TOGGLE_ROW_HELPER(prev, idx)
                                )
                              }
                            >
                              {collapsedStockRows?.includes(idx) ? (
                                <BsDashLg fontSize={"large"} />
                              ) : (
                                <BsPlusLg fontSize={"large"} />
                              )}
                            </span>
                          </td>
                        </tr>
                        {collapsedStockRows?.includes(idx) && (
                          <tr>
                            <td className="w-100 bg-light" colSpan={5}>
                              <Table>
                                <thead>
                                  <tr>
                                    <th className="text-start">{t("item")}</th>
                                    <th>{t("amount")}</th>
                                    <th>{t("qty")}</th>
                                    <th>{t("sub total")}</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {itm?.stock_punch_detail?.map((detail) => (
                                    <tr>
                                      <td>
                                        <ItemDetail
                                          img={detail?.item_image}
                                          name={detail?.item_name}
                                          unique_id={detail?.item_unique_id}
                                        />
                                      </td>
                                      <td>
                                        {formatNumberToINR(detail?.amount)}
                                      </td>
                                      <td>{detail?.qty}</td>
                                      <td>
                                        {formatNumberToINR(
                                          +detail?.amount * +detail?.qty
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </Table>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          </Col>
        )}

        <Formik
          enableReinitialize={true}
          initialValues={{
            remark: "",
          }}
          validationSchema={addRemarkSchema}
          onSubmit={handleSubmitRejectData}
        >
          {(props) => (
            <ConfirmAlert
              formikProps={props}
              size={"sm"}
              hide={setShowRejectAlert}
              show={showRejectAlert}
              type="submit"
              title={`Confirm Reject`}
              description={
                <>
                  <TextareaAutosize
                    minRows={3}
                    placeholder="type remarks..."
                    onChange={props.handleChange}
                    value={props.values.remark}
                    name="remark"
                    className="edit-textarea"
                    onBlur={props.handleBlur}
                    isInvalid={Boolean(
                      props.touched.remark && props.errors.remark
                    )}
                  />
                  <small className="text-danger">{props.errors.remark}</small>
                </>
              }
            />
          )}
        </Formik>
      </Row>
    );
  }

  return (
    <>
      <Helmet>
        <title>View Complaint Details · CMS Electricals</title>
      </Helmet>
      <Col md={12} className="last-child-none" data-aos={"fade-up"}>
        <Card className="card-bg shadow after-bg-light">
          {type == "update_status" ? (
            <ViewUpdateStatus data={dataById} />
          ) : (
            <Tabs
              activeTab="2"
              ulClassName="border-primary me-2 py-2 border-bottom"
              activityClassName="bg-secondary"
            >
              {tabs.map((tab, idx) => (
                <Tab
                  key={idx}
                  title={tab.title}
                  className={tab.className}
                  disabled
                >
                  <Card.Body className="mt-2">{tab.page}</Card.Body>
                </Tab>
              ))}
            </Tabs>
          )}
        </Card>
      </Col>
    </>
  );
};

export default ViewRequestsComplaint;
