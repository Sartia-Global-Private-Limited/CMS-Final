import React, { useEffect, useMemo, useState } from "react";
import { getAllSalesOrder } from "../../services/contractorApi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { createColumnHelper } from "@tanstack/react-table";
import { selectUser } from "../../features/auth/authSlice";
import { useSelector } from "react-redux";
import ActionButtons from "../../components/DataTable/ActionButtons";
import CustomTable from "../../components/DataTable/CustomTable";
import TableHeader from "../../components/DataTable/TableHeader";
import { ShieldCheck } from "lucide-react";
import { serialNumber } from "../../utils/helper";
import { useTranslation } from "react-i18next";

const SecurityDeposit = ({ checkPermission }) => {
  const columnHelper = createColumnHelper();
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const { userPermission } = useSelector(selectUser);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const fetchSecurityDepositData = async () => {
    const so_status = 1;
    const status = "";
    const res = await getAllSalesOrder({
      search,
      pageSize,
      pageNo,
      status,
      so_status,
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

  useEffect(() => {
    fetchSecurityDepositData();
  }, [search, pageNo, pageSize]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("sr_no", {
        header: t("Sr No."),
        cell: (info) => {
          const serialNumbers = serialNumber(pageNo, pageSize);
          return serialNumbers[info.row.index];
        },
      }),
      columnHelper.accessor("so_number", {
        header: "so number",
      }),
      columnHelper.accessor("tender_date", {
        header: "tender date",
      }),
      columnHelper.accessor("tender_number", {
        header: "tender number",
      }),
      columnHelper.accessor("security_deposit_date", {
        header: "security deposit date",
      }),
      columnHelper.accessor("security_deposit_amount", {
        header: "security deposit amount",
      }),
      columnHelper.accessor("regional_office_name", {
        header: " regional office name",
      }),

      columnHelper.accessor("status", {
        header: "status",
        cell: (info) => <div className={`text-${"green"}`}>Deposit</div>,
      }),
      columnHelper.accessor("action", {
        header: "Action",
        cell: (info) => (
          <ActionButtons
            actions={{
              view: {
                show: checkPermission?.view,
                action: () =>
                  navigate(`/sales-Order/security-deposit/view`, {
                    state: {
                      id: info.row.original.id,
                    },
                  }),
              },
            }}
          />
        ),
      }),
    ],
    [checkPermission, t, rows.length, pageNo, pageSize]
  );

  return (
    <>
      <Helmet>
        <title>Security Deposit · CMS Electricals</title>
      </Helmet>

      <CustomTable
        maxHeight="44vh"
        id={"security_deposit"}
        checkPermission={checkPermission}
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
            checkPermission={checkPermission}
            setSearchText={setSearch}
            button={{
              show: false,
            }}
          />
        )}
        tableTitleComponent={
          <div>
            <ShieldCheck /> <strong>security deposit</strong>
          </div>
        }
      />
    </>
  );
};

export default SecurityDeposit;
