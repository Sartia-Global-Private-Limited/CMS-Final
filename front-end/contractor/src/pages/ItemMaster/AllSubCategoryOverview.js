import React, { useEffect, useMemo, useState } from "react";
import CustomTable from "../../components/DataTable/CustomTable";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createColumnHelper } from "@tanstack/react-table";
import TableHeader from "../../components/DataTable/TableHeader";
import { selectUser } from "../../features/auth/authSlice";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import ActionButtons from "../../components/DataTable/ActionButtons";
import { toast } from "react-toastify";
import ConfirmAlert from "../../components/ConfirmAlert";
import { UserPlus } from "lucide-react";
import {
  deleteSubCategoryById,
  getAllSubCategory,
} from "../../services/contractorApi";
import StatusChip from "../../components/StatusChip";
import { serialNumber } from "../../utils/helper";

const AllSubCategoryOverview = ({ checkPermission }) => {
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
  const { userPermission } = useSelector(selectUser);

  const fetchSubCategoryData = async () => {
    const res = await getAllSubCategory({ search, pageSize, pageNo });
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
    const res = await deleteSubCategoryById(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setRows((prev) => prev.filter((itm) => itm.id !== +idToDelete));
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
      columnHelper.accessor("name", {
        header: "Name",
      }),
      columnHelper.accessor("status", {
        header: t("Status"),
        cell: (info) => (
          <StatusChip status={info.getValue() == 1 ? "Active" : "InActive"} />
        ),
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
                    `/ItemMaster/create-sub-category/${info.row.original.id}`
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
    // [userPermission, rows.length]
    [checkPermission, rows.length, pageNo, pageSize]
  );

  useEffect(() => {
    fetchSubCategoryData();
  }, [search, pageNo, pageSize]);

  return (
    <>
      <CustomTable
        id={"sub_category_overview"}
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
        apiForExcelPdf={getAllSubCategory}
        customHeaderComponent={() => (
          <TableHeader
            userPermission={checkPermission}
            setSearchText={setSearch}
            button={{
              noDrop: true,
              to: `/ItemMaster/create-sub-category/new`,
              title: "Create",
            }}
          />
        )}
        tableTitleComponent={
          <div>
            <UserPlus /> <strong>Sub Category Overview</strong>
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

export default AllSubCategoryOverview;
