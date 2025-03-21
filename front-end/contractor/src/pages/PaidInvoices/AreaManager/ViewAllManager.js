import React, { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getAllAreaManagerTransactionById } from "../../../services/contractorApi";
import { useTranslation } from "react-i18next";
import CardComponent from "../../../components/CardComponent";
import { Col } from "react-bootstrap";
import { formatNumberToINR, getDateValue } from "../../../utils/helper";
import { createColumnHelper } from "@tanstack/react-table";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/auth/authSlice";
import CustomTable from "../../../components/DataTable/CustomTable";
import TableHeader from "../../../components/DataTable/TableHeader";
import { UserPlus } from "lucide-react";
import StatusChip from "../../../components/StatusChip";

const ViewAllManager = () => {
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
    const res = await getAllAreaManagerTransactionById(
      search,
      pageSize,
      pageNo,
      id
    );
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
      columnHelper.accessor("balance", {
        header: t("Balance"),
        cell: (info) => formatNumberToINR(info.getValue()),
      }),
      columnHelper.accessor("received_amount", {
        header: t("Received Amount"),
        cell: (info) => formatNumberToINR(info.getValue()),
      }),
      columnHelper.accessor("status", {
        header: t("Status"),
        cell: (info) => <StatusChip status={info.getValue()} />,
      }),
      columnHelper.accessor("otp", {
        header: t("OTP"),
      }),
      columnHelper.accessor("transaction_id", {
        header: t("Transaction Id"),
      }),
      columnHelper.accessor("date", {
        header: t("Date"),
        cell: (info) => getDateValue(info.getValue()),
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
      <CardComponent showBackButton={true} title={"View Area Manager Details"}>
        <div className="mb-3">
          <Col md={12}>
            <div className="p-20 shadow rounded h-100">
              <strong className="text-secondary">{t("Details")}</strong>
              <div className="mt-2">
                <table className="table-sm table">
                  <tbody>
                    <tr>
                      <th>{t("Area Manager Name")} :</th>
                      <td>{rows?.getBalance?.name}</td>
                    </tr>
                    <tr>
                      <th>{t("Employee Id")} :</th>
                      <td>{rows?.getBalance?.employee_id}</td>
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
          id={"view_area_manager"}
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
          apiForExcelPdf={getAllAreaManagerTransactionById}
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
              <UserPlus /> <strong>Area Manager Transactions</strong>
            </div>
          }
        />
      </CardComponent>
    </Col>
  );
};

export default ViewAllManager;
