import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import { Col } from "react-bootstrap";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import ConfirmAlert from "../../../components/ConfirmAlert";
import {
  deleteTaxManagementById,
  getAllTaxManagement,
} from "../../../services/contractorApi";
import { useTranslation } from "react-i18next";
import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/auth/authSlice";
import TableHeader from "../../../components/DataTable/TableHeader";
import CustomTable from "../../../components/DataTable/CustomTable";
import ActionButtons from "../../../components/DataTable/ActionButtons";
import { serialNumber } from "../../../utils/helper";

const TaxManagement = ({ checkPermission }) => {
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
  const [isLoading, setIsLoading] = useState(false);
  const { userPermission } = useSelector(selectUser);

  const fetchTaxManagementData = async () => {
    const res = await getAllTaxManagement(search, pageSize, pageNo);
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

  const handleDelete = async () => {
    const res = await deleteTaxManagementById(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setRows((prev) => prev.filter((dlt) => dlt.id !== +idToDelete));
      fetchTaxManagementData();
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
  };

  useEffect(() => {
    fetchTaxManagementData();
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
      columnHelper.accessor("title", {
        header: t("Gst Title"),
      }),
      columnHelper.accessor("percentage", {
        header: t("Gst Percentage"),
        cell: (info) =>
          info.row.original?.percentage > 0
            ? `${info.row.original?.percentage} ${"%"}`
            : "0 %",
      }),
      columnHelper.accessor("created_at", {
        header: t("Created At"),
      }),
      columnHelper.accessor("action", {
        header: t("Action"),
        cell: (info) => (
          <ActionButtons
            actions={{
              edit: {
                show: checkPermission?.update,
                action: () =>
                  navigate(
                    `/TaxManagement/CreateTaxManagement/${info.row.original?.id}`
                  ),
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
    [checkPermission, rows.length, pageNo, pageSize]
  );

  return (
    <>
      <Helmet>
        <title>Tax Management · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CustomTable
          id={"account"}
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
                to: `/TaxManagement/CreateTaxManagement/new`,
                title: "Create",
              }}
            />
          )}
          tableTitleComponent={
            <div>
              <strong>All - Tax Management</strong>
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

export default TaxManagement;
