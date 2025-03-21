import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { getAllAreaManagerTransaction } from "../../../services/contractorApi";
import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/auth/authSlice";
import ActionButtons from "../../../components/DataTable/ActionButtons";
import { UserPlus } from "lucide-react";
import TableHeader from "../../../components/DataTable/TableHeader";
import CustomTable from "../../../components/DataTable/CustomTable";
import { formatNumberToINR, serialNumber } from "../../../utils/helper";

const AllManager = ({ checkPermission }) => {
  const columnHelper = createColumnHelper();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { userPermission } = useSelector(selectUser);

  const fetchAllTransactions = async () => {
    const res = await getAllAreaManagerTransaction(search, pageSize, pageNo);
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

  const columns = useMemo(
    () => [
      columnHelper.accessor("sr_no", {
        header: t("Sr No."),
        cell: (info) => {
          const serialNumbers = serialNumber(pageNo, pageSize);
          return serialNumbers[info.row.index];
        },
      }),
      columnHelper.accessor("name", {
        header: t("Area Manager Name"),
        cell: (info) => info.getValue() || "-",
      }),
      columnHelper.accessor("mobile", {
        header: t("Mobile"),
        cell: (info) => info.getValue() || "-",
      }),
      columnHelper.accessor("email", {
        header: t("email"),
        cell: (info) => info.getValue() || "-",
      }),
      columnHelper.accessor("employee_id", {
        header: t("Employee Id"),
        cell: (info) => info.getValue() || "-",
      }),
      columnHelper.accessor("total_received_credit", {
        header: t("Total in amount"),
        cell: (info) => formatNumberToINR(info.getValue()),
      }),
      columnHelper.accessor("total_received_non_credit", {
        header: t("total pay amount"),
        cell: (info) => formatNumberToINR(info.getValue()),
      }),
      columnHelper.accessor("balance", {
        header: t("balance"),
        cell: (info) => formatNumberToINR(info.getValue()),
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
                    `/area-manager/${info.row.original.area_manager_id}`
                  ),
              },
            }}
          />
        ),
      }),
    ],
    // [userPermission, rows.length]
    [checkPermission, rows.length, pageNo, pageSize]
  );

  useEffect(() => {
    fetchAllTransactions();
  }, [search, pageNo, pageSize]);

  return (
    <CustomTable
      id={"all_manager"}
      isLoading={isLoading}
      maxHeight="49vh"
      rows={rows || []}
      columns={columns}
      pagination={{
        pageNo,
        pageSize,
        totalData,
      }}
      excelAction={false}
      pdfAction={false}
      apiForExcelPdf={getAllAreaManagerTransaction}
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
          <UserPlus /> <strong>All Manager</strong>
        </div>
      }
    />
  );
};

export default AllManager;
