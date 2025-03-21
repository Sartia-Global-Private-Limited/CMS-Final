import { ErrorMessage } from "formik";
import React, { useEffect, useState } from "react";
import { Col, Form, FormGroup, Table } from "react-bootstrap";
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
  getFundRequest3BrandNameByItem,
  getFundRequest4LowPriceOnItemId,
  getFundRequestDetailsOnItemId,
} from "../../../services/contractorApi";
import { getLastPricesDetailsFund } from "../../../services/authapi";
import { useTranslation } from "react-i18next";

export const ApprovedTableView = ({
  props,
  main,
  id,
  pushFund,
  removeFund,
  edit,
  type,
  itemMasterData,
  allBrand,
  setAllBrand,
}) => {
  const [collapsedRows, setCollapsedRows] = useState([]);
  const [lowPrice, setLowPrice] = useState([]);
  const [loading, setLoading] = useState(false);
  const [LastPrice, setLastPrice] = useState([]);
  const [threeBrandName, setThreeBrandname] = useState([]);
  const [subCategories, setSubCategories] = useState({});

  const { t } = useTranslation();

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

  const getAllOptions = (rowId) => {
    const selectedItem = props.values.request_data[rowId].request_fund.map(
      (e) => e.item_name.unique_id
    );
    const newItemMasterData = itemMasterData.filter(
      (value) => !selectedItem.includes(value.unique_id)
    );

    return newItemMasterData;
  };

  const fetch4LowPriceData = async (index, hsncode) => {
    setLoading(true);
    const category = "fund";
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
    const category = "fund";
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

  const handleFundRequestDetails = async (
    id,
    userById,
    setFieldValue,
    index,
    hsncode,
    itemName
  ) => {
    const res = await getFundRequestDetailsOnItemId(id);
    if (res.status) {
      setFieldValue(
        `request_data[${userById}].request_fund[${index}].current_user_stock`,
        res.data.request_qty
      );
      setFieldValue(
        `request_data[${userById}].request_fund[${index}].previous_price`,
        res.data.item_price
      );
    } else {
      setFieldValue(
        `request_data[${userById}].request_fund[${index}].current_user_stock`,
        0
      );
      setFieldValue(
        `request_data[${userById}].request_fund[${index}].previous_price`,
        0
      );
    }
    fetch4LowPriceData(index, hsncode);
    fetch3BrandsLowestPrice(index, itemName);
    lastPricesData(index, id, edit.request_for_id);
  };
  const lastPricesData = async (index, itemId, userId) => {
    setLastPrice([]);
    const res = await getLastPricesDetailsFund(itemId, userId);
    if (res.status) {
      setLastPrice(res.data);
    }
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
    if (main?.request_fund?.[0]?.item_name) {
      main?.request_fund?.map((itm, index) => {
        lastPricesData(index, itm?.item_name?.value, edit.request_for_id);
        handleFundRequestDetails(
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
  }, [main]);

  return (
    <>
      <Form.Group as={Col} md={12}>
        <div className="table-scroll">
          {main?.request_fund?.length > 0 && (
            <Table striped className="text-body bg-new Roles">
              <thead>
                <tr>
                  <th>{t("Item Name")}</th>
                  <th>{t("brand")}</th>
                  <th>{t("Sub Ctaegory")}</th>
                  {type === "transfer" ? null : <th>{t("Description")}</th>}
                  <th>{t("User Stock")}</th>
                  <th>{t("Prev Price")}</th>
                  <th style={{ minWidth: "80px" }}>{t("Item Price")}</th>
                  <th>{t("request qty")}</th>
                  <th>{t("request amount")}</th>
                  {edit?.approved_data && (
                    <>
                      <th>{t("Remaining Price")}</th>
                    </>
                  )}
                  {type === "approve" && (
                    <>
                      <th> {t("Approve Price")}</th>
                      <th>{t("Approve Quantity")}</th>
                    </>
                  )}
                  {type === "transfer" ? null : (
                    <th>{type === "approve" ? t("Total") : t("Action")}</th>
                  )}

                  {type == "approve" && (
                    <th>
                      <BsThreeDotsVertical />
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {main?.request_fund.map((itm, index) => (
                  <>
                    <tr key={index}>
                      <td width={160}>
                        <Select
                          className="text-start"
                          menuPortalTarget={document.body}
                          isDisabled={type == "approve"}
                          name={`request_data[${id}].request_fund[${index}].item_name`}
                          value={itm.item_name}
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
                            handleFundRequestDetails(
                              e.value,
                              id,
                              props.setFieldValue,
                              index,
                              e.hsncode,
                              e.label
                            );
                            props.setFieldValue(
                              `request_data[${id}].request_fund[${index}].current_price`,
                              e.rate
                            );
                            props.setFieldValue(
                              `request_data[${id}].request_fund[${index}].item_name`,
                              e
                            );

                            setAllBrand((prevData) => {
                              return { ...prevData, [index]: e.rates };
                            });
                          }}
                          formatOptionLabel={formatOptionLabel}
                        />
                        <ErrorMessage
                          name={`request_data[${id}].request_fund[${index}].item_name`}
                          component="small"
                          className="text-danger"
                        />
                      </td>

                      <td style={{ minWidth: "120px" }}>
                        <Select
                          className="text-start"
                          menuPortalTarget={document.body}
                          isDisabled={type == "approve"}
                          name={`request_data[${id}].request_fund[${index}].rate`}
                          value={itm.rate}
                          options={allBrand[index]?.map((itm) => ({
                            label: itm.brand,
                            value: itm.item_rates_id,
                            rate: itm.rate,
                          }))}
                          onChange={(e) => {
                            props.setFieldValue(
                              `request_data[${id}].request_fund[${index}].rate`,
                              e
                            );
                          }}
                        />
                        <ErrorMessage
                          name={`request_data[${id}]?.request_fund[${index}]?.request_quantity`}
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
                      {type === "transfer" ? null : (
                        <td>
                          <Form.Control
                            name={`request_data[${id}].request_fund[${index}].description`}
                            value={itm.description}
                            onChange={props.handleChange}
                          />
                        </td>
                      )}

                      <td>{itm.current_user_stock}</td>

                      <td>{itm.previous_price}</td>

                      <td>
                        <Form.Control
                          name={`request_data[${id}].request_fund[${index}].new_price`}
                          type="number"
                          min={1}
                          step="any"
                          onBlur={props.handleBlur}
                          value={itm.new_price}
                          disabled={type === "approve" ? true : false}
                          onChange={(e) => {
                            props.setFieldValue(
                              `request_data[${id}].request_fund[${index}].new_price`,
                              +e.target.value
                            );
                            props.setFieldValue(
                              `request_data[${id}].request_fund[${index}].fund_amount`,
                              itm.request_quantity * +e.target.value
                            );
                          }}
                        />
                        <ErrorMessage
                          name={`request_data[${id}]?.request_fund[${index}]?.request_quantity`}
                          component="small"
                          className="text-danger"
                        />
                      </td>
                      <td>
                        <Form.Control
                          min={1}
                          step="any"
                          name={`request_data[${id}].request_fund[${index}].request_quantity`}
                          type="number"
                          onBlur={props.handleBlur}
                          value={itm.request_quantity}
                          disabled={type === "approve" ? true : false}
                          onChange={(e) => {
                            props.setFieldValue(
                              `request_data[${id}].request_fund[${index}].fund_amount`,
                              itm.new_price * +e.target.value
                            );
                            props.setFieldValue(
                              `request_data[${id}].request_fund[${index}].request_quantity`,
                              +e.target.value
                            );
                          }}
                        />
                        <ErrorMessage
                          name={`request_data[${id}]?.request_fund[${index}]?.request_quantity`}
                          component="small"
                          className="text-danger"
                        />
                      </td>

                      <td>{itm.fund_amount}</td>
                      {edit?.approved_data ? (
                        <>
                          <td>
                            <Form.Control
                              disabled
                              type="number"
                              value={+itm?.remaining_amount}
                            />
                          </td>
                        </>
                      ) : null}

                      {type === "approve" && (
                        <>
                          <td>
                            <Form.Control
                              name={`request_data[${id}].request_fund[${index}].price`}
                              min={1}
                              step="any"
                              onBlur={props.handleBlur}
                              value={itm.price}
                              onChange={(e) => {
                                const maxValue = +itm?.new_price;
                                if (e.target.value <= maxValue) {
                                  props.handleChange(e);
                                  props.setFieldValue(
                                    `request_data[${id}].request_fund[${index}].total_approve_amount`,
                                    itm.quantity * +e.target.value
                                  );
                                } else {
                                  e.target.value = maxValue;
                                  props.handleChange(e);
                                  props.setFieldValue(
                                    `request_data[${id}].request_fund[${index}].total_approve_amount`,
                                    itm.quantity * +e.target.value
                                  );
                                }
                              }}
                            />
                          </td>
                          <td>
                            <Form.Control
                              name={`request_data[${id}].request_fund[${index}].quantity`}
                              onBlur={props.handleBlur}
                              min={1}
                              step="any"
                              value={itm?.quantity}
                              type="number"
                              onChange={(e) => {
                                const maxValue = +itm?.request_quantity;
                                const maxApproveValue = +itm?.request_quantity;
                                if (edit?.approved_data) {
                                  if (e.target.value <= maxApproveValue) {
                                    props.handleChange(e);
                                  } else {
                                    e.target.value = maxApproveValue;
                                    props.handleChange(e);
                                  }
                                } else {
                                  if (e.target.value <= maxValue) {
                                    props.handleChange(e);
                                  } else {
                                    e.target.value = maxValue;
                                    props.handleChange(e);
                                  }
                                }
                              }}
                            />
                            <ErrorMessage
                              name={`request_data[${id}].request_fund[${index}].quantity`}
                              component="div"
                              className="text-danger"
                            />
                          </td>
                        </>
                      )}

                      {type === "transfer" ? null : (
                        <td className="text-center fs-6 fw-bold">
                          {type == "approve" ? (
                            edit?.approved_data ? (
                              itm.quantity * itm.price
                            ) : (
                              itm.quantity * itm.price || 0
                            )
                          ) : (
                            <>
                              <TooltipComponent title={"Remove"}>
                                <BsDashLg
                                  onClick={() => removeFund(index)}
                                  className={`social-btn red-combo`}
                                />
                              </TooltipComponent>
                            </>
                          )}
                        </td>
                      )}

                      {type == "approve" && (
                        <td>
                          <span
                            className={`cursor-pointer text-${
                              main.request_fund[index].Old_Price_Viewed
                                ? "green"
                                : "danger"
                            }`}
                            onClick={() => {
                              toggleRow(index);
                              props.setFieldValue(
                                `request_data[${id}].request_fund[${index}].Old_Price_Viewed`,
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
                                        <td className="fw-bold text-green">
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
                                  {collapsedRows.includes(index) && (
                                    <>
                                      <tr>
                                        <td colSpan={15}>
                                          {loading ? (
                                            <p>{t("Loading")}...</p>
                                          ) : (
                                            <Table striped>
                                              <thead>
                                                <th>
                                                  {t("Previous Price Detail")}
                                                </th>
                                                <th>{t("Name")}</th>
                                                <th>{t("Price")}</th>
                                                <th>{t("Date")}</th>
                                              </thead>
                                              <tbody>
                                                {LastPrice.length > 0 ? null : (
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
                                                        {t("Sr No.")}
                                                        {el + 1}
                                                      </td>
                                                      <td>
                                                        {price?.item_name ||
                                                          "-"}
                                                      </td>
                                                      <td>
                                                        {price?.item_price ||
                                                          "-"}
                                                      </td>
                                                      <td>
                                                        {price?.date?.split(
                                                          "T"
                                                        )?.[0] || "-"}
                                                      </td>
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
                                  {threeBrandName[index]?.length > 0 ? null : (
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
                                  {threeBrandName[index]?.map((price, el) => {
                                    return (
                                      <tr key={el}>
                                        <td>{el + 1}</td>
                                        <td>{price?.brand || "-"}</td>
                                        <td>{price?.rate || "-"}</td>
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
          )}

          {type != "approve" && (
            <div
              className="text-green d-inline-block cursor-pointer m-3"
              onClick={() => {
                pushFund({
                  item_name: "",
                  current_user_stock: "",
                  previous_price: "",
                  current_price: "",
                  request_quantity: "",
                  fund_amount: "",
                  quantity: 0,
                  price: 0,
                  transfer_quantity: 0,
                });
              }}
            >
              <BsPlusLg className={`social-btn success-combo me-2`} />
              {t("Request Fund")}
            </div>
          )}
        </div>
      </Form.Group>

      {main?.request_fund?.length > 0 && (
        <div className="mt-2 text-end fs-6 fw-bold ">
          <span className="mx-3 ">
            {t("Total")} {type === "approve" ? "Approve" : "Request "}{" "}
            {t("Amount")} ₹
            {type === "approve"
              ? main.request_fund.reduce(
                  (userTotal, item) => userTotal + +item.quantity * +item.price,
                  0
                )
              : main.request_fund.reduce(
                  (userTotal, item) => userTotal + +item.fund_amount,
                  0
                )}
          </span>
        </div>
      )}
    </>
  );
};
