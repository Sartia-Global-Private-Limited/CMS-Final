import moment from "moment";
import React, { useEffect, useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { BsEyeFill, BsSearch } from "react-icons/bs";
import { Link } from "react-router-dom";
import TooltipComponent from "../../components/TooltipComponent";
import { getAdminAllApprovedSoftwareActivation } from "../../services/authapi";
import ReactPagination from "../../components/ReactPagination";

const Approved = ({ refresh }) => {
  const [approveddata, setApproveddata] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const fetchApprovedSoftwareActivationData = async () => {
    const res = await getAdminAllApprovedSoftwareActivation(
      search,
      pageSize,
      pageNo
    );
    if (res.status) {
      setApproveddata(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setApproveddata([]);
      setPageDetail({});
    }
  };

  useEffect(() => {
    fetchApprovedSoftwareActivationData();
  }, [refresh, search, pageNo, pageSize]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  return (
    <>
      <div className="position-relative float-end mb-3">
        <BsSearch className="position-absolute top-50 me-3 end-0 translate-middle-y" />
        <Form.Control
          type="text"
          placeholder="Search..."
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          className="me-2"
          aria-label="Search"
        />
      </div>
      <Table className="text-body bg-new Roles">
        <thead className="text-truncate">
          <tr>
            {[
              "Sr No.",
              "Company Name",
              "User Name",
              "Title",
              "Date & Time",
              "Approved By",
              "Status",
              "Action",
            ].map((thead) => (
              <th key={thead}>{thead}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {approveddata.length > 0 ? null : (
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
          {approveddata.map((approvedData, id1) => (
            <tr key={id1}>
              <td>{id1 + 1}</td>
              <td>{approvedData.name}</td>
              <td>{approvedData.user_name}</td>
              <td>{approvedData.title}</td>
              <td>
                {moment(approvedData.requested_date).format(
                  "DD/MM/YYYY | h:mm:ss a"
                )}
              </td>
              <td>
                {approvedData?.approvedBy?.map((data) => {
                  return data?.name;
                })}
              </td>
              <td className="text-green">Approved</td>
              <td>
                <TooltipComponent title={"View Details"}>
                  <Link
                    to={`/SoftwareActivation/ViewSoftwareDetails/${approvedData.id}`}
                  >
                    <span className="social-btn-re d-align gap-2 px-3 w-auto success-combo">
                      <BsEyeFill />
                    </span>
                  </Link>
                </TooltipComponent>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <ReactPagination
        pageSize={pageSize}
        prevClassName={
          pageNo === 1 ? "danger-combo-disable pe-none" : "red-combo"
        }
        nextClassName={
          approveddata.length < pageSize
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
    </>
  );
};

export default Approved;
