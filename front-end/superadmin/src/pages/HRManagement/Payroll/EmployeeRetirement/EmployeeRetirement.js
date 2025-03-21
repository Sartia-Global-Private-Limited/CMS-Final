import React, { Fragment, useEffect, useMemo, useState } from "react";
import "react-best-tabs/dist/index.css";
import { Col, Form, Row } from "react-bootstrap";
import { Helmet } from "react-helmet";
import {
  DeletePensionRetirment,
  getAllPensionRetirment,
} from "../../../../services/authapi";
import Modaljs from "../../../../components/Modal";
import moment from "moment";
import ConfirmAlert from "../../../../components/ConfirmAlert";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import ActionButtons from "../../../../components/DataTable/ActionButtons";
import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../../../features/auth/authSlice";
import CustomTable from "../../../../components/DataTable/CustomTable";
import TableHeader from "../../../../components/DataTable/TableHeader";
import { serialNumber } from "../../../../utils/helper";

const EmployeeRetirement = ({ checkPermission }) => {
  const [singlePlans, setSinglePlans] = useState(false);
  const [edit, setEdit] = useState({});
  const [idToDelete, setIdToDelete] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const columnHelper = createColumnHelper();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { userPermission } = useSelector(selectUser);

  const fetchRetirementData = async () => {
    const res = await getAllPensionRetirment(search, pageSize, pageNo);
    if (res.status) {
      setRows(res.data);
      setTotalData(res?.pageDetails?.total);
    } else {
      setRows([]);
      setTotalData(0);
    }
    setIsLoading(false);
  };

  const handleView = async (data) => {
    setEdit(data);
    setSinglePlans(true);
  };

  const singleoutletsList = [
    { id: 0, title: t("Name"), value: edit?.name },
    {
      id: 1,
      title: t("retirement date"),
      value: moment(edit?.retirement_date).format("DD-MM-YYYY"),
    },
    { id: 2, title: t("asset recovery"), value: edit?.asset_recovery },
    {
      id: 3,
      title: t("pension status"),
      value: edit?.pension_status == "1" ? "Active" : "Inactive",
    },
    { id: 4, title: t("pension amount"), value: edit?.pension_amount },
    { id: 5, title: t("Pension Duration"), value: edit?.pension_duration },
    {
      id: 6,
      title: t("allow commutation"),
      value: Boolean(edit?.allow_commutation) == false ? "No" : "Yes",
    },
    { id: 7, title: t("commute percentage"), value: edit?.commute_percentage },
    {
      id: 8,
      title: t("retirement gratuity"),
      value: edit?.retirement_gratuity,
    },
    { id: 9, title: t("service gratuity"), value: edit?.service_gratuity },
  ];

  const handleDelete = async () => {
    const res = await DeletePensionRetirment(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setRows((prev) => prev.filter((itm) => itm.id !== +idToDelete));
      fetchRetirementData();
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
  };

  useEffect(() => {
    fetchRetirementData();
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
      columnHelper.accessor("name", {
        header: t("User Name"),
      }),
      columnHelper.accessor("retirement_date", {
        header: t("Retirement Date"),
        cell: (info) =>
          moment(info.row?.original?.retirement_date).format("YYYY-MM-DD"),
      }),
      columnHelper.accessor("pension_amount", {
        header: t("Pension Amount"),
        cell: (info) => `₹ ${info.row.original.pension_amount}`,
      }),
      columnHelper.accessor("pension_duration", {
        header: t("Pension Duration"),
      }),
      columnHelper.accessor("commute_percentage", {
        header: t("Commute Percentage"),
        cell: (info) =>
          info.row.original.commute_percentage
            ? `${info.row.original.commute_percentage} %`
            : "-",
      }),
      columnHelper.accessor("action", {
        header: t("Action"),
        cell: (info) => (
          <ActionButtons
            actions={{
              view: {
                show: checkPermission?.view,
                action: () =>
                  navigate(`/EmployeeRetirement/view/${info.row.original?.id}`),
              },
              edit: {
                show: checkPermission?.update,
                action: () =>
                  navigate(
                    `/EmployeeRetirement/AddEmployeeRetirement/${info.row.original?.id}`
                  ),
              },
              delete: {
                show: checkPermission?.delete,
                action: () => {
                  setIdToDelete(`${info.row.original?.id}`);
                  setShowAlert(true);
                },
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
      <Helmet>
        <title>All Employee Retirement · CMS Electricals</title>
      </Helmet>

      <CustomTable
        id={"employee_Retirement"}
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
            button={{
              noDrop: true,
              to: `/EmployeeRetirement/AddEmployeeRetirement/new`,
              title: "Create",
            }}
          />
        )}
        tableTitleComponent={
          <div>
            <strong>All Employee Retirement</strong>
          </div>
        }
      />

      <Modaljs
        open={singlePlans}
        size={"md"}
        closebtn={"Cancel"}
        Savebtn={"Ok"}
        close={() => setSinglePlans(false)}
        title={t("View Insurance Company Plans")}
      >
        <Row className="g-2 align-items-center">
          {singleoutletsList.map((details, id1) =>
            details?.value ? (
              <Fragment key={id1}>
                <Col md={4}>{details.title}</Col>
                <Col md={8}>
                  <Form.Control
                    type={details.title === "Document" ? "image" : "text"}
                    className="fw-bolder"
                    size="100"
                    src={details.src}
                    value={details.value}
                    disabled
                  />
                </Col>
              </Fragment>
            ) : null
          )}
        </Row>
      </Modaljs>

      <ConfirmAlert
        size={"sm"}
        deleteFunction={handleDelete}
        hide={setShowAlert}
        show={showAlert}
        title={"Confirm Delete"}
        description={"Are you sure you want to delete this!!"}
      />
    </>
  );
};

export default EmployeeRetirement;
