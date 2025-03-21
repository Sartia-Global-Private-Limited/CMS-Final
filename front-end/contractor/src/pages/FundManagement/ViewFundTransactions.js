import React, { useEffect, useMemo, useState } from "react";
import { Col, Form, Row, Stack } from "react-bootstrap";
import Select from "react-select";
import {
  getAllAccountByBankId,
  getAllBankListForDropdown,
} from "../../services/contractorApi";
import { getAllAccountTransactionsByBank } from "../../services/contractoApi2";
import FundTransactionEmployee from "./FundTransactionEmployee";
import { useTranslation } from "react-i18next";
import FormLabelText from "../../components/FormLabelText";
import DateRange from "../../components/DateRange";
import { FREQUENCY } from "../../data/StaticData";
import { UserDetail } from "../../components/ItemDetail";
import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate, useSearchParams } from "react-router-dom";
import { selectUser } from "../../features/auth/authSlice";
import { useSelector } from "react-redux";
import { UserPlus } from "lucide-react";
import TableHeader from "../../components/DataTable/TableHeader";
import CustomTable from "../../components/DataTable/CustomTable";
import { formatNumberToINR, serialNumber } from "../../utils/helper";

const ViewFundTransactions = ({ checkPermission }) => {
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
  const [allAccountByBankId, setAllAccountByBankId] = useState([]);
  const [accountDetails, setAccountDetails] = useState("");
  const [filterBy, setFilterby] = useState("");

  const [dateRangeValue, setDateRangeValue] = useState("");

  const fetchAllBanksData = async () => {
    const res = await getAllBankListForDropdown();
    if (res.status) {
      const rData = res.data.map((itm) => {
        return {
          value: itm.id,
          label: itm.bank_name,
          logo: itm.logo,
        };
      });
      setAllBanksData(rData);
    } else {
      setAllBanksData([]);
    }
  };

  const userFormatOptionLabel = ({ label, logo }) => (
    <div>
      {logo ? (
        <img
          src={process.env.REACT_APP_API_URL + logo}
          className="avatar me-2"
        />
      ) : null}
      {label}
    </div>
  );

  const getAllBankAccountByBankId = (id) => {
    if (!id) return false;
    fetchAllAccountByBankId(id);
  };

  const fetchAllAccountByBankId = async (id) => {
    const res = await getAllAccountByBankId(id);
    if (res.status) {
      const rData = res?.data?.map((itm) => {
        return {
          value: itm?.id,
          label: itm?.account_number || "-",
          account_holder_name: itm?.account_holder_name,
          account_type: itm?.account_type,
          logo: itm.res?.data?.bank_logo,
          balance: itm.balance,
        };
      });
      setAllAccountByBankId(rData);
    } else {
      setAllAccountByBankId([]);
    }
  };

  const handleAccountByBankIdChange = async () => {
    const typeselect = "fund";
    const module_type = "fund-transactions";
    const id = accountDetails?.value;
    const res = await getAllAccountTransactionsByBank(
      id,
      typeselect,
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
      setRows(res?.data);
      setTotalData(res?.pageDetails?.total);
    } else {
      setRows([]);
      setTotalData(0);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAllBanksData();
  }, []);

  useEffect(() => {
    handleAccountByBankIdChange();
  }, [
    accountDetails?.value,
    filterBy,
    dateRangeValue,
    pageSize,
    pageNo,
    search,
  ]);

  const handleClick = () => {
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
      columnHelper.accessor("account_number", {
        header: "Account no.",
      }),
      columnHelper.accessor("account_type", {
        header: "Account type",
      }),
      columnHelper.accessor("ifsc_code", {
        header: "ifsc code",
      }),
      columnHelper.accessor("branch", {
        header: "branch",
      }),
      columnHelper.accessor("username", {
        header: "User",
        cell: (info) => (
          <UserDetail
            img={info.row.original.image}
            name={info.row.original.username}
            id={info.row.original.user_id}
            unique_id={info.row.original.employee_id}
          />
        ),
      }),
      columnHelper.accessor("transaction", {
        header: "transaction",
        cell: (info) => (
          <div
            className={`fw-bold text-${
              info.row.original?.status == "debit" ? "danger" : "green"
            }`}
          >
            {formatNumberToINR(info.row.original?.transaction)}
          </div>
        ),
      }),
      columnHelper.accessor("status", {
        header: "status",
        cell: (info) => (
          <div
            className={`fw-bold text-${
              info.row.original?.status == "debit" ? "danger" : "green"
            }`}
          >
            {info.row.original?.status}
          </div>
        ),
      }),
      columnHelper.accessor("description", {
        header: "description",
      }),
      columnHelper.accessor("transaction_id", {
        header: "transaction_id",
      }),
    ],
    [checkPermission, rows.length, pageNo, pageSize]
  );

  return (
    <div>
      <Col md={12} data-aos={"fade-up"}>
        <Form.Group as={Col} md={12}>
          <Stack
            className={`text-truncate px-0 after-bg-light social-btn-re w-auto h-auto `}
            direction="horizontal"
            gap={4}
          >
            <span className="ps-3">{t("Transactions Overview For")} : </span>
            <label className="fw-bolder">
              <input
                type="radio"
                name="fund_request_for"
                value={"1"}
                onChange={() => {
                  handleClick();
                  setBalanceFor("bank");
                }}
                defaultChecked
                className="form-check-input"
              />
              {t("Bank")}
            </label>
            <div className={`vr hr-shadow`} />
            <label className="fw-bolder">
              <input
                type="radio"
                name="fund_request_for"
                value={"2"}
                onChange={() => {
                  handleClick();
                  setBalanceFor("employee");
                }}
                className="form-check-input"
              />
              {t("Employee")}
            </label>
          </Stack>
        </Form.Group>

        {BalanceFor == "bank" ? (
          <>
            <Row className="shadow rounded p-2 m-3">
              <Col md={8}>
                <Row className="g-2 align-items-end">
                  <Col md={6}>
                    <FormLabelText children={t("Select Bank")} />
                    <Select
                      menuPortalTarget={document.body}
                      options={allBanksData}
                      onChange={(e) => {
                        getAllBankAccountByBankId(e?.value);
                        setBankId("");
                        setAccountDetails("");
                      }}
                      formatOptionLabel={userFormatOptionLabel}
                    />
                  </Col>

                  <Col md={6}>
                    <FormLabelText children={t("Select Account")} />
                    <Select
                      menuPortalTarget={document.body}
                      options={allAccountByBankId}
                      value={accountDetails}
                      onChange={(e) => {
                        setBankId(e.id);
                        setAccountDetails(e);
                      }}
                    />
                  </Col>
                  <Col md={6}>
                    <FormLabelText children={t("Select Date Range")} />
                    <DateRange
                      value={dateRangeValue}
                      setValue={setDateRangeValue}
                      // disabled={filterBy ? true : false}
                    />
                  </Col>
                  <Col md={6}>
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
                </Row>
              </Col>
              <Col md={4}>
                <Row>
                  <Col md={12}>
                    <span className="position-relative">
                      {" "}
                      {t("Account Holder Name")} :{" "}
                      <span className="fw-bold">
                        {accountDetails?.account_holder_name}
                      </span>
                      <br />
                      {t("Account Number")} :{" "}
                      <span className="fw-bold">{accountDetails?.label}</span>
                      <br />
                      {t("Account Balance")} :{" "}
                      <span className="fw-bold text-green">
                        {formatNumberToINR(accountDetails?.balance)}
                      </span>
                    </span>
                  </Col>
                </Row>
              </Col>
            </Row>

            <CustomTable
              id={"view_fund_transaction"}
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
              account_id={accountDetails?.value}
              typeSelect={"fund"}
              module_type={"fund-transactions"}
              apiForExcelPdf={getAllAccountTransactionsByBank}
              customHeaderComponent={
                <TableHeader
                  userPermission={checkPermission}
                  setSearchText={setSearch}
                  button={{ show: false }}
                />
              }
              tableTitleComponent={
                <div>
                  <UserPlus /> <strong>view Fund transaction</strong>
                </div>
              }
            />
          </>
        ) : (
          <FundTransactionEmployee
            module="fund"
            checkPermission={checkPermission}
            module_type="fund-transactions"
          />
        )}
      </Col>
    </div>
  );
};

export default ViewFundTransactions;
