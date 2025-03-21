import React, { useEffect, useMemo, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Helmet } from "react-helmet";
import Tabs, { Tab } from "react-best-tabs";
import "react-best-tabs/dist/index.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ConfirmAlert from "../../../components/ConfirmAlert";
import Select from "react-select";

import {
  discardfinalInvoices,
  getAllPaymentDoneListingInRetention,
  getAllPVNumber,
} from "../../../services/contractorApi";
import AllEligibleRetentions from "./AllEligibleRetentions";
import DoneRetentions from "./DoneRetentions";
import RetentionProcess from "./RetentionProcess";
import FormLabelText from "../../../components/FormLabelText";
import { createColumnHelper } from "@tanstack/react-table";
import { selectUser } from "../../../features/auth/authSlice";
import { useSelector } from "react-redux";
import ActionButtons from "../../../components/DataTable/ActionButtons";
import StatusChip from "../../../components/StatusChip";
import { UserPlus } from "lucide-react";
import TableHeader from "../../../components/DataTable/TableHeader";
import CustomTable from "../../../components/DataTable/CustomTable";
import { serialNumber } from "../../../utils/helper";

const AllPaidBills = ({ checkPermission }) => {
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
  const [allPvNumber, setAllPvNumber] = useState([]);
  const [pv_number, setPv_number] = useState("");

  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("last_tab") || "2"
  );

  const fetchAllInvoices = async () => {
    const res = await getAllPaymentDoneListingInRetention(
      pageSize,
      pageNo,
      search,
      pv_number
    );

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
    const status = "3";
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
      }),
      columnHelper.accessor("amount_received", {
        header: "received amount",
      }),
      columnHelper.accessor("status", {
        header: "status",
        cell: (info) => <StatusChip status={"ready to retention"} />,
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
          <Tab className="pe-none fs-15 fw-bold " />
          <Tab className="ms-auto" title={t("All paid bills")}>
            {activeTab == "2" && (
              <>
                <div className="p-3">
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
                    id={"all_paid_bills"}
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
                        <UserPlus /> <strong>all paid pills</strong>
                      </div>
                    }
                  />
                  <ConfirmAlert
                    size={"sm"}
                    deleteFunction={handleDiscard}
                    hide={setShowDiscard}
                    show={showDiscard}
                    title={"Confirm Discard"}
                    description={"Are you sure you want to discard this!!"}
                  />
                </div>
              </>
            )}
          </Tab>

          <Tab title={t("eligible retention")}>
            {activeTab == "3" && (
              <AllEligibleRetentions checkPermission={checkPermission} />
            )}
          </Tab>
          <Tab title={t("retention process")}>
            {activeTab == "4" && (
              <RetentionProcess checkPermission={checkPermission} />
            )}
          </Tab>
          <Tab title={t("done retention")}>
            {activeTab == "5" && (
              <DoneRetentions checkPermission={checkPermission} />
            )}
          </Tab>
        </Tabs>
      </Col>
    </>
  );
};

export default AllPaidBills;
