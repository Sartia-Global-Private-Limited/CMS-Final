import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import { Col } from "react-bootstrap";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import ConfirmAlert from "../../components/ConfirmAlert";
import { deleteBrandById, getAllBrand } from "../../services/contractorApi";
import { useTranslation } from "react-i18next";
import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate, useSearchParams } from "react-router-dom";
import TableHeader from "../../components/DataTable/TableHeader";
import CustomTable from "../../components/DataTable/CustomTable";
import ActionButtons from "../../components/DataTable/ActionButtons";
import { serialNumber } from "../../utils/helper";

const AllBrandsOverview = ({ checkPermission }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");
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

  const fetchBrandData = async () => {
    const res = await getAllBrand({ search, pageSize, pageNo });
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
    const res = await deleteBrandById(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setRows((prev) => prev.filter((dlt) => dlt.id !== +idToDelete));
      fetchBrandData();
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
  };

  useEffect(() => {
    fetchBrandData();
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
      columnHelper.accessor("brand_name", {
        header: t("Brand Name"),
      }),
      columnHelper.accessor("status", {
        header: t("Status"),
        cell: (info) => (
          <span
            className={`text-${
              info.row.original?.status == "1" ? "green" : "danger"
            }`}
          >
            {info.row.original?.status == "1" ? "Active" : "InActive"}
          </span>
        ),
      }),
      columnHelper.accessor("action", {
        header: t("Action"),
        cell: (info) => (
          <ActionButtons
            actions={{
              edit: {
                show: checkPermission?.update,
                action: () =>
                  navigate(`/ItemMaster/add-brand/${info.row.original?.id}`),
              },
              delete: {
                show: checkPermission?.delete,
                action: () => {
                  setIdToDelete(`${info.row.original?.id}`);
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
        <title>Category · CMS Electricals</title>
      </Helmet>

      <Col md={12} data-aos={"fade-up"}>
        <CustomTable
          id={"all_brand"}
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
                to: `/ItemMaster/add-brand/new`,
                title: "Create",
              }}
            />
          )}
          tableTitleComponent={
            <div>
              <strong>{t("All Brands")}</strong>
            </div>
          }
        />
      </Col>

      <ConfirmAlert
        size={"sm"}
        deleteFunction={handleDelete}
        hide={setShowAlert}
        show={showAlert}
        title={"Confirm Delete"}
        description={"Are you sure you want to delete this!!"}
      />
    </>
  );
};

export default AllBrandsOverview;
