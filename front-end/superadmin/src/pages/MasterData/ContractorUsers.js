import React, { useEffect, useMemo, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import {
  BsCalendarDate,
  BsEnvelope,
  BsGeoAlt,
  BsGlobe2,
  BsLightningCharge,
  BsPhoneVibrate,
  BsPlus,
} from "react-icons/bs";
import CardComponent from "../../components/CardComponent";
import Modaljs from "../../components/Modal";
import { Helmet } from "react-helmet";
import ImageViewer from "../../components/ImageViewer";
import { Formik } from "formik";
import { addContractorUserSchema } from "../../utils/formSchema";
import { toast } from "react-toastify";
import ConfirmAlert from "../../components/ConfirmAlert";
import moment from "moment";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  addUserContractors,
  deleteAdminContractors,
  getAdminContractors,
  getAdminSingleContractors,
  updateAdminContractors,
} from "../../services/authapi";
import StatusChip from "../../components/StatusChip";
import ActionButtons from "../../components/DataTable/ActionButtons";
import { createColumnHelper } from "@tanstack/react-table";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import TableHeader from "../../components/DataTable/TableHeader";
import { UserPlus } from "lucide-react";
import CustomTable from "../../components/DataTable/CustomTable";
import { useTranslation } from "react-i18next";
import MyInput from "../../components/MyInput";

const ContractorUsers = () => {
  const navigate = useNavigate();
  const columnHelper = createColumnHelper();
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { userPermission, user } = useSelector(selectUser);
  const { t } = useTranslation();
  const { state } = useLocation();
  const contractor = state;
  const [Contractors, setContractors] = useState(false);
  const [detailShow, setDetailShow] = useState(false);
  const [edit, setEdit] = useState({});
  const [idToDelete, setIdToDelete] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [adminID, setAdminID] = useState("");

  const fetchContractorData = async () => {
    const res = await getAdminContractors(search, pageSize, pageNo);
    setIsLoading(true);
    if (res.status) {
      const filterAdmin = res?.data?.filter(
        (item) => item.admin_id === contractor.admin_id
      );
      setRows(filterAdmin[0]);
      setTotalData(res?.pageDetails?.total);
    } else {
      setRows([]);
      setTotalData(0);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchContractorData();
    const idAdmin = contractor?.admin_id;
    setAdminID(idAdmin);
  }, [search, pageSize, pageNo]);

  const handleEditDetailShow = async (id, user_type) => {
    const res = await getAdminSingleContractors(id, user_type);
    // set
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit({});
    }
    setDetailShow(true);
  };
  const handleEdit = async (id, user_type) => {
    const res = await getAdminSingleContractors(id, user_type);
    // set
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit({});
    }
    setContractors(true);
  };

  const handleDelete = async () => {
    const res = await deleteAdminContractors(idToDelete, "User");
    if (res.status) {
      toast.success(res.message);
      // setRows((prev) => prev.filter((itm) => itm.admin_id !== +idToDelete));
      fetchContractorData();
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
  };

  const handleFileChange = (e, setFieldValue) => {
    if (e.target.files) {
      setFieldValue("image", e.target.files[0]);
    }
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("sr_no", {
        header: t("Sr No."),
        cell: (info) => info.row.index + 1,
      }),
      columnHelper.accessor("images", {
        header: t("Image"),
        cell: (info) => (
          <ImageViewer
            src={`${process.env.REACT_APP_API_URL}${info.row.original?.image}`}
          >
            <img
              width={50}
              className="my-bg p-1 rounded"
              src={`${process.env.REACT_APP_API_URL}${info.row.original?.image}`}
              alt=""
            />
          </ImageViewer>
        ),
      }),
      columnHelper.accessor("name", {
        header: t("Name"),
        cell: (info) => info.getValue() || "-",
      }),
      columnHelper.accessor("email", {
        header: t("Email"),
        cell: (info) => info.getValue() || "-",
      }),
      columnHelper.accessor("contact_no", {
        header: t("Contact No."),
        cell: (info) => info.getValue() || "-",
      }),
      columnHelper.accessor("status", {
        header: t("Status"),
        cell: (info) => (
          <StatusChip status={info.getValue() == 1 ? "Active" : "InActive"} />
        ),
      }),
      columnHelper.accessor("action", {
        header: t("Action"),
        cell: (info) => (
          <ActionButtons
            actions={{
              edit: {
                show: true,
                action: () =>
                  navigate(
                    `/ContractorsMasterdata/client-user-form/edit/${info.row.original?.admin_id}`
                  ),
              },
              delete: {
                show: true,
                action: () => {
                  setIdToDelete(info.row.original?.admin_id);
                  setShowAlert(true);
                },
              },
            }}
          />
        ),
      }),
    ],
    [rows?.users?.length]
  );

  return (
    <>
      <Helmet>
        <title>Client Users · CMS Electricals</title>
      </Helmet>
      <Col md={12}>
        <CardComponent title={"Client"}>
          <Row className="g-3">
            <Col md={12}>
              <div className="p-2">
                <div className="shadow after-bg-light">
                  <div className="d-align h-100 p-3 gap-5 justify-content-start">
                    <div className="my-bg p-2 rounded-circlee">
                      <img
                        className="border-blue object-fit rounded-circlee"
                        height={100}
                        width={100}
                        src={`${process.env.REACT_APP_API_URL}${rows?.image}`}
                        alt={""}
                      />
                    </div>
                    <div className="d-grid gap-2">
                      <small
                        className={
                          rows?.status === "1" ? "text-green" : "text-danger"
                        }
                      >
                        <BsLightningCharge />{" "}
                        {rows?.status === "1" ? "Active" : "Inactive"}
                      </small>
                      <p className="mb-0 fw-bold">
                        {rows?.name}{" "}
                        <small className="text-gray">({rows?.user_type})</small>
                      </p>
                      <small className="text-gray">
                        <BsEnvelope /> {rows?.email}
                      </small>
                      <small className="text-gray">
                        <BsPhoneVibrate /> {rows?.contact_no},{" "}
                        {rows?.alt_number}
                      </small>
                      <small className="text-gray">
                        <BsGeoAlt /> {rows?.address_1}, {rows?.city},{" "}
                        {rows?.pin_code}
                      </small>
                      <small className="text-gray">
                        <BsGlobe2 /> {rows?.country}
                      </small>
                      <div className="text-muted-50">
                        <small>
                          Plan :{" "}
                          <span className="fw-bold">
                            {rows?.plan_name} (₹ {rows?.plan_price}/
                            {rows?.plan_duration})
                          </span>
                        </small>
                      </div>
                      <div className="text-muted-50 mb-3">
                        <small>
                          Plan Expire Date :{" "}
                          <span className="fw-bold">
                            {rows?.plan_expire_date
                              ? moment(rows?.plan_expire_date).format(
                                  "DD-MM-YYYY"
                                )
                              : "-"}
                          </span>
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>

            <CustomTable
              id={"contractor_users"}
              isLoading={isLoading}
              rows={rows?.users || []}
              columns={columns}
              pagination={{
                pageNo,
                pageSize,
                totalData,
                hideFooter: false,
              }}
              customHeaderComponent={() => (
                <TableHeader
                  userPermission={userPermission}
                  setSearchText={setSearch}
                  button={{
                    noDrop: true,
                    to: `/ContractorsMasterdata/client-user-form/add`,
                    title: "Create",
                  }}
                />
              )}
              tableTitleComponent={
                <div>
                  <UserPlus /> <strong>Client Users</strong>
                </div>
              }
            />
          </Row>
        </CardComponent>
      </Col>

      <ConfirmAlert
        size={"sm"}
        deleteFunction={handleDelete}
        hide={setShowAlert}
        show={showAlert}
        title={"Confirm Delete"}
        description={"Are you sure you want to delete this!!"}
      />

      <Modaljs
        open={detailShow}
        size={"md"}
        closebtn={"Cancel"}
        hideFooter={"d-none"}
        close={() => setDetailShow(false)}
        title={"View Details"}
      >
        <div className="shadow m-2 after-bg-light">
          <div className="d-align h-100 p-3 gap-5 justify-content-start">
            <div className="my-bg p-2 rounded-circle">
              <img
                className="border-blue object-fit rounded-circle"
                height={100}
                width={100}
                src={`${process.env.REACT_APP_API_URL}${edit?.image}`}
                alt="User-Profile"
              />
            </div>
            <div className="d-grid gap-2">
              <small
                className={edit?.status === 1 ? "text-green" : "text-danger"}
              >
                <BsLightningCharge />{" "}
                {edit?.status === 1 ? "Active" : "Inactive"}
              </small>
              <p className="mb-0 fw-bold">
                {edit?.name}{" "}
                <small className="text-gray">({edit?.user_type})</small>
              </p>
              <small className="text-gray">
                <BsEnvelope /> {edit?.email}
              </small>
              <small className="text-gray">
                <BsPhoneVibrate /> {edit?.mobile}
              </small>
              <small className="text-gray">
                <BsCalendarDate /> {edit?.joining_date}
              </small>
            </div>
          </div>
        </div>
      </Modaljs>
    </>
  );
};

export default ContractorUsers;
