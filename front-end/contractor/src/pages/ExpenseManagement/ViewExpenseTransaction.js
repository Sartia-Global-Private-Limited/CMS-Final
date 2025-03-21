import React, { useEffect, useMemo, useState } from "react";
import { BsSearch } from "react-icons/bs";
import Select from "react-select";
import { Card, Col, Form, Row, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  getEmployeeList,
  getExpenseTransactionDetails,
} from "../../services/contractoApi2";
import {
  getAllEndUserBySupervisorId,
  getAllManagersUser,
  getAllUsersForExpenses,
  getSupervisorListWithTotalFreeUserByManagerId,
} from "../../services/contractorApi";
import ReactPagination from "../../components/ReactPagination";
import { useDebounce } from "../../hooks/UseDebounce";
import { useTranslation } from "react-i18next";
import FormLabelText from "../../components/FormLabelText";
import { FREQUENCY } from "../../data/StaticData";
import DateRange from "../../components/DateRange";
import ExportExcelPdf from "../../components/ExportExcelPdf";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createColumnHelper } from "@tanstack/react-table";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import { UserPlus } from "lucide-react";
import TableHeader from "../../components/DataTable/TableHeader";
import CustomTable from "../../components/DataTable/CustomTable";
import { serialNumber } from "../../utils/helper";

export default function ViewExpenseTransaction({ checkPermission }) {
  const columnHelper = createColumnHelper();
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const { userPermission } = useSelector(selectUser);
  const { user } = useSelector(selectUser);
  const navigate = useNavigate();

  const [allAccounts, setallAccounts] = useState([]);

  const [EmployeeList, setEmployeeList] = useState([]);
  const [employeeType, setEmployeeType] = useState("manager");
  const [employeeId, setEmployeeId] = useState("");
  const [allOfficeUser, setAllofficeUser] = useState([]);
  const [allManagers, setAllManagers] = useState([]);
  const [freeSupervisorData, setFreeSupervisorData] = useState([]);
  const [freeUserData, setFreeUserData] = useState([]);
  const [dateRangeValue, setDateRangeValue] = useState("");
  const [selected, setSelected] = useState("");
  const [filterBy, setFilterby] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    fetchEmployeeList();
    fetchOfficeUser();
    fetchManagers();
  }, [employeeType]);

  const debounceValue = useDebounce(search, 500);

  useEffect(() => {
    if (filterBy || dateRangeValue) {
      getAccountBalance();
    }
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
    const res = await getAllUsersForExpenses();
    if (res.status) {
      setAllofficeUser(res.data);
    } else {
      setAllofficeUser([]);
    }
  };

  const getAccountBalance = async () => {
    const module = "expense";
    const module_type = "expense-transactions";
    const res = await getExpenseTransactionDetails(
      employeeId?.value,
      module,
      module_type,
      {
        date: filterBy || dateRangeValue,
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
        header: "complaint number",
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
      columnHelper.accessor("transaction_date", {
        header: "transaction date",
      }),
    ],
    [checkPermission, rows.length, pageNo, pageSize]
  );

  return (
    <>
      <Row className="shadow rounded p-2 m-3">
        <Col md={3}>
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
              setEmployeeId(e);
              if (e) setSelected("office");
              else setSelected("");
            }}
          />
        </Col>
        <Col md={3}>
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
              setEmployeeId(e);
              if (e) setSelected("manager");
              else setSelected("");
            }}
          />
        </Col>
        <Col md={3}>
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
              setEmployeeId(e);
            }}
          />
        </Col>

        <Col md={3}>
          <FormLabelText children={t("End User")} />
          <Select
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
        </Col>
        <Col md={3}>
          <FormLabelText children={t("Select Date Range")} />
          <DateRange value={dateRangeValue} setValue={setDateRangeValue} />
        </Col>
        <Col md={3}>
          <FormLabelText children={t("Select Frequency")} />
          <Select
            menuPortalTarget={document.body}
            options={FREQUENCY}
            isClearable
            onChange={(e) => {
              setFilterby(e ? e.value : null);
            }}
          />
        </Col>

        <Col className="mt-3">
          <span>
            {t("End User")} :{" "}
            <b className="text-success">{employeeId?.label || "--"} </b>
          </span>
        </Col>
      </Row>
      <CustomTable
        id={"view_expense_transaction"}
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
        module={"expense"}
        module_type={"expense-transactions"}
        employeeId={employeeId?.value}
        apiForExcelPdf={getExpenseTransactionDetails}
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
            <UserPlus /> <strong>View Expense Transaction</strong>
          </div>
        }
      />
    </>
  );
}

// <Col md={12} data-aos={"fade-up"}>
//   <Card className="card-bg">
//     <h6 className=" fw-bold mx-3 my-3">{t("view expense transactions")}</h6>
//     <div className="container">
//     </div>

//     <div className="p-3">
//       <div className="table-scroll">
//         <Table className="text-body bg-new Roles">
//           <thead className="text-truncate">
//             <tr>
//               <th>{t("Sr No.")}</th>
//               <th>{t("complaint No")}.</th>
//               <th>{t("Transaction Type")}</th>
//               <th>{t("Amount")}</th>
//               <th>{t("Balance")}</th>
//               <th>{t("Transaction Date")}</th>
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr>
//                 <td colSpan={12}>
//                   <img
//                     className="p-3"
//                     width="250"
//                     src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
//                     alt={t("Loading")}
//                   />
//                 </td>
//               </tr>
//             ) : allAccounts?.length > 0 ? (
//               allAccounts?.map((data, id1) => (
//                 <tr key={id1}>
//                   <td>{id1 + 1}</td>

//                   <td>
//                     {data?.complaint_details?.complaint_unique_id ?? "--"}
//                   </td>

//                   <td
//                     className={`text-${
//                       data?.transaction_type == "credit"
//                         ? "green"
//                         : "danger"
//                     }`}
//                   >
//                     {data?.transaction_type || "--"}
//                   </td>

//                   <td className="text-green">₹ {data?.amount}</td>
//                   <td className="text-green">₹ {data?.balance}</td>
//                   <td>{data?.transaction_date}</td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={10}>
//                   <img
//                     className="p-3"
//                     alt="no-result"
//                     width="250"
//                     src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
//                   />
//                 </td>
//               </tr>
//             )}
//           </tbody>
//           <tfoot>
//             <tr>
//               <td colSpan={10}>
//                 <ReactPagination
//                   pageSize={pageSize}
//                   prevClassName={
//                     pageNo === 1
//                       ? "danger-combo-disable pe-none"
//                       : "red-combo"
//                   }
//                   nextClassName={
//                     pageSize == pageDetail?.total
//                       ? allAccounts.length - 1 < pageSize
//                         ? "danger-combo-disable pe-none"
//                         : "success-combo"
//                       : allAccounts.length < pageSize
//                       ? "danger-combo-disable pe-none"
//                       : "success-combo"
//                   }
//                   title={`Showing ${pageDetail?.pageStartResult || 0} to ${
//                     pageDetail?.pageEndResult || 0
//                   } of ${pageDetail?.total || 0}`}
//                   handlePageSizeChange={handlePageSizeChange}
//                   prevonClick={() => setPageNo(pageNo - 1)}
//                   nextonClick={() => setPageNo(pageNo + 1)}
//                 />
//               </td>
//             </tr>
//           </tfoot>
//         </Table>
//       </div>
//     </div>
//   </Card>
// </Col>
