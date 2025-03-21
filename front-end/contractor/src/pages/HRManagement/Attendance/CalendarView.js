import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import {
  getAllUsersAttendanceInCalendar,
  postMarkBulkAttendance,
} from "../../../services/contractorApi";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import ConfirmAlert from "../../../components/ConfirmAlert";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/auth/authSlice";
import { createColumnHelper } from "@tanstack/react-table";
import CustomTable, {
  selectable,
} from "../../../components/DataTable/CustomTable";
import TableHeader from "../../../components/DataTable/TableHeader";
import { useTranslation } from "react-i18next";
import { serialNumber } from "../../../utils/helper";
import { UserDetail } from "../../../components/ItemDetail";
import { Formik } from "formik";
import MyInput from "../../../components/MyInput";
import { addBulkAttendanceSchema } from "../../../utils/formSchema";
import moment from "moment";

const CalendarView = ({ selectedMonth, changeView }) => {
  let { pathname } = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector(selectUser);
  const [showAlert, setShowAlert] = useState(false);
  const [idToMark, setIdToMark] = useState("");
  const columnHelper = createColumnHelper();
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || "10";
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [edit, setEdit] = useState({});
  const { userPermission } = useSelector(selectUser);
  const { t } = useTranslation();

  const fetchCalendarData = async () => {
    const res = await getAllUsersAttendanceInCalendar({
      yearMonth: selectedMonth,
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

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    values["user_ids"] = edit?.date ? [idToMark] : idToMark;
    values["month"] = selectedMonth;

    if (edit?.date) {
      values["date"] = `${edit?.date}`;
    }

    // return console.log("values", values);
    const res = await postMarkBulkAttendance(values);
    if (res.status) {
      toast.success(res.message);
      fetchCalendarData();
    } else {
      toast.error(res.message);
    }
    setShowAlert(false);
    resetForm();
    setSubmitting(false);
  };

  useEffect(() => {
    fetchCalendarData();
  }, [search, pageNo, pageSize, selectedMonth, changeView]);

  const columns = useMemo(() => {
    const baseColumns = [
      selectable,
      columnHelper.accessor("sr_no", {
        header: t("Sr No."),
        cell: (info) => {
          const serialNumbers = serialNumber(pageNo, pageSize);
          return serialNumbers[info.row.index];
        },
      }),
      columnHelper.accessor("User", {
        header: "User",
        cell: (info) => (
          <UserDetail
            img={info.row.original?.image}
            name={info.row.original?.name}
            login_id={user?.id}
            id={info.row.original?.id}
            unique_id={info.row.original?.employee_id}
          />
        ),
      }),
      columnHelper.accessor("total_pay_days", {
        header: t("Pay Days"),
      }),
    ];
    const attendanceColumns = rows[0]?.attendanceReports?.map((_, idx) =>
      columnHelper.accessor(`attendanceReports[${idx}]`, {
        header: idx + 1,
        cell: (info) => {
          const status = info.row.original?.attendanceReports[idx];
          return (
            <div
              className={`cursor-pointer`}
              style={{
                color:
                  status === "AB"
                    ? "red"
                    : status === "HF"
                    ? "orange"
                    : status === "L"
                    ? "blue"
                    : status === "H"
                    ? "purple"
                    : "green",
              }}
              onClick={() => {
                // navigate(`/Attendance/edit/${info.row.original?.id}`, {
                //   state: info.row.original,
                // });
                setIdToMark(info.row.original?.id);
                setEdit({
                  ...info.row.original,
                  status: status,
                  date: idx + 1,
                });
                setShowAlert(true);
              }}
            >
              {status}
            </div>
          );
        },
      })
    );

    return [...baseColumns, ...(attendanceColumns || [])];
  }, [rows, pageNo, pageSize, selectedMonth, changeView, t]);

  return (
    <>
      <Helmet>
        <title>Attendance · CMS Electricals</title>
      </Helmet>

      <Col md={12} data-aos={"fade-up"}>
        <CustomTable
          id={"users_attendance"}
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
              // userPermission={userPermission}
              setSearchText={setSearch}
              button={{
                noDrop: true,
                show: selectedRows?.info?.length > 0 && true,
                toClick: () => {
                  setIdToMark(selectedRows.info.map((itm) => itm.original.id));
                  setShowAlert(true);
                  setEdit({});
                },
                title: "Mark Multiple Attendance",
              }}
            />
          )}
          tableTitleComponent={
            <div>
              <strong>Users Attendance</strong>
            </div>
          }
        />
      </Col>

      <Formik
        enableReinitialize={true}
        initialValues={{
          attendance_status: edit?.status || "P",
          date: edit?.date || "",
          in_time: moment(new Date()).format("09:00"),
          out_time: moment(new Date()).format("18:00"),
          note: "",
        }}
        validationSchema={addBulkAttendanceSchema}
        onSubmit={handleSubmit}
      >
        {(props) => (
          <ConfirmAlert
            formikProps={props}
            hide={setShowAlert}
            show={showAlert}
            type="submit"
            title={`Confirm Mark`}
            description={
              <>
                Are you sure you want to mark this!!
                <Row className="g-2 mt-1 text-start">
                  <Form.Group as={Col} md={4}>
                    <MyInput
                      isRequired
                      menuPosition="fixed"
                      menuPortalTarget={false}
                      name={"attendance_status"}
                      formikProps={props}
                      label={t("Status")}
                      customType={"select"}
                      selectProps={{
                        data: [
                          { value: "AB", label: "Absent" },
                          { value: "P", label: "Present" },
                          { value: "HF", label: "Half Day" },
                        ],
                      }}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={4}>
                    <MyInput
                      name={"in_time"}
                      formikProps={props}
                      label={t("In Time")}
                      type="time"
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={4}>
                    <MyInput
                      name={"out_time"}
                      formikProps={props}
                      label={t("Out Time")}
                      type="time"
                      min={props.values.in_time}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={6}>
                    <MyInput
                      isRequired
                      name={"date"}
                      disabled={edit?.date}
                      formikProps={props}
                      label={t("date")}
                      helperText="format should be: 1-5, 7-8, 10, etc. "
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={6}>
                    <MyInput
                      name={"note"}
                      formikProps={props}
                      label={t("Note")}
                      customType={"multiline"}
                    />
                  </Form.Group>
                </Row>
              </>
            }
          />
        )}
      </Formik>
    </>
  );
};

export default CalendarView;
