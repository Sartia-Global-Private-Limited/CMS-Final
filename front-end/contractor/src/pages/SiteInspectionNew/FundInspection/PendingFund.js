import React, { useEffect, useMemo, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { Helmet } from "react-helmet";
import Tabs, { Tab } from "react-best-tabs";
import "react-best-tabs/dist/index.css";
import Select from "react-select";
import { useNavigate, useSearchParams } from "react-router-dom";
import ApprovedFund from "./ApprovedFund";
import PartialFund from "./PartialFund";
import {
  getAllOutletByIdForFundInSite,
  getAllRegionalByIdForFundInSite,
  getAllSalesForFundInSite,
  getPendingFundRequestInSite,
} from "../../../services/contractorApi";
import { useTranslation } from "react-i18next";
import { selectUser } from "../../../features/auth/authSlice";
import { useSelector } from "react-redux";
import { createColumnHelper } from "@tanstack/react-table";
import ActionButtons from "../../../components/DataTable/ActionButtons";
import StatusChip from "../../../components/StatusChip";
import CustomTable from "../../../components/DataTable/CustomTable";
import TableHeader from "../../../components/DataTable/TableHeader";
import { UserPlus } from "lucide-react";
import FormLabelText from "../../../components/FormLabelText";
import { serialNumber } from "../../../utils/helper";

const PendingFund = ({ checkPermission }) => {
  const columnHelper = createColumnHelper();
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { userPermission } = useSelector(selectUser);

  const [activeTab, setActiveTab] = useState(0);
  const [allSalesArea, setAllSalesArea] = useState([]);
  const [allOutletArea, setAllOutletArea] = useState([]);
  const [allRoOffice, setAllRoOffice] = useState([]);
  const [salesAreaId, setSalesAreaId] = useState("");
  const [RegionalId, setRegionalId] = useState("");
  const [outletId, setOutletId] = useState("");
  const { t } = useTranslation();

  const fetchExpenseRequestData = async () => {
    const res = await getPendingFundRequestInSite(
      salesAreaId,
      RegionalId,
      outletId,
      pageSize,
      pageNo,
      search
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

  const navigate = useNavigate();
  const fetchSalesArea = async () => {
    const res = await getAllSalesForFundInSite(0);
    if (res.status) {
      setAllSalesArea(res.data);
    } else {
      setAllSalesArea([]);
    }
  };
  const fetchOutletArea = async () => {
    const res = await getAllOutletByIdForFundInSite(0);
    if (res.status) {
      setAllOutletArea(res.data);
    } else {
      setAllOutletArea([]);
    }
  };
  const fetchRoOffice = async () => {
    const res = await getAllRegionalByIdForFundInSite(0);
    if (res.status) {
      setAllRoOffice(res.data);
    } else {
      setAllRoOffice([]);
    }
  };

  useEffect(() => {
    fetchSalesArea();
    fetchOutletArea();
    fetchRoOffice();
  }, []);

  useEffect(() => {
    fetchExpenseRequestData();
  }, [pageNo, search, pageSize, outletId, RegionalId, salesAreaId]);

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
      columnHelper.accessor("outlet_unique_id", {
        header: "outlet id",
        cell: (info) => info.row.original.outlet?.[0]?.outlet_unique_id,
      }),
      columnHelper.accessor("outlet_name", {
        header: "outlet name",
        cell: (info) => info.row.original.outlet?.[0]?.outlet_name,
      }),
      columnHelper.accessor("outlet_ccnohsd", {
        header: "outlet ccnohsd",
        cell: (info) => info.row.original.outlet?.[0]?.outlet_ccnohsd,
      }),
      columnHelper.accessor("outlet_ccnoms", {
        header: "outlet ccnoms",
        cell: (info) => info.row.original.outlet?.[0]?.outlet_ccnoms,
      }),
      columnHelper.accessor("regional_office_name", {
        header: "regional office",
        cell: (info) =>
          info.row.original?.regionalOffice?.[0]?.regional_office_name,
      }),
      columnHelper.accessor("sales_area_name", {
        header: "sales area",
        cell: (info) =>
          info.row.original?.saleAreaDetails?.[0]?.sales_area_name,
      }),
      columnHelper.accessor("total_amount", {
        header: "total amount",
        cell: (info) => (
          <div className="fw-bolder text-green">
            {info.row.original?.total_amount}
          </div>
        ),
      }),
      columnHelper.accessor("total_complaints", {
        header: "total complaints",
      }),
      columnHelper.accessor("status", {
        header: "status",
        cell: (info) => (
          <StatusChip status={info.row.original.status == "0" && "pending"} />
        ),
      }),
      columnHelper.accessor("month", {
        header: "date",
      }),
      columnHelper.accessor("action", {
        header: "Action",
        cell: (info) => (
          <ActionButtons
            actions={{
              view: {
                show: checkPermission?.view,
                action: () =>
                  navigate(`/view-fund-inspection`, {
                    state: {
                      outletId: info.row.original?.outlet?.[0]?.id,
                      month: info.row.original?.month,
                      allData: info.row.original,
                      type: "pending",
                    },
                  }),
              },
              approve: {
                show: checkPermission?.update,
                action: () =>
                  navigate(`/approve-fund-site-Inspection`, {
                    state: {
                      outletId: info.row.original?.outlet?.[0]?.id,
                      month: info.row.original?.month,
                      allData: info.row.original,
                      type: "pending",
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
        <title>Office Inspection· CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <Tabs
          onClick={(e, tab) => handleClick(e, tab)}
          activeTab={activeTab}
          ulClassName="border-primary p-2 border-bottom"
          activityClassName="bg-secondary"
        >
          <Tab className="ms-auto" title={t("Pending")}>
            <>
              <Row className="shadow rounded m-2 p-2">
                <Form.Group as={Col} md="3" className="m-1">
                  <FormLabelText children={t("regional_office")} />

                  <Select
                    menuPortalTarget={document.body}
                    isClearable={true}
                    options={allRoOffice?.map((user) => ({
                      label: user.regional_office_name,
                      value: user.id,
                    }))}
                    onChange={(e) => {
                      setRegionalId(e?.value);
                    }}
                  />
                </Form.Group>

                <Form.Group as={Col} md="3" className="m-1">
                  <FormLabelText children={t("Sales Area")} />
                  <Select
                    menuPortalTarget={document.body}
                    isClearable={true}
                    options={allSalesArea?.map((user) => ({
                      label: user.sales_area_name,
                      value: user.id,
                    }))}
                    onChange={(e) => setSalesAreaId(e?.value)}
                  />
                </Form.Group>

                <Form.Group as={Col} md="3" className="m-1">
                  <FormLabelText children={t("Outlet Name")} />
                  <Select
                    menuPortalTarget={document.body}
                    isClearable={true}
                    options={allOutletArea?.map((user) => ({
                      label: user.outlet_name,
                      value: user.id,
                    }))}
                    onChange={(e) => setOutletId(e?.value)}
                  />
                </Form.Group>
              </Row>

              <CustomTable
                id={"pending_fund"}
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
                    <UserPlus /> <strong>pending fund</strong>
                  </div>
                }
              />
            </>
          </Tab>
          <Tab title={t("partial")}>
            <PartialFund checkPermission={checkPermission} />
          </Tab>
          <Tab title={t("approved")}>
            <ApprovedFund checkPermission={checkPermission} />
          </Tab>
        </Tabs>
      </Col>
    </>
  );
};

export default PendingFund;
