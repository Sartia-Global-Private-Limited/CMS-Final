import React, { useState, useEffect, useMemo } from "react";
import { Col } from "react-bootstrap";
import {
  deleteAdminRO,
  getAdminRegionalOffices,
} from "../../../services/authapi";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import ConfirmAlert from "../../../components/ConfirmAlert";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createColumnHelper } from "@tanstack/react-table";
import ActionButtons from "../../../components/DataTable/ActionButtons";
import { useTranslation } from "react-i18next";
import CustomTable from "../../../components/DataTable/CustomTable";
import TableHeader from "../../../components/DataTable/TableHeader";
import { serialNumber } from "../../../utils/helper";

const RegionalMasterdata = ({ checkPermission }) => {
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");
  const columnHelper = createColumnHelper();
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || "10";
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { t } = useTranslation();

  const fetchRoData = async () => {
    const res = await getAdminRegionalOffices(search, pageSize, pageNo);
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
    const res = await deleteAdminRO(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setRows((prev) => prev.filter((itm) => itm.ro_id !== +idToDelete));
      fetchRoData();
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
  };

  useEffect(() => {
    fetchRoData();
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
      columnHelper.accessor("ro_id", {
        header: t("regional office id"),
      }),
      columnHelper.accessor("regional_office_name", {
        header: t("regional office Name"),
      }),
      columnHelper.accessor("zone_name", {
        header: t("Zone name"),
      }),
      columnHelper.accessor("code", {
        header: t("code"),
      }),
      columnHelper.accessor("address_1", {
        header: t("address"),
      }),
      columnHelper.accessor("status", {
        header: t("status"),
        cell: (info) => (
          <div
            className={`text-${
              info.row.original?.status === 1 ? "green" : "danger"
            }`}
          >
            {info.row.original?.status === 1 ? "Active" : "Inactive"}
          </div>
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
                  navigate(
                    `/RegionalMasterdata/edit/${info.row.original.ro_id}`
                  ),
              },
              delete: {
                show: checkPermission?.delete,
                action: () => {
                  setIdToDelete(info.row.original?.ro_id);
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
        <title>Regional Office · CMS Electricals</title>
      </Helmet>
      <Col md={12}>
        <CustomTable
          id={"regional_office"}
          userPermission={checkPermission}
          isLoading={isLoading}
          rows={rows || []}
          columns={columns}
          pagination={{
            pageNo,
            pageSize,
            totalData,
          }}
          align={"bottom"}
          customHeaderComponent={() => (
            <TableHeader
              userPermission={checkPermission}
              setSearchText={setSearch}
              button={{
                noDrop: true,
                to: `/RegionalMasterdata/add`,
                title: "Create",
              }}
            />
          )}
          tableTitleComponent={
            <div>
              <strong>All regional office</strong>
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

export default RegionalMasterdata;
