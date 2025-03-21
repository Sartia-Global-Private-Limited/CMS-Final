import React, { useEffect, useState } from "react";
import { Table, Form } from "react-bootstrap";
import { BsSearch } from "react-icons/bs";
import ReactPagination from "../../../components/ReactPagination";
import { getAllRejectedSiteItemsGoods } from "../../../services/contractorApi";
import { Helmet } from "react-helmet";
import ImageViewer from "../../../components/ImageViewer";
import ActionButton from "../../../components/ActionButton";

const RejectedRequestItems = () => {
  const [rejectedRequestItems, setRejectedRequestItems] = useState([]);
  const [checkUserRoleType, setCheckUserRoleType] = useState(false);
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRejectedData = async () => {
    const res = await getAllRejectedSiteItemsGoods(search, pageSize, pageNo);
    if (res.status) {
      setRejectedRequestItems(res?.data);
      setCheckUserRoleType(res.checkUserRoleTypeForRequestByDetails);
      setPageDetail(res.pageDetails);
    } else {
      setRejectedRequestItems([]);
      setCheckUserRoleType(false);
      setPageDetail({});
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchRejectedData();
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
        <title>Rejected Request Items · CMS Electricals</title>
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
              <th>Sr No.</th>
              <th>item name</th>
              {checkUserRoleType ? <th>Requested By</th> : null}
              <th>Request Date</th>
              <th>Rejected By</th>
              <th>Rejected Date</th>
              <th>Status</th>
              <th>Action</th>
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
            ) : rejectedRequestItems?.length > 0 ? (
              <>
                {rejectedRequestItems?.map((itm, idx) => (
                  <tr key={idx}>
                    <td>{serialNumber[idx]}</td>
                    <td>
                      <ImageViewer
                        src={
                          itm?.item_image
                            ? `${process.env.REACT_APP_API_URL}${itm?.item_image}`
                            : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                        }
                      >
                        <span className="d-flex align-items-center gap-2">
                          <img
                            width={30}
                            height={30}
                            className="my-bg object-fit p-1 rounded-circle"
                            src={
                              itm?.item_image
                                ? `${process.env.REACT_APP_API_URL}${itm?.item_image}`
                                : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                            }
                          />{" "}
                          <span className="d-grid">{itm?.item_name} </span>
                        </span>
                      </ImageViewer>
                    </td>
                    {checkUserRoleType ? (
                      <td>
                        <ImageViewer
                          src={
                            itm?.requested_by_image
                              ? `${process.env.REACT_APP_API_URL}${itm?.requested_by_image}`
                              : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                          }
                        >
                          <span className="d-flex align-items-center gap-2">
                            <img
                              width={30}
                              height={30}
                              className="my-bg object-fit p-1 rounded-circle"
                              src={
                                itm?.requested_by_image
                                  ? `${process.env.REACT_APP_API_URL}${itm?.requested_by_image}`
                                  : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                              }
                            />{" "}
                            <span className="d-grid">
                              {itm?.requested_by}{" "}
                              <span>
                                {itm?.requested_by_employee_id
                                  ? itm?.requested_by_employee_id
                                  : null}
                              </span>
                            </span>
                          </span>
                        </ImageViewer>
                      </td>
                    ) : null}
                    <td>{itm.date}</td>
                    <td>
                      <ImageViewer
                        src={
                          itm?.approved_by_image
                            ? `${process.env.REACT_APP_API_URL}${itm?.approved_by_image}`
                            : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                        }
                      >
                        <span className="d-flex align-items-center gap-2">
                          <img
                            width={30}
                            height={30}
                            className="my-bg object-fit p-1 rounded-circle"
                            src={
                              itm?.approved_by_image
                                ? `${process.env.REACT_APP_API_URL}${itm?.approved_by_image}`
                                : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                            }
                          />{" "}
                          <span className="d-grid">
                            {itm?.approved_by_name}{" "}
                            <span>
                              {itm?.approved_by_employee_id
                                ? itm?.approved_by_employee_id
                                : null}
                            </span>
                          </span>
                        </span>
                      </ImageViewer>
                    </td>
                    <td>{itm.approved_at}</td>
                    <td className="text-danger">Rejected</td>
                    <td>
                      <ActionButton
                        hideDelete={"d-none"}
                        hideEdit={"d-none"}
                        eyelink={`/RequestItems/create-request-items/${itm.id}?type=view`}
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
              ? rejectedRequestItems.length - 1 < pageSize
                ? "danger-combo-disable pe-none"
                : "success-combo"
              : rejectedRequestItems.length < pageSize
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

export default RejectedRequestItems;
