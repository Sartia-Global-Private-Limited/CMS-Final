import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { BsArrowLeftRight, BsCalendarEvent, BsPlus } from "react-icons/bs";
import Modaljs from "../../components/Modal";
import { Formik } from "formik";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import ConfirmAlert from "../../components/ConfirmAlert";
import {
  deleteFinancialYearsById,
  getAllFinancialYears,
  postFinancialYears,
  updateFinancialYears,
} from "../../services/contractorApi";
import { addFinancialYearSchema } from "../../utils/formSchema";
import { useTranslation } from "react-i18next";
import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import TableHeader from "../../components/DataTable/TableHeader";
import CustomTable from "../../components/DataTable/CustomTable";
import ActionButtons from "../../components/DataTable/ActionButtons";
import { serialNumber } from "../../utils/helper";

const FinancialYear = ({ checkPermission }) => {
  const [financialYearShow, setFinancialYearShow] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");
  const [edit, setEdit] = useState({});

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

  const fetchFinancialYearData = async () => {
    const res = await getAllFinancialYears(search, pageSize, pageNo);
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
    const res = await deleteFinancialYearsById(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setRows((prev) => prev.filter((dlt) => dlt.id !== +idToDelete));
      fetchFinancialYearData();
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      start_date: values.start_date,
      end_date: values.end_date,
    };

    const res = edit.id
      ? await updateFinancialYears(edit?.id, sData)
      : await postFinancialYears(sData);
    if (res.status) {
      fetchFinancialYearData();
      toast.success(res.message);
    } else {
      if (res.message.includes("Financial Year already exists")) {
        toast.warn(res.message);
      } else {
        toast.error(res.message);
      }
    }
    resetForm();
    setSubmitting(false);
    setFinancialYearShow(false);
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
      columnHelper.accessor("start_date", {
        header: t("Start Date"),
      }),
      columnHelper.accessor("year_name", {
        header: t("Financial Year"),
      }),
      columnHelper.accessor("end_date", {
        header: t("End Date"),
      }),
      columnHelper.accessor("action", {
        header: t("Action"),
        cell: (info) => (
          <ActionButtons
            actions={{
              edit: {
                show: checkPermission?.update,
                action: () =>
                  navigate(
                    `/financial-year/create-financial-year/${info.row.original?.id}`
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

  useEffect(() => {
    fetchFinancialYearData();
  }, [search, pageNo, pageSize]);

  return (
    <>
      <Helmet>
        <title>Financial Year · CMS Electricals</title>
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
                noDrop: true,
                to: `/financial-year/create-financial-year/new`,
                title: "Create",
              }}
            />
          )}
          tableTitleComponent={
            <div>
              <strong>All - Financial Year</strong>
            </div>
          }
        />
      </Col>

      <Formik
        enableReinitialize={true}
        initialValues={{
          start_date: edit.start_date || "",
          end_date: edit.end_date || "",
        }}
        validationSchema={addFinancialYearSchema}
        onSubmit={handleSubmit}
      >
        {(props) => (
          <Modaljs
            open={financialYearShow}
            size={"md"}
            closebtn={"Cancel"}
            Savebtn={edit.id ? "Update" : "ADD"}
            close={() => setFinancialYearShow(false)}
            title={"Financial Year"}
            formikProps={props}
          >
            <Row className="g-3 py-2 align-items-center">
              <Form.Group as={Col} md="5">
                <Form.Label>{t("Start Date")}</Form.Label>
                <Form.Control
                  type="date"
                  name={"start_date"}
                  value={props.values.start_date}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(
                    props.touched.start_date && props.errors.start_date
                  )}
                />
                <Form.Control.Feedback type="invalid">
                  {props.errors.start_date}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="2" className="text-center">
                <BsArrowLeftRight />
              </Form.Group>
              <Form.Group as={Col} md="5">
                <Form.Label>{t("End Date")}</Form.Label>
                <Form.Control
                  type="date"
                  name={"end_date"}
                  value={props.values.end_date}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(
                    props.touched.end_date && props.errors.end_date
                  )}
                />
                <Form.Control.Feedback type="invalid">
                  {props.errors.end_date}
                </Form.Control.Feedback>
              </Form.Group>
              {edit?.id && (
                <Form.Group as={Col} md="12">
                  <div className="float-end purple-combo p-1 px-2 rounded">
                    <BsCalendarEvent /> {t("Financial Year")} -{" "}
                    {edit?.year_name}
                  </div>
                </Form.Group>
              )}
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

export default FinancialYear;
