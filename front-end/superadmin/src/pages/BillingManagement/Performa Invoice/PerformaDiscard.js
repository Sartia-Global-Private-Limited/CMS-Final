import React, { useEffect, useMemo, useState } from "react";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import "react-best-tabs/dist/index.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ReactPagination from "../../../components/ReactPagination";
import ActionButton from "../../../components/ActionButton";
import Select from "react-select";
import {
  getAllBillNumber,
  getAllPerformaInvoice,
  getAllPoListInvoice,
  getAllRoListInvoice,
  getAllcomplaintInvoice,
} from "../../../services/contractorApi";
import FormLabelText from "../../../components/FormLabelText";
import { createColumnHelper } from "@tanstack/react-table";
import { selectUser } from "../../../features/auth/authSlice";
import { useSelector } from "react-redux";
import ActionButtons from "../../../components/DataTable/ActionButtons";
import { UserPlus } from "lucide-react";
import TableHeader from "../../../components/DataTable/TableHeader";
import CustomTable from "../../../components/DataTable/CustomTable";

const PerformaDiscard = () => {
  const columnHelper = createColumnHelper();
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { userPermission } = useSelector(selectUser);
  const [poId, setPoId] = useState("");
  const { t } = useTranslation();
  const [allBillNumber, setAllBillNumber] = useState([]);
  const [regionalOfficceId, setRegionalOfficeId] = useState({});
  const [allPo, setAllPo] = useState([]);
  const [allRegionalOffice, setAllRegionalOffice] = useState([]);
  const [billNumber, setBillNumber] = useState({});
  const [allComplaints, setAllComplaints] = useState([]);
  const [allPiNumber, setAllPiNumber] = useState([]);
  const [complaint_id, setComplaint_id] = useState("");

  const fetchExpenseRequestData = async () => {
    let status = 3;
    const res = await getAllPerformaInvoice({
      po_id: poId?.id,
      regional_office_id: regionalOfficceId.id,
      bill_number: complaint_id,
      pageSize,
      pageNo,
      search,
      status,
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

  const fetchAllPo = async () => {
    const status = 3;
    const res = await getAllPoListInvoice({ status });
    if (res.status) {
      setAllPo(res.data);
    } else {
      setAllPo([]);
    }
  };

  const fetchAllRegionalOffice = async () => {
    const status = 3;
    const res = await getAllRoListInvoice({ status });
    if (res.status) {
      setAllRegionalOffice(res.data);
    } else {
      setAllRegionalOffice([]);
    }
  };

  const fetchAllPINumber = async () => {
    const status = 3;

    const res = await getAllBillNumber(status);

    if (res.status) {
      setAllPiNumber(res.data);
    } else {
      setAllPiNumber([]);
    }
  };

  useEffect(() => {
    fetchAllPo();
    fetchAllRegionalOffice();
    fetchAllPINumber();
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    fetchExpenseRequestData();
  }, [pageNo, pageSize, poId, regionalOfficceId, complaint_id]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("sr_no", {
        header: "S.No",
        cell: (info) => info.row.index + 1,
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
      columnHelper.accessor("ro_name", {
        header: "billing regioanl office",
        cell: (info) => info.row.original.billing_to_ro_office?.ro_name,
      }),
      columnHelper.accessor("outlet_name", {
        header: "outlet name",
        cell: (info) => (
          <div>
            {info.row.original.outletDetails.length > 0
              ? info.row.original?.outletDetails?.map((item, idx) => (
                  <li> {item?.outlet_name ?? "--"}</li>
                ))
              : "--"}
          </div>
        ),
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
                  navigate(`/view-performa-invoice`, {
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
    [rows.length]
  );

  return (
    <div className="m-2">
      <div className="shadow p-2 rounded">
        <Row>
          <Col md={3}>
            <FormLabelText children={t("po number")} />
            <Select
              menuPortalTarget={document.body}
              options={allPo?.map((user) => ({
                label: user.po_number,
                value: user.id,
              }))}
              onChange={(e) => {
                setComplaint_id("");
                setRegionalOfficeId({});
                if (e) {
                  setPoId({ id: e?.value, name: e?.label });
                  fetchAllRegionalOffice(e?.value);
                } else {
                  setPoId({});
                }
              }}
              isClearable
            />
          </Col>

          <Col md={3}>
            <FormLabelText children={t("reional office")} />
            <Select
              menuPortalTarget={document.body}
              options={allRegionalOffice?.map((user) => ({
                label: user.regional_office_name,
                value: user.ro_id,
              }))}
              onChange={(e) => {
                if (e) {
                  setRegionalOfficeId({ id: e?.value, name: e?.label });
                } else setRegionalOfficeId({});
              }}
              isClearable
            />
          </Col>

          <Col md={3}>
            <FormLabelText children={t("Pi number")} />
            <Select
              menuPortalTarget={document.body}
              options={allPiNumber?.map((user) => ({
                label: user.bill_no,
                value: user.bill_no,
              }))}
              onChange={(e) => {
                setComplaint_id(e ? e?.value : null);
              }}
              isClearable
            />
          </Col>
        </Row>
      </div>
      <CustomTable
        id={"performa_invoice"}
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
            <UserPlus /> <strong> discard</strong>
          </div>
        }
      />
    </div>
  );
};

export default PerformaDiscard;

// <div className="table-scroll my-3">
//   <Table className="text-body bg-new Roles ">
//     <thead className="text-truncate">
//       <tr>
//         <th>{t("PI NUMBER")}</th>
//         <th>{t("PI DATE")}</th>
//         <th>{t("FINANCIAL YEAR")}</th>
//         <th>{t("BILLING REGIONAL OFFICE")}</th>
//         <th>{t("Outlet Name")}</th>

//         <th style={{ width: "fit-content" }}>{t("Complaint Id")}</th>
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
//           <td>
//             {data.outletDetails.length > 0
//               ? data?.outletDetails?.map((item, idx) => (
//                   <li> {item?.outlet_name ?? "--"}</li>
//                 ))
//               : "--"}
//           </td>
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
//                 navigate(`/view-performa-invoice`, {
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
