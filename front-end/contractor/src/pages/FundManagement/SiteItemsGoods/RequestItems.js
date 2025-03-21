import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, Table } from "react-bootstrap";
import { BsPlus, BsSearch } from "react-icons/bs";
import { toast } from "react-toastify";
import ConfirmAlert from "../../../components/ConfirmAlert";
import ReactPagination from "../../../components/ReactPagination";
import {
  getAllSiteItemsGoods,
  postApproveRejectSiteItemsGoodsRequest,
} from "../../../services/contractorApi";
import { Helmet } from "react-helmet";
import ActionButton from "../../../components/ActionButton";
import Tabs, { Tab } from "react-best-tabs";
import "react-best-tabs/dist/index.css";
import { Link } from "react-router-dom";
import ImageViewer from "../../../components/ImageViewer";
import ApprovedRequestItems from "./ApprovedRequestItems";
import RejectedRequestItems from "./RejectedRequestItems";
import { Formik } from "formik";

const RequestItems = () => {
  const [fundRequest, setFundRequest] = useState([]);
  const [checkUserRoleType, setCheckUserRoleType] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [storeId, setStoreId] = useState({});
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [typeData, setTypeData] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [actionStatus, setActionStatus] = useState(null);

  const fetchFundRequestData = async () => {
    const res = await getAllSiteItemsGoods(search, pageSize, pageNo);
    if (res.status) {
      setFundRequest(res.data);
      setCheckUserRoleType(res.checkUserRoleTypeForRequestByDetails);
      setPageDetail(res.pageDetails);
    } else {
      setFundRequest([]);
      setCheckUserRoleType(false);
      setPageDetail({});
    }
    setIsLoading(false);
  };

  const handleUpdate = (data) => {
    setStoreId(data);
    setShowAlert(true);
  };

  const handleStatusChange = (data, status) => {
    setActionStatus(status);
    setShowAlert(true);
    setSelectedRows(data);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      id: selectedRows?.id,
    };

    if (actionStatus === 2) {
      sData["value"] = "2";
    } else {
      sData["value"] = "1";
      // sData["transaction_id"] = values.transaction_id;
      // sData["remark"] = values.remark;
    }

    // return console.log("sData", sData);
    const res = await postApproveRejectSiteItemsGoodsRequest(sData);
    if (res.status) {
      toast.success(res.message);
      fetchFundRequestData();
    } else {
      toast.error(res.message);
    }
    setShowAlert(false);
    resetForm();
    setSubmitting(false);
  };

  useEffect(() => {
    fetchFundRequestData();
  }, [search, pageSize, pageNo]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  const handleClick = async (e) => {
    setTypeData(e.target.textContent);
  };

  const serialNumber = Array.from(
    { length: pageDetail?.pageEndResult - pageDetail?.pageStartResult + 1 },
    (_, index) => pageDetail?.pageStartResult + index
  );

  return (
    <>
      <Helmet>
        <title>Request Items · CMS Electricals</title>
      </Helmet>
      <Formik
        enableReinitialize={true}
        initialValues={{
          transaction_id: "",
          remark: "",
        }}
        // validationSchema={actionStatus === 1 ? addRequestExpensesSchema : null}
        onSubmit={handleSubmit}
      >
        {(props) => (
          <ConfirmAlert
            size={"sm"}
            deleteFunction={props.handleSubmit}
            hide={setShowAlert}
            show={showAlert}
            title={`Confirm ${actionStatus === 2 ? "Reject" : "Approve"}`}
            description={`Are you sure you want to ${
              actionStatus === 2 ? "reject" : "approve"
            } this!!`}
          >
            {/* {actionStatus === 1 ? (
              <Form onSubmit={props?.handleSubmit}>
                <div className="d-grid gap-3 text-start">
                  <span>
                    <Form.Label>
                      Transaction Id <span className="text-danger">*</span>
                    </Form.Label>
                    <Field
                      as={Form.Control}
                      name="transaction_id"
                      onChange={props.handleChange}
                    />
                    <ErrorMessage
                      name="transaction_id"
                      component="small"
                      className="text-danger"
                    />
                  </span>
                  <span>
                    <Form.Label>
                      Remark <span className="text-danger">*</span>
                    </Form.Label>
                    <Field
                      as={TextareaAutosize}
                      name="remark"
                      onChange={props.handleChange}
                      minRows={2}
                      className="edit-textarea"
                    />
                    <ErrorMessage
                      name="remark"
                      component="small"
                      className="text-danger"
                    />
                  </span>
                </div>
              </Form>
            ) : null} */}
          </ConfirmAlert>
        )}
      </Formik>
      <Col md={12} data-aos={"fade-up"}>
        <Card className="card-bg">
          <Tabs
            onClick={(e) => handleClick(e)}
            activeTab={"2"}
            ulClassName="border-primary p-2 border-bottom"
            activityClassName="bg-secondary"
          >
            <Tab className="pe-none fs-15 fw-bold" title={["Request Items"]} />
            <Tab className="ms-auto" title={["All Request"]}>
              <span className="d-align mt-3 me-3 justify-content-end gap-2">
                <span className="position-relative">
                  <BsSearch className="position-absolute top-50 me-3 end-0 translate-middle-y" />
                  <Form.Control
                    type="text"
                    placeholder="Search..."
                    onChange={(e) => setSearch(e.target.value)}
                    className="me-2"
                    aria-label="Search"
                  />
                </span>
                <Button
                  as={Link}
                  to={`/RequestItems/create-request-items/new`}
                  variant="light"
                  className={`text-none view-btn shadow rounded-0 px-1 text-orange`}
                >
                  <BsPlus /> Create
                </Button>
              </span>
              <div className="overflow-auto p-3">
                <Table className="text-body bg-new Roles">
                  <thead className="text-truncate">
                    <tr>
                      <th>Sr No.</th>
                      <th>item name</th>
                      {checkUserRoleType ? <th>Requested By</th> : null}
                      <th>Request Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <td colSpan={6}>
                        <img
                          className="p-3"
                          width="250"
                          src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
                          alt="Loading"
                        />
                      </td>
                    ) : fundRequest?.length > 0 ? (
                      <>
                        {fundRequest?.map((data, id1) => (
                          <tr key={id1}>
                            <td>{serialNumber[id1]}</td>
                            <td>
                              <ImageViewer
                                src={
                                  data?.item_image
                                    ? `${process.env.REACT_APP_API_URL}${data?.item_image}`
                                    : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                }
                              >
                                <span className="d-flex align-items-center gap-2">
                                  <img
                                    width={30}
                                    height={30}
                                    className="my-bg object-fit p-1 rounded-circle"
                                    src={
                                      data?.item_image
                                        ? `${process.env.REACT_APP_API_URL}${data?.item_image}`
                                        : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                    }
                                  />{" "}
                                  <span className="d-grid">
                                    {data?.item_name}{" "}
                                  </span>
                                </span>
                              </ImageViewer>
                            </td>
                            {checkUserRoleType ? (
                              <td>
                                <ImageViewer
                                  src={
                                    data?.requested_by_image
                                      ? `${process.env.REACT_APP_API_URL}${data?.requested_by_image}`
                                      : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                  }
                                >
                                  <span className="d-flex align-items-center gap-2">
                                    <img
                                      width={30}
                                      height={30}
                                      className="my-bg object-fit p-1 rounded-circle"
                                      src={
                                        data?.requested_by_image
                                          ? `${process.env.REACT_APP_API_URL}${data?.requested_by_image}`
                                          : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                      }
                                    />{" "}
                                    <span className="d-grid">
                                      {data?.requested_by}{" "}
                                      <span>
                                        {data?.requested_by_employee_id
                                          ? data?.requested_by_employee_id
                                          : null}
                                      </span>
                                    </span>
                                  </span>
                                </ImageViewer>
                              </td>
                            ) : null}
                            <td>{data.date}</td>
                            <td
                              className={`text-${
                                data?.request_status === "1"
                                  ? "green"
                                  : data?.request_status === "2"
                                  ? "danger"
                                  : "orange"
                              }`}
                            >
                              {data?.request_status === "1"
                                ? "Approved"
                                : data?.request_status === "2"
                                ? "Rejected"
                                : "Pending"}
                            </td>
                            <td>
                              <ActionButton
                                hideDelete={"d-none"}
                                eyelink={`/RequestItems/create-request-items/${data.id}?type=view`}
                                approveOnclick={
                                  data?.request_status === "1" ||
                                  data?.request_status === "2"
                                    ? false
                                    : () => handleStatusChange(data, 1)
                                }
                                rejectOnclick={
                                  data?.request_status === "2" ||
                                  data?.request_status === "1"
                                    ? false
                                    : () => handleStatusChange(data, 2)
                                }
                                editlink={`/RequestItems/create-request-items/${data.id}`}
                              />
                            </td>
                          </tr>
                        ))}
                      </>
                    ) : (
                      <td colSpan={6}>
                        <img
                          className="p-3"
                          alt="no-result"
                          width="250"
                          src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                        />
                      </td>
                    )}
                  </tbody>
                </Table>
                <ReactPagination
                  pageSize={pageSize}
                  prevClassName={
                    pageNo === 1 ? "danger-combo-disable pe-none" : "red-combo"
                  }
                  nextClassName={
                    pageSize == pageDetail?.total
                      ? fundRequest.length - 1 < pageSize
                        ? "danger-combo-disable pe-none"
                        : "success-combo"
                      : fundRequest.length < pageSize
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
            </Tab>
            <Tab title={["Approved"]}>
              {typeData === "Approved" && <ApprovedRequestItems />}
            </Tab>
            <Tab title={["Rejected"]}>
              {typeData === "Rejected" && <RejectedRequestItems />}
            </Tab>
          </Tabs>
        </Card>
      </Col>
    </>
  );
};

export default RequestItems;
