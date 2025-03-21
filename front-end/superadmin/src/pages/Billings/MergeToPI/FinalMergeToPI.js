import React, { useEffect, useMemo, useState } from "react";
import { Button } from "react-bootstrap";
import ConfirmAlert from "../../../components/ConfirmAlert";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  discardfinalMergedPI,
  getAllMergedToPiListing,
  getDetailsOfFinalMergeToPI,
} from "../../../services/contractorApi";
import { toast } from "react-toastify";
import TooltipComponent from "../../../components/TooltipComponent";
import { FcCancel } from "react-icons/fc";
import { FaRegFilePdf } from "react-icons/fa";
import ActionButtons from "../../../components/DataTable/ActionButtons";
import { UserPlus } from "lucide-react";
import TableHeader from "../../../components/DataTable/TableHeader";
import CustomTable from "../../../components/DataTable/CustomTable";
import { createColumnHelper } from "@tanstack/react-table";
import { selectUser } from "../../../features/auth/authSlice";
import { useSelector } from "react-redux";
import { serialNumber } from "../../../utils/helper";
import { useTranslation } from "react-i18next";

export default function FinalMergeToPI() {
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
  const { t } = useTranslation();
  const navigate = useNavigate();

  const fetchAllMergePI = async () => {
    let status = 4;
    const res = await getAllMergedToPiListing({
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
    const sData = {
      id: discardDetails.id,
      merged_pi_id: discardDetails.merged_pi_id,
    };
    // return console.log(sData, "sdata");
    const res = await discardfinalMergedPI(sData);
    if (res.status) {
      toast.success(res.message);
      setRefresh((e) => !e);
    } else {
      toast.error(res.message);
    }
    setShowDiscard(false);
    setDiscardDetails("");
  };

  const HandleDownloadPdf = async (id) => {
    setLoading(id);
    const pdf = 1;
    const response = await getDetailsOfFinalMergeToPI(id, pdf);
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

  useEffect(() => {
    fetchAllMergePI();
  }, [refresh]);

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
                  navigate(`/view-merge-to-pi`, {
                    state: {
                      id: info.row.original?.id,
                    },
                  }),
              },
            }}
            custom={
              <>
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
                <TooltipComponent align="left" title={"discard"}>
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
      <div className="m-2">
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
          excelAction={() => ""}
          pdfAction={() => ""}
          status={4}
          apiForExcelPdf={getAllMergedToPiListing}
          customHeaderComponent={() => (
            <TableHeader
              userPermission={userPermission}
              setSearchText={setSearch}
              button={{ show: false }}
            />
          )}
          tableTitleComponent={
            <div>
              <UserPlus /> <strong> final</strong>
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

// <div className="table-scroll my-2  ">
//   <Table className="text-body Roles">
//     <thead className="text-truncate">
//       <tr>
//         <th>{t("PI NUMBER")}</th>
//         <th>{t("PI DATE")}</th>
//         <th>{t("FINANCIAL YEAR")}</th>
//         <th>{t("BILLING REGIONAL OFFICE")}</th>
//         <th>{t("Billing From")}</th>
//         <th>{t("Billing To")}</th>

//         <th style={{ minWidth: "160px" }}>{t("Complaint Id")}</th>
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
//                 navigate(`/view-merge-to-pi`, {
//                   state: {
//                     id: data?.id,
//                   },
//                 })
//               }
//               hideEdit={"d-none"}
//               custom={
//                 <>
//                   <TooltipComponent align="left" title={"PDF"}>
//                     <Button
//                       className={`view-btn`}
//                       variant="light"
//                       disabled={loading == data.id}
//                       onClick={() => {
//                         HandleDownloadPdf(data.id);
//                       }}
//                     >
//                       <FaRegFilePdf
//                         className={`social-btn  ${
//                           loading == data.id ? "" : "red-combo"
//                         }`}
//                       />
//                     </Button>
//                   </TooltipComponent>
//                   <TooltipComponent align="left" title={"discard"}>
//                     <Button
//                       className={`view-btn`}
//                       variant="light"
//                       onClick={() => {
//                         setShowDiscard(true);
//                         setDiscardDetails(data);
//                       }}
//                     >
//                       <FcCancel className={`social-btn red-combo`} />
//                     </Button>
//                   </TooltipComponent>
//                 </>
//               }
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

//   <ConfirmAlert
//     size={"sm"}
//     deleteFunction={handleDiscard}
//     hide={setShowDiscard}
//     show={showDiscard}
//     title={"Confirm Discard"}
//     description={"Are you sure you want to discard this!!"}
//   />
// </div>
