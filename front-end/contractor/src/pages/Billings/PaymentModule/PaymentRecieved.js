import React, { useEffect, useMemo, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Helmet } from "react-helmet";
import Tabs, { Tab } from "react-best-tabs";
import "react-best-tabs/dist/index.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Select from "react-select";

import {
  discardfinalInvoices,
  getAllPaymentRecievedListing,
  getAllPVNumber,
} from "../../../services/contractorApi";
import PaymentRecievedDone from "./PaymentRecievedDone";
import FormLabelText from "../../../components/FormLabelText";
import { createColumnHelper } from "@tanstack/react-table";
import ActionButtons from "../../../components/DataTable/ActionButtons";
import StatusChip from "../../../components/StatusChip";
import { UserPlus } from "lucide-react";
import TableHeader from "../../../components/DataTable/TableHeader";
import CustomTable from "../../../components/DataTable/CustomTable";
import { selectUser } from "../../../features/auth/authSlice";
import { useSelector } from "react-redux";
import { serialNumber } from "../../../utils/helper";

const PaymentRecieved = ({ checkPermission }) => {
  const { t } = useTranslation();
  const columnHelper = createColumnHelper();
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { userPermission } = useSelector(selectUser);
  const navigate = useNavigate();
  const [showDiscard, setShowDiscard] = useState(false);
  const [discardDetails, setDiscardDetails] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [allPvNumber, setAllPvNumber] = useState([]);
  const [pv_number, setPv_number] = useState("");

  const fetchAllInvoices = async () => {
    const status = "1";
    const res = await getAllPaymentRecievedListing({
      status,
      pageSize,
      pageNo,
      search,
      pv_number,
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

  const fetchAllPVNumber = async () => {
    const status = "1";
    const res = await getAllPVNumber(status);

    if (res.status) {
      setAllPvNumber(res.data);
    } else {
      setAllPvNumber([]);
    }
  };

  const handleDiscard = async () => {
    const res = await discardfinalInvoices(discardDetails?.id);
    if (res.status) {
      toast.success(res.message);
      setRefresh((e) => !e);
    } else {
      toast.error(res.message);
    }
    setShowDiscard(false);
    setDiscardDetails("");
  };

  useEffect(() => {
    fetchAllInvoices();
    fetchAllPVNumber();
  }, [refresh, pv_number]);

  const handleClick = (e, tab) => {
    setActiveTab(tab);

    if (searchParams.has("pageNo")) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("pageNo");
      navigate(`?${newParams.toString()}`, { replace: true });
    }
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
      columnHelper.accessor("payment_unique_id", {
        header: "payment unique id",
      }),
      columnHelper.accessor("invoice_number", {
        header: "invoice number",
      }),
      columnHelper.accessor("invoice_date", {
        header: "invoice date",
        cell: (info) => (
          <div>{info.row.original?.invoice_date.split("T")[0] ?? "--"}</div>
        ),
      }),
      columnHelper.accessor("pv_number", {
        header: "pv number",
        cell: (info) => (
          <div>
            {info.row.original?.pi_bill.map((pi) => (
              <li>{pi}</li>
            ))}
          </div>
        ),
      }),
      columnHelper.accessor("amount_received", {
        header: "received amount",
      }),
      columnHelper.accessor("status", {
        header: "status",
        cell: (info) => <StatusChip status={"partial"} />,
      }),
      columnHelper.accessor("action", {
        header: "Action",
        cell: (info) => (
          <ActionButtons
            actions={{
              view: {
                show: checkPermission?.view,
                action: () =>
                  navigate(`/payments/view-recieved-payments`, {
                    state: {
                      id: info.row.original?.id,
                    },
                  }),
              },
              edit: {
                show: checkPermission?.update,
                action: () =>
                  navigate(`/payments/create`, {
                    state: {
                      selectedInvoices: [info.row.original.id],
                      type: "update",
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

  return (
    <>
      <Helmet>
        <title>Billing Management CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <Tabs
          onClick={(e, tab) => handleClick(e, tab)}
          activeTab={activeTab}
          ulClassName="border-primary p-2 border-bottom"
          activityClassName="bg-secondary"
        >
          <Tab className="ms-auto" title={t("partial payment")}>
            <>
              <div className="m-3">
                <div className="shadow p-2 rounded">
                  <Row>
                    <FormLabelText children={"select pv number"} />
                    <Col md={3}>
                      <Select
                        placeholder={t("select PV Number")}
                        menuPortalTarget={document.body}
                        options={allPvNumber.map((data) => ({
                          label: data.pv_number,
                          value: data.pv_number,
                        }))}
                        onChange={(e) => {
                          setPv_number(e ? e.value : "");
                        }}
                        isClearable
                      />
                    </Col>
                  </Row>
                </div>
                <CustomTable
                  id={"payment_received"}
                  isLoading={isLoading}
                  rows={rows || []}
                  columns={columns}
                  pagination={{
                    pageNo,
                    pageSize,
                    totalData,
                  }}
                  customHeaderComponent={
                    <TableHeader
                      userPermission={checkPermission}
                      setSearchText={setSearch}
                      button={{ show: false }}
                    />
                  }
                  tableTitleComponent={
                    <div>
                      <UserPlus /> <strong>partial payment</strong>
                    </div>
                  }
                />
              </div>
            </>
          </Tab>

          <Tab title={t("Done")}>
            <PaymentRecievedDone checkPermission={checkPermission} />
          </Tab>
        </Tabs>
      </Col>
    </>
  );
};

export default PaymentRecieved;
