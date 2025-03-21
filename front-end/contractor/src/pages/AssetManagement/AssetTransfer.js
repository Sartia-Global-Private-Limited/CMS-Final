import React, { useEffect, useState } from "react";
import { Col, Table } from "react-bootstrap";
import CardComponent from "../../components/CardComponent";
import { getAllAssignedAssetsToUser } from "../../services/contractorApi";
import ReactPagination from "../../components/ReactPagination";
import { Helmet } from "react-helmet";
import ActionButton from "../../components/ActionButton";

const AssetTransfer = () => {
  const [requestData, setRequestData] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllAssignedAssetData = async () => {
    const res = await getAllAssignedAssetsToUser({ search, pageSize, pageNo });
    if (res.status) {
      setRequestData(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setRequestData([]);
      setPageDetail({});
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAllAssignedAssetData();
  }, [search, pageNo, pageSize]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  const serialNumber = Array.from(
    { length: pageDetail?.pageEndResult - pageDetail?.pageStartResult + 1 },
    (_, index) => pageDetail?.pageStartResult + index
  );

  return (
    <Col md={12} data-aos={"fade-up"}>
      <Helmet>
        <title>All Asset Transfers · CMS Electricals</title>
      </Helmet>
      <CardComponent
        title={"All Asset Transfers"}
        search={true}
        searchOnChange={(e) => {
          setSearch(e.target.value);
        }}
      >
        <div className="table-scroll mb-3">
          <Table className=" Roles">
            <thead className="text-truncate">
              <tr>
                {[
                  "Sr No.",
                  "Asset Name",
                  "Asset Model No",
                  "uin No",
                  "Price",
                  "Purchase Date",
                  "assign Status",
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
              ) : requestData.length > 0 ? (
                <>
                  {requestData?.map((data, idx) => (
                    <tr key={idx}>
                      <td>{serialNumber[idx]}</td>
                      <td>{data.asset_name}</td>
                      <td>{data.asset_model_number}</td>
                      <td>{data.asset_uin_number}</td>
                      <td>{data.asset_price}</td>
                      <td>{data.asset_purchase_date}</td>
                      <td className={`text-green`}>Assigned</td>
                      <td>
                        <ActionButton
                          eyelink={`/AssignedAssets/timeline-assigned-assets/${data.id}`}
                          hideDelete={"d-none"}
                          editlink={`/AllAssets/CreateAssets/${data?.id}`}
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
        </div>
        <ReactPagination
          pageSize={pageSize}
          prevClassName={
            pageNo === 1 ? "danger-combo-disable pe-none" : "red-combo"
          }
          nextClassName={
            pageSize == pageDetail?.total
              ? requestData.length - 1 < pageSize
                ? "danger-combo-disable pe-none"
                : "success-combo"
              : requestData.length < pageSize
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
  );
};

export default AssetTransfer;
