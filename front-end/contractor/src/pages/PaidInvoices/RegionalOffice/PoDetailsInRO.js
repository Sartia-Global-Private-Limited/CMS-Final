import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { getAllPurchaseOrderListingInPayment } from "../../../services/contractorApi";
import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/auth/authSlice";
import ActionButtons from "../../../components/DataTable/ActionButtons";
import { UserPlus } from "lucide-react";
import TableHeader from "../../../components/DataTable/TableHeader";
import CustomTable from "../../../components/DataTable/CustomTable";
import {
  formatNumberToINR,
  getDateValue,
  serialNumber,
} from "../../../utils/helper";

const PoDetailsInRO = ({ checkPermission }) => {
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
    const res = await getAllPurchaseOrderListingInPayment(
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
      columnHelper.accessor("po_number", {
        header: t("Po number"),
        cell: (info) => info.getValue() || "-",
      }),
      columnHelper.accessor("po_date", {
        header: t("po date"),
        cell: (info) => getDateValue(info.getValue()),
      }),
      columnHelper.accessor("total_paid_amount", {
        header: t("Total paid amount"),
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
                  navigate(`/payment-paid/po-view`, {
                    state: {
                      id: info.row.original.po_id,
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
    fetchAllTransactions();
  }, [search, pageNo, pageSize]);

  return (
    <CustomTable
      id={"po_details"}
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
      apiForExcelPdf={getAllPurchaseOrderListingInPayment}
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
          <UserPlus /> <strong>Po Details</strong>
        </div>
      }
    />
  );
};

export default PoDetailsInRO;
