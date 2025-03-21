import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getAllPaymentsetting,
  getAllROTransactions,
} from "../../../services/contractorApi";
import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/auth/authSlice";
import ActionButtons from "../../../components/DataTable/ActionButtons";
import { UserPlus } from "lucide-react";
import TableHeader from "../../../components/DataTable/TableHeader";
import CustomTable from "../../../components/DataTable/CustomTable";
import { formatNumberToINR, serialNumber } from "../../../utils/helper";

const ROTransactions = ({ checkPermission }) => {
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
    const res = await getAllROTransactions(search, pageSize, pageNo);
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
      columnHelper.accessor("regional_office_name", {
        header: "Regional Office",
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
                  navigate(`/regional-office/${info.row.original.ro_id}`),
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
      id={"regional_office_transactions"}
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
      apiForExcelPdf={getAllPaymentsetting}
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
          <UserPlus /> <strong>Regional office transactions</strong>
        </div>
      }
    />
  );
};

export default ROTransactions;
