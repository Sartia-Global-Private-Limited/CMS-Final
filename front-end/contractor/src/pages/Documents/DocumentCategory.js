import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import ConfirmAlert from "../../components/ConfirmAlert";
import {
  getAdminAllDocument,
  getAdminDeleteDocument,
} from "../../services/authapi";
import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate, useSearchParams } from "react-router-dom";
import ActionButtons from "../../components/DataTable/ActionButtons";
import { getDateValue, serialNumber } from "../../utils/helper";
import CustomTable from "../../components/DataTable/CustomTable";
import TableHeader from "../../components/DataTable/TableHeader";
import { FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

const DocumentCategory = ({ checkPermission }) => {
  const navigate = useNavigate();
  const columnHelper = createColumnHelper();
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || "10";
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [idToDelete, setIdToDelete] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const { t } = useTranslation();
  const fetchDocumentData = async () => {
    const res = await getAdminAllDocument(search, pageSize, pageNo);
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
    const res = await getAdminDeleteDocument(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setRows((prev) => prev.filter((itm) => itm.id !== +idToDelete));
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    fetchDocumentData();
    setShowAlert(false);
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
      columnHelper.accessor("title", {
        header: "Title",
        cell: (info) => info.getValue() || "-",
      }),
      columnHelper.accessor("category", {
        header: "Category",
      }),
      columnHelper.accessor("created_at", {
        header: "Created At",
        cell: (info) => getDateValue(info.row.original.created_at),
      }),
      columnHelper.accessor("description", {
        header: "Description",
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
                    `/DocumentCategory/CreateDocumentCategory/${info.row.original.id}`
                  ),
              },
              delete: {
                show: checkPermission?.delete,
                action: () => {
                  setIdToDelete(`${info.row.original.id}`);
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

  useEffect(() => {
    fetchDocumentData();
  }, [search, pageSize, pageNo]);

  return (
    <>
      <Helmet>
        <title>Document Category · CMS Electricals</title>
      </Helmet>
      <CustomTable
        id={"document_category"}
        isLoading={isLoading}
        rows={rows || []}
        columns={columns}
        pagination={{
          pageNo,
          pageSize,
          totalData,
        }}
        excelAction={false}
        pdfAction={false}
        align={"bottom"}
        apiForExcelPdf={getAdminAllDocument}
        customHeaderComponent={() => (
          <TableHeader
            userPermission={checkPermission}
            setSearchText={setSearch}
            button={{
              noDrop: true,
              to: `/DocumentCategory/CreateDocumentCategory/new`,
              title: "Create",
            }}
          />
        )}
        tableTitleComponent={
          <div>
            <FileText /> <strong>Document Category</strong>
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
    </>
  );
};

export default DocumentCategory;
