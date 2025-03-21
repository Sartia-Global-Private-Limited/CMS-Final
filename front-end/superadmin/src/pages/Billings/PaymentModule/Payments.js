import React, { useEffect, useMemo, useState } from "react";
import { Col, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmAlert from "../../../components/ConfirmAlert";
import {
  discardfinalInvoices,
  getAllFinalInvoices,
} from "../../../services/contractorApi";
import CustomTable, {
  selectable,
} from "../../../components/DataTable/CustomTable";
import TableHeader from "../../../components/DataTable/TableHeader";
import ActionButtons from "../../../components/DataTable/ActionButtons";
import { createColumnHelper } from "@tanstack/react-table";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/auth/authSlice";
import TooltipComponent from "../../../components/TooltipComponent";
import { CirclePlus } from "lucide-react";
import { serialNumber } from "../../../utils/helper";

export default function Payments() {
  const [showDiscard, setShowDiscard] = useState(false);
  const [discardDetails, setDiscardDetails] = useState("");
  const [refresh, setRefresh] = useState(false);

  const { t } = useTranslation();
  const navigate = useNavigate();
  const columnHelper = createColumnHelper();
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { userPermission } = useSelector(selectUser);

  const fetchAllInvoices = async () => {
    const res = await getAllFinalInvoices(pageSize, pageNo, search);
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

  const handleDiscard = async () => {
    const res = await discardfinalInvoices(discardDetails?.id);
    if (res.status) {
      toast.success(res.message);
      setRefresh((e) => !e);
    } else {
      toast.error(res.message);
    }
    setShowDiscard(false);
    setDiscardDetails("");
  };

  useEffect(() => {
    fetchAllInvoices();
  }, [refresh]);

  const columns = useMemo(
    () => [
      selectable,
      columnHelper.accessor("sr_no", {
        header: t("Sr No."),
        cell: (info) => {
          const serialNumbers = serialNumber(pageNo, pageSize);
          return serialNumbers[info.row.index];
        },
      }),
      columnHelper.accessor("bill_no", {
        header: t("Invoice Number"),
        cell: (info) =>
          info.row.original?.bill_no ? info.row.original?.bill_no : "--",
      }),
      columnHelper.accessor("invoice_date", {
        header: t("Invoice Date"),
        cell: (info) =>
          info.row.original?.invoice_date
            ? info.row.original?.invoice_date
            : "--",
      }),
      columnHelper.accessor("pi_bill", {
        header: t("PI NUMBER"),
        cell: (info) =>
          info.row.original?.pi_bill.map((pi, index) => (
            <span key={index}>{pi}</span>
          )),
      }),
      columnHelper.accessor("financial_year", {
        header: t("FINANCIAL YEAR"),
        cell: (info) =>
          info.row.original?.financial_year
            ? info.row.original?.financial_year
            : "--",
      }),
      columnHelper.accessor("billing_to_ro_office", {
        header: t("BILLING REGIONAL OFFICE"),
        cell: (info) =>
          info.row.original?.billing_to_ro_office?.ro_name
            ? info.row.original?.billing_to_ro_office?.ro_name
            : "--",
      }),
      columnHelper.accessor("billing_from", {
        header: t("Billing From"),
        cell: (info) => info.row.original?.billing_from?.company_name,
      }),
      columnHelper.accessor("billing_to", {
        header: t("Billing To"),
        cell: (info) => info.row.original?.billing_to?.company_name,
      }),
      columnHelper.accessor("complaintDetails", {
        header: t("Complaint Id"),
        cell: (info) =>
          info.row.original?.complaintDetails.map((item, index) => (
            <li key={index}>{item?.complaint_unique_id ?? "--"}</li>
          )) ?? "--",
      }),
      columnHelper.accessor("po_number", {
        header: t("po"),
        cell: (info) =>
          info.row.original?.po_number ? info.row.original?.po_number : "--",
      }),
      columnHelper.accessor("action", {
        header: t("Action"),
        cell: (info) => (
          <ActionButtons
            actions={{
              view: {
                show: true,
                action: () =>
                  navigate(`/payments/view-invoice`, {
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
    [rows.length, pageNo, pageSize]
  );

  return (
    <>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CustomTable
          id={"payments"}
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
              userPermission={userPermission}
              setSearchText={setSearch}
              button={{ show: false }}
              extraComponent={
                selectedRows?.info?.length > 0 && (
                  <TooltipComponent title={"create"} align="top">
                    <Button
                      variant="success"
                      onClick={() => {
                        navigate(`/payments/create`, {
                          state: {
                            selectedInvoices: selectedRows.info.map(
                              (itm) => itm.original.id
                            ),
                            data: rows,
                          },
                        });
                      }}
                    >
                      <CirclePlus size={16} className="me-1" />
                      {t("create Payment")}
                    </Button>
                  </TooltipComponent>
                )
              }
            />
          )}
          tableTitleComponent={
            <div>
              <strong>{t("payments")}</strong>
            </div>
          }
        />

        <ConfirmAlert
          size={"sm"}
          deleteFunction={handleDiscard}
          hide={setShowDiscard}
          show={showDiscard}
          title={"Confirm Discard"}
          description={"Are you sure you want to discard this!!"}
        />
      </Col>
    </>
  );
}
