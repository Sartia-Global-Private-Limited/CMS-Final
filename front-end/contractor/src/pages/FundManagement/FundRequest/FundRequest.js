import React, { useEffect, useMemo, useState } from "react";
import { Badge, Col, Row, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  getFundRequest,
  postRejectFundRequest,
} from "../../../services/contractorApi";
import { Helmet } from "react-helmet";
import Tabs, { Tab } from "react-best-tabs";
import "react-best-tabs/dist/index.css";
import ApprovedFundRequest from "./ApprovedFundRequest";
import RejectedFundRequest from "./RejectedFundRequest";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { UserDetail } from "../../../components/ItemDetail";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/auth/authSlice";
import { createColumnHelper } from "@tanstack/react-table";
import StatusChip from "../../../components/StatusChip";
import ActionButtons from "../../../components/DataTable/ActionButtons";
import CustomTable from "../../../components/DataTable/CustomTable";
import TableHeader from "../../../components/DataTable/TableHeader";
import { UserPlus } from "lucide-react";
import ConfirmAlert from "../../../components/ConfirmAlert";
import { addRemarkSchema } from "../../../utils/formSchema";
import { Formik } from "formik";
import ImageViewer from "../../../components/ImageViewer";
import TextareaAutosize from "react-textarea-autosize";
import { formatNumberToINR, serialNumber } from "../../../utils/helper";

const FundRequest = ({ checkPermission }) => {
  const columnHelper = createColumnHelper();
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const { userPermission } = useSelector(selectUser);
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [storeId, setStoreId] = useState({});
  const { user } = useSelector(selectUser);
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("last_tab") || "2"
  );
  const { t } = useTranslation();

  const fetchFundRequestData = async () => {
    const res = await getFundRequest(search, pageSize, pageNo);
    setIsLoading(true);
    if (res.status) {
      setRows(res.data);
      setTotalData(res?.pageDetails?.total);
    } else {
      setRows([]);
      setTotalData(0);
    }
    setIsLoading(false);
  };

  const handleUpdate = (data) => {
    setStoreId(data);
    setShowAlert(true);
  };

  const handleRejected = async (values, { setSubmitting, resetForm }) => {
    const module = "fund-request";
    const sData = {
      remarks: values.remark,
    };
    const res = await postRejectFundRequest(storeId.id, module, sData);
    if (res.status) {
      toast.success(res.message);
      fetchFundRequestData();
    } else {
      toast.error(res.message);
    }
    resetForm();
    setSubmitting(false);
    setShowAlert(false);
  };

  useEffect(() => {
    fetchFundRequestData();
  }, [search, pageNo, pageSize]);

  const handleClick = (e, tab) => {
    setActiveTab(tab);
    if (searchParams.has("pageNo")) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("pageNo");
      navigate(`?${newParams.toString()}`, { replace: true });
    }
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("sr_no", {
        header: t("Sr No."),
        cell: (info) => {
          const serialNumbers = serialNumber(pageNo, pageSize);
          return serialNumbers[info.row.index];
        },
      }),
      columnHelper.accessor("unique_id", {
        header: "Unique ID",
      }),
      columnHelper.accessor("request_for", {
        header: "Request For",
        cell: (info) => (
          <UserDetail
            img={info.row.original?.request_for_image}
            name={info.row.original?.request_for}
            login_id={user?.id}
            id={info.row.original?.request_for_id}
            unique_id={info.row.original?.request_for_employee_id}
          />
        ),
      }),
      columnHelper.accessor("status", {
        header: "status",
        cell: (info) => (
          <StatusChip
            status={info.row.original.status === "1" ? "approved" : "pending"}
          />
        ),
      }),
      columnHelper.accessor("request_date", {
        header: "request date",
      }),
      columnHelper.accessor("total_request_amount", {
        header: "total request amount",
        cell: (info) => (
          <div
            className={`fw-bolder text-${
              info.row.original.total_request_amount > 0 ? "green" : "danger"
            }`}
          >
            {formatNumberToINR(info.row.original.total_request_amount)}
          </div>
        ),
      }),
      columnHelper.accessor("total_request_items", {
        header: "Total Item",
        cell: (info) => (
          <>
            <Badge bg="orange" className="fw-normal" style={{ fontSize: 11 }}>
              {info.row.original.total_request_items} {t("old")}
            </Badge>
            &ensp;
            <Badge
              bg="secondary"
              className="fw-normal"
              style={{ fontSize: 11 }}
            >
              {info.row.original.total_new_request_items} {t("new")}
            </Badge>
          </>
        ),
      }),
      columnHelper.accessor("action", {
        header: "Action",
        cell: (info) => (
          <ActionButtons
            actions={{
              view: {
                show: checkPermission?.view,
                action: () =>
                  navigate(
                    `/fund-request/create-fund-request/${info.row.original.id}?type=view`
                  ),
              },
              edit: {
                show: checkPermission?.update,
                disabled: !info.row.original.update_fund_request,
                action: () =>
                  navigate(
                    `/fund-request/create-fund-request/${info.row.original.id}?type=edit`
                  ),
              },
              reject: {
                show: checkPermission?.update,
                disabled: !info.row.original?.active ? true : false,
                action: () =>
                  !info.row.original?.active
                    ? false
                    : handleUpdate(info.row.original),
              },
              approve: {
                show: checkPermission?.update,
                disabled: !info.row.original?.active ? true : false,
                action: () =>
                  navigate(
                    `${
                      !info.row.original?.active
                        ? `#`
                        : `/fund-request/create-fund-request/${info.row.original.id}?type=approve`
                    }`
                  ),
              },
            }}
          />
        ),
      }),
    ],
    [checkPermission, t, rows.length, pageNo, pageSize]
  );

  return (
    <>
      <Helmet>
        <title>Fund Request · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <Tabs
          onClick={(e, tab) => handleClick(e, tab)}
          activeTab={activeTab}
          ulClassName="border-primary p-2 border-bottom"
          activityClassName="bg-secondary"
        >
          <Tab className="pe-none fs-15 fw-bold" />
          <Tab className="ms-auto" title={[t("Pending Request")]}>
            {activeTab == "2" && (
              <>
                <Formik
                  enableReinitialize={true}
                  initialValues={{
                    remark: "",
                  }}
                  validationSchema={addRemarkSchema}
                  onSubmit={handleRejected}
                >
                  {(props) => (
                    <ConfirmAlert
                      formikProps={props}
                      size={"md"}
                      hide={setShowAlert}
                      show={showAlert}
                      type="submit"
                      title={"Confirm Reject"}
                      description={
                        <Row className="g-3 py-1">
                          <Col md={12}>
                            <TextareaAutosize
                              minRows={3}
                              placeholder="type remarks..."
                              onChange={props.handleChange}
                              name="remark"
                              className="edit-textarea"
                              onBlur={props.handleBlur}
                              isInvalid={Boolean(
                                props.touched.remark && props.errors.remark
                              )}
                            />
                            <small className="text-danger">
                              {props.errors.remark}
                            </small>
                          </Col>
                          <Col md={12}>
                            <div className="table-scroll">
                              {storeId?.request_data?.request_fund.length >
                                0 && (
                                <>
                                  <h6 className="my-2">{t("Request Fund")}</h6>
                                  <Table className="table-sm table Roles">
                                    <thead>
                                      <tr>
                                        <th>{t("unique Id")}</th>
                                        <th>{t("Item Name")}</th>
                                        <th>{t("Item rate")}</th>
                                        <th>{t("request qty")}</th>
                                        <th>{t("request amount")}</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {storeId?.request_data?.request_fund?.map(
                                        (itm, idx) => (
                                          <tr key={idx}>
                                            <td>{storeId?.unique_id}</td>
                                            <td>
                                              <div className="d-flex">
                                                <ImageViewer
                                                  src={
                                                    itm?.item_name?.image
                                                      ? `${process.env.REACT_APP_API_URL}${itm?.item_name?.image}`
                                                      : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                                  }
                                                >
                                                  <img
                                                    width={35}
                                                    height={35}
                                                    className="my-bg object-fit p-1 rounded-circle"
                                                    src={
                                                      itm?.item_name?.image
                                                        ? `${process.env.REACT_APP_API_URL}${itm?.item_name?.image}`
                                                        : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                                    }
                                                  />
                                                </ImageViewer>{" "}
                                                <span className="small d-grid">
                                                  <span>
                                                    {itm.item_name?.label}
                                                  </span>
                                                  <span className="text-gray">
                                                    {itm.item_name?.unique_id
                                                      ? `(${itm.item_name?.unique_id})`
                                                      : "-"}
                                                  </span>
                                                </span>
                                              </div>
                                            </td>
                                            <td>₹ {itm.item_name?.rate}</td>
                                            <td>{itm.request_quantity}</td>
                                            <td>₹ {itm.fund_amount}</td>
                                          </tr>
                                        )
                                      )}
                                      <tr>
                                        <td colSpan={2}></td>
                                        <td colSpan={2}>
                                          {t("total request amt")}.
                                        </td>
                                        <td className="text-start text-green">
                                          <b>
                                            ₹{" "}
                                            {storeId?.request_data?.request_fund.reduce(
                                              (userTotal, item) =>
                                                userTotal + +item.fund_amount,
                                              0
                                            )}
                                          </b>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </Table>
                                </>
                              )}

                              {storeId?.request_data?.new_request_fund.length >
                                0 && (
                                <>
                                  <h6 className="my-2">
                                    {t("New Request Fund")}
                                  </h6>
                                  <Table className="table-sm table Roles">
                                    <thead>
                                      <tr>
                                        <th>{t("unique Id")}</th>
                                        <th>{t("Item Name")}</th>
                                        <th>{t("Item rate")}</th>
                                        <th>{t("request qty")}</th>
                                        <th>{t("request amount")}</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {storeId?.request_data?.new_request_fund?.map(
                                        (itm, idx) => (
                                          <tr key={idx}>
                                            <td>{storeId?.unique_id}</td>
                                            <td>
                                              <div className="d-flex">
                                                <ImageViewer
                                                  src={
                                                    itm?.item_image
                                                      ? itm?.item_image
                                                      : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                                  }
                                                >
                                                  <img
                                                    width={35}
                                                    height={35}
                                                    className="my-bg object-fit p-1 rounded-circle"
                                                    src={
                                                      itm?.item_image
                                                        ? itm?.item_image
                                                        : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                                    }
                                                  />
                                                </ImageViewer>{" "}
                                                <span className="small d-grid">
                                                  <span>
                                                    {itm.title?.label}
                                                  </span>
                                                  <span className="text-gray">
                                                    {itm.item_name?.unique_id
                                                      ? `(${itm.item_name?.unique_id})`
                                                      : "-"}
                                                  </span>
                                                </span>
                                              </div>
                                            </td>
                                            <td>₹ {itm?.rate}</td>
                                            <td>{itm?.qty}</td>
                                            <td>₹ {itm?.fund_amount}</td>
                                          </tr>
                                        )
                                      )}
                                      <tr>
                                        <td colSpan={2}></td>
                                        <td colSpan={2}>
                                          {t("total request amt")}.
                                        </td>
                                        <td className="text-start text-green">
                                          <b>
                                            ₹{" "}
                                            {storeId?.request_data?.new_request_fund.reduce(
                                              (userTotal, item) =>
                                                userTotal + +item.fund_amount,
                                              0
                                            )}
                                          </b>
                                        </td>
                                      </tr>

                                      <tr>
                                        <td colSpan={2}></td>
                                        <td colSpan={2}>{t("Final Amount")}</td>

                                        <td className="text-start text-green">
                                          <b>
                                            ₹ {storeId?.total_request_amount}
                                          </b>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </Table>
                                </>
                              )}
                            </div>
                          </Col>
                        </Row>
                      }
                    />
                  )}
                </Formik>

                <CustomTable
                  id={"fund_request"}
                  userPermission={checkPermission}
                  isLoading={isLoading}
                  rows={rows || []}
                  columns={columns}
                  pagination={{
                    pageNo,
                    pageSize,
                    totalData,
                  }}
                  customHeaderComponent={() => (
                    <TableHeader
                      userPermission={checkPermission}
                      setSearchText={setSearch}
                      button={{
                        noDrop: true,
                        to: `/fund-request/create-fund-request/new`,
                        title: "Create",
                      }}
                    />
                  )}
                  tableTitleComponent={
                    <div>
                      <UserPlus /> <strong>fund request</strong>
                    </div>
                  }
                />
              </>
            )}
          </Tab>
          <Tab title={t("Approved")}>
            {activeTab == "3" && (
              <ApprovedFundRequest checkPermission={checkPermission} />
            )}
          </Tab>
          <Tab title={t("Rejected")}>
            {activeTab == "4" && (
              <RejectedFundRequest checkPermission={checkPermission} />
            )}
          </Tab>
        </Tabs>
      </Col>
    </>
  );
};

export default FundRequest;
