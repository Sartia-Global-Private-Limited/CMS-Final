import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  discardfinalInvoices,
  getAllPaymentRecievedListing,
  getAllPVNumber,
} from "../../../services/contractorApi";
import { toast } from "react-toastify";
import { Col, Row } from "react-bootstrap";
import Select from "react-select";
import FormLabelText from "../../../components/FormLabelText";
import { createColumnHelper } from "@tanstack/react-table";
import { selectUser } from "../../../features/auth/authSlice";
import { useSelector } from "react-redux";
import ActionButtons from "../../../components/DataTable/ActionButtons";
import { UserPlus } from "lucide-react";
import TableHeader from "../../../components/DataTable/TableHeader";
import CustomTable from "../../../components/DataTable/CustomTable";
import StatusChip from "../../../components/StatusChip";
import { serialNumber } from "../../../utils/helper";

export default function PaymentRecievedDone() {
  const { t } = useTranslation();
  const columnHelper = createColumnHelper();
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { userPermission } = useSelector(selectUser);
  const navigate = useNavigate();
  const [showDiscard, setShowDiscard] = useState(false);
  const [discardDetails, setDiscardDetails] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [allPvNumber, setAllPvNumber] = useState([]);
  const [pv_number, setPv_number] = useState("");

  const fetchAllInvoices = async () => {
    const status = "2";
    const res = await getAllPaymentRecievedListing({
      status,
      pageSize,
      pageNo,
      search,
      pv_number,
    });
    if (res.status) {
      setRows(res?.data);
      setTotalData(res?.pageDetails?.total);
    } else {
      setRows([]);
      setTotalData(0);
    }
    setIsLoading(false);
  };

  const fetchAllPVNumber = async () => {
    const status = "2";
    const res = await getAllPVNumber(status);

    if (res.status) {
      setAllPvNumber(res.data);
    } else {
      setAllPvNumber([]);
    }
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
    fetchAllPVNumber();
  }, [refresh, pv_number, pageSize, pageNo]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("sr_no", {
        header: t("Sr No."),
        cell: (info) => {
          const serialNumbers = serialNumber(pageNo, pageSize);
          return serialNumbers[info.row.index];
        },
      }),
      columnHelper.accessor("payment_unique_id", {
        header: "payment unique id",
      }),
      columnHelper.accessor("invoice_number", {
        header: "invoice number",
      }),
      columnHelper.accessor("invoice_date", {
        header: "invoice date",
        cell: (info) => (
          <div>{info.row.original?.invoice_date.split("T")[0] ?? "--"}</div>
        ),
      }),
      columnHelper.accessor("pv_number", {
        header: "pv number",
      }),
      columnHelper.accessor("amount_received", {
        header: "received amount",
      }),
      columnHelper.accessor("status", {
        header: "status",
        cell: (info) => <StatusChip status={"done"} />,
      }),
      columnHelper.accessor("action", {
        header: "Action",
        cell: (info) => (
          <ActionButtons
            actions={{
              view: {
                show: true,
                action: () =>
                  navigate(`/payments/view-recieved-payments`, {
                    state: {
                      id: info.row.original?.id,
                    },
                  }),
              },
              edit: {
                show: true,
                action: () =>
                  navigate(`/payments/create`, {
                    state: {
                      selectedInvoices: [info.row.original.id],
                      type: "update",
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
      <div className="m-2">
        <div className="shadow p-2 rounded">
          <Row className="g-2 align-items-end">
            <Col md={3}>
              <FormLabelText children={"select pv number"} />
              <Select
                placeholder={t("select PV Number")}
                menuPortalTarget={document.body}
                options={allPvNumber.map((data) => ({
                  label: data.pv_number,
                  value: data.pv_number,
                }))}
                onChange={(e) => {
                  setPv_number(e ? e.value : "");
                }}
                isClearable
              />
            </Col>
          </Row>
        </div>
        <CustomTable
          id={"payment_done"}
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
          status={2}
          apiForExcelPdf={getAllPaymentRecievedListing}
          customHeaderComponent={() => (
            <TableHeader
              userPermission={userPermission}
              setSearchText={setSearch}
              button={{ show: false }}
            />
          )}
          tableTitleComponent={
            <div>
              <UserPlus /> <strong>done payment</strong>
            </div>
          }
        />
      </div>
    </>
  );
}
