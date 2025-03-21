import React, { useEffect, useMemo, useState } from "react";
import CustomTable from "../../components/DataTable/CustomTable";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createColumnHelper } from "@tanstack/react-table";
import TableHeader from "../../components/DataTable/TableHeader";
import Select from "react-select";
import { selectUser } from "../../features/auth/authSlice";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import ActionButtons from "../../components/DataTable/ActionButtons";
import { RotateCcw, UserPlus } from "lucide-react";
import {
  getAllEndUser,
  getAreaManagerAssign,
  getResolvedComplaints,
  getSupervisorAssign,
} from "../../services/contractorApi";
import StatusChip from "../../components/StatusChip";
import { FilterComponent } from "./FilterComponent";
import FormLabelText from "../../components/FormLabelText";
import { Col } from "react-bootstrap";
import { UserDetail } from "../../components/ItemDetail";
import { serialNumber } from "../../utils/helper";

const ResolvedComplaints = ({ checkPermission }) => {
  const columnHelper = createColumnHelper();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || "10";
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { userPermission, user } = useSelector(selectUser);
  const [salesAreaId, setSalesAreaId] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [complaintFor, setComplaintFor] = useState("");
  const [outletId, setOutletId] = useState("");
  const [regionalOfficeId, setRegionalOfficeId] = useState("");
  const [orderById, setOrderById] = useState("");
  const [allManagers, setAllManagers] = useState([]);
  const [allSupervisors, setAllSupervisors] = useState([]);
  const [managerById, setManagerById] = useState("");
  const [supervisorById, setSupervisorById] = useState("");
  const [endUSer, setEndUSer] = useState([]);
  const [endUserId, setEndUserId] = useState("");
  const [uniqueId, setUniqueId] = useState("");

  const fetchAllocateData = async () => {
    const res = await getResolvedComplaints({
      search,
      pageSize,
      pageNo,
      area_manager_id: managerById,
      supervisor_id: supervisorById,
      end_user_id: endUserId,
      sales_area_id: salesAreaId,
      outlet_id: outletId,
      regional_office_id: regionalOfficeId,
      order_by_id: orderById,
      company_id: companyId,
      complaint_for: complaintFor,
    });
    setIsLoading(true);
    if (res.status) {
      setRows(res?.data);
      setTotalData(res?.pageDetails?.total);
    } else {
      setRows([]);
      setTotalData(0);
    }
    setIsLoading(false);
  };

  const fetchEndUser = async () => {
    const res = await getAllEndUser(supervisorById);
    if (res.status) {
      setEndUSer(res.data);
    } else {
      setEndUSer([]);
    }
  };

  const fetchManagers = async () => {
    const status = "3";
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
      columnHelper.accessor("end_user_id", {
        header: "End User",
        cell: (info) => (
          <UserDetail
            img={info.row.original?.end_user_image}
            name={info.row.original?.end_user_name}
            login_id={user?.id}
            id={info.row.original?.end_user_id}
            unique_id={info.row.original?.end_user_unique_id}
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
                    `/resolved-complaints/ViewRequestsComplaint/${info.row.original.id}?type=resolved`
                  ),
              },
              edit: {
                show: checkPermission?.update,
                action: () =>
                  navigate(`/create-complaint/${info.row.original.id}`),
              },
              reject: {
                show: checkPermission?.update,
                icon: RotateCcw,
                tooltipTitle: "Re-Work",
                align: "left",
                action: () =>
                  navigate(
                    `/ApprovedComplaints/CreateAllocate/${info.row.original.id}?type=resolve`
                  ),
              },
            }}
          />
        ),
      }),
    ],
    [checkPermission, rows.length, pageNo, pageSize]
  );

  useEffect(() => {
    fetchManagers();
    fetchSupervisors();
    fetchEndUser();
  }, [managerById, supervisorById, endUserId]);

  useEffect(() => {
    fetchAllocateData();
  }, [
    search,
    pageNo,
    pageSize,
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

  return (
    <>
      <FilterComponent
        setSalesAreaId={setSalesAreaId}
        setCompanyId={setCompanyId}
        setComplaintFor={setComplaintFor}
        setOutletId={setOutletId}
        setRegionalOfficeId={setRegionalOfficeId}
        setOrderById={setOrderById}
        setUniqueId={setUniqueId}
        status={3}
      >
        <Col md={3}>
          <FormLabelText children={t("Manager User")} />
          <Select
            menuPortalTarget={document.body}
            isDisabled={supervisorById}
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
            menuPortalTarget={document.body}
            isDisabled={endUserId}
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
      </FilterComponent>
      <CustomTable
        id={"resolved_complaints"}
        isLoading={isLoading}
        rows={rows || []}
        columns={columns}
        pagination={{
          pageNo,
          pageSize,
          totalData,
        }}
        excelAction={() => ""}
        pdfAction={() => ""}
        apiForExcelPdf={getResolvedComplaints}
        customHeaderComponent={() => (
          <TableHeader
            userPermission={checkPermission}
            setSearchText={setSearch}
            button={{ show: false }}
          />
        )}
        tableTitleComponent={
          <div>
            <UserPlus /> <strong>Resolved Complaints</strong>
          </div>
        }
        defaultVisible={{
          description: false,
        }}
      />
    </>
  );
};

export default ResolvedComplaints;
