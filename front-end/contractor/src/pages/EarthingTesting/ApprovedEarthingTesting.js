import React, { useState, useEffect, Fragment, useMemo } from "react";
import { Col, Form, Row } from "react-bootstrap";
import Modaljs from "../../components/Modal";
import { approveRejectEarthingTestingById } from "../../services/contractorApi";
import { toast } from "react-toastify";
import ConfirmAlert from "../../components/ConfirmAlert";
import { getAllEarthingTesting } from "../../services/contractorApi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  getAdminAllEnergy,
  PostAssignEarthingTesting,
} from "../../services/authapi";
import { Formik } from "formik";
import { addSurveyAssignSchema } from "../../utils/formSchema";
import ActionButtons from "../../components/DataTable/ActionButtons";
import { getDateValue, serialNumber } from "../../utils/helper";
import { UserDetails } from "../../components/ItemDetail";
import { createColumnHelper } from "@tanstack/react-table";
import CustomTable from "../../components/DataTable/CustomTable";
import TableHeader from "../../components/DataTable/TableHeader";
import { FileText } from "lucide-react";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import { BsFillPersonCheckFill } from "react-icons/bs";
import MyInput from "../../components/MyInput";
import StatusChip from "../../components/StatusChip";

const ApprovedEarthingTesting = ({ checkPermission }) => {
  const columnHelper = createColumnHelper();
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || "10";
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const { userPermission } = useSelector(selectUser);
  const [earthingTestingId, setEarthingTestingId] = useState("");
  const [showReject, setShowReject] = useState(false);
  const [showRole, setShowRole] = useState();
  const [assign, setAssign] = useState("");
  const [allEnergy, setAllEnergy] = useState([]);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const fetchAllAssetsRepairRequireData = async () => {
    const status = 2;
    const res = await getAllEarthingTesting({
      search,
      pageSize,
      pageNo,
      status,
    });
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

  const handleApproveReject = async () => {
    const status = "3";
    const res = await approveRejectEarthingTestingById(
      status,
      earthingTestingId
    );

    if (res.status) {
      toast.success(res.message);
      setRows((prev) => prev.filter((itm) => itm.id !== earthingTestingId));
    } else {
      toast.error(res.message);
    }

    setEarthingTestingId("");
    setShowReject(false);
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
      columnHelper.accessor("complaint_unique_id", {
        header: t("Complaint id"),
        cell: (info) => info.getValue() || "-",
      }),
      columnHelper.accessor("complaint_type_name", {
        header: t("Complaint Type"),
        cell: (info) => info.getValue() || "-",
      }),
      columnHelper.accessor("outletData", {
        header: t("Outlet Data"),
        cell: (info) =>
          info.row.original?.outletData?.map((itm, idx) => {
            return (
              <>
                {itm.outlet_name}
                {idx < info.row.original?.outletData?.length - 1 && ", "}
              </>
            );
          }),
      }),
      columnHelper.accessor("user_data", {
        header: t("User Data"),
        cell: (info) => (
          <div className="d-align">
            {info.row.original?.user_data.slice(0, 5).map((user, index) => (
              <Fragment key={index}>
                <UserDetails
                  img={user?.image}
                  name={user?.name}
                  id={user?.user_id}
                  unique_id={user?.employee_id}
                />
              </Fragment>
            ))}
          </div>
        ),
      }),
      columnHelper.accessor("expire_date", {
        header: t("Expiry Date"),
        cell: (info) => getDateValue(info.row.original.expire_date),
      }),
      columnHelper.accessor("status", {
        header: t("status"),
        cell: (info) => <StatusChip status={"Approved"} />,
      }),
      columnHelper.accessor("action", {
        header: "Action",
        cell: (info) => (
          <ActionButtons
            actions={{
              view: {
                show: checkPermission?.view,
                action: () =>
                  navigate(`/earthing-testing/view`, {
                    state: {
                      id: info.row.original.id,
                    },
                  }),
              },
              edit: {
                show: checkPermission?.update,
                action: () =>
                  navigate(`/earthing-testing/create/${info.row.original.id}`),
              },
              reject: {
                show: checkPermission?.update,
                action: () => {
                  setEarthingTestingId(`${info.row.original.id}`);
                  setShowReject(true);
                },
              },
              approve: {
                show: checkPermission?.update,
                icon: BsFillPersonCheckFill,
                tooltipTitle: "Allocate",
                action: () => {
                  setAssign(`${info.row.original.id}`);
                  setShowRole(true);
                },
              },
            }}
          />
        ),
      }),
    ],
    [checkPermission, rows.length, pageNo, pageSize]
  );

  useEffect(() => {
    fetchAllAssetsRepairRequireData();
  }, [search, pageNo, pageSize]);

  const fetchAllEnergyData = async () => {
    const res = await getAdminAllEnergy();
    if (res.status) {
      setAllEnergy(res.data);
    } else {
      setAllEnergy([]);
    }
  };

  useEffect(() => {
    fetchAllEnergyData();
  }, [search, pageNo, pageSize]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    values["id"] = assign;

    // return console.log("values", values);

    const res = await PostAssignEarthingTesting(values);
    if (res.status) {
      fetchAllAssetsRepairRequireData();
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    resetForm();
    setSubmitting(false);
    setShowRole(false);
  };
  return (
    <>
      <Col md={12}>
        <CustomTable
          id={"approved_earthing_testing"}
          isLoading={isLoading}
          rows={rows || []}
          columns={columns}
          pagination={{
            pageNo,
            pageSize,
            totalData,
          }}
          excelAction={false}
          pdfAction={false}
          align={"bottom"}
          apiForExcelPdf={getAllEarthingTesting}
          customHeaderComponent={() => (
            <TableHeader
              userPermission={checkPermission}
              setSearchText={setSearch}
              button={{ show: false }}
            />
          )}
          tableTitleComponent={
            <div>
              <FileText /> <strong>Approved Earthing Testing</strong>
            </div>
          }
        />

        <ConfirmAlert
          size={"sm"}
          deleteFunction={handleApproveReject}
          hide={setShowReject}
          show={showReject}
          title={"Confirm reject"}
          description={"Are you sure you want to reject this!!"}
        />
      </Col>
      <Formik
        enableReinitialize={true}
        initialValues={{
          assign_to: "",
        }}
        validationSchema={addSurveyAssignSchema}
        onSubmit={handleSubmit}
      >
        {(props) => (
          <Modaljs
            formikProps={props}
            open={showRole}
            size={"sm"}
            closebtn={"Cancel"}
            Savebtn={"Assign"}
            close={() => setShowRole(false)}
            title={"Create Assign"}
          >
            <Row className="g-2">
              <Form.Group as={Col} md="12">
                <MyInput
                  isRequired
                  menuPosition="fixed"
                  menuPortalTarget={false}
                  name={"assign_to"}
                  formikProps={props}
                  label={"Select Energy Company"}
                  customType={"select"}
                  selectProps={{
                    data: allEnergy.map((data) => ({
                      label: data?.name,
                      value: data?.user_id,
                    })),
                  }}
                />
              </Form.Group>
            </Row>
          </Modaljs>
        )}
      </Formik>
    </>
  );
};

export default ApprovedEarthingTesting;
