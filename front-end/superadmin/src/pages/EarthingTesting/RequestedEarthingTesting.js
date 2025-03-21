import React, { useState, useEffect, Fragment, useMemo } from "react";
import { approveRejectEarthingTestingById } from "../../services/contractorApi";
import { toast } from "react-toastify";
import ConfirmAlert from "../../components/ConfirmAlert";
import { getAllEarthingTesting } from "../../services/contractorApi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createColumnHelper } from "@tanstack/react-table";
import ActionButtons from "../../components/DataTable/ActionButtons";
import { getDateValue, serialNumber } from "../../utils/helper";
import ImageViewer from "../../components/ImageViewer";
import { UserDetails } from "../../components/ItemDetail";
import CustomTable from "../../components/DataTable/CustomTable";
import TableHeader from "../../components/DataTable/TableHeader";
import { FileText } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import StatusChip from "../../components/StatusChip";

const RequestedEarthingTesting = ({ checkPermission }) => {
  const columnHelper = createColumnHelper();
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || "10";
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [earthingTestingId, setEarthingTestingId] = useState("");
  const [showApprove, setShowApprove] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const { userPermission } = useSelector(selectUser);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const fetchAllAssetsRepairRequireData = async () => {
    const status = 1;
    const res = await getAllEarthingTesting({
      search,
      pageSize,
      pageNo,
      status,
    });
    if (res.status) {
      setRows(res.data);
      setTotalData(res?.pageDetails?.total);
    } else {
      setRows([]);
      setTotalData(0);
    }
    setIsLoading(false);
  };

  const handleApproveReject = async () => {
    const status = showApprove ? "2" : "3";
    const res = await approveRejectEarthingTestingById(
      status,
      earthingTestingId
    );

    if (res.status) {
      toast.success(res.message);
      setRows((prev) => prev.filter((itm) => itm.id !== earthingTestingId));
    } else {
      toast.error(res.message);
    }

    setEarthingTestingId("");
    setShowApprove(false);
    setShowReject(false);
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
      columnHelper.accessor("complaint_unique_id", {
        header: t("Complaint id"),
        cell: (info) => info.getValue() || "-",
      }),
      columnHelper.accessor("complaint_type_name", {
        header: t("Complaint Type"),
        cell: (info) => info.getValue() || "-",
      }),
      columnHelper.accessor("outletData", {
        header: t("Outlet Data"),
        cell: (info) =>
          info.row.original?.outletData?.map((itm, idx) => {
            return (
              <>
                {itm.outlet_name}
                {idx < info.row.original?.outletData?.length - 1 && ", "}
              </>
            );
          }),
      }),
      columnHelper.accessor("user_data", {
        header: t("User Data"),
        cell: (info) => (
          <div className="d-align">
            {info.row.original?.user_data.slice(0, 5).map((user, index) => (
              <Fragment key={index}>
                <UserDetails
                  img={user?.image}
                  name={user?.name}
                  id={user?.user_id}
                  unique_id={user?.employee_id}
                />
              </Fragment>
            ))}
          </div>
        ),
      }),
      columnHelper.accessor("expire_date", {
        header: t("Expiry Date"),
        cell: (info) => getDateValue(info.row.original.expire_date),
      }),
      columnHelper.accessor("status", {
        header: t("status"),
        cell: (info) => <StatusChip status={"Pending"} />,
      }),
      columnHelper.accessor("action", {
        header: "Action",
        cell: (info) => (
          <ActionButtons
            actions={{
              view: {
                show: checkPermission?.view,
                action: () =>
                  navigate(`/earthing-testing/view`, {
                    state: {
                      id: info.row.original.id,
                    },
                  }),
              },
              edit: {
                show: checkPermission?.update,
                action: () =>
                  navigate(`/earthing-testing/create/${info.row.original.id}`),
              },
              approve: {
                show: checkPermission?.update,
                action: () => {
                  setEarthingTestingId(`${info.row.original.id}`);
                  setShowApprove(true);
                },
              },
              reject: {
                show: checkPermission?.update,
                action: () => {
                  setEarthingTestingId(`${info.row.original.id}`);
                  setShowReject(true);
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
    fetchAllAssetsRepairRequireData();
  }, [search, pageNo, pageSize, earthingTestingId]);

  return (
    <>
      <CustomTable
        id={"request_earthing_testing"}
        userPermission={checkPermission}
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
        apiForExcelPdf={getAllEarthingTesting}
        customHeaderComponent={() => (
          <TableHeader
            userPermission={checkPermission}
            setSearchText={setSearch}
            button={{
              noDrop: true,
              to: `/earthing-testing/create/new`,
              title: "Create ",
            }}
          />
        )}
        tableTitleComponent={
          <div>
            <FileText /> <strong>Request Earthing Testing</strong>
          </div>
        }
      />

      <ConfirmAlert
        size={"sm"}
        deleteFunction={handleApproveReject}
        hide={setShowApprove}
        show={showApprove}
        title={"Confirm Approve"}
        description={"Are you sure you want to approve this!!"}
      />

      <ConfirmAlert
        size={"sm"}
        deleteFunction={handleApproveReject}
        hide={setShowReject}
        show={showReject}
        title={"Confirm reject"}
        description={"Are you sure you want to reject this!!"}
      />
    </>
  );
};

export default RequestedEarthingTesting;
