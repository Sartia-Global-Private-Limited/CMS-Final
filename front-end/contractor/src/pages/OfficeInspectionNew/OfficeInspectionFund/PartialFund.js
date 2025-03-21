import React, { useEffect, useMemo, useState } from "react";
import { getOfficeFundRequestForPartial } from "../../../services/contractorApi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { selectUser } from "../../../features/auth/authSlice";
import { useSelector } from "react-redux";
import { UserDetail } from "../../../components/ItemDetail";
import ActionButtons from "../../../components/DataTable/ActionButtons";
import StatusChip from "../../../components/StatusChip";
import { createColumnHelper } from "@tanstack/react-table";
import CustomTable from "../../../components/DataTable/CustomTable";
import TableHeader from "../../../components/DataTable/TableHeader";
import { UserPlus } from "lucide-react";
import { serialNumber } from "../../../utils/helper";
import LevelWiseSelect from "../../../components/LevelWiseSelect";

export default function PartialFund({ checkPermission }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const columnHelper = createColumnHelper();
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector(selectUser);
  const [selectedData, setSelectedData] = useState({ id: "", type: "" });

  const fetchPartialFundRequest = async () => {
    const res = await getOfficeFundRequestForPartial({
      pageSize,
      pageNo,
      search,
      user_id: selectedData?.id,
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
    fetchPartialFundRequest();
  }, [pageNo, search, pageSize, selectedData?.id]);

  const handleLevelChange = ({ id, type }) => {
    setSelectedData({ id, type });
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
      columnHelper.accessor("employee_id", {
        header: "employee id",
        cell: (info) => info.row.original.employee?.employee_id,
      }),
      columnHelper.accessor("username", {
        header: "employee name",
        cell: (info) => (
          <UserDetail
            img={info.row.original?.employee?.image}
            name={info.row.original?.employee?.username}
            id={info.row.original?.employee?.id}
            unique_id={info.row.original?.employee?.employee_id}
            login_id={user.id}
          />
        ),
      }),
      columnHelper.accessor("user_type", {
        header: "user type",
        cell: (info) => info.row.original.employee?.user_type,
      }),
      columnHelper.accessor("regional_office_name", {
        header: "regional office",
        cell: (info) =>
          info.row.original.regionalOffice?.[0]?.regional_office_name,
      }),
      columnHelper.accessor("sales_area_name", {
        header: "sales area",
        cell: (info) => info.row.original.saleAreaDetails?.[0]?.sales_area_name,
      }),
      columnHelper.accessor("total_amount", {
        header: "total amount",
        cell: (info) => (
          <div className="fw-bolder text-green">
            {info.row.original?.total_amount}
          </div>
        ),
      }),
      columnHelper.accessor("total_complaints", {
        header: "total complaints",
      }),
      columnHelper.accessor("status", {
        header: "status",
        cell: (info) => (
          <StatusChip status={info.row.original.status == "1" && "Partial"} />
        ),
      }),
      columnHelper.accessor("month", {
        header: "date",
      }),
      columnHelper.accessor("action", {
        header: "Action",
        cell: (info) => (
          <ActionButtons
            actions={{
              view: {
                show: checkPermission?.view,
                action: () =>
                  navigate(`/view-office-fund`, {
                    state: {
                      outletId: info.row.original?.outlet?.[0]?.id,
                      month: info.row.original?.month,
                      allData: info.row.original,
                      type: "partial",
                    },
                  }),
              },
              approve: {
                show: checkPermission?.update,
                action: () =>
                  navigate(`/approve-office-fund`, {
                    state: {
                      outletId: info.row.original?.outlet?.[0]?.id,
                      month: info.row.original?.month,
                      allData: info.row.original,
                      type: "partial",
                    },
                  }),
              },
            }}
          />
        ),
      }),
    ],
    [checkPermission, rows.length, pageNo, pageSize]
  );

  return (
    <>
      <LevelWiseSelect onChange={handleLevelChange} />
      <CustomTable
        id={"partial_fund"}
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
            button={{ show: false }}
          />
        )}
        tableTitleComponent={
          <div>
            <UserPlus /> <strong>partial fund</strong>
          </div>
        }
      />
    </>
  );
}
