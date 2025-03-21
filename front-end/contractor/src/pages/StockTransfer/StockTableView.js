import { ErrorMessage, Field } from "formik";
import React, { memo, useEffect, useState } from "react";
import { Col, Form, Table } from "react-bootstrap";
import {
  BsChevronDown,
  BsChevronUp,
  BsDashLg,
  BsExclamationCircleFill,
  BsPlusLg,
  BsThreeDotsVertical,
} from "react-icons/bs";
import Select from "react-select";
import ReactTextareaAutosize from "react-textarea-autosize";
import {
  getFundRequest4LowPriceOnItemId,
  getFundRequest4SubLowPriceOnItemId,
  getFundRequestDetailsOnItemId,
} from "../../services/contractorApi";

const StockTableView = ({
  props,
  main,
  id,
  pushFund,
  removeFund,
  edit,
  type,
  itemMasterData,
  setBill_Amount,
}) => {
  const [collapsedRows, setCollapsedRows] = useState([]);
  const [collapsedSubRows, setCollapsedSubRows] = useState("-1");
  const [lowPrice, setLowPrice] = useState([]);
  const [subLowPrice, setSubLowPrice] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (main?.request_stock[0]?.item_name) {
      main?.request_stock?.map((itm, index) => {
        handleFundRequestDetails(
          itm?.item_name?.value,
          id,
          props.setFieldValue,
          index,
          itm?.item_name?.hsncode
        );
      });
    }
  }, [main]);

  const toggleSubRow = (index, id, supplierId) => {
    setCollapsedSubRows((e) =>
      e == index.toString() + id.item_name.value.toString()
        ? "-1"
        : index.toString() + id.item_name.value.toString()
    );
    fetch4SubLowPriceData(id.item_name.value, supplierId);
  };

  const toggleRow = (index) => {
    setCollapsedRows((prev) => {
      const isCollapsed = prev.includes(index);
      if (isCollapsed) {
        return prev.filter((rowIndex) => rowIndex !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const fetch4LowPriceData = async (index, hsncode) => {
    setLoading(true);
    const res = await getFundRequest4LowPriceOnItemId(hsncode);
    if (res.status) {
      setLowPrice((prevData) => {
        return { ...prevData, [index]: res.data };
      });
    } else {
      setLowPrice([]);
    }
    setLoading(false);
  };

  const fetch4SubLowPriceData = async (id, supplierId) => {
    setSubLowPrice([]);
    const res = await getFundRequest4SubLowPriceOnItemId(id, supplierId);
    if (res.status) {
      setSubLowPrice(res.data);
    } else {
      setSubLowPrice([]);
    }
  };

  const handleFundRequestDetails = async (
    id,
    userById,
    setFieldValue,
    index,
    hsncode
  ) => {
    const res = await getFundRequestDetailsOnItemId(id);
    if (res.status) {
      setFieldValue(
        `request_data[${userById}].request_stock[${index}].current_user_stock`,
        res.data.request_qty
      );
      setFieldValue(
        `request_data[${userById}].request_stock[${index}].previous_price`,
        res.data.item_price
      );
    } else {
      setFieldValue(
        `request_data[${userById}].request_stock[${index}].current_user_stock`,
        0
      );
      setFieldValue(
        `request_data[${userById}].request_stock[${index}].previous_price`,
        0
      );
    }
    fetch4LowPriceData(index, hsncode);
  };

  const formatOptionLabel = ({ label, unique_id, image, imgBase64Format }) => (
    <div className="d-flex">
      {imgBase64Format ? (
        <img
          src={
            image
              ? image
              : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
          }
          className="avatar me-2"
        />
      ) : (
        <img
          src={
            image
              ? `${process.env.REACT_APP_API_URL}${image}`
              : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
          }
          className="avatar me-2"
        />
      )}
      <span className="small d-grid">
        <span>{label}</span>
        <span className="text-gray">({unique_id})</span>
      </span>
    </div>
  );

  const billAmount =
    (main?.request_stock?.reduce(
      (total, itm) => total + +itm?.transfer_qty * itm.approve_price || 0,
      0
    ) ?? 0) +
    (main?.new_request_stock?.reduce(
      (total, itm) => total + +itm?.transfer_qty * itm.rate || 0,
      0
    ) ?? 0);

  setBill_Amount(billAmount);

  return (
    <>
      <Form.Group as={Col} md={12}>
        <div className="stable-scroll">
          {main?.request_stock.length > 0 && (
            <>
              <h6 className=""> Transfer Stock</h6>
              <Table striped className="text-body bg-new Roles">
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>User Stock</th>
                    <th>Crnt Price</th>
                    <th>Request Qty</th>
                    <th>sTOCK Amount</th>
                    <th>Approve Qty</th>
                    <th>Approve Price</th>
                    <th>Eligible Transfer Quantity</th>
                    <th>Transfer qty</th>

                    <th>
                      <BsThreeDotsVertical />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {main?.request_stock.map((itm, index) => (
                    <>
                      <tr key={index}>
                        <td width={160}>
                          <Select
                            className="text-start"
                            menuPortalTarget={document.body}
                            isDisabled
                            name={`transfer_data[${id}].request_stock[${index}].item_name`}
                            value={itm.item_name}
                            options={itemMasterData?.map((itm) => ({
                              label: itm.name,
                              value: itm.id,
                              unique_id: itm.unique_id,
                              rate: +itm.rate,
                              hsncode: itm.hsncode,
                              description: itm.description,
                              image: itm.image,
                            }))}
                            onChange={(e) => {
                              handleFundRequestDetails(
                                e.value,
                                id,
                                props.setFieldValue,
                                index,
                                e.hsncode
                              );
                              props.setFieldValue(
                                `transfer_data[${id}].request_stock[${index}].current_price`,
                                e.rate
                              );
                              props.setFieldValue(
                                `transfer_data[${id}].request_stock[${index}].item_name`,
                                e
                              );
                            }}
                            formatOptionLabel={formatOptionLabel}
                          />
                          <ErrorMessage
                            name={`transfer_data[${id}].request_stock[${index}].item_name`}
                            component="small"
                            className="text-danger"
                          />
                        </td>

                        <td>
                          <Form.Control
                            name={`transfer_data[${id}].request_stock[${index}].current_user_stock`}
                            placeholder="0"
                            type="number"
                            step="any"
                            value={itm.current_user_stock}
                            onChange={props.handleChange}
                            disabled
                          />
                          <ErrorMessage
                            name={`transfer_data[${id}].request_stock[${index}].current_user_stock`}
                            component="div"
                            className="field-error"
                          />
                        </td>

                        <td>
                          <Form.Control
                            name={`transfer_data[${id}].request_stock[${index}].current_item_price
                            `}
                            placeholder="0"
                            type="number"
                            step="any"
                            value={itm.current_item_price}
                            disabled
                            onChange={(e) => {
                              props.setFieldValue(
                                `transfer_data[${id}].request_stock[${index}].fund_amount`,
                                itm.request_quantity * e.target.value
                              );

                              props.setFieldValue(
                                `transfer_data[${id}].request_stock[${index}].current_price`,
                                e.target.value
                              );
                            }}
                          />
                          <ErrorMessage
                            name={`transfer_data[${id}].request_stock[${index}].current_price`}
                            component="div"
                            className="field-error"
                          />
                        </td>
                        <td>
                          <Form.Control
                            name={`transfer_data[${id}].request_stock[${index}].request_quantity`}
                            placeholder="0"
                            type="number"
                            step="any"
                            value={itm.request_quantity}
                            disabled
                            onChange={(e) => {
                              props.setFieldValue(
                                `transfer_data[${id}].request_stock[${index}].fund_amount`,
                                itm.current_price * +e.target.value
                              );

                              props.setFieldValue(
                                `transfer_data[${id}].request_stock[${index}].request_quantity`,
                                +e.target.value
                              );
                            }}
                          />
                          <ErrorMessage
                            name={`transfer_data[${id}].request_stock[${index}].request_quantity`}
                            component="small"
                            className="text-danger"
                          />
                        </td>
                        <td>
                          <Form.Control
                            name={`transfer_data[${id}].request_stock[${index}].fund_amount`}
                            placeholder="0"
                            type="number"
                            step="any"
                            value={itm.fund_amount}
                            disabled
                            onChange={props.handleChange}
                          />
                          <ErrorMessage
                            name={`transfer_data[${id}].request_stock[${index}].fund_amount`}
                            component="div"
                            className="field-error"
                          />
                        </td>
                        {edit?.approved_data ? (
                          <>
                            <td>
                              <Form.Control
                                disabled
                                name={`transfer_data[${id}].request_stock[${index}].approve_quantity
                        `}
                                type="number"
                                step="any"
                                value={itm.approve_quantity}
                              />
                            </td>
                            <td>
                              <Form.Control
                                placeholder="0"
                                disabled
                                type="number"
                                step="any"
                                value={itm.approve_price}
                              />
                            </td>
                          </>
                        ) : null}

                        <td>
                          <Form.Control
                            name={`remaining_quantity`}
                            placeholder="0"
                            type="number"
                            step="any"
                            value={
                              edit.transfer_stocks
                                ? edit.transfer_stocks.request_stock[index]
                                    .remaining_quantity
                                : itm.approve_quantity
                            }
                            disabled
                          />
                        </td>
                        <td>
                          <Form.Control
                            name={`transfer_data[${id}].request_stock[${index}].transfer_qty`}
                            placeholder="0"
                            disabled={type === "update"}
                            onBlur={props.handleBlur}
                            onChange={(e) => {
                              const inputValue = +e.target.value; // Convert input value to number
                              const remaining_quantity = edit.transfer_stocks
                                ? edit.transfer_stocks.request_stock[index]
                                    ?.remaining_quantity
                                : itm.approve_quantity;
                              const maxValue = remaining_quantity;

                              // Validation: Ensure the input value is greater than or equal to 0
                              if (inputValue >= 0 && inputValue <= maxValue) {
                                props.handleChange(e);

                                props.setFieldValue(
                                  `transfer_data[${id}].request_stock[${index}].transfer_qty`,
                                  inputValue
                                );

                                props.setFieldValue(
                                  `transfer_data[${id}].request_stock[${index}].remaining_quantity`,
                                  remaining_quantity - inputValue
                                );
                              } else if (inputValue < 0) {
                                // Reset to 0 if the input is less than 0
                                e.target.value = 0;
                                props.handleChange(e);
                                props.setFieldValue(
                                  `transfer_data[${id}].request_stock[${index}].transfer_qty`,
                                  0
                                );
                                props.setFieldValue(
                                  `transfer_data[${id}].request_stock[${index}].remaining_quantity`,
                                  remaining_quantity
                                );
                              } else {
                                // Set input value to maxValue if it exceeds
                                e.target.value = maxValue;
                                props.handleChange(e);
                                props.setFieldValue(
                                  `transfer_data[${id}].request_stock[${index}].transfer_qty`,
                                  maxValue
                                );
                                props.setFieldValue(
                                  `transfer_data[${id}].request_stock[${index}].remaining_quantity`,
                                  remaining_quantity - maxValue
                                );
                              }
                            }}
                          />
                          <div className="text-danger">
                            {
                              props.errors?.transfer_data?.[id]
                                ?.request_stock?.[index]?.transfer_qty
                            }
                          </div>
                        </td>

                        <td>
                          <span
                            className={`cursor-pointer text-${
                              collapsedRows.includes(index) ? "danger" : "green"
                            }`}
                            onClick={() => toggleRow(index)}
                          >
                            {collapsedRows.includes(index) ? (
                              <BsChevronUp fontSize={"large"} />
                            ) : (
                              <BsChevronDown fontSize={"large"} />
                            )}
                          </span>
                        </td>
                      </tr>
                      {collapsedRows.includes(index) && (
                        <>
                          <tr>
                            <td colSpan={15}>
                              {loading ? (
                                <p>Loading...</p>
                              ) : (
                                <Table striped>
                                  <thead>
                                    <th>top 4 low Price</th>
                                    <th>supplier</th>
                                    <th>Location</th>
                                    <th>State</th>
                                    <th>hsn code</th>
                                    <th>ru code</th>
                                    <th>rate</th>
                                    <th>:</th>
                                  </thead>
                                  <tbody>
                                    {lowPrice[index]?.length > 0 ? null : (
                                      <tr>
                                        <td colSpan={15}>
                                          <BsExclamationCircleFill
                                            fontSize={"large"}
                                            className="mb-2 text-danger"
                                          />
                                          <p className="mb-0">
                                            {" "}
                                            no data available{" "}
                                          </p>
                                        </td>
                                      </tr>
                                    )}
                                    {lowPrice[index]?.map((price, el) => {
                                      return (
                                        <>
                                          <tr key={el}>
                                            <td
                                              className={`fw-bold text-${
                                                el == 0
                                                  ? "green"
                                                  : el == 1
                                                  ? "warning"
                                                  : el == 2
                                                  ? "orange"
                                                  : "danger"
                                              }`}
                                              style={{
                                                fontSize:
                                                  el == 0
                                                    ? 15
                                                    : el == 1
                                                    ? 13
                                                    : el == 2
                                                    ? 12
                                                    : 10,
                                              }}
                                            >
                                              <Field
                                                type="radio"
                                                name={`transfer_data[${id}].request_stock[${index}].supplier_id`}
                                                value={price?.supplier_id}
                                                // checked={Boolean(
                                                //   props.values.supplier_id === price?.supplier_id
                                                // )}
                                                onChange={() => {
                                                  props.setFieldValue(
                                                    `transfer_data[${id}].request_stock[${index}].supplier_id`,
                                                    price?.supplier_id
                                                  );
                                                }}
                                                className="form-check-input"
                                              />{" "}
                                              {el + 1}
                                            </td>
                                            <td>
                                              {price?.supplier_name || "-"}
                                            </td>
                                            <td>
                                              {`${
                                                price?.shop_office_number || ""
                                              },
                                            ${price?.street_name || ""},
                                            ${price?.city || ""}`}
                                            </td>
                                            <td>{price?.state || "-"}</td>
                                            <td>{price?.hsncode || "-"}</td>
                                            <td>{price?.rucode || "-"}</td>
                                            <td>{price?.item_rate || "-"}</td>
                                            <td>
                                              <span
                                                className={`cursor-pointer text-green`}
                                                onClick={() => {
                                                  toggleSubRow(
                                                    el,
                                                    itm,
                                                    price?.supplier_id
                                                  );
                                                }}
                                              >
                                                {collapsedSubRows ==
                                                el.toString() +
                                                  itm.item_name.value.toString() ? (
                                                  <BsChevronUp
                                                    fontSize={"large"}
                                                  />
                                                ) : (
                                                  <BsChevronDown
                                                    fontSize={"large"}
                                                  />
                                                )}
                                              </span>
                                            </td>
                                          </tr>
                                          {collapsedSubRows ==
                                          el.toString() +
                                            itm.item_name.value.toString() ? (
                                            <>
                                              <tr>
                                                <td colSpan={15}>
                                                  {loading ? (
                                                    <p>Loading...</p>
                                                  ) : (
                                                    <Table striped>
                                                      <thead>
                                                        <th>
                                                          last 3 low Price
                                                        </th>
                                                        <th>item name</th>
                                                        <th>item price</th>
                                                        <th>date</th>
                                                      </thead>
                                                      <tbody>
                                                        {subLowPrice?.length >
                                                        0 ? null : (
                                                          <tr>
                                                            <td colSpan={15}>
                                                              <BsExclamationCircleFill
                                                                fontSize={
                                                                  "large"
                                                                }
                                                                className="mb-2 text-danger"
                                                              />
                                                              <p className="mb-0">
                                                                {" "}
                                                                no data
                                                                available{" "}
                                                              </p>
                                                            </td>
                                                          </tr>
                                                        )}
                                                        {subLowPrice?.map(
                                                          (subPrice, idx) => {
                                                            return (
                                                              <tr key={idx}>
                                                                <td>Details</td>
                                                                <td>
                                                                  {subPrice?.item_name ||
                                                                    "-"}
                                                                </td>
                                                                <td>
                                                                  {subPrice?.item_price ||
                                                                    "-"}
                                                                </td>
                                                                <td>
                                                                  {subPrice?.date ||
                                                                    "-"}
                                                                </td>
                                                              </tr>
                                                            );
                                                          }
                                                        )}
                                                      </tbody>
                                                    </Table>
                                                  )}
                                                </td>
                                              </tr>
                                            </>
                                          ) : null}
                                        </>
                                      );
                                    })}
                                  </tbody>
                                </Table>
                              )}
                            </td>
                          </tr>
                        </>
                      )}
                    </>
                  ))}
                </tbody>
              </Table>
            </>
          )}

          {/* {main?.request_stock.length > 0 && (
            <div className="d-flex justify-content-end">
              <div className="text-end fw-bold">
                Total Transfer Stock Quantity{" "}
                {main?.request_stock.reduce(
                  (total, itm) => total + +itm?.transfer_qty || 0,
                  0
                )}
              </div>
            </div>
          )} */}

          {main?.request_stock.length > 0 && (
            <div className="d-flex justify-content-end">
              <div className="text-end fw-bold">
                Total Transfer Stock Amount{" "}
                {main?.request_stock.reduce(
                  (total, itm) =>
                    total + +itm?.transfer_qty * itm.approve_price || 0,
                  0
                )}
              </div>
            </div>
          )}

          {main?.new_request_stock.length > 0 && (
            <>
              <h6 className="my-3">New Transfer Stock</h6>
              <Table
                // style={{ width: "max-content" }}
                striped
                className="text-body bg-new Roles"
              >
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>request rate</th>
                    <th>request quantity</th>
                    <th>Approved rate</th>
                    <th>Approved quantity</th>
                    <th>Fund Amount </th>
                    <th>Eligible Transfer Quantity </th>
                    <th>Transfer quantity </th>
                  </tr>
                </thead>
                <tbody>
                  {main?.new_request_stock.map((itm, index) => (
                    <>
                      <tr key={index}>
                        <td width={160}>
                          <Select
                            className="text-start"
                            menuPortalTarget={document.body}
                            isDisabled
                            name={`transfer_data[${id}].request_stock[${index}].item_name`}
                            value={{
                              label: itm?.title?.label,
                              image: itm?.item_image,
                              imgBase64Format: false,
                            }}
                            defaultValue={itm?.title}
                            onChange={(e) => {
                              handleFundRequestDetails(
                                e.value,
                                id,
                                props.setFieldValue,
                                index,
                                e.hsncode
                              );
                              props.setFieldValue(
                                `request_data[${id}].new_request_stock[${index}].current_price`,
                                e.rate
                              );
                              props.setFieldValue(
                                `request_data[${id}].new_request_stock[${index}].item_name`,
                                e
                              );
                            }}
                            formatOptionLabel={formatOptionLabel}
                          />
                          <ErrorMessage
                            name={`request_data[${id}].new_request_stock[${index}].item_name`}
                            component="small"
                            className="text-danger"
                          />
                        </td>
                        <td>
                          <Form.Control
                            name={`request_data[${id}].request_stock[${index}].requested_rate`}
                            placeholder="0"
                            type="number"
                            step="any"
                            value={itm?.requested_rate}
                            disabled
                          />
                          <ErrorMessage
                            name={`request_data[${id}].request_stock[${index}].requested_rate`}
                            component="div"
                            className="field-error"
                          />
                        </td>
                        <td>
                          <Form.Control
                            name={`request_data[${id}].request_stock[${index}].requested_qty`}
                            placeholder="0"
                            type="number"
                            step="any"
                            value={itm?.requested_qty}
                            disabled
                          />
                          <ErrorMessage
                            name={`request_data[${id}].request_stock[${index}].requested_qty`}
                            component="div"
                            className="field-error"
                          />
                        </td>
                        <td>
                          <Form.Control
                            name={`request_data[${id}].request_stock[${index}].current_price`}
                            placeholder="0"
                            type="number"
                            step="any"
                            value={itm?.rate}
                            disabled
                          />
                          <ErrorMessage
                            name={`request_data[${id}].request_stock[${index}].current_price`}
                            component="div"
                            className="field-error"
                          />
                        </td>

                        <td>
                          <Form.Control
                            name={`request_data[${id}].new_request_stock[${index}].qty`}
                            placeholder="0"
                            type="number"
                            step="any"
                            value={itm?.qty}
                            onChange={props.handleChange}
                            disabled
                          />
                          <ErrorMessage
                            name={`request_data[${id}].request_stock[${index}].qty`}
                            component="div"
                            className="field-error"
                          />
                        </td>

                        <td>
                          <Form.Control
                            name={`request_data[${id}].request_stock[${index}].fund_amount`}
                            placeholder="0"
                            type="number"
                            step="any"
                            value={itm?.fund_amount}
                            disabled
                          />
                          <ErrorMessage
                            name={`request_data[${id}].new_request_stock[${index}].fund_amount`}
                            component="small"
                            className="text-danger"
                          />
                        </td>

                        <td>
                          <Form.Control
                            name={`remaining_quantity`}
                            placeholder="0"
                            type="number"
                            step="any"
                            value={
                              edit?.transfer_stocks
                                ? edit?.transfer_stocks?.new_request_stock?.[
                                    index
                                  ]?.remaining_quantity
                                : itm?.approved_qty
                            }
                            disabled
                          />
                        </td>

                        <td>
                          <Form.Control
                            name={`transfer_data[${id}].new_request_stock[${index}].transfer_qty`}
                            value={itm?.transfer_qty}
                            disabled={type == "update"}
                            placeholder="0"
                            onChange={(e) => {
                              const inputValue = e.target.value;
                              const remaining_quantity = edit.transfer_stocks
                                ? edit.transfer_stocks.new_request_stock[index]
                                    .remaining_quantity
                                : itm.approved_qty;
                              const maxValue = remaining_quantity;

                              if (inputValue <= maxValue) {
                                props.handleChange(e);
                                props.setFieldValue(
                                  `transfer_data[${id}].new_request_stock[${index}].transfer_qty`,
                                  +e.target.value
                                );
                                props.setFieldValue(
                                  `transfer_data[${id}].new_request_stock[${index}].remaining_quantity`,
                                  remaining_quantity - +e.target.value
                                );
                              } else {
                                e.target.value = maxValue;
                                props.handleChange(e);
                                props.setFieldValue(
                                  `transfer_data[${id}].new_request_stock[${index}].transfer_qty`,
                                  +e.target.value
                                );
                                props.setFieldValue(
                                  `transfer_data[${id}].new_request_stock[${index}].remaining_quantity`,
                                  remaining_quantity - +e.target.value
                                );
                              }
                            }}
                          />

                          <ErrorMessage
                            name={`request_data[${id}].new_request_stock[${index}].transfer_qty`}
                            component="div"
                            className="field-error"
                          />
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </Table>
            </>
          )}

          {/* {main?.new_request_stock.length > 0 && (
            <div className="d-flex justify-content-end ">
              <div className="text-end fw-bold">
                Total New Transfer Quantity{" "}
                {main?.new_request_stock?.reduce(
                  (total, itm) => total + +itm?.transfer_qty || 0,
                  0
                )}
              </div>
            </div>
          )} */}

          {main?.new_request_stock.length > 0 && (
            <div className="d-flex justify-content-end ">
              <div className="text-end fw-bold">
                Total New Transfer Amount{" "}
                {main?.new_request_stock?.reduce(
                  (total, itm) => total + +itm?.transfer_qty * itm.rate || 0,
                  0
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-2 text-end fs-6 fw-bold">
          Final Transfer Amount: {billAmount}
        </div>
      </Form.Group>

      {/* <div className="mt-2 text-end fs-6 fw-bold">
        Final Transfer Quantity{" "}
        {(main?.request_stock?.reduce(
          (total, itm) => total + +itm?.transfer_qty || 0,
          0
        ) ?? 0) +
          (main?.new_request_stock?.reduce(
            (total, itm) => total + +itm?.transfer_qty || 0,
            0
          ) ?? 0)}
      </div> */}

      {/* <div className="mt-2 text-end fs-6 fw-bold">
        Final Transfer Amount{" "}
        {(main?.request_stock?.reduce(
          (total, itm) => total + +itm?.transfer_qty * itm.approve_price || 0,
          0
        ) ?? 0) +
          (main?.new_request_stock?.reduce(
            (total, itm) => total + +itm?.transfer_qty * itm.rate || 0,
            0
          ) ?? 0)}
      </div> */}
    </>
  );
};

export default memo(StockTableView);
