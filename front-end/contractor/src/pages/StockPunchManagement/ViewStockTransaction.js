import React, { useEffect, useMemo, useState } from "react";
import { Card, Col, Form, Row, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import Select from "react-select";
import {
  getEmployeeList,
  getExpenseTransactionDetailsInStockPunch,
} from "../../services/contractoApi2";
import {
  getAllEndUserBySupervisorId,
  getAllManagersUser,
  getAllOfficeUser,
  getSupervisorListWithTotalFreeUserByManagerId,
} from "../../services/contractorApi";
import ReactPagination from "../../components/ReactPagination";
import { useDebounce } from "../../hooks/UseDebounce";
import { useTranslation } from "react-i18next";
import { FREQUENCY } from "../../data/StaticData";
import DateRange from "../../components/DateRange";
import FormLabelText from "../../components/FormLabelText";
import ExportExcelPdf from "../../components/ExportExcelPdf";
import { BsSearch } from "react-icons/bs";
import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate, useSearchParams } from "react-router-dom";
import { selectUser } from "../../features/auth/authSlice";
import { useSelector } from "react-redux";
import { UserPlus } from "lucide-react";
import TableHeader from "../../components/DataTable/TableHeader";
import CustomTable from "../../components/DataTable/CustomTable";
import { serialNumber } from "../../utils/helper";

export default function ViewStockTransaction({ checkPermission }) {
  const columnHelper = createColumnHelper();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { userPermission } = useSelector(selectUser);
  const [allBanksData, setAllBanksData] = useState([]);
  const [bankId, setBankId] = useState("");
  const [BalanceFor, setBalanceFor] = useState("bank");
  const [allAccounts, setallAccounts] = useState([]);
  const [EmployeeList, setEmployeeList] = useState([]);
  const [employeeType, setEmployeeType] = useState("manager");
  const [employeeId, setEmployeeId] = useState("");
  const [allOfficeUser, setAllofficeUser] = useState([]);
  const [allManagers, setAllManagers] = useState([]);
  const [freeSupervisorData, setFreeSupervisorData] = useState([]);
  const [freeUserData, setFreeUserData] = useState([]);
  const [selected, setSelected] = useState("");
  const [dateRangeValue, setDateRangeValue] = useState("");
  const [filterBy, setFilterby] = useState("");

  useEffect(() => {
    fetchEmployeeList();
    fetchOfficeUser();
    fetchManagers();
  }, [employeeType]);

  // set Delay time to get data on search
  const debounceValue = useDebounce(search, 500);

  useEffect(() => {
    getAccountBalance();
  }, [employeeId, pageSize, pageNo, debounceValue, filterBy, dateRangeValue]);

  const fetchEmployeeList = async () => {
    const res = await getEmployeeList(employeeType);
    if (res?.status) {
      const rData = res.data.map((itm) => {
        return {
          value: itm.id,
          label: itm.name,
          logo: itm.image,
        };
      });
      setEmployeeList(rData);
    } else {
      setEmployeeList([]);
    }
  };

  const handleManagerChange = async (value, setvalue) => {
    if (!value) return setFreeSupervisorData([]);
    fetchFreeSupervisorData(value);
  };

  const handleSupervisorChange = async (value, setvalue) => {
    if (!value) return setFreeUserData([]);
    fetchFreeUsersData(value);
  };

  const fetchFreeUsersData = async (id) => {
    const res = await getAllEndUserBySupervisorId(id);
    if (res.status) {
      setFreeUserData(res.data);
    } else {
      setFreeUserData([]);
      toast.error(res.message);
    }
  };

  //All Supervisors By Manager Id
  const fetchFreeSupervisorData = async (id) => {
    const res = await getSupervisorListWithTotalFreeUserByManagerId(id);
    if (res.status) {
      setFreeSupervisorData(res.data);
    } else {
      setFreeSupervisorData([]);
      toast.error(res.message);
    }
  };

  const fetchManagers = async () => {
    const res = await getAllManagersUser();
    if (res.status) {
      setAllManagers(res.data);
    } else {
      setAllManagers([]);
    }
  };

  const fetchOfficeUser = async () => {
    const res = await getAllOfficeUser();
    if (res.status) {
      setAllofficeUser(res.data);
    } else {
      setAllofficeUser([]);
    }
  };

  const getAccountBalance = async () => {
    const res = await getExpenseTransactionDetailsInStockPunch(
      employeeId?.value,
      {
        date: filterBy,
        pageSize,
        pageNo,
        search,
      }
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
        cell: (info) =>
          info.row.original.complaint_details?.complaint_unique_id,
      }),
      columnHelper.accessor("transaction_type", {
        header: "transaction type",
        cell: (info) => (
          <div
            className={`text-${
              info.row.original?.transaction_type == "credit"
                ? "green"
                : "danger"
            }`}
          >
            {info.row.original?.transaction_type || "--"}
          </div>
        ),
      }),
      columnHelper.accessor("amount", {
        header: "amount",
        cell: (info) => (
          <div className="text-green">₹ {info.row.original?.amount}</div>
        ),
      }),
      columnHelper.accessor("balance", {
        header: "balance",
        cell: (info) => (
          <div className="text-green">₹ {info.row.original?.balance}</div>
        ),
      }),
    ],
    [checkPermission, rows.length, pageNo, pageSize]
  );

  return (
    <>
      <Row className="shadow rounded p-2 m-3">
        <Form.Group as={Col} md={3}>
          <FormLabelText children={t("Office")} />
          <Select
            placeholder={t("Office")}
            menuPortalTarget={document.body}
            options={allOfficeUser?.map((user) => ({
              label: user.name,
              value: user.id,
            }))}
            isDisabled={selected == "manager"}
            isClearable
            onChange={(e) => {
              setEmployeeId(e);
              if (e) setSelected("office");
              else setSelected("");
            }}
          />
        </Form.Group>

        <Form.Group as={Col} md={3}>
          <FormLabelText children={t("Manager")} />
          <Select
            placeholder={t("Manager")}
            menuPortalTarget={document.body}
            // value={main?.area_manager_id}
            options={allManagers?.map((user) => ({
              label: user.name,
              value: user.id,
            }))}
            isDisabled={selected == "office"}
            isClearable
            onChange={(e) => {
              handleManagerChange(e?.value);
              // props.setFieldValue(managerName, e);
              setEmployeeId(e);
              if (e) setSelected("manager");
              else setSelected("");
            }}
          />
        </Form.Group>
        <Form.Group as={Col} md={3}>
          <FormLabelText children={t("Supervisor")} />
          <Select
            placeholder={t("Supervisor")}
            menuPortalTarget={document.body}
            options={freeSupervisorData?.map((user) => ({
              label: user.name,
              value: user.id,
            }))}
            isClearable
            onChange={(e) => {
              handleSupervisorChange(e?.value);
              setEmployeeId(e);
            }}
          />
        </Form.Group>

        <Form.Group as={Col} md={3}>
          <FormLabelText children={t("End User")} />
          <Select
            placeholder={t("End User")}
            menuPortalTarget={document.body}
            options={freeUserData?.map((user) => ({
              label: user.name,
              value: user.id,
            }))}
            isClearable
            onChange={(e) => {
              setEmployeeId(e);
            }}
          />
        </Form.Group>
        <div className="col-md-3 mt-2">
          <FormLabelText children={t("Select Date Range")} />
          <DateRange value={dateRangeValue} setValue={setDateRangeValue} />
        </div>
        <Form.Group as={Col} md={3} className="mt-2">
          <FormLabelText children={t("Select Frequency")} />
          <Select
            menuPortalTarget={document.body}
            options={FREQUENCY}
            isClearable
            onChange={(e) => {
              setFilterby(e ? e.value : null);
            }}
          />
        </Form.Group>
        <span className="mx-2 my-3">
          {t("End User")} : <b>{employeeId?.label ?? "--"} </b>
        </span>
      </Row>
      <CustomTable
        id={"view_stock_punch_transaction"}
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
        employeeId={employeeId?.value}
        apiForExcelPdf={getExpenseTransactionDetailsInStockPunch}
        customHeaderComponent={() => (
          <TableHeader
            userPermission={checkPermission}
            setSearchText={setSearch}
            button={{ show: false }}
          />
        )}
        tableTitleComponent={
          <div>
            <UserPlus /> <strong>view stock punch transactions</strong>
          </div>
        }
      />
    </>
  );
}
