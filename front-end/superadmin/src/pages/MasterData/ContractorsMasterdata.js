import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import ImageViewer from "../../components/ImageViewer";
import { toast } from "react-toastify";
import ConfirmAlert from "../../components/ConfirmAlert";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  deleteAdminContractors,
  getAdminContractors,
  getAdminSingleContractors,
} from "../../services/authapi";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import ActionButtons from "../../components/DataTable/ActionButtons";
import StatusChip from "../../components/StatusChip";
import CustomTable from "../../components/DataTable/CustomTable";
import TableHeader from "../../components/DataTable/TableHeader";
import { UserPlus } from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import {
  findMatchingPath,
  getDateValue,
  serialNumber,
} from "../../utils/helper";

const ContractorsMasterdata = () => {
  const columnHelper = createColumnHelper();
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [idToDelete, setIdToDelete] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const { userPermission } = useSelector(selectUser);
  const { pathname } = useLocation();
  const [matchingPathObject, setMatchingPathObject] = useState(null);

  const fetchContractorData = async () => {
    const res = await getAdminContractors(search, pageSize, pageNo);
    if (res.status) {
      setRows(res.data);
      setTotalData(res?.pageDetails?.total);
    } else {
      setRows([]);
      setTotalData(0);
    }
    setIsLoading(false);
  };

  // View Contractors User
  const handleView = async (id, user_type, Contractor) => {
    const res = await getAdminSingleContractors(id, user_type);
    if (res.status) {
      navigate(
        `/ContractorsMasterdata/ContractorUsers/${id}?pageNo=${pageNo}`,
        {
          state: res.data,
        }
      );
    }
  };

  // Delete Contractors User
  const handleDelete = async () => {
    const res = await deleteAdminContractors(idToDelete, "Contractor");
    if (res.status) {
      toast.success(res.message);
      setRows((prev) => prev.filter((itm) => itm.admin_id !== +idToDelete));
      fetchContractorData();
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
  };

  useEffect(() => {
    fetchContractorData();
  }, [search, pageNo, pageSize]);

  // for role and permissions
  useEffect(() => {
    if (userPermission) {
      const result = findMatchingPath(userPermission, pathname);
      setMatchingPathObject(result);
    }
  }, [userPermission, pathname, searchParams, navigate]);

  const checkPermission = matchingPathObject;

  const columns = useMemo(
    () => [
      columnHelper.accessor("sr_no", {
        header: t("Sr No."),
        cell: (info) => {
          const serialNumbers = serialNumber(pageNo, pageSize);
          return serialNumbers[info.row.index];
        },
      }),
      columnHelper.accessor("images", {
        header: t("Image"),
        cell: (info) => (
          <ImageViewer
            src={`${process.env.REACT_APP_API_URL}${info.row.original?.image}`}
          >
            <img
              width={50}
              className="my-bg p-1 rounded"
              src={`${process.env.REACT_APP_API_URL}${info.row.original?.image}`}
              alt=""
            />
          </ImageViewer>
        ),
      }),
      columnHelper.accessor("name", {
        header: t("Name"),
        cell: (info) => info.getValue() || "-",
      }),
      columnHelper.accessor("email", {
        header: t("Email"),
        cell: (info) => info.getValue() || "-",
      }),
      columnHelper.accessor("contact_no", {
        header: t("Contact No."),
        cell: (info) => info.getValue() || "-",
      }),
      columnHelper.accessor("plan_expire_date", {
        header: t("Plan Expire Date"),
        cell: (info) => getDateValue(info.getValue()),
      }),
      columnHelper.accessor("status", {
        header: t("Status"),
        cell: (info) => (
          <StatusChip status={info.getValue() == 1 ? "Active" : "InActive"} />
        ),
      }),
      columnHelper.accessor("action", {
        header: t("Action"),
        cell: (info) => (
          <ActionButtons
            actions={{
              view: {
                show: checkPermission?.view,
                action: () =>
                  handleView(
                    info.row.original?.admin_id,
                    info.row.original?.user_type
                  ),
              },
              edit: {
                show: checkPermission?.update,
                action: () =>
                  navigate(
                    `/ContractorsMasterdata/edit/${info.row.original.admin_id}`
                  ),
              },
              delete: {
                show: checkPermission?.delete,
                action: () => {
                  setIdToDelete(info.row.original?.admin_id);
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
        <title>Client · CMS Electricals</title>
      </Helmet>
      <CustomTable
        id={"all_contractors"}
        userPermission={checkPermission}
        isLoading={isLoading}
        rows={rows || []}
        columns={columns}
        align={"bottom"}
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
              to: `/ContractorsMasterdata/add`,
              title: "Create",
            }}
          />
        )}
        tableTitleComponent={
          <div>
            <UserPlus /> <strong>All - Clients</strong>
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

export default ContractorsMasterdata;
