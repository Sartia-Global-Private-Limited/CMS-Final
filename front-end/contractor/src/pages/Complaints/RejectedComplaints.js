import React, { useEffect, useMemo, useState } from "react";
import CustomTable from "../../components/DataTable/CustomTable";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createColumnHelper } from "@tanstack/react-table";
import TableHeader from "../../components/DataTable/TableHeader";
import { selectUser } from "../../features/auth/authSlice";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import ActionButtons from "../../components/DataTable/ActionButtons";
import { toast } from "react-toastify";
import ConfirmAlert from "../../components/ConfirmAlert";
import { RotateCcw, UserPlus } from "lucide-react";
import {
  getRejectedComplaints,
  postReactiveRejectComplaints,
} from "../../services/contractorApi";
import StatusChip from "../../components/StatusChip";
import { FilterComponent } from "./FilterComponent";
import { serialNumber } from "../../utils/helper";

const RejectedComplaints = ({ checkPermission }) => {
  const columnHelper = createColumnHelper();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [reActiveId, setReActiveId] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [search, setSearch] = useState("");
  const [salesAreaId, setSalesAreaId] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [complaintFor, setComplaintFor] = useState("");
  const [outletId, setOutletId] = useState("");
  const [regionalOfficeId, setRegionalOfficeId] = useState("");
  const [orderById, setOrderById] = useState("");
  const [uniqueId, setUniqueId] = useState("");
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { userPermission } = useSelector(selectUser);

  const fetchRejectedData = async () => {
    const res = await getRejectedComplaints({
      search,
      pageSize,
      pageNo,
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

  const handleReActive = async () => {
    const res = await postReactiveRejectComplaints(reActiveId);
    if (res.status) {
      toast.success(res.message);
      setRows((prev) => prev.filter((itm) => itm.company_id !== +reActiveId));
      fetchRejectedData();
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
      columnHelper.accessor("order_by_details", {
        header: "order by",
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
                    `/rejected-complaints/ViewRequestsComplaint/${info.row.original.id}?type=rejected`
                  ),
              },
              reject: {
                show: checkPermission?.update,
                icon: RotateCcw,
                tooltipTitle: "Re-Active",
                align: "left",
                action: () => {
                  setReActiveId(info.row.original.id);
                  setShowAlert(true);
                },
              },
            }}
          />
        ),
      }),
    ],
    [checkPermission, rows.length, pageNo, pageSize]
  );

  useEffect(() => {
    fetchRejectedData();
  }, [
    search,
    pageNo,
    pageSize,
    salesAreaId,
    outletId,
    regionalOfficeId,
    orderById,
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
        status={4}
      />
      <CustomTable
        id={"rejected_complaints"}
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
        apiForExcelPdf={getRejectedComplaints}
        customHeaderComponent={() => (
          <TableHeader
            userPermission={checkPermission}
            setSearchText={setSearch}
            button={{ show: false }}
          />
        )}
        tableTitleComponent={
          <div>
            <UserPlus /> <strong>Rejected Complaints</strong>
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

export default RejectedComplaints;
