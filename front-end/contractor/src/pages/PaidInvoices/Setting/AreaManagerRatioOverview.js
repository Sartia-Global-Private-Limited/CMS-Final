import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { getAllPromotionalsetting } from "../../../services/contractorApi";
import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/auth/authSlice";
import ActionButtons from "../../../components/DataTable/ActionButtons";
import { UserPlus } from "lucide-react";
import TableHeader from "../../../components/DataTable/TableHeader";
import CustomTable from "../../../components/DataTable/CustomTable";
import { serialNumber } from "../../../utils/helper";

const AreaManagerRatioOverview = ({ checkPermission }) => {
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

  const fetchAllOverview = async () => {
    const res = await getAllPromotionalsetting(search, pageSize, pageNo);
    setIsLoading(true);
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
      columnHelper.accessor("manager_name", {
        header: "Area Manager",
        cell: (info) => info.getValue() || "-",
      }),
      columnHelper.accessor("manager_ratio", {
        header: t("Manager Ratio"),
        cell: (info) => info.getValue() || "-",
      }),
      columnHelper.accessor("company_ratio", {
        header: t("Company Ratio"),
        cell: (info) => info.getValue() || "-",
      }),
      columnHelper.accessor("action", {
        header: "Action",
        cell: (info) => (
          <ActionButtons
            actions={{
              edit: {
                show: checkPermission?.update,
                action: () =>
                  navigate(
                    `/setting/area-manager-ratio/${info.row.original.id}`
                  ),
              },
            }}
          />
        ),
      }),
    ],
    // [userPermission, rows.length]
    [checkPermission, rows.length, pageNo, pageSize]
  );

  useEffect(() => {
    fetchAllOverview();
  }, [search, pageNo, pageSize]);

  return (
    <CustomTable
      id={"area_manager_ratio_overview"}
      isLoading={isLoading}
      rows={rows || []}
      maxHeight="49vh"
      columns={columns}
      pagination={{
        pageNo,
        pageSize,
        totalData,
      }}
      excelAction={false}
      pdfAction={false}
      apiForExcelPdf={getAllPromotionalsetting}
      customHeaderComponent={() => (
        <TableHeader
          userPermission={checkPermission}
          setSearchText={setSearch}
          button={{
            noDrop: true,
            to: `/setting/area-manager-ratio/new`,
            title: "Create",
          }}
        />
      )}
      tableTitleComponent={
        <div>
          <UserPlus /> <strong>Area Manager Ratio Overview</strong>
        </div>
      }
    />
  );
};

export default AreaManagerRatioOverview;
