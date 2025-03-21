import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import { Col, Table, Form, Button } from "react-bootstrap";
import CardComponent from "../../components/CardComponent";
import ReactPagination from "../../components/ReactPagination";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import ConfirmAlert from "../../components/ConfirmAlert";
import {
  deleteContactsById,
  getAllSupplierContacts,
} from "../../services/contractorApi";

import { useTranslation } from "react-i18next";
import { FaClipboardCheck } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createColumnHelper } from "@tanstack/react-table";
import { selectUser } from "../../features/auth/authSlice";
import { useSelector } from "react-redux";
import CustomTable, {
  selectable,
} from "../../components/DataTable/CustomTable";
import TableHeader from "../../components/DataTable/TableHeader";
import TooltipComponent from "../../components/TooltipComponent";
import { Send, UserPlus } from "lucide-react";
import { serialNumber } from "../../utils/helper";

const SupplierContacts = ({ checkPermission }) => {
  const columnHelper = createColumnHelper();
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const { userPermission } = useSelector(selectUser);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const fetchAllData = async () => {
    const isDropdown = false;
    const status = "2";
    const res = await getAllSupplierContacts(
      search,
      pageSize,
      pageNo,
      isDropdown,
      status
    );

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
    fetchAllData();
  }, [search, pageNo, pageSize]);

  const columns = useMemo(
    () => [
      selectable,
      columnHelper.accessor("sr_no", {
        header: t("Sr No."),
        cell: (info) => {
          const serialNumbers = serialNumber(pageNo, pageSize);
          return serialNumbers[info.row.index];
        },
      }),
      columnHelper.accessor("supplier_name", {
        header: "supplier name",
      }),
      columnHelper.accessor("supplier_code", {
        header: "supplier code",
      }),
      columnHelper.accessor("city", {
        header: "city",
        cell: (info) => info.row.original.supplier_addresses[0]?.city,
      }),
      columnHelper.accessor("pin_code", {
        header: "pin code",
        cell: (info) => info.row.original.supplier_addresses[0]?.pin_code,
      }),
      columnHelper.accessor("state", {
        header: "state",
        cell: (info) => info.row.original.supplier_addresses[0]?.state,
      }),
      columnHelper.accessor("landmark", {
        header: "landmark",
        cell: (info) => info.row.original.supplier_addresses[0]?.landmark,
      }),
    ],
    [checkPermission, rows.length, pageNo, pageSize]
  );

  return (
    <>
      <Helmet>
        <title>Contacts · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CustomTable
          id={"supplier_company"}
          isLoading={isLoading}
          rows={rows || []}
          columns={columns}
          pagination={{
            pageNo,
            pageSize,
            totalData,
          }}
          customHeaderComponent={(selectedRows) => (
            <TableHeader
              userPermission={checkPermission}
              setSearchText={setSearch}
              button={{ show: false }}
              extraComponent={
                selectedRows?.info?.length > 0 && (
                  <TooltipComponent title={"send"} align="top">
                    <Button
                      variant="success"
                      onClick={() => {
                        navigate(`/contacts/energy/send-messages/new`, {
                          state: {
                            id: selectedRows.info.map((itm) => itm.original.id),
                            data: rows,
                          },
                        });
                      }}
                    >
                      <Send size={14} className="me-1" />
                      Send Messages
                    </Button>
                  </TooltipComponent>
                )
              }
            />
          )}
          tableTitleComponent={
            <div>
              <UserPlus /> <strong>supplier contacts</strong>
            </div>
          }
        />
      </Col>
    </>
  );
};

export default SupplierContacts;
