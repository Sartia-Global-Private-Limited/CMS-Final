import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAllProcessPaymentPaid } from "../../../services/contractorApi";
import { createColumnHelper } from "@tanstack/react-table";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/auth/authSlice";
import ActionButtons from "../../../components/DataTable/ActionButtons";
import { formatNumberToINR, serialNumber } from "../../../utils/helper";
import CustomTable from "../../../components/DataTable/CustomTable";
import TableHeader from "../../../components/DataTable/TableHeader";
import { UserPlus } from "lucide-react";

export default function DonePayments() {
  const columnHelper = createColumnHelper();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { userPermission } = useSelector(selectUser);

  const fetchAllInvoices = async () => {
    const status = "2";
    const res = await getAllProcessPaymentPaid(
      status,
      pageSize,
      pageNo,
      search
    );
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
      columnHelper.accessor("unique_id", {
        header: t("payment unique id"),
        cell: (info) => info.getValue() || "-",
      }),
      columnHelper.accessor("manager_name", {
        header: t("manager name"),
        cell: (info) => info.getValue() || "-",
      }),
      columnHelper.accessor("ro_name", {
        header: t("ro name"),
        cell: (info) => info.getValue() || "-",
      }),
      columnHelper.accessor("amount", {
        header: t("amount"),
        cell: (info) => formatNumberToINR(info.getValue()),
      }),
      columnHelper.accessor("otp", {
        header: t("Otp"),
        cell: (info) => info.getValue() || "-",
      }),
      columnHelper.accessor("paid_amount", {
        header: t("recieved amount"),
        cell: (info) => formatNumberToINR(info.getValue()),
      }),
      columnHelper.accessor("payment_mode", {
        header: t("payment mode"),
        cell: (info) => info.getValue() || "-",
      }),
      columnHelper.accessor("action", {
        header: "Action",
        cell: (info) => (
          <ActionButtons
            actions={{
              view: {
                show: true,
                action: () =>
                  navigate(`/payment-paid/view`, {
                    state: {
                      id: info.row.original?.id,
                    },
                  }),
              },
            }}
          />
        ),
      }),
    ],
    // [userPermission, rows.length]
    [rows.length, pageNo, pageSize]
  );

  useEffect(() => {
    fetchAllInvoices();
  }, [search, pageSize, pageNo]);

  return (
    <>
      <CustomTable
        id={"done_payments"}
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
        apiForExcelPdf={getAllProcessPaymentPaid}
        customHeaderComponent={() => (
          <TableHeader
            userPermission={userPermission}
            setSearchText={setSearch}
            button={{
              show: false,
            }}
          />
        )}
        tableTitleComponent={
          <div>
            <UserPlus /> <strong>Done Payments</strong>
          </div>
        }
      />
    </>
  );
}
