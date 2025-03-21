import React, { useEffect, useMemo, useState } from "react";
import { Col } from "react-bootstrap";
import { getAllAssets } from "../../services/contractorApi";
import { Helmet } from "react-helmet";
import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate, useSearchParams } from "react-router-dom";
import { selectUser } from "../../features/auth/authSlice";
import { useSelector } from "react-redux";
import ActionButtons from "../../components/DataTable/ActionButtons";
import StatusChip from "../../components/StatusChip";
import CustomTable from "../../components/DataTable/CustomTable";
import TableHeader from "../../components/DataTable/TableHeader";
import { UserPlus } from "lucide-react";
import { serialNumber } from "../../utils/helper";
import { useTranslation } from "react-i18next";

const RejectedAssets = ({ checkPermission }) => {
  const columnHelper = createColumnHelper();
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const { userPermission } = useSelector(selectUser);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const fetchAllAssetsData = async () => {
    const status = 3;
    const isDropdown = false;
    const res = await getAllAssets({
      search,
      pageSize,
      pageNo,
      isDropdown,
      status,
    });
    setIsLoading(true);
    if (res.status) {
      setRows(res?.data);
      setTotalData(res?.pageDetails?.total);
    } else {
      setRows([]);
      setTotalData(0);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAllAssetsData();
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
      columnHelper.accessor("asset_name", {
        header: "Asset Name",
      }),
      columnHelper.accessor("asset_model_number", {
        header: "Asset Model Number",
      }),
      columnHelper.accessor("asset_uin_number", {
        header: "Asset UIN Number",
      }),
      columnHelper.accessor("asset_price", {
        header: "Asset Price",
      }),
      columnHelper.accessor("asset_purchase_date", {
        header: "Purchase Date",
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => <StatusChip status="rejected" />,
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
                    `/AllAssets/CreateAssets/${info.row.original.id}?type=view`
                  ),
              },
            }}
          />
        ),
      }),
    ],
    [checkPermission, rows.length, pageNo, pageSize]
  );
  return (
    <Col md={12} data-aos={"fade-up"}>
      <Helmet>
        <title>All Rejected Assets · CMS Electricals</title>
      </Helmet>
      <CustomTable
        id={"rejected_assets"}
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
            setSearchText={setSearch}
            button={{ show: false }}
            userPermission={checkPermission}
          />
        )}
        tableTitleComponent={
          <div>
            <UserPlus /> <strong>rejected assets</strong>
          </div>
        }
      />
    </Col>
  );
};

export default RejectedAssets;
