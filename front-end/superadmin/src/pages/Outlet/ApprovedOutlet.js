import React, { useEffect, useMemo, useState } from "react";
import { Col } from "react-bootstrap";
import { toast } from "react-toastify";
import ConfirmAlert from "../../components/ConfirmAlert";
import { Helmet } from "react-helmet";
import {
  approveRejectOutletById,
  deleteOutletById,
  getAllOutlet,
} from "../../services/contractorApi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { createColumnHelper } from "@tanstack/react-table";
import ActionButtons from "../../components/DataTable/ActionButtons";
import CustomTable from "../../components/DataTable/CustomTable";
import TableHeader from "../../components/DataTable/TableHeader";
import { UserPlus } from "lucide-react";
import { serialNumber } from "../../utils/helper";
import { UserDetail } from "../../components/ItemDetail";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";

const ApprovedOutlet = ({ checkPermission }) => {
  const columnHelper = createColumnHelper();
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [search, setSearch] = useState("");
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [isLoading, setIsLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [outletId, setOutletId] = useState("");
  const navigate = useNavigate();
  const { user } = useSelector(selectUser);
  const { t } = useTranslation();

  const fetchOutletAllData = async () => {
    const status = 2;
    const res = await getAllOutlet({ search, pageSize, pageNo, status });
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
    const res = await deleteOutletById(outletId);
    if (res.status) {
      toast.success(res.message);
      setRows((prev) => prev.filter((data) => data.id != outletId));
    } else {
      toast.error(res.message);
    }
    setOutletId("");
    setShowDelete(false);
  };

  const handleApproveReject = async () => {
    const status = "3";
    const res = await approveRejectOutletById(status, outletId);
    if (res.status) {
      toast.success(res.message);
      setRows((prev) => prev.filter((itm) => itm.id !== outletId));
      fetchOutletAllData();
    } else {
      toast.error(res.message);
    }
    setOutletId("");
    setShowReject(false);
  };

  useEffect(() => {
    fetchOutletAllData();
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
      columnHelper.accessor("outlet_name", {
        header: "outlet name",
      }),
      columnHelper.accessor("energy_company_name", {
        header: "energy company name",
      }),
      columnHelper.accessor("zone_name", {
        header: "zone name",
      }),
      columnHelper.accessor("regional_office_name", {
        header: "regional office name",
      }),
      columnHelper.accessor("sales_area_name", {
        header: "sales area name",
      }),
      columnHelper.accessor("district_name", {
        header: "district name",
      }),
      columnHelper.accessor("outlet_unique_id", {
        header: "outlet unique id",
      }),
      columnHelper.accessor("outlet_category", {
        header: "outlet category",
      }),
      columnHelper.accessor("created_by", {
        header: t("Created By"),
        cell: (info) => (
          <UserDetail
            img={info.row.original?.created_by?.image}
            name={info.row.original?.created_by?.name}
            id={info.row.original?.created_by?.id}
            unique_id={info.row.original?.created_by?.employee_id}
            login_id={user.id}
          />
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
                  navigate(`/outlet/create/${info.row.original.id}?type=view`),
              },
              edit: {
                show: checkPermission?.update,
                action: () =>
                  navigate(`/outlet/create/${info.row.original.id}`),
              },
              delete: {
                show: checkPermission?.delete,
                action: () => {
                  setOutletId(info.row.original.id);
                  setShowDelete(true);
                },
              },
              reject: {
                show: checkPermission?.update,
                action: () => {
                  setOutletId(info.row.original.id);
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

  return (
    <>
      <Helmet>
        <title>Outlet Management · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CustomTable
          id={"approved_outlet"}
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
              setSearchText={setSearch}
              button={{ show: false }}
            />
          )}
          tableTitleComponent={
            <div>
              <UserPlus /> <strong>approved outlet</strong>
            </div>
          }
        />
        <ConfirmAlert
          size={"sm"}
          deleteFunction={handleDelete}
          hide={setShowDelete}
          show={showDelete}
          title={"Confirm Delete"}
          description={"Are you sure you want to delete this!!"}
        />

        <ConfirmAlert
          size={"sm"}
          deleteFunction={handleApproveReject}
          hide={setShowReject}
          show={showReject}
          title={"Confirm reject"}
          description={"Are you sure you want to reject this!!"}
        />
      </Col>
    </>
  );
};

export default ApprovedOutlet;
