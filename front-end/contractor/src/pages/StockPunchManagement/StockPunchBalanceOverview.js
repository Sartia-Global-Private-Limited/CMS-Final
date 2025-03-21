import React, { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import { Col, Form, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  getAllEndUserBySupervisorId,
  getAllManagersUser,
  getAllOfficeUser,
  getSupervisorListWithTotalFreeUserByManagerId,
} from "../../services/contractorApi";
import {
  expenseBalanceOverviewInStockPunch,
  getEmployeeList,
} from "../../services/contractoApi2";
import { useDebounce } from "../../hooks/UseDebounce";
import { useTranslation } from "react-i18next";
import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate, useSearchParams } from "react-router-dom";
import { selectUser } from "../../features/auth/authSlice";
import { useSelector } from "react-redux";
import { UserPlus } from "lucide-react";
import TableHeader from "../../components/DataTable/TableHeader";
import CustomTable from "../../components/DataTable/CustomTable";
import { serialNumber } from "../../utils/helper";

export default function StockPunchBalanceOverview({ checkPermission }) {
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
  const [freeSupervisorData, setFreeSupervisorData] = useState([]);
  const [allManagers, setAllManagers] = useState([]);
  const [freeUserData, setFreeUserData] = useState([]);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    fetchEmployeeList();
    fetchOfficeUser();
    fetchManagers();
  }, [employeeType]);

  // set Delay time to get data on search
  const debounceValue = useDebounce(search, 500);

  useEffect(() => {
    getAccountBalance();
  }, [employeeId, pageSize, pageNo, debounceValue]);

  const fetchOfficeUser = async () => {
    const res = await getAllOfficeUser();
    if (res.status) {
      setAllofficeUser(res.data);
    } else {
      setAllofficeUser([]);
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

  const getAccountBalance = async () => {
    const res = await expenseBalanceOverviewInStockPunch(employeeId?.value, {
      pageSize,
      pageNo,
      search,
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

  const columns = useMemo(
    () => [
      columnHelper.accessor("sr_no", {
        header: t("Sr No."),
        cell: (info) => {
          const serialNumbers = serialNumber(pageNo, pageSize);
          return serialNumbers[info.row.index];
        },
      }),
      columnHelper.accessor("employee_id", {
        header: "employee id",
      }),
      columnHelper.accessor("name", {
        header: "name",
      }),
      columnHelper.accessor("mobile", {
        header: "mobile no.",
      }),
      columnHelper.accessor("account_no", {
        header: "account no.",
      }),
      // columnHelper.accessor("transaction_type", {
      //   header: "transaction type",
      //   cell: (info) => (
      //     <div
      //       className={`text-${
      //         info.row.original?.transaction_type == "credit"
      //           ? "green"
      //           : "danger"
      //       }`}
      //     >
      //       {info.row.original?.transaction_type || "--"}
      //     </div>
      //   ),
      // }),
      columnHelper.accessor("balance", {
        header: "balance",
      }),
    ],
    [checkPermission, rows.length, pageNo, pageSize]
  );

  return (
    <>
      <Row className="shadow rounded p-2 m-3">
        <Form.Group as={Col} md={3}>
          <Form.Label className="small">{t("Office")} </Form.Label>
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
          <Form.Label className="small">{t("Manager")}</Form.Label>
          <Select
            placeholder={t("Manager")}
            menuPortalTarget={document.body}
            options={allManagers?.map((user) => ({
              label: user.name,
              value: user.id,
            }))}
            isDisabled={selected == "office"}
            isClearable
            onChange={(e) => {
              handleManagerChange(e?.value);
              setEmployeeId(e);
              if (e) setSelected("manager");
              else setSelected("");
            }}
          />
        </Form.Group>
        <Form.Group as={Col} md={3}>
          <Form.Label className="small">{t("Supervisor")}</Form.Label>
          <Select
            placeholder={t("Supervisor")}
            menuPortalTarget={document.body}
            isClearable={true}
            options={freeSupervisorData?.map((user) => ({
              label: user.name,
              value: user.id,
            }))}
            onChange={(e) => {
              handleSupervisorChange(e?.value);
              setEmployeeId(e);
            }}
          />
        </Form.Group>

        <Form.Group as={Col} md={3}>
          <Form.Label className="small">{t("End User")}</Form.Label>
          <Select
            placeholder={t("End User")}
            menuPortalTarget={document.body}
            options={freeUserData?.map((user) => ({
              label: user.name,
              value: user.id,
            }))}
            isClearable={true}
            onChange={(e) => {
              setEmployeeId(e);
            }}
          />
        </Form.Group>
        <span className="mx-2 my-3">
          {" "}
          {t("End User")} : <b>{employeeId?.label ?? "--"} </b>
        </span>
      </Row>

      <CustomTable
        id={"stock_punch_balance_overview"}
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
        apiForExcelPdf={expenseBalanceOverviewInStockPunch}
        customHeaderComponent={() => (
          <TableHeader
            userPermission={checkPermission}
            setSearchText={setSearch}
            button={{ show: false }}
          />
        )}
        tableTitleComponent={
          <div>
            <UserPlus /> <strong>stock punch balance overview</strong>
          </div>
        }
      />
    </>
  );
}
