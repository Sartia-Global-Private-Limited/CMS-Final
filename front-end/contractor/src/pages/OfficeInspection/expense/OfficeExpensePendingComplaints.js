import React, { useEffect, useState } from "react";
import { Breadcrumb, Col, Form, Row, Table } from "react-bootstrap";
import Select from "react-select";
import {
  getAllApprovedComplaints,
  getAllPendingComplaints,
  postApprovedUsedItems,
  postAssignComplaint,
} from "../../../services/contractorApi";
import ReactPagination from "../../../components/ReactPagination";
import { Link, useParams, useSearchParams } from "react-router-dom";
import CardComponent from "../../../components/CardComponent";
import { Helmet } from "react-helmet";
import TooltipComponent from "../../../components/TooltipComponent";
import { BsCheckLg, BsFillPersonCheckFill } from "react-icons/bs";
import { toast } from "react-toastify";
import ConfirmAlert from "../../../components/ConfirmAlert";
import { ErrorMessage, Formik } from "formik";
import Modaljs from "../../../components/Modal";
import { getAllUsers } from "../../../services/authapi";
import { addMessageSchema } from "../../../utils/formSchema";
import moment from "moment";
import ImageViewer from "../../../components/ImageViewer";

const OfficeExpensePendingComplaints = () => {
  const [outletDetails, setOutletDetails] = useState({});
  const [complaintData, setComplaintData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [storeId, setStoreId] = useState({});
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [isLoading, setIsLoading] = useState(true);
  const [allUserData, setAllUserData] = useState([]);
  const [showAssign, setShowAssign] = useState(false);
  const [checkedData, setCheckedData] = useState(false);
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const prevId = searchParams.get("prevId") || null;
  const type = searchParams.get("type") || null;

  const fetchPendingComplaintsData = async () => {
    const res =
      type === "Pending"
        ? await getAllPendingComplaints(search, pageSize, pageNo, id)
        : await getAllApprovedComplaints(search, pageSize, pageNo, id);
    if (res.status) {
      setOutletDetails(res.complaintDetails);
      setComplaintData(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setOutletDetails(res.complaintDetails);
      setComplaintData([]);
      setPageDetail({});
    }
    setIsLoading(false);
  };

  const handleUpdate = (data) => {
    setStoreId(data);
    setShowAlert(true);
  };

  const handleApproved = async () => {
    const res = await postApprovedUsedItems(storeId.id);
    if (res.status) {
      toast.success(res.message);
      fetchPendingComplaintsData();
    } else {
      toast.error(res.message);
    }
    setShowAlert(false);
  };

  const fetchAllUsersData = async () => {
    const res = await getAllUsers();
    if (res.status) {
      setAllUserData(res.data);
    } else {
      setAllUserData([]);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      module_id: JSON.stringify(outletDetails.complaint_id),
      module_type: "complaint",
      assign_to: values.user_id,
      is_future_date_visible: checkedData === true ? "1" : "0",
      assign_for: "1",
    };
    // return console.log("sData", sData);
    const res = await postAssignComplaint(sData);
    if (res.status) {
      toast.success(res.message);
      fetchPendingComplaintsData();
    } else {
      toast.error(res.message);
    }
    resetForm();
    setShowAssign(false);
    setSubmitting(false);
  };

  useEffect(() => {
    fetchPendingComplaintsData();
    if (type === "Approved") {
      fetchAllUsersData();
    }
  }, [search, pageNo, pageSize, type]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  const UserOption = ({ innerProps, label, data }) => (
    <div {...innerProps} className="cursor-pointer">
      <img
        className="avatar ms-2 me-3"
        src={
          data.image ||
          `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
        }
        alt={data.name}
      />
      {label}
    </div>
  );

  const serialNumber = Array.from(
    { length: pageDetail?.pageEndResult - pageDetail?.pageStartResult + 1 },
    (_, index) => pageDetail?.pageStartResult + index
  );

  return (
    <>
      <Helmet>
        <title>
          {`Pending Ex. Complaints - ${outletDetails?.complaint_type_name} · CMS Electricals`}
        </title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CardComponent
          title={`Pending Ex. Complaints - ${outletDetails?.complaint_type_name}/${outletDetails?.complaint_unique_id}`}
          search={true}
          searchOnChange={(e) => {
            setSearch(e.target.value);
          }}
          custom={
            type === "Approved" &&
            complaintData.length > 0 && (
              <TooltipComponent title={"Assign"} align={"left"}>
                <span
                  onClick={() => setShowAssign(true)}
                  className={`social-btn-re d-align gap-2 px-3 w-auto danger-combo`}
                >
                  <BsFillPersonCheckFill />
                </span>
              </TooltipComponent>
            )
          }
        >
          <div className="table-scroll p-2">
            <Breadcrumb>
              <Breadcrumb.Item
                linkAs={Link}
                linkProps={{
                  to: "/office-expense",
                  className: "text-secondary text-decoration-none",
                }}
              >
                Item Stocks
              </Breadcrumb.Item>
              <Breadcrumb.Item
                linkAs={Link}
                linkProps={{
                  to: `/office-expense/office-complaints-on-outlet/${prevId}?&&type=${type}`,
                  className: "text-secondary text-decoration-none",
                }}
              >
                complaints on outlet
              </Breadcrumb.Item>
              <Breadcrumb.Item active>
                {type === "Pending" ? "Pending" : "Approved"} Complaints
              </Breadcrumb.Item>
            </Breadcrumb>
            <Table className="text-body bg-new Roles">
              <thead className="text-truncate">
                <tr className="text-center">
                  {type == "Pending" ? (
                    <>
                      {[
                        "Sr No.",
                        "User",
                        "expense date",
                        "expense amount",
                        "payment method",
                        "status",
                        "Action",
                      ].map((thead) => (
                        <th key={thead}>{thead}</th>
                      ))}
                    </>
                  ) : (
                    <>
                      {[
                        "Sr No.",
                        "User",
                        "expense date",
                        "expense amount",
                        "payment method",
                        "approved by",
                        "approved amount",
                        "status",
                      ].map((thead) => (
                        <th key={thead}>{thead}</th>
                      ))}
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <td colSpan={8}>
                    <img
                      className="p-3"
                      width="250"
                      src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
                      alt="Loading"
                    />
                  </td>
                ) : complaintData.length > 0 ? (
                  <>
                    {complaintData?.map((e, idx) => (
                      <tr>
                        <td>{serialNumber[idx]}</td>
                        <td>
                          <span className="d-flex align-items-center gap-2">
                            <ImageViewer
                              src={
                                e.image
                                  ? `${process.env.REACT_APP_API_URL}${e.image}`
                                  : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                              }
                            >
                              <img
                                width={30}
                                height={30}
                                className="my-bg object-fit p-1 rounded-circle"
                                src={
                                  e.image
                                    ? `${process.env.REACT_APP_API_URL}${e.image}`
                                    : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                }
                              />
                            </ImageViewer>
                            <div className="d-grid text-truncate">
                              <span>{e.user_name}</span>
                              <span>{e.employee_id}</span>
                            </div>
                          </span>
                        </td>
                        <td>{e.expense_date}</td>
                        <td>₹ {e.expense_amount}</td>
                        <td>
                          {e.payment_method == "1"
                            ? "online"
                            : e.payment_method == "2"
                            ? "cash"
                            : "bank ransfer"}
                        </td>
                        {type == "Approved" && (
                          <>
                            <td>
                              <span className="d-flex align-items-center gap-2">
                                <ImageViewer
                                  src={
                                    e.approved_by_image
                                      ? `${process.env.REACT_APP_API_URL}${e.approved_by_image}`
                                      : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                  }
                                >
                                  <img
                                    width={30}
                                    height={30}
                                    className="my-bg object-fit p-1 rounded-circle"
                                    src={
                                      e.approved_by_image
                                        ? `${process.env.REACT_APP_API_URL}${e.approved_by_image}`
                                        : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                    }
                                  />
                                </ImageViewer>
                                <div className="d-grid text-truncate">
                                  <span>{e.approved_by_name}</span>
                                  <span>{e.approved_by_employee_id}</span>
                                </div>
                              </span>
                            </td>
                            <td>₹ {e.approved_amount}</td>
                          </>
                        )}
                        <td
                          className={`text-${
                            type === "Pending" ? "orange" : "green"
                          }`}
                        >
                          {type === "Pending" ? "Pending" : "Approved"}
                        </td>
                        {type === "Pending" && (
                          <td>
                            <TooltipComponent title={"Approve"}>
                              <span
                                onClick={() => handleUpdate(e)}
                                className={`social-btn-re d-align gap-2 px-3 w-auto success-combo`}
                              >
                                <BsCheckLg />
                              </span>
                            </TooltipComponent>
                          </td>
                        )}
                      </tr>
                    ))}
                  </>
                ) : (
                  <td colSpan={8}>
                    <img
                      className="p-3"
                      alt="no-result"
                      width="250"
                      src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                    />
                  </td>
                )}
              </tbody>
              <ConfirmAlert
                size={"sm"}
                deleteFunction={handleApproved}
                hide={setShowAlert}
                show={showAlert}
                title={"Confirm Approve"}
                description={"Are you sure you want to approve this!!"}
              />
            </Table>
            <ReactPagination
              pageSize={pageSize}
              prevClassName={
                pageNo === 1 ? "danger-combo-disable pe-none" : "red-combo"
              }
              nextClassName={
                pageSize == pageDetail?.total
                  ? complaintData.length - 1 < pageSize
                    ? "danger-combo-disable pe-none"
                    : "success-combo"
                  : complaintData.length < pageSize
                  ? "danger-combo-disable pe-none"
                  : "success-combo"
              }
              title={`Showing ${pageDetail?.pageStartResult || 0} to ${
                pageDetail?.pageEndResult || 0
              } of ${pageDetail?.total || 0}`}
              handlePageSizeChange={handlePageSizeChange}
              prevonClick={() => setPageNo(pageNo - 1)}
              nextonClick={() => setPageNo(pageNo + 1)}
            />
          </div>
        </CardComponent>
      </Col>

      <Formik
        enableReinitialize={true}
        initialValues={{
          user_id: "",
        }}
        validationSchema={addMessageSchema}
        onSubmit={handleSubmit}
      >
        {(props) => (
          <Modaljs
            formikProps={props}
            open={showAssign}
            size={"md"}
            closebtn={"Cancel"}
            Savebtn={"Assign"}
            close={() => setShowAssign(false)}
            title={"Assign Complaint"}
          >
            <Row className="g-2">
              <Col md={12}>
                <Form.Label>Select User</Form.Label>
                <Select
                  menuPosition="fixed"
                  className="text-primary w-100"
                  name="user_id"
                  options={allUserData?.map((user) => ({
                    label: user.name,
                    value: user.id,
                    image: user.image
                      ? `${process.env.REACT_APP_API_URL}${user.image}`
                      : null,
                  }))}
                  onChange={(selectedOption) =>
                    props.setFieldValue("user_id", selectedOption.value)
                  }
                  components={{ Option: UserOption }}
                />
                <ErrorMessage
                  name="user_id"
                  component="small"
                  className="text-danger"
                />
              </Col>
              <Col md={12}>
                <Form.Check
                  type="checkbox"
                  id="check"
                  name="is_future_date_visible"
                  onChange={(e) => setCheckedData(e.target.checked)}
                  label="See all future data"
                />
              </Col>
            </Row>
          </Modaljs>
        )}
      </Formik>
    </>
  );
};

export default OfficeExpensePendingComplaints;
