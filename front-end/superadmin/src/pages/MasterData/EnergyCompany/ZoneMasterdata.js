import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import { Col } from "react-bootstrap";
import { deleteAdminZone, getAdminZone } from "../../../services/authapi";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import ConfirmAlert from "../../../components/ConfirmAlert";
import { useNavigate, useSearchParams } from "react-router-dom";
import ActionButtons from "../../../components/DataTable/ActionButtons";
import { createColumnHelper } from "@tanstack/react-table";
import CustomTable from "../../../components/DataTable/CustomTable";
import TableHeader from "../../../components/DataTable/TableHeader";
import { useTranslation } from "react-i18next";
import { serialNumber } from "../../../utils/helper";

const ZoneMasterdata = ({ checkPermission }) => {
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

  const fetchZoneData = async () => {
    const res = await getAdminZone(search, pageSize, pageNo);
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
    const res = await deleteAdminZone(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setRows((prev) => prev.filter((itm) => itm.zone_id !== +idToDelete));
      fetchZoneData();
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
  };

  useEffect(() => {
    fetchZoneData();
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
      columnHelper.accessor("zone_id", {
        header: t("Zone id"),
      }),
      columnHelper.accessor("zone_name", {
        header: t("Zone Name"),
      }),
      columnHelper.accessor("zone_description", {
        header: t("Zone Description"),
        cell: (info) => info.getValue() || "-",
      }),
      columnHelper.accessor("ec_name", {
        header: t("Energy Company Name"),
      }),
      columnHelper.accessor("action", {
        header: t("Action"),
        cell: (info) => (
          <ActionButtons
            actions={{
              edit: {
                show: checkPermission?.update,
                action: () =>
                  navigate(`/ZoneMasterdata/edit/${info.row.original.zone_id}`),
              },
              delete: {
                show: checkPermission?.delete,
                action: () => {
                  setIdToDelete(info.row.original?.zone_id);
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
        <title>Energy · CMS Electricals</title>
      </Helmet>

      <Col md={12} data-aos={"fade-up"}>
        <CustomTable
          id={"zone"}
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
                to: `/ZoneMasterdata/add`,
                title: "Create",
              }}
            />
          )}
          tableTitleComponent={
            <div>
              <strong>All Zones</strong>
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

export default ZoneMasterdata;
