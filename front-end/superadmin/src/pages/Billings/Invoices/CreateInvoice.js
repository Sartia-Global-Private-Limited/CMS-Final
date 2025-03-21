import React, { useEffect } from "react";
import { Col, Form, Row, Spinner, Stack, Table } from "react-bootstrap";
import Select from "react-select";
import { ErrorMessage, Formik } from "formik";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { toast } from "react-toastify";
import { useState } from "react";
import { Helmet } from "react-helmet";
import moment from "moment";
import { BsRecord2 } from "react-icons/bs";
import {
  fetchPerformaListing,
  getAllFinancialYears,
  getDetailsOfFinalMergeToPI,
  getInvoiceDetails,
  postInvoice,
  updateInvoice,
} from "../../../services/contractorApi";
import CardComponent from "../../../components/CardComponent";
import {
  addInvoiceSchema1,
  addPerformaInvoiceSchema,
} from "../../../utils/formSchema";
import { isCurrentFinancialYear } from "../../../utils/helper";
import ConfirmAlert from "../../../components/ConfirmAlert";

const CreateInvoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const selectedPI = location?.state?.selectedPI;
  const billing_to = location?.state?.billing_to;
  const po_number = location?.state?.po_number;
  const regional_office = location?.state?.regional_office;
  const billing_from = location?.state?.billing_from;
  const [edit, setEdit] = useState({});
  const [allFinancialYear, setAllFinancialYear] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [measurementData, setMeasurementData] = useState([]);
  const [itemsOnPerformaId, setItemsOnPerformaId] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [selectedFinYear, setSelectedFinYear] = useState("");

  const fetchProformaInvoiceData = async () => {
    const res = await getInvoiceDetails(id);
    if (res.status) {
      setEdit(res.data[0]);
      setItemsOnPerformaId(res.data[0].getMeasurements);
    } else {
      setEdit([]);
    }
  };

  const getSelecteFinYear = () => {
    const finYearData = allFinancialYear.find(
      (itm) => itm.year_name === selectedFinYear
    );
    return finYearData;
  };

  const showFinancialYearApi = async () => {
    const res = await getAllFinancialYears();
    if (res.status) {
      setAllFinancialYear(res.data);
    } else {
      setAllFinancialYear([]);
    }
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
        setItemsOnPerformaId([]);
        setFieldValue("measurement_list", "");
        setSelectedItems([]);
        return;
      }

      setItemsOnPerformaId(
        itemsOnPerformaId.filter(
          (item) => item.bill_no != removedItems[0].label
        )
      );

      setFieldValue("measurement_list", val);
      setSelectedItems(
        selectedItems.filter((data) => data.bill_no != removedItems[0].value)
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
    if (id == "new") fetchMeasurementData();
  }, []);

  const fetchItemsOnMeasurementId = async (e) => {
    const res = await getDetailsOfFinalMergeToPI(e);
    if (res.status) {
      setItemsOnPerformaId([...itemsOnPerformaId, res.data]);
    } else {
      setItemsOnPerformaId([]);
      toast.error(res.message);
    }
  };

  const fetchMeasurementData = async (e) => {
    const res = await fetchPerformaListing(selectedPI);
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
    showFinancialYearApi();
  }, []);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const pi_ids = values?.measurement_list?.map((items) => {
      return items.value;
    });

    const sData = {
      financial_year: values.financial_year.value,
      callup_number: values.callup_number,
      invoice_date: values.invoice_date,
      pi_id: pi_ids,
      billing_to: billing_to,
      companies_for: values.complaint_for,
      billing_from,
      regional_office,
      po_number,
    };

    const updatePayload = {
      financial_year: values.financial_year.value,
      callup_number: values.callup_number,
      invoice_date: values.invoice_date,
      id: edit.id,
    };

    // return console.log(updatePayload, "sData");

    const res =
      id !== "new"
        ? await updateInvoice(updatePayload)
        : await postInvoice(sData);
    if (res.status) {
      toast.success(res.message);
      navigate(-1);
      resetForm();
    } else {
      toast.error(res.message);
    }
    setSubmitting(false);
    // setShowAlert(false);
  };
  return (
    <>
      <Helmet>
        <title>
          {id == "edit" ? "Update" : "Create"} Invoice · CMS Electricals
        </title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CardComponent
          // className={type === "view" && "after-bg-light"}
          title={`${id != "new" ? "Update" : "Create"}  Invoice`}
        >
          <Formik
            enableReinitialize={true}
            initialValues={{
              financial_year: edit.financial_year
                ? {
                    label: edit?.financial_year,
                    value: edit.financial_year,
                  }
                : "",
              callup_number: edit.callup_number ? edit?.callup_number : "",
              invoice_date: edit.invoice_date ? edit.invoice_date : "",

              complaint_for:
                measurementData.length > 0
                  ? measurementData[0].complaint_for
                  : "",

              measurement_list:
                edit?.pi_bill?.length > 0
                  ? edit.pi_bill.map((item) => {
                      return {
                        label: item,
                        value: item,
                      };
                    })
                  : "",

              measurement_date: edit.measurement_date
                ? moment(edit.measurement_date).format("YYYY-MM-DD")
                : moment().format("YYYY-MM-DD"),
            }}
            validationSchema={addInvoiceSchema1}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props?.handleSubmit}>
                <Row className="g-3">
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
                                (itm) => itm.year_name === selectedOption.value
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
                            name="invoice_date"
                            value={props.values.invoice_date}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            isInvalid={Boolean(
                              props.touched.measurement_date &&
                                props.errors.measurement_date
                            )}
                            // min={moment(getSelecteFinYear()?.start_date).format(
                            //   "YYYY-MM-DD"
                            // )}
                            // max={moment(getSelecteFinYear()?.end_date).format(
                            //   "YYYY-MM-DD"
                            // )}
                          />
                          <ErrorMessage
                            name="invoice_date"
                            component="small"
                            className="text-danger"
                          />
                        </Form.Group>

                        <Form.Group as={Col} md={4}>
                          <Form.Label>
                            Callup Number <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            maxLength={10}
                            placeholder="+91 9500112233"
                            type="number"
                            name="callup_number"
                            value={props.values.callup_number}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            isInvalid={Boolean(
                              props.touched.callup_number &&
                                props.errors.callup_number
                            )}
                          />
                          <ErrorMessage
                            name="callup_number"
                            component="small"
                            className="text-danger"
                          />
                        </Form.Group>

                        <Form.Group as={Col} md={12}>
                          <Form.Label>
                            Performa List <span className="text-danger">*</span>
                          </Form.Label>
                          <Select
                            menuPortalTarget={document.body}
                            name={"measurement_list"}
                            value={props.values.measurement_list}
                            isMulti={true}
                            isDisabled={id != "new"}
                            options={measurementData?.map((itm) => ({
                              label: itm.bill_no,
                              value: itm.id,
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

                        {itemsOnPerformaId?.length > 0 && (
                          <>
                            <div className="table-scroll  my-3">
                              <Table className="text-body  Roles">
                                <tbody>
                                  {itemsOnPerformaId.map(
                                    (Measurement, mainIndex) => {
                                      return (
                                        <>
                                          <tr>
                                            <th colSpan={12}>
                                              <span>
                                                PI number -{" "}
                                                {Measurement.bill_no}
                                              </span>
                                            </th>
                                          </tr>
                                          {Measurement?.getMeasurements?.map(
                                            (item, Index) => {
                                              return (
                                                <>
                                                  <th colSpan={12}>
                                                    <div className="d-flex justify-content-between">
                                                      <span>
                                                        complain number -{" "}
                                                        {
                                                          item?.complaintDetails
                                                            ?.complaint_unique_id
                                                        }
                                                      </span>
                                                      <span>
                                                        <button
                                                          className="shadow border-0 purple-combo cursor-pointer px-2 py-1"
                                                          type="button"
                                                          onClick={() =>
                                                            navigate(
                                                              `/Measurements/CreateMeasurement/${item?.measurement_list}`,
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

                                                  <tr></tr>

                                                  <tr>
                                                    <th></th>
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

                                                  {item.items_data.map(
                                                    (
                                                      parentItem,
                                                      parentIndex
                                                    ) => {
                                                      return (
                                                        <>
                                                          <tr
                                                            key={Index}
                                                            className="bg-light"
                                                          >
                                                            <td>
                                                              <Form.Check
                                                                checked={true}
                                                                // onClick={(
                                                                //   e
                                                                // ) =>
                                                                //   handleCheckboxChange(
                                                                //     e,
                                                                //     mainIndex,
                                                                //     parentIndex
                                                                //   )
                                                                // }
                                                              />
                                                            </td>
                                                            <td>
                                                              {
                                                                parentItem.item_name
                                                              }
                                                            </td>
                                                            <td>
                                                              {parentItem.unit}
                                                            </td>
                                                            <td></td>
                                                            <td></td>
                                                            <td></td>
                                                            <td></td>
                                                            <td></td>
                                                            <td>
                                                              {
                                                                parentItem.total_qty
                                                              }
                                                            </td>
                                                            <td>
                                                              {parentItem.rate}
                                                            </td>
                                                            <td>
                                                              {parseFloat(
                                                                parentItem?.childArray?.reduce(
                                                                  (
                                                                    total,
                                                                    itm
                                                                  ) =>
                                                                    total +
                                                                    +itm.qty,
                                                                  0
                                                                ) *
                                                                  +parentItem.rate
                                                              ).toFixed(2)}
                                                            </td>
                                                          </tr>
                                                          {parentItem?.childArray?.map(
                                                            (
                                                              childItem,
                                                              childIndex
                                                            ) => (
                                                              <tr
                                                                key={childIndex}
                                                              >
                                                                <td></td>
                                                                <td colSpan={2}>
                                                                  <BsRecord2 />{" "}
                                                                  {
                                                                    childItem?.description
                                                                  }
                                                                </td>
                                                                <td>
                                                                  {
                                                                    childItem?.no
                                                                  }
                                                                </td>
                                                                <td>
                                                                  {
                                                                    childItem?.length
                                                                  }
                                                                </td>
                                                                <td>
                                                                  {
                                                                    childItem?.breadth
                                                                  }
                                                                </td>
                                                                <td>
                                                                  {
                                                                    childItem?.depth
                                                                  }
                                                                </td>
                                                                <td
                                                                  className="text-start"
                                                                  colSpan={5}
                                                                >
                                                                  {
                                                                    childItem.qty
                                                                  }
                                                                </td>
                                                              </tr>
                                                            )
                                                          )}
                                                        </>
                                                      );
                                                    }
                                                  )}
                                                </>
                                              );
                                            }
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
                      </Row>
                    </div>
                  </Form.Group>

                  <Form.Group as={Col} md={12}>
                    <div className="mt-4 text-center">
                      <button
                        type={`${id != "new" ? "button" : "submit"}`}
                        onClick={() => setShowAlert(id != "new" && true)}
                        disabled={props?.isSubmitting}
                        className="shadow border-0 purple-combo cursor-pointer px-4 py-1"
                      >
                        {props?.isSubmitting ? (
                          <>
                            <Spinner
                              animation="border"
                              variant="primary"
                              size="sm"
                            />{" "}
                            PLEASE WAIT...
                          </>
                        ) : (
                          <>{id != "new" ? "UPDATE" : "SAVE"}</>
                        )}
                      </button>

                      <ConfirmAlert
                        size={"sm"}
                        deleteFunction={props.handleSubmit}
                        hide={setShowAlert}
                        show={showAlert}
                        title={"Confirm UPDATE"}
                        description={"Are you sure you want to update this!!"}
                      />
                    </div>
                  </Form.Group>
                </Row>
              </Form>
            )}
          </Formik>
        </CardComponent>
      </Col>
    </>
  );
};

export default CreateInvoice;
