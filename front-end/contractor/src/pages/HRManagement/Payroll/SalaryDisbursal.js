import React, { useEffect, useMemo } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { Helmet } from "react-helmet";
import CardComponent from "../../../components/CardComponent";
import { useState } from "react";
import moment from "moment";
import {
  CreateSalaryDisbursal,
  getAllSalaryDisbursal,
} from "../../../services/authapi";
import { toast } from "react-toastify";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Formik } from "formik";
import Modaljs from "../../../components/Modal";
import { addSalarySchema } from "../../../utils/formSchema";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/auth/authSlice";
import CustomTable from "../../../components/DataTable/CustomTable";
import ActionButtons from "../../../components/DataTable/ActionButtons";
import { createColumnHelper } from "@tanstack/react-table";
import { UserDetail } from "../../../components/ItemDetail";
import TableHeader from "../../../components/DataTable/TableHeader";
import { formatNumberToINR, serialNumber } from "../../../utils/helper";

const SalaryDisbursal = ({ checkPermission }) => {
  const [dateValue, setDateValue] = useState(
    moment(new Date()).format("YYYY-MM")
  );

  const [generatePaySlip, setGeneratePaySlip] = useState(false);
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
  const { user } = useSelector(selectUser);

  const datehandler = (e) => {
    const date = e.target.value;
    setDateValue(date);
  };

  const fetchData = async () => {
    const res = await getAllSalaryDisbursal(
      dateValue,
      search,
      pageSize,
      pageNo
    );
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

  const handleDisbursed = async (data) => {
    setEdit(data);
    setGeneratePaySlip(true);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      user_id: edit?.user_id,
      gross_salary: edit?.grossSalary,
      amount: values.amount,
      payable_amount: edit?.payable_salary,
      due_amount: edit?.due_amount,
      final_pay_amount: edit?.final_pay_amount,
      transaction_number: values.transaction_number,
      transaction_mode: values.transaction_mode,
      month: `${dateValue}-${moment(new Date()).format("DD")}`,
    };
    const res = await CreateSalaryDisbursal(sData);
    if (res.status) {
      toast.success(res.message);
      fetchData();
    } else {
      toast.warn(res.message);
    }
    resetForm();
    setSubmitting(false);
    setGeneratePaySlip(false);
  };

  useEffect(() => {
    fetchData();
  }, [dateValue, search, pageNo, pageSize]);

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
            id={info.row.original?.user_id}
            unique_id={info.row.original?.employee_code}
            login_id={user.id}
          />
        ),
      }),
      columnHelper.accessor("month", {
        header: t("Month"),
      }),
      columnHelper.accessor("salary", {
        header: t("Basic Salary"),
        cell: (info) => formatNumberToINR(info.getValue()),
      }),
      columnHelper.accessor("allowance", {
        header: t("Allowance"),
        cell: (info) => formatNumberToINR(info.getValue()),
      }),
      columnHelper.accessor("deduction", {
        header: t("Deduction"),
        cell: (info) => formatNumberToINR(info.getValue()),
      }),
      columnHelper.accessor("grossSalary", {
        header: t("Gross"),
        cell: (info) => (
          <span className="text-green">
            {formatNumberToINR(info.getValue())}
          </span>
        ),
      }),
      columnHelper.accessor("action", {
        header: t("Action"),
        cell: (info) => (
          <ActionButtons
            actions={{
              view: {
                show: checkPermission?.view,
                action: () =>
                  navigate(
                    `/SalaryDisbursal/ViewSalaryDisbursal/${info.row.original?.user_id}/${dateValue}`
                  ),
              },
              approve: {
                show: checkPermission?.update,
                action: () => handleDisbursed(info.row.original),
              },
            }}
          />
        ),
      }),
    ],
    [checkPermission, t, rows.length, pageNo, pageSize, dateValue]
  );

  return (
    <>
      <Helmet>
        <title>Salary Disbursal · CMS Electricals</title>
      </Helmet>

      <CustomTable
        id={`salary_Disbursal`}
        userPermission={checkPermission}
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
              show: false,
            }}
            extraComponent={
              <Form.Control
                className="w-auto"
                value={dateValue}
                onChange={datehandler}
                type="month"
                name={"date"}
              />
            }
          />
        )}
        tableTitleComponent={<strong>Salary Disbursal</strong>}
      />

      <Formik
        enableReinitialize={true}
        initialValues={{
          transaction_number: "",
        }}
        validationSchema={addSalarySchema}
        onSubmit={handleSubmit}
      >
        {(props) => (
          <Modaljs
            formikProps={props}
            open={generatePaySlip}
            size={"md"}
            closebtn={"Cancel"}
            Savebtn={"Save"}
            close={() => setGeneratePaySlip(false)}
            title={t("Generate PaySlip Number")}
          >
            <Row className="g-2">
              <Form.Group as={Col} md={6}>
                <Form.Label>{t("Employee Name")}</Form.Label>
                <Form.Control value={edit?.name} disabled />
              </Form.Group>
              <Form.Group as={Col} md={6}>
                <Form.Label>{t("Month")}</Form.Label>
                <Form.Control value={edit?.month} disabled />
              </Form.Group>
              <Form.Group as={Col} md={6}>
                <Form.Label>{t("Gross Salary")}</Form.Label>
                <Form.Control value={edit?.grossSalary} disabled />
              </Form.Group>
              <Form.Group as={Col} md={6}>
                <Form.Label>{t("Payable Salary")}</Form.Label>
                <Form.Control value={edit?.payable_salary} disabled />
              </Form.Group>
              <Form.Group as={Col} md={6}>
                <Form.Label>{t("Due Amount")}</Form.Label>
                <Form.Control value={edit?.due_amount} disabled />
              </Form.Group>
              <Form.Group as={Col} md={6}>
                <Form.Label>{t("Final Pay Amount")}</Form.Label>
                <Form.Control value={edit?.final_pay_amount} disabled />
              </Form.Group>
              <Form.Group as={Col} md={6}>
                <Form.Label>{t("Amount")}</Form.Label>
                <Form.Control
                  type="number"
                  step="any"
                  className="fw-bold"
                  name={"amount"}
                  value={props.values.amount}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  isInvalid={
                    Boolean(props.touched.amount && props.errors.amount) ||
                    props.values.amount > edit?.final_pay_amount
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {props.errors.amount ||
                    " Amount cannot be greater than payable salary."}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md={6}>
                <Form.Label>{t("Transaction Number")}</Form.Label>
                <Form.Control
                  type="text"
                  className="fw-bold"
                  name={"transaction_number"}
                  value={props.values.transaction_number}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(
                    props.touched.transaction_number &&
                      props.errors.transaction_number
                  )}
                />
                <Form.Control.Feedback type="invalid">
                  {props.errors.transaction_number}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md={6}>
                <Form.Label>{t("Transaction Mode")}</Form.Label>
                <Form.Control
                  type="text"
                  className="fw-bold"
                  name={"transaction_mode"}
                  value={props.values.transaction_mode}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(
                    props.touched.transaction_mode &&
                      props.errors.transaction_mode
                  )}
                />
                <Form.Control.Feedback type="invalid">
                  {props.errors.transaction_mode}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
          </Modaljs>
        )}
      </Formik>
    </>
  );
};
export default SalaryDisbursal;
