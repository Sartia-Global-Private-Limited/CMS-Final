import React, { useEffect, useMemo, useState } from "react";
import { Col } from "react-bootstrap";
import { toast } from "react-toastify";
import ConfirmAlert from "../../components/ConfirmAlert";
import { Helmet } from "react-helmet";
import {
  approveRejectQuotationById,
  deleteQuotationById,
  getWorkQuotation,
} from "../../services/contractorApi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ActionButtons from "../../components/DataTable/ActionButtons";
import CustomTable from "../../components/DataTable/CustomTable";
import { UserPlus } from "lucide-react";
import TableHeader from "../../components/DataTable/TableHeader";
import { createColumnHelper } from "@tanstack/react-table";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import { serialNumber } from "../../utils/helper";

const ApprovedWorkQuotation = ({ checkPermission }) => {
  const columnHelper = createColumnHelper();
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [search, setSearch] = useState("");
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [isLoading, setIsLoading] = useState(true);
  const { userPermission } = useSelector(selectUser);
  const navigate = useNavigate();
  const [showDelete, setShowDelete] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [quotationId, setQuotationId] = useState("");
  const { t } = useTranslation();

  const fetchWorkQuotationsAllData = async () => {
    const status = 2;
    const res = await getWorkQuotation(search, pageSize, pageNo, status);
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
    const res = await deleteQuotationById(quotationId);
    if (res.status) {
      toast.success(res.message);
      setRows((prev) => prev.filter((itm) => itm.id !== quotationId));
    } else {
      toast.error(res.message);
    }
    setQuotationId("");
    setShowDelete(false);
  };

  const handleApproveReject = async () => {
    const status = "3";
    const res = await approveRejectQuotationById(status, quotationId);
    if (res.status) {
      toast.success(res.message);
      setRows((prev) => prev.filter((itm) => itm.id !== quotationId));
      fetchWorkQuotationsAllData();
    } else {
      toast.error(res.message);
    }
    setQuotationId("");
    setShowReject(false);
  };

  useEffect(() => {
    fetchWorkQuotationsAllData();
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
      columnHelper.accessor("quotation_dates", {
        header: "quotation date",
      }),
      columnHelper.accessor("quotations_number", {
        header: "quotation number",
      }),
      columnHelper.accessor("regional_office_name", {
        header: "regional office name",
      }),
      columnHelper.accessor("sales_area_name", {
        header: "sales area name",
      }),
      columnHelper.accessor("outlet_name", {
        header: "outlet name",
      }),
      columnHelper.accessor("po_name", {
        header: "po",
      }),
      columnHelper.accessor("complaint_type", {
        header: "complaint type",
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
                    `/create-quotation/${info.row.original.id}?type=view`
                  ),
              },
              edit: {
                show: checkPermission?.update,
                action: () =>
                  navigate(`/create-quotation/${info.row.original.id}`),
              },
              delete: {
                show: checkPermission?.delete,
                action: () => {
                  setQuotationId(info.row.original.id);
                  setShowDelete(true);
                },
              },
              reject: {
                show: checkPermission?.update,
                action: () => {
                  setQuotationId(info.row.original.id);
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
        <title>Work Quotation · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CustomTable
          id={"approved_quotation"}
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
              button={{
                show: false,
              }}
            />
          )}
          tableTitleComponent={
            <div>
              <UserPlus /> <strong>approved quotation</strong>
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

export default ApprovedWorkQuotation;
