import React, { useState, useEffect } from "react";
import { Button, Card, Col, Form, Row, Table } from "react-bootstrap";
import { Helmet } from "react-helmet";
import Select from "react-select";
import CardComponent from "../../components/CardComponent";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import {
  getUserTransactionHistory,
  getUserTransactionMonthly,
  getUserWalletBalance,
} from "../../services/contractorApi";
import { getAllUsers } from "../../services/authapi";
import moment from "moment/moment";
import { BsDashLg, BsPlusLg } from "react-icons/bs";
import { Link } from "react-router-dom";
import ReactPagination from "../../components/ReactPagination";

const FundManagement = () => {
  const [userWalletBalance, setUserWalletBalance] = useState({});
  const [userTransactionMonthly, setUserTransactionMonthly] = useState([]);
  const [userTransactionHistory, setUserTransactionHistory] = useState([]);
  const [allUserData, setAllUserData] = useState([]);
  const [userId, setUserId] = useState("");

  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [collapsedRows, setCollapsedRows] = useState([]);

  const [yearMonth, setYearMonth] = useState(
    moment(new Date()).format("YYYY-MM")
  );
  const finalYearMonth = moment(yearMonth).format("YYYY-MM");

  const fetchUserWalletBalance = async () => {
    const res = await getUserWalletBalance(userId);
    if (res.status) {
      setUserWalletBalance(res.data);
      setIsLoading(true);
    } else {
      setUserWalletBalance({});
      setIsLoading(false);
    }
  };

  const toggleRow = (index) => {
    setCollapsedRows((prev) => {
      const isCollapsed = prev.includes(index);
      if (isCollapsed) {
        return prev.filter((rowIndex) => rowIndex !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const fetchUserTransactionMonthly = async () => {
    const res = await getUserTransactionMonthly(
      userId,
      finalYearMonth,
      search,
      pageSize,
      pageNo
    );
    if (res.status) {
      setUserTransactionMonthly(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setUserTransactionMonthly([]);
      setPageDetail({});
    }
    setIsLoadingHistory(false);
  };

  const fetchUserTransactionHistory = async () => {
    const res = await getUserTransactionHistory(userId);
    if (res.status) {
      setUserTransactionHistory(res.finalData);
    } else {
      setUserTransactionHistory([]);
    }
  };

  const fetchAllUsersData = async () => {
    const res = await getAllUsers();
    if (res.status) {
      setAllUserData(res.data);
    } else {
      setAllUserData([]);
    }
  };

  const formatOptionLabel = ({ label, image }) => (
    <div>
      <img src={image} className="avatar me-2" />
      {label}
    </div>
  );

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  useEffect(() => {
    if (userId) {
      fetchUserWalletBalance();
      fetchUserTransactionMonthly();
      fetchUserTransactionHistory();
    }
    fetchAllUsersData();
  }, [userId, yearMonth, search, pageNo, pageSize]);

  const serialNumber = Array.from(
    { length: pageDetail?.pageEndResult - pageDetail?.pageStartResult + 1 },
    (_, index) => pageDetail?.pageStartResult + index
  );

  return (
    <>
      <Helmet>
        <title>Fund Management · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CardComponent
          custom={
            <Select
              menuPortalTarget={document.body}
              name={`user_id`}
              placeholder="-- select User --"
              className="w-100"
              options={allUserData?.map((user) => ({
                label: user.name,
                value: user.id,
                image: user.image
                  ? `${process.env.REACT_APP_API_URL}${user.image}`
                  : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`,
              }))}
              onChange={(e) => {
                setUserId(e?.value);
              }}
              formatOptionLabel={formatOptionLabel}
            />
          }
          custom2={
            <Form.Control
              style={{ width: "300px" }}
              onChange={(e) => setYearMonth(e.target.value)}
              value={yearMonth}
              type="month"
            />
          }
          title={"Fund Management"}
        >
          <Row className="g-4 ">
            <Col md={3}>
              <div className="d-grid gap-4">
                <Card className="card-bg text-white">
                  <Card.Img
                    // src={`${process.env.REACT_APP_API_URL}/assets/images/wallet-img.jpg`}
                    src={`../assets/images/wallet-img.jpg`}
                    alt=""
                  />
                  <Card.ImgOverlay>
                    <Card.Text className="small mb-1">Wallet Balance</Card.Text>
                    <h2>
                      ₹{" "}
                      {userWalletBalance?.balance
                        ? userWalletBalance?.balance
                        : "XXX"}
                    </h2>
                    <Card.Text className="position-absolute bottom-0 start-0 small w-100 p-3 d-align justify-content-between">
                      {userWalletBalance?.user_name
                        ? userWalletBalance?.user_name
                        : "..."}{" "}
                      <img
                        width={30}
                        src={`../assets/images/wallet-icon.png`}
                        alt=""
                      />
                    </Card.Text>
                  </Card.ImgOverlay>
                </Card>
                <Button
                  as={Link}
                  to={`/FundManagement/add-funds`}
                  variant="success"
                  className={``}
                >
                  <BsPlusLg /> Add Funds
                </Button>
              </div>
            </Col>
            <Col md={9}>
              <CardComponent
                search={true}
                searchOnChange={(e) => {
                  setSearch(e.target.value);
                }}
                title={"Transactions History"}
                classbody={"px-1 py-0"}
              >
                <SimpleBar className="area">
                  <div className="overflow-auto p-3">
                    <Table bordered className="text-body bg-new Roles">
                      <thead className="text-truncate">
                        <tr>
                          {[
                            "Sr No.",
                            "Cash",
                            "Date & Time",
                            "Amount",
                            "Balance",
                            "Status",
                            "Remark",
                          ].map((thead) => (
                            <th className="p-2" key={thead}>
                              {thead}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {isLoadingHistory ? (
                          <tr className="text-center">
                            <td colSpan={8}>
                              <img
                                className="p-3"
                                width="150"
                                src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
                                alt="Loading"
                              />
                            </td>
                          </tr>
                        ) : userTransactionMonthly?.length > 0 ? (
                          <>
                            {userTransactionMonthly?.map((data, index) => (
                              <>
                                <tr key={index}>
                                  <td>{serialNumber[index]}</td>
                                  <td
                                    className={`text-${
                                      data?.transaction_type === "credit"
                                        ? "green"
                                        : "danger"
                                    }`}
                                  >
                                    {data?.transaction_type}
                                  </td>
                                  <td>
                                    {data?.transaction_date} |{" "}
                                    {data?.transaction_time}
                                  </td>
                                  <td
                                    className={`text-${
                                      data?.transaction_type === "credit"
                                        ? "green"
                                        : "danger"
                                    }`}
                                  >
                                    {data?.transaction_type === "credit"
                                      ? "+"
                                      : "-"}{" "}
                                    ₹{data?.amount}
                                  </td>
                                  <td className="text-green">
                                    ₹{data?.balance}
                                  </td>
                                  <td className="text-green">{data?.status}</td>
                                  <td className="text-center">
                                    <span
                                      className={`cursor-pointer text-${
                                        collapsedRows.includes(index)
                                          ? "danger"
                                          : "green"
                                      }`}
                                      onClick={() => toggleRow(index)}
                                    >
                                      {collapsedRows.includes(index) ? (
                                        <BsDashLg fontSize={"large"} />
                                      ) : (
                                        <BsPlusLg fontSize={"large"} />
                                      )}
                                    </span>
                                  </td>
                                </tr>
                                {collapsedRows.includes(index) && (
                                  <tr>
                                    <td className="text-start" colSpan="8">
                                      {data.description}
                                    </td>
                                  </tr>
                                )}
                              </>
                            ))}
                          </>
                        ) : (
                          <tr className="text-center">
                            <td colSpan={8}>
                              <img
                                className="p-3"
                                alt="no-result"
                                width="150"
                                src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                              />
                            </td>
                          </tr>
                        )}
                      </tbody>
                      <tfoot>
                        <tr>
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
                                  ? userTransactionMonthly.length - 1 < pageSize
                                    ? "danger-combo-disable pe-none"
                                    : "success-combo"
                                  : userTransactionMonthly.length < pageSize
                                  ? "danger-combo-disable pe-none"
                                  : "success-combo"
                              }
                              title={`Showing ${
                                pageDetail?.pageStartResult || 0
                              } to ${pageDetail?.pageEndResult || 0} of ${
                                pageDetail?.total || 0
                              }`}
                              handlePageSizeChange={handlePageSizeChange}
                              prevonClick={() => setPageNo(pageNo - 1)}
                              nextonClick={() => setPageNo(pageNo + 1)}
                            />
                          </td>
                        </tr>
                      </tfoot>
                    </Table>
                  </div>
                </SimpleBar>
              </CardComponent>
            </Col>
            {/* <Col md={9}>
              <SimpleBar className="area">
                <div className="d-flex card-bg overflow-auto px-2">
                  <Table bordered className="text-body">
                    <thead className="text-truncate">
                      <tr>
                        <th
                          colSpan={4}
                          className="border-bottom border-0 border-dark text-center"
                        >
                          Assets
                        </th>
                      </tr>
                      <tr>
                        {["Sr No.", "Cash", "Equipment", "Supplies"].map(
                          (thead) => (
                            <td className="p-2" key={thead}>
                              {thead}
                            </td>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from(Array(16)).map((_, index) => (
                        <tr key={index}>
                          <td className="p-2">{index}.</td>
                          <th className="p-2">
                            <div className="text-truncate">₹ 50,000.25</div>
                          </th>
                          <th className="p-2">
                            <div className="text-truncate">₹ 2,000.00</div>
                          </th>
                          <th className="p-2">
                            <div className="text-truncate">₹ 10,000.00</div>
                          </th>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <Table bordered className="text-body">
                    <thead className="text-truncate">
                      <tr>
                        <th
                          colSpan={4}
                          className="border-bottom border-start border-end border-0 border-dark text-center"
                        >
                          Liabilities
                        </th>
                      </tr>
                      <tr>
                        <td className="p-2 border-start border-end border-0 border-dark">
                          Accounts Payable
                        </td>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from(Array(16)).map((_, index) => (
                        <tr key={index}>
                          <th className="p-2 border-start border-end border-0 border-dark">
                            <div className="d-grid">
                              <div className="text-truncate">
                                Lorem Ipsum is simply dummy text Lorem
                              </div>
                            </div>
                          </th>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <Table bordered className="text-body">
                    <thead className="text-truncate">
                      <tr>
                        <th
                          colSpan={4}
                          className="border-bottom border-0 border-dark text-center"
                        >
                          Company Funds
                        </th>
                      </tr>
                      <tr>
                        {["Date", "Total Cash", "Expenses"].map((thead) => (
                          <td className="p-2" key={thead}>
                            {thead}
                          </td>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from(Array(16)).map((_, index) => (
                        <tr key={index}>
                          <th className="p-2">0{index}/01/2023</th>
                          <th className="p-2">
                            <div className="text-truncate">₹ 50,000.00</div>
                          </th>
                          <th className="p-2">
                            <div className="text-truncate">₹ 12,000.00</div>
                          </th>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </SimpleBar>
            </Col> */}
            {/* <Col md={6}>
              <CardComponent
                classbody={"px-1 py-0"}
                title={"Fund Transactions Tracked"}
              >
                <SimpleBar className="area">
                  <div className="p-3">
                    {[
                      "danger",
                      "info",
                      "warning",
                      "success",
                      "secondary",
                      "primary",
                      "light",
                    ].map((timeline) => (
                      <div key={timeline} className="hstack gap-4">
                        <div className="vr hr-shadow d-align align-items-baseline">
                          <span
                            className={`bg-${timeline} zIndex rounded-circle btn-play d-flex`}
                            style={{ padding: "7px" }}
                          />
                        </div>
                        <div className="small">
                          <p className="mb-1">
                            Lorem Ipsum is simply dummy text of the printing and
                            typesetting industry.
                          </p>
                          <p>10:15 AM | 07/12/2022</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </SimpleBar>
              </CardComponent>
            </Col> */}
            {/* <Col md={6}>
              <CardComponent
                title={"Transactions History"}
                classbody={"px-1 py-0"}
              >
                <SimpleBar className="area">
                  <div className="overflow-auto">
                    <Table bordered className="text-body">
                      <thead className="text-truncate">
                        <tr>
                          {[
                            "Sr No.",
                            "Cash",
                            "Date & Time",
                            "Balance",
                            "Status",
                          ].map((thead) => (
                            <td className="p-2" key={thead}>
                              {thead}
                            </td>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {isLoadingHistory ? (
                          <tr className="text-center">
                            <td colSpan={8}>
                              <img
                                className="p-3"
                                width="250"
                                src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
                                alt="Loading"
                              />
                            </td>
                          </tr>
                        ) : userTransactionHistory?.length > 0 ? (
                          <>
                            {userTransactionHistory?.map((data, index) => (
                              <tr key={index}>
                                <td>{index + 1}.</td>
                                <td
                                  className={`text-${
                                    data?.transaction_type === "credit"
                                      ? "green"
                                      : "danger"
                                  }`}
                                >
                                  {data?.transaction_type}
                                </td>
                                <td>
                                  {data?.transaction_date} |{" "}
                                  {data?.transaction_time}
                                </td>
                                <td
                                  className={`text-${
                                    data?.transaction_type === "credit"
                                      ? "green"
                                      : "danger"
                                  }`}
                                >
                                  {data?.transaction_type === "credit"
                                    ? "+"
                                    : "-"}{" "}
                                  ₹{data?.amount}
                                </td>
                                <td className="text-green">{data?.status}</td>
                              </tr>
                            ))}
                          </>
                        ) : (
                          <tr className="text-center">
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
                      </tbody>
                    </Table>
                  </div>
                </SimpleBar>
              </CardComponent>
            </Col> */}
          </Row>
        </CardComponent>
      </Col>
    </>
  );
};

export default FundManagement;
