import React, { useEffect, useMemo, useState } from "react";
import { Col, Form, Stack } from "react-bootstrap";
import { getAllBankListForDropdown } from "../../services/contractorApi";
import { getAllAccountTransactions } from "../../services/contractoApi2";
import FundBalanceEmployee from "../FundManagement/FundRequest/FundBalanceEmployee";
import StockBalance_Supplier from "./StockBalance_Supplier";
import { useTranslation } from "react-i18next";
import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FilterSelect } from "../../components/FilterSelect";
import TableHeader from "../../components/DataTable/TableHeader";
import CustomTable from "../../components/DataTable/CustomTable";
import { UserPlus } from "lucide-react";
import { selectUser } from "../../features/auth/authSlice";
import { useSelector } from "react-redux";
import { serialNumber } from "../../utils/helper";

const StockBalanceOverview = ({ checkPermission }) => {
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

  const fetchAllBanksData = async () => {
    const res = await getAllBankListForDropdown({ isAccounts: true });
    if (res.status) {
      const rData = res?.data.map((itm) => {
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

  const handleAccountByBankIdChange = async () => {
    const module = "stock";
    const module_type = "stock-balance";
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
    fetchAllBanksData();
  }, []);

  useEffect(() => {
    handleAccountByBankIdChange();
  }, [bankId.value, pageSize, pageNo, search]);

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
      }),
    ],
    [checkPermission, rows.length, pageNo, pageSize]
  );

  return (
    <div>
      <Col md={12} data-aos={"fade-up"}>
        <Form.Group className="mt-3" as={Col} md={12}>
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

            <label className="fw-bolder">
              <input
                type="radio"
                name="fund_request_for"
                value={"3"}
                onChange={() => {
                  handleClick();
                  setBalanceFor("supplier");
                }}
                className="form-check-input"
              />
              {t("Supplier")}
            </label>
          </Stack>
        </Form.Group>

        {BalanceFor == "bank" ? (
          <>
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
                id={"stock_balance_overview"}
                isLoading={isLoading}
                rows={rows || []}
                columns={columns}
                pagination={{
                  pageNo,
                  pageSize,
                  totalData,
                }}
                bankId={bankId.value}
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
                    <UserPlus /> <strong>stock balance overview</strong>
                  </div>
                }
              />
            </>
          </>
        ) : BalanceFor == t("employee") ? (
          <FundBalanceEmployee
            module="stock"
            module_type="stock-balance"
            checkPermission={checkPermission}
          />
        ) : (
          <StockBalance_Supplier checkPermission={checkPermission} />
        )}
      </Col>
    </div>
  );
};

export default StockBalanceOverview;
