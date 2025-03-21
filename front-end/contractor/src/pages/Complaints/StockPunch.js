import React, { useEffect, useState } from "react";
import { Col, Table } from "react-bootstrap";
import { BsPlus } from "react-icons/bs";
import ReactPagination from "../../components/ReactPagination";
import { getAllStockPunch } from "../../services/contractorApi";
import { Helmet } from "react-helmet";
import CardComponent from "../../components/CardComponent";
import ActionButton from "../../components/ActionButton";
import ImageViewer from "../../components/ImageViewer";
import { useTranslation } from "react-i18next";

const StockPunch = () => {
  const [StockRequest, setStockRequest] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const { t } = useTranslation();

  const fetchStockRequestData = async () => {
    const res = await getAllStockPunch(search, pageSize, pageNo);
    if (res.status) {
      setStockRequest(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setStockRequest([]);
      setPageDetail({});
    }
  };

  useEffect(() => {
    fetchStockRequestData();
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
        <title>All Stock Punch · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent
          search={true}
          searchOnChange={(e) => {
            setSearch(e.target.value);
          }}
          title={"All Stock Punch"}
          icon={<BsPlus />}
          link={`/stock-punch/create-stock-punch/new`}
          tag={"Create"}
        >
          <div className="table-scroll p-2">
            <Table className="text-body bg-new Roles">
              <thead className="text-truncate">
                <tr>
                  {[
                    "Sr No.",
                    "User Name",
                    "Complaint Id",
                    "Punch At",
                    "Action",
                  ].map((thead) => (
                    <th key={thead}>{thead}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {StockRequest.length > 0 ? null : (
                  <tr>
                    <td colSpan={8}>
                      <img
                        className="p-3"
                        alt="no-result"
                        width="250"
                        src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                      />
                    </td>
                  </tr>
                )}
                {StockRequest.map((data, id1) => (
                  <tr key={id1}>
                    <td>{serialNumber[id1]}</td>
                    <td>
                      <ImageViewer
                        src={
                          data?.user_image
                            ? `${process.env.REACT_APP_API_URL}${data?.user_image}`
                            : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                        }
                      >
                        <img
                          width={30}
                          height={30}
                          className="my-bg object-fit p-1 rounded-circle"
                          src={
                            data?.user_image
                              ? `${process.env.REACT_APP_API_URL}${data?.user_image}`
                              : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                          }
                        />
                        {data?.user_name}
                        {data?.employee_id ? `- ${data?.employee_id}` : null}
                      </ImageViewer>
                    </td>
                    <td>{data.complaint_unique_id}</td>
                    <td>{data.punch_at}</td>
                    <td>
                      <ActionButton
                        eyelink={`/stock-punch/create-stock-punch/${data.id}?type=view`}
                        hideDelete={"d-none"}
                        hideEdit={"d-none"}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <ReactPagination
            pageSize={pageSize}
            prevClassName={
              pageNo === 1 ? "danger-combo-disable pe-none" : "red-combo"
            }
            nextClassName={
              pageSize == pageDetail?.total
                ? StockRequest.length - 1 < pageSize
                  ? "danger-combo-disable pe-none"
                  : "success-combo"
                : StockRequest.length < pageSize
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
        </CardComponent>
      </Col>
    </>
  );
};

export default StockPunch;
