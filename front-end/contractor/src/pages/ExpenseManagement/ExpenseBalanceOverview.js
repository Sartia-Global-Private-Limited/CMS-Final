import React, { useEffect, useMemo, useState } from "react";
import { BsSearch } from "react-icons/bs";
import Select from "react-select";
import { Col, Form, Row, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  getAllEndUserBySupervisorId,
  getAllManagersUser,
  getAllOfficeUser,
  getSupervisorListWithTotalFreeUserByManagerId,
} from "../../services/contractorApi";
import {
  expenseBalanceOverview,
  getTransactionDetail,
} from "../../services/contractoApi2";
import { useDebounce } from "../../hooks/UseDebounce";
import { useTranslation } from "react-i18next";
import Modaljs from "../../components/Modal";
import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import { UserPlus } from "lucide-react";
import TableHeader from "../../components/DataTable/TableHeader";
import CustomTable from "../../components/DataTable/CustomTable";
import { formatNumberToINR, serialNumber } from "../../utils/helper";

export default function ExpenseBalanceOverview({ checkPermission }) {
  const columnHelper = createColumnHelper();
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const { userPermission } = useSelector(selectUser);
  const navigate = useNavigate();
  const [employeeId, setEmployeeId] = useState("");
  const [allOfficeUser, setAllofficeUser] = useState([]);
  const [freeSupervisorData, setFreeSupervisorData] = useState([]);
  const [allManagers, setAllManagers] = useState([]);
  const [freeUserData, setFreeUserData] = useState([]);
  const [selected, setSelected] = useState("");
  const [modal, setModal] = useState(false);
  const [details, setDetails] = useState([]);

  const { t } = useTranslation();

  useEffect(() => {
    fetchOfficeUser();
    fetchManagers();
  }, []);

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

  const handleManagerChange = async (value, setvalue) => {
    if (!value) return setFreeSupervisorData([]);
    fetchFreeSupervisorData(value);
  };

  const handleSupervisorChange = async (value, setvalue) => {
    if (!value) return setFreeUserData([]);
    fetchFreeUsersData(value);
  };

  const getAccountBalance = async () => {
    const module = "expense";
    const module_type = "expense-balance";
    const res = await expenseBalanceOverview(
      employeeId?.value,
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
      setRows(res.data);
      setTotalData(res?.pageDetails?.total);
    } else {
      setRows([]);
      setTotalData(0);
    }
    setIsLoading(false);
  };

  const handletransaction = async (user_id) => {
    const onClickStatus = true;
    const res = await getTransactionDetail(user_id, onClickStatus);
    if (res.status) {
      setDetails(res.data);
      setModal(true);
    } else {
      toast.error(res.message);
      setDetails([]);
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
      columnHelper.accessor("employee_id", {
        header: "Employee ID",
      }),
      columnHelper.accessor("name", {
        header: "name",
        cell: (info) => (
          <div
          // className="text-orange cursor-pointer"
          // onClick={() => handletransaction(info.row.original.user_id)}
          >
            {info.row.original?.name}
          </div>
        ),
      }),
      columnHelper.accessor("mobile", {
        header: "mobile no.",
      }),
      columnHelper.accessor("acount_no", {
        header: "acount no.",
      }),
      // columnHelper.accessor("transaction_type", {
      //   header: "transaction type",
      //   cell: (info) => (
      //     <div
      //       className={`cursor-pointer text-${
      //         info.row.original?.transaction_type == "credit"
      //           ? "green"
      //           : "danger"
      //       }`}
      //       // onClick={() => handletransaction(info.row.original.user_id)}
      //     >
      //       {info.row.original?.transaction_type || "--"}
      //     </div>
      //   ),
      // }),
      columnHelper.accessor("balance", {
        header: "balance",
        cell: (info) => (
          <div
            className="cursor-pointer"
            // onClick={() => handletransaction(info.row.original.user_id)}
          >
            {formatNumberToINR(info.row.original?.balance)}
          </div>
        ),
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
            isClearable={true}
            options={freeUserData?.map((user) => ({
              label: user.name,
              value: user.id,
            }))}
            onChange={(e) => {
              setEmployeeId(e);
            }}
          />
        </Form.Group>
        <Col md={4}>
          <Row className="mt-3">
            <Col md={12}>
              <span className="position-relative">
                {/* {" "}
                  {t("Account Holder Name")} :{" "}
                  <span className="fw-bold">
                    {allAccounts?.map((data) => data.name) || "-"}
                  </span>
                  <br />
                  {t("Account Number")} :{" "}
                  <span className="fw-bold">
                    {allAccounts?.account_number || "-"}
                  </span>
                  <br />
                  {t("Account Balance")} :{" "}
                  <span className="fw-bold text-green">
                    {allAccounts?.map((data) => data.balance) || "-"}
                  </span>
                  <br /> */}
                {t("End User")} :{" "}
                <span className="fw-bold text-green">
                  {employeeId?.label ?? "-"}
                </span>
              </span>
            </Col>
          </Row>
        </Col>
      </Row>
      <CustomTable
        id={"expense_balance_overview"}
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
        module={"expense"}
        module_type={"expense-balance"}
        apiForExcelPdf={expenseBalanceOverview}
        customHeaderComponent={() => (
          <TableHeader
            userPermission={checkPermission}
            setSearchText={setSearch}
            button={{
              show: false,
            }}
          />
        )}
        tableTitleComponent={
          <div>
            <UserPlus /> <strong>Expense Balance Overview</strong>
          </div>
        }
      />

      <div>
        <Modaljs
          open={modal}
          size={"xl"}
          close={() => setModal(false)}
          title={t("Transaction Details")}
          hideFooter={true}
        >
          <Row className="g-2 align-items-center">
            <div>
              {/* <span className="fw-bold mx-2 text-danger"> All Invoices</span> */}

              <div className="mt-2">
                <Table className="table-sm table Roles">
                  <thead>
                    <tr>
                      <th>{t("Sr No.")}</th>
                      <th>{t("Complaint No")}</th>
                      <th>{t("User Name")}</th>
                      <th>{t("Mobile Number")}</th>
                      <th>{t("Transaction Type")}</th>
                      <th>{t("Transaction Date")}</th>
                      <th>{t("Transaction Time")}</th>
                      <th>{t("Amount")}</th>
                      <th>{t("Balance")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {details?.length > 0 &&
                      details?.map((data, idx) => {
                        return (
                          <tr key={idx}>
                            <td>{idx + 1}</td>
                            <td>
                              {data?.complaint_details?.complaint_unique_id ??
                                "-"}
                            </td>
                            <td>{data.username ?? "-"}</td>
                            <td>{data?.mobile || "-"}</td>
                            <td>{data?.transaction_type ?? "-"}</td>
                            <td>{data?.transaction_date ?? "-"}</td>
                            <td>{data.transaction_time ?? "-"}</td>
                            <td>{formatNumberToINR(data.amount)}</td>
                            <td>{formatNumberToINR(data.balance)}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                  <tfoot></tfoot>
                </Table>
              </div>
            </div>
          </Row>
        </Modaljs>
      </div>
    </>
  );
}
