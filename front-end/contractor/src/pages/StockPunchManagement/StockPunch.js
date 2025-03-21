import React, { useEffect, useMemo, useState } from "react";
import { Col } from "react-bootstrap";
import { getStockPunchDetails } from "../../services/contractorApi";
import { Helmet } from "react-helmet";
import Tabs, { Tab } from "react-best-tabs";
import "react-best-tabs/dist/index.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import ImageViewer from "../../components/ImageViewer";
import CheckAndAppove from "./CheckAndAppove";
import { useDebounce } from "../../hooks/UseDebounce";
import { useTranslation } from "react-i18next";
import { selectUser } from "../../features/auth/authSlice";
import { useSelector } from "react-redux";
import { createColumnHelper } from "@tanstack/react-table";
import ActionButtons from "../../components/DataTable/ActionButtons";
import { UserPlus } from "lucide-react";
import CustomTable from "../../components/DataTable/CustomTable";
import TableHeader from "../../components/DataTable/TableHeader";
import { UserDetail } from "../../components/ItemDetail";
import { serialNumber } from "../../utils/helper";

const StockPunch = ({ checkPermission }) => {
  const columnHelper = createColumnHelper();
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const { userPermission } = useSelector(selectUser);
  const { user } = useSelector(selectUser);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("last_tab") || "2"
  );
  const { t } = useTranslation();

  const fetchPunchRequestData = async () => {
    const res = await getStockPunchDetails(search, pageSize, pageNo);
    setIsLoading(true);
    if (res.status) {
      setRows(res.data);
      setTotalData(res?.pageDetails?.total);
    } else {
      setRows([]);
      setTotalData(0);
    }
    setIsLoading(false);
  };

  // set Delay time to get data on search
  const debounceValue = useDebounce(search, 500);
  useEffect(() => {
    fetchPunchRequestData();
  }, [search, pageNo, pageSize]);

  const handleClick = (e, tab) => {
    setActiveTab(tab);

    if (searchParams.has("pageNo")) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("pageNo");
      navigate(`?${newParams.toString()}`, { replace: true });
    }
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("sr_no", {
        header: t("Sr No."),
        cell: (info) => {
          const serialNumbers = serialNumber(pageNo, pageSize);
          return serialNumbers[info.row.index];
        },
      }),
      columnHelper.accessor("employee_id", {
        header: "employee id",
      }),
      columnHelper.accessor("user_name", {
        header: "user name",
        cell: (info) => (
          <UserDetail
            img={info.row.original?.user_image}
            name={info.row.original?.user_name}
            id={info.row.original?.user_id}
            unique_id={info.row.original?.employee_id}
            login_id={user.id}
          />
        ),
      }),
      columnHelper.accessor("item_name", {
        header: "item name",
        cell: (info) => (
          <div>
            <ImageViewer
              src={
                info.row.original?.item_images
                  ? `${process.env.REACT_APP_API_URL}${info.row.original?.item_images}`
                  : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
              }
            >
              <span className="d-flex align-items-center gap-2">
                <img
                  width={30}
                  height={30}
                  className="my-bg object-fit p-1 rounded-circle"
                  src={
                    info.row.original?.item_images
                      ? `${process.env.REACT_APP_API_URL}${info.row.original?.item_images}`
                      : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                  }
                />
                <span className="d-grid">
                  {info.row.original?.item_name || "-"}
                </span>
              </span>
            </ImageViewer>
          </div>
        ),
      }),
      columnHelper.accessor("brand_name", {
        header: "brand name",
      }),
      columnHelper.accessor("complaint_unique_id", {
        header: "compliant number",
      }),
      columnHelper.accessor("regional_office_name", {
        header: "Regional office",
        cell: (info) => info.row.original.ro_detail?.regional_office_name,
      }),
      columnHelper.accessor("user_name", {
        header: "sales area manager",
        cell: (info) => info.row.original.area_manager_detail?.user_name,
      }),
      columnHelper.accessor("outlet_name", {
        header: "outlet name",
        cell: (info) => info.row.original.outlet_detail?.outlet_name,
      }),
      columnHelper.accessor("punch_at", {
        header: "punch at",
      }),
      columnHelper.accessor("action", {
        header: "Action",
        cell: (info) => (
          <ActionButtons
            actions={{
              view: {
                show: checkPermission?.view,
                action: () =>
                  navigate(
                    `/stock-punch/create-stock-punch/${info.row.original.id}?type=view`,
                    {
                      state: {
                        Complain_id: info.row.original.complaint_id,
                        userId: info.row.original.user_id,
                      },
                    }
                  ),
              },
              approve: {
                show: checkPermission?.update,
                action: () =>
                  navigate(
                    `/approve-stock-punch-request/${info.row.original.id}`,
                    {
                      state: {
                        Complain_id: info.row.original.complaint_id,
                        userId: info.row.original.user_id,
                      },
                    }
                  ),
              },
            }}
          />
        ),
      }),
    ],
    [checkPermission, rows.length, pageNo, pageSize]
  );

  return (
    <>
      <Helmet>
        <title>Stock Punch · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <Tabs
          onClick={(e, tab) => handleClick(e, tab)}
          activeTab={activeTab}
          ulClassName="border-primary p-2 border-bottom"
          activityClassName="bg-secondary"
        >
          <Tab className="pe-none fs-15 fw-bold" />
          <Tab className="ms-auto" title={t("Pending Request")}>
            {activeTab == "2" && (
              <>
                <CustomTable
                  id={"stock_request"}
                  isLoading={isLoading}
                  rows={rows || []}
                  columns={columns}
                  pagination={{
                    pageNo,
                    pageSize,
                    totalData,
                  }}
                  customHeaderComponent={() => (
                    <TableHeader
                      userPermission={checkPermission}
                      setSearchText={setSearch}
                      button={{
                        noDrop: true,
                        to: `/stock-punch/create-stock-punch/new`,
                        title: "Create",
                      }}
                    />
                  )}
                  tableTitleComponent={
                    <div>
                      <UserPlus /> <strong>stock punch</strong>
                    </div>
                  }
                />
              </>
            )}
          </Tab>

          <Tab title={t("Check and Approve")}>
            {activeTab == "3" && (
              <CheckAndAppove checkPermission={checkPermission} />
            )}
          </Tab>
        </Tabs>
      </Col>
    </>
  );
};

export default StockPunch;

{
  /* <span className="d-align mt-3 me-3 justify-content-end gap-2">
  <span className="position-relative">
    <BsSearch className="position-absolute top-50 me-3 end-0 translate-middle-y" />
    <Form.Control
      type="text"
      placeholder={t("Search")}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="me-2"
      aria-label="Search"
    />
  </span>

  <span className="position-relative">
    <Button
      className="text-none view-btn shadow rounded-0 px-1 text-orange"
      as={Link}
      to={`/stock-punch/create-stock-punch/new`}
    >
      <BsPlus />
      {t("Create")}
    </Button>
  </span>
</span>
<div className="p-3">
  <div className="table-scroll">
    <Table className="text-body bg-new Roles">
      <thead className="text-truncate">
        <tr>
          <th>{t("Employee Id")}</th>
          <th>{t("User Name")}</th>
          <th>{t("Item Name")}</th>
          <th>{t("Brand Name")}</th>
          <th>{t("complaint number")}</th>
          <th>{t("Regional Office")}</th>
          <th>{t("sales area manager")}</th>
          <th>{t("Outlet Name")}</th>
          <th>{t("Punch At")}</th>
          <th>{t("Action")}</th>
        </tr>
      </thead>
      <tbody>
        {stockRequest.length > 0 ? null : (
          <tr>
            <td colSpan={10}>
              <img
                className="p-3"
                alt="no-result"
                width="250"
                src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
              />
            </td>
          </tr>
        )}
        {stockRequest.map((data, id1) => (
          <tr key={id1}>
            <td>{data.employee_id || "--"}</td>

            <td>
              <UserDetail
                img={data?.user_image}
                name={data?.user_name}
                id={data?.user_id}
                unique_id={data?.employee_id}
                login_id={user.id}
              />
            </td>
            <td>
              <ImageViewer
                src={
                  data?.item_images
                    ? `${process.env.REACT_APP_API_URL}${data?.item_images}`
                    : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                }
              >
                <span className="d-flex align-items-center gap-2">
                  <img
                    width={30}
                    height={30}
                    className="my-bg object-fit p-1 rounded-circle"
                    src={
                      data?.item_images
                        ? `${process.env.REACT_APP_API_URL}${data?.item_images}`
                        : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                    }
                  />{" "}
                  <span className="d-grid">
                    {data?.item_name || "-"}{" "}
                  </span>
                </span>
              </ImageViewer>
            </td>
            <td>{data?.brand_name}</td>

            <td>{data?.complaint_unique_id || "-"}</td>
            <td>
              {data?.ro_detail?.regional_office_name || "-"}
            </td>
            <td>
              {data?.area_manager_detail?.user_name || "-"}
            </td>
            <td>
              {data?.outlet_detail?.outlet_name ?? "--"}
            </td>
            <td>{data.punch_at}</td>

            <td>
              <ActionButton
                hideDelete={"d-none"}
                hideEdit={"d-none"}
                approveMargin={false}
                approveAlign={"left"}
                approveOnclick={() =>
                  navigate(
                    `/approve-stock-punch-request/${data.id}`,
                    {
                      state: {
                        Complain_id: data.complaint_id,
                        userId: data.user_id,
                      },
                    }
                  )
                }
                eyeOnclick={() =>
                  navigate(
                    `/stock-punch/create-stock-punch/${data.id}?type=view`,
                    {
                      state: {
                        Complain_id: data.complaint_id,
                        userId: data.user_id,
                      },
                    }
                  )
                }
              />
            </td>
          </tr>
        ))}
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
                ? stockRequest.length - 1 < pageSize
                  ? "danger-combo-disable pe-none"
                  : "success-combo"
                : stockRequest.length < pageSize
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
      </tfoot>
    </Table>
  </div>
</div> */
}
