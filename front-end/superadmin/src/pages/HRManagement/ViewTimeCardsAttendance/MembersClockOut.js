import React, { useState, useEffect } from "react";
import { Col, Form, Table } from "react-bootstrap";
import {
  getAdminChangeClockTime,
  getAdminTodayClockOut,
} from "../../../services/authapi";
import { toast } from "react-toastify";
import moment from "moment";
import { BsBoxArrowInLeft } from "react-icons/bs";

const MembersClockOut = ({ refresh, setRefresh, pageLoad, setPageLoad }) => {
  const [clockOut, setClockOut] = useState([]);

  const fetchClockOutData = async () => {
    const res = await getAdminTodayClockOut();
    if (res.status) {
      setClockOut(res.data);
    } else {
      setClockOut([]);
    }
  };

  const handleClockOut = async (clockData) => {
    const sData = {
      id: clockData.id,
      type: "clock in",
    };
    const res = await getAdminChangeClockTime(sData);
    if (res.status) {
      toast.success(res.message);
      fetchClockOutData();
    } else {
      toast.error(res.message);
    }
  };

  useEffect(() => {
    fetchClockOutData();
  }, [refresh]);

  return (
    <Col md={12} data-aos={"fade-up"}>
      <div className="overflow-auto p-2">
        <Table className="text-body bg-new Roles">
          <thead className="text-truncate">
            <tr>
              {["Sr No.", "Employee Name", "Date", "Status", "Clock Out"].map(
                (thead) => (
                  <th key={thead}>{thead}</th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {clockOut.length > 0 ? null : (
              <tr>
                <td colSpan={7}>
                  <img
                    className="p-3"
                    alt="no-result"
                    width="250"
                    src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                  />
                </td>
              </tr>
            )}
            {clockOut?.map((clockData, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>
                  <div className="text-truncate">
                    <img
                      className="avatar me-2"
                      src={
                        clockData?.user_image
                          ? `${process.env.REACT_APP_API_URL}${clockData?.user_image}`
                          : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                      }
                      alt={clockData?.user_name}
                    />
                    {clockData?.user_name}
                  </div>
                </td>
                <td>{moment(clockData?.date).format("YYYY-MM-DD")}</td>
                <td>{clockData?.status}</td>
                <td className="text-center">
                  <span className="d-align gap-2">
                    <span
                      onClick={() => handleClockOut(clockData)}
                      className="social-btn-re d-align gap-2 px-3 w-auto success-combo"
                    >
                      <BsBoxArrowInLeft /> Clock In
                    </span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Col>
  );
};

export default MembersClockOut;
