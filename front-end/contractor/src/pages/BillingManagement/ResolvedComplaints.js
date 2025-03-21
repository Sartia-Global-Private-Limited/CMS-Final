import React, { useEffect, useMemo, useState } from "react";
import { getAllComplaintsForMeasurement } from "../../services/contractorApi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FilterComponentInMeasurement } from "./FilterComponentInMeasurement";
import FormLabelText from "../../components/FormLabelText";
import StatusChip from "../../components/StatusChip";
import { createColumnHelper } from "@tanstack/react-table";
import { selectUser } from "../../features/auth/authSlice";
import { useSelector } from "react-redux";
import TableHeader from "../../components/DataTable/TableHeader";
import { Paperclip, UserPlus } from "lucide-react";
import CustomTable, {
  selectable,
} from "../../components/DataTable/CustomTable";
import ActionButtons from "../../components/DataTable/ActionButtons";
import TooltipComponent from "../../components/TooltipComponent";
import { Button } from "react-bootstrap";
import { serialNumber } from "../../utils/helper";
import { useTranslation } from "react-i18next";

export default function ResolvedComplaints({ checkPermission }) {
  const columnHelper = createColumnHelper();
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { userPermission } = useSelector(selectUser);
  const [complaintId, setComplaintId] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [complaintFor, setComplaintFor] = useState("");
  const [salesAreaId, setSalesAreaId] = useState("");
  const [outletId, setOutletId] = useState("");
  const [regionalOfficeId, setRegionalOfficeId] = useState("");
  const [orderById, setOrderById] = useState("");
  const [tableIds, setTableIds] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();
  const fetchExpenseRequestData = async () => {
    let status = "0";
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

  useEffect(() => {
    fetchExpenseRequestData();
  }, [
    search,
    pageNo,
    pageSize,
    outletId,
    regionalOfficeId,
    salesAreaId,
    orderById,
    companyId,
    complaintFor,
    complaintId,
  ]);

  // const columns = useMemo(() => [
  //   selectable,
  //   columnHelper.accessor("sr_no", {
  //     header: "S.No",
  //     cell: (info) => info.row.index + 1,
  //   }),
  //   columnHelper.accessor("complaint_unique_id", {
  //     header: "complaint No",
  //   }),
  //   columnHelper.accessor("complaint_type", {
  //     header: "complaint type",
  //   }),
  //   columnHelper.accessor("outlet_name", {
  //     header: "outlet",
  //     cell: (info) => info.row.original.outlet?.[0]?.outlet_name ?? "-",
  //   }),
  //   columnHelper.accessor("regional_office_name", {
  //     header: "regional Office",
  //     cell: (info) =>
  //       info.row.original.regionalOffice?.[0]?.regional_office_name ?? "-",
  //   }),
  //   columnHelper.accessor("sales_area_name", {
  //     header: "sales area",
  //     cell: (info) =>
  //       info.row.original.saleAreaDetails?.[0]?.sales_area_name ?? "-",
  //   }),
  //   columnHelper.accessor("order_by_details", {
  //     header: "order by",
  //   }),
  //   columnHelper.accessor("status", {
  //     header: "status",
  //     cell: (info) => <StatusChip status={info.row.original?.status} />,
  //   }),
  //   columnHelper.accessor("energy_company_name", {
  //     header: "company name",
  //   }),
  //   columnHelper.accessor("action", {
  //     header: "Action",
  //     cell: (info) => (
  //       <ActionButtons
  //         actions={{
  //           view: {
  //             show: true,
  //             action: () =>
  //               navigate(
  //                 `ViewRequestsComplaint/${info.row.original.id}?type=approve`
  //               ),
  //           },
  //           reject: {
  //             show: true,
  //             icon: Paperclip,
  //             tooltipTitle: "Attach documents",
  //             align: "left",
  //             action: () =>
  //               navigate(`/attach-hard-copies`, {
  //                 state: {
  //                   complaint_id: info.row.original?.id,
  //                 },
  //               }),
  //           },
  //         }}
  //       />
  //     ),
  //   }),
  // ]);

  const columns = useMemo(() => {
    const baseColumns = [
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
        cell: (info) => info.row.original.outlet?.[0]?.outlet_name ?? "-",
      }),
      columnHelper.accessor("regional_office_name", {
        header: "regional Office",
        cell: (info) =>
          info.row.original.regionalOffice?.[0]?.regional_office_name ?? "-",
      }),
      columnHelper.accessor("sales_area_name", {
        header: "sales area",
        cell: (info) =>
          info.row.original.saleAreaDetails?.[0]?.sales_area_name ?? "-",
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
                show: checkPermission?.view,
                action: () =>
                  navigate(`/view-measurements/${info.row.original.id}`),
              },
              reject: {
                show: true,
                icon: Paperclip,
                tooltipTitle: "Attach documents",
                align: "left",
                action: () =>
                  navigate(`/attach-hard-copies`, {
                    state: {
                      complaint_id: info.row.original?.id,
                    },
                  }),
              },
            }}
          />
        ),
      }),
    ];

    if (false) {
      baseColumns.unshift(selectable);
    }

    return baseColumns;
  }, [checkPermission, false, pageNo, pageSize]);

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
          status={"0"}
          filterFor={"PTM"}
        />
        <FormLabelText
          info
          children={"Attach Documents : For Proccess to Measurment"}
        />
      </div>
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
        customHeaderComponent={(selectedRows) => (
          <TableHeader
            userPermission={checkPermission}
            setSearchText={setSearch}
            button={{ show: false }}
            extraComponent={
              selectedRows?.info?.length > 0 && (
                <TooltipComponent title={"Bulk Categorize"} align="top">
                  <Button
                    variant="success"
                    onClick={() => {
                      setTableIds(
                        selectedRows.info.map((itm) => itm.original.id)
                      );
                    }}
                  >
                    Marge
                  </Button>
                </TooltipComponent>
              )
            }
          />
        )}
        tableTitleComponent={
          <div>
            <UserPlus /> <strong>resolved complaints</strong>
          </div>
        }
      />
    </>
  );
}
