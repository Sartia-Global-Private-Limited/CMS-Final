import React, { useState } from "react";
import { Row, Col, Table, Form } from "react-bootstrap";
import CardComponent from "../../../components/CardComponent";
import Chart from "react-apexcharts";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import {
  getAttendanceChartData,
  viewSingleEmployeeAttendance,
  viewSingleEmployeeChart,
} from "../../../services/authapi";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import MonthPicker from "month-year-picker";

const Attendance = () => {
  const { id } = useParams();
  const [viewAttendance, setViewAttendance] = useState([]);
  const [chartData, setChartData] = useState("");

  const [date, setDate] = useState(
    new Date().getFullYear() +
      "-" +
      ("0" + (new Date().getMonth() + 1)).slice(-2)
  );

  const handleChange = async () => {
    const res = await viewSingleEmployeeAttendance(id, date);
    const res1 = await viewSingleEmployeeChart(id, date);
    // console.log(res1);
    if (res.status) {
      setViewAttendance(res.data);
    } else if (res1.status) {
      setChartData(res1.data);
    } else {
      setViewAttendance([]);
      setChartData([]);
    }
  };

  // const fetchData = async () => {
  //   const res = await getAttendanceChartData(id);
  //   if (res.status) {
  //     setChartData(res.data);
  //     // console.log(res.data);
  //   } else {
  //     setChartData([]);
  //   }
  // };

  // console.log(chartData?.TotalWorkingDays);

  const mrr = [
    {
      id: 1,
      title: "Total Working Days",
      number: `31/${chartData?.TotalWorkingDays}`,
      color: "px-3 success",
      text: "success",
    },
    {
      id: 2,
      title: "Total Absent",
      number: chartData?.totalAbsent,
      color: "px-4 red",
      text: "danger",
    },
    {
      id: 3,
      title: "Total Sick Leave",
      number: chartData?.totalSickLeave,
      color: "px-4 danger",
      text: "orange",
    },
  ];

  const chartData2 = {
    series: [
      chartData?.totalOnTimeAttendancePercentage,
      chartData?.totalLateTimeAttendancePercentage,
      chartData?.totalAbsentPercentage,
    ],
    options: {
      chart: {
        type: "donut",
      },
      colors: ["#018a7c", "#ff9a06", "#f34235"],
      labels: ["In Time", "In Late", "Absents"],
    },
  };

  const events = [{ title: "Meeting", start: new Date() }];

  function renderEventContent(eventInfo) {
    return (
      <div className="social-btn w-100 h-auto success-combo">
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
      </div>
    );
  }

  // useEffect(() => {
  //   fetchData();
  // }, []);

  useEffect(() => {
    handleChange(date);
  }, [date]);
  return (
    <Row className="g-4">
      <Col md={8}>
        <div className="h-100 ">
          {/* <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            weekends={true}
            events={events}
            eventContent={renderEventContent}
          /> */}
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              padding: "8px",
            }}
          >
            <Form.Control
              style={{ width: "200px" }}
              type="month"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
              }}
            />
            {/* {console.log(date)} */}
            {/* <div>
              <p style={{ margin: "0", fontSize: "18px", fontWeight: "bold" }}>
                {months[new Date().getMonth()]} {new Date().getFullYear()}
              </p>
            </div> */}
          </div>

          <div className="overflow-auto p-3 ">
            <Table className="text-body bg-new Roles">
              <thead className="text-truncate">
                <tr>
                  {[
                    "id",
                    "Employees Name",
                    "Date",
                    "Day",
                    "Clock-In time",
                    "Clock-out time",
                    "Total time",
                  ]?.map((thead) => (
                    <th key={thead}>{thead}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {viewAttendance?.map((e) => (
                  <tr>
                    <td>{e.id}</td>
                    <td style={{ textAlign: "center" }}>{e.name}</td>
                    <td>
                      <div className="text-truncate2 line-clamp-2">
                        {e.date}
                      </div>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <div className="text-truncate2 line-clamp-2">{e.day}</div>
                    </td>

                    <td style={{ textAlign: "center" }}> {e.clockIn}</td>
                    <td style={{ textAlign: "center" }}> {e.clockOut}</td>
                    <td style={{ textAlign: "center" }}> {e.totalWorkHour}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </Col>
      <Col md={4}>
        <CardComponent title={"Attendance Status"}>
          <div className="mb-4">
            <Chart
              options={chartData2.options}
              series={chartData2.series}
              type="donut"
              width={300}
            />
          </div>
          <div className="d-grid gap-2">
            <strong>Attendance Self Service</strong>
            <div className="hr-border2" />
            <p className="fw-bold fs-2 text-center mb-0">
              {chartData?.totalWorkHoursInMonth} Hours
            </p>
            {mrr.map((mr, idx) => (
              <div
                key={idx}
                className={`d-align fw-bold justify-content-between text-${mr.text}`}
              >
                <span>{mr.title}</span>{" "}
                <span
                  className={`social-btn-re w-auto h-auto ${mr.color}-combo`}
                >
                  {mr.number}
                </span>
              </div>
            ))}
          </div>
        </CardComponent>
      </Col>
    </Row>
  );
};

export default Attendance;
