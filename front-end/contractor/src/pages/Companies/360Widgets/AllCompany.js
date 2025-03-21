import React, { useEffect, useMemo, useState } from "react";
import CustomTable from "../../../components/DataTable/CustomTable";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createColumnHelper } from "@tanstack/react-table";
import TableHeader from "../../../components/DataTable/TableHeader";
import { deleteAdminCompanies } from "../../../services/authapi";
import { useTranslation } from "react-i18next";
import ActionButtons from "../../../components/DataTable/ActionButtons";
import { toast } from "react-toastify";
import ConfirmAlert from "../../../components/ConfirmAlert";
import { UserPlus } from "lucide-react";
import { getAdminAllCompanies } from "../../../services/authapi";
import TooltipComponent from "../../../components/TooltipComponent";
import { Button } from "react-bootstrap";
import { FaFileExcel } from "react-icons/fa6";
import { serialNumber } from "../../../utils/helper";

const AllCompany = ({ checkPermission }) => {
  const columnHelper = createColumnHelper();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [idToDelete, setIdToDelete] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMyCompaniesData = async () => {
    setIsLoading(true);
    const res = await getAdminAllCompanies({ search, pageSize, pageNo });
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
    const module = "all-company";
    const res = await deleteAdminCompanies(idToDelete, module);
    if (res.status) {
      toast.success(res.message);
      setRows((prev) => prev.filter((itm) => itm.company_id !== +idToDelete));
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
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
      columnHelper.accessor("company_unique_id", {
        header: "ID",
      }),
      columnHelper.accessor("company_name", {
        header: "Name",
      }),
      columnHelper.accessor("gst_number", {
        header: t("gst number"),
        cell: (info) =>
          info.row.original?.gst_details?.map((item) => {
            return item?.is_default == "1" ? item?.gst_number : "-";
          }),
      }),
      columnHelper.accessor("pan_number", {
        header: t("pan number"),
      }),
      columnHelper.accessor("company_mobile", {
        header: t("phone number"),
      }),
      columnHelper.accessor("company_type_name", {
        header: t("Company Type"),
      }),
      columnHelper.accessor("action", {
        header: "Action",
        cell: (info) => (
          <ActionButtons
            actions={{
              view: {
                show: checkPermission?.view,
                action: () =>
                  navigate(
                    `/AllCompanies/ViewAllCompanies/${info.row.original.company_id}`,
                    { state: info.row.original }
                  ),
              },
              edit: {
                show: checkPermission?.update,
                action: () =>
                  navigate(
                    `/AllCompanies/AddAllCompany/${info.row.original.company_id}`
                  ),
              },
              delete: {
                show: checkPermission?.delete,
                action: () => {
                  setIdToDelete(`${info.row.original.company_id}`);
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

  useEffect(() => {
    fetchMyCompaniesData();
  }, [search, pageNo, pageSize]);

  return (
    <>
      <CustomTable
        id={"all_company"}
        userPermission={checkPermission}
        isLoading={isLoading}
        rows={rows || []}
        columns={columns}
        // hideCol={[
        //   !checkPermission?.view &&
        //     !checkPermission?.update &&
        //     !checkPermission?.create &&
        //     "action",
        // ]}
        pagination={{
          pageNo,
          pageSize,
          totalData,
        }}
        excelAction={() => ""}
        pdfAction={() => ""}
        apiForExcelPdf={getAdminAllCompanies}
        customHeaderComponent={() => (
          <TableHeader
            userPermission={checkPermission}
            setSearchText={setSearch}
            openImport={() => navigate(`/allCompanies/import`)}
            button={{
              to: `/AllCompanies/AddAllCompany/new`,
              title: "Create",
            }}
          />
        )}
        tableTitleComponent={
          <div>
            <UserPlus /> <strong>all company</strong>
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

export default AllCompany;
