import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  getAllProcessPaymentPaid,
  resendOTPInPaymentPaid,
} from "../../../services/contractorApi";
import { toast } from "react-toastify";
import { HiChatBubbleBottomCenter } from "react-icons/hi2";
import { FiRepeat } from "react-icons/fi";
import ActionButtons from "../../../components/DataTable/ActionButtons";
import { formatNumberToINR, serialNumber } from "../../../utils/helper";
import CustomTable from "../../../components/DataTable/CustomTable";
import TableHeader from "../../../components/DataTable/TableHeader";
import { UserPlus } from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/auth/authSlice";

export default function PaymentProcess({ checkPermission }) {
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

  const fetchAllInvoices = async () => {
    const status = "1";
    const res = await getAllProcessPaymentPaid(
      status,
      pageSize,
      pageNo,
      search
    );

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
      columnHelper.accessor("action", {
        header: "Action",
        cell: (info) => (
          <ActionButtons
            actions={{
              view: {
                show: checkPermission?.view,
                action: () =>
                  navigate(`/payment-paid/view`, {
                    state: {
                      id: info.row.original?.id,
                    },
                  }),
              },
              edit: {
                show: checkPermission?.update,
                tooltipTitle: "Resend OTP",
                icon: FiRepeat,
                action: () =>
                  resendOtp(
                    info.row.original?.id,
                    info.row.original?.ro_id,
                    info.row.original?.manager_id
                  ),
              },
              delete: {
                show: checkPermission?.delete,
                tooltipTitle: "Verify OTP",
                icon: HiChatBubbleBottomCenter,
                action: () =>
                  navigate(`/payment-paid/otp-verify`, {
                    state: {
                      paid_amount: info.row.original?.amount,
                      manager_id: info.row.original?.manager_id,
                      ro_id: info.row.original?.ro_id,
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
    [checkPermission, rows.length, pageNo, pageSize]
  );

  useEffect(() => {
    fetchAllInvoices();
  }, []);

  const resendOtp = async (id, ro_id, manager_id) => {
    const sData = { id, ro_id, manager_id };

    const res = await resendOTPInPaymentPaid(sData);
    if (res.status) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };
  return (
    <>
      <CustomTable
        id={"payment_process"}
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
            userPermission={checkPermission}
            setSearchText={setSearch}
            button={{
              show: false,
            }}
          />
        )}
        tableTitleComponent={
          <div>
            <UserPlus /> <strong>Payment Process</strong>
          </div>
        }
      />
    </>
  );
}
