import React, { Fragment, useEffect, useMemo, useState } from "react";
import CustomTable from "../../components/DataTable/CustomTable";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createColumnHelper } from "@tanstack/react-table";
import TableHeader from "../../components/DataTable/TableHeader";
import Select from "react-select";
import { selectUser } from "../../features/auth/authSlice";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import ActionButtons from "../../components/DataTable/ActionButtons";
import { toast } from "react-toastify";
import ConfirmAlert from "../../components/ConfirmAlert";
import { RotateCcw, UserPlus } from "lucide-react";
import {
  getAllApprovedAssignComplaints,
  getAllEndUser,
  getAreaManagerAssign,
  getSupervisorAssign,
  postReactiveRejectComplaints,
} from "../../services/contractorApi";
import StatusChip from "../../components/StatusChip";
import { FilterComponent } from "./FilterComponent";
import FormLabelText from "../../components/FormLabelText";
import { Col } from "react-bootstrap";
import { UserDetail, UserDetails } from "../../components/ItemDetail";
import { serialNumber } from "../../utils/helper";

const Allocate = ({ checkPermission }) => {
  const columnHelper = createColumnHelper();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || "10";
  const [reActiveId, setReActiveId] = useState("");
  const [showAlert, setShowAlert] = useState(false);
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
    const res = await getAllApprovedAssignComplaints({
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

  const handleReActive = async () => {
    const res = await postReactiveRejectComplaints(reActiveId);
    if (res.status) {
      toast.success(res.message);
      setRows((prev) => prev.filter((itm) => itm.company_id !== +reActiveId));
      fetchAllocateData();
    } else {
      toast.error(res.message);
    }
    setReActiveId("");
    setShowAlert(false);
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
      columnHelper.accessor("areaManagerDetails", {
        header: "Area manager",
        cell: (info) => (
          <UserDetail
            img={
              info.row.original?.checkUsersAssign[0]?.areaManagerDetails?.image
            }
            name={
              info.row.original?.checkUsersAssign[0]?.areaManagerDetails?.name
            }
            login_id={user?.id}
            id={info.row.original?.checkUsersAssign[0]?.areaManagerDetails?.id}
            unique_id={
              info.row.original?.checkUsersAssign[0]?.areaManagerDetails
                ?.employee_id
            }
          />
        ),
      }),
      columnHelper.accessor("supervisorDetails", {
        header: "Supervisor",
        cell: (info) => (
          <UserDetail
            img={info.row.original?.checkUsersAssign[0]?.supervisorDetails?.map(
              (itm) => itm?.image
            )}
            name={info.row.original?.checkUsersAssign[0]?.supervisorDetails?.map(
              (itm) => itm?.name
            )}
            login_id={user?.id}
            id={info.row.original?.checkUsersAssign[0]?.supervisorDetails?.map(
              (itm) => itm?.id
            )}
            unique_id={info.row.original?.checkUsersAssign[0]?.supervisorDetails?.map(
              (itm) => itm?.employee_id
            )}
          />
        ),
      }),
      columnHelper.accessor("endUserDetails", {
        header: "End User",
        cell: (info) => (
          <div className="d-flex align-items-center">
            {info.row.original?.checkUsersAssign[0]?.endUserDetails?.map(
              (list, idx) => (
                <Fragment key={idx}>
                  <UserDetails
                    img={list?.image}
                    id={list?.id}
                    name={list?.name}
                    unique_id={list?.employee_id}
                    login_id={user?.id}
                  />
                </Fragment>
              )
            )}
          </div>
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
              reject: {
                show: checkPermission?.update,
                icon: RotateCcw,
                tooltipTitle: "Update Status",
                align: "left",
                action: () =>
                  navigate(
                    `ViewRequestsComplaint/${info.row.original.id}?type=update_status`
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
        id={"allowcate_complaints"}
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
        apiForExcelPdf={getAllApprovedAssignComplaints}
        customHeaderComponent={() => (
          <TableHeader
            userPermission={checkPermission}
            setSearchText={setSearch}
            button={{ show: false }}
          />
        )}
        tableTitleComponent={
          <div>
            <UserPlus /> <strong>Allocate Complaints</strong>
          </div>
        }
        defaultVisible={{
          description: false,
        }}
      />

      <ConfirmAlert
        size={"sm"}
        deleteFunction={handleReActive}
        hide={setShowAlert}
        show={showAlert}
        title={"Confirm Re-Active"}
        description={"Are you sure you want to re-active this!!"}
      />
    </>
  );
};

export default Allocate;
