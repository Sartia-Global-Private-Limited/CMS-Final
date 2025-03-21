import React, { useState, useEffect, Fragment, useMemo } from "react";
import { Col } from "react-bootstrap";
import { getAllEarthingTesting } from "../../services/contractorApi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ActionButtons from "../../components/DataTable/ActionButtons";
import { getDateValue, serialNumber } from "../../utils/helper";
import { UserDetails } from "../../components/ItemDetail";
import { createColumnHelper } from "@tanstack/react-table";
import CustomTable from "../../components/DataTable/CustomTable";
import TableHeader from "../../components/DataTable/TableHeader";
import { FileText } from "lucide-react";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import StatusChip from "../../components/StatusChip";

const RejectedEarthingTesting = ({ checkPermission }) => {
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

  const fetchAllAssetsRepairRequireData = async () => {
    const status = 3;
    const res = await getAllEarthingTesting({
      search,
      pageSize,
      pageNo,
      status,
    });
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
            {info.row.original?.user_data.slice(0, 5).map((itm, index) => (
              <Fragment key={index}>
                <UserDetails
                  img={itm?.image}
                  name={itm?.name}
                  id={itm?.user_id}
                  login_id={user?.id}
                  unique_id={itm?.employee_id}
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
                  navigate(`/earthing-testing/view`, {
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
    fetchAllAssetsRepairRequireData();
  }, [search, pageNo, pageSize]);

  return (
    <>
      <Col md={12}>
        <CustomTable
          id={"rejected_earthing_testing"}
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
              button={{ show: false }}
            />
          )}
          tableTitleComponent={
            <div>
              <FileText /> <strong>Rejected Earthing Testing</strong>
            </div>
          }
        />
      </Col>
    </>
  );
};

export default RejectedEarthingTesting;
