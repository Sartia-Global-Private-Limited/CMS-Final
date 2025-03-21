import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ApproveOrReeligibleRetentions,
  getAllProcessPaymentForRO,
} from "../../../services/contractorApi";
import { toast } from "react-toastify";
import ConfirmAlert from "../../../components/ConfirmAlert";
import CustomTable from "../../../components/DataTable/CustomTable";
import { formatNumberToINR, serialNumber } from "../../../utils/helper";
import ActionButtons from "../../../components/DataTable/ActionButtons";
import { createColumnHelper } from "@tanstack/react-table";

export default function PaymentProcessInRO({ checkPermission }) {
  const [openConfirmAndId, setOpenConfirmAndId] = useState("");
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

  const fetchAllInvoices = async () => {
    const status = "1";
    const res = await getAllProcessPaymentForRO(
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

  const handleApproveReject = async () => {
    const sData = { id: openConfirmAndId, status: "1" };
    const res = await ApproveOrReeligibleRetentions(sData);
    if (res.status) {
      toast.success(res.message);
      setRows((prev) => prev.filter((itm) => itm.id !== openConfirmAndId));
      setTotalData({
        ...totalData,
        total: +totalData.total - 1,
        pageEndResult: totalData.pageEndResult - 1,
      });
    } else {
      toast.error(res.message);
    }
  };

  useEffect(() => {
    fetchAllInvoices();
  }, [search, pageNo, pageSize]);

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
        header: t("Payment unique id"),
        cell: (info) =>
          info.row.original?.unique_id ? info.row.original?.unique_id : "-",
      }),
      columnHelper.accessor("ro_name", {
        header: t("Ro name"),
        cell: (info) =>
          info.row.original?.ro_name ? info.row.original?.ro_name : "-",
      }),
      columnHelper.accessor("po_details", {
        header: t("Po Number"),
        cell: (info) =>
          info.row.original?.po_details?.po_number
            ? info.row.original?.po_details?.po_number
            : "-",
      }),
      columnHelper.accessor("amount", {
        header: t("Amount"),
        cell: (info) => formatNumberToINR(info.getValue()),
      }),
      columnHelper.accessor("action", {
        header: t("Action"),
        cell: (info) => (
          <ActionButtons
            actions={{
              view: {
                show: checkPermission?.view,
                action: () =>
                  navigate(
                    `/regional-office/view/${info.row.original?.id}`,
                    {}
                  ),
              },
              edit: {
                show: checkPermission?.update,
                tooltipTitle: "Create",
                action: () =>
                  navigate(`/regional-office/payment`, {
                    state: {
                      paid_amount: info.row.original?.amount,
                      po_id: info.row.original.po_details.po_id,
                      ro_id: info.row.original.ro_id,
                      id: info.row.original.id,
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
      <CustomTable
        id={"my_employee"}
        isLoading={isLoading}
        rows={rows || []}
        columns={columns}
        pagination={{
          pageNo,
          pageSize,
          totalData,
        }}
        hideFilters={false}
      />

      <ConfirmAlert
        size={"sm"}
        deleteFunction={handleApproveReject}
        hide={setOpenConfirmAndId}
        show={openConfirmAndId}
        title={"Confirm Re-eligible"}
        description={"Are you sure you want to convert this!!"}
      />
    </>
  );
}
