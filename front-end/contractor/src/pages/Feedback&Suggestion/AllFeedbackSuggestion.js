import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import { Helmet } from "react-helmet";
import {
  deleteFeedbackSuggestionById,
  getAllFeedbackSuggestion,
} from "../../services/contractorApi";
import { MdOutlineSms } from "react-icons/md";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ActionButtons from "../../components/DataTable/ActionButtons";
import StatusChip from "../../components/StatusChip";
import { createColumnHelper } from "@tanstack/react-table";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import CustomTable from "../../components/DataTable/CustomTable";
import TableHeader from "../../components/DataTable/TableHeader";
import { FileText } from "lucide-react";
import { UserDetail } from "../../components/ItemDetail";
import { toast } from "react-toastify";
import ConfirmAlert from "../../components/ConfirmAlert";
import { findMatchingPath, serialNumber } from "../../utils/helper";

const AllFeedbackSuggestion = () => {
  const columnHelper = createColumnHelper();
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || "10";
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [workImageId, setWorkImageId] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const { userPermission, user } = useSelector(selectUser);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [matchingPathObject, setMatchingPathObject] = useState(null);
  const { pathname } = useLocation();

  const fetchWorkImagesData = async () => {
    const res = await getAllFeedbackSuggestion(search, pageSize, pageNo);
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

  // for role and permissions
  useEffect(() => {
    if (userPermission) {
      const result = findMatchingPath(userPermission, pathname);
      setMatchingPathObject(result);
    }
  }, [userPermission, pathname, searchParams, navigate]);

  const checkPermission = matchingPathObject;

  const handleDelete = async () => {
    const res = await deleteFeedbackSuggestionById(workImageId);
    if (res.status) {
      toast.success(res.message);
      setRows((prev) => prev.filter((dlt) => dlt.id !== workImageId));
    } else {
      toast.error(res.message);
    }
    setWorkImageId("");
    setShowDelete(false);
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
        header: t("Title"),
        cell: (info) => info.getValue() || "-",
      }),
      columnHelper.accessor("description", {
        header: t("Description"),
        cell: (info) => info.getValue() || "-",
      }),
      columnHelper.accessor("response_by", {
        header: "Response From",
        cell: (info) => (
          <UserDetail
            img={info.row.original?.response_by?.image}
            name={info.row.original?.response_by?.name}
            login_id={user?.id}
            id={info.row.original?.response_by?.id}
            unique_id={info.row.original?.response_by?.employee_id}
            className={"d-align"}
          />
        ),
      }),
      columnHelper.accessor("status", {
        header: t("status"),
        cell: (info) => {
          return <StatusChip status={info.getValue()} />;
        },
      }),
      columnHelper.accessor("action", {
        header: "Action",
        cell: (info) => (
          <ActionButtons
            actions={{
              view: {
                show: checkPermission?.view,
                action: () =>
                  navigate(`/FeedbackSuggestion/view`, {
                    state: {
                      id: info.row.original.id,
                    },
                  }),
              },
              edit: {
                show: checkPermission?.update,
                icon: MdOutlineSms,
                tooltipTitle: "Response",
                disabled: info.row.original?.response_by?.name,
                action: () =>
                  navigate(`/FeedbackSuggestion/response`, {
                    state: {
                      id: info.row.original.id,
                    },
                  }),
              },
              delete: {
                show: checkPermission?.delete,
                action: () => {
                  setWorkImageId(info.row.original.id);
                  setShowDelete(true);
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
    fetchWorkImagesData();
  }, [search, pageNo, pageSize]);

  return (
    <>
      <Helmet>
        <title>Feedback And Suggestion · CMS Electricals</title>
      </Helmet>
      <CustomTable
        id={"all_feedback_and_auggestion"}
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
        apiForExcelPdf={getAllFeedbackSuggestion}
        customHeaderComponent={() => (
          <TableHeader
            userPermission={checkPermission}
            setSearchText={setSearch}
            button={{
              noDrop: true,
              to: `/FeedbackSuggestion/create`,
              title: "Create",
            }}
          />
        )}
        tableTitleComponent={
          <div>
            <FileText /> <strong>All - Feedback And Suggestion</strong>
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
    </>
  );
};

export default AllFeedbackSuggestion;
