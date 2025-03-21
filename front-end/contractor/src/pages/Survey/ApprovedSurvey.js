import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ActionButtons from "../../components/DataTable/ActionButtons";
import StatusChip from "../../components/StatusChip";
import { createColumnHelper } from "@tanstack/react-table";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import CustomTable from "../../components/DataTable/CustomTable";
import TableHeader from "../../components/DataTable/TableHeader";
import { FileText } from "lucide-react";
import { toast } from "react-toastify";
import { BsFillPersonCheckFill } from "react-icons/bs";
import { getDateValue, serialNumber } from "../../utils/helper";
import {
  getAdminAllEnergy,
  getAllRequestedSurvey,
  PostAssignSurvey,
} from "../../services/authapi";
import { Formik } from "formik";
import { addSurveyAssignSchema } from "../../utils/formSchema";
import Modaljs from "../../components/Modal";
import MyInput from "../../components/MyInput";
import { Col, Form, Row } from "react-bootstrap";

const ApprovedSurvey = ({ checkPermission }) => {
  const columnHelper = createColumnHelper();
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || "10";
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [allEnergy, setAllEnergy] = useState([]);
  const [assign, setAssign] = useState("");
  const [showModel, setShowModel] = useState();
  const { userPermission, user } = useSelector(selectUser);
  const { t } = useTranslation();

  const fetchSurveyData = async () => {
    const status = 2;
    const res = await getAllRequestedSurvey(search, pageSize, pageNo, status);
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

  const fetchAllEnergyData = async () => {
    const res = await getAdminAllEnergy();
    if (res.status) {
      setAllEnergy(res.data);
    } else {
      setAllEnergy([]);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    values["survey_id"] = assign;

    // return console.log("values", values);

    const res = await PostAssignSurvey(values);
    if (res.status) {
      fetchSurveyData();
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    resetForm();
    setSubmitting(false);
    setShowModel(false);
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
      columnHelper.accessor("title", {
        header: t("Title"),
        cell: (info) => info.getValue() || "-",
      }),
      columnHelper.accessor("created_at", {
        header: t("Created at"),
        cell: (info) => getDateValue(info.getValue()),
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
                icon: BsFillPersonCheckFill,
                tooltipTitle: "Assign",
                className: "danger-combo",
                action: () => {
                  setAssign(info.row.original?.survey_id);
                  setShowModel(true);
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
    fetchSurveyData();
  }, [search, pageNo, pageSize]);

  useEffect(() => {
    if (showModel) {
      fetchAllEnergyData();
    }
  }, [showModel]);

  return (
    <>
      <Helmet>
        <title>Approved Survey · CMS Electricals</title>
      </Helmet>
      <CustomTable
        id={"approved_survey"}
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
        apiForExcelPdf={getAllRequestedSurvey}
        customHeaderComponent={() => (
          <TableHeader
            userPermission={checkPermission}
            setSearchText={setSearch}
            button={{
              show: false,
            }}
          />
        )}
        tableTitleComponent={
          <div>
            <FileText /> <strong>Approved Survey</strong>
          </div>
        }
      />
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
            open={showModel}
            size={"sm"}
            closebtn={"Cancel"}
            Savebtn={"Assign"}
            close={() => setShowModel(false)}
            title={"Create Assign"}
          >
            <Row className="g-2">
              <Form.Group as={Col} md="12">
                <MyInput
                  isRequired
                  name={"assign_to"}
                  formikProps={props}
                  menuPosition="fixed"
                  menuPortalTarget={false}
                  label={"Select Energy Company"}
                  customType={"select"}
                  selectProps={{
                    data: allEnergy?.map((data) => ({
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

export default ApprovedSurvey;
