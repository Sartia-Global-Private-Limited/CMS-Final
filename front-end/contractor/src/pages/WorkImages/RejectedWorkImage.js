import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { getAllWorkImages } from "../../services/contractorApi";
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
import { findMatchingPath, serialNumber } from "../../utils/helper";

const RejectedWorkImage = () => {
  const columnHelper = createColumnHelper();
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || "10";
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const { userPermission, user } = useSelector(selectUser);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [matchingPathObject, setMatchingPathObject] = useState(null);
  const { pathname } = useLocation();

  const fetchWorkImagesData = async () => {
    const status = 3;
    const res = await getAllWorkImages({ search, pageSize, pageNo, status });
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
      columnHelper.accessor("complaint_unique_id", {
        header: t("Complaint id"),
        cell: (info) => info.getValue() || "-",
      }),
      columnHelper.accessor("complaint_type_name", {
        header: t("Complaint Name"),
        cell: (info) => info.getValue() || "-",
      }),
      columnHelper.accessor("image_upload_by_name", {
        header: "Upload By",
        cell: (info) => (
          <UserDetail
            img={info.row.original?.image_upload_by_image}
            name={info.row.original?.image_upload_by_name}
            login_id={user?.id}
            id={info.row.original?.image_upload_by}
            unique_id={info.row.original?.image_upload_by_employee_id}
            className={"d-align"}
          />
        ),
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
                  navigate(`/WorkImages/view`, {
                    state: {
                      id: info.row.original.id,
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
    fetchWorkImagesData();
  }, [search, pageNo, pageSize]);

  return (
    <>
      <Helmet>
        <title>Work Images · CMS Electricals</title>
      </Helmet>
      <CustomTable
        id={"rejected_work_images"}
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
        apiForExcelPdf={getAllWorkImages}
        customHeaderComponent={() => (
          <TableHeader
            userPermission={checkPermission}
            setSearchText={setSearch}
            button={{ show: false }}
          />
        )}
        tableTitleComponent={
          <div>
            <FileText /> <strong>Rejected - Work Images</strong>
          </div>
        }
      />
    </>
  );
};

export default RejectedWorkImage;
