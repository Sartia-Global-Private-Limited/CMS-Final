import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import { Col } from "react-bootstrap";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import ConfirmAlert from "../../../components/ConfirmAlert";
import {
  deleteClientNoFormatById,
  getAllClientNoFormat,
} from "../../../services/contractorApi";
import { useTranslation } from "react-i18next";
import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate, useSearchParams } from "react-router-dom";
import CustomTable from "../../../components/DataTable/CustomTable";
import ActionButtons from "../../../components/DataTable/ActionButtons";
import TableHeader from "../../../components/DataTable/TableHeader";
import { serialNumber } from "../../../utils/helper";

const ClientNoFormat = ({ checkPermission }) => {
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

  const fetchClientNoFormatData = async () => {
    const res = await getAllClientNoFormat(search, pageSize, pageNo);
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
    const res = await deleteClientNoFormatById(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setRows((prev) => prev.filter((dlt) => dlt.id !== +idToDelete));
      fetchClientNoFormatData();
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
  };

  useEffect(() => {
    fetchClientNoFormatData();
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
      columnHelper.accessor("type", {
        header: t("Type"),
      }),
      columnHelper.accessor("prefix", {
        header: t("Prefix"),
      }),
      columnHelper.accessor("financial_year_format", {
        header: t("Financial Year Format"),
      }),
      columnHelper.accessor("start_company_number", {
        header: t("Start Company Number"),
      }),
      columnHelper.accessor("financial_year", {
        header: t("Financial Year"),
      }),
      columnHelper.accessor("sample_format", {
        header: t("Sample Format"),
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
                    `/client-and-vendor/create-client-and-vendor-no-format/${info.row.original?.id}`
                  ),
              },
              delete: {
                show: false,
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
        <title>
          Client | Vendor | Supplier Number Format · CMS Electricals
        </title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CustomTable
          id={"client_no_formate"}
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
              button={{
                show: false,
                noDrop: true,
                to: `/client-and-vendor/create-client-and-vendor-no-format/new`,
                title: "Create",
              }}
            />
          )}
          tableTitleComponent={
            <div>
              <strong>Client | Vendor | Supplier Number Format</strong>
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

export default ClientNoFormat;
