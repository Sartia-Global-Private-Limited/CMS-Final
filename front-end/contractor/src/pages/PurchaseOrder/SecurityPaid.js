import React, { useEffect, useMemo, useState } from "react";
import { Col, Row } from "react-bootstrap";
import {
  getAllPoInSecurityEligible,
  getAllSecurityIdListing,
  getAllRoInSecurityEligible,
  getAllPurchaseOrder,
} from "../../services/contractorApi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import FormLabelText from "../../components/FormLabelText";
import { createColumnHelper } from "@tanstack/react-table";
import { selectUser } from "../../features/auth/authSlice";
import { useSelector } from "react-redux";
import ActionButtons from "../../components/DataTable/ActionButtons";
import CustomTable from "../../components/DataTable/CustomTable";
import TableHeader from "../../components/DataTable/TableHeader";
import { ShieldCheck } from "lucide-react";
import { serialNumber } from "../../utils/helper";

const SecurityPaid = ({ checkPermission }) => {
  const columnHelper = createColumnHelper();
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { userPermission } = useSelector(selectUser);
  const [allRo, setAllRo] = useState([]);
  const [roId, setRoId] = useState({ label: "", value: "" });
  const [allPo, setAllPo] = useState([]);
  const [poId, setPoId] = useState({ label: "", value: "" });
  const [security_id, setSecurity_id] = useState("");
  const [allSecurity, setAllSecurity] = useState([]);
  const { t } = useTranslation();

  const navigate = useNavigate();

  const fetchSecurityDepositData = async () => {
    const status = 3;
    const po_status = 2;
    const res = await getAllPurchaseOrder({
      search,
      pageSize,
      pageNo,
      status,
      po_status,
      ro_office: roId?.value,
      po_number: poId?.label,
      security_id,
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

  const fetchAllRo = async () => {
    const status = 3;
    const res = await getAllRoInSecurityEligible(status);
    if (res.status) {
      setAllRo(res.data);
    } else {
      setAllRo([]);
    }
  };
  const fetchAllPo = async () => {
    const status = 3;
    const res = await getAllPoInSecurityEligible(status, roId.value);
    if (res.status) {
      setAllPo(res.data);
    } else {
      setAllPo([]);
    }
  };
  const fetchAllSecurity = async () => {
    const status = 3;
    const res = await getAllSecurityIdListing(status, poId.label);
    if (res.status) {
      setAllSecurity(res.data);
    } else {
      setAllSecurity([]);
    }
  };

  useEffect(() => {
    fetchSecurityDepositData();
  }, [search, pageNo, pageSize, roId.value, poId.value, security_id]);

  useEffect(() => {
    fetchAllPo();
    fetchAllRo();
    fetchAllSecurity();
  }, [poId.value, roId.value, security_id]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("sr_no", {
        header: t("Sr No."),
        cell: (info) => {
          const serialNumbers = serialNumber(pageNo, pageSize);
          return serialNumbers[info.row.index];
        },
      }),
      columnHelper.accessor("security_unique_id", {
        header: "security unique id",
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
      columnHelper.accessor("payment_reference_number", {
        header: "payment reference number",
      }),
      columnHelper.accessor("date", {
        header: "paid date",
      }),
      columnHelper.accessor("status", {
        header: "status",
        cell: (info) => <div className={`text-${"green"}`}>Paid</div>,
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
    ],
    [checkPermission, t, rows.length, pageNo, pageSize]
  );

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
                isDisabled={poId.value}
                options={allRo?.map((data) => ({
                  label: data.regional_office_name,
                  value: data.id,
                }))}
                value={roId.value && roId}
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
                isDisabled={security_id}
                options={allPo?.map((data) => ({
                  label: data.po_number,
                  value: data.id,
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

            <Col md={3}>
              <FormLabelText children={t("po number")} />

              <Select
                menuPortalTarget={document.body}
                options={allSecurity.map((data) => ({
                  label: data.security_unique_id,
                  value: data.security_unique_id,
                }))}
                onChange={(e) => {
                  setSecurity_id(e ? e.value : "");
                }}
                isClearable
              />
            </Col>
          </Row>
        </div>
        <CustomTable
          maxHeight="44vh"
          id={"security_process"}
          userPermission={checkPermission}
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
            />
          )}
          tableTitleComponent={
            <div>
              <ShieldCheck /> <strong>security paid</strong>
            </div>
          }
        />
      </div>
    </>
  );
};

export default SecurityPaid;
