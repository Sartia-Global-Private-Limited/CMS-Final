import React, { useEffect, useMemo, useState } from "react";
import { Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAllMergeInvoice } from "../../../services/contractorApi";
import ActionButton from "../../../components/ActionButton";
import ReactPagination from "../../../components/ReactPagination";
import ActionButtons from "../../../components/DataTable/ActionButtons";
import { createColumnHelper } from "@tanstack/react-table";
import { selectUser } from "../../../features/auth/authSlice";
import { useSelector } from "react-redux";
import { UserPlus } from "lucide-react";
import TableHeader from "../../../components/DataTable/TableHeader";
import CustomTable from "../../../components/DataTable/CustomTable";
import { serialNumber } from "../../../utils/helper";

export default function DiscardMergeInvoices() {
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
    let status = 2;
    const res = await getAllMergeInvoice({
      merged_invoice_status: status,
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

  useEffect(() => {
    fetchAllMergePI();
  }, []);

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
        header: "pi number",
      }),
      columnHelper.accessor("created_at", {
        header: "pi date",
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
                  navigate(`/view-merge-invoice`, {
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
      <div className="p-3">
        <CustomTable
          id={"final_merge_pi"}
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
      </div>
    </>
  );
}

// <div className="table-scroll my-2  ">
//   <Table className="text-body Roles">
//     <thead className="text-truncate">
//       <tr>
//         <th>{t("Invoice NUMBER")}</th>
//         <th>{t("Invoice DATE")}</th>
//         <th>{t("FINANCIAL YEAR")}</th>
//         <th>{t("BILLING REGIONAL OFFICE")}</th>
//         <th>{t("Billing From")}</th>
//         <th>{t("Billing To")}</th>
//         <th style={{ minWidth: "150px" }}>{t("Complaint Id")}</th>
//         <th>{t("po")}</th>
//         <th>{t("Action")}</th>
//       </tr>
//     </thead>
//     <tbody>
//       {allComplaints?.length > 0 ? null : (
//         <tr>
//           <td colSpan={12}>
//             <img
//               className="p-3"
//               alt="no-result"
//               width="210"
//               src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
//             />
//           </td>
//         </tr>
//       )}

//       {allComplaints?.map((data, id1) => (
//         <tr key={id1 + 1}>
//           <td>{data?.bill_no ?? "--"}</td>
//           <td>{data?.created_at ?? "--"}</td>
//           <td>{data?.financial_year ?? "--"}</td>
//           <td>{data?.billing_to_ro_office?.ro_name ?? "--"}</td>
//           <td>{data.billing_from.company_name}</td>
//           <td>{data?.billing_to?.company_name}</td>

//           <td>
//             {data?.complaintDetails?.map((item, idx) => (
//               <li> {item?.complaint_unique_id ?? "--"}</li>
//             )) ?? "--"}
//           </td>
//           <td>{data?.po_number ?? "--"}</td>

//           <td>
//             <ActionButton
//               hideDelete={"d-none"}
//               eyeOnclick={() =>
//                 navigate(`/view-merge-invoice`, {
//                   state: {
//                     id: data?.id,
//                   },
//                 })
//               }
//               hideEdit={"d-none"}
//             />
//           </td>
//         </tr>
//       ))}
//     </tbody>
//     <tfoot>
//       <td colSpan={10}>
//         <ReactPagination
//           pageSize={pageSize}
//           prevClassName={
//             pageNo === 1 ? "danger-combo-disable pe-none" : "red-combo"
//           }
//           nextClassName={
//             pageSize == pageDetail?.total
//               ? allComplaints.length - 1 < pageSize
//                 ? "danger-combo-disable pe-none"
//                 : "success-combo"
//               : allComplaints.length < pageSize
//               ? "danger-combo-disable pe-none"
//               : "success-combo"
//           }
//           title={`Showing ${pageDetail?.pageStartResult || 0} to ${
//             pageDetail?.pageEndResult || 0
//           } of ${pageDetail?.total || 0}`}
//           handlePageSizeChange={handlePageSizeChange}
//           prevonClick={() => setPageNo(pageNo - 1)}
//           nextonClick={() => setPageNo(pageNo + 1)}
//         />
//       </td>
//     </tfoot>
//   </Table>
// </div>
