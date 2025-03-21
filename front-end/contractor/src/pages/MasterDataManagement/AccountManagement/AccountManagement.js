import React, { useEffect, useMemo, useState } from "react";
import { Col } from "react-bootstrap";
import { Helmet } from "react-helmet";
import {
  deleteAccountDetailsById,
  getAllAccountDetails,
} from "../../../services/contractorApi";
import { toast } from "react-toastify";
import ConfirmAlert from "../../../components/ConfirmAlert";
import ImageViewer from "../../../components/ImageViewer";
import { useTranslation } from "react-i18next";
import ActionButtons from "../../../components/DataTable/ActionButtons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/auth/authSlice";
import TableHeader from "../../../components/DataTable/TableHeader";
import CustomTable from "../../../components/DataTable/CustomTable";
import { createColumnHelper } from "@tanstack/react-table";
import { serialNumber } from "../../../utils/helper";

const AccountManagement = ({ checkPermission }) => {
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

  const fetchAllBankData = async () => {
    const res = await getAllAccountDetails(search, pageSize, pageNo);
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
    const res = await deleteAccountDetailsById(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setRows((prev) => prev.filter((dlt) => dlt.id !== +idToDelete));
      fetchAllBankData();
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
  };

  useEffect(() => {
    fetchAllBankData();
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
      columnHelper.accessor("bank_name", {
        header: t("Bank Name"),
        cell: (info) => (
          <ImageViewer
            src={
              info.row.original?.logo
                ? `${process.env.REACT_APP_API_URL}${info.row.original?.logo}`
                : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
            }
          >
            <span className="d-flex align-items-center gap-2">
              <img
                width={30}
                height={30}
                className="my-bg object-fit p-1 rounded-circle"
                src={
                  info.row.original?.logo
                    ? `${process.env.REACT_APP_API_URL}${info.row.original?.logo}`
                    : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                }
              />{" "}
              {info.row.original?.bank_name}
            </span>
          </ImageViewer>
        ),
      }),
      columnHelper.accessor("account_holder_name", {
        header: t("Holder Name"),
      }),
      columnHelper.accessor("account_number", {
        header: t("Account Number"),
      }),
      columnHelper.accessor("branch", {
        header: t("Branch"),
      }),
      columnHelper.accessor("action", {
        header: t("Action"),
        cell: (info) => (
          <ActionButtons
            actions={{
              view: {
                show: checkPermission?.view,
                action: () =>
                  navigate(
                    `/account-management/view-transaction/${info.row.original?.id}?type=details`
                  ),
              },
              edit: {
                show: checkPermission?.update,
                action: () =>
                  navigate(
                    `/account-management/create-account-management/${info.row.original?.id}`
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
      <Col md={12} data-aos={"fade-up"}>
        <Helmet>
          <title>All Account Management · CMS Electricals</title>
        </Helmet>

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
                to: `/account-management/create-account-management/new`,
                title: "Create",
              }}
            />
          )}
          tableTitleComponent={
            <div>
              <strong>All Account Management</strong>
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

export default AccountManagement;
