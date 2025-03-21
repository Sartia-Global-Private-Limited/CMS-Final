import React, { useEffect, useMemo, useState } from "react";
import { Col, Row } from "react-bootstrap";
import TextareaAutosize from "react-textarea-autosize";
import {
  getRequestComplaints,
  postApprovedComplaints,
  postRejectComplaints,
} from "../../services/contractorApi";
import { toast } from "react-toastify";
import ConfirmAlert from "../../components/ConfirmAlert";
import { Formik } from "formik";
import { addRemarkSchema } from "../../utils/formSchema";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FilterComponent } from "./FilterComponent";
import { useTranslation } from "react-i18next";
import { createColumnHelper } from "@tanstack/react-table";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import StatusChip from "../../components/StatusChip";
import CustomTable from "../../components/DataTable/CustomTable";
import TableHeader from "../../components/DataTable/TableHeader";
import { UserPlus } from "lucide-react";
import ActionButtons from "../../components/DataTable/ActionButtons";
import { serialNumber } from "../../utils/helper";

const RequestsComplaint = ({ checkPermission }) => {
  const columnHelper = createColumnHelper();
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [salesAreaId, setSalesAreaId] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [complaintFor, setComplaintFor] = useState("");
  const [outletId, setOutletId] = useState("");
  const [regionalOfficeId, setRegionalOfficeId] = useState("");
  const [orderById, setOrderById] = useState("");
  const [uniqueId, setUniqueId] = useState("");
  const { userPermission } = useSelector(selectUser);
  const [showAlert, setShowAlert] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [actionStatus, setActionStatus] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const fetchRequestComplaints = async () => {
    const res = await getRequestComplaints({
      search,
      pageSize,
      pageNo,
      sales_area_id: salesAreaId,
      outlet_id: outletId,
      regional_office_id: regionalOfficeId,
      order_by_id: orderById,
      company_id: companyId,
      complaint_for: complaintFor,
    });
    if (res.status) {
      setRows(res.data);
      setTotalData(res?.pageDetails?.total);
    } else {
      setRows([]);
      setTotalData(0);
    }
    setIsLoading(false);
  };

  const handleCheckboxChange = (data, status) => {
    setActionStatus(status);
    setShowAlert(true);
    setSelectedRows(data);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {};

    if (actionStatus === 4) {
      sData["id"] = selectedRows?.id;
      sData["rejected_remark"] = values.remark;
      sData["status"] = 4;
    } else {
      sData["complaint_id"] = selectedRows?.id;
    }

    // return console.log("sData", sData);
    const res =
      actionStatus === 4
        ? await postRejectComplaints(sData)
        : await postApprovedComplaints(sData);
    if (res.status) {
      toast.success(res.message);
      fetchRequestComplaints();
    } else {
      toast.error(res.message);
    }
    setShowAlert(false);
    // setSelectedRows([]);
    resetForm();
    setSubmitting(false);
  };

  useEffect(() => {
    fetchRequestComplaints();
  }, [
    search,
    pageNo,
    pageSize,
    salesAreaId,
    outletId,
    regionalOfficeId,
    orderById,
    companyId,
    uniqueId,
  ]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("sr_no", {
        header: t("Sr No."),
        cell: (info) => {
          const serialNumbers = serialNumber(pageNo, pageSize);
          return serialNumbers[info.row.index];
        },
      }),
      columnHelper.accessor("complaint_unique_id", {
        header: "Complaint Unique ID",
      }),
      columnHelper.accessor("outlet_name", {
        header: "outlet name",
        cell: (info) => info.row.original?.outlet[0]?.outlet_name,
      }),
      columnHelper.accessor("outlet_ccnohsd", {
        header: "outlet ccnohsd",
        cell: (info) => info.row.original?.outlet[0]?.outlet_ccnohsd,
      }),
      columnHelper.accessor("outlet_ccnoms", {
        header: "outlet ccnoms",
        cell: (info) => info.row.original?.outlet?.[0]?.outlet_ccnoms,
      }),
      columnHelper.accessor("regional_office_name", {
        header: "regional office name",
        cell: (info) =>
          info.row.original?.regionalOffice?.[0]?.regional_office_name,
      }),
      columnHelper.accessor("sales_area_name", {
        header: "sales area name",
        cell: (info) =>
          info.row.original?.saleAreaDetails?.[0]?.sales_area_name,
      }),
      columnHelper.accessor("order_by_details", {
        header: "order by",
      }),
      columnHelper.accessor("energy_company_name", {
        header: "company name",
      }),
      columnHelper.accessor("description", {
        header: "description",
      }),
      columnHelper.accessor("status", {
        header: "status",
        cell: (info) => <StatusChip status={info.row.original.status} />,
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
                    `/RequestsComplaint/ViewRequestsComplaint/${info.row.original.id}`,
                    { state: { checkPermission: checkPermission?.update } }
                  ),
              },
              edit: {
                show: checkPermission?.update,
                action: () =>
                  navigate(`/create-complaint/${info.row.original.id}`),
              },
              approve: {
                show: checkPermission?.update,
                action: () => handleCheckboxChange(info.row.original, 1),
              },
              reject: {
                show: checkPermission?.update,
                action: () => handleCheckboxChange(info.row.original, 4),
              },
            }}
          />
        ),
      }),
    ],
    [checkPermission, t, rows.length, pageNo, pageSize]
  );

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          remark: "",
        }}
        validationSchema={actionStatus == 4 ? addRemarkSchema : null}
        onSubmit={handleSubmit}
      >
        {(props) => (
          <ConfirmAlert
            formikProps={props}
            size={"md"}
            hide={setShowAlert}
            show={showAlert}
            type="submit"
            title={`Confirm ${actionStatus === 4 ? "Reject" : "Approve"}`}
            description={
              <>
                <Row className="g-3 py-1">
                  {actionStatus === 4 ? (
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
                      <small className="text-danger">
                        {props.errors.remark}
                      </small>
                    </Col>
                  ) : null}

                  <Col md={12}>
                    <div className="p-20 shadow rounded h-100">
                      <strong className="text-secondary">
                        {t("Company Details")}
                      </strong>
                      <div className="mt-2">
                        <table className="table-sm table">
                          <tbody>
                            {selectedRows?.energy_company_name && (
                              <tr>
                                <th>
                                  {selectedRows?.complaint_for == "1"
                                    ? t("Energy")
                                    : t("Other")}{" "}
                                  {t("Company Name")} :
                                </th>
                                <td>{selectedRows?.energy_company_name}</td>
                              </tr>
                            )}
                            {selectedRows?.outlet && (
                              <tr>
                                <th>{t("Outlet Name")} :</th>
                                <td>{selectedRows?.outlet[0]?.outlet_name}</td>
                              </tr>
                            )}
                            {selectedRows?.regionalOffice && (
                              <tr>
                                <th>{t("Regional Office Name")} :</th>
                                <td>
                                  {
                                    selectedRows?.regionalOffice[0]
                                      ?.regional_office_name
                                  }
                                </td>
                              </tr>
                            )}
                            {selectedRows?.saleAreaDetails && (
                              <tr>
                                <th>{t("Sales Area Name")} :</th>
                                <td>
                                  {
                                    selectedRows?.saleAreaDetails[0]
                                      ?.sales_area_name
                                  }
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </Col>

                  <Col md={12}>
                    <div className="p-20 shadow rounded h-100">
                      <strong className="text-secondary">
                        {t("Complaint Details")}
                      </strong>
                      <div className="mt-2">
                        <table className="table-sm table">
                          <tbody>
                            {selectedRows?.complaintRaiseType && (
                              <tr>
                                <th>{t("Complaint Raise Type")} :</th>
                                <td>{selectedRows?.complaintRaiseType}</td>
                              </tr>
                            )}
                            {selectedRows?.complaint_raise_by && (
                              <tr>
                                <th>{t("Complaint Raise By")} :</th>
                                <td>{selectedRows?.complaint_raise_by}</td>
                              </tr>
                            )}
                            {selectedRows?.complaint_type && (
                              <tr>
                                <th>{t("Complaint Type")} :</th>
                                <td>{selectedRows?.complaint_type}</td>
                              </tr>
                            )}
                            {selectedRows?.complaint_unique_id && (
                              <tr>
                                <th>{t("Complaint Id")} :</th>
                                <td>{selectedRows?.complaint_unique_id}</td>
                              </tr>
                            )}
                            {selectedRows?.created_at && (
                              <tr>
                                <th>{t("Created At")} :</th>
                                <td>{selectedRows?.created_at}</td>
                              </tr>
                            )}
                            {selectedRows?.description && (
                              <tr>
                                <th>{t("Description")} :</th>
                                <td>{selectedRows?.description}</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </Col>
                </Row>
              </>
            }
          />
        )}
      </Formik>

      <FilterComponent
        setSalesAreaId={setSalesAreaId}
        setCompanyId={setCompanyId}
        setComplaintFor={setComplaintFor}
        setOutletId={setOutletId}
        setRegionalOfficeId={setRegionalOfficeId}
        setOrderById={setOrderById}
        setUniqueId={setUniqueId}
        status={1}
      ></FilterComponent>

      <CustomTable
        id={"request_complaints"}
        userPermission={checkPermission}
        isLoading={isLoading}
        rows={rows || []}
        columns={columns}
        pagination={{
          pageNo,
          pageSize,
          totalData,
        }}
        excelAction={() => ""}
        pdfAction={() => ""}
        apiForExcelPdf={getRequestComplaints}
        customHeaderComponent={() => (
          <TableHeader
            userPermission={checkPermission}
            setSearchText={setSearch}
            button={{
              noDrop: true,
              to: `/create-complaint/new`,
              title: "Create",
            }}
          />
        )}
        tableTitleComponent={
          <div>
            <UserPlus /> <strong>Requested complaints</strong>
          </div>
        }
        defaultVisible={{
          description: false,
        }}
      />
    </>
  );
};

export default RequestsComplaint;
