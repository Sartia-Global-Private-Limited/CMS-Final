import React, { useEffect, useMemo, useState } from "react";
import { Badge, Col, Form, Row, Table } from "react-bootstrap";
import {
  getApprovedStockRequest,
  postStockReject,
} from "../../services/contractorApi";
import ImageViewer from "../../components/ImageViewer";
import { Formik } from "formik";
import { addRemarkSchema } from "../../utils/formSchema";
import ConfirmAlert from "../../components/ConfirmAlert";
import TextareaAutosize from "react-textarea-autosize";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { UserDetail } from "../../components/ItemDetail";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate, useSearchParams } from "react-router-dom";
import ActionButtons from "../../components/DataTable/ActionButtons";
import { UserPlus } from "lucide-react";
import TableHeader from "../../components/DataTable/TableHeader";
import CustomTable from "../../components/DataTable/CustomTable";
import { serialNumber } from "../../utils/helper";

const ApprovedStockRequest = ({ checkPermission }) => {
  const columnHelper = createColumnHelper();
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const { userPermission } = useSelector(selectUser);
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [storeId, setStoreId] = useState({});
  const { user } = useSelector(selectUser);
  const { t } = useTranslation();

  const fetchStockApprovedData = async () => {
    const res = await getApprovedStockRequest(search, pageSize, pageNo);
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

  const handleUpdate = (data) => {
    setStoreId(data);
    setShowAlert(true);
  };

  const handleRejected = async (values) => {
    const sData = {
      id: storeId.id,
      status: "2",
      rejected_remarks: values.remark,
    };

    const res = await postStockReject(sData);
    if (res.status) {
      toast.success(res.message);
      fetchStockApprovedData();
      setShowAlert(false);
    } else {
      toast.error(res.message);
    }
  };

  useEffect(() => {
    fetchStockApprovedData();
  }, [search, pageNo, pageSize]);

  console.log("checkPermission?.update", checkPermission);

  const columns = useMemo(
    () => [
      columnHelper.accessor("sr_no", {
        header: t("Sr No."),
        cell: (info) => {
          const serialNumbers = serialNumber(pageNo, pageSize);
          return serialNumbers[info.row.index];
        },
      }),
      columnHelper.accessor("unique_id", {
        header: "Unique ID",
      }),
      columnHelper.accessor("request_for", {
        header: "Request For",
        cell: (info) => (
          <UserDetail
            img={info.row.original?.request_for_image}
            name={info.row.original?.request_for}
            login_id={user?.id}
            id={info.row.original?.request_for_id}
            unique_id={info.row.original?.request_for_employee_id}
          />
        ),
      }),
      columnHelper.accessor("status", {
        header: "status",
        cell: (info) => (
          <div
            className={`text-${
              info.row.original?.status === "1" ? "green" : "orange"
            }`}
          >
            {info.row.original?.status === "1" ? "Approved" : "Pending"}
          </div>
        ),
      }),
      columnHelper.accessor("request_date", {
        header: "request date",
      }),
      columnHelper.accessor("total_request_qty", {
        header: "request qty",
        cell: (info) => (
          <div
            className={`fw-bolder text-${
              info.row.original.total_request_qty > 0 ? "green" : "danger"
            }`}
          >
            {info.row.original.total_request_qty > 0
              ? info.row.original.total_request_qty
              : "0"}
          </div>
        ),
      }),
      columnHelper.accessor("supplier_name", {
        header: "supplier name",
      }),
      columnHelper.accessor("approved_by_name", {
        header: "approved by",
        cell: (info) => (
          <UserDetail
            img={info.row.original?.approved_image}
            name={info.row.original?.approved_by_name}
            login_id={user?.id}
            id={info.row.original?.approved_by_id}
            unique_id={info.row.original?.approved_by_employee_id}
          />
        ),
      }),
      columnHelper.accessor("total_approved_qty", {
        header: "total approved qty",
        cell: (info) => (
          <div
            className={`fw-bolder text-${
              info.row.original.total_approved_qty > 0 ? "green" : "danger"
            }`}
          >
            {info.row.original.total_approved_qty > 0
              ? info.row.original.total_approved_qty
              : "0"}
          </div>
        ),
      }),

      columnHelper.accessor("total_request_items", {
        header: "total item",
        cell: (info) => (
          <>
            <Badge bg="orange" className="fw-normal" style={{ fontSize: 11 }}>
              {info.row.original.total_request_items} {t("old")}
            </Badge>
            &ensp;
            <Badge
              bg="secondary"
              className="fw-normal"
              style={{ fontSize: 11, marginTop: "5px" }}
            >
              {info.row.original.total_new_request_items} {t("new")}
            </Badge>
          </>
        ),
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
                    `/stock-request/create-stock-request/${info.row.original.id}?type=view`
                  ),
              },
              edit: {
                show: checkPermission?.update,
                disabled: info.row.original.active ? false : true,
                action: () =>
                  navigate(
                    `${
                      !info.row.original?.status == "0"
                        ? `/stock-request/create-stock-request/${info.row.original.id}?type=approve`
                        : `#`
                    }`
                  ),
              },
              reject: {
                show: checkPermission?.update,
                disabled: !info.row.original?.active ? true : false,
                action: () =>
                  !info.row.original?.active
                    ? false
                    : handleUpdate(info.row.original),
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
      <Formik
        enableReinitialize={true}
        initialValues={{
          remark: "",
        }}
        validationSchema={addRemarkSchema}
        onSubmit={handleRejected}
      >
        {(props) => (
          <ConfirmAlert
            formikProps={props}
            size={"md"}
            hide={setShowAlert}
            show={showAlert}
            type="submit"
            title={"Confirm Reject"}
            description={
              <Row className="g-3 py-1">
                <Col md={12}>
                  <TextareaAutosize
                    minRows={3}
                    placeholder="type remarks..."
                    onChange={props.handleChange}
                    name="remark"
                    className="edit-textarea"
                    onBlur={props.handleBlur}
                    isInvalid={Boolean(
                      props.touched.remark && props.errors.remark
                    )}
                  />
                  <small className="text-danger">{props.errors.remark}</small>
                </Col>
                <Col md={12}>
                  <div className="table-scroll">
                    {storeId?.request_stock?.request_stock.length > 0 && (
                      <>
                        <h6 className="my-2">{t("Request Item")}</h6>
                        <Table className="table-sm table Roles">
                          <thead>
                            <tr>
                              <th>{t("Unique Id")}</th>
                              <th>{t("Item Name")}</th>
                              <th>{t("Item rate")}</th>
                              <th>{t("request qty")}</th>
                              <th>{t("request amount")}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {storeId?.request_stock?.request_stock?.map(
                              (itm, idx) => (
                                <tr key={idx}>
                                  <td>{storeId?.unique_id}</td>
                                  <td>
                                    <div className="d-flex">
                                      <ImageViewer
                                        src={
                                          itm?.item_name?.image
                                            ? `${process.env.REACT_APP_API_URL}${itm?.item_name?.image}`
                                            : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                        }
                                      >
                                        <img
                                          width={35}
                                          height={35}
                                          className="my-bg object-fit p-1 rounded-circle"
                                          src={
                                            itm?.item_name?.image
                                              ? `${process.env.REACT_APP_API_URL}${itm?.item_name?.image}`
                                              : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                          }
                                        />
                                      </ImageViewer>{" "}
                                      <span className="small d-grid">
                                        <span>{itm.item_name?.label}</span>
                                        <span className="text-gray">
                                          {itm.item_name?.unique_id
                                            ? `(${itm.item_name?.unique_id})`
                                            : "-"}
                                        </span>
                                      </span>
                                    </div>
                                  </td>
                                  <td>₹ {itm.item_name?.rate}</td>
                                  <td>{itm.request_quantity}</td>
                                  <td>₹ {itm.total_price}</td>
                                </tr>
                              )
                            )}
                            <tr>
                              <td colSpan={2}></td>
                              <td colSpan={2}>{t("total request amt")}.</td>
                              <td className="text-start text-green">
                                <b>
                                  ₹{" "}
                                  {storeId?.request_stock?.request_stock.reduce(
                                    (userTotal, item) =>
                                      userTotal + +item.total_price,
                                    0
                                  )}
                                </b>
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                      </>
                    )}

                    {storeId?.request_stock?.new_request_stock.length > 0 && (
                      <>
                        <h6 className="my-2">{t("New Request Item")}</h6>
                        <Table className="table-sm table Roles">
                          <thead>
                            <tr>
                              <th>{t("Unique Id")}</th>
                              <th>{t("Item Name")}</th>
                              <th>{t("Item rate")}</th>
                              <th>{t("request qty")}</th>
                              <th>{t("request amount")}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {storeId?.request_stock?.new_request_stock?.map(
                              (itm, idx) => (
                                <tr key={idx}>
                                  <td>{storeId?.unique_id}</td>
                                  <td>
                                    <div className="d-flex">
                                      <ImageViewer
                                        src={
                                          itm?.item_image
                                            ? `${process.env.REACT_APP_API_URL}/${itm?.item_image}`
                                            : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                        }
                                      >
                                        <img
                                          width={35}
                                          height={35}
                                          className="my-bg object-fit p-1 rounded-circle"
                                          src={
                                            itm?.item_image
                                              ? `${process.env.REACT_APP_API_URL}/${itm?.item_image}`
                                              : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                          }
                                        />
                                      </ImageViewer>{" "}
                                      <span className="small d-grid">
                                        <span>{itm.title?.label}</span>
                                        <span className="text-gray">
                                          {itm.item_name?.unique_id
                                            ? `(${itm.item_name?.unique_id})`
                                            : "-"}
                                        </span>
                                      </span>
                                    </div>
                                  </td>
                                  <td>₹ {itm?.rate}</td>
                                  <td>{itm?.qty}</td>
                                  <td>₹ {itm?.fund_amount}</td>
                                </tr>
                              )
                            )}
                            <tr>
                              <td colSpan={2}></td>
                              <td colSpan={2}>{t("total request amt")}.</td>
                              <td className="text-start text-green">
                                <b>
                                  ₹
                                  {storeId?.request_stock?.new_request_stock.reduce(
                                    (userTotal, item) =>
                                      userTotal + +item.fund_amount,
                                    0
                                  )}
                                </b>
                              </td>
                            </tr>

                            <tr>
                              <td colSpan={2}></td>
                              <td colSpan={2}>{t("Final Amount")}</td>

                              <td className="text-start text-green">
                                <b>
                                  ₹{" "}
                                  {storeId?.request_stock?.new_request_stock.reduce(
                                    (userTotal, item) =>
                                      userTotal + +item.fund_amount,
                                    0
                                  ) +
                                    storeId?.request_stock?.request_stock.reduce(
                                      (userTotal, item) =>
                                        userTotal + +item.total_price,
                                      0
                                    )}
                                </b>
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                      </>
                    )}
                  </div>
                </Col>
              </Row>
            }
          />
        )}
      </Formik>
      <CustomTable
        id={"approved_stock_request"}
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
              show: false,
            }}
          />
        )}
        tableTitleComponent={
          <div>
            <UserPlus /> <strong>Approved</strong>
          </div>
        }
      />
    </>
  );
};

export default ApprovedStockRequest;

// <span className="d-align mt-3 me-3 justify-content-end gap-2">
//   <span className="position-relative">
//     <BsSearch className="position-absolute top-50 me-3 end-0 translate-middle-y" />
//     <Form.Control
//       type="text"
//       placeholder={t("Search")}
//       onChange={(e) => setSearchTerm(e.target.value)}
//       className="me-2"
//       aria-label="Search"
//     />
//   </span>
// </span>
// <div className="p-3">
//   <div className="table-scroll">
//     <Table className="text-body bg-new Roles">
//       <thead className="text-truncate">
//         <tr>
//           <th>{t("Unique Id")}</th>
//           <th>{t("Request for")}</th>
//           <th>{t("Status")}</th>
//           <th>{t("Request Date")}</th>
//           <th>{t("Request Qty")}</th>
//           <th>{t("Supplier")}</th>
//           <th>{t("Approved By")}</th>
//           <th>{t("Total Approved Qty")}</th>
//           <th>{t("Total Item")}</th>
//           <th>{t("Action")}</th>
//         </tr>
//       </thead>
//       <tbody>
//         {isLoading ? (
//           <tr>
//             <td colSpan={15}>
//               <img
//                 className="p-3"
//                 width="250"
//                 src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
//                 alt="Loading"
//               />
//             </td>
//           </tr>
//         ) : results.length > 0 ? (
//           <>
//             {results.map((data, id1) => (
//               <tr key={id1}>
//                 <td>{data?.unique_id}</td>
//                 <td>
//                   <UserDetail
//                     img={data?.request_for_image}
//                     name={data?.request_for}
//                     id={data?.request_for_id}
//                     unique_id={data?.request_for_employee_id}
//                     login_id={user.id}
//                   />
//                 </td>
//                 <td className={`text-green`}>{t("Approved")}</td>
//                 <td>{data.request_date}</td>
//                 <td
//                   className={`fw-bolder text-${
//                     data.total_request_qty > 0 ? "green" : "danger"
//                   }`}
//                 >
//                   {data.total_request_qty > 0
//                     ? data.total_request_qty
//                     : "0"}
//                 </td>
//                 <td>{data?.supplier_name ?? "--"}</td>
//                 <td>
//                   <UserDetail
//                     img={data?.approved_image}
//                     name={data?.approved_by_name}
//                     id={data?.approved_by_id}
//                     unique_id={data?.approved_by_employee_id}
//                     login_id={user.id}
//                   />
//                 </td>
//                 <td
//                   className={`fw-bolder text-${
//                     data.total_approved_qty > 0 ? "green" : "danger"
//                   }`}
//                 >
//                   {data.total_approved_qty > 0
//                     ? data.total_approved_qty
//                     : "0"}
//                 </td>
//                 <td>
//                   <Badge
//                     bg="orange"
//                     className="fw-normal"
//                     style={{ fontSize: 11 }}
//                   >
//                     {data.total_request_items} {t("old")}
//                   </Badge>
//                   &ensp;
//                   <Badge
//                     bg="secondary"
//                     className="fw-normal"
//                     style={{ fontSize: 11, marginTop: "5px" }}
//                   >
//                     {data.total_new_request_items} {t("new")}
//                   </Badge>
//                 </td>
//                 <td>
//                   <ActionButton
//                     eyelink={`/stock-request/create-stock-request/${data.id}?type=view`}
//                     hideDelete={"d-none"}
//                     editClass={`danger-${
//                       data?.active ? "combo" : "combo-disable pe-none"
//                     }`}
//                     editlink={`/stock-request/create-stock-request/${data.id}?type=approve`}
//                     rejectOnclick={() => handleUpdate(data)}
//                     rejectClass={
//                       !data?.active
//                         ? `danger-combo-disable pe-none `
//                         : `red-combo`
//                     }
//                   />
//                 </td>
//               </tr>
//             ))}
//           </>
//         ) : (
//           <tr>
//             <td colSpan={15}>
//               <img
//                 className="p-3"
//                 alt="no-result"
//                 width="250"
//                 src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
//               />
//             </td>
//           </tr>
//         )}
//       </tbody>
//       <tfoot>
//         <td colSpan={15}>
//           <Formik
//             enableReinitialize={true}
//             initialValues={{
//               remark: "",
//             }}
//             validationSchema={addRemarkSchema}
//             onSubmit={handleRejected}
//           >
//             {(props) => (
//               <ConfirmAlert
//                 formikProps={props}
//                 size={"md"}
//                 hide={setShowAlert}
//                 show={showAlert}
//                 type="submit"
//                 title={"Confirm Reject"}
//                 description={
//                   <Row className="g-3 py-1">
//                     <Col md={12}>
//                       <TextareaAutosize
//                         minRows={3}
//                         placeholder="type remarks..."
//                         onChange={props.handleChange}
//                         name="remark"
//                         className="edit-textarea"
//                         onBlur={props.handleBlur}
//                         isInvalid={Boolean(
//                           props.touched.remark && props.errors.remark
//                         )}
//                       />
//                       <small className="text-danger">
//                         {props.errors.remark}
//                       </small>
//                     </Col>
//                     <Col md={12}>
//                       <div className="table-scroll">
//                         {storeId?.request_stock?.request_stock.length >
//                           0 && (
//                           <>
//                             <h6 className="my-2">{t("Request Item")}</h6>
//                             <Table className="table-sm table Roles">
//                               <thead>
//                                 <tr>
//                                   <th>{t("Unique Id")}</th>
//                                   <th>{t("Item Name")}</th>
//                                   <th>{t("Item rate")}</th>
//                                   <th>{t("request qty")}</th>
//                                   <th>{t("request amount")}</th>
//                                 </tr>
//                               </thead>
//                               <tbody>
//                                 {storeId?.request_stock?.request_stock?.map(
//                                   (itm, idx) => (
//                                     <tr key={idx}>
//                                       <td>{storeId?.unique_id}</td>
//                                       <td>
//                                         <div className="d-flex">
//                                           <ImageViewer
//                                             src={
//                                               itm?.item_name?.image
//                                                 ? `${process.env.REACT_APP_API_URL}${itm?.item_name?.image}`
//                                                 : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
//                                             }
//                                           >
//                                             <img
//                                               width={35}
//                                               height={35}
//                                               className="my-bg object-fit p-1 rounded-circle"
//                                               src={
//                                                 itm?.item_name?.image
//                                                   ? `${process.env.REACT_APP_API_URL}${itm?.item_name?.image}`
//                                                   : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
//                                               }
//                                             />
//                                           </ImageViewer>{" "}
//                                           <span className="small d-grid">
//                                             <span>
//                                               {itm.item_name?.label}
//                                             </span>
//                                             <span className="text-gray">
//                                               {itm.item_name?.unique_id
//                                                 ? `(${itm.item_name?.unique_id})`
//                                                 : "-"}
//                                             </span>
//                                           </span>
//                                         </div>
//                                       </td>
//                                       <td>₹ {itm.item_name?.rate}</td>
//                                       <td>{itm.request_quantity}</td>
//                                       <td>₹ {itm.total_price}</td>
//                                     </tr>
//                                   )
//                                 )}
//                                 <tr>
//                                   <td colSpan={2}></td>
//                                   <td colSpan={2}>
//                                     {t("total request amt")}.
//                                   </td>
//                                   <td className="text-start text-green">
//                                     <b>
//                                       ₹{" "}
//                                       {storeId?.request_stock?.request_stock.reduce(
//                                         (userTotal, item) =>
//                                           userTotal + +item.total_price,
//                                         0
//                                       )}
//                                     </b>
//                                   </td>
//                                 </tr>
//                               </tbody>
//                             </Table>
//                           </>
//                         )}

//                         {storeId?.request_stock?.new_request_stock
//                           .length > 0 && (
//                           <>
//                             <h6 className="my-2">
//                               {t("New Request Item")}
//                             </h6>
//                             <Table className="table-sm table Roles">
//                               <thead>
//                                 <tr>
//                                   <th>{t("Unique Id")}</th>
//                                   <th>{t("Item Name")}</th>
//                                   <th>{t("Item rate")}</th>
//                                   <th>{t("request qty")}</th>
//                                   <th>{t("request amount")}</th>
//                                 </tr>
//                               </thead>
//                               <tbody>
//                                 {storeId?.request_stock?.new_request_stock?.map(
//                                   (itm, idx) => (
//                                     <tr key={idx}>
//                                       <td>{storeId?.unique_id}</td>
//                                       <td>
//                                         <div className="d-flex">
//                                           <ImageViewer
//                                             src={
//                                               itm?.item_image
//                                                 ? `${process.env.REACT_APP_API_URL}/${itm?.item_image}`
//                                                 : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
//                                             }
//                                           >
//                                             <img
//                                               width={35}
//                                               height={35}
//                                               className="my-bg object-fit p-1 rounded-circle"
//                                               src={
//                                                 itm?.item_image
//                                                   ? `${process.env.REACT_APP_API_URL}/${itm?.item_image}`
//                                                   : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
//                                               }
//                                             />
//                                           </ImageViewer>{" "}
//                                           <span className="small d-grid">
//                                             <span>
//                                               {itm.title?.label}
//                                             </span>
//                                             <span className="text-gray">
//                                               {itm.item_name?.unique_id
//                                                 ? `(${itm.item_name?.unique_id})`
//                                                 : "-"}
//                                             </span>
//                                           </span>
//                                         </div>
//                                       </td>
//                                       <td>₹ {itm?.rate}</td>
//                                       <td>{itm?.qty}</td>
//                                       <td>₹ {itm?.fund_amount}</td>
//                                     </tr>
//                                   )
//                                 )}
//                                 <tr>
//                                   <td colSpan={2}></td>
//                                   <td colSpan={2}>
//                                     {t("total request amt")}.
//                                   </td>
//                                   <td className="text-start text-green">
//                                     <b>
//                                       ₹
//                                       {storeId?.request_stock?.new_request_stock.reduce(
//                                         (userTotal, item) =>
//                                           userTotal + +item.fund_amount,
//                                         0
//                                       )}
//                                     </b>
//                                   </td>
//                                 </tr>

//                                 <tr>
//                                   <td colSpan={2}></td>
//                                   <td colSpan={2}>{t("Final Amount")}</td>

//                                   <td className="text-start text-green">
//                                     <b>
//                                       ₹{" "}
//                                       {storeId?.request_stock?.new_request_stock.reduce(
//                                         (userTotal, item) =>
//                                           userTotal + +item.fund_amount,
//                                         0
//                                       ) +
//                                         storeId?.request_stock?.request_stock.reduce(
//                                           (userTotal, item) =>
//                                             userTotal + +item.total_price,
//                                           0
//                                         )}
//                                     </b>
//                                   </td>
//                                 </tr>
//                               </tbody>
//                             </Table>
//                           </>
//                         )}
//                       </div>
//                     </Col>
//                   </Row>
//                 }
//               />
//             )}
//           </Formik>

//           <ReactPagination
//             pageSize={pageSize}
//             prevClassName={
//               pageNo === 1 ? "danger-combo-disable pe-none" : "red-combo"
//             }
//             nextClassName={
//               pageSize == pageDetail?.total
//                 ? approveStockRequest.length - 1 < pageSize
//                   ? "danger-combo-disable pe-none"
//                   : "success-combo"
//                 : approveStockRequest.length < pageSize
//                 ? "danger-combo-disable pe-none"
//                 : "success-combo"
//             }
//             title={`Showing ${pageDetail?.pageStartResult || 0} to ${
//               pageDetail?.pageEndResult || 0
//             } of ${pageDetail?.total || 0}`}
//             handlePageSizeChange={handlePageSizeChange}
//             prevonClick={() => setPageNo(pageNo - 1)}
//             nextonClick={() => setPageNo(pageNo + 1)}
//           />
//         </td>
//       </tfoot>
//     </Table>
//   </div>
// </div>
