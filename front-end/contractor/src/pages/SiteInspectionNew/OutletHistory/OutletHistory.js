import React, { useEffect, useState } from "react";
import { Col, Table } from "react-bootstrap";
import CardComponent from "../../../components/CardComponent";
import { Helmet } from "react-helmet";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { useTranslation } from "react-i18next";
import ActionButton from "../../../components/ActionButton";
import ReactPagination from "../../../components/ReactPagination";
import {
  getAllEmployeeComplaints,
  getAllSiteOutlet,
} from "../../../services/contractorApi";

const OutletHistory = () => {
  const [employee, setEmployee] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageDetail, setPageDetail] = useState({});
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [startDate, setStartDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const formattedDate = moment(startDate).format("YYYY-MM");

  const fetchAllOutlet = async () => {
    const res = await getAllEmployeeComplaints(
      pageSize,
      pageNo,
      searchTerm,
      formattedDate
    );
    if (res.status) {
      setEmployee(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setEmployee([]);
      setPageDetail({});
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAllOutlet();
  }, [formattedDate, searchTerm, pageNo]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };
  return (
    <>
      <Helmet>
        <title>Office Inspection · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CardComponent
          className="card-bg"
          title={"Outlet History"}
          search={true}
          searchOnChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          custom={
            <>
              <Col style={{ zIndex: "1000" }} md={4}>
                <DatePicker
                  className="p-1 ps-4 me-1 shadow-none border-primary  bg-transparent "
                  dateFormat="MMMM yyyy"
                  showMonthYearPicker
                  selected={startDate}
                  placeholderText="--select month--"
                  onChange={(date) => setStartDate(date)}
                  showIcon
                />
              </Col>
            </>
          }
        >
          <div className="table-scroll">
            <Table className="text-body bg-new Roles">
              <thead className="text-truncate">
                <tr>
                  <th>{t("Sr No.")}</th>
                  <th>{t("Employee Id")}</th>
                  <th>{t("Employee Name")}</th>
                  <th>{t("Outlet No.")}</th>
                  <th className="text-start">{t("Oulet Name")}</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <td colSpan={7}>
                    <img
                      className="p-3"
                      width="250"
                      src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
                      alt="Loading"
                    />
                  </td>
                ) : employee?.length > 0 ? (
                  employee?.map((data, idx) => {
                    return (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>{data?.employee_id ?? "--"} </td>
                        <td>{data?.name ?? "--"}</td>
                        <td>
                          {data?.outlets?.map((itm) => (
                            <li>{itm?.unique_id ?? "--"}</li>
                          ))}
                        </td>
                        <td className="text-start">
                          {data?.outlets?.map((itm) => (
                            <li>{itm?.name ?? "--"}</li>
                          ))}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <td colSpan={7}>
                    <img
                      className="p-3"
                      alt="no-result"
                      width="250"
                      src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                    />
                  </td>
                )}
              </tbody>
              <tfoot>
                <td colSpan={10}>
                  <ReactPagination
                    pageSize={pageSize}
                    prevClassName={
                      pageNo === 1
                        ? "danger-combo-disable pe-none"
                        : "red-combo"
                    }
                    nextClassName={
                      pageSize == pageDetail?.total
                        ? employee.length - 1 < pageSize
                          ? "danger-combo-disable pe-none"
                          : "success-combo"
                        : employee.length < pageSize
                        ? "danger-combo-disable pe-none"
                        : "success-combo"
                    }
                    title={`Showing ${pageDetail?.pageStartResult || 0} to ${
                      pageDetail?.pageEndResult || 0
                    } of ${pageDetail?.total || 0}`}
                    handlePageSizeChange={handlePageSizeChange}
                    prevonClick={() => setPageNo(pageNo - 1)}
                    nextonClick={() => setPageNo(pageNo + 1)}
                  />
                </td>
              </tfoot>
            </Table>
          </div>
        </CardComponent>
      </Col>
    </>
  );
};

export default OutletHistory;
