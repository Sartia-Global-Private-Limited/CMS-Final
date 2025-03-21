import React, { useState, useEffect, useMemo } from "react";
import { Col } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { getAllSuppliers } from "../../services/contractorApi";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { createColumnHelper } from "@tanstack/react-table";
import ActionButtons from "../../components/DataTable/ActionButtons";
import StatusChip from "../../components/StatusChip";
import CustomTable from "../../components/DataTable/CustomTable";
import TableHeader from "../../components/DataTable/TableHeader";
import { UserPlus } from "lucide-react";
import { serialNumber } from "../../utils/helper";
import { FaFileExcel } from "react-icons/fa";

const AllSuppliersOverview = ({ checkPermission }) => {
  const columnHelper = createColumnHelper();
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [search, setSearch] = useState("");
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const fetchSuppliersData = async () => {
    const isDropdown = "false";
    const res = await getAllSuppliers({ search, pageSize, pageNo, isDropdown });
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
    fetchSuppliersData();
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
      columnHelper.accessor("supplier_name", {
        header: "supplier name",
        cell: (info) => (
          <div>
            <Link
              className="text-secondary text-none"
              to={`/Suppliers/create-supplier/${info.row.original.id}?type=view`}
            >
              {info.row.original.supplier_name}
            </Link>
          </div>
        ),
      }),
      columnHelper.accessor("owner_name", {
        header: "owner name",
      }),
      columnHelper.accessor("cashier_name", {
        header: "cashier name",
      }),
      columnHelper.accessor("supplier_code", {
        header: "supplier code",
      }),
      columnHelper.accessor("bank_name", {
        header: "bank name",
      }),
      columnHelper.accessor("account_number", {
        header: "account name",
      }),
      columnHelper.accessor("status", {
        header: "status",
        cell: (info) => <StatusChip status={info.row.original.status} />,
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
                    `/Suppliers/create-supplier/${info.row.original.id}?type=view`
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
    <>
      <Helmet>
        <title>Suppliers · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CustomTable
          id={"rejected_supplier"}
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
              openImport={() => navigate(`/Suppliers/import`)}
              button={{
                to: `/Suppliers/create-supplier/new`,
                title: "Create",
              }}
            />
          )}
          tableTitleComponent={
            <div>
              <UserPlus /> <strong>All Supplier</strong>
            </div>
          }
        />
      </Col>
    </>
  );
};

export default AllSuppliersOverview;
