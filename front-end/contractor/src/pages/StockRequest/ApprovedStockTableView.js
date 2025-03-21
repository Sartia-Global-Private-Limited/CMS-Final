import { ErrorMessage, Field } from "formik";
import React, { useEffect, useState } from "react";
import { Col, Form, Table } from "react-bootstrap";
import Select from "react-select";
import TooltipComponent from "../../components/TooltipComponent";
import {
  BsChevronDown,
  BsChevronUp,
  BsDashLg,
  BsExclamationCircleFill,
  BsPlusLg,
  BsThreeDotsVertical,
} from "react-icons/bs";
import {
  getFundRequest3BrandNameByItem,
  getFundRequest4LowPriceOnItemId,
  getStockRequestDetailsOnItemId,
} from "../../services/contractorApi";
import { getLastPricesDetailsStock } from "../../services/authapi";
import { useTranslation } from "react-i18next";
import { formatNumberToINR } from "../../utils/helper";

export const ApprovedStockTableView = ({
  props,
  main,
  id,
  pushStock,
  removeStock,
  edit,
  type,
  itemMasterData,
  totalAmount,
  gstTypesData,
  allBrand,
  setAllBrand,
}) => {
  const [collapsedRows, setCollapsedRows] = useState([]);
  const [lowPrice, setLowPrice] = useState([]);
  const [LastPrice, setLastPrice] = useState([]);
  const [loading, setLoading] = useState(false);
  const [threeBrandName, setThreeBrandname] = useState([]);
  const [subCategories, setSubCategories] = useState({});

  const { t } = useTranslation();

  const fetch4LowPriceData = async (index, hsncode) => {
    const category = "stock";
    setLoading(true);
    const res = await getFundRequest4LowPriceOnItemId(hsncode, category);
    if (res.status) {
      setLowPrice((prevData) => {
        return { ...prevData, [index]: res.data };
      });
    } else {
      setLowPrice([]);
    }
    setLoading(false);
  };

  const fetch3BrandsLowestPrice = async (index, itemName) => {
    setLoading(true);
    const category = "stock";
    const res = await getFundRequest3BrandNameByItem(category, itemName);
    if (res.status) {
      setThreeBrandname((prevData) => {
        return { ...prevData, [index]: res.data };
      });
    } else {
      setThreeBrandname([]);
    }
    setLoading(false);
  };

  const handleStockRequestDetails = async (
    id,
    userById,
    setFieldValue,
    index,
    hsncode,
    itemName
  ) => {
    const res = await getStockRequestDetailsOnItemId(id, edit?.requested_for);
    if (res.status) {
      setFieldValue(
        `request_stock_by_user[${userById}].request_stock[${index}].prev_user_stock`,
        res.data.quantity
      );
      setFieldValue(
        `request_stock_by_user[${userById}].request_stock[${index}].prev_item_price`,
        res.data.item_price
      );
    } else {
      setFieldValue(
        `request_stock_by_user[${userById}].request_stock[${index}].prev_user_stock`,
        0
      );
      setFieldValue(
        `request_stock_by_user[${userById}].request_stock[${index}].prev_item_price`,
        0
      );
    }
    fetch4LowPriceData(index, hsncode);
    fetch3BrandsLowestPrice(index, itemName);
    lastPricesData(index, id, edit.requested_for);
  };

  const lastPricesData = async (index, itemId, userId) => {
    setLastPrice([]);
    const res = await getLastPricesDetailsStock(itemId, userId);
    if (res.status) {
      setLastPrice(res.data);
    }
  };
  const renderGstSection = (price, gst, props) => {
    const totalGst = (price * gst) / 100;
    return totalGst || 0;
  };
  const renderTotalAmountWithGst = (price, gst, props) => {
    const totalGst = (price * gst) / 100;
    return totalGst + price || 0;
  };

  const getAllOptions = (rowId) => {
    const selectedItem = props?.values?.request_stock_by_user[
      rowId
    ].request_stock.map((e) => e?.item_name?.unique_id);
    const newItemMasterData = itemMasterData.filter(
      (value) => !selectedItem.includes(value.unique_id)
    );
    return newItemMasterData;
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

  const formatOptionLabel = ({ label, unique_id, image }) => (
    <div className="d-flex">
      <img
        src={
          image
            ? `${process.env.REACT_APP_API_URL}${image}`
            : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
        }
        className="avatar me-2"
      />
      <span className="small d-grid">
        <span>{label}</span>
        <span className="text-gray">({unique_id})</span>
      </span>
    </div>
  );

  const sub = (index, itemNameForSubCategory) => {
    const filteredItem = itemMasterData.find(
      (item) => item.name === itemNameForSubCategory
    );

    // Set subcategory for the specific index
    setSubCategories((prevSubCategories) => ({
      ...prevSubCategories,
      [index]:
        filteredItem && filteredItem.sub_category
          ? filteredItem.sub_category
          : [],
    }));
  };

  useEffect(() => {
    if (main?.request_stock?.[0]?.item_name) {
      main?.request_stock?.map((itm, index) => {
        lastPricesData(index, itm?.item_name?.value, edit.requested_for);
        handleStockRequestDetails(
          itm?.item_name?.value,
          id,
          props.setFieldValue,
          index,
          itm?.item_name?.hsncode,
          itm?.item_name?.label
        );
        sub(index, itm?.item_name?.label);
      });
    }
    sub();
  }, [main]);

  return (
    <>
      <Form.Group as={Col} md="12">
        <div className="table-scroll">
          {main?.request_stock?.length > 0 && (
            <Table striped hover className="text-body bg-new Roles">
              <thead>
                <tr>
                  <th>{t("Item Name")}</th>
                  <th>{t("brand")}</th>
                  <th>{t("Sub Ctaegory")}</th>
                  {props?.values?.request_tax_type === "1" ? (
                    <>
                      <th>{t("Gst Type")}</th>
                      <th>{t("Gst %")}</th>
                    </>
                  ) : null}
                  <th>{t("Prev Item Price")}</th>
                  <th>{t("User Stock")}</th>
                  <th>{t("request price")}</th>
                  <th>{t("Request Qty")}</th>
                  <th>{t("Total Price")}</th>
                  {edit?.approved_data && (
                    <>
                      <th>{t("Total Approve Qty")}</th>
                      <th>{t("Remaining Qty")}</th>
                    </>
                  )}
                  {type === "approve" && <th>{t("Approve Price")}</th>}
                  {type === "approve" && <th>{t("Approve Quantity")}</th>}
                  {type === "approve" && <th>{t("Approve Fund Amount")}</th>}

                  {type !== "approve" && <th>{t("Action")}</th>}
                  {type && (
                    <th>
                      <BsThreeDotsVertical />
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {main?.request_stock?.map((itm, index) => (
                  <>
                    <tr key={index}>
                      <td width={160}>
                        <Select
                          className="text-start"
                          menuPortalTarget={document.body}
                          name={`request_stock_by_user[${id}].request_stock[${index}].item_name`}
                          value={itm.item_name}
                          isDisabled={type == "approve"}
                          options={getAllOptions(id).map((itm) => ({
                            label: itm.name,
                            value: itm.id,
                            unique_id: itm.unique_id,
                            rate: +itm.rate,
                            hsncode: itm.hsncode,
                            description: itm.description,
                            image: itm.image,
                            rates: itm.rates,
                          }))}
                          onChange={(e) => {
                            handleStockRequestDetails(
                              e.value,
                              id,
                              props.setFieldValue,
                              index,
                              e.hsncode
                            );
                            props.setFieldValue(
                              `request_stock_by_user[${id}].request_stock[${index}].item_name`,
                              e
                            );
                            setAllBrand((prevData) => {
                              return { ...prevData, [index]: e.rates };
                            });
                          }}
                          formatOptionLabel={formatOptionLabel}
                        />

                        <ErrorMessage
                          name={`request_stock_by_user[${id}].request_stock[${index}].item_name`}
                          component="small"
                          className="text-danger"
                        />
                      </td>

                      <td style={{ minWidth: "120px" }}>
                        <Select
                          className="text-start"
                          menuPortalTarget={document.body}
                          isDisabled={type == "approve"}
                          name={`request_stock_by_user[${id}].request_stock[${index}].rate`}
                          value={itm.rate}
                          options={allBrand[index]?.map((itm) => ({
                            label: itm.brand,
                            value: itm.item_rates_id,
                            rate: itm.rate,
                          }))}
                          onChange={(e) => {
                            props.setFieldValue(
                              `request_stock_by_user[${id}].request_stock[${index}].rate`,
                              e
                            );
                          }}
                        />
                        <ErrorMessage
                          name={`request_stock_by_user[${id}].request_stock[${index}].rate`}
                          component="small"
                          className="text-danger"
                        />
                      </td>
                      <td style={{ minWidth: "120px" }}>
                        <Form.Control
                          disabled
                          value={subCategories[index] || ""}
                        />
                        <ErrorMessage
                          name={`request_data[${id}]?.request_fund[${index}]?.request_quantity`}
                          component="small"
                          className="text-danger"
                        />
                      </td>
                      {props.values.request_tax_type === "1" ? (
                        <>
                          <td width={160}>
                            <Select
                              menuPortalTarget={document.body}
                              name={`request_stock_by_user[${id}].request_stock[${index}].gst_id`}
                              value={itm.gst_id}
                              options={gstTypesData?.map((itm) => ({
                                label: itm.title,
                                value: itm.id,
                                percentage: +itm.percentage,
                              }))}
                              onChange={(e) => {
                                const tAm =
                                  (e.percentage * +itm?.current_item_price) /
                                  100;
                                const totalAmount =
                                  itm?.current_item_price *
                                  +itm.request_quantity;
                                props.setFieldValue(
                                  `request_stock_by_user[${id}].request_stock[${index}].current_item_price`,
                                  +itm?.current_item_price + tAm
                                );
                                props.setFieldValue(
                                  `request_stock_by_user[${id}].request_stock[${index}].total_price`,
                                  totalAmount
                                );
                                props.setFieldValue(
                                  `request_stock_by_user[${id}].request_stock[${index}].gst_percent`,
                                  e.percentage
                                );
                                props.setFieldValue(
                                  `request_stock_by_user[${id}].request_stock[${index}].gst_id`,
                                  e
                                );
                              }}
                            />
                          </td>
                          {/* <td>
                            <Form.Control
                              name={`request_stock_by_user[${id}].request_stock[${index}].gst_percent`}
                              value={itm.gst_percent}
                              onChange={props.handleChange}
                              disabled
                            />
                          </td> */}

                          <td>{itm.gst_percent}</td>
                        </>
                      ) : null}
                      {/* <td>
                        <Form.Control
                          name={`request_stock_by_user[${id}].request_stock[${index}].prev_item_price`}
                          placeholder="0"
                          value={
                            itm.prev_item_price
                              ? `₹ ${itm.prev_item_price}`
                              : "₹ 0.00"
                          }
                          onChange={props.handleChange}
                          disabled
                        />
                      </td> */}

                      <td>
                        {itm.prev_item_price
                          ? `₹ ${itm.prev_item_price}`
                          : "₹ 0.00"}
                      </td>
                      {/* <td>
                        <Form.Control
                          name={`request_stock_by_user[${id}].request_stock[${index}].prev_user_stock`}
                          placeholder="0"
                          type="number"
                          value={itm.prev_user_stock}
                          onChange={props.handleChange}
                          disabled
                        />
                      </td> */}

                      <td>{itm.prev_user_stock}</td>
                      <td>
                        <Form.Control
                          type="number"
                          name={`request_stock_by_user[${id}].request_stock[${index}].current_item_price`}
                          placeholder="0"
                          value={itm.current_item_price}
                          disabled={type == "approve"}
                          onChange={(e) => {
                            props.setFieldValue(
                              `request_stock_by_user[${id}].request_stock[${index}].total_price`,
                              +itm.request_quantity * +e.target.value
                            );
                            props.setFieldValue(
                              `request_stock_by_user[${id}].request_stock[${index}].current_item_price`,
                              +e.target.value
                            );
                          }}
                        />
                        <ErrorMessage
                          name={`request_stock_by_user[${id}].request_stock[${index}].current_item_price`}
                          component="span"
                          className="text-danger"
                        />
                      </td>
                      <td>
                        <Form.Control
                          name={`request_stock_by_user[${id}].request_stock[${index}].request_quantity`}
                          placeholder="0"
                          type="number"
                          value={itm.request_quantity}
                          disabled={type == "approve" || itm.item_name == ""}
                          onChange={(e) => {
                            props.setFieldValue(
                              `request_stock_by_user[${id}].request_stock[${index}].request_quantity`,
                              e.target.value
                            );
                            props.setFieldValue(
                              `request_stock_by_user[${id}].request_stock[${index}].total_price`,
                              +itm.current_item_price * +e.target.value
                            );
                          }}
                          onBlur={props.handleBlur}
                        />

                        <ErrorMessage
                          name={`request_stock_by_user[${id}].request_stock[${index}].request_quantity`}
                          component="small"
                          className="text-danger"
                        />
                      </td>
                      {/* <td>
                        <Form.Control
                          name={`request_stock_by_user[${id}].request_stock[${index}].total_price`}
                          placeholder="0"
                          type="number"
                          value={
                            +itm.current_item_price * +itm.request_quantity
                          }
                          onChange={props.handleChange}
                          disabled
                        />
                      </td> */}
                      <td>{+itm.current_item_price * +itm.request_quantity}</td>
                      {edit?.approved_data ? (
                        <>
                          <td>
                            <Form.Control
                              placeholder="0"
                              disabled
                              type="number"
                              value={itm.only_view_approved_amount}
                            />
                          </td>
                          <td>
                            <Form.Control
                              placeholder="0"
                              disabled
                              type="number"
                              value={
                                itm.request_quantity -
                                itm.only_view_approved_amount
                              }
                            />
                          </td>
                        </>
                      ) : null}
                      {(type === "approve" ||
                        (type == "reject" &&
                          edit?.approved_data?.length > 0)) && (
                        <>
                          <td>
                            <Form.Control
                              name={`request_stock_by_user[${id}].request_stock[${index}].approve_price`}
                              placeholder="0"
                              type="number"
                              value={itm.approve_price}
                              onChange={(e) => {
                                const inputValue = e.target.value;
                                const maxValue = +itm.current_item_price;

                                if (inputValue <= maxValue) {
                                  props.handleChange(e);
                                  props.setFieldValue(
                                    `request_stock_by_user[${id}].request_stock[${index}].approve_fund_amount`,
                                    (+itm.approve_quantity || 0) *
                                      e.target.value
                                  );
                                } else {
                                  e.target.value = maxValue;
                                  props.handleChange(e);
                                  props.setFieldValue(
                                    `request_stock_by_user[${id}].request_stock[${index}].approve_fund_amount`,
                                    (+itm.approve_quantity || 0) *
                                      e.target.value
                                  );
                                }
                              }}
                              onBlur={props.handleBlur}
                            />
                            <ErrorMessage
                              name={`request_stock_by_user[${id}].request_stock[${index}].approve_price`}
                              component="span"
                              className="text-danger"
                            />
                          </td>

                          <td>
                            <Form.Control
                              name={`request_stock_by_user[${id}].request_stock[${index}].approve_quantity`}
                              placeholder="0"
                              type="number"
                              value={itm.approve_quantity}
                              onChange={(e) => {
                                const inputValue = e.target.value;
                                const maxValue = +itm.request_quantity;

                                if (inputValue <= maxValue) {
                                  props.handleChange(e);
                                  props.setFieldValue(
                                    `request_stock_by_user[${id}].request_stock[${index}].approve_fund_amount`,
                                    (+itm.approve_price || 0) * e.target.value
                                  );
                                } else {
                                  e.target.value = maxValue;
                                  props.handleChange(e);
                                  props.setFieldValue(
                                    `request_stock_by_user[${id}].request_stock[${index}].approve_fund_amount`,
                                    (+itm.approve_price || 0) * e.target.value
                                  );
                                }
                              }}
                              onBlur={props.handleBlur}
                            />
                            <ErrorMessage
                              name={`request_stock_by_user[${id}].request_stock[${index}].approve_quantity`}
                              component="span"
                              className="text-danger"
                            />
                          </td>

                          <td>
                            <Field
                              className="form-control"
                              name={`request_stock_by_user.${id}.request_stock[${index}].approve_fund_amount`}
                              value={itm?.approve_fund_amount ?? 0}
                              disabled
                            />
                          </td>
                        </>
                      )}

                      {type !== "approve" && (
                        <td className="text-center">
                          <TooltipComponent title={"Remove"}>
                            <BsDashLg
                              onClick={() => removeStock(index)}
                              className={`social-btn red-combo`}
                            />
                          </TooltipComponent>
                        </td>
                      )}
                      {type && (
                        <td>
                          <span
                            className={`cursor-pointer text-${
                              main.request_stock[index].Old_Price_Viewed
                                ? "green"
                                : "danger"
                            }`}
                            onClick={() => {
                              toggleRow(index);
                              props.setFieldValue(
                                `request_stock_by_user[${id}].request_stock[${index}].Old_Price_Viewed`,
                                true
                              );
                            }}
                          >
                            {collapsedRows.includes(index) ? (
                              <BsChevronUp fontSize={"large"} />
                            ) : (
                              <BsChevronDown fontSize={"large"} />
                            )}
                          </span>
                        </td>
                      )}
                    </tr>
                    {collapsedRows.includes(index) && (
                      <>
                        <tr>
                          <td colSpan={15}>
                            {loading ? (
                              <p>{t("Loading")}...</p>
                            ) : (
                              <Table striped>
                                <thead>
                                  <th>{t("top 4 low Price")}</th>
                                  <th>{t("supplier")}</th>
                                  <th>{t("Location")}</th>
                                  <th>{t("State")}</th>
                                  <th>{t("hsn code")}</th>
                                  <th>{t("ru code")}</th>
                                  <th>{t("rate")}</th>
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
                                          {t("no data available")}
                                        </p>
                                      </td>
                                    </tr>
                                  )}
                                  {lowPrice[index]?.map((price, el) => {
                                    return (
                                      <tr key={el}>
                                        <td className="text-secondary fw-bold">
                                          {" "}
                                          {el + 1}
                                        </td>
                                        <td>{price?.supplier_name || "-"}</td>
                                        <td>
                                          {`${price?.shop_office_number || ""},
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
                        {collapsedRows.includes(index) && (
                          <>
                            <tr>
                              <td colSpan={15}>
                                {loading ? (
                                  <p>{t("Loading")}...</p>
                                ) : (
                                  <Table striped>
                                    <thead>
                                      <th>{t("Previous Price Detail")}</th>
                                      <th>{t("Name")}</th>
                                      <th>{t("Price")}</th>
                                      <th>{t("Date")}</th>
                                    </thead>
                                    <tbody>
                                      {LastPrice?.length > 0 ? null : (
                                        <tr>
                                          <td colSpan={15}>
                                            <BsExclamationCircleFill
                                              fontSize={"large"}
                                              className="mb-2 text-danger"
                                            />
                                            <p className="mb-0">
                                              {t("no data available")}
                                            </p>
                                          </td>
                                        </tr>
                                      )}
                                      {LastPrice?.map((price, el) => {
                                        return (
                                          <tr key={el}>
                                            <td>
                                              {t("Sr No.")} {el + 1}
                                            </td>
                                            <td>{price?.item_name || "-"}</td>
                                            <td>{price?.item_price || "-"}</td>
                                            <td>
                                              {price?.date?.split("T")?.[0] ||
                                                "-"}
                                            </td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </Table>
                                )}
                              </td>
                            </tr>
                            <th>All Brand price</th>
                            {/* second */}
                            <tr>
                              <td colSpan={15}>
                                {loading ? (
                                  <p>{t("Loading")}...</p>
                                ) : (
                                  <Table striped>
                                    <thead>
                                      <th>{t("S. No.")}</th>
                                      <th>{t("brand")}</th>
                                      <th>{t("price")}</th>
                                    </thead>
                                    <tbody>
                                      {threeBrandName[index]?.length >
                                      0 ? null : (
                                        <tr>
                                          <td colSpan={15}>
                                            <BsExclamationCircleFill
                                              fontSize={"large"}
                                              className="mb-2 text-danger"
                                            />
                                            <p className="mb-0">
                                              {t("no data available")}
                                            </p>
                                          </td>
                                        </tr>
                                      )}
                                      {threeBrandName[index]?.map(
                                        (price, el) => {
                                          return (
                                            <tr key={el}>
                                              <td>{el + 1}</td>
                                              <td>{price?.brand || "-"}</td>
                                              <td>{price?.rate || "-"}</td>
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
                        )}
                      </>
                    )}
                  </>
                ))}
              </tbody>
            </Table>
          )}
          {type !== "approve" && (
            <td
              className="text-green d-inline-block cursor-pointer m-3"
              onClick={() => {
                pushStock({
                  item_name: "",
                  prev_item_price: "",
                  prev_user_stock: "",
                  current_item_price: "",
                  request_quantity: "",
                  total_price: "",
                  approve_quantity: "",
                });
              }}
            >
              <BsPlusLg className={`social-btn success-combo`} /> Request Stock
            </td>
          )}
        </div>
      </Form.Group>
      <Col md={12}>
        {/* {type == "approve" && edit.id && (
          <div className="text-end small">
            {t("Total gst amount : ")}
            <b className="text-green">
              {type === "approve" && !edit?.approved_data
                ? (
                    main?.request_stock.reduce(
                      (acc, total) =>
                        acc +
                        ((total.approve_price * total.gst_percent) / 100) *
                          total.approve_quantity,
                      0
                    ) || 0
                  ).toFixed(2)
                : type === "approve" && edit?.total_gst_amount
                ? edit.total_gst_amount.toFixed(2)
                : null}
            </b>
          </div>
        )} */}
        <div className="text-end small">
          {t("Total")} {type === "approve" ? t("Approve") : t("Request")}{" "}
          {t("Quantity")}{" "}
          <b className="text-green">
            {type == "approve" && !edit?.approved_data
              ? totalAmount || 0
              : type == "approve" && edit?.approved_data?.length > 0
              ? main?.request_stock.reduce(
                  (total, itm) => total + +itm.approve_quantity,
                  0
                )
              : main?.request_stock.reduce(
                  (total, itm) => total + +itm.request_quantity,
                  0
                )}
          </b>
        </div>
        {props.values.request_tax_type == "2" && (
          <div className="text-end small">
            {t("Total Gst Amount")}{" "}
            <b className="text-green">
              {formatNumberToINR(
                renderGstSection(
                  main?.request_stock.reduce(
                    (total, itm) => total + +itm.total_price,
                    0
                  ),
                  main.gst_percent,
                  props
                )
              )}
            </b>
          </div>
        )}
        <div className="text-end">
          {t("Total")} {type === "approve" ? t("Approve") : t("Request")}{" "}
          {t("price")}{" "}
          <b className="text-green">
            {type == "approve" && !edit?.approved_data
              ? formatNumberToINR(
                  main?.request_stock?.reduce(
                    (total, itm) =>
                      total + +itm.approve_price * itm.approve_quantity,
                    0
                  )
                )
              : type == "approve" && edit?.approved_data?.length > 0
              ? formatNumberToINR(
                  main?.request_stock.reduce(
                    (total, itm) => total + +itm.approve_price,
                    0
                  )
                )
              : formatNumberToINR(
                  main?.request_stock.reduce(
                    (total, itm) => total + +itm.total_price,
                    0
                  )
                )}
          </b>
        </div>

        {props.values.request_tax_type == "2" && (
          <div className="text-end small">
            {t("Total Amount")}{" "}
            <b className="text-green">
              {formatNumberToINR(
                renderTotalAmountWithGst(
                  main?.request_stock.reduce(
                    (total, itm) => total + +itm.total_price,
                    0
                  ),
                  main.gst_percent,
                  props
                )
              )}
            </b>
          </div>
        )}
      </Col>
    </>
  );
};
