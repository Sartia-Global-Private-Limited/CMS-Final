import React, { useEffect, useMemo, useState } from "react";
import { Col, Row, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import ConfirmAlert from "../../components/ConfirmAlert";
import {
  approveEligibleSecurityInSo,
  deleteSalesOrderById,
  getAllRoForSoInSecurityEligible,
  getAllSalesOrder,
  getAllSoInSecurityEligible,
} from "../../services/contractorApi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import { FaClipboardCheck } from "react-icons/fa";
import FormLabelText from "../../components/FormLabelText";
import { createColumnHelper } from "@tanstack/react-table";
import { selectUser } from "../../features/auth/authSlice";
import { useSelector } from "react-redux";
import ActionButtons from "../../components/DataTable/ActionButtons";
import CustomTable, {
  selectable,
} from "../../components/DataTable/CustomTable";
import TableHeader from "../../components/DataTable/TableHeader";
import { ShieldCheck } from "lucide-react";
import TooltipComponent from "../../components/TooltipComponent";
import { serialNumber } from "../../utils/helper";

const SecurityEligible = ({ checkPermission }) => {
  const columnHelper = createColumnHelper();
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { userPermission } = useSelector(selectUser);
  const [showDelete, setShowDelete] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");
  const [allRo, setAllRo] = useState([]);
  const [roId, setRoId] = useState({ label: "", value: "" });
  const [allSo, setAllSo] = useState([]);
  const [soId, setSoId] = useState({ label: "", value: "" });
  const [refresh, setRefresh] = useState(false);

  const { t } = useTranslation();

  const navigate = useNavigate();

  const fetchSecurityDepositData = async () => {
    const so_status = 2;
    const status = "1";
    const res = await getAllSalesOrder({
      search,
      pageSize,
      pageNo,
      status,
      so_status,
      ro_office: roId?.value,
      so_number: soId?.label,
    });
    if (res.status) {
      setRows(res?.data);
      setTotalData(res?.pageDetails?.total);
    } else {
      setRows([]);
      setTotalData(0);
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    const res = await deleteSalesOrderById(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setRows((prev) => prev.filter((itm) => itm.id !== +idToDelete));
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowDelete(false);
  };

  const fetchAllRo = async () => {
    const status = 1;
    const res = await getAllRoForSoInSecurityEligible(status);

    if (res.status) {
      setAllRo(res.data);
    } else {
      setAllRo([]);
    }
  };
  const fetchAllSo = async () => {
    const status = 1;
    const res = await getAllSoInSecurityEligible(status, roId?.value);

    if (res.status) {
      setAllSo(res.data);
    } else {
      setAllSo([]);
    }
  };

  const handleApproveSecurity = async (tableIds) => {
    const sData = { so_ids: tableIds };
    const res = await approveEligibleSecurityInSo(sData);
    if (res.status) {
      toast.success(res.message);
      setRefresh((e) => !e);
    } else {
      toast.error(res.message);
    }
  };

  useEffect(() => {
    fetchSecurityDepositData();
  }, [refresh, search, pageNo, pageSize, soId.label, roId.value]);

  useEffect(() => {
    fetchAllRo();
    fetchAllSo();
  }, [roId?.value, soId.label]);

  const columns = useMemo(() => {
    const baseColumns = [
      columnHelper.accessor("sr_no", {
        header: t("Sr No."),
        cell: (info) => {
          const serialNumbers = serialNumber(pageNo, pageSize);
          return serialNumbers[info.row.index];
        },
      }),
      columnHelper.accessor("so_number", {
        header: "so number",
      }),
      columnHelper.accessor("tender_date", {
        header: "tender date",
      }),

      columnHelper.accessor("tender_number", {
        header: "tender number",
      }),
      columnHelper.accessor("security_deposit_date", {
        header: "security deposit date",
      }),
      columnHelper.accessor("security_deposit_amount", {
        header: "security deposit amount",
      }),
      columnHelper.accessor("regional_office_name", {
        header: "regional office name",
      }),
      columnHelper.accessor("status", {
        header: "status",
        cell: (info) => <div className={`text-${"green"}`}>Eligible</div>,
      }),

      columnHelper.accessor("action", {
        header: "Action",
        cell: (info) => (
          <ActionButtons
            actions={{
              view: {
                show: checkPermission?.view,
                action: () =>
                  navigate(`/sales-Order/security-deposit/view`, {
                    state: {
                      id: info.row.original.id,
                    },
                  }),
              },
            }}
          />
        ),
      }),
    ];

    if (roId?.value) {
      baseColumns.unshift(selectable);
    }

    return baseColumns;
  }, [checkPermission, t, roId?.value, pageNo, pageSize]);

  return (
    <>
      <Helmet>
        <title>Security Deposit · CMS Electricals</title>
      </Helmet>

      <div className="overflow-auto p-3 mb-2">
        <div className="shadow p-2 rounded">
          <Row className="p-2">
            <Col md={3}>
              <FormLabelText children={t("regional office")} />
              <Select
                menuPortalTarget={document.body}
                options={allRo?.map((data) => ({
                  label: data?.regional_office_name,
                  value: data?.id,
                }))}
                value={roId.value && roId}
                isDisabled={soId.value}
                onChange={(e) => {
                  if (e) {
                    setRoId({ value: e?.value, label: e?.label });
                  } else {
                    setRoId({});
                  }
                }}
                isClearable
              />
            </Col>
            <Col md={3}>
              <FormLabelText children={t("so number")} />
              <Select
                menuPortalTarget={document.body}
                options={allSo?.map((data) => ({
                  label: data.so_number,
                  value: data.id,
                }))}
                value={soId.value && soId}
                onChange={(e) => {
                  if (e) {
                    setSoId({ value: e?.value, label: e?.label });
                  } else {
                    setSoId({});
                  }
                }}
                isClearable
              />
            </Col>
          </Row>
          {/* <div className="d-flex justify-content-end">
            {roId?.value && selectedInvoices.length > 0 && (
              <button
                className="shadow border-0 purple-combo cursor-pointer px-4 py-1 me-4"
                onClick={() => handleApproveSecurity()}
              >
                <FaClipboardCheck />
                {t("Approve")}
              </button>
            )}
          </div> */}
        </div>
        <CustomTable
          maxHeight="44vh"
          id={"security_deposit"}
          checkPermission={checkPermission}
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
              checkPermission={checkPermission}
              setSearchText={setSearch}
              button={{
                show: false,
              }}
              extraComponent={
                selectedRows?.info?.length > 0 && (
                  <TooltipComponent title={"approve"} align="top">
                    <Button
                      variant="success"
                      onClick={() => {
                        handleApproveSecurity(
                          selectedRows.info.map((itm) => itm.original.id)
                        );
                      }}
                    >
                      <FaClipboardCheck />
                      {t("Approve")}
                    </Button>
                  </TooltipComponent>
                )
              }
            />
          )}
          tableTitleComponent={
            <div>
              <ShieldCheck /> <strong>security eligible</strong>
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
      </div>
    </>
  );
};

export default SecurityEligible;
