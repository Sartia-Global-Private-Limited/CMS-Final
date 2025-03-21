import React, { useEffect, useMemo, useState } from "react";
import { Col, Row, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  approveEligibleSecurity,
  getAllPoInSecurityEligible,
  getAllPurchaseOrder,
  getAllRoInSecurityEligible,
} from "../../services/contractorApi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import FormLabelText from "../../components/FormLabelText";
import { selectUser } from "../../features/auth/authSlice";
import { useSelector } from "react-redux";
import { createColumnHelper } from "@tanstack/react-table";
import { ShieldCheck } from "lucide-react";
import TooltipComponent from "../../components/TooltipComponent";
import TableHeader from "../../components/DataTable/TableHeader";
import CustomTable, {
  selectable,
} from "../../components/DataTable/CustomTable";
import ActionButtons from "../../components/DataTable/ActionButtons";
import { FaClipboardCheck } from "react-icons/fa";
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
  const [refresh, setRefresh] = useState([]);
  const [allRo, setAllRo] = useState([]);
  const [roId, setRoId] = useState({ label: "", value: "" });
  const [allPo, setAllPo] = useState([]);
  const [poId, setPoId] = useState({ label: "", value: "" });

  const { t } = useTranslation();

  const navigate = useNavigate();

  const fetchSecurityDepositData = async () => {
    const po_status = 2;
    const status = "1";
    const res = await getAllPurchaseOrder({
      search,
      pageSize,
      pageNo,
      status,
      po_status,
      ro_office: roId?.value,
      po_number: poId?.label,
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

  const fetchAllRo = async () => {
    const status = 1;
    const res = await getAllRoInSecurityEligible(status);
    if (res.status) {
      setAllRo(res.data);
    } else {
      setAllRo([]);
    }
  };
  const fetchAllPo = async () => {
    const status = 1;
    const res = await getAllPoInSecurityEligible(status, roId?.value);
    if (res.status) {
      setAllPo(res.data);
    } else {
      setAllPo([]);
    }
  };
  const handleApproveSecurity = async (tableIds) => {
    const sData = { po_ids: tableIds };
    const res = await approveEligibleSecurity(sData);
    if (res.status) {
      toast.success(res.message);
      setRefresh((e) => !e);
    } else {
      toast.error(res.message);
    }
  };

  useEffect(() => {
    fetchSecurityDepositData();
  }, [refresh, search, pageNo, pageSize]);

  useEffect(() => {
    fetchAllRo();
    fetchAllPo();
  }, [roId?.value, poId.value]);

  const columns = useMemo(() => {
    const baseColumns = [
      columnHelper.accessor("sr_no", {
        header: t("Sr No."),
        cell: (info) => {
          const serialNumbers = serialNumber(pageNo, pageSize);
          return serialNumbers[info.row.index];
        },
      }),
      columnHelper.accessor("po_number", {
        header: "po number",
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
                  navigate(`/PurchaseOrder/security-deposit/view`, {
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
      <div className="shadow p-2 rounded m-2">
        <Row className="p-2 ">
          <Col md={3}>
            <FormLabelText children={t("regional office")} />

            <Select
              menuPortalTarget={document.body}
              options={allRo?.map((data) => ({
                label: data?.regional_office_name,
                value: data?.id,
              }))}
              value={roId.value && roId}
              isDisabled={poId.value}
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
            <FormLabelText children={t("po number")} />
            <Select
              menuPortalTarget={document.body}
              options={allPo?.map((data) => ({
                label: data?.po_number,
                value: data?.id,
              }))}
              value={poId.value && poId}
              onChange={(e) => {
                if (e) {
                  setPoId({ value: e?.value, label: e?.label });
                } else {
                  setPoId({});
                }
              }}
              isClearable
            />
          </Col>
        </Row>
      </div>
      <CustomTable
        maxHeight="44vh"
        id={"security_eligible"}
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
            button={{ show: false }}
            extraComponent={
              selectedRows?.info?.length > 0 && (
                <TooltipComponent title={"approve"} align="top">
                  <Button
                    variant="success"
                    onClick={() => {
                      // setTableIds(
                      //   selectedRows.info.map((itm) => itm.original.id)
                      // );
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
    </>
  );
};

export default SecurityEligible;
