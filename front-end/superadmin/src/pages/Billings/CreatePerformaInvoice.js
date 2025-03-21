import React, { useEffect } from "react";
import { Col, Form, Row, Spinner, Stack, Table } from "react-bootstrap";
import Select from "react-select";
import { ErrorMessage, Formik } from "formik";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  fetchMeasurementDatabyPoAndMeasurementId,
  getAllComapnyDataForBillingFrom,
  getAllFinancialYears,
  getAllItemsOnMeasurementId,
  getAllState,
  getDetailPerforma,
  getDetailsOfProcessToMeasurement,
  postProformaInvoice,
  updateProformaInvoice,
} from "../../services/contractorApi";
import { toast } from "react-toastify";
import { useState } from "react";
import { addPerformaInvoiceSchema } from "../../utils/formSchema";
import TextareaAutosize from "react-textarea-autosize";
import CardComponent from "../../components/CardComponent";
import ConfirmAlert from "../../components/ConfirmAlert";
import { Helmet } from "react-helmet";
import { isCurrentFinancialYear } from "../../utils/helper";
import moment from "moment";
import ViewPerformaInvoice from "./ViewPerformaInvoice";
import { BsRecord2 } from "react-icons/bs";
import { getAdminAllEnergy } from "../../services/authapi";

const CreatePerformaInvoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const measurements = location?.state?.measurements;
  const allData = location?.state?.allData;
  const editFrom = location?.state?.editFrom;
  const regionalOfficceId = location?.state?.regionalOfficceId;
  const poId = location?.state?.poId;
  const companyDetails = location?.state?.companyDetails;

  const companyDetailFromFilter = location?.state?.companyDetailFromFilter;

  const [edit, setEdit] = useState({});
  const [piData, setPiData] = useState({});
  const [companyData, setCompanyData] = useState([]);
  const [energyCompany, setEnergyCompany] = useState([]);
  const [allFinancialYear, setAllFinancialYear] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [measurementData, setMeasurementData] = useState([]);
  const [itemsOnMeasurementId, setItemsOnMeasurementId] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [selectedFinYear, setSelectedFinYear] = useState("");
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || null;
  const [showAlert2, setShowAlert2] = useState(false);
  const [finalSubmit, setFinalSubmit] = useState(false);

  const fetchProformaInvoiceData = async () => {
    const res = await getDetailPerforma(measurements?.[0]);
    if (res.status) {
      setEdit(res.data);
      setItemsOnMeasurementId(res.data.getMeasurements);
    } else {
      setEdit([]);
    }
  };

  const fetchSingleProformaInvoiceData = async () => {
    const res = await getDetailsOfProcessToMeasurement(allData?.id);
    if (res.status) {
      setPiData(res.data[0]);
    } else {
      setPiData([]);
    }
  };

  const getSelecteFinYear = () => {
    const finYearData = allFinancialYear.find(
      (itm) => itm.year_name === selectedFinYear
    );
    return finYearData;
  };

  const showCompanyApi = async () => {
    const isDropdown = true;

    const res = await getAllComapnyDataForBillingFrom(isDropdown);
    if (res.status) {
      setCompanyData(res.data);
    } else {
      setCompanyData([]);
    }
  };

  const fetchEnergyCompanyData = async () => {
    const res = await getAdminAllEnergy();
    if (res.status) {
      setEnergyCompany(res.data);
    } else {
      setEnergyCompany([]);
    }
  };

  const showFinancialYearApi = async () => {
    const res = await getAllFinancialYears();
    if (res.status) {
      setAllFinancialYear(res.data);
    } else {
      setAllFinancialYear([]);
    }
  };

  const showStateApi = async () => {
    const res = await getAllState();
    if (res.status) {
      setStateData(res.data);
    } else {
      setStateData([]);
    }
  };

  const handlePIChange = async (val, setFieldValue) => {
    if (setFieldValue) {
      setFieldValue("po_number", val);
      setFieldValue("measurement_list", "");
      setMeasurementData([]);
    }
    if (!val) return false;
    fetchMeasurementData(val.value);
  };
  const handleItemsOnMeasurementId = async (val, setFieldValue, props) => {
    let remove = false;
    if (props.values.measurement_list.length > val.length) remove = true;
    if (remove) {
      const removedItems = props.values?.measurement_list.filter(
        (prevItem) =>
          !val.find((selectedItem) => selectedItem.value === prevItem.value)
      );
      if (val.length == 0) {
        setItemsOnMeasurementId([]);
        setFieldValue("measurement_list", "");
        setSelectedItems([]);
        return;
      }

      setItemsOnMeasurementId(
        itemsOnMeasurementId.filter(
          (item) =>
            item.complaintDetails.complaint_unique_id != removedItems[0].label
        )
      );

      setFieldValue("measurement_list", val);
      setSelectedItems(
        selectedItems.filter(
          (data) => data.measurement_list != removedItems[0].value
        )
      );

      return;
    }
    if (setFieldValue) {
      setFieldValue("measurement_list", val);
    }
    if (!val) return false;
    fetchItemsOnMeasurementId(val[val.length - 1].value);
  };

  useEffect(() => {
    fetchMeasurementData();
    fetchEnergyCompanyData();
  }, [poId]);

  const fetchItemsOnMeasurementId = async (e) => {
    const res = await getAllItemsOnMeasurementId(e);
    if (res.status) {
      setItemsOnMeasurementId([...itemsOnMeasurementId, res.data]);
    } else {
      setItemsOnMeasurementId([]);
      toast.error(res.message);
    }
  };

  const fetchMeasurementData = async (e) => {
    const res = await fetchMeasurementDatabyPoAndMeasurementId(
      poId?.id,
      measurements
    );
    if (res.status) {
      setMeasurementData(res.data);
    } else {
      setMeasurementData([]);
    }
  };

  useEffect(() => {
    if (id !== "new") {
      fetchProformaInvoiceData();
    }
    fetchSingleProformaInvoiceData();
    showCompanyApi();
    showFinancialYearApi();
    showStateApi();
  }, [id]);

  const handleCheckboxChange = (e, mainIndex, parentIndex) => {
    let temp = JSON.parse(JSON.stringify(itemsOnMeasurementId));
    temp[mainIndex].items_data[parentIndex].is_status = e.target.checked;
    setItemsOnMeasurementId(temp);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const modifiedData = itemsOnMeasurementId.map((data) => {
      return {
        measurement_list: data.items_data[0].measurement_id,
        item_details: data.items_data.map((item) => {
          return {
            order_line_number: item.order_line_number,
            is_status: id == "new" ? true : item.is_status || false,
          };
        }),
      };
    });

    const complaint_id = measurementData.map((item) => item.complaint_id);

    const sData = {
      billing_from: values.billing_from.value,
      complaint_for:
        id != "edit"
          ? poId?.company_name
            ? companyDetailFromFilter?.complaint_for
            : companyDetails?.complaint_for
          : edit.complaint_for,
      billing_from_state: values.billing_from_state.value,
      // billing_to:
      //   id != "edit" ? companyDetails?.id : edit.billing_to.company_id,
      billing_to:
        id !== "edit"
          ? poId?.company_name
            ? poId?.energy_company_id
            : companyDetails?.id
          : edit?.billing_to?.company_id,

      billing_to_ro_office:
        id !== "edit"
          ? poId?.company_name
            ? poId?.ro_id
            : regionalOfficceId?.id
          : edit?.billing_to_ro_office?.ro_id,
      financial_year: values.financial_year.value,
      po_number: poId?.id,
      measurements: modifiedData,
      work: values.work,
      complaint_id,
    };
    if (id == "edit") {
      sData["id"] = measurements?.[0];
      sData["status"] = finalSubmit ? "2" : "1";
    }

    const res =
      id == "edit"
        ? await updateProformaInvoice(sData)
        : await postProformaInvoice(sData);
    if (res.status) {
      toast.success(res.message);
      navigate(-1);
      resetForm();
    } else {
      toast.error(res.message);
    }
    setSubmitting(false);
    setShowAlert(false);
    setFinalSubmit(false);
    setShowAlert2(false);
  };
  return (
    <>
      <Helmet>
        <title>
          {id == "edit" ? "Update" : "Create"} Performa Invoice · CMS
          Electricals
        </title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CardComponent
          className={type === "view" && "after-bg-light"}
          title={`${id == "edit" ? "Update" : "Create"} Performa Invoice`}
        >
          <Formik
            enableReinitialize={true}
            initialValues={{
              billing_from: edit.billing_from
                ? {
                    label: edit?.billing_from?.company_name,
                    value: edit?.billing_from?.company_id,
                  }
                : "",
              billing_from_state: edit.billing_from_state
                ? {
                    label: edit?.billing_from_state,
                    value: edit?.billing_from_state_id,
                  }
                : "",
              billing_to: edit?.billing_to
                ? {
                    label: edit?.billing_to?.company_name,
                    value: edit?.billing_to?.company_id,
                  }
                : {
                    label: piData?.company_details?.company_name,
                    value: piData?.company_details?.company_name,
                  },
              // billing_to:
              //   id != "edit"
              //     ? { label: companyDetails?.name, value: companyDetails?.id }
              //     : edit.billing_to
              //     ? {
              //         label: edit?.billing_to?.company_name,
              //         value: edit?.billing_to?.company_id,
              //       }
              //     : "",
              billing_to_ro_office: edit?.billing_to_ro_office
                ? {
                    label: edit?.billing_to_ro_office?.ro_name,
                    value: edit?.billing_to_ro_office?.ro_id,
                  }
                : {
                    label: piData?.regional_office_name,
                    value: piData?.regional_office_name,
                  },
              financial_year: edit.financial_year
                ? {
                    label: edit?.financial_year,
                    value: edit.financial_year,
                  }
                : "",
              po_number: edit.po_number
                ? {
                    label: edit.po_number,
                    value: edit.po_id,
                  }
                : "",

              measurement_list:
                edit?.getMeasurements?.length > 0
                  ? edit.getMeasurements.map((item) => {
                      return {
                        label: item.complaintDetails.complaint_unique_id,
                        value: item.complaintDetails.complaint_id,
                      };
                    })
                  : "",
              work: edit.work || "",
              measurement_date: edit.measurement_date
                ? moment(edit.measurement_date).format("YYYY-MM-DD")
                : moment().format("YYYY-MM-DD"),
            }}
            validationSchema={addPerformaInvoiceSchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props?.handleSubmit}>
                <Row className="g-3">
                  {type === "view" ? (
                    <ViewPerformaInvoice edit={edit} />
                  ) : (
                    <>
                      <Form.Group as={Col} md={6}>
                        <div className="shadow p-3">
                          <div className="mb-2">
                            <Form.Label className="fw-bolder">
                              Billing From{" "}
                              <span className="text-danger">*</span>
                            </Form.Label>

                            <Select
                              className="text-primary w-100"
                              placeholder="-- Select Company --"
                              menuPortalTarget={document.body}
                              name={"billing_from"}
                              options={companyData?.map((itm) => ({
                                label: itm.company_name,
                                value: itm.company_id,
                              }))}
                              value={props.values.billing_from}
                              onChange={(selectedOption) => {
                                props.setFieldValue(
                                  "billing_from",
                                  selectedOption
                                );
                              }}
                            />
                            <ErrorMessage
                              name="billing_from"
                              component="small"
                              className="text-danger"
                            />
                          </div>
                          <Form.Label className="d-block fw-bolder">
                            Billing From State{" "}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Select
                            className="text-primary w-100"
                            menuPortalTarget={document.body}
                            name={"billing_from_state"}
                            value={props.values.billing_from_state}
                            options={stateData?.map((itm) => ({
                              label: itm.name,
                              value: itm.id,
                            }))}
                            onChange={(selectedOption) => {
                              props.setFieldValue(
                                "billing_from_state",
                                selectedOption
                              );
                            }}
                            isInvalid={Boolean(
                              props.touched.billing_from_state &&
                                props.errors.billing_from_state
                            )}
                          />
                          <ErrorMessage
                            name="billing_from_state"
                            component="small"
                            className="text-danger"
                          />
                        </div>
                      </Form.Group>
                      <Form.Group as={Col} md={6}>
                        <div className="shadow p-3">
                          <div className="mb-2">
                            <Form.Label className="fw-bolder">
                              Billing To <span className="text-danger">*</span>
                            </Form.Label>
                            <Select
                              className="text-primary w-100"
                              menuPortalTarget={document.body}
                              name={"billing_to"}
                              isDisabled={true}
                              value={
                                props.values.billing_to
                                  ? props.values.billing_to
                                  : poId?.company_name
                                  ? {
                                      label: poId?.company_name,
                                      value: poId?.id,
                                    }
                                  : {
                                      label: companyDetails?.name,
                                      value: companyDetails?.id,
                                    }
                              }
                              // defaultValue={
                              //   poId?.company_name
                              //     ? {
                              //         label: poId?.company_name,
                              //         value: poId?.id,
                              //       }
                              //     : {
                              //         label: companyDetails?.name,
                              //         value: companyDetails?.id,
                              //       }
                              // }
                              // options={
                              //   companyDetails?.complaint_for == "1"
                              //     ? energyCompany?.map(
                              //         ({ name, energy_company_id }) => ({
                              //           label: name,
                              //           value: energy_company_id,
                              //         })
                              //       )
                              //     : props.values.billing_from
                              //     ? companyData
                              //         ?.filter(
                              //           ({ company_id }) =>
                              //             company_id !==
                              //             props.values.billing_from.value
                              //         )
                              //         ?.map(({ company_name, company_id }) => ({
                              //           label: company_name,
                              //           value: company_id,
                              //         }))
                              //     : []
                              // }
                            />
                            <ErrorMessage
                              name="billing_to"
                              component="small"
                              className="text-danger"
                            />
                          </div>
                          <Form.Label className="d-block fw-bolder">
                            Billing to Regional Office{" "}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Select
                            className="text-primary w-100"
                            menuPortalTarget={document.body}
                            name={"billing_to_ro_office"}
                            isDisabled={true}
                            value={
                              props.values.billing_to_ro_office
                                ? props.values.billing_to_ro_office
                                : poId.company_name
                                ? {
                                    label: poId.regional_office_name,
                                    value: poId.ro_id,
                                  }
                                : {
                                    label: regionalOfficceId?.name,
                                    value: regionalOfficceId?.id,
                                  }
                            }
                            // defaultValue={
                            //   poId.company_name
                            //     ? {
                            //         label: poId.regional_office_name,
                            //         value: poId.ro_id,
                            //       }
                            //     : {
                            //         label: regionalOfficceId?.name,
                            //         value: regionalOfficceId?.id,
                            //       }
                            // }
                          />
                          <ErrorMessage
                            name="billing_to_ro_office"
                            component="small"
                            className="text-danger"
                          />
                        </div>
                      </Form.Group>

                      <Form.Group as={Col} md={12}>
                        <div className="shadow p-3">
                          <Row className="g-3 align-items-center">
                            <Form.Group as={Col} md={4}>
                              <Form.Label>
                                Financial Year{" "}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <Select
                                menuPortalTarget={document.body}
                                name={"financial_year"}
                                value={props.values.financial_year}
                                options={allFinancialYear?.map((year) => ({
                                  label: year.year_name,
                                  value: year.year_name,
                                }))}
                                onChange={(selectedOption) => {
                                  props.setFieldValue(
                                    "financial_year",
                                    selectedOption
                                  );

                                  setSelectedFinYear(selectedOption.value);
                                  const finYearData = allFinancialYear.find(
                                    (itm) =>
                                      itm.year_name === selectedOption.value
                                  );
                                  props.setFieldValue(
                                    "measurement_date",
                                    isCurrentFinancialYear(finYearData)
                                      ? moment().format("YYYY-MM-DD")
                                      : finYearData.end_date
                                  );
                                }}
                                isInvalid={Boolean(
                                  props.touched.financial_year &&
                                    props.errors.financial_year
                                )}
                              />
                              <ErrorMessage
                                name="financial_year"
                                component="small"
                                className="text-danger"
                              />
                            </Form.Group>
                            <Form.Group as={Col} md={4}>
                              <Form.Label>
                                Date <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Control
                                type="date"
                                name="measurement_date"
                                value={props.values.measurement_date}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                disabled={
                                  !isCurrentFinancialYear(getSelecteFinYear())
                                }
                                isInvalid={Boolean(
                                  props.touched.measurement_date &&
                                    props.errors.measurement_date
                                )}
                                min={moment(
                                  getSelecteFinYear()?.start_date
                                ).format("YYYY-MM-DD")}
                                max={moment(
                                  getSelecteFinYear()?.end_date
                                ).format("YYYY-MM-DD")}
                              />
                              <Form.Control.Feedback type="invalid">
                                {props.errors.measurement_date}
                              </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md={4}>
                              <Form.Label className="d-block fw-bolder">
                                Po Number{" "}
                              </Form.Label>
                              <Select
                                menuPortalTarget={document.body}
                                name={"po_number"}
                                // value={props.values.po_number}
                                defaultValue={{ label: poId?.name }}
                                isDisabled={true}
                                onChange={(e) =>
                                  handlePIChange(e, props.setFieldValue)
                                }
                                isInvalid={Boolean(
                                  props.touched.po_number &&
                                    props.errors.po_number
                                )}
                              />
                              <ErrorMessage
                                name="po_number"
                                component="small"
                                className="text-danger"
                              />
                            </Form.Group>

                            <Form.Group as={Col} md={12}>
                              <Form.Label>
                                Measurement List{" "}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <Select
                                menuPortalTarget={document.body}
                                name={"measurement_list"}
                                value={props.values.measurement_list}
                                isMulti={true}
                                isDisabled={id != "new"}
                                options={measurementData?.map((itm) => ({
                                  label: itm.complaint_unique_id,
                                  value: itm.measurement_id,
                                }))}
                                onChange={(e) => {
                                  handleItemsOnMeasurementId(
                                    e,
                                    props.setFieldValue,
                                    props
                                  );
                                }}
                                isInvalid={Boolean(
                                  props.touched.measurement_list &&
                                    props.errors.measurement_list
                                )}
                              />
                              <ErrorMessage
                                name="measurement_list"
                                component="small"
                                className="text-danger"
                              />
                            </Form.Group>

                            {itemsOnMeasurementId?.length > 0 && (
                              <>
                                <div className="table-scroll  my-3">
                                  <Table className="text-body  Roles ">
                                    <tbody>
                                      {itemsOnMeasurementId.map(
                                        (Measurement, mainIndex) => {
                                          return (
                                            <>
                                              <tr>
                                                <th colSpan={12}>
                                                  <div className="d-flex justify-content-between">
                                                    <span>
                                                      complain number -{" "}
                                                      {
                                                        Measurement
                                                          ?.complaintDetails
                                                          ?.complaint_unique_id
                                                      }
                                                    </span>
                                                    <span>
                                                      <button
                                                        className="shadow border-0 purple-combo cursor-pointer px-2 py-1"
                                                        type="button"
                                                        onClick={() =>
                                                          navigate(
                                                            `/Measurements/CreateMeasurement/${Measurement?.measurement_list}`,
                                                            {
                                                              state: {
                                                                editFrom:
                                                                  "readyToPi",
                                                              },
                                                            }
                                                          )
                                                        }
                                                      >
                                                        Edit
                                                      </button>
                                                    </span>
                                                  </div>
                                                </th>
                                              </tr>

                                              <tr>
                                                <th></th>
                                                <th
                                                  style={{ maxWidth: "55px" }}
                                                >
                                                  Order Line
                                                </th>
                                                <th>Item Name</th>
                                                <th>Unit</th>
                                                <th>No.</th>
                                                <th>Length</th>
                                                <th>Breadth</th>
                                                <th>Depth</th>
                                                <th>Qty</th>
                                                <th>Total Qty</th>
                                                <th>Rate</th>
                                                <th>Amount</th>
                                              </tr>

                                              {Measurement?.items_data?.map(
                                                (parentItem, parentIndex) => (
                                                  <>
                                                    <tr
                                                      key={parentIndex}
                                                      className="bg-light"
                                                    >
                                                      <td>
                                                        <Form.Check
                                                          // checked={
                                                          //   id == "new"
                                                          //     ? true
                                                          //     : parentItem.is_status
                                                          // }

                                                          checked={true}
                                                          onClick={(e) =>
                                                            handleCheckboxChange(
                                                              e,
                                                              mainIndex,
                                                              parentIndex
                                                            )
                                                          }
                                                        />
                                                      </td>

                                                      <td>
                                                        {
                                                          parentItem?.order_line_number
                                                        }
                                                      </td>
                                                      <td>
                                                        {parentItem.item_name}
                                                      </td>
                                                      <td>{parentItem.unit}</td>
                                                      <td></td>
                                                      <td></td>
                                                      <td></td>
                                                      <td></td>
                                                      <td></td>
                                                      <td>
                                                        {parentItem.total_qty}
                                                      </td>
                                                      <td>{parentItem.rate}</td>
                                                      <td>
                                                        {parseFloat(
                                                          parentItem?.childArray?.reduce(
                                                            (total, itm) =>
                                                              total + +itm.qty,
                                                            0
                                                          ) * +parentItem.rate
                                                        ).toFixed(2)}
                                                      </td>
                                                    </tr>
                                                    {parentItem?.childArray?.map(
                                                      (
                                                        childItem,
                                                        childIndex
                                                      ) => (
                                                        <tr key={childIndex}>
                                                          <td></td>
                                                          <td></td>

                                                          <td colSpan={2}>
                                                            <BsRecord2 />{" "}
                                                            {
                                                              childItem?.description
                                                            }
                                                          </td>
                                                          <td>
                                                            {childItem?.no}
                                                          </td>
                                                          <td>
                                                            {childItem?.length}
                                                          </td>
                                                          <td>
                                                            {childItem?.breadth}
                                                          </td>
                                                          <td>
                                                            {childItem?.depth}
                                                          </td>
                                                          <td
                                                            className="text-start"
                                                            colSpan={5}
                                                          >
                                                            {childItem.qty}
                                                          </td>
                                                        </tr>
                                                      )
                                                    )}
                                                  </>
                                                )
                                              )}
                                            </>
                                          );
                                        }
                                      )}
                                    </tbody>
                                  </Table>
                                </div>
                              </>
                            )}
                            <Form.Group as={Col} md={12}>
                              <Form.Label>
                                work <span className="text-danger">*</span>
                              </Form.Label>
                              <TextareaAutosize
                                className="edit-textarea"
                                minRows={3}
                                name="work"
                                value={props.values.work}
                                onChange={props.handleChange}
                              />
                              <ErrorMessage
                                name="work"
                                component="small"
                                className="text-danger"
                              />
                            </Form.Group>
                          </Row>
                        </div>
                      </Form.Group>

                      <Form.Group as={Col} md={12}>
                        <div className="mt-4 text-center">
                          {editFrom != "final" && (
                            <button
                              type={`${id == "edit" ? "button" : "submit"}`}
                              onClick={() => setShowAlert(id == "edit" && true)}
                              disabled={props?.isSubmitting}
                              className="shadow border-0 purple-combo cursor-pointer px-4 py-1"
                            >
                              {props?.isSubmitting && !finalSubmit ? (
                                <>
                                  <Spinner
                                    animation="border"
                                    variant="primary"
                                    size="sm"
                                  />{" "}
                                  PLEASE WAIT...
                                </>
                              ) : (
                                <>{id == "edit" ? "UPDATE" : "SAVE"}</>
                              )}
                            </button>
                          )}
                          {id == "edit" && (
                            <button
                              type={`${id == "edit" ? "button" : "submit"}`}
                              onClick={() => {
                                setShowAlert2(true);
                                setFinalSubmit(true);
                              }}
                              disabled={props?.isSubmitting}
                              className="shadow border-0 purple-combo cursor-pointer px-4 py-1 mx-2"
                            >
                              {props?.isSubmitting && finalSubmit ? (
                                <>
                                  <Spinner
                                    animation="border"
                                    variant="primary"
                                    size="sm"
                                  />{" "}
                                  PLEASE WAIT...
                                </>
                              ) : (
                                <>Final Submit</>
                              )}
                            </button>
                          )}
                          <ConfirmAlert
                            size={"sm"}
                            deleteFunction={props.handleSubmit}
                            hide={setShowAlert}
                            show={showAlert}
                            title={"Confirm UPDATE"}
                            description={
                              "Are you sure you want to update this!!"
                            }
                          />

                          <ConfirmAlert
                            size={"sm"}
                            deleteFunction={props.handleSubmit}
                            hide={setShowAlert2}
                            show={showAlert2}
                            title={"Confirm Submit"}
                            description={"Are you sure you want to Submit"}
                          />
                        </div>
                      </Form.Group>
                    </>
                  )}
                </Row>
              </Form>
            )}
          </Formik>
        </CardComponent>
      </Col>
    </>
  );
};

export default CreatePerformaInvoice;
