import React, { useEffect, useMemo, useState } from "react";
import { Col } from "react-bootstrap";
import {
  getAllApprovedAssignComplaints,
  getAllApprovedUnAssignComplaints,
  getAreaManagerAssign,
  getSupervisorAssign,
  getApprovedComplaints,
  postAfterAssignCanRejectedComplaints,
  getAllEndUser,
  postRejectComplaints,
} from "../../services/contractorApi";
import Select from "react-select";
import TextareaAutosize from "react-textarea-autosize";
import { Helmet } from "react-helmet";
import Tabs, { Tab } from "react-best-tabs";
import "react-best-tabs/dist/index.css";
import { BsFillPersonCheckFill, BsPencil } from "react-icons/bs";
import { FilterComponent } from "./FilterComponent";
import { addRemarkSchema } from "../../utils/formSchema";
import ConfirmAlert from "../../components/ConfirmAlert";
import { Formik } from "formik";
import { toast } from "react-toastify";
import { FaRegStopCircle } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import FormLabelText from "../../components/FormLabelText";
import { UserDetail } from "../../components/ItemDetail";
import StatusChip from "../../components/StatusChip";
import ActionButtons from "../../components/DataTable/ActionButtons";
import CustomTable from "../../components/DataTable/CustomTable";
import { UserPlus } from "lucide-react";
import TableHeader from "../../components/DataTable/TableHeader";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import { createColumnHelper } from "@tanstack/react-table";
import { serialNumber } from "../../utils/helper";

const ApprovedComplaints = ({ checkPermission }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useSelector(selectUser);
  const columnHelper = createColumnHelper();
  const [showAlert, setShowAlert] = useState(false);
  const [edit, setEdit] = useState({});
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || "10";
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [typeData, setTypeData] = useState("Un-Assign");
  const [allManagers, setAllManagers] = useState([]);
  const [allSupervisors, setAllSupervisors] = useState([]);
  const [salesAreaId, setSalesAreaId] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [complaintFor, setComplaintFor] = useState("");
  const [outletId, setOutletId] = useState("");
  const [regionalOfficeId, setRegionalOfficeId] = useState("");
  const [orderById, setOrderById] = useState("");
  const [managerById, setManagerById] = useState("");
  const [supervisorById, setSupervisorById] = useState("");
  const [endUserId, setEndUserId] = useState("");
  const [endUSer, setEndUSer] = useState([]);
  const [uniqueId, setUniqueId] = useState("");
  const [activeTab, setActiveTab] = useState(0);

  const { t } = useTranslation();

  const tabs = [
    { title: t("Un-Assign"), className: "ms-auto", page: <TableComponent /> },
    { title: t("Assign"), page: <TableComponent /> },
    { title: t("All"), className: "me-1", page: <TableComponent /> },
  ];

  const fetchApprovedComplaints = async () => {
    const queryParams = {
      search,
      pageSize,
      pageNo,
      sales_area_id: salesAreaId,
      outlet_id: outletId,
      regional_office_id: regionalOfficeId,
      order_by_id: orderById,
      area_manager_id: managerById,
      supervisor_id: supervisorById,
      end_user_id: endUserId,
      company_id: companyId,
      complaint_for: complaintFor,
    };
    const res =
      typeData == "Un-Assign"
        ? await getAllApprovedUnAssignComplaints(queryParams)
        : typeData == "Assign"
        ? await getAllApprovedAssignComplaints(queryParams)
        : await getApprovedComplaints(queryParams);
    if (res.status) {
      setRows(res?.data);
      setTotalData(res?.pageDetails?.total);
    } else {
      setRows([]);
      setTotalData(0);
    }
    setIsLoading(false);
  };

  const fetchManagers = async () => {
    const status = "0";
    const res = await getAreaManagerAssign(status);
    if (res.status) {
      setAllManagers(res.data);
    } else {
      setAllManagers([]);
    }
  };

  const fetchSupervisors = async () => {
    const res = await getSupervisorAssign(managerById);
    if (res.status) {
      setAllSupervisors(res.data);
    } else {
      setAllSupervisors([]);
    }
  };

  const fetchEndUser = async () => {
    const res = await getAllEndUser(supervisorById);
    if (res.status) {
      setEndUSer(res.data);
    } else {
      setEndUSer([]);
    }
  };

  useEffect(() => {
    if (typeData == "Assign") {
      fetchManagers();
      if (managerById) {
        fetchSupervisors();
      }
      if (supervisorById) {
        fetchEndUser();
      }
    }
  }, [typeData, managerById, supervisorById, endUserId]);

  useEffect(() => {
    fetchApprovedComplaints();
  }, [
    search,
    pageNo,
    pageSize,
    typeData,
    salesAreaId,
    outletId,
    regionalOfficeId,
    orderById,
    managerById,
    supervisorById,
    endUserId,
    companyId,
    uniqueId,
  ]);

  const handleClick = async (e, index) => {
    setTypeData(e.target.textContent);
    setActiveTab(index);
    setSearch("");
    if (searchParams.has("pageNo")) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("pageNo");
      navigate(`?${newParams.toString()}`, { replace: true });
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      id: edit?.id,
      status: 4,
      rejected_remark: values.remark,
    };

    // return console.log("sData", sData);
    const res =
      typeData == "Assign"
        ? await postAfterAssignCanRejectedComplaints(sData)
        : await postRejectComplaints(sData);
    if (res.status) {
      toast.success(res.message);
      fetchApprovedComplaints();
    } else {
      toast.error(res.message);
    }
    setShowAlert(false);
    resetForm();
    setSubmitting(false);
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
      columnHelper.accessor("complaint_unique_id", {
        header: "Complaint Unique ID",
      }),
      columnHelper.accessor("outlet_name", {
        header: "outlet name",
        cell: (info) => info.row.original?.outlet[0]?.outlet_name,
      }),
      columnHelper.accessor("outlet_ccnohsd", {
        header: "outlet ccnohsd",
        cell: (info) => info.row.original?.outlet[0]?.outlet_ccnohsd,
      }),
      columnHelper.accessor("outlet_ccnoms", {
        header: "outlet ccnoms",
        cell: (info) => info.row.original?.outlet[0]?.outlet_ccnoms,
      }),
      columnHelper.accessor("regional_office_name", {
        header: "regional office name",
        cell: (info) =>
          info?.row?.original?.regionalOffice
            ? info?.row?.original?.regionalOffice[0]?.regional_office_name
            : "-",
      }),
      columnHelper.accessor("sales_area_name", {
        header: "sales area name",
        cell: (info) =>
          info.row.original?.saleAreaDetails
            ? info.row.original?.saleAreaDetails[0]?.sales_area_name
            : "-",
      }),
      columnHelper.accessor("area_manager_id", {
        header: "Area manager",
        cell: (info) => (
          <UserDetail
            img={info.row.original?.area_manager_image}
            name={info.row.original?.area_manager_name}
            login_id={user?.id}
            id={info.row.original?.area_manager_id}
            unique_id={info.row.original?.area_manager_unique_id}
          />
        ),
      }),
      columnHelper.accessor("supervisor_id", {
        header: "Supervisor",
        cell: (info) => (
          <UserDetail
            img={info.row.original?.supervisor_unique_image}
            name={info.row.original?.supervisor_name}
            login_id={user?.id}
            id={info.row.original?.supervisor_id}
            unique_id={info.row.original?.supervisor_unique_id}
          />
        ),
      }),
      columnHelper.accessor("end_user_details_id", {
        header: "End User",
        cell: (info) => (
          <UserDetail
            img={info.row.original?.end_user_details_image}
            name={info.row.original?.end_user_details_name}
            login_id={user?.id}
            id={info.row.original?.end_user_details_id}
            unique_id={info.row.original?.end_user_details_unique_id}
          />
        ),
      }),
      columnHelper.accessor("order_by_details", {
        header: "order by",
        cell: (info) => (
          <UserDetail
            img={info.row.original?.order_by_image}
            name={info.row.original?.order_by_details}
            login_id={user?.id}
            id={info.row.original?.order_by_id}
            unique_id={info.row.original?.order_by_unique_id}
          />
        ),
      }),
      columnHelper.accessor("energy_company_name", {
        header: "company name",
      }),
      columnHelper.accessor("description", {
        header: "description",
      }),
      columnHelper.accessor("status", {
        header: "status",
        cell: (info) => <StatusChip status={info.row.original.status} />,
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
                    `ViewRequestsComplaint/${info.row.original.id}?type=approve`
                  ),
              },
              edit: {
                show: checkPermission?.update,
                action: () =>
                  navigate(`/create-complaint/${info.row.original.id}`),
              },
              delete: {
                show: checkPermission?.delete,
                icon: BsFillPersonCheckFill,
                tooltipTitle: "Allowcate",
                align: "left",
                action: () =>
                  navigate(
                    `/ApprovedComplaints/CreateAllocate/${info.row.original.id}`
                  ),
              },
              reject: {
                show: checkPermission?.update,
                show: true,
                align: "left",
                action: () => {
                  setEdit(info.row.original);
                  setShowAlert(true);
                },
              },
              approve: {
                show: checkPermission?.update,
                align: "left",
                icon:
                  typeData == "Assign" || info.row.original?.isComplaintAssigned
                    ? BsPencil
                    : FaRegStopCircle,
                className: "danger-combo",
                tooltipTitle:
                  typeData == "Assign" || info.row.original?.isComplaintAssigned
                    ? "Update Allocate"
                    : "Hold Complaint",
                action: () =>
                  navigate(
                    `/ApprovedComplaints/${
                      typeData == "Assign" ||
                      info.row.original?.isComplaintAssigned
                        ? "UpdateAllocate"
                        : "HoldComplaints"
                    }/${info.row.original.id}`
                  ),
              },
            }}
          />
        ),
      }),
    ],
    [checkPermission, rows.length, pageNo, pageSize]
  );

  function TableComponent() {
    return (
      <>
        <CustomTable
          id={"approved_complaints"}
          isLoading={isLoading}
          rows={rows || []}
          columns={columns}
          pagination={{
            pageNo,
            pageSize,
            totalData,
          }}
          excelAction={typeData == "All"}
          pdfAction={typeData == "All"}
          apiForExcelPdf={
            typeData == "Un-Assign"
              ? getAllApprovedUnAssignComplaints
              : typeData == "Assign"
              ? getAllApprovedAssignComplaints
              : getApprovedComplaints
          }
          customHeaderComponent={() => (
            <TableHeader
              userPermission={checkPermission}
              button={{ show: false }}
            />
          )}
          tableTitleComponent={
            <div>
              <UserPlus /> <strong>{typeData} Complaints</strong>
            </div>
          }
          defaultVisible={{
            description: false,
          }}
        />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Approved Complaints · CMS Electrical</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <Tabs
          onClick={(e, index) => handleClick(e, index)}
          activeTab={activeTab}
          ulClassName="border-primary p-2 border-bottom"
          activityClassName="bg-secondary"
        >
          {tabs.map((tab, idx) => (
            <Tab key={idx} title={tab.title} className={tab.className}>
              <span className="d-align mt-3 me-3 justify-content-end gap-2">
                <TableHeader
                  setSearchText={setSearch}
                  button={{ show: false }}
                />
              </span>
              <div className="p-3">
                {tab.title == typeData ? (
                  <FilterComponent
                    setSalesAreaId={setSalesAreaId}
                    setCompanyId={setCompanyId}
                    setComplaintFor={setComplaintFor}
                    setOutletId={setOutletId}
                    setRegionalOfficeId={setRegionalOfficeId}
                    setOrderById={setOrderById}
                    setEndUserId={setEndUserId}
                    setUniqueId={setUniqueId}
                    status={
                      typeData == "Un-Assign" ? 2 : typeData == "Assign" ? 3 : 6
                    }
                  >
                    {typeData == "Assign" ? (
                      <>
                        <Col md={3}>
                          <FormLabelText children={t("Manager User")} />
                          <Select
                            isDisabled={supervisorById}
                            menuPortalTarget={document.body}
                            options={allManagers?.map((user) => ({
                              label: user.name,
                              value: user.id,
                            }))}
                            onChange={(e) => {
                              setManagerById(e ? e.value : null);
                            }}
                            isClearable
                          />
                        </Col>
                        <Col md={3}>
                          <FormLabelText children={t("Supervisor")} />
                          <Select
                            isDisabled={endUserId}
                            menuPortalTarget={document.body}
                            options={allSupervisors?.map((user) => ({
                              label: user.name,
                              value: user.id,
                            }))}
                            onChange={(e) => {
                              setSupervisorById(e ? e.value : null);
                            }}
                            isClearable
                          />
                        </Col>
                        <Col md={3}>
                          <FormLabelText children={t("End User")} />
                          <Select
                            menuPortalTarget={document.body}
                            options={endUSer?.map((user) => ({
                              label: user.name,
                              value: user.id,
                            }))}
                            onChange={(e) => {
                              setEndUserId(e ? e.value : null);
                            }}
                            isClearable
                          />
                        </Col>
                      </>
                    ) : null}
                  </FilterComponent>
                ) : null}
                {tab.page}
              </div>
            </Tab>
          ))}
        </Tabs>
      </Col>

      <Formik
        enableReinitialize={true}
        initialValues={{
          remark: "",
        }}
        validationSchema={addRemarkSchema}
        onSubmit={handleSubmit}
      >
        {(props) => (
          <ConfirmAlert
            size={"sm"}
            formikProps={props}
            hide={setShowAlert}
            show={showAlert}
            type="submit"
            title={`Confirm Reject`}
            description={
              <>
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
                <small className="text-danger">{props.errors.remark}</small>
              </>
            }
          />
        )}
      </Formik>
    </>
  );
};

export default ApprovedComplaints;
