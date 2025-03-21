import React, { useEffect, useMemo, useState } from "react";
import { Col } from "react-bootstrap";
import { deleteAssetsById, getAllAssets } from "../../services/contractorApi";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import ConfirmAlert from "../../components/ConfirmAlert";
import { useTranslation } from "react-i18next";
import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate, useSearchParams } from "react-router-dom";
import { selectUser } from "../../features/auth/authSlice";
import { useSelector } from "react-redux";
import ActionButtons from "../../components/DataTable/ActionButtons";
import CustomTable from "../../components/DataTable/CustomTable";
import TableHeader from "../../components/DataTable/TableHeader";
import { UserPlus } from "lucide-react";
import { serialNumber } from "../../utils/helper";

const AllAssets = ({ checkPermission }) => {
  const columnHelper = createColumnHelper();
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const { userPermission } = useSelector(selectUser);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");
  const { t } = useTranslation();

  const fetchAllAssetsData = async () => {
    const res = await getAllAssets({ search, pageSize, pageNo });
    setIsLoading(true);
    if (res.status) {
      setRows(res?.data);
      setTotalData(res?.pageDetails?.total);
    } else {
      setRows([]);
      setTotalData(0);
    }
    setIsLoading(false);
  };

  // const fetchAssignUserData = async () => {
  //   const res = await getAllUsers();
  //   if (res.status) {
  //     setAssignUserData(res.data);
  //   } else {
  //     setAssignUserData([]);
  //   }
  // };

  const handleDelete = async () => {
    const res = await deleteAssetsById(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setRows((prev) => prev.filter((dlt) => dlt.id !== +idToDelete));
      fetchAllAssetsData();
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
  };

  useEffect(() => {
    fetchAllAssetsData();
  }, [search, pageNo, pageSize]);

  const UserOption = ({ innerProps, label, data }) => (
    <div
      {...innerProps}
      className="d-flex justify-content-between px-2 align-items-center cursor-pointer"
    >
      <span>
        <img
          className="avatar me-2"
          src={
            data.image ||
            `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
          }
          alt={data.name}
        />
        {label}
      </span>
    </div>
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor("sr_no", {
        header: t("Sr No."),
        cell: (info) => {
          const serialNumbers = serialNumber(pageNo, pageSize);
          return serialNumbers[info.row.index];
        },
      }),
      columnHelper.accessor("asset_name", {
        header: "Asset Name",
      }),
      columnHelper.accessor("asset_model_number", {
        header: "Asset Model Number",
      }),
      columnHelper.accessor("asset_uin_number", {
        header: "Asset UIN Number",
      }),
      columnHelper.accessor("asset_price", {
        header: "Asset Price",
      }),
      columnHelper.accessor("asset_purchase_date", {
        header: "Purchase Date",
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => (
          <div
            className={`${
              info.row.original.status == "1"
                ? "text-orange"
                : info.row.original.status == "2"
                ? "text-green"
                : info.row.original.status == "3"
                ? "text-danger"
                : info.row.original.status == "4"
                ? "text-green"
                : info.row.original.status == "5"
                ? "text-orange"
                : info.row.original.status == "6"
                ? "text-danger"
                : ""
            }`}
          >
            {info.row.original.status == "1"
              ? "requested"
              : info.row.original.status == "2"
              ? "approved"
              : info.row.original.status == "3"
              ? "rejected"
              : info.row.original.status == "4"
              ? "assigned"
              : info.row.original.status == "5"
              ? "repair"
              : info.row.original.status == "6"
              ? "scrap"
              : ""}
          </div>
        ),
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
                    `/AllAssets/CreateAssets/${info.row.original.id}?type=view`
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
    [checkPermission, rows.length, pageNo, pageSize]
  );

  return (
    <Col md={12} data-aos={"fade-up"}>
      <Helmet>
        <title>All Assets · CMS Electricals</title>
      </Helmet>
      <CustomTable
        id={"all_assets"}
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
            setSearchText={setSearch}
            button={{ show: false }}
            userPermission={checkPermission}
          />
        )}
        tableTitleComponent={
          <div>
            <UserPlus /> <strong>all assets</strong>
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
  );
};

export default AllAssets;
