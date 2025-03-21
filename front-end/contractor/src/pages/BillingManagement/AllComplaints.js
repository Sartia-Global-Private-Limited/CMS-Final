import React, { useEffect, useMemo, useState } from "react";
import { Col } from "react-bootstrap";
import { Helmet } from "react-helmet";
import Tabs, { Tab } from "react-best-tabs";
import "react-best-tabs/dist/index.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  getAllComplaintInMeasurement,
  getAllComplaintsForMeasurement,
} from "../../services/contractorApi";
import { FilterComponent } from "../Complaints/FilterComponent";
import AllDiscards from "./AllDiscards";
import AllDraft from "./AllDraft";
import AllFinal from "./AllFinal";
import { useTranslation } from "react-i18next";
import ReadyToPi from "./ReadyToPi";
import ProcessToMeasurement from "./ProcessToMeasurement";
import SearchComponent from "../../components/SearchComponent";
import Select from "react-select";
import ResolvedComplaints from "./ResolvedComplaints";
import FormLabelText from "../../components/FormLabelText";
import StatusChip from "../../components/StatusChip";
import { createColumnHelper } from "@tanstack/react-table";
import ActionButtons from "../../components/DataTable/ActionButtons";
import { UserPlus } from "lucide-react";
import TableHeader from "../../components/DataTable/TableHeader";
import CustomTable from "../../components/DataTable/CustomTable";
import { selectUser } from "../../features/auth/authSlice";
import { useSelector } from "react-redux";
import { serialNumber } from "../../utils/helper";

const AllComplaints = ({ checkPermission }) => {
  const columnHelper = createColumnHelper();
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { userPermission } = useSelector(selectUser);
  const [complaintId, setComplaintId] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [complaintFor, setComplaintFor] = useState("");
  const [salesAreaId, setSalesAreaId] = useState("");
  const [outletId, setOutletId] = useState("");
  const [regionalOfficeId, setRegionalOfficeId] = useState("");
  const [orderById, setOrderById] = useState("");
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("last_tab") || "2"
  );
  const [filterComplaints, setFilterComplaints] = useState([]);
  const [status, setStatus] = useState("");
  const [uniqueId, setUniqueId] = useState("");
  const { t } = useTranslation();

  const fetchExpenseRequestData = async () => {
    const res = await getAllComplaintsForMeasurement({
      search,
      pageSize,
      pageNo,
      status,
      complaint_type: complaintId,
      sales_area_id: salesAreaId,
      outlet_id: outletId,
      regional_office_id: regionalOfficeId,
      order_by_id: orderById,
      company_id: companyId,
      complaint_for: complaintFor,
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

  useEffect(() => {
    fetchExpenseRequestData();
  }, [
    pageNo,
    pageSize,
    outletId,
    regionalOfficeId,
    salesAreaId,
    orderById,
    complaintId,
    status,
    search,
    companyId,
    uniqueId,
  ]);

  const fetchAllComplaint = async () => {
    const res = await getAllComplaintInMeasurement();
    if (res.status) {
      setFilterComplaints(res.data);
    } else {
      setFilterComplaints([]);
    }
  };

  useEffect(() => {
    fetchAllComplaint();
  }, [complaintId]);

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
      columnHelper.accessor("complaint_unique_id", {
        header: "complaint No",
      }),
      columnHelper.accessor("complaint_type", {
        header: "complaint type",
      }),
      columnHelper.accessor("outlet_name", {
        header: "outlet",
        cell: (info) => info.row.original.outlet?.[0]?.outlet_name ?? "-",
      }),
      columnHelper.accessor("regional_office_name", {
        header: "regional Office",
        cell: (info) =>
          info.row.original.regionalOffice?.[0]?.regional_office_name ?? "-",
      }),
      columnHelper.accessor("sales_area_name", {
        header: "sales area",
        cell: (info) =>
          info.row.original.saleAreaDetails?.[0]?.sales_area_name ?? "-",
      }),
      columnHelper.accessor("order_by_details", {
        header: "order by",
      }),
      columnHelper.accessor("status", {
        header: "status",
        cell: (info) => <StatusChip status={info.row.original?.status} />,
      }),
      columnHelper.accessor("energy_company_name", {
        header: "company name",
      }),
      columnHelper.accessor("action", {
        header: "Action",
        cell: (info) => (
          <ActionButtons
            actions={{
              view: {
                show: checkPermission?.view,
                action: () =>
                  navigate(`/view-measurements/${info.row.original.id}`),
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
          <Tab className="pe-none fs-15 fw-bold" />

          <Tab className="ms-auto" title={[t("Resolved Complaints")]}>
            {activeTab == "2" && (
              <ResolvedComplaints checkPermission={checkPermission} />
            )}
          </Tab>
          <Tab title={[t("proccess to measurment")]}>
            {activeTab == "3" && (
              <ProcessToMeasurement checkPermission={checkPermission} />
            )}
          </Tab>

          <Tab title={[t("draft")]}>
            {" "}
            {activeTab == "4" && <AllDraft checkPermission={checkPermission} />}
          </Tab>

          <Tab title={[t("final")]}>
            {" "}
            {activeTab == "5" && <AllFinal checkPermission={checkPermission} />}
          </Tab>
          <Tab title={[t("discard")]}>
            {activeTab == "6" && (
              <AllDiscards checkPermission={checkPermission} />
            )}
          </Tab>
          <Tab title={[t("ready to pi")]}>
            {activeTab == "7" && (
              <ReadyToPi checkPermission={checkPermission} />
            )}
          </Tab>

          <Tab title={[t("All Complaints")]}>
            {activeTab == "8" && (
              <>
                <div className="m-1">
                  <FilterComponent
                    setSalesAreaId={setSalesAreaId}
                    setCompanyId={setCompanyId}
                    setComplaintFor={setComplaintFor}
                    setOutletId={setOutletId}
                    setRegionalOfficeId={setRegionalOfficeId}
                    setOrderById={setOrderById}
                    setUniqueId={setUniqueId}
                    status={"resolved-complaint-in-billing"}
                    statusFilter={true}
                    setStatus={setStatus}
                  >
                    <Col md={3}>
                      <FormLabelText children={t("All Complaints")} />
                      <Select
                        menuPortalTarget={document.body}
                        options={filterComplaints?.map((user) => ({
                          label: user.complaint_type_name,
                          value: user.id,
                        }))}
                        onChange={(e) => {
                          setComplaintId(e ? e.value : null);
                        }}
                        isClearable
                      />
                    </Col>
                    <Col md={3}>
                      <SearchComponent setSearch={setSearch} />
                    </Col>
                  </FilterComponent>
                  <CustomTable
                    id={"resolved_complaints"}
                    isLoading={isLoading}
                    rows={rows || []}
                    columns={columns}
                    pagination={{
                      pageNo,
                      pageSize,
                      totalData,
                    }}
                    excelAction={() => ""}
                    pdfAction={() => ""}
                    apiForExcelPdf={getAllComplaintsForMeasurement}
                    customHeaderComponent={
                      <TableHeader
                        userPermission={checkPermission}
                        setSearchText={setSearch}
                        button={{ show: false }}
                      />
                    }
                    tableTitleComponent={
                      <div>
                        <UserPlus /> <strong>All complaints</strong>
                      </div>
                    }
                  />
                </div>
              </>
            )}
          </Tab>
        </Tabs>
      </Col>
    </>
  );
};

export default AllComplaints;
