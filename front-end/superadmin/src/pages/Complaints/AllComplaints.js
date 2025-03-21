import React, { useEffect, useMemo, useState } from "react";
import { Button, Col } from "react-bootstrap";
import {
  getAllComplaints,
  getAllEndUser,
  getAreaManagerAssign,
  getSupervisorAssign,
} from "../../services/contractorApi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FilterComponent } from "./FilterComponent";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import FormLabelText from "../../components/FormLabelText";
import { selectUser } from "../../features/auth/authSlice";
import { useSelector } from "react-redux";
import { createColumnHelper } from "@tanstack/react-table";
import StatusChip from "../../components/StatusChip";
import CustomTable from "../../components/DataTable/CustomTable";
import TableHeader from "../../components/DataTable/TableHeader";
import { UserPlus } from "lucide-react";
import ActionButtons from "../../components/DataTable/ActionButtons";
import { ActionDropdown } from "../../components/ActionDropdown";
import { FaFileExcel, FaRegCopy } from "react-icons/fa";
import { AiOutlineFund, AiOutlineStock } from "react-icons/ai";
import { GrDocumentPerformance } from "react-icons/gr";
import { TbRulerMeasure } from "react-icons/tb";
import { TbFileInvoice } from "react-icons/tb";
import TooltipComponent from "../../components/TooltipComponent";
import { serialNumber } from "../../utils/helper";

const AllComplaints = ({ checkPermission }) => {
  const columnHelper = createColumnHelper();
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [salesAreaId, setSalesAreaId] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [complaintFor, setComplaintFor] = useState("");
  const [outletId, setOutletId] = useState("");
  const [regionalOfficeId, setRegionalOfficeId] = useState("");
  const [orderById, setOrderById] = useState("");
  const [allManagers, setAllManagers] = useState([]);
  const [allSupervisors, setAllSupervisors] = useState([]);
  const [managerById, setManagerById] = useState("");
  const [supervisorById, setSupervisorById] = useState("");
  const [endUSer, setEndUSer] = useState([]);
  const [endUserId, setEndUserId] = useState("");
  const [uniqueId, setUniqueId] = useState("");
  const { userPermission } = useSelector(selectUser);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const fetchAllComplaints = async () => {
    const res = await getAllComplaints({
      search,
      pageSize,
      pageNo,
      sales_area_id: salesAreaId,
      outlet_id: outletId,
      regional_office_id: regionalOfficeId,
      order_by_id: orderById,
      area_manager_id: managerById,
      supervisor_id: supervisorById,
      end_user_id: endUserId,
      company_id: companyId,
      complaint_for: complaintFor,
    });
    if (res.status) {
      setRows(res.data);
      setTotalData(res?.pageDetails?.total);
    } else {
      setRows([]);
      setTotalData(0);
    }
    setIsLoading(false);
  };

  const fetchEndUser = async () => {
    const res = await getAllEndUser(supervisorById);
    if (res.status) {
      setEndUSer(res.data);
    } else {
      setEndUSer([]);
    }
  };

  const fetchManagers = async () => {
    const res = await getAreaManagerAssign();
    if (res.status) {
      setAllManagers(res.data);
    } else {
      setAllManagers([]);
    }
  };

  const fetchSupervisors = async () => {
    const res = await getSupervisorAssign(managerById);
    if (res.status) {
      setAllSupervisors(res.data);
    } else {
      setAllSupervisors([]);
    }
  };

  useEffect(() => {
    fetchAllComplaints();
  }, [
    search,
    pageNo,
    pageSize,
    salesAreaId,
    outletId,
    regionalOfficeId,
    orderById,
    managerById,
    supervisorById,
    endUserId,
    companyId,
    uniqueId,
  ]);

  useEffect(() => {
    fetchManagers();
    if (managerById) {
      fetchSupervisors();
    }
    if (supervisorById) {
      fetchEndUser();
    }
  }, [managerById, supervisorById, endUserId]);

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
        header: "Complaint Unique ID",
      }),
      columnHelper.accessor("complaint_type", {
        header: "Complaint Type",
      }),
      columnHelper.accessor("outlet_name", {
        header: "Outlet Name",
        cell: (info) => info.row.original.outlet?.[0]?.outlet_name || "-",
      }),
      columnHelper.accessor("outlet_ccnohsd", {
        header: "Outlet CCNOHSD",
        cell: (info) => info.row.original.outlet?.[0]?.outlet_ccnohsd || "-",
      }),
      columnHelper.accessor("outlet_ccnoms", {
        header: "Outlet CCNOMS",
        cell: (info) => info.row.original.outlet?.[0]?.outlet_ccnoms || "-",
      }),
      columnHelper.accessor("regional_office_name", {
        header: "Regional Office Name",
        cell: (info) =>
          info.row.original.regionalOffice?.[0]?.regional_office_name || "-",
      }),
      columnHelper.accessor("sales_area_name", {
        header: "Sales Area Name",
        cell: (info) =>
          info.row.original.saleAreaDetails?.[0]?.sales_area_name || "-",
      }),
      columnHelper.accessor("area_manager_name", {
        header: "area manager Name",

        cell: (info) =>
          info.row.original?.checkUsersAssign?.[0]?.areaManagerDetails?.name ||
          info?.row?.original?.area_manager_name,
      }),

      columnHelper.accessor("supervisor_name", {
        header: "Supervisor Name",
        cell: (info) => {
          const supervisorDetails =
            info.row.original.checkUsersAssign?.[0]?.supervisorDetails;
          const uniqueSupervisors = supervisorDetails?.filter(
            (obj, index, self) =>
              index === self.findIndex((t) => t.id === obj.id)
          );
          const supervisorNames =
            uniqueSupervisors?.map((val) => val.name) || [];
          return supervisorNames.length > 0
            ? supervisorNames.join(", ")
            : info.row.original?.supervisor_name || "-";
        },
      }),
      columnHelper.accessor("end_user_name", {
        header: "End User Name",
        cell: (info) =>
          info.row.original?.checkUsersAssign?.[0]?.endUserDetails?.map(
            (val) => val.name
          ) || info.row.original.end_user_name,
      }),

      columnHelper.accessor("order_by_details", {
        header: "order by",
      }),
      columnHelper.accessor("energy_company_name", {
        header: "company name",
      }),
      columnHelper.accessor("description", {
        header: "description",
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
                    `/complaints/ViewRequestsComplaint/${info.row.original.id}${
                      info.row.original.status == "pending"
                        ? ""
                        : `?type=${info.row.original.status}`
                    }`
                  ),
              },
            }}
            custom={
              <ActionDropdown
                data={[
                  {
                    title: "Hard Copy",
                    icon: <FaRegCopy />,
                    onClick: () => {
                      const url = `/view-measurements/${info.row.original.id}`;
                      window.open(url, "_blank");
                    },
                  },
                  {
                    title: "Fund Details",
                    icon: <AiOutlineFund />,
                    onClick: () => {
                      const url = `/view-final-expense/${"fund"}/${
                        info.row.original.id
                      }`;
                      window.open(url, "_blank");
                    },
                  },
                  {
                    title: "Stock Details",
                    icon: <AiOutlineStock />,
                    onClick: () => {
                      const url = `/view-final-expense/${"stock"}/${
                        info.row.original.id
                      }`;
                      window.open(url, "_blank");
                    },
                  },
                  {
                    title: "measurement",
                    icon: <TbRulerMeasure />,
                    onClick: () => {
                      const url = `/view-final-expense/${"stock"}/${
                        info.row.original.id
                      }`;
                      window.open(url, "_blank");
                    },
                  },
                  {
                    title: "performa invoice",
                    icon: <GrDocumentPerformance />,
                    onClick: () => {
                      const url = `/view-final-expense/${"stock"}/${
                        info.row.original.id
                      }`;
                      window.open(url, "_blank");
                    },
                  },
                  {
                    title: "invoice",
                    icon: <TbFileInvoice />,
                    onClick: () => {
                      const url = `/view-final-expense/${"stock"}/${
                        info.row.original.id
                      }`;
                      window.open(url, "_blank");
                    },
                  },
                ]}
              />
            }
          />
        ),
      }),
    ],
    [checkPermission, t, rows.length, pageNo, pageSize]
  );

  return (
    <>
      <FilterComponent
        setSalesAreaId={setSalesAreaId}
        setCompanyId={setCompanyId}
        setComplaintFor={setComplaintFor}
        setOutletId={setOutletId}
        setRegionalOfficeId={setRegionalOfficeId}
        setOrderById={setOrderById}
        setUniqueId={setUniqueId}
        status={0}
      >
        <Col md={3}>
          <FormLabelText children={t("Manager User")} />
          <Select
            isDisabled={supervisorById}
            menuPortalTarget={document.body}
            options={allManagers?.map((user) => ({
              label: user.name,
              value: user.id,
            }))}
            onChange={(e) => {
              setManagerById(e ? e.value : null);
            }}
            isClearable
          />
        </Col>
        <Col md={3}>
          <FormLabelText children={t("Supervisor")} />
          <Select
            menuPortalTarget={document.body}
            isDisabled={endUserId}
            options={allSupervisors?.map((user) => ({
              label: user.name,
              value: user.id,
            }))}
            onChange={(e) => {
              setSupervisorById(e ? e.value : null);
            }}
            isClearable
          />
        </Col>
        <Col md={3}>
          <FormLabelText children={t("End User")} />
          <Select
            menuPortalTarget={document.body}
            options={endUSer?.map((user) => ({
              label: user.name,
              value: user.id,
            }))}
            onChange={(e) => {
              setEndUserId(e ? e.value : null);
            }}
            isClearable
          />
        </Col>
      </FilterComponent>
      <CustomTable
        id={"all_complaints"}
        userPermission={checkPermission}
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
        apiForExcelPdf={getAllComplaints}
        customHeaderComponent={() => (
          <TableHeader
            userPermission={checkPermission}
            setSearchText={setSearch}
            button={{ show: false }}
            extraComponent={
              <TooltipComponent title={"import"} align="top">
                <Button
                  variant="success"
                  onClick={() => navigate(`/all-complaints/import`)}
                >
                  <FaFileExcel size={20} />
                </Button>
              </TooltipComponent>
            }
          />
        )}
        tableTitleComponent={
          <div>
            <UserPlus /> <strong>All complaints</strong>
          </div>
        }
        defaultVisible={{
          description: false,
        }}
      />
    </>
  );
};

export default AllComplaints;
