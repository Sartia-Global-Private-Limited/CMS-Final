import React, { useEffect, useState } from "react";
import { Form, Table } from "react-bootstrap";
import Select from "react-select";
import { BsSearch } from "react-icons/bs";
import TextareaAutosize from "react-textarea-autosize";
import ReactPagination from "../../../components/ReactPagination";
import {
  getAllRequestCashExpense,
  postApproveRejectRequest,
} from "../../../services/contractorApi";
import ImageViewer from "../../../components/ImageViewer";
import ActionButton from "../../../components/ActionButton";
import { toast } from "react-toastify";
import ConfirmAlert from "../../../components/ConfirmAlert";
import { ErrorMessage, Field, Formik } from "formik";
import { addRequestExpensesSchema } from "../../../utils/formSchema";

const ViewRequest = ({ typeData }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [allRequestExpenseData, setAllRequestExpenseData] = useState([]);
  const [allRequestExpense, setAllRequestExpense] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [filterDate, setFilterDate] = useState(0);
  const [search, setSearch] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [cashRequestStatus, setCashRequestStatus] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [actionStatus, setActionStatus] = useState(null);

  const fetchRequestExpensesData = async () => {
    const res = await getAllRequestCashExpense(
      search,
      pageSize,
      pageNo,
      cashRequestStatus?.value,
      filterDate
    );
    if (res.status) {
      setAllRequestExpenseData(res.data);
      setAllRequestExpense(res);
      setPageDetail(res.pageDetails);
    } else {
      setAllRequestExpenseData([]);
      setAllRequestExpense(res);
      setPageDetail({});
    }
    setIsLoading(false);
  };

  const handleCashRequestStatusChange = (selectedOption) => {
    setCashRequestStatus(selectedOption);
  };

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
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
      sData["status"] = "2";
    } else {
      sData["status"] = "1";
      sData["transaction_id"] = values.transaction_id;
      sData["remark"] = values.remark;
    }

    // return console.log("sData", sData);
    const res = await postApproveRejectRequest(sData);
    if (res.status) {
      toast.success(res.message);
      fetchRequestExpensesData();
    } else {
      toast.error(res.message);
    }
    setShowAlert(false);
    resetForm();
    setSubmitting(false);
  };

  useEffect(() => {
    if (typeData == "View Request") {
      fetchRequestExpensesData();
    }
  }, [typeData, search, pageNo, pageSize, cashRequestStatus, filterDate]);

  const serialNumber = Array.from(
    { length: pageDetail?.pageEndResult - pageDetail?.pageStartResult + 1 },
    (_, index) => pageDetail?.pageStartResult + index
  );

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          transaction_id: "",
          remark: "",
        }}
        validationSchema={actionStatus === 1 ? addRequestExpensesSchema : null}
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
            {actionStatus === 1 ? (
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
            ) : null}
          </ConfirmAlert>
        )}
      </Formik>
      <div className="overflow-auto p-3">
        <div className="d-align justify-content-between mb-3">
          <span className="d-align gap-2">
            <Form.Control
              onChange={(e) => {
                setFilterDate(e.target.value);
              }}
              type="date"
            />
          </span>
          <span>
            Total Count{" "}
            <b className="text-secondary">{allRequestExpense?.total_count}</b> |
            <span>
              {" "}
              Total Balance{" "}
              <b className="text-secondary">
                {allRequestExpense?.total_balance}
              </b>
            </span>
          </span>
          <span className="d-flex position-relative">
            <span>
              <BsSearch className="position-absolute top-50 me-3 end-0 translate-middle-y" />
              <Form.Control
                type="text"
                placeholder="Search..."
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                className="me-2"
                aria-label="Search"
              />
            </span>{" "}
            <span className="hr-border ms-2 me-1" />
            <span>
              <Select
                menuPortalTarget={document.body}
                value={cashRequestStatus}
                placeholder="Status"
                options={[
                  { label: "Approved", value: "1" },
                  { label: "Rejected", value: "2" },
                ]}
                isClearable
                onChange={(e) => {
                  handleCashRequestStatusChange(e);
                }}
              />
            </span>
          </span>
        </div>
        <Table className="text-body bg-new Roles">
          <thead className="text-truncate">
            <tr>
              {[
                "Sr no.",
                "Requested by",
                "request amount",
                "request date",
                "request purpose",
                "request id",
                "status",
                "Action",
              ].map((thead) => (
                <th key={thead}>{thead}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <td colSpan={7}>
                <img
                  className="p-3"
                  width="250"
                  src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
                  alt="Loading"
                />
              </td>
            ) : allRequestExpenseData?.length > 0 ? (
              <>
                {allRequestExpenseData?.map((itm, idx) => (
                  <tr key={idx}>
                    <td>{serialNumber[idx]}</td>
                    <td>
                      <ImageViewer
                        src={
                          itm?.user_image
                            ? `${process.env.REACT_APP_API_URL}${itm?.user_image}`
                            : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                        }
                      >
                        <img
                          width={30}
                          height={30}
                          className="my-bg object-fit p-1 rounded-circle"
                          src={
                            itm?.user_image
                              ? `${process.env.REACT_APP_API_URL}${itm?.user_image}`
                              : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                          }
                        />{" "}
                        {itm?.user_name}{" "}
                        {itm?.employee_id ? `- ${itm?.employee_id}` : null}
                      </ImageViewer>
                    </td>
                    <td>₹ {itm?.request_amount}</td>
                    <td>{itm?.request_date}</td>
                    <td>{itm?.request_purpose}</td>
                    <td>{itm?.request_unique_id}</td>
                    <td
                      className={`text-${
                        itm?.request_status === "1"
                          ? "green"
                          : itm?.request_status === "2"
                          ? "danger"
                          : "orange"
                      }`}
                    >
                      {itm?.request_status === "1"
                        ? "Approved"
                        : itm?.request_status === "2"
                        ? "Rejected"
                        : "Pending"}
                    </td>
                    <td>
                      <ActionButton
                        eyelink={`/RequestCash/view-details/${itm.id}?type=view`}
                        hideEdit={"d-none"}
                        hideDelete={"d-none"}
                        approveOnclick={
                          itm?.request_status === "1" ||
                          itm?.request_status === "2"
                            ? false
                            : () => handleStatusChange(itm, 1)
                        }
                        rejectOnclick={
                          itm?.request_status === "2" ||
                          itm?.request_status === "1"
                            ? false
                            : () => handleStatusChange(itm, 2)
                        }
                      />
                    </td>
                  </tr>
                ))}
              </>
            ) : (
              <td colSpan={7}>
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
              ? allRequestExpenseData.length - 1 < pageSize
                ? "danger-combo-disable pe-none"
                : "success-combo"
              : allRequestExpenseData.length < pageSize
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
    </>
  );
};

export default ViewRequest;
