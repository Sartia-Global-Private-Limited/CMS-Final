import React, { useEffect, useMemo, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import Modaljs from "../../components/Modal";
import {
  getAdminAllTaskCategory,
  getAdminCreateTaskCategory,
  getAdminDeleteCategory,
  getAdminUpdateTaskCategory,
} from "../../services/authapi";
import moment from "moment";
import ConfirmAlert from "../../components/ConfirmAlert";
import { Formik } from "formik";
import { addTaskCategorySchema } from "../../utils/formSchema";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { createColumnHelper } from "@tanstack/react-table";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { selectUser } from "../../features/auth/authSlice";
import { useSelector } from "react-redux";
import ActionButtons from "../../components/DataTable/ActionButtons";
import CustomTable from "../../components/DataTable/CustomTable";
import TableHeader from "../../components/DataTable/TableHeader";
import { UserPlus } from "lucide-react";
import MyInput from "../../components/MyInput";
import { findMatchingPath, serialNumber } from "../../utils/helper";

const TaskCategory = () => {
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
  const [viewCompany, setviewCompany] = useState(false);
  const [edit, setEdit] = useState({});
  const [idToDelete, setIdToDelete] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const { pathname } = useLocation();
  const [matchingPathObject, setMatchingPathObject] = useState(null);

  const fetchTaskCategoryData = async () => {
    const res = await getAdminAllTaskCategory({ search, pageSize, pageNo });
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

  const handleEdit = async (task) => {
    setEdit(task);
    setviewCompany(true);
  };

  const handleDelete = async () => {
    const res = await getAdminDeleteCategory(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setRows((prev) => prev.filter((itm) => itm.id !== +idToDelete));
      fetchTaskCategoryData();
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    // return console.log(values)

    if (edit.id) {
      values["id"] = edit.id;
    }
    const res = edit.id
      ? await getAdminUpdateTaskCategory(values)
      : await getAdminCreateTaskCategory(values);
    if (res.status) {
      fetchTaskCategoryData();
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    resetForm();
    setSubmitting(false);
    setviewCompany(false);
  };

  // for role and permissions
  useEffect(() => {
    if (userPermission) {
      const result = findMatchingPath(userPermission, pathname);
      setMatchingPathObject(result);
    }
  }, [userPermission, pathname, searchParams, navigate]);

  const checkPermission = matchingPathObject;

  useEffect(() => {
    fetchTaskCategoryData();
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
        header: "task category",
      }),
      columnHelper.accessor("created_at", {
        header: "created date",
        cell: (info) =>
          moment(info.row.original.created_at).format("DD-MM-YYYY"),
      }),
      columnHelper.accessor("status", {
        header: "status",
        cell: (info) => (
          <div
            className={`text-${
              info.row.original?.status == 1 ? "green" : "danger"
            }`}
          >
            {info.row.original?.status == 1 ? "Active" : "Inactive"}{" "}
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
                  navigate(`/create/task-category/${info.row.original.id}`),
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
    [checkPermission, rows.length, pageNo, pageSize]
  );

  return (
    <>
      <Helmet>
        <title>Task Manager · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CustomTable
          id={"task_category"}
          isLoading={isLoading}
          rows={rows || []}
          columns={columns}
          align={"bottom"}
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
                to: `/create/task-category/new`,
                title: "Create task category",
              }}
              // extraComponent={
              //   <Button
              //     variant="success"
              //     onClick={() => {
              //       setEdit({});
              //       setviewCompany(true);
              //     }}
              //   >
              //     Create
              //   </Button>
              // }
            />
          )}
          tableTitleComponent={
            <div>
              <UserPlus /> <strong>task category</strong>
            </div>
          }
        />

        <Formik
          enableReinitialize={true}
          initialValues={{
            id: edit.id || "",
            name: edit.name || "",
            status: edit.status || "0",
          }}
          validationSchema={addTaskCategorySchema}
          onSubmit={handleSubmit}
        >
          {(props) => (
            <Modaljs
              formikProps={props}
              open={viewCompany}
              size={"sm"}
              closebtn={"Cancel"}
              Savebtn={"Submit"}
              close={() => setviewCompany(false)}
              title={t("Create Task Category")}
            >
              <Row className="g-2">
                <Form.Group as={Col} md={12}>
                  <MyInput
                    isRequired
                    name={"name"}
                    formikProps={props}
                    label={t("Name")}
                  />
                </Form.Group>
                <Form.Group as={Col} md={12}>
                  <MyInput
                    isRequired
                    menuPosition="fixed"
                    menuPortalTarget={false}
                    name={"status"}
                    formikProps={props}
                    label={t("Select Status")}
                    customType={"select"}
                    selectProps={{
                      data: [
                        { label: "Active", value: "1" },
                        { label: "Inactive", value: "0" },
                      ],
                    }}
                  />
                </Form.Group>
              </Row>
            </Modaljs>
          )}
        </Formik>

        <ConfirmAlert
          size={"sm"}
          deleteFunction={handleDelete}
          hide={setShowAlert}
          show={showAlert}
          title={"Confirm Delete"}
          description={"Are you sure you want to delete this!!"}
        />
      </Col>
    </>
  );
};

export default TaskCategory;
