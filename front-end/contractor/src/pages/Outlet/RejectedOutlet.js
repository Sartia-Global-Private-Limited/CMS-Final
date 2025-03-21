import React, { useEffect, useMemo, useState } from "react";
import { Col } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { getAllOutlet } from "../../services/contractorApi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { createColumnHelper } from "@tanstack/react-table";
import ActionButtons from "../../components/DataTable/ActionButtons";
import CustomTable from "../../components/DataTable/CustomTable";
import TableHeader from "../../components/DataTable/TableHeader";
import { UserPlus } from "lucide-react";
import { selectUser } from "../../features/auth/authSlice";
import { useSelector } from "react-redux";
import { serialNumber } from "../../utils/helper";
import { UserDetail } from "../../components/ItemDetail";

const RejectedOutlet = ({ checkPermission }) => {
  const columnHelper = createColumnHelper();
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [search, setSearch] = useState("");
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector(selectUser);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const fetchOutletAllData = async () => {
    const status = 3;
    const res = await getAllOutlet({ search, pageSize, pageNo, status });
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
          id={"rejected_outlet"}
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
              <UserPlus /> <strong>rejected outlet</strong>
            </div>
          }
        />
      </Col>
    </>
  );
};

export default RejectedOutlet;
