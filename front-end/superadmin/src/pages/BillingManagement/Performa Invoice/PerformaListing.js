import React, { useEffect, useMemo, useState } from "react";
import { Col, Row } from "react-bootstrap";
import "react-best-tabs/dist/index.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import {
  getAllBillNumber,
  getAllPerformaInvoice,
  getAllPoListInvoice,
  getAllRoListInvoice,
} from "../../../services/contractorApi";
import FormLabelText from "../../../components/FormLabelText";
import ActionButtons from "../../../components/DataTable/ActionButtons";
import TableHeader from "../../../components/DataTable/TableHeader";
import { UserPlus } from "lucide-react";
import CustomTable from "../../../components/DataTable/CustomTable";
import { selectUser } from "../../../features/auth/authSlice";
import { useSelector } from "react-redux";
import { createColumnHelper } from "@tanstack/react-table";
import { serialNumber } from "../../../utils/helper";

const PerformaListing = () => {
  const columnHelper = createColumnHelper();
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { userPermission } = useSelector(selectUser);
  const [poId, setPoId] = useState("");
  const { t } = useTranslation();

  const [allBillNumber, setAllBillNumber] = useState([]);
  const [regionalOfficceId, setRegionalOfficeId] = useState({});
  const [allPo, setAllPo] = useState([]);
  const [allRegionalOffice, setAllRegionalOffice] = useState([]);
  const [billNumber, setBillNumber] = useState({});

  const fetchExpenseRequestData = async () => {
    let status = 1;
    const res = await getAllPerformaInvoice({
      po_id: poId?.id,
      regional_office_id: regionalOfficceId.id,
      bill_number: billNumber?.id,
      pageSize,
      pageNo,
      search,
      status,
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

  const fetchAllPo = async () => {
    const status = 1;
    const res = await getAllPoListInvoice({ status });
    if (res.status) {
      setAllPo(res.data);
    } else {
      setAllPo([]);
    }
  };

  const fetchAllRegionalOffice = async () => {
    const status = 1;
    const res = await getAllRoListInvoice({ status });
    if (res.status) {
      setAllRegionalOffice(res.data);
    } else {
      setAllRegionalOffice([]);
    }
  };

  const fetchAllBillNumber = async () => {
    const status = 1;
    const res = await getAllBillNumber(status);

    if (res.status) {
      setAllBillNumber(res.data);
    } else {
      setAllBillNumber([]);
    }
  };

  useEffect(() => {
    fetchAllPo();
    fetchAllRegionalOffice();
    fetchAllBillNumber();
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    fetchExpenseRequestData();
  }, [pageNo, pageSize, poId, regionalOfficceId, billNumber?.id]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("sr_no", {
        header: t("Sr No."),
        cell: (info) => {
          const serialNumbers = serialNumber(pageNo, pageSize);
          return serialNumbers[info.row.index];
        },
      }),
      columnHelper.accessor("bill_no", {
        header: "pi number",
      }),
      columnHelper.accessor("created_at", {
        header: "pi date",
      }),
      columnHelper.accessor("financial_year", {
        header: "financial year",
      }),
      columnHelper.accessor("ro_name", {
        header: "billing regioanl office",
        cell: (info) => info.row.original.billing_to_ro_office?.ro_name,
      }),
      columnHelper.accessor("outlet_name", {
        header: "outlet name",
        cell: (info) => (
          <div>
            {info.row.original.outletDetails.length > 0
              ? info.row.original?.outletDetails?.map((item, idx) => (
                  <li> {item?.outlet_name ?? "--"}</li>
                ))
              : "--"}
          </div>
        ),
      }),
      columnHelper.accessor("complaint_unique_id", {
        header: "complaint id",
        cell: (info) => (
          <div>
            {info.row.original.complaintDetails.length > 0
              ? info.row.original?.complaintDetails?.map((item, idx) => (
                  <li> {item?.complaint_unique_id ?? "--"}</li>
                ))
              : "--"}
          </div>
        ),
      }),
      columnHelper.accessor("po_number", {
        header: "po number",
      }),
      columnHelper.accessor("action", {
        header: "Action",
        cell: (info) => (
          <ActionButtons
            actions={{
              view: {
                show: true,
                action: () =>
                  navigate(`/view-performa-invoice`, {
                    state: {
                      id: info.row.original?.id,
                    },
                  }),
              },
              edit: {
                show: true,
                action: () =>
                  navigate(`/PerformaInvoice/CreatePerformaInvoice/edit`, {
                    state: {
                      regionalOfficceId: {
                        name: info.row.original?.billing_to_ro_office.ro_name,
                        id: info.row.original?.billing_to_ro_office.ro_id,
                      },
                      measurements: [info.row.original.id],

                      poId: {
                        id: info.row.original?.po_id,
                        name: info.row.original?.po_number,
                      },
                    },
                  }),
              },
            }}
          />
        ),
      }),
    ],
    [rows.length, pageNo, pageSize]
  );

  return (
    <div className="m-2">
      <div className="shadow p-2 rounded">
        <Row>
          <Col md={3}>
            <FormLabelText children={t("po number")} />
            <Select
              menuPortalTarget={document.body}
              options={allPo?.map((user) => ({
                label: user.po_number,
                value: user.id,
              }))}
              onChange={(e) => {
                setRegionalOfficeId({});
                if (e) {
                  setPoId({ id: e?.value, name: e?.label });
                } else {
                  setPoId({});
                }
              }}
              isClearable
            />
          </Col>

          <Col md={3}>
            <FormLabelText children={t("regional office")} />
            <Select
              menuPortalTarget={document.body}
              options={allRegionalOffice?.map((user) => ({
                label: user.regional_office_name,
                value: user.ro_id,
              }))}
              onChange={(e) => {
                if (e) {
                  setRegionalOfficeId({ id: e?.value, name: e?.label });
                } else setRegionalOfficeId({});
              }}
              isClearable
            />
          </Col>

          <Col md={3}>
            <FormLabelText children={t("bill number")} />
            <Select
              menuPortalTarget={document.body}
              options={allBillNumber?.map((user) => ({
                label: user.bill_no,
                value: user.bill_no,
              }))}
              onChange={(e) => {
                setBillNumber({ id: e?.value, name: e?.label });
              }}
              isClearable
            />
          </Col>
        </Row>
      </div>
      <CustomTable
        id={"performa_invoice"}
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
            userPermission={userPermission}
            setSearchText={setSearch}
            button={{ show: false }}
          />
        )}
        tableTitleComponent={
          <div>
            <UserPlus /> <strong> performa invoice</strong>
          </div>
        }
      />
    </div>
  );
};

export default PerformaListing;
