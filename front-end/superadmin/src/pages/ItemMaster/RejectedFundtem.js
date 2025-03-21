import React, { useMemo } from "react";
import { useState } from "react";
import "react-best-tabs/dist/index.css";
import { Col } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ItemDetail, UserDetail } from "../../components/ItemDetail";
import { getAdminAllSurveyItemMaster } from "../../services/authapi";
import StatusChip from "../../components/StatusChip";
import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import TableHeader from "../../components/DataTable/TableHeader";
import CustomTable from "../../components/DataTable/CustomTable";
import ActionButtons from "../../components/DataTable/ActionButtons";
import { serialNumber } from "../../utils/helper";

const RejectedFundtem = () => {
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
  const { userPermission } = useSelector(selectUser);

  const fetchFundItemsData = async () => {
    const status = 2;
    const category = "fund";
    const res = await getAdminAllSurveyItemMaster({
      search,
      pageSize,
      pageNo,
      status,
      category,
    });
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
    fetchFundItemsData();
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
        header: t("Item"),
        cell: (info) => (
          <ItemDetail
            img={info.row.original?.image}
            name={info.row.original?.name}
            unique_id={info.row.original?.unique_id}
          />
        ),
      }),
      columnHelper.accessor("qty", {
        header: t("Qty"),
        cell: (info) => (info.row.original?.qty ? info.row.original?.qty : "-"),
      }),
      columnHelper.accessor("hsncode", {
        header: t("hsn code"),
        cell: (info) =>
          info.row.original?.hsncode ? info.row.original?.hsncode : "-",
      }),
      columnHelper.accessor("supplier_name", {
        header: t("supplier name"),
        cell: (info) => (
          <UserDetail
            img={info.row.original?.supplier_image}
            name={info.row.original?.supplier_name}
            id={info.row.original?.supplier_id}
            unique_id={info.row.original?.supplier_id}
          />
        ),
      }),
      columnHelper.accessor("sub_category", {
        header: t("sub category"),
        cell: (info) =>
          info.row.original?.sub_category
            ? info.row.original?.sub_category
            : "-",
      }),
      columnHelper.accessor("unit_name", {
        header: t("unit"),
        cell: (info) =>
          info.row.original?.unit_name ? info.row.original?.unit_name : "-",
      }),
      columnHelper.accessor("rejected", {
        header: t("status"),
        cell: () => <StatusChip status="Rejected" />,
      }),
      columnHelper.accessor("action", {
        header: t("Action"),
        cell: (info) => (
          <ActionButtons
            actions={{
              view: {
                show: true,
                action: () =>
                  navigate(`/ItemMaster/view`, {
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
      <Helmet>
        <title>Fund Item · CMS Electricals</title>
      </Helmet>

      <Col md={12} data-aos={"fade-up"}>
        <CustomTable
          id={"rejected_fund_item"}
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
              permissions={true}
            />
          )}
        />
      </Col>
    </>
  );
};

export default RejectedFundtem;
