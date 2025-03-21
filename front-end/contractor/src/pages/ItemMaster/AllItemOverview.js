import React, { useEffect, useMemo, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { BsDashLg, BsPlusLg } from "react-icons/bs";
import { Formik } from "formik";
import { toast } from "react-toastify";
import {
  AdminCreateSurveyItemMaster,
  AdminDeleteSurveyItemMaster,
  AdminUpdateSurveyItemMaster,
  getAdminAllSurveyItemMaster,
} from "../../services/authapi";
import ImageViewer from "../../components/ImageViewer";
import Modaljs from "../../components/Modal";
import ConfirmAlert from "../../components/ConfirmAlert";
import { addSurveyItemMasterSchema } from "../../utils/formSchema";
import { useTranslation } from "react-i18next";
import { UserDetail } from "../../components/ItemDetail";
import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import TableHeader from "../../components/DataTable/TableHeader";
import CustomTable from "../../components/DataTable/CustomTable";
import ActionButtons from "../../components/DataTable/ActionButtons";
import { serialNumber } from "../../utils/helper";

const AllItemOverview = ({ checkPermission }) => {
  const [smShow, setSmShow] = useState(false);
  const [edit, setEdit] = useState({});
  const [idToDelete, setIdToDelete] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [qty, setQty] = useState(0);

  const columnHelper = createColumnHelper();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { userPermission } = useSelector(selectUser);

  const fetchAllSurveyData = async () => {
    const res = await getAdminAllSurveyItemMaster({ search, pageSize, pageNo });
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

  const handleDelete = async () => {
    const res = await AdminDeleteSurveyItemMaster(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setRows((prev) => prev.filter((itm) => itm.id !== +idToDelete));
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
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
      columnHelper.accessor("image", {
        header: t("Item Image"),
        cell: (info) => (
          <ImageViewer
            src={`${process.env.REACT_APP_API_URL}${info.row.original?.image}`}
          >
            <img
              width={50}
              height={50}
              className="my-bg object-fit p-1 rounded"
              src={`${process.env.REACT_APP_API_URL}${info.row.original?.image}`}
            />
          </ImageViewer>
        ),
      }),
      columnHelper.accessor("name", {
        header: t("Item Name"),
      }),
      columnHelper.accessor("hsncode", {
        header: t("hsn code"),
        cell: (info) =>
          info.row.original?.hsncode ? info.row.original?.hsncode : "-",
      }),
      columnHelper.accessor("start_date", {
        header: t("supplier name"),
        cell: (info) => (
          <UserDetail
            img={info.row.original?.supplier_image}
            name={info.row.original.supplier_name}
            id={info.row.original.supplier_id}
            unique_id={info.row.original.supplier_id}
          />
        ),
      }),
      columnHelper.accessor("sub_category", {
        header: t("sub category"),
        cell: (info) =>
          info.row.original?.sub_category
            ? info.row.original?.sub_category
            : "-",
      }),
      columnHelper.accessor("unit_name", {
        header: t("unit"),
        cell: (info) =>
          info.row.original?.unit_name ? info.row.original?.unit_name : "-",
      }),
      columnHelper.accessor("action", {
        header: t("Action"),
        cell: (info) => (
          <ActionButtons
            actions={{
              view: {
                show: checkPermission?.view,
                action: () =>
                  navigate(`/ItemMaster/view`, {
                    state: {
                      id: info.row.original?.id,
                    },
                  }),
              },
              edit: {
                show: checkPermission?.update,
                action: () =>
                  navigate(
                    `/ItemMaster/add-item-master/${info.row.original?.id}`
                  ),
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
    [checkPermission, rows.length, pageNo, pageSize]
  );

  const handleFileChange = (e, setFieldValue) => {
    if (e.target.files) {
      setFieldValue("image", e.target.files[0]);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("rate", values.rate);
    formData.append("qty", values.qty);
    formData.append("image", values.image);
    if (edit.id) {
      formData.append("id", values.id);
    }
    const res = edit?.id
      ? await AdminUpdateSurveyItemMaster(formData)
      : await AdminCreateSurveyItemMaster(formData);
    if (res.status) {
      toast.success(res.message);
      resetForm();
      setSmShow(false);
    } else {
      toast.error(res.message);
    }
    setSubmitting(false);
    fetchAllSurveyData();
  };

  useEffect(() => {
    fetchAllSurveyData();
  }, [search, pageNo, pageSize]);

  return (
    <>
      <Helmet>
        <title>Item Master · CMS Electricals</title>
      </Helmet>

      <Col md={12} data-aos={"fade-up"}>
        <CustomTable
          id={"account"}
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
              userPermission={checkPermission}
              setSearchText={setSearch}
              button={{
                // noDrop: true,
                to: `/ItemMaster/add-item-master/new`,
                title: "Create",
              }}
              openImport={() => navigate(`/ItemMaster/import-item-master`)}
            />
          )}
          tableTitleComponent={
            <div>
              <strong>All Item Overview</strong>
            </div>
          }
        />
      </Col>

      <Formik
        enableReinitialize={true}
        initialValues={{
          id: edit?.id || "",
          name: edit?.name || "",
          rate: edit?.rate || "",
          qty: edit?.qty || "",
          image: edit.image || null,
        }}
        validationSchema={addSurveyItemMasterSchema}
        onSubmit={handleSubmit}
      >
        {(props) => (
          <Modaljs
            formikProps={props}
            open={smShow}
            size={"sm"}
            closebtn={"Cancel"}
            Savebtn={edit.id ? t("Update") : t("CREATE")}
            close={() => setSmShow(false)}
            title={edit.id ? t("Update Item Master") : t("Create Item Master")}
          >
            <Row className="align-items-center g-2">
              <Form.Group as={Col} md={12}>
                <Form.Label>{t("Name")}</Form.Label>
                <Form.Control
                  type="text"
                  name={"name"}
                  value={props.values.name}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(props.touched.name && props.errors.name)}
                />
              </Form.Group>
              <Form.Group as={Col} md={6}>
                <Form.Label>{t("Rate")}</Form.Label>
                <Form.Control
                  type="number"
                  step="any"
                  name={"rate"}
                  value={props.values.rate}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(props.touched.rate && props.errors.rate)}
                />
              </Form.Group>
              <Form.Group as={Col} md={6}>
                <Form.Label>{t("Qty")}</Form.Label>
                <div className="d-flex h-100">
                  <div
                    className="shadow cursor-pointer d-align red-combo px-2"
                    onClick={() => {
                      setQty(qty - 1);
                      props.setFieldValue("qty", qty - 1);
                    }}
                  >
                    <BsDashLg />
                  </div>
                  <Form.Control
                    type="number"
                    step="any"
                    name={"qty"}
                    value={props.values.qty}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    isInvalid={Boolean(props.touched.qty && props.errors.qty)}
                  />
                  <div
                    className="shadow cursor-pointer d-align success-combo px-2"
                    onClick={() => {
                      setQty(qty + 1);
                      props.setFieldValue("qty", qty + 1);
                    }}
                  >
                    <BsPlusLg />
                  </div>
                </div>
              </Form.Group>

              {edit.id ? (
                <Form.Group as={Col} md={3}>
                  <img
                    width={50}
                    height={50}
                    className="my-bg mb-2 object-fit p-1 rounded"
                    src={`${process.env.REACT_APP_API_URL}/${edit?.image}`}
                    alt={edit?.name}
                  />{" "}
                </Form.Group>
              ) : null}
              <Form.Group as={Col} md={edit.id ? 9 : 12}>
                {!edit.id ? <Form.Label>{t("Upload Image")}</Form.Label> : null}
                <Form.Control
                  type="file"
                  name={"image"}
                  onChange={(e) => handleFileChange(e, props.setFieldValue)}
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
    </>
  );
};

export default AllItemOverview;
