import React, { useMemo } from "react";
import { useState } from "react";
import { Col } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ItemDetail } from "../../components/ItemDetail";
import {
  AdminDeleteSurveyItemMaster,
  getAdminAllSurveyItemMaster,
} from "../../services/authapi";
import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate, useSearchParams } from "react-router-dom";
import TableHeader from "../../components/DataTable/TableHeader";
import CustomTable from "../../components/DataTable/CustomTable";
import ActionButtons from "../../components/DataTable/ActionButtons";
import { serialNumber } from "../../utils/helper";
import ConfirmAlert from "../../components/ConfirmAlert";
import { toast } from "react-toastify";

const AllFundItem = ({ checkPermission }) => {
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
  const [showAlert, setShowAlert] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");

  const fetchFundItemsData = async () => {
    const category = "fund";
    const res = await getAdminAllSurveyItemMaster({
      search,
      pageSize,
      pageNo,
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

  const handleDelete = async () => {
    const res = await AdminDeleteSurveyItemMaster(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setRows((prev) => prev.filter((itm) => itm.id !== +idToDelete));
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
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
      // columnHelper.accessor("supplier_name", {
      //   header: t("supplier name"),
      //   cell: (info) => (
      //     <UserDetail
      //       img={info.row.original?.supplier_image}
      //       name={info.row.original?.supplier_name}
      //       id={info.row.original?.supplier_id}
      //       unique_id={info.row.original?.supplier_id}
      //     />
      //   ),
      // }),
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
      columnHelper.accessor("action", {
        header: t("Action"),
        cell: (info) => (
          <ActionButtons
            actions={{
              view: {
                show: checkPermission?.view,
                action: () =>
                  navigate(`/ItemMaster/view`, {
                    state: {
                      id: info.row.original?.id,
                    },
                  }),
              },
              edit: {
                show: checkPermission?.update,
                action: () =>
                  navigate(
                    `/ItemMaster/add-item-master/${info.row.original.id}`
                  ),
              },
              delete: {
                show: checkPermission?.delete,
                action: () => {
                  setIdToDelete(info.row.original.id);
                  setShowAlert(true);
                },
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
        <title>Fund Item · CMS Electricals</title>
      </Helmet>

      <Col md={12} data-aos={"fade-up"}>
        <CustomTable
          id={"all_fund_item"}
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
                show: false,
              }}
            />
          )}
          tableTitleComponent={
            <div>
              <strong>fund item</strong>
            </div>
          }
        />

        <ConfirmAlert
          size={"sm"}
          deleteFunction={handleDelete}
          hide={setShowAlert}
          show={showAlert}
          title={"Confirm Delete"}
          description={"Are you sure you want to delete this!!"}
        />
      </Col>
    </>
  );
};

export default AllFundItem;
