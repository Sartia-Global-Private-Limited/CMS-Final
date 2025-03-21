import React, { useState, useEffect, useMemo } from "react";
import { getAllowancesPayroll } from "../../../services/authapi";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { createColumnHelper } from "@tanstack/react-table";
import TableHeader from "../../../components/DataTable/TableHeader";
import CustomTable from "../../../components/DataTable/CustomTable";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/auth/authSlice";
import { serialNumber } from "../../../utils/helper";

const PayRollAllowances = ({ checkPermission }) => {
  const [search, setSearch] = useState("");
  const columnHelper = createColumnHelper();
  const { t } = useTranslation();

  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { userPermission } = useSelector(selectUser);

  const fetchAllowancesData = async () => {
    const res = await getAllowancesPayroll(search, pageSize, pageNo);
    if (res.status) {
      setRows(res.data);
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
      columnHelper.accessor("name", {
        header: t("Name"),
      }),
      columnHelper.accessor("applied_type", {
        header: t("Applied Type"),
      }),
      columnHelper.accessor("value_type", {
        header: t("Value Type"),
      }),
      columnHelper.accessor("value", {
        header: t("Value"),
      }),
      columnHelper.accessor("applied_on", {
        header: t("Applied On"),
        cell: (info) =>
          info?.row?.original?.applied_on
            ? info?.row?.original?.applied_on?.map((itm, id2) => (
                <span key={itm?.id} className="d-block text-start">
                  <span className="fw-bold pe-1">{id2 + 1}.</span>
                  {itm?.name ? itm?.name : "-"}
                </span>
              ))
            : "-",
      }),
      columnHelper.accessor("created_at", {
        header: t("Created At"),
      }),
    ],
    [checkPermission, t, rows.length, pageNo, pageSize]
  );

  useEffect(() => {
    fetchAllowancesData();
  }, [pageSize, pageNo, search]);

  return (
    <div>
      <CustomTable
        id={"payroll_Allowances"}
        isLoading={isLoading}
        maxHeight={"40vh"}
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
            button={{
              show: false,
            }}
          />
        )}
      />
    </div>
  );
};

export default PayRollAllowances;
