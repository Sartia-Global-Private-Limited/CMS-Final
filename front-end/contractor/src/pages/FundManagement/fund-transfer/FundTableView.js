import { ErrorMessage, Field } from "formik";
import React, { useEffect, useState } from "react";
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
import TooltipComponent from "../../../components/TooltipComponent";
import {
  getFundRequest4LowPriceOnItemId,
  getFundRequestDetailsOnItemId,
} from "../../../services/contractorApi";
import ReactTextareaAutosize from "react-textarea-autosize";
import { formatNumberToINR } from "../../../utils/helper";

const FundTableView = ({
  props,
  main,
  id,
  pushFund,
  removeFund,
  edit,
  type,
  itemMasterData,
  setFinalRequestAmount,
}) => {
  const [collapsedRows, setCollapsedRows] = useState([]);
  const [lowPrice, setLowPrice] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (main?.transfer_fund[0]?.item_name) {
      main?.transfer_fund?.map((itm, index) => {
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

  const totalTransferFund = main?.transfer_fund.reduce(
    (total, itm) => total + +itm?.request_transfer_fund || 0,
    0
  );

  const totalNewTransferFund = main?.new_transfer_fund?.reduce(
    (total, itm) => total + +itm?.request_transfer_fund || 0,
    0
  );

  setFinalRequestAmount(totalNewTransferFund + totalTransferFund);

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
        `request_data[${userById}].transfer_fund[${index}].current_user_stock`,
        res.data.request_qty
      );
      setFieldValue(
        `request_data[${userById}].transfer_fund[${index}].previous_price`,
        res.data.item_price
      );
    } else {
      setFieldValue(
        `request_data[${userById}].transfer_fund[${index}].current_user_stock`,
        0
      );
      setFieldValue(
        `request_data[${userById}].transfer_fund[${index}].previous_price`,
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

  return (
    <>
      <Form.Group as={Col} md={12}>
        <div className="stable-scroll">
          {main?.transfer_fund.length > 0 && (
            <>
              <strong>Transfer Fund</strong>
              <div className="mt-2 table-scroll">
                <Table striped className="text-body bg-new Roles">
                  <thead>
                    <tr>
                      <th>Item Name</th>
                      <th>User Stock</th>
                      <th>Request Price</th>
                      <th>Request Quantity</th>
                      <th>Fund Amount</th>
                      <th>Approve Quantity</th>
                      <th>Approve Price</th>
                      <th>Eligible Transfer Quantity</th>
                      <th>Transfer qty</th>

                      <th>
                        <BsThreeDotsVertical />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {main?.transfer_fund.map((itm, index) => (
                      <>
                        <tr key={index}>
                          <td width={160}>
                            <Select
                              className="text-start"
                              menuPortalTarget={document.body}
                              isDisabled
                              name={`transfer_data[${id}].transfer_fund[${index}].item_name`}
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
                                  `transfer_data[${id}].transfer_fund[${index}].current_price`,
                                  e.rate
                                );
                                props.setFieldValue(
                                  `transfer_data[${id}].transfer_fund[${index}].item_name`,
                                  e
                                );
                              }}
                              formatOptionLabel={formatOptionLabel}
                            />
                            <ErrorMessage
                              name={`transfer_data[${id}].transfer_fund[${index}].item_name`}
                              component="small"
                              className="text-danger"
                            />
                          </td>

                          <td>
                            <Form.Control
                              name={`transfer_data[${id}].transfer_fund[${index}].current_user_stock`}
                              placeholder="0"
                              type="number"
                              value={itm.current_user_stock}
                              onChange={props.handleChange}
                              disabled
                            />
                            <ErrorMessage
                              name={`transfer_data[${id}].transfer_fund[${index}].current_user_stock`}
                              component="div"
                              className="field-error"
                            />
                          </td>

                          <td>
                            <Form.Control
                              name={`transfer_data[${id}].transfer_fund[${index}].current_price`}
                              placeholder="0"
                              type="number"
                              value={itm.current_price}
                              disabled
                              onChange={(e) => {
                                props.setFieldValue(
                                  `transfer_data[${id}].transfer_fund[${index}].fund_amount`,
                                  itm.request_quantity * e.target.value
                                );

                                props.setFieldValue(
                                  `transfer_data[${id}].transfer_fund[${index}].current_price`,
                                  e.target.value
                                );
                              }}
                            />
                            <ErrorMessage
                              name={`transfer_data[${id}].transfer_fund[${index}].current_price`}
                              component="div"
                              className="field-error"
                            />
                          </td>
                          <td>
                            <Form.Control
                              name={`transfer_data[${id}].transfer_fund[${index}].request_quantity`}
                              min={1}
                              type="number"
                              value={itm.request_quantity}
                              disabled
                              onChange={(e) => {
                                props.setFieldValue(
                                  `transfer_data[${id}].transfer_fund[${index}].fund_amount`,
                                  itm.current_price * +e.target.value
                                );

                                props.setFieldValue(
                                  `transfer_data[${id}].transfer_fund[${index}].request_quantity`,
                                  +e.target.value
                                );
                              }}
                            />
                            <ErrorMessage
                              name={`transfer_data[${id}].transfer_fund[${index}].request_quantity`}
                              component="small"
                              className="text-danger"
                            />
                          </td>
                          <td>
                            <Form.Control
                              name={`transfer_data[${id}].transfer_fund[${index}].fund_amount`}
                              min={1}
                              type="number"
                              value={itm.fund_amount}
                              disabled
                              onChange={props.handleChange}
                            />
                            <ErrorMessage
                              name={`transfer_data[${id}].transfer_fund[${index}].fund_amount`}
                              component="div"
                              className="field-error"
                            />
                          </td>
                          {edit?.approved_data ? (
                            <>
                              <td>
                                <Form.Control
                                  min={1}
                                  disabled
                                  type="number"
                                  value={
                                    edit?.approved_data?.request_fund?.[index]
                                      ?.quantity
                                  }
                                />
                              </td>
                              <td>
                                <Form.Control
                                  min={1}
                                  disabled
                                  type="number"
                                  value={
                                    edit?.approved_data?.request_fund?.[index]
                                      ?.price
                                  }
                                />
                              </td>

                              <td>
                                <Form.Control
                                  min={1}
                                  disabled
                                  type="number"
                                  value={
                                    edit?.transfer_data
                                      ? edit?.transfer_data?.transfer_fund[
                                          index
                                        ].remaining_quantity
                                      : itm?.quantity
                                  }
                                />
                              </td>
                            </>
                          ) : null}

                          <td>
                            <Form.Control
                              name={`transfer_data[${id}].transfer_fund[${index}].transfer_quantity`}
                              value={itm?.transfer_quantity}
                              min={1}
                              onBlur={props.handleBlur}
                              onChange={(e) => {
                                const inputValue = e.target.value;
                                const remaining_quantity = edit.transfer_data
                                  ? edit.transfer_data.transfer_fund[index]
                                      ?.remaining_quantity
                                  : itm?.quantity;
                                const maxValue = remaining_quantity;

                                if (inputValue <= maxValue) {
                                  props.handleChange(e);

                                  props.setFieldValue(
                                    `transfer_data[${id}].transfer_fund[${index}].request_transfer_fund`,
                                    +e.target.value *
                                      edit?.approved_data?.request_fund[index]
                                        ?.price
                                  );

                                  props.setFieldValue(
                                    `transfer_data[${id}].transfer_fund[${index}].remaining_quantity`,
                                    remaining_quantity - +e.target.value
                                  );
                                } else {
                                  e.target.value = maxValue;
                                  props.handleChange(e);

                                  props.setFieldValue(
                                    `transfer_data[${id}].transfer_fund[${index}].request_transfer_fund`,
                                    +e.target.value *
                                      edit.approved_data.request_fund[index]
                                        .price
                                  );
                                  props.setFieldValue(
                                    `transfer_data[${id}].transfer_fund[${index}].remaining_quantity`,
                                    remaining_quantity - +e.target.value
                                  );
                                }
                              }}
                            />
                            {/* <ErrorMessage
                            name={`transfer_data[${id}].transfer_fund[${index}].transfer_quantity`}
                            component="div"
                            className="field-error"
                          /> */}

                            <ErrorMessage
                              name={`transfer_data[${id}].transfer_fund[${index}].transfer_quantity`}
                              component="small"
                              className="text-danger"
                            />
                          </td>

                          <td>
                            <span
                              className={`cursor-pointer text-${
                                collapsedRows.includes(index)
                                  ? "danger"
                                  : "green"
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
                                                name={`transfer_data[${id}].transfer_fund[${index}].supplier_id`}
                                                value={price?.supplier_id}
                                                // checked={Boolean(
                                                //   props.values.supplier_id === price?.supplier_id
                                                // )}
                                                onChange={() => {
                                                  props.setFieldValue(
                                                    `transfer_data[${id}].transfer_fund[${index}].supplier_id`,
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
                                          </tr>
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
              </div>
            </>
          )}

          {main?.transfer_fund.length > 0 && (
            <div className="d-flex mt-3 justify-content-end">
              <div className="text-end fw-bold">
                Total Transfer Fund {totalTransferFund ?? 0}
              </div>
            </div>
          )}

          {main?.new_transfer_fund.length > 0 && (
            <>
              <h6 className="my-3">New Transfer Fund</h6>
              <div className="mt-2 table-scroll">
                <Table striped className="text-body bg-new Roles">
                  <thead>
                    <tr>
                      <th>Item Name</th>
                      <th>Requested Price</th>
                      <th>Requested Quantity</th>
                      <th>Approve Price</th>
                      <th>Approved Quantity</th>
                      <th>Fund Amount </th>
                      <th>Eligible Transfer Quantity </th>
                      <th>Transfer quantity </th>
                    </tr>
                  </thead>
                  <tbody>
                    {main?.new_transfer_fund.map((itm, index) => (
                      <>
                        <tr key={index}>
                          <td width={160}>
                            <Select
                              className="text-start"
                              menuPortalTarget={document.body}
                              isDisabled
                              name={`transfer_data[${id}].transfer_fund[${index}].item_name`}
                              value={{
                                label: itm?.title?.label,
                                image: itm?.item_image,
                                imgBase64Format: true,
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
                                  `request_data[${id}].new_transfer_fund[${index}].current_price`,
                                  e.rate
                                );
                                props.setFieldValue(
                                  `request_data[${id}].new_transfer_fund[${index}].item_name`,
                                  e
                                );
                              }}
                              formatOptionLabel={formatOptionLabel}
                            />
                            <ErrorMessage
                              name={`request_data[${id}].new_transfer_fund[${index}].item_name`}
                              component="small"
                              className="text-danger"
                            />
                          </td>

                          <td>
                            <Form.Control
                              name={`request_data[${id}].transfer_fund[${index}].requested_rate`}
                              placeholder="0"
                              type="number"
                              value={itm?.requested_rate}
                              disabled
                            />
                          </td>

                          <td>
                            <Form.Control
                              name={`request_data[${id}].transfer_fund[${index}].requested_qty`}
                              placeholder="0"
                              type="number"
                              value={itm?.requested_qty}
                              disabled
                            />
                          </td>

                          <td>
                            <Form.Control
                              name={`request_data[${id}].transfer_fund[${index}].current_price`}
                              placeholder="0"
                              type="number"
                              value={itm?.rate}
                              disabled
                            />
                            <ErrorMessage
                              name={`request_data[${id}].transfer_fund[${index}].current_price`}
                              component="div"
                              className="field-error"
                            />
                          </td>

                          <td>
                            <Form.Control
                              name={`request_data[${id}].new_transfer_fund[${index}].qty`}
                              placeholder="0"
                              type="number"
                              value={itm?.qty}
                              onChange={props.handleChange}
                              disabled
                            />
                            <ErrorMessage
                              name={`request_data[${id}].transfer_fund[${index}].qty`}
                              component="div"
                              className="field-error"
                            />
                          </td>

                          <td>
                            <Form.Control
                              name={`request_data[${id}].transfer_fund[${index}].fund_amount`}
                              placeholder="0"
                              type="number"
                              value={itm?.fund_amount}
                              disabled
                            />
                            <ErrorMessage
                              name={`request_data[${id}].new_transfer_fund[${index}].fund_amount`}
                              component="small"
                              className="text-danger"
                            />
                          </td>

                          <td>
                            <Form.Control
                              name={`remaining_quantity`}
                              placeholder="0"
                              type="number"
                              value={
                                edit?.transfer_data
                                  ? edit?.transfer_data?.new_transfer_fund?.[
                                      index
                                    ]?.remaining_quantity
                                  : itm?.qty
                              }
                              disabled
                            />
                          </td>

                          <td>
                            <Form.Control
                              name={`transfer_data[${id}].new_transfer_fund[${index}].transfer_quantity`}
                              value={itm?.transfer_quantity}
                              min={1}
                              step="any"
                              placeholder="0"
                              onChange={(e) => {
                                const inputValue = e.target.value;
                                const remaining_quantity = edit.transfer_data
                                  ? edit.transfer_data.new_transfer_fund[index]
                                      .remaining_quantity
                                  : itm.qty;
                                const maxValue = remaining_quantity;

                                if (inputValue <= maxValue) {
                                  props.handleChange(e);
                                  props.setFieldValue(
                                    `transfer_data[${id}].new_transfer_fund[${index}].request_transfer_fund`,
                                    +e.target.value * itm?.rate
                                  );
                                  props.setFieldValue(
                                    `transfer_data[${id}].new_transfer_fund[${index}].remaining_quantity`,
                                    remaining_quantity - +e.target.value
                                  );
                                } else {
                                  e.target.value = maxValue;
                                  props.handleChange(e);
                                  props.setFieldValue(
                                    `transfer_data[${id}].new_transfer_fund[${index}].request_transfer_fund`,
                                    +e.target.value * itm?.rate
                                  );
                                  props.setFieldValue(
                                    `transfer_data[${id}].new_transfer_fund[${index}].remaining_quantity`,
                                    remaining_quantity - +e.target.value
                                  );
                                }
                              }}
                            />

                            <ErrorMessage
                              name={`request_data[${id}].new_transfer_fund[${index}].transfer_quantity`}
                              component="div"
                              className="field-error"
                            />
                          </td>
                        </tr>
                      </>
                    ))}
                  </tbody>
                </Table>
              </div>
            </>
          )}

          {main?.new_transfer_fund.length > 0 && (
            <div className="d-flex mt-3 justify-content-end">
              <div className="text-end fw-bold">
                Total New Transfer Fund{" "}
                {formatNumberToINR(totalNewTransferFund)}
              </div>
            </div>
          )}
        </div>
      </Form.Group>
      <div className="mt-2 text-end fw-bold ">
        <h5>
          Final Transfer Amount{" "}
          {formatNumberToINR(totalTransferFund + totalNewTransferFund)}
        </h5>
      </div>
    </>
  );
};

export default FundTableView;
