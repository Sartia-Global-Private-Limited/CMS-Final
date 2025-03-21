import React, { Fragment, useEffect, useMemo } from "react";
import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import Select from "react-select";
import { BsPersonAdd, BsPersonPlus } from "react-icons/bs";
import { Helmet } from "react-helmet";
import {
  deleteAdminEnergy,
  getAllAreaNameByAreaId,
  getAllEnergyCompanyOnly,
  getEnergyCheckRelated,
  getEnergyDeleteRelated,
  postZoneUser,
} from "../../../services/authapi";
import { toast } from "react-toastify";
import ConfirmAlert from "../../../components/ConfirmAlert";
import Modaljs from "../../../components/Modal";
import { ErrorMessage, Formik } from "formik";
import { Form } from "react-bootstrap";
import {
  addEnergySchema,
  addEnergySchemaOnly,
} from "../../../utils/formSchema";
import TextareaAutosize from "react-textarea-autosize";
import { useNavigate, useSearchParams } from "react-router-dom";
import ActionButtons from "../../../components/DataTable/ActionButtons";
import { createColumnHelper } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import CustomTable from "../../../components/DataTable/CustomTable";
import TableHeader from "../../../components/DataTable/TableHeader";
import StatusChip from "../../../components/StatusChip";
import { serialNumber } from "../../../utils/helper";

const EnergyMasterdata = ({ checkPermission }) => {
  const navigate = useNavigate();
  const [energyShow, setEnergyShow] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const [permanentDlt, setPermanentDlt] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [deleteCompany, setDeleteCompany] = useState(false);
  const [edit, setEdit] = useState({});
  const [deleteData, setDeleteData] = useState([]);
  const [allAreaName, setAllAreaName] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [energyData, setEnergyData] = useState({});
  const [typeModal, setTypeModal] = useState("");
  const columnHelper = createColumnHelper();
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || "10";
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { t } = useTranslation();

  // all Energy
  const fetchAllEnergyData = async () => {
    const res = await getAllEnergyCompanyOnly({ search, pageSize, pageNo });
    if (res.status) {
      setRows(res.data);
      setTotalData(res?.pageDetails?.total);
    } else {
      setRows([]);
      setTotalData(0);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    // return console.log(values)
    const sData = {
      email: values.email,
      username: values.username,
      password: values.password,
      contact_no: values.contact_no,
      alt_number: values.alt_number,
      address_1: values.address_1,
      gst_number: values.gst_number,
      status: values.status.value,
      country: values.country,
      city: values.city,
      pin_code: values.pin_code,
      description: values.description,
    };

    if (typeModal) {
      sData["energy_company_id"] = energyData?.energy_company_id;
      sData["joining_date"] = values.joining_date;
      sData["area_name"] = values.area_name.value;
      sData["area_selected"] = values.area_selected.value;
    }

    // return console.log("sData", sData);
    const res = typeModal
      ? await postZoneUser(sData)
      : await deleteAdminEnergy(idToDelete, sData);
    if (res.status) {
      resetForm();
      toast.success(res.message);
      setEnergyShow(false);
    } else {
      toast.error(res.message);
    }
    fetchAllEnergyData();
    setIdToDelete("");
    setSubmitting(false);
  };

  const handleAreaChange = async (val, setFieldValue) => {
    if (setFieldValue) {
      setFieldValue("area_name", val);
    }
    if (!val) return false;
    fetchAllAreaByAreaId(val);
  };

  const fetchAllAreaByAreaId = async (type) => {
    const res = await getAllAreaNameByAreaId(
      energyData?.energy_company_id,
      type
    );
    if (res.status) {
      setAllAreaName(res.data);
      setSelectedValue(res?.selectedValue);
    } else {
      setAllAreaName([]);
      toast.error(res.message);
    }
  };

  useEffect(() => {
    fetchAllEnergyData();
  }, [search, pageNo, pageSize]);

  const assignclickhandler = (ec, new_user) => {
    setIdToDelete(ec.user_id);
    setTypeModal(new_user);
    setEnergyShow(true);
    setEnergyData(ec);
  };

  const deleteclickhandler = async (ec) => {
    const res = await getEnergyCheckRelated(ec.energy_company_id);
    if (res.status) {
      setDeleteData(res.data);
    } else {
      setDeleteData([]);
    }
    setDeleteId(ec.energy_company_id);
    setDeleteCompany(true);
  };

  const handleDeleteSubmit = async () => {
    const sData = {
      energy_company_id: deleteId,
      delete_all: permanentDlt === "1" ? 1 : 0,
    };
    // return console.log('sData', sData)
    const res = await getEnergyDeleteRelated(sData);
    if (res.status) {
      toast.success(res.message);
      fetchAllEnergyData();
    } else {
      toast.error(res.message);
    }
    setDeleteCompany(false);
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
      columnHelper.accessor("energy_company_id", {
        header: t("Company id"),
      }),
      columnHelper.accessor("name", {
        header: t("Company Name"),
        cell: (info) => {
          return (
            <>
              {info.getValue()}{" "}
              <span className="small text-danger">
                {info.row.original?.is_deleted === 1 && "(Soft Delete)"}
              </span>
            </>
          );
        },
      }),
      columnHelper.accessor("status", {
        header: t("Status"),
        cell: (info) => (
          <StatusChip
            status={info.row.original?.status == "1" ? "Active" : "InActive"}
          />
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
                    `/EnergyMasterdata/ViewEnergyCompanyDetails/${info.row.original.energy_company_id}`
                  ),
              },
              edit: {
                show: checkPermission?.update,
                action: () =>
                  navigate(
                    `/EnergyMasterdata/AddEnergyCompany/${info.row.original.energy_company_id}`
                  ),
              },
              delete: {
                show: checkPermission?.delete,
                action: () => {
                  deleteclickhandler(info.row.original);
                },
              },
              approve: {
                show: checkPermission?.update,
                icon: BsPersonPlus,
                tooltipTitle: t("Assign New User"),
                className: "danger-combo",
                action: () => {
                  assignclickhandler(info.row.original);
                },
              },
              reject: {
                show: checkPermission?.update,
                icon: BsPersonAdd,
                tooltipTitle: t("Add New User"),
                className: "success-combo",
                action: () => {
                  assignclickhandler(info.row.original, "new user");
                },
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
        <title>Energy · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CustomTable
          id={"energy"}
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
                to: `/EnergyMasterdata/AddEnergyCompany/new`,
                title: "Add Company",
              }}
            />
          )}
          tableTitleComponent={
            <div>
              <strong>All Energy Companies</strong>
            </div>
          }
        />
      </Col>

      <ConfirmAlert
        size={"sm"}
        deleteFunction={() => setEnergyShow(true)}
        hide={setShowAlert}
        show={showAlert}
        title={"Confirm Delete"}
        description={
          "If you want to delete that energy company you have to assign new user!!"
        }
      />
      <Formik
        enableReinitialize={true}
        initialValues={{
          email: edit.email || "",
          username: edit.username || "",
          password: edit.password || "",
          contact_no: edit.contact_no || "",
          alt_number: edit.alt_number || "",
          gst_number: edit.gst_number || "",
          address_1: edit.address_1 || "",
          // zone_id: edit.zone_id || "",
          // ro_id: edit.ro_id || "",
          // sale_area_id: edit.sale_area_id || "",
          status: edit.status
            ? {
                label: edit.status === "1" ? "Active" : "InActive",
                value: parseInt(edit.status),
              }
            : { label: "Active", value: 1 },
          joining_date: edit.joining_date || "",
          area_name: edit.area_name || "",
          area_selected: edit.area_selected || "",
          country: edit.country || "",
          city: edit.city || "",
          pin_code: edit.pin_code || "",
          description: edit.description || "",
        }}
        validationSchema={typeModal ? addEnergySchemaOnly : addEnergySchema}
        onSubmit={handleSubmit}
      >
        {/* {console.log(initialValues)} */}
        {(props) => (
          <Modaljs
            formikProps={props}
            open={energyShow}
            size={"md"}
            closebtn={"Cancel"}
            Savebtn={`${typeModal ? "Add" : "Assign"}`}
            close={() => setEnergyShow(false)}
            title={`${typeModal ? "Add" : "Assign"} New User For ${
              energyData?.name
            }`}
          >
            <Form onSubmit={props.handleSubmit}>
              {typeModal !== "new user" ? (
                <small className="text-gray">
                  {" "}
                  If you want to delete that energy company you have to assign
                  new user!!{" "}
                </small>
              ) : null}
              <Row className="mt-2 g-2">
                <Form.Group as={Col} md="4">
                  <Form.Label>
                    Email <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name={"email"}
                    value={props.values.email}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    isInvalid={Boolean(
                      props.touched.email && props.errors.email
                    )}
                  />
                  <Form.Control.Feedback type="invalid">
                    {props.errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="4">
                  <Form.Label>
                    username <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name={"username"}
                    value={props.values.username}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    isInvalid={Boolean(
                      props.touched.username && props.errors.username
                    )}
                  />
                  <Form.Control.Feedback type="invalid">
                    {props.errors.username}
                  </Form.Control.Feedback>
                </Form.Group>
                {!edit.ec_id ? (
                  <Form.Group as={Col} md="4">
                    <Form.Label>password</Form.Label>
                    <Form.Control
                      type="password"
                      name={"password"}
                      value={props.values.password}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      isInvalid={Boolean(
                        props.touched.password && props.errors.password
                      )}
                    />
                    <Form.Control.Feedback type="invalid">
                      {props.errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>
                ) : null}
                <Form.Group as={Col} md="4">
                  <Form.Label>
                    contact no <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    maxLength={10}
                    name={"contact_no"}
                    value={props.values.contact_no}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    isInvalid={Boolean(
                      props.touched.contact_no && props.errors.contact_no
                    )}
                  />
                  <Form.Control.Feedback type="invalid">
                    {props.errors.contact_no}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="4">
                  <Form.Label>alt number</Form.Label>
                  <Form.Control
                    type="text"
                    maxLength={10}
                    name={"alt_number"}
                    value={props.values.alt_number}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    isInvalid={Boolean(
                      props.touched.alt_number && props.errors.alt_number
                    )}
                  />
                  <Form.Control.Feedback type="invalid">
                    {props.errors.alt_number}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md={4}>
                  <Form.Label>Status</Form.Label>
                  <Select
                    menuPosition="fixed"
                    name={"status"}
                    options={[
                      { label: "Active", value: 1 },
                      { label: "Inactive", value: 0 },
                    ]}
                    value={props.values.status}
                    onChange={(selectedOption) => {
                      props.setFieldValue("status", selectedOption);
                    }}
                  />
                </Form.Group>
                <Form.Group as={Col} md="12">
                  <Form.Label>address</Form.Label>
                  <TextareaAutosize
                    minRows={2}
                    className="edit-textarea"
                    name={"address_1"}
                    value={props.values.address_1}
                    onChange={props.handleChange}
                  />
                </Form.Group>
                <Form.Group as={Col} md="4">
                  <Form.Label>country</Form.Label>
                  <Form.Control
                    type="text"
                    name={"country"}
                    value={props.values.country}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    isInvalid={Boolean(
                      props.touched.country && props.errors.country
                    )}
                  />
                  <Form.Control.Feedback type="invalid">
                    {props.errors.country}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="4">
                  <Form.Label>city</Form.Label>
                  <Form.Control
                    type="text"
                    name={"city"}
                    value={props.values.city}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    isInvalid={Boolean(props.touched.city && props.errors.city)}
                  />
                  <Form.Control.Feedback type="invalid">
                    {props.errors.city}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="4">
                  <Form.Label>pin code</Form.Label>
                  <Form.Control
                    type="text"
                    name={"pin_code"}
                    value={props.values.pin_code}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    isInvalid={Boolean(
                      props.touched.pin_code && props.errors.pin_code
                    )}
                  />
                  <Form.Control.Feedback type="invalid">
                    {props.errors.pin_code}
                  </Form.Control.Feedback>
                </Form.Group>
                {typeModal ? (
                  <>
                    <Form.Group as={Col} md="6">
                      <Form.Label>
                        Joining Date <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="date"
                        name={"joining_date"}
                        value={props.values.joining_date}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        isInvalid={Boolean(
                          props.touched.joining_date &&
                            props.errors.joining_date
                        )}
                      />
                      <Form.Control.Feedback type="invalid">
                        {props.errors.joining_date}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="6">
                      <Form.Label>
                        Area Name <span className="text-danger">*</span>
                      </Form.Label>
                      <Select
                        className="text-primary w-100"
                        menuPosition="fixed"
                        name="area_name"
                        options={[
                          {
                            label: "Zone",
                            value: 1,
                          },
                          {
                            label: "Regional",
                            value: 2,
                          },
                          {
                            label: "Sales Area",
                            value: 3,
                          },
                          {
                            label: "District",
                            value: 4,
                          },
                          {
                            label: "Outlets",
                            value: 5,
                          },
                        ]}
                        value={props.values.area_name}
                        onChange={(val) => {
                          handleAreaChange(val.value, props.setFieldValue);
                          props.setFieldValue("area_name", val);
                          props.setFieldValue("area_selected", null);
                        }}
                      />
                      <ErrorMessage
                        name="area_name"
                        component="small"
                        className="text-danger"
                      />
                    </Form.Group>
                    {selectedValue ? (
                      <Form.Group as={Col} md="6">
                        <Form.Label>
                          {selectedValue} <span className="text-danger">*</span>
                        </Form.Label>
                        <Select
                          menuPosition="fixed"
                          name={"area_selected"}
                          options={allAreaName.map((type) => ({
                            label: type.area_name,
                            value: type.id,
                          }))}
                          value={props.values.area_selected}
                          onChange={(selectedOption) => {
                            props.setFieldValue(
                              "area_selected",
                              selectedOption
                            );
                          }}
                        />
                        <ErrorMessage
                          name="area_selected"
                          component="small"
                          className="text-danger"
                        />
                      </Form.Group>
                    ) : null}
                  </>
                ) : null}
                <Form.Group as={Col} md="12">
                  <Form.Label>Description</Form.Label>
                  <TextareaAutosize
                    minRows={2}
                    className="edit-textarea"
                    name={"description"}
                    value={props.values.description}
                    onChange={props.handleChange}
                  />
                </Form.Group>
              </Row>
            </Form>
          </Modaljs>
        )}
      </Formik>

      <Formik
        enableReinitialize={true}
        initialValues={{
          energy_company_id: "",
          delete_all: "",
        }}
        // validationSchema={addEnergySchema}
        onSubmit={handleDeleteSubmit}
      >
        {/* {console.log(initialValues)} */}
        {(props) => (
          <Modaljs
            formikProps={props}
            newButtonType={"submit"}
            newButtonOnclick={() => setPermanentDlt("1")}
            newButtonTitle={"Permanent Delete"}
            open={deleteCompany}
            size={"md"}
            closebtn={"Cancel"}
            newButtonClass={"red-combo"}
            Savebtn={"Soft Delete"}
            close={() => setDeleteCompany(false)}
            title={`Delete Company`}
          >
            <Form onSubmit={props.handleSubmit}>
              <Row className="g-2">
                {deleteData?.length > 0 ? null : (
                  <div className="text-center">
                    <img
                      className="p-3"
                      alt="no-result"
                      width="250"
                      src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                    />
                  </div>
                )}
                {deleteData?.map((data, id1) => (
                  <Fragment key={id1}>
                    {data?.complaint_type_data?.map((data1, idx) => (
                      <Fragment key={idx}>
                        {idx == 0 && <span> Complaint Type Data</span>}
                        <Form.Group key={idx} as={Col} md="6">
                          <Form.Control
                            disabled
                            value={data1?.complaint_type_name}
                          />
                        </Form.Group>
                      </Fragment>
                    ))}
                    {data?.complaint_data?.map((data2, id2) => (
                      <Fragment key={id2}>
                        {id2 == 0 && (
                          <>
                            <Form.Group className="py-1 hr-border2" md="12" />
                            <span>Complaint Data</span>
                          </>
                        )}
                        <Form.Group as={Col} md="6">
                          <Form.Control
                            disabled
                            value={data2?.complaint_type_name}
                          />
                        </Form.Group>
                      </Fragment>
                    ))}
                  </Fragment>
                ))}
              </Row>
            </Form>
          </Modaljs>
        )}
      </Formik>
    </>
  );
};

export default EnergyMasterdata;
