import React, { useEffect, useMemo, useState } from "react";
import { Col, Form } from "react-bootstrap";
import { getAllAssets, sendToRepair } from "../../services/contractorApi";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { Formik } from "formik";
import Modaljs from "../../components/Modal";
import TextareaAutosize from "react-textarea-autosize";
import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate, useSearchParams } from "react-router-dom";
import ActionButtons from "../../components/DataTable/ActionButtons";
import StatusChip from "../../components/StatusChip";
import CustomTable from "../../components/DataTable/CustomTable";
import TableHeader from "../../components/DataTable/TableHeader";
import { UserPlus } from "lucide-react";
import { selectUser } from "../../features/auth/authSlice";
import { useSelector } from "react-redux";
import { serialNumber } from "../../utils/helper";
import { useTranslation } from "react-i18next";

const ScrapAssets = ({ checkPermission }) => {
  const columnHelper = createColumnHelper();
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const { userPermission } = useSelector(selectUser);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [repairAlertAndId, setRepairAlertAndId] = useState("");
  const [scrap, setScrap] = useState(false);
  const { t } = useTranslation();
  const fetchAllAssignedAssetData = async () => {
    const isDropdown = "1";
    const status = "6";
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

  useEffect(() => {
    fetchAllAssignedAssetData();
  }, [search, pageNo, pageSize]);

  const handleSendToRepair = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      id: repairAlertAndId,
      status: scrap ? "6" : "5",
      description: values.description,
    };

    const res = await sendToRepair(sData);
    if (res.status) {
      toast.success(res.message);
      setRows((prev) => prev.filter((data) => data.id !== repairAlertAndId));
    } else {
      toast.error(res.message);
    }
    setRepairAlertAndId("");
    setScrap();
    resetForm();
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
        cell: (info) => <StatusChip status="scrap" />,
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
                    `/AssignedAssets/timeline-assigned-assets/${info.row.original.id}`
                  ),
              },
            }}
          />
        ),
      }),
    ],
    [checkPermission, rows.length, pageNo, pageSize]
  );

  return (
    <Col md={12} data-aos={"fade-up"}>
      <Helmet>
        <title>Scrap Assets · CMS Electricals</title>
      </Helmet>
      <CustomTable
        id={"scrap_assets"}
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
            <UserPlus /> <strong>scrap assets</strong>
          </div>
        }
      />

      <Formik
        enableReinitialize={true}
        initialValues={{
          user_id: "",
          notes: "",
        }}
        // validationSchema={addUserIdSchema}
        onSubmit={handleSendToRepair}
      >
        {(props) => (
          <Modaljs
            open={repairAlertAndId}
            size={"md"}
            closebtn={"Cancel"}
            Savebtn={"send"}
            close={() => setRepairAlertAndId(false)}
            formikProps={props}
            title={scrap ? "send to scrap" : "send to repair"}
          >
            <Form.Group className="mt-3">
              <Form.Label>Type description</Form.Label>
              <TextareaAutosize
                minRows={2}
                className="edit-textarea"
                name={"description"}
                value={props.values.description}
                onChange={props.handleChange}
              />
            </Form.Group>
          </Modaljs>
        )}
      </Formik>
    </Col>
  );
};

export default ScrapAssets;
