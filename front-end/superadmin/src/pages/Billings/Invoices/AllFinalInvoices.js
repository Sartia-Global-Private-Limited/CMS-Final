import React, { useEffect, useMemo, useState } from "react";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FcCancel } from "react-icons/fc";
import TooltipComponent from "../../../components/TooltipComponent";
import {
  discardfinalInvoices,
  getAllFinalInvoicesListing,
  getInvoiceDetails,
} from "../../../services/contractorApi";
import { FaRegFilePdf } from "react-icons/fa";
import { createColumnHelper } from "@tanstack/react-table";
import ActionButtons from "../../../components/DataTable/ActionButtons";
import { UserPlus } from "lucide-react";
import TableHeader from "../../../components/DataTable/TableHeader";
import CustomTable from "../../../components/DataTable/CustomTable";
import { selectUser } from "../../../features/auth/authSlice";
import { useSelector } from "react-redux";
import ConfirmAlert from "../../../components/ConfirmAlert";
import { serialNumber } from "../../../utils/helper";

export default function AllFinalInvoices() {
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
  const [showDiscard, setShowDiscard] = useState(false);
  const [discardDetails, setDiscardDetails] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchAllMergePI = async () => {
    const status = 1;
    const res = await getAllFinalInvoicesListing({
      status,
      pageSize,
      pageNo,
      search,
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
    fetchAllMergePI();
  }, [refresh]);

  const HandleDownloadPdf = async (id) => {
    setLoading(id);
    const pdf = 1;
    const response = await getInvoiceDetails(id, pdf);
    if (response.status) {
      toast.success(response.message);

      const filePath = response.path;
      const fileUrl = `${process.env.REACT_APP_API_URL}${filePath}`;
      window.open(fileUrl, "_blank");
    } else {
      toast.error(response.message);
    }
    setLoading("");
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
                show: true,
                action: () =>
                  navigate(`/view-invoice`, {
                    state: {
                      id: info.row.original?.id,
                    },
                  }),
              },
              edit: {
                show: true,
                action: () =>
                  navigate(`/Invoice/CreateInvoice/${info.row.original.id}`),
              },
            }}
            custom={
              <>
                <div className="vr hr-shadow"></div>
                <TooltipComponent align="left" title={"PDF"}>
                  <Button
                    className={`view-btn`}
                    variant="light"
                    disabled={loading == info.row.original.id}
                    onClick={() => {
                      HandleDownloadPdf(info.row.original.id);
                    }}
                  >
                    <FaRegFilePdf
                      className={`social-btn  ${
                        loading == info.row.original.id ? "" : "red-combo"
                      }`}
                    />
                  </Button>
                </TooltipComponent>
                <div className="vr hr-shadow"></div>
                <TooltipComponent align="left" title={t("discard")}>
                  <Button
                    className={`view-btn`}
                    variant="light"
                    onClick={() => {
                      setShowDiscard(true);
                      setDiscardDetails(info.row.original);
                    }}
                  >
                    <FcCancel className={`social-btn red-combo`} />
                  </Button>
                </TooltipComponent>
              </>
            }
          />
        ),
      }),
    ],
    [rows.length, pageNo, pageSize]
  );

  return (
    <>
      <div className="m-3">
        <CustomTable
          id={"final_invoice"}
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
          status={1}
          apiForExcelPdf={getAllFinalInvoicesListing}
          customHeaderComponent={() => (
            <TableHeader
              userPermission={userPermission}
              setSearchText={setSearch}
              button={{ show: false }}
            />
          )}
          tableTitleComponent={
            <div>
              <UserPlus /> <strong> final invoice</strong>
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
      </div>
    </>
  );
}
