import React, { useEffect, useMemo, useState } from "react";
import { Col, Form } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { BsReceiptCutoff } from "react-icons/bs";
import CardComponent from "../../../../components/CardComponent";
import { useNavigate, useSearchParams } from "react-router-dom";
import moment from "moment";
import { getAllPaySlip } from "../../../../services/authapi";
import { useTranslation } from "react-i18next";
import { createColumnHelper } from "@tanstack/react-table";
import { useSelector } from "react-redux";
import { selectUser } from "../../../../features/auth/authSlice";
import ActionButtons from "../../../../components/DataTable/ActionButtons";
import { UserDetail } from "../../../../components/ItemDetail";
import CustomTable from "../../../../components/DataTable/CustomTable";
import { serialNumber } from "../../../../utils/helper";
import TableHeader from "../../../../components/DataTable/TableHeader";

const PaySlip = ({ checkPermission }) => {
  const [dateValue, setDateValue] = useState(
    moment(new Date()).format("YYYY-MM")
  );
  const { t } = useTranslation();
  const columnHelper = createColumnHelper();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useSelector(selectUser);

  const fetchData = async () => {
    const res = await getAllPaySlip({
      month: dateValue,
      search,
      pageSize,
      pageNo,
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

  const datehandler = (e) => {
    const date = e.target.value;
    setDateValue(date);
  };

  useEffect(() => {
    fetchData();
  }, [search, pageNo, pageSize, dateValue]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("sr_no", {
        header: t("Sr No."),
        cell: (info) => {
          const serialNumbers = serialNumber(pageNo, pageSize);
          return serialNumbers[info.row.index];
        },
      }),
      columnHelper.accessor("name", {
        header: t("Employee Name"),
        cell: (info) => (
          <UserDetail
            img={info.row.original?.user_image}
            name={info.row.original?.user_name}
            id={info.row.original?.user_id}
            unique_id={info.row.original?.employee_id}
            login_id={user.id}
          />
        ),
      }),
      columnHelper.accessor("employee_role", {
        header: t("Role"),
      }),
      columnHelper.accessor("month", {
        header: t("Month"),
      }),
      columnHelper.accessor("email", {
        header: t("Email"),
      }),
      columnHelper.accessor("joining_date", {
        header: t("Join Date"),
      }),
      columnHelper.accessor("gross_salary", {
        header: t("Gross Salary"),
        cell: (info) => (
          <span className="text-green">
            ₹ {info.row.original?.gross_salary}
          </span>
        ),
      }),
      columnHelper.accessor("action", {
        header: t("Pay Slip"),
        cell: (info) => (
          <ActionButtons
            actions={{
              view: {
                show: checkPermission?.view,
                tooltipTitle: "Generate Slip",
                disabled: false,
                action: () =>
                  navigate(
                    `/PaySlip/ViewPaySlipDetails/${info.row.original?.user_id}/${dateValue}`
                  ),
                icon: BsReceiptCutoff,
                align: "top",
                className: "social-btn danger-combo",
              },
            }}
          />
        ),
      }),
    ],
    [checkPermission, t, rows.length, pageNo, pageSize]
  );

  return (
    <>
      <Helmet>
        <title>Pay Slip · CMS Electricals</title>
      </Helmet>

      <CustomTable
        id={`pay_slip`}
        userPermission={checkPermission}
        isLoading={isLoading}
        rows={rows || []}
        columns={columns}
        pagination={{
          pageNo,
          pageSize,
          totalData,
        }}
        customHeaderComponent={() => (
          <TableHeader
            userPermission={checkPermission}
            setSearchText={setSearch}
            button={{
              show: false,
            }}
            extraComponent={
              <Form.Control
                className="w-auto"
                value={dateValue}
                onChange={datehandler}
                type="month"
                name={"date"}
              />
            }
          />
        )}
        tableTitleComponent={<strong>pay slip</strong>}
      />
    </>
  );
};

export default PaySlip;
