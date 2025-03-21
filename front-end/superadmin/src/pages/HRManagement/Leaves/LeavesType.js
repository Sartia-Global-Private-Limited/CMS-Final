import React, { useEffect, useMemo, useState } from "react";
import "react-best-tabs/dist/index.css";
import { Col, Form, Row, Table } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { BsPlus } from "react-icons/bs";
import CardComponent from "../../../components/CardComponent";
import Modaljs from "../../../components/Modal";
import TextareaAutosize from "react-textarea-autosize";
import ActionButton from "../../../components/ActionButton";
import {
  getAdminAllLeavesType,
  getAdminCreateLeavesType,
  getAdminDeleteLeavesType,
  getAdminUpdateLeavesType,
} from "../../../services/authapi";
import { toast } from "react-toastify";
import { Formik } from "formik";
import { addRolesSchema } from "../../../utils/formSchema";
import ConfirmAlert from "../../../components/ConfirmAlert";
import moment from "moment";
import Select from "react-select";
import ReactPagination from "../../../components/ReactPagination";
import { createColumnHelper } from "@tanstack/react-table";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { selectUser } from "../../../features/auth/authSlice";
import { useSelector } from "react-redux";
import CustomTable from "../../../components/DataTable/CustomTable";
import TableHeader from "../../../components/DataTable/TableHeader";
import ActionButtons from "../../../components/DataTable/ActionButtons";
import { findMatchingPath, serialNumber } from "../../../utils/helper";
import { TvMinimalPlay, User } from "lucide-react";
import { useTranslation } from "react-i18next";

const LeavesType = () => {
  const [leavesTypeData, setLeavesTypeData] = useState(false);
  const [leavet, setLeavet] = useState([]);
  const [edit, setEdit] = useState({});
  const columnHelper = createColumnHelper();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [idToDelete, setIdToDelete] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [allTutorialType, setAllTutorialType] = useState([]);
  const [tutorialTypeId, setAllTutorialTypeId] = useState("");
  const { userPermission } = useSelector(selectUser);
  const { pathname } = useLocation();
  const [matchingPathObject, setMatchingPathObject] = useState(null);
  const { t } = useTranslation();

  const fetchLeaveData = async () => {
    const res = await getAdminAllLeavesType({ search, pageSize, pageNo });
    if (res.status) {
      setRows(res.data);
      setTotalData(res?.pageDetails?.total);
    } else {
      setRows([]);
      setTotalData(0);
    }
    setIsLoading(false);
  };

  const handleEdit = async (leavet) => {
    setEdit(leavet);
    setLeavesTypeData(true);
  };

  const handleDelete = async () => {
    const res = await getAdminDeleteLeavesType(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setRows((prev) => prev.filter((itm) => itm.id !== +idToDelete));
      fetchLeaveData();
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
  };

  useEffect(() => {
    if (userPermission) {
      const result = findMatchingPath(userPermission, pathname);
      setMatchingPathObject(result);
    }
  }, [userPermission, pathname, searchParams, navigate]);

  const checkPermission = matchingPathObject;

  useEffect(() => {
    fetchLeaveData();
  }, [search, pageSize, pageNo]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    // return console.log('values', values)
    const leaveStatus = values.status.value;
    const sData = {
      leave_type: values.name,
      description: values.description,
      status: leaveStatus,
    };

    if (edit.id) {
      sData["id"] = edit.id;
    }
    // console.log('sData', sData)
    const res = edit.id
      ? await getAdminUpdateLeavesType(sData)
      : await getAdminCreateLeavesType(sData);
    if (res.status) {
      navigate(-1);
      resetForm();
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    setSubmitting(false);
    setLeavesTypeData(false);
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
      columnHelper.accessor("leave_type", {
        header: "Leaves Type",
      }),
      columnHelper.accessor("description", {
        header: "Description",
      }),
      columnHelper.accessor("created_at", {
        header: "Date",
        cell: (info) =>
          moment(info.row.original.created_at).format("DD-MMM-YYYY"),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => (
          <div
            className={`text-${
              info.row.original.status === 1 ? "green" : "danger"
            }`}
          >
            {info.row.original.status === 1 ? "Active" : "Inactive"}
          </div>
        ),
      }),
      columnHelper.accessor("action", {
        header: "Action",
        cell: (info) => (
          <ActionButtons
            actions={{
              edit: {
                show: checkPermission?.update,
                action: () =>
                  navigate(`/leave-type/create/${info.row.original.id}`),
              },
              delete: {
                show: checkPermission?.delete,
                action: () => {
                  setIdToDelete(info.row.original.id);
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
        <title>Leaves Type · CMS Electricals</title>
      </Helmet>
      <CustomTable
        id="tutorials"
        isLoading={isLoading}
        rows={rows}
        columns={columns}
        align="bottom"
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
              title: "Create",
              to: `/leave-type/create/new`,
            }}
          />
        )}
        tableTitleComponent={
          <div>
            <User />
            <strong>All Leaves Type</strong>
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

export default LeavesType;
