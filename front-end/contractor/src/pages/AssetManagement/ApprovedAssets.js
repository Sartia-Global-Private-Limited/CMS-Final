import React, { useEffect, useMemo, useState } from "react";
import { Col, Form, Button } from "react-bootstrap";
import Select from "react-select";
import {
  approveRejectAssetsManagementById,
  deleteAssetsById,
  getAllAssets,
  postAssignedAssetToUser,
} from "../../services/contractorApi";
import { Helmet } from "react-helmet";
import Modaljs from "../../components/Modal";
import TextareaAutosize from "react-textarea-autosize";
import { toast } from "react-toastify";
import { ErrorMessage, Formik } from "formik";
import { addUserIdSchema } from "../../utils/formSchema";
import { getAllUsers } from "../../services/authapi";
import ConfirmAlert from "../../components/ConfirmAlert";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createColumnHelper } from "@tanstack/react-table";
import ActionButtons from "../../components/DataTable/ActionButtons";
import StatusChip from "../../components/StatusChip";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import CustomTable from "../../components/DataTable/CustomTable";
import TableHeader from "../../components/DataTable/TableHeader";
import { UserCheck, UserPlus } from "lucide-react";
import TooltipComponent from "../../components/TooltipComponent";
import { serialNumber } from "../../utils/helper";

const ApprovedAssets = ({ checkPermission }) => {
  const columnHelper = createColumnHelper();
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const { userPermission } = useSelector(selectUser);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [assignUserData, setAssignUserData] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [assestsId, setAssestsId] = useState("");
  const [Allocate, setAllocate] = useState(false);

  const fetchAllAssetsData = async () => {
    const status = 2;
    const isDropdown = false;
    const res = await getAllAssets({
      search,
      pageSize,
      pageNo,
      isDropdown,
      status,
    });
    setIsLoading(true);
    if (res.status) {
      setRows(res?.data);
      setTotalData(res?.pageDetails?.total);
    } else {
      setRows([]);
      setTotalData(0);
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    const res = await deleteAssetsById(assestsId);
    if (res.status) {
      toast.success(res.message);
      setRows((prev) => prev.filter((dlt) => dlt.id !== assestsId));
      fetchAllAssetsData();
    } else {
      toast.error(res.message);
    }
    assestsId("");
    setShowDelete(false);
  };
  const handleApproveReject = async () => {
    const status = "3";
    const res = await approveRejectAssetsManagementById(status, assestsId);

    if (res.status) {
      toast.success(res.message);
      setRows((prev) => prev.filter((itm) => itm.id !== assestsId));
      fetchAllAssetsData();
    } else {
      toast.error(res.message);
    }

    setAssestsId("");

    setShowReject(false);
  };

  const fetchAssignUserData = async () => {
    const res = await getAllUsers();
    if (res.status) {
      setAssignUserData(res.data);
    } else {
      setAssignUserData([]);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      user_id: values.user_id.value,
      asset_id: Allocate,
      notes: values.notes,
    };
    const res = await postAssignedAssetToUser(sData);
    if (res.status) {
      toast.success(res.message);
      fetchAllAssetsData();
    } else {
      toast.error(res.message);
    }
    resetForm();
    setAllocate(false);
    setSubmitting(false);
  };

  useEffect(() => {
    fetchAllAssetsData();
    fetchAssignUserData();
  }, [search, pageNo, pageSize]);

  // return console.log("sData", sData);

  const UserOption = ({ innerProps, label, data }) => (
    <div
      {...innerProps}
      className="d-flex justify-content-between px-2 align-items-center cursor-pointer"
    >
      <span>
        <img
          className="avatar me-2"
          src={
            data.image ||
            `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
          }
          alt={data.name}
        />
        {label}
      </span>
    </div>
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor("sr_no", {
        header: t("Sr No."),
        cell: (info) => {
          const serialNumbers = serialNumber(pageNo, pageSize);
          return serialNumbers[info.row.index];
        },
      }),
      columnHelper.accessor("asset_name", {
        header: "Asset Name",
      }),
      columnHelper.accessor("asset_model_number", {
        header: "Asset Model Number",
      }),
      columnHelper.accessor("asset_uin_number", {
        header: "Asset UIN Number",
      }),
      columnHelper.accessor("asset_price", {
        header: "Asset Price",
      }),
      columnHelper.accessor("asset_purchase_date", {
        header: "Purchase Date",
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => <StatusChip status="approved" />,
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
                    `/AllAssets/CreateAssets/${info.row.original.id}?type=view`
                  ),
              },
              edit: {
                show: checkPermission?.update,
                action: () =>
                  navigate(`/AllAssets/CreateAssets/${info.row.original.id}`),
              },
              delete: {
                show: checkPermission?.delete,
                action: () => {
                  setAssestsId(info.row.original.id);
                  setShowDelete(true);
                },
              },
              reject: {
                show: true,
                action: () => {
                  setAssestsId(info.row.original.id);
                  setShowReject(true);
                },
              },
            }}
            custom={
              <TooltipComponent align="left" title="Assign">
                <div className="vr hr-shadow" />
                <Button
                  className="view-btn"
                  variant="light"
                  onClick={() =>
                    // console.log(info.row.original.asset_name, "qwerty")
                    setAllocate(info.row.original.id, true)
                  }
                >
                  <UserCheck className="social-btn red-combo" />
                </Button>
              </TooltipComponent>
            }
          />
        ),
      }),
    ],
    [checkPermission, rows.length, pageNo, pageSize]
  );

  return (
    <>
      <Col md={12} data-aos={"fade-up"}>
        <Helmet>
          <title>All Approved Assets · CMS Electricals</title>
        </Helmet>
        <CustomTable
          id={"approved_assets"}
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
              setSearchText={setSearch}
              button={{ show: false }}
              userPermission={checkPermission}
            />
          )}
          tableTitleComponent={
            <div>
              <UserPlus /> <strong>approved assets</strong>
            </div>
          }
        />

        <Formik
          enableReinitialize={true}
          initialValues={{
            user_id: "",
            notes: "",
          }}
          validationSchema={addUserIdSchema}
          onSubmit={handleSubmit}
        >
          {(props) => (
            <Modaljs
              open={Allocate}
              size={"md"}
              closebtn={"Cancel"}
              Savebtn={"Assign"}
              close={() => setAllocate(false)}
              formikProps={props}
              title={`Assign to User (${Allocate})`}
            >
              <Form.Group>
                <Form.Label>
                  {t("Select Users")}{" "}
                  <span className="text-danger fw-bold">*</span>
                </Form.Label>
                <Select
                  menuPosition="fixed"
                  name="user_id"
                  value={props.values.user_id}
                  onChange={(val) => props.setFieldValue("user_id", val)}
                  options={assignUserData?.map((user) => ({
                    value: user.id,
                    label: user.name,
                    image: user.image
                      ? `${process.env.REACT_APP_API_URL}${user.image}`
                      : null,
                  }))}
                  components={{ Option: UserOption }}
                  isClearable
                />
                <ErrorMessage
                  name="user_id"
                  component="small"
                  className="text-danger"
                />
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Label>{t("Type Notes")}</Form.Label>
                <TextareaAutosize
                  minRows={2}
                  className="edit-textarea"
                  name={"notes"}
                  value={props.values.notes}
                  onChange={props.handleChange}
                />
              </Form.Group>
            </Modaljs>
          )}
        </Formik>
      </Col>
      <ConfirmAlert
        size={"sm"}
        deleteFunction={handleDelete}
        hide={setShowDelete}
        show={showDelete}
        title={"Confirm Delete"}
        description={"Are you sure you want to delete this!!"}
      />
      <ConfirmAlert
        size={"sm"}
        deleteFunction={handleApproveReject}
        hide={setShowReject}
        show={showReject}
        title={"Confirm reject"}
        description={"Are you sure you want to reject this!!"}
      />
    </>
  );
};

export default ApprovedAssets;
