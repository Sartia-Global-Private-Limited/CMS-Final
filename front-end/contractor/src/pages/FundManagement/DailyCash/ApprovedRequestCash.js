import React, { useEffect, useState } from "react";
import { Table, Form } from "react-bootstrap";
import { BsSearch } from "react-icons/bs";
import ReactPagination from "../../../components/ReactPagination";
import { getAllApprovedCashRequest } from "../../../services/contractorApi";
import { Helmet } from "react-helmet";
import ImageViewer from "../../../components/ImageViewer";
import ActionButton from "../../../components/ActionButton";

const ApprovedRequestCash = () => {
  const [approvedRequestCash, setApprovedRequestCash] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [isLoading, setIsLoading] = useState(true);

  const fetchApprovedData = async () => {
    const res = await getAllApprovedCashRequest(search, pageSize, pageNo);
    if (res.status) {
      setApprovedRequestCash(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setApprovedRequestCash([]);
      setPageDetail({});
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchApprovedData();
  }, [search, pageNo, pageSize]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  const serialNumber = Array.from(
    { length: pageDetail?.pageEndResult - pageDetail?.pageStartResult + 1 },
    (_, index) => pageDetail?.pageStartResult + index
  );

  return (
    <>
      <Helmet>
        <title>Security Deposit · CMS Electricals</title>
      </Helmet>
      <span className="d-align mt-3 me-3 justify-content-end gap-2">
        <span className="position-relative">
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
        </span>
      </span>
      <div className="overflow-auto p-3">
        <Table className="text-body bg-new Roles">
          <thead className="text-truncate">
            <tr>
              {[
                "Sr No.",
                "User Name",
                "Request id",
                "Request Data",
                "Request Amount",
                "Request Status",
                "Action",
              ].map((thead) => (
                <th key={thead}>{thead}</th>
              ))}
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
            ) : approvedRequestCash.length > 0 ? (
              <>
                {approvedRequestCash?.map((itm, idx) => (
                  <tr key={idx}>
                    <td>{serialNumber[idx]}</td>
                    <td>
                      <ImageViewer
                        src={
                          itm?.user_image
                            ? `${process.env.REACT_APP_API_URL}${itm?.user_image}`
                            : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                        }
                      >
                        <img
                          width={30}
                          height={30}
                          className="my-bg object-fit p-1 rounded-circle"
                          src={
                            itm?.user_image
                              ? `${process.env.REACT_APP_API_URL}${itm?.user_image}`
                              : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                          }
                        />{" "}
                        {itm?.user_name}
                      </ImageViewer>
                    </td>
                    <td>{itm?.request_unique_id}</td>
                    <td>{itm?.request_date}</td>
                    <td className="text-green">₹ {itm?.request_amount}</td>
                    <td className="text-green">Approved</td>
                    <td>
                      <ActionButton
                        hideDelete={"d-none"}
                        hideEdit={"d-none"}
                        eyelink={`/RequestCash/create-request-cash/${itm.id}?type=view`}
                      />
                    </td>
                  </tr>
                ))}
              </>
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
        </Table>
        <ReactPagination
          pageSize={pageSize}
          prevClassName={
            pageNo === 1 ? "danger-combo-disable pe-none" : "red-combo"
          }
          nextClassName={
            pageSize == pageDetail?.total
              ? approvedRequestCash.length - 1 < pageSize
                ? "danger-combo-disable pe-none"
                : "success-combo"
              : approvedRequestCash.length < pageSize
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
      </div>
    </>
  );
};

export default ApprovedRequestCash;
