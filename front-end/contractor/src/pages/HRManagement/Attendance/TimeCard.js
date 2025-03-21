import React, { useMemo, useState } from "react";
import moment from "moment";
import { Col, Form } from "react-bootstrap";
import { useEffect } from "react";
import { getAdminAllTimeCard } from "../../../services/authapi";
import { useNavigate, useSearchParams } from "react-router-dom";
import CalendarView from "./CalendarView";
import { BsCalendar4Week, BsTable } from "react-icons/bs";
import TooltipComponent from "../../../components/TooltipComponent";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/auth/authSlice";
import CustomTable from "../../../components/DataTable/CustomTable";
import { createColumnHelper } from "@tanstack/react-table";
import ActionButtons from "../../../components/DataTable/ActionButtons";
import { UserDetail } from "../../../components/ItemDetail";
import { serialNumber } from "../../../utils/helper";
import DateRange from "../../../components/DateRange";
import TableHeader from "../../../components/DataTable/TableHeader";

const TimeCard = ({ refresh2 }) => {
  const [dateRangeValue, setDateRangeValue] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(
    moment(new Date()).format("YYYY-MM") || ""
  );
  const [changeView, setChangeView] = useState(false);
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const columnHelper = createColumnHelper();
  const navigate = useNavigate();
  const { user, userPermission } = useSelector(selectUser);

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const fetchTimeCardData = async () => {
    const res = await getAdminAllTimeCard({
      date: dateRangeValue,
      search,
      pageSize,
      pageNo,
    });
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
      columnHelper.accessor("employee_id", {
        header: t("Employee Code"),
        cell: (info) =>
          info.row.original?.employee_id ? info.row.original?.employee_id : "-",
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
      columnHelper.accessor("date", {
        header: t("Date"),
      }),
      columnHelper.accessor("clockIn", {
        header: t("Login"),
      }),
      columnHelper.accessor("clockOut", {
        header: t("Logout"),
      }),
      columnHelper.accessor("totalWorkDuration", {
        header: t("Total Time"),
      }),
      columnHelper.accessor("action", {
        header: t("Action"),
        cell: (info) => (
          <ActionButtons
            actions={{
              view: {
                show: true,
                action: () =>
                  navigate(
                    `/Attendance/UserAttendance/${info.row.original?.user_id}`
                  ),
              },
            }}
          />
        ),
      }),
    ],
    [rows.length, pageNo, pageSize]
  );

  useEffect(() => {
    fetchTimeCardData();
  }, [search, pageNo, pageSize, refresh2, dateRangeValue]);

  return (
    <>
      <Col md={12} data-aos={"fade-up"}>
        <div className="d-flex gap-3 align-items-center mb-2 justify-content-end">
          <div>
            {changeView === false ? (
              <DateRange value={dateRangeValue} setValue={setDateRangeValue} />
            ) : (
              <Form.Control
                type="month"
                value={selectedMonth}
                onChange={handleMonthChange}
              />
            )}
          </div>

          <TooltipComponent
            title={changeView === false ? "Calendar View" : "Table View"}
          >
            <div
              onClick={() => setChangeView(!changeView)}
              className={`social-btn-re d-align gap-2 px-3 w-auto ${
                changeView === false ? "danger" : "success"
              }-combo`}
            >
              {changeView === false ? <BsCalendar4Week /> : <BsTable />}
            </div>
          </TooltipComponent>
        </div>

        {changeView === false ? (
          <CustomTable
            id={"time_card"}
            maxHeight="35vh"
            isLoading={isLoading}
            rows={rows || []}
            columns={columns}
            pagination={{
              pageNo,
              pageSize,
              totalData,
            }}
            align={"bottom"}
            customHeaderComponent={(selectedRows) => (
              <TableHeader
                userPermission={userPermission}
                setSearchText={setSearch}
                button={{
                  show: false,
                }}
              />
            )}
            tableTitleComponent={
              <div>
                <strong>Users Attendance</strong>
              </div>
            }
          />
        ) : (
          <CalendarView selectedMonth={selectedMonth} changeView={changeView} />
        )}
      </Col>
    </>
  );
};

export default TimeCard;
