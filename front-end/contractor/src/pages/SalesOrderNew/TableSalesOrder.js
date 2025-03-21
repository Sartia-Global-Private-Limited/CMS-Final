import { FieldArray } from "formik";
import React, { useState } from "react";
import { Col, Form, Table } from "react-bootstrap";
import Select from "react-select";
import TooltipComponent from "../../components/TooltipComponent";
import { BsChevronDown, BsChevronUp, BsDashLg, BsPlusLg } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import MyInput from "../../components/MyInput";
import { formatNumberToINR } from "../../utils/helper";

export default function TableSalesOrder({
  props,
  edit,
  gstTypesData,
  loading,
}) {
  const [collapsedRows, setCollapsedRows] = useState("");
  const { t } = useTranslation();

  const toggleRow = (index) => {
    if (collapsedRows === index) setCollapsedRows("");
    else setCollapsedRows(index);
  };
  return (
    <>
      <Form.Group as={Col} md={12}>
        <FieldArray name="so_items">
          {({ remove, push }) => (
            <>
              {props.values?.so_items?.length > 0 && (
                <Table className="text-body Roles">
                  <thead>
                    <tr>
                      <th style={{ minWidth: "80px" }}>
                        {t("Order Line Number")}
                      </th>
                      <th style={{ minWidth: "80px" }}>{t("Hsn Code")}</th>
                      <th style={{ minWidth: "200px" }}>{t("Item Name")}</th>
                      <th style={{ minWidth: "100px" }}>{t("unit")}</th>
                      <th style={{ minWidth: "120px" }}>
                        {t("change gst type")}
                      </th>
                      <th style={{ minWidth: "120px" }}>{t("gst type")}</th>
                      <th style={{ minWidth: "60px" }}>{t("gst")} %</th>
                      <th style={{ minWidth: "95px" }}>{t("rate")}</th>
                      <th style={{ minWidth: "80px" }}>{t("quantity")}</th>
                      <th style={{ minWidth: "95px" }}>{t("Amount")}</th>
                      <th style={{ minWidth: "90px" }}>{t("Action")}</th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={9}>
                          <img
                            className="p-3"
                            width="250"
                            src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
                            alt="Loading"
                          />
                        </td>
                      </tr>
                    ) : (
                      props.values?.so_items?.map((itm, index) => (
                        <>
                          <tr key={index}>
                            <td>
                              <MyInput
                                name={`so_items.${index}.order_line_number`}
                                formikProps={props}
                              />
                            </td>

                            <td>
                              <MyInput
                                name={`so_items.${index}.hsn_code`}
                                formikProps={props}
                              />
                            </td>
                            <td className="text-start" width={230}>
                              <MyInput
                                name={`so_items.${index}.name`}
                                formikProps={props}
                              />
                            </td>

                            <td>
                              <MyInput
                                name={`so_items.${index}.unit`}
                                formikProps={props}
                              />
                            </td>

                            <td>
                              <MyInput
                                name={`so_items.[${index}].change_gst_type`}
                                formikProps={props}
                                customType={"select"}
                                selectProps={{
                                  data: [
                                    {
                                      label: "individual",
                                      value: "1",
                                    },
                                    {
                                      label: "overall",
                                      value: "0",
                                    },
                                  ],
                                  onChange: (e) => {
                                    if (e?.value == "1") {
                                      const subTotal = +itm.qty * +itm.rate;

                                      const totalGSTAmount =
                                        subTotal * (itm.gst_percent / 100);

                                      props.setFieldValue(
                                        `so_items.${index}.total_gst_amount`,
                                        +totalGSTAmount.toFixed(2)
                                      );
                                    } else {
                                      props.setFieldValue(
                                        `so_items.${index}.amount`,
                                        itm.qty * itm.rate
                                      );
                                    }
                                  },
                                }}
                              />
                            </td>

                            {props.values.so_items[index].change_gst_type ==
                            "1" ? (
                              <>
                                <td>
                                  <Select
                                    menuPortalTarget={document.body}
                                    name={`so_items.${index}.gst_id`}
                                    value={
                                      edit?.id && {
                                        label: itm?.gst_type,
                                        percentage: itm?.gst_percent,
                                        value: itm?.gst_id?.value,
                                      }
                                    }
                                    options={gstTypesData?.map((itm) => ({
                                      label: itm.title,
                                      value: itm.id,
                                      percentage: itm.percentage,
                                    }))}
                                    onChange={(e) => {
                                      props.setFieldValue(
                                        `so_items.${index}.gst_type`,
                                        e.label
                                      );

                                      const subTotal = +itm.qty * +itm.rate;
                                      const totalGSTAmount =
                                        subTotal * (e.percentage / 100);

                                      props.setFieldValue(
                                        `so_items.${index}.amount`,
                                        +subTotal
                                      );

                                      props.setFieldValue(
                                        `so_items.${index}.total_gst_amount`,
                                        +totalGSTAmount.toFixed(2)
                                      );

                                      props.setFieldValue(
                                        `so_items.${index}.gst_percent`,
                                        e.percentage
                                      );
                                      props.setFieldValue(
                                        `so_items.${index}.gst_id`,
                                        e
                                      );
                                    }}
                                  />
                                </td>
                                <td className="text-center">
                                  {itm.gst_percent || "-"}
                                </td>
                              </>
                            ) : (
                              <>
                                <td>-</td>
                                <td>-</td>
                              </>
                            )}

                            <td>
                              <MyInput
                                name={`so_items.${index}.rate`}
                                formikProps={props}
                                type="number"
                                onChange={(e) => {
                                  props.setFieldValue(
                                    `so_items.${index}.rate`,
                                    +e.target.value
                                  );

                                  const subTotal =
                                    +e.target.value * +itm?.qty || 0;

                                  const totalGSTAmount =
                                    subTotal * (itm.gst_percent / 100);

                                  props.setFieldValue(
                                    `so_items.${index}.total_gst_amount`,
                                    +totalGSTAmount.toFixed(2)
                                  );

                                  props.setFieldValue(
                                    `so_items.${index}.amount`,
                                    parseFloat(subTotal).toFixed(2)
                                  );
                                }}
                              />
                            </td>

                            <td>
                              <MyInput
                                name={`so_items.${index}.qty`}
                                type="number"
                                disabled={props.values.so_for == "2"}
                                onChange={(e) => {
                                  props.setFieldValue(
                                    `so_items.${index}.qty`,
                                    e.target.value
                                  );
                                  const subTotal = +e.target.value * itm?.rate;

                                  if (itm.change_gst_type != "1")
                                    props.setFieldValue(
                                      `so_items.${index}.amount`,
                                      parseFloat(subTotal).toFixed(2)
                                    );
                                  else {
                                    const totalGSTAmount =
                                      subTotal * (itm.gst_percent / 100);

                                    props.setFieldValue(
                                      `so_items.${index}.amount`,
                                      parseFloat(subTotal).toFixed(2)
                                    );

                                    props.setFieldValue(
                                      `so_items.${index}.total_gst_amount`,
                                      +totalGSTAmount.toFixed(2)
                                    );
                                  }
                                }}
                              />
                            </td>

                            <td>
                              <span>
                                {props.values.so_for == "2"
                                  ? 0
                                  : formatNumberToINR(itm.amount)}
                              </span>
                            </td>

                            <td className="">
                              <>
                                <span
                                  className={`mx-2 cursor-pointer  text-${
                                    collapsedRows === index ? "danger" : "green"
                                  }`}
                                  onClick={() => toggleRow(index)}
                                >
                                  {collapsedRows === index ? (
                                    <BsChevronUp fontSize="15px" />
                                  ) : (
                                    <BsChevronDown fontSize="15px" />
                                  )}
                                </span>

                                {index === 0 ? (
                                  <TooltipComponent title={"Add"}>
                                    <BsPlusLg
                                      onClick={() =>
                                        push({
                                          order_line_number: "",
                                          hsn_code: "",
                                          name: "",
                                          unit: "",
                                          change_gst_type: "0",
                                          gst_id:
                                            edit?.so_for === "1"
                                              ? ""
                                              : undefined,
                                          gst_percent:
                                            edit?.so_for === "1"
                                              ? ""
                                              : undefined,
                                          rate: "",
                                          qty: "",
                                          amount: "",
                                        })
                                      }
                                      className={`social-btn success-combo`}
                                    />
                                  </TooltipComponent>
                                ) : (
                                  <TooltipComponent title={"Remove"}>
                                    <BsDashLg
                                      onClick={() => remove(index)}
                                      className={`social-btn red-combo`}
                                    />
                                  </TooltipComponent>
                                )}
                              </>
                            </td>
                          </tr>
                          {collapsedRows === index && (
                            <tr>
                              <td colSpan={12}>
                                <MyInput
                                  name={`so_items.${index}.description`}
                                  formikProps={props}
                                  customType={"multiline"}
                                  placeholder="Enter Item Description"
                                />
                              </td>
                            </tr>
                          )}
                        </>
                      ))
                    )}
                  </tbody>
                </Table>
              )}
            </>
          )}
        </FieldArray>
      </Form.Group>
    </>
  );
}
