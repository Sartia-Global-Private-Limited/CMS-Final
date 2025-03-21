import React, { useEffect, useMemo, useState } from "react";
import { Badge, Col, Row } from "react-bootstrap";
import {
  getApprovedFundRequest,
  postRejectFundRequest,
} from "../../../services/contractorApi";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { selectUser } from "../../../features/auth/authSlice";
import { useSelector } from "react-redux";
import { UserDetail } from "../../../components/ItemDetail";
import TextareaAutosize from "react-textarea-autosize";
import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate, useSearchParams } from "react-router-dom";
import StatusChip from "../../../components/StatusChip";
import ActionButtons from "../../../components/DataTable/ActionButtons";
import CustomTable from "../../../components/DataTable/CustomTable";
import TableHeader from "../../../components/DataTable/TableHeader";
import { UserPlus } from "lucide-react";
import { formatNumberToINR, serialNumber } from "../../../utils/helper";
import ConfirmAlert from "../../../components/ConfirmAlert";
import { addRemarkSchema } from "../../../utils/formSchema";
import { Formik } from "formik";

const ApprovedFundRequest = ({ checkPermission }) => {
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

  const fetchFundApprovedData = async () => {
    const res = await getApprovedFundRequest(search, pageSize, pageNo);
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

  const handleRejected = async (values, { setSubmitting, resetForm }) => {
    const module = "fund-request";
    const sData = {
      remarks: storeId.id,
    };
    const res = await postRejectFundRequest(storeId.id, module, sData);
    if (res.status) {
      toast.success(res.message);
      fetchFundApprovedData();
    } else {
      toast.error(res.message);
    }
    resetForm();
    setSubmitting(false);
    setShowAlert(false);
  };

  const handleUpdate = (data) => {
    setStoreId(data);
    setShowAlert(true);
  };

  useEffect(() => {
    fetchFundApprovedData();
  }, [search, pageNo, pageSize]);

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
        cell: (info) => <StatusChip status={"approved"} />,
      }),
      columnHelper.accessor("request_date", {
        header: "request date",
      }),
      columnHelper.accessor("total_request_amount", {
        header: "request amount",
        cell: (info) => (
          <td
            className={`fw-bolder text-${
              info.row.original.total_request_amount > 0 ? "green" : "danger"
            }`}
          >
            {formatNumberToINR(info.row.original.total_request_amount)}
          </td>
        ),
      }),
      columnHelper.accessor("total_approved_amount", {
        header: "total approved amount",
        cell: (info) => (
          <div
            className={`fw-bolder text-${
              info.row.original.total_approved_amount > 0 ? "green" : "danger"
            }`}
          >
            {formatNumberToINR(info.row.original.total_approved_amount)}
          </div>
        ),
      }),
      columnHelper.accessor("approved_by", {
        header: "approved by ",
        cell: (info) => (
          <UserDetail
            img={info.row.original?.approved_by_image}
            name={info.row.original?.approved_by}
            login_id={user?.id}
            id={info.row.original?.approved_by_id}
            unique_id={info.row.original?.approved_by_employee_id}
          />
        ),
      }),
      columnHelper.accessor("total_request_items", {
        header: "Total Item",
        cell: (info) => (
          <>
            <Badge bg="orange" className="fw-normal" style={{ fontSize: 11 }}>
              {info.row.original.total_request_items} {t("old")}
            </Badge>
            &ensp;
            <Badge
              bg="secondary"
              className="fw-normal"
              style={{ fontSize: 11 }}
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
                    `/fund-request/create-fund-request/${info.row.original.id}?type=view`
                  ),
              },
              edit: {
                show: checkPermission?.update,
                // disabled: info.row.original.active ? false : true,
                action: () =>
                  navigate(
                    `/fund-request/create-fund-request/${info.row.original.id}?type=approve`
                  ),
              },
              reject: {
                show: checkPermission?.update,
                // disabled: !info.row.original?.active ? true : false,
                action: () => handleUpdate(info.row.original),
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
      <CustomTable
        id={"approved_fund_request"}
        userPermission={checkPermission}
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
            button={{ show: false }}
          />
        )}
        tableTitleComponent={
          <div>
            <UserPlus /> <strong>Approved fund request</strong>
          </div>
        }
      />

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
            size={"sm"}
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
                </Col>{" "}
              </Row>
            }
          />
        )}
      </Formik>
    </>
  );
};

export default ApprovedFundRequest;
