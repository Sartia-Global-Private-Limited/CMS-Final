import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import {
  PostApprovedRejectSurvey,
  getAllRequestedSurvey,
} from "../../services/authapi";
import ConfirmAlert from "../../components/ConfirmAlert";
import ActionButtons from "../../components/DataTable/ActionButtons";
import { getDateValue, serialNumber } from "../../utils/helper";
import CustomTable from "../../components/DataTable/CustomTable";
import TableHeader from "../../components/DataTable/TableHeader";
import { FileText } from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";

const RequestSurvey = ({ checkPermission }) => {
  const columnHelper = createColumnHelper();
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || "10";
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { userPermission } = useSelector(selectUser);
  const { t } = useTranslation();
  const [showApprove, setShowApprove] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [approveData, setApproveData] = useState("");
  const [rejectData, setRejectData] = useState("");

  const fetchAllSurveyData = async () => {
    const status = 1;
    const res = await getAllRequestedSurvey(search, pageSize, pageNo, status);
    if (res.status) {
      setRows(res.data);
      setTotalData(res?.pageDetails?.total);
    } else {
      setRows([]);
      setTotalData(0);
    }
    setIsLoading(false);
  };

  const handleApproved = async () => {
    const sData = {
      survey_id: approveData.survey_id,
      status: 2,
    };
    const res = await PostApprovedRejectSurvey(sData);
    if (res.status) {
      toast.success(res.message);
      setRows((prev) =>
        prev.filter((itm) => itm.survey_id !== +approveData.survey_id)
      );
    } else {
      toast.error(res.message);
    }
    setApproveData("");
    setShowApprove(false);
  };

  const handleRejected = async () => {
    const sData = {
      survey_id: rejectData.survey_id,
      status: 3,
    };
    const res = await PostApprovedRejectSurvey(sData);
    if (res.status) {
      toast.success(res.message);
      setRows((prev) =>
        prev.filter((itm) => itm.survey_id !== +rejectData.survey_id)
      );
    } else {
      toast.error(res.message);
    }
    setRejectData("");
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
      columnHelper.accessor("title", {
        header: t("Survey"),
        cell: (info) => info.getValue() || "-",
      }),
      columnHelper.accessor("created_at", {
        header: t("Date"),
        cell: (info) => getDateValue(info.getValue()),
      }),
      columnHelper.accessor("action", {
        header: "Action",
        cell: (info) => (
          <ActionButtons
            actions={{
              approve: {
                show: checkPermission?.update,
                action: () => {
                  setApproveData(info.row.original);
                  setShowApprove(true);
                },
              },
              reject: {
                show: checkPermission?.update,
                action: () => {
                  setRejectData(info.row.original);
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
    fetchAllSurveyData();
  }, [search, pageSize, pageNo]);

  return (
    <>
      <Helmet>
        <title>All Survey · CMS Electricals</title>
      </Helmet>

      <CustomTable
        id={"request_survey"}
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
        apiForExcelPdf={getAllRequestedSurvey}
        customHeaderComponent={() => (
          <TableHeader
            userPermission={checkPermission}
            setSearchText={setSearch}
            button={{
              noDrop: true,
              to: `/survey/create`,
              title: "Create",
            }}
          />
        )}
        tableTitleComponent={
          <div>
            <FileText /> <strong>Request Survey</strong>
          </div>
        }
      />

      <ConfirmAlert
        size={"sm"}
        deleteFunction={handleApproved}
        hide={setShowApprove}
        show={showApprove}
        title={"Confirm Approve"}
        description={"Are you sure you want to approve this!!"}
      />

      <ConfirmAlert
        size={"sm"}
        deleteFunction={handleRejected}
        hide={setShowReject}
        show={showReject}
        title={"Confirm reject"}
        description={"Are you sure you want to reject this!!"}
      />
    </>
  );
};

export default RequestSurvey;
