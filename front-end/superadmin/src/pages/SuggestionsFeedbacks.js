import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { createColumnHelper } from "@tanstack/react-table";
import { useSelector } from "react-redux";
import { selectUser } from "../features/auth/authSlice";
import CustomTable from "../components/DataTable/CustomTable";
import TableHeader from "../components/DataTable/TableHeader";
import { FileText } from "lucide-react";
import { UserDetail } from "../components/ItemDetail";
import {
  deleteFeedbackSuggestionById,
  getAdminAllSuggestionsFeedbacks,
} from "../services/authapi";
import { getDateValue, serialNumber } from "../utils/helper";
import ActionButtons from "../components/DataTable/ActionButtons";
import ConfirmAlert from "../components/ConfirmAlert";
import { toast } from "react-toastify";
import { MdOutlineSms } from "react-icons/md";
const SuggestionsFeedbacks = () => {
  const columnHelper = createColumnHelper();
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || "10";
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { userPermission, user } = useSelector(selectUser);
  const { t } = useTranslation();
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const navigate = useNavigate();
  
  const fetchFeedbackData = async () => {
    const res = await getAdminAllSuggestionsFeedbacks(search, pageSize, pageNo);
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
    const res = await deleteFeedbackSuggestionById(deleteId);
    if (res.status) {
      toast.success(res.message);
      setRows((prev) => prev.filter((dlt) => dlt.id !== deleteId));
    } else {
      toast.error(res.message);
    }
    setDeleteId("");
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
      columnHelper.accessor("created_by", {
        header: "User Name",
        cell: (info) => (
          <UserDetail
            img={info.row.original?.created_by?.image}
            name={info.row.original?.created_by?.name}
            login_id={user?.id}
            id={info.row.original?.created_by?.id}
            unique_id={info.row.original?.created_by?.unique_id}
            className={"d-align"}
          />
        ),
      }),
      columnHelper.accessor("title", {
        header: t("Title"),
        cell: (info) => info.getValue() || "-",
      }),
      columnHelper.accessor("description", {
        header: t("Description"),
        cell: (info) => info.getValue() || "-",
      }),
      columnHelper.accessor("created_at", {
        header: t("Created at"),
        cell: (info) => getDateValue(info.getValue()),
      }),
      columnHelper.accessor("action", {
        header: "Action",
        cell: (info) => (
          <ActionButtons
            actions={{
              view: {
                show: true,
                action: () =>
                  navigate(`/FeedbackSuggestion/view`, {
                    state: {
                      id: info.row.original.id,
                    },
                  }),
              },
              edit: {
                show: true,
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
                show: true,
                action: () => {
                  setDeleteId(info.row.original.id);
                  setShowDelete(true);
                },
              },
            }}
          />
        ),
      }),
    ],
    [rows.length, pageNo, pageSize]
  );

  useEffect(() => {
    fetchFeedbackData();
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
        apiForExcelPdf={getAdminAllSuggestionsFeedbacks}
        customHeaderComponent={() => (
          <TableHeader
            userPermission={userPermission}
            setSearchText={setSearch}
            button={{
              show: false,
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

export default SuggestionsFeedbacks;
