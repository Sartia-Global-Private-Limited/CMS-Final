import React, { useEffect, useMemo, useState } from "react";
import { Button, Col, Form } from "react-bootstrap";
import { getAllAssets, sendToRepair } from "../../services/contractorApi";
import { Helmet } from "react-helmet";
import TooltipComponent from "../../components/TooltipComponent";
import { HiOutlineWrenchScrewdriver } from "react-icons/hi2";
import { toast } from "react-toastify";
import { Formik } from "formik";
import Modaljs from "../../components/Modal";
import TextareaAutosize from "react-textarea-autosize";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createColumnHelper } from "@tanstack/react-table";
import { selectUser } from "../../features/auth/authSlice";
import { useSelector } from "react-redux";
import StatusChip from "../../components/StatusChip";
import ActionButtons from "../../components/DataTable/ActionButtons";
import { UserPlus } from "lucide-react";
import CustomTable from "../../components/DataTable/CustomTable";
import TableHeader from "../../components/DataTable/TableHeader";
import { serialNumber } from "../../utils/helper";

const AssignedAssets = ({ checkPermission }) => {
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
  const [repairAlertAndId, setRepairAlertAndId] = useState("");
  const [repairName, setRepairName] = useState("");

  const fetchAllAssignedAssetData = async () => {
    const isDropdown = "1";
    const status = "4";
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
      status: "5",
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
        cell: (info) => <StatusChip status="Assigned" />,
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
              edit: {
                show: checkPermission?.update,
                action: () =>
                  navigate(`/AllAssets/CreateAssets/${info.row.original.id}`),
              },
            }}
            custom={
              <>
                <TooltipComponent align="left" title={"send to repair"}>
                  <Button
                    className={`view-btn`}
                    variant="light"
                    onClick={() => {
                      setRepairAlertAndId(info.row.original.id);
                      setRepairName(info.row.original.asset_name);
                    }}
                  >
                    <HiOutlineWrenchScrewdriver
                      className={`social-btn red-combo`}
                    />
                  </Button>
                </TooltipComponent>
              </>
            }
          />
        ),
      }),
    ],
    [checkPermission, rows.length, pageNo, pageSize]
  );

  return (
    <Col md={12} data-aos={"fade-up"}>
      <Helmet>
        <title>All Assigned Assets · CMS Electricals</title>
      </Helmet>
      <CustomTable
        id={"assigned_assets"}
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
            <UserPlus /> <strong>assigned assets</strong>
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
            title={`send to repair (${repairName})`}
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

export default AssignedAssets;
