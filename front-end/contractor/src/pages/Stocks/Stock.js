import React, { useEffect } from "react";
import { useState } from "react";
import { Badge, Col, Table } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { getAllStocks } from "../../services/contractorApi";
import ImageViewer from "../../components/ImageViewer";
import ActionButton from "../../components/ActionButton";
import CardComponent from "../../components/CardComponent";
import ReactPagination from "../../components/ReactPagination";
import { BsPlus } from "react-icons/bs";

const Stock = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stockData, setStockData] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const fetchStocks = async () => {
    const res = await getAllStocks(search, pageSize, pageNo);
    if (res.status) {
      setStockData(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setStockData([]);
      setPageDetail({});
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchStocks();
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
        <title>Stocks · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CardComponent
          title={"All - Stocks"}
          search={true}
          icon={<BsPlus />}
          link={`/Stock/stock-transfer/new`}
          tag={"Stock Transfer"}
          searchOnChange={(e) => {
            setSearch(e.target.value);
          }}
        >
          <div className="table-scroll p-2">
            <Table className="text-body bg-new Roles">
              <thead className="text-truncate">
                <tr>
                  {[
                    "Sr no.",
                    "Item",
                    "Item Unit",
                    "Item Qty",
                    "Item Rate",
                    "Action",
                  ].map((thead) => (
                    <th key={thead}>{thead}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <td colSpan={6}>
                    <img
                      className="p-3"
                      width="250"
                      src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
                      alt="Loading"
                    />
                  </td>
                ) : stockData.length > 0 ? (
                  <>
                    {stockData?.map((itm, idx) => (
                      <tr key={idx}>
                        <td>{serialNumber[idx]}</td>
                        <td>
                          <ImageViewer
                            src={
                              itm.image
                                ? `${process.env.REACT_APP_API_URL}${itm.image}`
                                : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                            }
                          >
                            <img
                              width={50}
                              height={50}
                              className="my-bg object-fit p-1 rounded"
                              src={
                                itm.image
                                  ? `${process.env.REACT_APP_API_URL}${itm.image}`
                                  : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                              }
                            />{" "}
                            {itm?.name}
                            {itm.stockAlertStatus == false && (
                              <>
                                {" "}
                                <Badge pill bg="warning" text="dark">
                                  Low Qty
                                </Badge>
                              </>
                            )}
                          </ImageViewer>
                        </td>
                        <td>{itm?.unit_name}</td>
                        <td>{itm?.qty}</td>
                        <td>{itm?.rate}</td>
                        <td>
                          <ActionButton
                            eyelink={`/Stock/view-stock/${itm.item_id}`}
                            hideDelete={"d-none"}
                            hideEdit={"d-none"}
                          />
                        </td>
                      </tr>
                    ))}
                  </>
                ) : (
                  <td colSpan={6}>
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
                  ? stockData.length - 1 < pageSize
                    ? "danger-combo-disable pe-none"
                    : "success-combo"
                  : stockData.length < pageSize
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
        </CardComponent>
      </Col>
    </>
  );
};

export default Stock;
