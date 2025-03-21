import React, { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
  getAllPOTransactionById,
  getAllRegionalOfficeTransactionById,
} from "../../../services/contractorApi";
import { useTranslation } from "react-i18next";
import CardComponent from "../../../components/CardComponent";
import { Col } from "react-bootstrap";
import { formatNumberToINR } from "../../../utils/helper";
import { createColumnHelper } from "@tanstack/react-table";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/auth/authSlice";
import CustomTable from "../../../components/DataTable/CustomTable";
import TableHeader from "../../../components/DataTable/TableHeader";
import { UserPlus } from "lucide-react";

const ViewPOTransactions = () => {
  const { id } = useParams();
  const columnHelper = createColumnHelper();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { userPermission } = useSelector(selectUser);

  const fetchTransactionById = async () => {
    const res = await getAllPOTransactionById(search, pageSize, pageNo, id);
    setIsLoading(true);
    if (res.status) {
      setRows(res);
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
        header: "S.No",
        cell: (info) => info.row.index + 1,
      }),
      columnHelper.accessor("amount_received", {
        header: t("Total Received amount"),
        cell: (info) => formatNumberToINR(info.getValue()),
      }),
      columnHelper.accessor("balance", {
        header: t("Balance"),
        cell: (info) => formatNumberToINR(info.getValue()),
      }),
      columnHelper.accessor("status", {
        header: t("Payment Mode"),
        cell: (info) => info.getValue() || "-",
      }),
      columnHelper.accessor("transaction_id", {
        header: t("Transaction Id"),
        cell: (info) => info.getValue() || "-",
      }),
    ],
    // [userPermission, rows.length]
    [rows?.data?.length]
  );

  useEffect(() => {
    if (id) fetchTransactionById();
  }, []);

  return (
    <Col md={12}>
      <CardComponent showBackButton={true} title={"View Po Details"}>
        <div className="mb-3">
          <Col md={12}>
            <div className="p-20 shadow rounded h-100">
              <strong className="text-secondary">{t("Details")}</strong>
              <div className="mt-2">
                <table className="table-sm table">
                  <tbody>
                    <tr>
                      <th>{t("po number")} :</th>
                      <td>{rows?.getBalance?.po_number}</td>
                    </tr>
                    <tr>
                      <td colSpan={3}></td>
                      <td className="text-success text-end fw-semibold fs-6">
                        <span className="text-black">
                          {" "}
                          {t("Total Amount Received")} :
                        </span>{" "}
                        {formatNumberToINR(
                          rows?.getBalance?.total_received_non_credit
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={3}></td>
                      <td className="text-success text-end fw-semibold fs-6">
                        <span className="text-black"> {t("Balance")} : </span>
                        {formatNumberToINR(rows?.getBalance?.balance)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Col>
        </div>
        <CustomTable
          id={"purchase_order_transactions"}
          isLoading={isLoading}
          maxHeight="49vh"
          rows={rows?.data || []}
          columns={columns}
          pagination={{
            pageNo,
            pageSize,
            totalData,
          }}
          excelAction={false}
          pdfAction={false}
          apiForExcelPdf={getAllPOTransactionById}
          customHeaderComponent={() => (
            <TableHeader
              userPermission={userPermission}
              setSearchText={setSearch}
              button={{
                show: false,
              }}
            />
          )}
          tableTitleComponent={
            <div>
              <UserPlus /> <strong>Purchase order transactions</strong>
            </div>
          }
        />
      </CardComponent>
    </Col>
  );
};

export default ViewPOTransactions;
