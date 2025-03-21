import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ActionButtons from "../../components/DataTable/ActionButtons";
import StatusChip from "../../components/StatusChip";
import { createColumnHelper } from "@tanstack/react-table";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import CustomTable from "../../components/DataTable/CustomTable";
import TableHeader from "../../components/DataTable/TableHeader";
import { FileText } from "lucide-react";
import { getDateValue, serialNumber } from "../../utils/helper";
import { getAllRequestedSurvey } from "../../services/authapi";

const RejectedSurvey = ({ checkPermission }) => {
  const columnHelper = createColumnHelper();
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || "10";
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const { userPermission } = useSelector(selectUser);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const fetchSurveyData = async () => {
    const status = 3;
    const res = await getAllRequestedSurvey(search, pageSize, pageNo, status);
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
      columnHelper.accessor("created_at", {
        header: t("Created at"),
        cell: (info) => getDateValue(info.getValue()),
      }),
      columnHelper.accessor("status", {
        header: t("status"),
        cell: (info) => <StatusChip status={"Rejected"} />,
      }),
      columnHelper.accessor("action", {
        header: "Action",
        cell: (info) => (
          <ActionButtons
            actions={{
              view: {
                show: checkPermission?.view,
                action: () =>
                  navigate(`/survey/view-response`, {
                    state: {
                      id: info.row.original.survey_id,
                      status: "rejected",
                    },
                  }),
              },
            }}
          />
        ),
      }),
    ],
    [checkPermission, rows.length, pageNo, pageSize]
  );

  useEffect(() => {
    fetchSurveyData();
  }, [search, pageNo, pageSize]);

  return (
    <>
      <Helmet>
        <title>Rejected Survey · CMS Electricals</title>
      </Helmet>
      <CustomTable
        id={"rejected_survey"}
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
              show: false,
            }}
          />
        )}
        tableTitleComponent={
          <div>
            <FileText /> <strong>Rejected Survey</strong>
          </div>
        }
      />
    </>
  );
};

export default RejectedSurvey;
