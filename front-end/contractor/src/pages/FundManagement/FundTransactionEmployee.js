import React, { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import { Col, Form, Row } from "react-bootstrap";
import {
  getEmployeeList,
  getFundTransactionsOfEmployee,
} from "../../services/contractoApi2";
import {
  getAllEndUserBySupervisorId,
  getAllManagersUser,
  getAllOfficeUser,
  getSupervisorListWithTotalFreeUserByManagerId,
} from "../../services/contractorApi";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import FormLabelText from "../../components/FormLabelText";
import { UserPlus } from "lucide-react";
import TableHeader from "../../components/DataTable/TableHeader";
import CustomTable from "../../components/DataTable/CustomTable";
import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import { formatNumberToINR, serialNumber } from "../../utils/helper";

export default function FundTransactionEmployee({
  module,
  module_type,
  checkPermission,
}) {
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
  const [EmployeeList, setEmployeeList] = useState([]);
  const [employeeType, setEmployeeType] = useState("manager");
  const [employeeId, setEmployeeId] = useState("");
  const [allOfficeUser, setAllofficeUser] = useState([]);
  const [allManagers, setAllManagers] = useState([]);
  const [freeSupervisorData, setFreeSupervisorData] = useState([]);
  const [freeUserData, setFreeUserData] = useState([]);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    fetchEmployeeList();
    fetchOfficeUser();
    fetchManagers();
  }, [employeeType]);

  useEffect(() => {
    getAccountBalance();
  }, [employeeId, pageSize, pageNo, search]);

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
    const res = await getFundTransactionsOfEmployee(
      employeeId,
      module,
      module_type,
      {
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
      columnHelper.accessor("username", {
        header: "name",
      }),
      columnHelper.accessor("employee_id", {
        header: "employee id",
      }),
      columnHelper.accessor("role_name", {
        header: "role",
      }),
      columnHelper.accessor("amount", {
        header: "amount",
        cell: (info) => (
          <div
            className={`fw-bold text-${
              info.row.original?.transaction_type == "debit"
                ? "danger"
                : "green"
            }`}
          >
            {formatNumberToINR(info.row.original?.amount)}
          </div>
        ),
      }),
      columnHelper.accessor("balance", {
        header: "balance",
        cell: (info) => formatNumberToINR(info.getValue()),
      }),
      columnHelper.accessor("transaction_type", {
        header: "transaction type",
        cell: (info) => (
          <div
            className={`fw-bold text-${
              info.row.original?.transaction_type == "debit"
                ? "danger"
                : "green"
            }`}
          >
            {info.row.original?.transaction_type}
          </div>
        ),
      }),
      columnHelper.accessor("status", {
        header: "status",
      }),
      columnHelper.accessor("transaction_date", {
        header: "transaction date",
      }),
    ],
    [checkPermission, rows.length, pageNo, pageSize]
  );

  return (
    <div>
      <>
        <Row className="shadow rounded p-2 m-3">
          <Form.Group as={Col} md={3}>
            <FormLabelText children={t("Office")} />
            <Select
              menuPortalTarget={document.body}
              options={allOfficeUser?.map((user) => ({
                label: user.name,
                value: user.id,
              }))}
              isDisabled={selected == "manager"}
              isClearable
              onChange={(e) => {
                setEmployeeId(e?.value);
                if (e) setSelected("office");
                else setSelected("");
              }}
            />
          </Form.Group>

          <Form.Group as={Col} md={3}>
            <FormLabelText children={t("Manager")} />
            <Select
              menuPortalTarget={document.body}
              options={allManagers?.map((user) => ({
                label: user.name,
                value: user.id,
              }))}
              isDisabled={selected == "office"}
              isClearable
              onChange={(e) => {
                handleManagerChange(e?.value);
                setEmployeeId(e?.value);
                if (e) setSelected("manager");
                else setSelected("");
              }}
            />
          </Form.Group>
          <Form.Group as={Col} md={3}>
            <FormLabelText children={t("Supervisor")} />
            <Select
              menuPortalTarget={document.body}
              options={freeSupervisorData?.map((user) => ({
                label: user.name,
                value: user.id,
              }))}
              isClearable
              onChange={(e) => {
                handleSupervisorChange(e?.value);
                setEmployeeId(e?.value);
              }}
            />
          </Form.Group>

          <Form.Group as={Col} md={3}>
            <FormLabelText children={t("End User")} />
            <Select
              menuPortalTarget={document.body}
              options={freeUserData?.map((user) => ({
                label: user.name,
                value: user.id,
              }))}
              isClearable
              onChange={(e) => {
                setEmployeeId(e?.value);
              }}
            />
          </Form.Group>
        </Row>
        <CustomTable
          id={"fund_transaction_employee"}
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
          employeeId={employeeId}
          module={module}
          module_type={module_type}
          apiForExcelPdf={getFundTransactionsOfEmployee}
          customHeaderComponent={() => (
            <TableHeader
              userPermission={checkPermission}
              setSearchText={setSearch}
              button={{ show: false }}
            />
          )}
          tableTitleComponent={
            <div>
              <UserPlus /> <strong>Employee</strong>
            </div>
          }
        />
      </>
    </div>
  );
}
