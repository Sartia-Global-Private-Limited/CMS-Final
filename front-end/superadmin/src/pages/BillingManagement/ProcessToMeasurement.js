import React, { useEffect, useMemo, useState } from "react";
import { getAllComplaintsForMeasurement } from "../../services/contractorApi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FilterComponentInMeasurement } from "./FilterComponentInMeasurement";
import { createColumnHelper } from "@tanstack/react-table";
import { selectUser } from "../../features/auth/authSlice";
import { useSelector } from "react-redux";
import { CirclePlus, UserPlus } from "lucide-react";
import TableHeader from "../../components/DataTable/TableHeader";
import CustomTable from "../../components/DataTable/CustomTable";
import ActionButtons from "../../components/DataTable/ActionButtons";
import StatusChip from "../../components/StatusChip";
import { serialNumber } from "../../utils/helper";
import { useTranslation } from "react-i18next";

export default function ProcessToMeasurement() {
  const columnHelper = createColumnHelper();
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { userPermission } = useSelector(selectUser);
  const [complaintId, setComplaintId] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [complaintFor, setComplaintFor] = useState("");
  const [salesAreaId, setSalesAreaId] = useState("");
  const [outletId, setOutletId] = useState("");
  const [regionalOfficeId, setRegionalOfficeId] = useState("");
  const [orderById, setOrderById] = useState("");
  const { t } = useTranslation();

  const fetchExpenseRequestData = async () => {
    let status = 1;
    const res = await getAllComplaintsForMeasurement({
      search,
      pageSize,
      pageNo,
      status,
      sales_area_id: salesAreaId,
      outlet_id: outletId,
      regional_office_id: regionalOfficeId,
      order_by_id: orderById,
      company_id: companyId,
      complaint_for: complaintFor,
      complaint_type: complaintId,
    });
    if (res.status) {
      setRows(res?.data);
      setTotalData(res?.pageDetails?.total);
    } else {
      setRows([]);
      setTotalData(0);
    }
    setIsLoading(false);
  };
  const navigate = useNavigate();

  useEffect(() => {
    fetchExpenseRequestData();
  }, [
    pageNo,
    pageSize,
    outletId,
    regionalOfficeId,
    salesAreaId,
    orderById,
    companyId,
    complaintFor,
    companyId,
    complaintId,
  ]);

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
        header: "complaint No",
      }),
      columnHelper.accessor("complaint_type", {
        header: "complaint type",
      }),
      columnHelper.accessor("outlet_name", {
        header: "outlet",
        cell: (info) => info.row.original.outlet?.[0]?.outlet_name,
      }),
      columnHelper.accessor("regional_office_name", {
        header: "regional Office",
        cell: (info) =>
          info.row.original.regionalOffice?.[0]?.regional_office_name,
      }),
      columnHelper.accessor("sales_area_name", {
        header: "sales area",
        cell: (info) => info.row.original.saleAreaDetails?.[0]?.sales_area_name,
      }),
      columnHelper.accessor("order_by_details", {
        header: "order by",
      }),
      columnHelper.accessor("status", {
        header: "status",
        cell: (info) => <StatusChip status={info.row.original?.status} />,
      }),
      columnHelper.accessor("energy_company_name", {
        header: "company name",
      }),
      columnHelper.accessor("action", {
        header: "Action",
        cell: (info) => (
          <ActionButtons
            actions={{
              view: {
                show: true,
                action: () =>
                  navigate(
                    `ViewRequestsComplaint/${info.row.original.id}?type=approve`
                  ),
              },
              reject: {
                show: true,
                icon: CirclePlus,
                tooltipTitle: "create",
                align: "left",
                action: () =>
                  navigate(
                    `/Measurements/CreateMeasurement/${info.row.original.id}`,
                    {
                      state: {
                        measurement_type: "new",
                        editFrom: "PTM",
                        complaint_id: info.row.original.id,
                      },
                    }
                  ),
              },
            }}
          />
        ),
      }),
    ],
    [rows.length, pageNo, pageSize]
  );

  return (
    <>
      <div className="m-2">
        <FilterComponentInMeasurement
          setSalesAreaId={setSalesAreaId}
          setOutletId={setOutletId}
          setRegionalOfficeId={setRegionalOfficeId}
          setOrderById={setOrderById}
          setCompanyId={setCompanyId}
          setComplaintFor={setComplaintFor}
          setComplaintId={setComplaintId}
          status={1}
          filterFor={"PTM"}
        />
      </div>
      <CustomTable
        id={"process_to_measurement"}
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
            userPermission={userPermission}
            setSearchText={setSearch}
            button={{ show: false }}
          />
        )}
        tableTitleComponent={
          <div>
            <UserPlus /> <strong>process to measurement</strong>
          </div>
        }
      />
    </>
  );
}
