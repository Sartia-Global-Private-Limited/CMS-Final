import React, { useEffect, useMemo, useState } from "react";
import CustomTable from "../../components/DataTable/CustomTable";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { createColumnHelper } from "@tanstack/react-table";
import TableHeader from "../../components/DataTable/TableHeader";
import { selectUser } from "../../features/auth/authSlice";
import { useSelector } from "react-redux";
import {
  changeEmployeeStatus,
  deleteAdminCompanies,
  deleteEmployee,
  getAdminAllHREmployees,
  getAllRolesForDropDown,
  importEmployeeData,
} from "../../services/authapi";
import { useTranslation } from "react-i18next";
import ActionButtons from "../../components/DataTable/ActionButtons";
import { toast } from "react-toastify";
import ConfirmAlert from "../../components/ConfirmAlert";
import { UserPlus } from "lucide-react";
import Switch from "../../components/Switch";
import { Formik } from "formik";
import { addRemarkSchema, importEmployeeSchema } from "../../utils/formSchema";
import Modaljs from "../../components/Modal";
import { Col, Form, Row } from "react-bootstrap";
import TextareaAutosize from "react-textarea-autosize";
import { BsDownload } from "react-icons/bs";
import ReactDropzone from "../../components/ReactDropzone";
import { UserDetail } from "../../components/ItemDetail";
import {
  DOWNLOAD_FILE_WITH_BACKEND,
  findMatchingPath,
  serialNumber,
} from "../../utils/helper";
import MyInput from "../../components/MyInput";

const Employees = () => {
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
  const { userPermission } = useSelector(selectUser);
  const { pathname } = useLocation();
  const [matchingPathObject, setMatchingPathObject] = useState(null);
  const [showImports, setShowImports] = useState(false);
  const { user } = useSelector(selectUser);
  const [refresh, setRefresh] = useState(false);
  const [remarks, setRemarks] = useState(false);
  const [edit, setEdit] = useState({});
  const [allRoles, setAllRoles] = useState([]);

  const fetchAllHrEmployeesData = async () => {
    const res = await getAdminAllHREmployees({ search, pageSize, pageNo });
    if (res.status) {
      setRows(res.data);
      setTotalData(res?.pageDetails?.total);
    } else {
      setRows([]);
      setTotalData(0);
    }
    setIsLoading(false);
  };

  const fetchAllRolesData = async () => {
    const res = await getAllRolesForDropDown();
    if (res.status) {
      const rData = res.data
        .filter((itm) => itm.id !== 1)
        .map((itm) => {
          return {
            value: itm.id,
            label: itm.name,
          };
        });
      setAllRoles(rData);
    } else {
      setAllRoles([]);
    }
  };

  const handleRemarks = (id, status) => {
    setEdit({ id, status });
    setRemarks(true);
  };

  const handleChangeStatus = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      id: edit.id,
      remark: values.remark,
      updated_by: user.id,
      status: +edit.status === 1 ? 0 : 1,
    };
    // return console.log('changeStatus', sData)
    const res = await changeEmployeeStatus(sData);
    if (res.status) {
      toast.success(res.message);
      fetchAllHrEmployeesData();
    } else {
      toast.error(res.message);
    }
    setRefresh(true);
    setRemarks(false);
    resetForm();
    setSubmitting(false);
  };

  const handleUploadEmployees = async (
    values,
    { setSubmitting, resetForm }
  ) => {
    const formData = new FormData();
    formData.append("role_id", values.role_id);
    formData.append("data", values.data);
    const res = await importEmployeeData(user.id, formData);
    if (res.status) {
      toast.success(res.message);
      fetchAllHrEmployeesData();
    } else {
      toast.error(res.message);
    }
    setShowImports(false);
    resetForm();
    setSubmitting(false);
  };

  const handleDelete = async () => {
    const res = await deleteEmployee(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setRows((prev) => prev.filter((itm) => itm.id !== +idToDelete));
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
  };

  // for role and permissions
  useEffect(() => {
    if (userPermission) {
      const result = findMatchingPath(userPermission, pathname);
      setMatchingPathObject(result);
    }
  }, [userPermission, pathname, searchParams, navigate]);

  const checkPermission = matchingPathObject;

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
        header: t("Employee"),
        cell: (info) => (
          <UserDetail
            img={info.row.original?.image}
            name={info.row.original?.name}
            id={info.row.original?.id}
            unique_id={info.row.original?.employee_id}
            login_id={user.id}
          />
        ),
      }),
      columnHelper.accessor("email", {
        header: t("Email"),
      }),
      columnHelper.accessor("mobile", {
        header: t("Mobile"),
      }),
      columnHelper.accessor("joining_date", {
        header: t("Joined"),
      }),
      columnHelper.accessor("company_type_name", {
        header: t("Status"),
        cell: (info) => (
          <Switch
            checked={+info.row.original.status === 1 ? true : false}
            onChange={() =>
              handleRemarks(info.row.original.id, info.row.original.status)
            }
          />
        ),
      }),
      columnHelper.accessor("role_name", {
        header: t("Role Name"),
      }),
      columnHelper.accessor("action", {
        header: t("Action"),
        cell: (info) => (
          <ActionButtons
            actions={{
              view: {
                show: checkPermission?.view,
                action: () =>
                  navigate(`/Employees/ViewEmployee/${info.row.original?.id}`, {
                    state: info.row.original,
                  }),
              },
              edit: {
                show: checkPermission?.update,
                action: () =>
                  navigate(`/Employees/AddEmployee/${info.row.original?.id}`),
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

  useEffect(() => {
    fetchAllHrEmployeesData();
    fetchAllRolesData();
  }, [search, pageNo, pageSize, refresh]);

  return (
    <>
      <CustomTable
        id={"my_employee"}
        userPermission={checkPermission}
        isLoading={isLoading}
        rows={rows || []}
        columns={columns}
        pagination={{
          pageNo,
          pageSize,
          totalData,
        }}
        align={"bottom"}
        excelAction={true}
        pdfAction={true}
        apiForExcelPdf={getAdminAllHREmployees}
        customHeaderComponent={() => (
          <TableHeader
            userPermission={checkPermission}
            setSearchText={setSearch}
            openImport={() => setShowImports(true)}
            button={{
              // noDrop: true,
              to: `/Employees/AddEmployee/new`,
              title: "Create",
            }}
          />
        )}
        tableTitleComponent={
          <div>
            <UserPlus /> <strong>Employees</strong>
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

      <Formik
        enableReinitialize={true}
        initialValues={{
          remark: "",
        }}
        validationSchema={addRemarkSchema}
        onSubmit={handleChangeStatus}
      >
        {(props) => (
          <Modaljs
            formikProps={props}
            open={remarks}
            size={"md"}
            closebtn={"Cancel"}
            Savebtn={"Save"}
            close={() => setRemarks(false)}
            title={"Add Remark"}
          >
            <Form.Group>
              <TextareaAutosize
                minRows={3}
                placeholder="type remarks..."
                onChange={props.handleChange}
                name="remark"
                className="edit-textarea"
                onBlur={props.handleBlur}
                isInvalid={Boolean(props.touched.remark && props.errors.remark)}
              />
              <small className="text-danger">{props.errors.remark}</small>
            </Form.Group>
          </Modaljs>
        )}
      </Formik>

      <Formik
        enableReinitialize={true}
        initialValues={{
          role_id: "",
          data: "",
        }}
        validationSchema={importEmployeeSchema}
        onSubmit={handleUploadEmployees}
      >
        {(props) => (
          <Modaljs
            formikProps={props}
            open={showImports}
            newButtonType={"button"}
            newButtonOnclick={() =>
              DOWNLOAD_FILE_WITH_BACKEND("import_users_sample_file.xlsx")
            }
            size={"md"}
            closebtn={"Cancel"}
            Savebtn={"Save"}
            close={() => setShowImports(false)}
            newButtonClass={"success-combo"}
            newButtonTitle={<BsDownload />}
            title={"Import Employees"}
          >
            <Row className="g-3 align-items-center">
              <Form.Group as={Col} md={12}>
                <MyInput
                  isRequired
                  menuPortalTarget={false}
                  menuPosition="fixed"
                  label={t("Role")}
                  name={"role_id"}
                  customType={"select"}
                  formikProps={props}
                  selectProps={{
                    data: allRoles,
                  }}
                />
              </Form.Group>
              <Form.Group as={Col} md={12}>
                <MyInput
                  isRequired
                  name={"data"}
                  formikProps={props}
                  label={"Upload Employees"}
                  customType={"fileUpload"}
                />
              </Form.Group>
            </Row>
          </Modaljs>
        )}
      </Formik>
    </>
  );
};

export default Employees;
