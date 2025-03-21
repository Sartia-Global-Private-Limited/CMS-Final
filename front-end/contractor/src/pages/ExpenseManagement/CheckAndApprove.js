import React, { useEffect, useMemo, useState } from "react";
import { Badge } from "react-bootstrap";
import { getApprovedExpensePunch } from "../../services/contractorApi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDebounce } from "../../hooks/UseDebounce";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import { createColumnHelper } from "@tanstack/react-table";
import { UserDetail } from "../../components/ItemDetail";
import ActionButtons from "../../components/DataTable/ActionButtons";
import CustomTable from "../../components/DataTable/CustomTable";
import TableHeader from "../../components/DataTable/TableHeader";
import { UserPlus } from "lucide-react";
import { serialNumber } from "../../utils/helper";

const CheckAndApprove = ({ checkPermission }) => {
  const columnHelper = createColumnHelper();
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const { userPermission } = useSelector(selectUser);
  const { user } = useSelector(selectUser);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const fetchStockApprovedData = async () => {
    const res = await getApprovedExpensePunch({
      search,
      pageSize,
      pageNo,
    });
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

  // set Delay time to get data on search
  const debounceValue = useDebounce(search, 500);

  useEffect(() => {
    fetchStockApprovedData();
  }, [debounceValue, pageNo, pageSize]);

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
        header: "Employee ID",
      }),
      columnHelper.accessor("user_name", {
        header: "User name",
        cell: (info) => (
          <UserDetail
            img={info.row.original?.user_image}
            name={info.row.original?.user_name}
            login_id={user?.id}
            id={info.row.original?.user_id}
            unique_id={info.row.original?.employee_id}
          />
        ),
      }),
      columnHelper.accessor("complaint_unique_id", {
        header: "complaint number",
      }),
      columnHelper.accessor("approved_by", {
        header: "Approved By",
        cell: (info) => (
          <UserDetail
            img={info.row.original?.approved_by.image}
            name={info.row.original?.approved_by?.name}
            login_id={user?.id}
            id={info.row.original?.approved_by.id}
            unique_id={info.row.original?.approved_by.employee_id}
          />
        ),
      }),
      columnHelper.accessor("total_items", {
        header: "total items",
        cell: (info) => (
          <Badge
            bg="secondary"
            className="fw-normal"
            style={{ fontSize: 11, marginTop: "5px" }}
          >
            {info.row.original?.total_items} {t("item")}
          </Badge>
        ),
      }),
      columnHelper.accessor("total_transactions", {
        header: "total transactions",
      }),
      columnHelper.accessor("approved_at", {
        header: "Date",
        cell: (info) => info.row.original.approved_at?.split("T")?.[0],
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
                    `/expense-punch/create-expense-punch/${info.row.original.id}?type=view`,
                    {
                      state: {
                        Complain_id: info.row.original.complaint_id,
                        userId: info.row.original.user_id,
                        viewType: "approveData",
                      },
                    }
                  ),
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
      <CustomTable
        id={"pending_request"}
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
        apiForExcelPdf={getApprovedExpensePunch}
        customHeaderComponent={() => (
          <TableHeader
            userPermission={checkPermission}
            setSearchText={setSearch}
            button={{
              show: false,
            }}
          />
        )}
        tableTitleComponent={
          <div>
            <UserPlus /> <strong>Check and approve</strong>
          </div>
        }
      />
    </>
  );
};

export default CheckAndApprove;
