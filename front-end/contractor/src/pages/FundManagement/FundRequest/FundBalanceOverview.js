import React, { useEffect, useMemo, useState } from "react";
import { Col, Form, Stack } from "react-bootstrap";
import { getAllBankListForDropdown } from "../../../services/contractorApi";
import { getAllAccountTransactions } from "../../../services/contractoApi2";
import FundBalanceEmployee from "./FundBalanceEmployee";
import { useTranslation } from "react-i18next";
import { FilterSelect } from "../../../components/FilterSelect";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/auth/authSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createColumnHelper } from "@tanstack/react-table";
import CustomTable from "../../../components/DataTable/CustomTable";
import TableHeader from "../../../components/DataTable/TableHeader";
import { UserPlus } from "lucide-react";
import { formatNumberToINR, serialNumber } from "../../../utils/helper";

const FundBalanceOverview = ({ checkPermission }) => {
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
  useEffect(() => {
    fetchAllBanksData();
  }, []);

  const fetchAllBanksData = async () => {
    const res = await getAllBankListForDropdown({ isAccounts: true });
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

  const handleClick = () => {
    if (searchParams.has("pageNo")) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("pageNo");
      navigate(`?${newParams.toString()}`, { replace: true });
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

  const handleAccountByBankIdChange = async () => {
    const module = "fund";
    const module_type = "fund-balance";
    const res = await getAllAccountTransactions(
      bankId.value,
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

  useEffect(() => {
    handleAccountByBankIdChange();
  }, [bankId.value, pageSize, pageNo, search]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("sr_no", {
        header: t("Sr No."),
        cell: (info) => {
          const serialNumbers = serialNumber(pageNo, pageSize);
          return serialNumbers[info.row.index];
        },
      }),
      columnHelper.accessor("account_holder_name", {
        header: "Account Holder Name",
      }),
      columnHelper.accessor("account_number", {
        header: "Account No",
      }),
      columnHelper.accessor("account_type", {
        header: "Account Type",
      }),
      columnHelper.accessor("ifsc_code", {
        header: "IFSC code",
      }),
      columnHelper.accessor("branch", {
        header: "Branch",
      }),
      columnHelper.accessor("last_balance", {
        header: "Last balance",
        cell: (info) => formatNumberToINR(info.getValue()),
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
            <span className="ps-3">{t("Balance Overview For")} : </span>
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
            <FilterSelect
              data={[
                {
                  id: bankId,
                  setId: setBankId,
                  title: "bank",
                  data: allBanksData,
                  hyperText: "Please select bank ",
                },
              ]}
              userFormatOptionLabel={userFormatOptionLabel}
            />
            <CustomTable
              id={"transferred_fund"}
              isLoading={isLoading}
              rows={rows || []}
              columns={columns}
              pagination={{
                pageNo,
                pageSize,
                totalData,
              }}
              bankId={bankId.value}
              module={"fund"}
              module_type={"fund-balance"}
              excelAction={() => ""}
              pdfAction={() => ""}
              apiForExcelPdf={getAllAccountTransactions}
              customHeaderComponent={
                <TableHeader
                  userPermission={checkPermission}
                  setSearchText={setSearch}
                  button={{ show: false }}
                />
              }
              tableTitleComponent={
                <div>
                  <UserPlus /> <strong>Fund balance overview</strong>
                </div>
              }
            />
          </>
        ) : (
          <FundBalanceEmployee
            module="fund"
            module_type="fund-balance"
            checkPermission={checkPermission}
          />
        )}
      </Col>
    </div>
  );
};

export default FundBalanceOverview;
