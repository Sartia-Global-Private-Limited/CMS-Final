import React, { useEffect, useMemo, useState } from "react";
import { Col, Form, Spinner } from "react-bootstrap";
import { Formik } from "formik";
import Select from "react-select";
import moment from "moment";
import {
  getAdminAllPendingComplaint,
  getAdminZone,
  getRoOnZoneId,
} from "../../../services/authapi";
import { toast } from "react-toastify";
import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/auth/authSlice";
import { useTranslation } from "react-i18next";
import ActionButtons from "../../../components/DataTable/ActionButtons";
import CustomTable from "../../../components/DataTable/CustomTable";
import TableHeader from "../../../components/DataTable/TableHeader";

const PendingComplaint = () => {
  const [allZones, setAllZones] = useState([]);
  const [allRo, setAllRo] = useState([]);
  const columnHelper = createColumnHelper();
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || "10";
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { userPermission } = useSelector(selectUser);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const fetchPendingData = async () => {
    const sData = {
      custom_date: "",
      regional_id: 0,
      zone_id: 0,
    };
    const res = await getAdminAllPendingComplaint(
      search,
      pageSize,
      pageNo,
      sData
    );
    if (res.status) {
      setRows(res.data);
      setTotalData(res?.pageDetails?.total);
    } else {
      setRows([]);
      setTotalData(0);
    }
    setIsLoading(false);
  };

  const handlerSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      custom_date: moment(values.custom_date).format("DD-MM-YYYY") || "",
      regional_id: values.regional_id.value,
      zone_id: values.zone_id.value,
    };
    // return console.log('sData', sData)
    const res = await getAdminAllPendingComplaint(
      search,
      pageSize,
      pageNo,
      sData
    );
    if (res.status) {
      setRows(res.data);
      setTotalData(res?.pageDetails?.total);
    } else {
      setRows([]);
      setTotalData(0);
    }
    setIsLoading(false);
  };

  const handleZoneChange = async (val, setFieldValue) => {
    if (setFieldValue) {
      setFieldValue("zone_id", val);
    }
    if (!val) return false;
    fetchRoData(val.value);
  };

  // Only Use for Zone Name
  const fetchZoneData = async () => {
    const res = await getAdminZone();
    if (res.status) {
      setAllZones(res.data);
      // setEdit
    } else {
      setAllZones([]);
    }
  };

  // Only Use for Regional Office
  const fetchRoData = async (zone_id) => {
    const res = await getRoOnZoneId(zone_id);
    if (res.status) {
      setAllRo(res.data);
    } else {
      setAllRo([]);
      toast.error(res.message);
    }
  };

  useEffect(() => {
    fetchPendingData();
    fetchZoneData();
  }, [search, pageSize, pageNo]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("sr_no", {
        header: t("Sr No."),
        cell: (info) => info.row.index + 1,
      }),
      columnHelper.accessor("ec_name", {
        header: t("energy company name"),
      }),
      columnHelper.accessor("complaint_unique_id", {
        header: t("complaint no."),
      }),
      columnHelper.accessor("complaint_type_name", {
        header: t("complaint type"),
      }),
      columnHelper.accessor("complaint_create_date", {
        header: t("date"),
      }),
      columnHelper.accessor("zone_name", {
        header: t("zone name"),
        cell: (info) => (
          <div>{info.row.original.zones?.map((item) => item.zone_name)}</div>
        ),
      }),
      columnHelper.accessor("regional_office_name", {
        header: t("regional office name"),
        cell: (info) => (
          <div>
            {info.row.original.regionalOffices?.map(
              (item) => item.regional_office_name
            )}
          </div>
        ),
      }),
      columnHelper.accessor("status", {
        header: t("status"),
        cell: (info) => <div className="text-success">pending</div>,
      }),
      columnHelper.accessor("action", {
        header: t("Action"),
        cell: (info) => (
          <ActionButtons
            actions={{
              view: {
                show: true,
                action: () =>
                  navigate(
                    `/AllComplaintsMasterdata/ViewUserComplaint/${info.row.original.id}`
                  ),
              },
            }}
          />
        ),
      }),
    ],
    [rows.length]
  );

  return (
    <Col md={12} data-aos={"fade-up"}>
      <Formik
        enableReinitialize={true}
        initialValues={{
          custom_date: "",
          regional_id: "",
          zone_id: "",
        }}
        // validationSchema={addComplaintSchema}
        onSubmit={handlerSubmit}
      >
        {(props) => (
          <Form
            onSubmit={props?.handleSubmit}
            className="d-flex align-items-end justify-content-between mb-3 gap-3"
          >
            <div className="d-flex align-items-end gap-3">
              <Form.Group>
                <Form.Label>Date</Form.Label>
                <Form.Control
                  value={props.values.custom_date}
                  type="date"
                  name={"custom_date"}
                  onChange={props.handleChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Zone Name</Form.Label>
                <Select
                  name={"zone_id"}
                  menuPortalTarget={document.body}
                  onChange={(e) => handleZoneChange(e, props.setFieldValue)}
                  value={props.values.zone_id}
                  options={allZones.map((zone) => ({
                    label: zone?.zone_name,
                    value: zone?.zone_id,
                  }))}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Regional Office Name</Form.Label>
                <Select
                  name={"regional_id"}
                  menuPortalTarget={document.body}
                  value={props.values.regional_id}
                  options={allRo.map((ro) => ({
                    label: ro?.regional_office_name,
                    value: ro?.ro_id,
                  }))}
                  onChange={(e) => props.setFieldValue("regional_id", e)}
                />
              </Form.Group>
              <button
                type={"submit"}
                disabled={props?.isSubmitting}
                className="social-btn-re border-0 d-align gap-2 px-3 w-auto success-combo"
              >
                {props?.isSubmitting ? (
                  <>
                    <Spinner animation="border" variant="primary" size="sm" />
                    PLEASE WAIT...
                  </>
                ) : (
                  <>{"Submit"}</>
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
      <CustomTable
        id={"pending_complaints"}
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
            userPermission={userPermission}
            setSearchText={setSearch}
            button={{ show: false }}
            al
          />
        )}
        tableTitleComponent={
          <div>
            <strong>pending complaints</strong>
          </div>
        }
      />
    </Col>
  );
};

export default PendingComplaint;
