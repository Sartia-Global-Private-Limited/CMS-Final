import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { getAllEmployeePromotionDemotion } from "../../../../services/authapi";
import { useTranslation } from "react-i18next";
import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../../../features/auth/authSlice";
import ActionButtons from "../../../../components/DataTable/ActionButtons";
import TableHeader from "../../../../components/DataTable/TableHeader";
import CustomTable from "../../../../components/DataTable/CustomTable";
import { serialNumber } from "../../../../utils/helper";
import { UserDetail } from "../../../../components/ItemDetail";

const EmployeePromotionDemotion = ({ checkPermission }) => {
  const columnHelper = createColumnHelper();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useSelector(selectUser);

  const fetchEmployeePromotionData = async () => {
    const res = await getAllEmployeePromotionDemotion(search, pageSize, pageNo);
    if (res.status) {
      setRows(res.data);
      setTotalData(res?.pageDetails?.total);
    } else {
      setRows([]);
      setTotalData(0);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchEmployeePromotionData();
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
      columnHelper.accessor("name", {
        header: t("Employee"),
        cell: (info) => (
          <UserDetail
            img={info.row.original?.image}
            name={info.row.original?.name}
            id={info.row.original?.user_id}
            unique_id={info.row.original?.employee_id}
            login_id={user.id}
          />
        ),
      }),
      columnHelper.accessor("purpose", {
        header: t("Purpose"),
      }),
      columnHelper.accessor("reason", {
        header: t("Reason"),
      }),
      columnHelper.accessor("change_in_salary", {
        header: t("Change in Salary"),
      }),
      columnHelper.accessor("change_in_salary_type", {
        header: t("Change in Salary Type"),
      }),
      columnHelper.accessor("change_in_salary_value", {
        header: t("Change in Salary Value"),
        cell: (info) => (
          <span>
            {info.row.original.change_in_salary_type == "amount" ? "₹ " : null}
            {info.row.original.change_in_salary_value}
            {info.row.original.change_in_salary_type == "percentage"
              ? " %"
              : null}
          </span>
        ),
      }),
      columnHelper.accessor("action", {
        header: t("Action"),
        cell: (info) => (
          <ActionButtons
            actions={{
              view: {
                show: checkPermission?.view,
                action: () =>
                  navigate(
                    `/EmployeePromotionDemotion/view/${info.row.original.id}`
                  ),
              },
              edit: {
                show: checkPermission?.update,
                action: () =>
                  navigate(
                    `/EmployeePromotionDemotion/AddEmployeePromotionDemotion/${info.row.original?.id}`
                  ),
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
        <title>All Employee Promotion Demotion · CMS Electricals</title>
      </Helmet>

      <CustomTable
        id={"my_employee"}
        userPermission={checkPermission}
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
            userPermission={checkPermission}
            setSearchText={setSearch}
            button={{
              noDrop: true,
              to: `/EmployeePromotionDemotion/AddEmployeePromotionDemotion/new`,
              title: "Create",
            }}
          />
        )}
        tableTitleComponent={
          <div>
            <strong>All Employee Promotion Demotion</strong>
          </div>
        }
      />
    </>
  );
};

export default EmployeePromotionDemotion;
