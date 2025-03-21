import React, { useEffect, useMemo, useState } from "react";
import { getStockTransactionOfSupplier } from "../../services/contractoApi2";
import { getAllSuppliers } from "../../services/contractorApi";
import { useTranslation } from "react-i18next";
import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import CustomTable from "../../components/DataTable/CustomTable";
import TableHeader from "../../components/DataTable/TableHeader";
import { UserPlus } from "lucide-react";
import { FilterSelect } from "../../components/FilterSelect";
import { serialNumber } from "../../utils/helper";

export default function StockTransactionSupplier({ checkPermission }) {
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
  const [employeeId, setEmployeeId] = useState("");
  const [suppliersData, setSuppliersData] = useState([]);

  useEffect(() => {
    fetchSuppliersData();
  }, []);

  useEffect(() => {
    getAccountBalance();
  }, [employeeId.value, pageSize, pageNo, search]);

  const fetchSuppliersData = async () => {
    const isDropdown = "true";
    const res = await getAllSuppliers({ isDropdown, isTransactions: true });
    if (res.status) {
      const rData = res?.data.map((itm) => {
        return {
          value: itm.id,
          label: itm.supplier_name,
        };
      });
      setSuppliersData(rData);
    } else {
      setSuppliersData([]);
    }
  };

  const getAccountBalance = async () => {
    const res = await getStockTransactionOfSupplier(employeeId.value, {
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

  const columns = useMemo(
    () => [
      columnHelper.accessor("sr_no", {
        header: t("Sr No."),
        cell: (info) => {
          const serialNumbers = serialNumber(pageNo, pageSize);
          return serialNumbers[info.row.index];
        },
      }),
      columnHelper.accessor("supplier_name", {
        header: "supplier name",
      }),
      columnHelper.accessor("supplier_id", {
        header: "supplier ID",
      }),
      columnHelper.accessor("bill_number", {
        header: "bill number",
      }),
      columnHelper.accessor("total_transfer_amount", {
        header: "total transfer amount",
      }),
      columnHelper.accessor("bill_date", {
        header: "bill date",
      }),
    ],
    [checkPermission, rows.length, pageNo, pageSize]
  );

  return (
    <div>
      <>
        <FilterSelect
          data={[
            {
              id: employeeId,
              setId: setEmployeeId,
              title: "supplier",
              data: suppliersData,
              hyperText: "Please select supplier",
            },
          ]}
        />

        <CustomTable
          id={"stock_balance_overview"}
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
          employeeId={employeeId.value}
          apiForExcelPdf={getStockTransactionOfSupplier}
          customHeaderComponent={() => (
            <TableHeader
              userPermission={checkPermission}
              setSearchText={setSearch}
              button={{ show: false }}
            />
          )}
          tableTitleComponent={
            <div>
              <UserPlus /> <strong>suppliers</strong>
            </div>
          }
        />
      </>
    </div>
  );
}
