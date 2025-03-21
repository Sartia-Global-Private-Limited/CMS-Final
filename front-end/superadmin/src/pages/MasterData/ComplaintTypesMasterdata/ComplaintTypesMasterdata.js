import React, { useEffect, useMemo, useState } from "react";
import "react-best-tabs/dist/index.css";
import { Helmet } from "react-helmet";
import {
  getAdminAllEnergy,
  getAdminAllTypesComplaint,
  getAdminCreateTypesComplaint,
  getAdminUpdateTypesComplaint,
} from "../../../services/authapi";
import { toast } from "react-toastify";
import moment from "moment/moment";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/auth/authSlice";
import { createColumnHelper } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import TableHeader from "../../../components/DataTable/TableHeader";
import ActionButtons from "../../../components/DataTable/ActionButtons";
import CustomTable from "../../../components/DataTable/CustomTable";
import { serialNumber } from "../../../utils/helper";

const ComplaintTypesMasterdata = ({ checkPermission }) => {
  let { pathname } = useLocation();
  const { user } = useSelector(selectUser);
  const [companyData, setCompanyData] = useState([]);
  const [complaint, setComplaint] = useState(false);
  const [edit, setEdit] = useState({});

  const columnHelper = createColumnHelper();
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || "10";
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { userPermission } = useSelector(selectUser);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const fetchTypesComplaintData = async () => {
    const res = await getAdminAllTypesComplaint(search, pageSize, pageNo);
    if (res.status) {
      setRows(res.data);
      setTotalData(res?.pageDetails?.total);
    } else {
      setRows([]);
      setTotalData(0);
    }
    setIsLoading(false);
  };

  const fetchMyCompaniesData = async () => {
    const res = await getAdminAllEnergy();
    if (res.status) {
      const rData = res.data.map((itm) => {
        return {
          value: itm.energy_company_id,
          label: itm.name,
        };
      });
      setCompanyData(rData);
    } else {
      setCompanyData([]);
    }
  };

  const handleEdit = async (complaint) => {
    setEdit(complaint);
    setComplaint(true);
  };

  useEffect(() => {
    fetchMyCompaniesData();
    fetchTypesComplaintData();
  }, [search, pageNo, pageSize]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      complaint_type_name: values.complaint_type_name,
      energy_company_id: values.energy_company_id.value,
    };

    // const params = await checkPermission({
    //   user_id: user.id,
    //   pathname: `/${pathname.split("/")[1]}`,
    // });
    // params["action"] = edit.id ? UPDATED : CREATED;

    if (edit?.id) {
      sData["id"] = edit?.id;
    }
    // console.log('sData', sData)
    const res = edit?.id
      ? await getAdminUpdateTypesComplaint(sData)
      : await getAdminCreateTypesComplaint(sData);
    if (res.status) {
      fetchTypesComplaintData();
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    resetForm();
    setSubmitting(false);
    setComplaint(false);
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
      columnHelper.accessor("complaint_type_name", {
        header: t("Complaint Type"),
      }),
      columnHelper.accessor("energy_company_name", {
        header: t("Company Name"),
      }),
      columnHelper.accessor("created_at", {
        header: t("Date"),
        cell: (info) =>
          moment(info?.row?.original?.created_at).format(
            "DD/MM/YYYY | h:mm:ss a"
          ),
      }),
      columnHelper.accessor("action", {
        header: t("Action"),
        cell: (info) => (
          <ActionButtons
            actions={{
              edit: {
                show: checkPermission?.update,
                action: () =>
                  navigate(`/ComplaintTypes/create/${info.row.original.id}`),
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
        <title>Complaint Types · CMS Electricals</title>
      </Helmet>

      <CustomTable
        id={"complaint_types"}
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
        customHeaderComponent={() => (
          <TableHeader
            userPermission={checkPermission}
            setSearchText={setSearch}
            button={{
              noDrop: true,
              to: `/ComplaintTypes/create/new`,
              title: "Create",
            }}
          />
        )}
        tableTitleComponent={
          <div>
            <strong>All Complaint Types</strong>
          </div>
        }
      />

      {/* <Formik
        enableReinitialize={true}
        initialValues={{
          id: edit?.id || "",
          complaint_type_name: edit?.complaint_type_name || "",
          energy_company_id: edit?.energy_company_id
            ? {
                label: edit?.energy_company_name,
                value: edit?.energy_company_id,
              }
            : "",
        }}
        validationSchema={addTypesComplaintSchema}
        onSubmit={handleSubmit}
      >
        {(props) => (
          <Modaljs
            formikProps={props}
            open={complaint}
            size={"md"}
            closebtn={"Cancel"}
            Savebtn={edit?.id ? "Update" : "Save"}
            close={() => setComplaint(false)}
            title={
              edit?.id ? "Update Complaint Types" : "Create Complaint Types"
            }
          >
            <Form.Group className="mb-2" as={Col} md={12}>
              <Form.Label>
                Energy Company Name <span className="text-danger">*</span>
              </Form.Label>
              <Select
                menuPosition="fixed"
                className="text-primary"
                name="energy_company_id"
                value={props.values.energy_company_id}
                onChange={(val) =>
                  props.setFieldValue("energy_company_id", val)
                }
                options={companyData}
              />
              <ErrorMessage
                name="energy_company_id"
                component="small"
                className="text-danger"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>
                Complaint Type Name <span className="text-danger">*</span>
              </Form.Label>
              <TextareaAutosize
                onChange={props.handleChange}
                value={props.values.complaint_type_name}
                name="complaint_type_name"
                className="edit-textarea"
              />
              <ErrorMessage
                name="complaint_type_name"
                component="small"
                className="text-danger"
              />
            </Form.Group>
          </Modaljs>
        )}
      </Formik> */}
    </>
  );
};

export default ComplaintTypesMasterdata;
