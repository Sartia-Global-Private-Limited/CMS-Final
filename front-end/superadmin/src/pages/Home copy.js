import React, { useEffect, useState } from "react";
import { BiLogIn, BiLogOut } from "react-icons/bi";
import { Button, Col, Row, } from "react-bootstrap";
import CardComponent from "../components/CardComponent";
import { Helmet } from "react-helmet";
import TotalUserCount from "../components/BarCharts/TotalUserCount";
import TotalRevenue from "../components/BarCharts/TotalRevenue";
import EnergyCompanies from "../components/BarCharts/EnergyCompanies";
import Contractors from "../components/BarCharts/Contractors";
import TotalSubUsers from "../components/BarCharts/TotalSubUsers";
import TotalDealers from "../components/BarCharts/TotalDealers";
import Select from "react-select";
import moment from "moment";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  getDashboardData,
  getTotalHours,
  updateBreakEnd,
  updateBreakStart,
  updateClockIn,
  updateClockOut,
} from "../services/authapi";

const Home = () => {
  const [getData, setGetData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [totalHours, setTotalHours] = useState([]);
  const [checked, setChecked] = useState(false);
  const [checked1, setChecked1] = useState(false);

  const handleClockIn = async () => {
    const res = await updateClockIn();
    setRefresh(true);
  };
  const handleClockOut = async () => {
    const res = await updateClockOut();
    setRefresh(true);
  };
  const handleBreakStart = async () => {
    const rData = {
      status: "Company break",
      break_type: 1,
    };
    const res = await updateBreakStart(rData);
    setRefresh(true);
  };
  const handleBreakEnd = async () => {
    const rData = {
      break_type: 1,
    };
    const res = await updateBreakEnd(rData);
    setRefresh(true);
  };

  const fetchData = async () => {
    const res = await getDashboardData();
    if (res.status) {
      setGetData(res.data[0]);
    } else {
      setGetData([]);
    }
  };
  const fetchHoursData = async () => {
    const res = await getTotalHours();
    if (res.status) {
      setTotalHours(res.data[0]);
    } else {
      setTotalHours([]);
    }
  };

  const months = {
    0: "January",
    1: "February",
    2: "March",
    3: "April",
    4: "May",
    5: "June",
    6: "July",
    7: "August",
    8: "September",
    9: "October",
    10: "November",
    11: "December",
  };
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const d = new Date();

  const dashboard = [
    {
      id: 1,
      col: 7,
      title: "Total User Count",
      chart: <TotalUserCount />,
      drop: <NavDrop />,
    },
    {
      id: 2,
      col: 5,
      title: "Total Revenue",
      chart: <TotalRevenue />,
      drop: <NavDrop />,
    },
    {
      id: 3,
      col: 7,
      title: "Energy Companies",
      chart: <EnergyCompanies />,
      drop: <NavDrop />,
    },
    {
      id: 4,
      col: 5,
      title: "Contractors",
      chart: <Contractors />,
      drop: <NavDrop />,
    },
    {
      id: 5,
      col: 7,
      title: "Total Sub Users",
      chart: <TotalSubUsers />,
      drop: <NavDrop />,
    },
    {
      id: 6,
      col: 5,
      title: "Total Dealers",
      chart: <TotalDealers />,
      drop: <NavDrop />,
    },
  ];

  const percentage = 66;

  function NavDrop() {
    return (
      <Select
        className="text-primary"
        options={[
          { value: "daily", label: "Daily" },
          { value: "weekly", label: "Weekly" },
          { value: "monthly", label: "Monthly" },
          { value: "yearly", label: "Yearly" },
        ]}
      />
    );
  }

  const [date, setDate] = useState(new Date());

  function refreshClock() {
    setDate(new Date());
  }
  useEffect(() => {
    const timerId = setInterval(refreshClock, 1000);
    return function cleanup() {
      clearInterval(timerId);
    };
  }, []);
  useEffect(() => {
    fetchData();
    fetchHoursData();
  }, [refresh]);

  return (
    <>
      <Helmet>
        <title>CMS Electricals</title>
      </Helmet>
      <Col md={12}>
        <div className="p-2">
          <Row className="g-3">
            <Col md={3}>
              <div className="d-grid gap-3">
                <div className="rounded shadow py-2 text-center">
                  <p className="m-0">{d.getDate()} {months[d.getMonth()]}</p>
                  <p className="m-0 text-secondary text-shadow-1 fs-6">{days[d.getDay()]}</p>
                  <p className="m-0">{moment(d).format("LTS")}</p>
                </div>
                <div className="rounded shadow py-2 text-center">
                  <p className="m-0">Lunch Break</p>
                  <p className="m-0 text-secondary text-shadow-1">
                    {getData.breakStartTime === "" ? "" : getData.breakStartTime}
                  </p>

                  <Button
                    className={`shadow px-3 border-0 my-2 bg-${getData.breakMark === true
                      ? "success"
                      : "danger"
                      }`}
                    onClick={() =>
                      getData.breakMark === true
                        ? handleBreakEnd()
                        : handleBreakStart()
                    }
                  >
                    {getData.breakMark === true ? (
                      <BiLogIn className="fs-5" />
                    ) : (
                      <BiLogOut className="fs-5" />
                    )}
                    &nbsp;
                    {getData.breakMark === true ? "End" : "Start"}
                  </Button>
                </div>
              </div>
            </Col>

            <Col md={6}>
              <div className="align-self-start">
                <div className="rounded text-center shadow p-2">
                  <p className="mb-0">TOTAL WORKING HOURS</p>

                  <p className="m-0 fw-bold text-secondary text-shadow-1 fs-1">
                    {" "}
                    {totalHours.total_work_hours} HOURS
                  </p>
                  <p className="mb-0">
                    login&nbsp;
                    {getData.loggedInTime === ""
                      ? ""
                      : `AT :${getData.loggedInTime}`}
                  </p>
                </div>

                <div className="text-center">
                  <Button
                    className="text-size mt-4 shadow fw-bold "
                    onClick={() =>
                      getData.loggedIn === true ? handleClockOut() : handleClockIn()
                    }
                    size="sm"
                    variant={
                      getData.loggedIn === true
                        ? "outline-danger"
                        : "outline-success"
                    }>
                    {" "}
                    {getData.loggedIn === true ? (
                      <BiLogIn className="fs-4" />
                    ) : (
                      <BiLogOut className="fs-4" />
                    )}
                    &nbsp;{getData.loggedIn === true ? "Clock Out" : "Clock In"}
                  </Button>
                </div>
              </div>
            </Col>

            <Col md={3}>
              <div className="rounded shadow py-2 text-center">
                <p
                  className="social-btn-re danger-combo lh-1 w-auto h-auto mx-2">
                  Working Progress
                </p>
                <p>{moment(d).format("ll")}</p>
                <p>
                  <div style={{ width: 80, height: 80, margin: "auto" }}>
                    <CircularProgressbar
                      styles={buildStyles({
                        textColor: "#5200ff",
                        pathColor: "#5200ff",
                      })}
                      value={percentage}
                      text={`${percentage}%`}
                    />
                  </div>
                </p>
              </div>
            </Col>
          </Row>
        </div>
      </Col>
      {
        dashboard.map((items, idx) => (
          <Col key={idx} md={items.col}>
            <CardComponent
              align={items.align}
              shadow={"shadow-none"}
              headclass={"mb-2"}
              heading2={items.date}
              classbody={items.classbody}
              custom={items.select}
              icon={items.drop}
              title={items.title}>
              {items.chart}
            </CardComponent>
          </Col>
        ))
      }
    </>
  );
};

export default Home;
