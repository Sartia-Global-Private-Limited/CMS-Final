import React, { Fragment, useEffect, useMemo, useState } from "react";
import "react-best-tabs/dist/index.css";
import { Helmet } from "react-helmet";
import { DeleteGroupInsurance } from "../../../services/authapi";
import { toast } from "react-toastify";
import ConfirmAlert from "../../../components/ConfirmAlert";
import { getAllGroupInsurance } from "../../../services/authapi";
import { useTranslation } from "react-i18next";
import { createColumnHelper } from "@tanstack/react-table";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/auth/authSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import ActionButtons from "../../../components/DataTable/ActionButtons";
import TableHeader from "../../../components/DataTable/TableHeader";
import CustomTable from "../../../components/DataTable/CustomTable";
import { serialNumber } from "../../../utils/helper";
import { UserDetails } from "../../../components/ItemDetail";

const GroupInsurance = ({ checkPermission }) => {
  const columnHelper = createColumnHelper();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [idToDelete, setIdToDelete] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useSelector(selectUser);

  const fetchGroupInsuranceData = async () => {
    const res = await getAllGroupInsurance(search, pageSize, pageNo);
    if (res.status) {
      setRows(res.data);
      setTotalData(res?.pageDetails?.total);
    } else {
      setRows([]);
      setTotalData(0);
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    const res = await DeleteGroupInsurance(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setRows((prev) => prev.filter((itm) => itm.id !== +idToDelete));
      fetchGroupInsuranceData();
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
  };

  useEffect(() => {
    fetchGroupInsuranceData();
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
      columnHelper.accessor("insurance_for", {
        header: t("Insurance For"),
      }),
      columnHelper.accessor("insurance_company_name", {
        header: t("Insurance Company Name"),
      }),
      columnHelper.accessor("insurance_plan_name", {
        header: t("Insurance Plan Name"),
      }),
      columnHelper.accessor("insurance_applied_on", {
        header: t("Insurance Applied On"),
        cell: (info) => (
          <>
            {info.row.original.insurance_for == "Employee Wise" ? (
              <div className="d-align">
                {info.getValue()?.map((itm, idx) => (
                  <Fragment key={idx}>
                    <UserDetails
                      img={itm?.image}
                      id={itm?.id}
                      name={itm?.employee_name}
                      unique_id={itm?.employee_id}
                      login_id={user?.id}
                    />
                  </Fragment>
                ))}
              </div>
            ) : (
              info.getValue()?.map((itm, idx) => (
                <div key={idx}>
                  <span className="fw-bold pe-1">{idx + 1}.</span>
                  {itm?.designation_name}
                </div>
              ))
            )}
          </>
        ),
      }),
      columnHelper.accessor("insurance_deduction_amount", {
        header: t("Insurance Deduction Amt."),
        cell: (info) =>
          info.row.original.insurance_deduction_amount
            ? `₹ ${info.row.original.insurance_deduction_amount}`
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
                  navigate(
                    `/GroupInsurance/ViewGroupInsurance/${info.row.original?.id}`,
                    {
                      state: info.row.original,
                    }
                  ),
              },
              edit: {
                show: checkPermission?.update,
                action: () =>
                  navigate(
                    `/GroupInsurance/AddGroupInsurance/${info.row.original?.id}`
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
        <title>All Group Insurance · CMS Electricals</title>
      </Helmet>

      <CustomTable
        id={"group_Insurance"}
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
              to: `/GroupInsurance/AddGroupInsurance/new`,
              title: "Add Group Insurance",
            }}
          />
        )}
        tableTitleComponent={
          <div>
            <strong>All Group Insurance</strong>
          </div>
        }
      />

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

export default GroupInsurance;
