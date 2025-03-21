import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAllFinalInvoicesListing } from "../../../services/contractorApi";
import { createColumnHelper } from "@tanstack/react-table";
import { selectUser } from "../../../features/auth/authSlice";
import { useSelector } from "react-redux";
import ActionButtons from "../../../components/DataTable/ActionButtons";
import TableHeader from "../../../components/DataTable/TableHeader";
import { UserPlus } from "lucide-react";
import CustomTable from "../../../components/DataTable/CustomTable";
import { serialNumber } from "../../../utils/helper";

export default function DiscardInvoices({ checkPermission }) {
  const { t } = useTranslation();
  const columnHelper = createColumnHelper();
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { userPermission } = useSelector(selectUser);
  const navigate = useNavigate();

  const fetchAllMergePI = async () => {
    let status = 2;
    const res = await getAllFinalInvoicesListing({
      status,
      pageSize,
      pageNo,
      search,
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
    fetchAllMergePI();
  }, [pageSize, pageNo, search]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("sr_no", {
        header: t("Sr No."),
        cell: (info) => {
          const serialNumbers = serialNumber(pageNo, pageSize);
          return serialNumbers[info.row.index];
        },
      }),
      columnHelper.accessor("bill_no", {
        header: "invoice number",
      }),
      columnHelper.accessor("invoice_date", {
        header: "invoice date",
      }),
      columnHelper.accessor("pi_bill", {
        header: "pi number",
        cell: (info) => (
          <div>
            {info.row.original?.pi_bill.map((pi) => (
              <li>{pi}</li>
            ))}
          </div>
        ),
      }),
      columnHelper.accessor("financial_year", {
        header: "financial year",
      }),
      columnHelper.accessor("billing_to_ro_office", {
        header: "billing regioanl office",
        cell: (info) => info.row.original.billing_to_ro_office?.ro_name,
      }),
      columnHelper.accessor("billing_from", {
        header: "billing from ",
        cell: (info) => info.row.original.billing_from?.company_name,
      }),
      columnHelper.accessor("billing_to", {
        header: "billing to ",
        cell: (info) => info.row.original.billing_to?.company_name,
      }),

      columnHelper.accessor("complaint_unique_id", {
        header: "complaint id",
        cell: (info) => (
          <div>
            {info.row.original.complaintDetails.length > 0
              ? info.row.original?.complaintDetails?.map((item, idx) => (
                  <li> {item?.complaint_unique_id ?? "--"}</li>
                ))
              : "--"}
          </div>
        ),
      }),
      columnHelper.accessor("po_number", {
        header: "po number",
      }),
      columnHelper.accessor("action", {
        header: "Action",
        cell: (info) => (
          <ActionButtons
            actions={{
              view: {
                show: checkPermission?.view,
                action: () =>
                  navigate(`/view-invoice`, {
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
    [checkPermission, rows.length, pageNo, pageSize]
  );

  return (
    <>
      <div className="m-2">
        <CustomTable
          id={"discard_invoice"}
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
              <UserPlus /> <strong> discard invoice</strong>
            </div>
          }
        />
      </div>
    </>
  );
}
