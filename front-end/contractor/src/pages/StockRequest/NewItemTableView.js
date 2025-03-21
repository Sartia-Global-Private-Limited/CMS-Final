import React, { useEffect, useState } from "react";
import { ErrorMessage, Field } from "formik";
import { Col, Form, Image, Table } from "react-bootstrap";
import { BsCloudUpload, BsDashLg, BsPlusLg, BsTrash } from "react-icons/bs";
import Select from "react-select";
import TooltipComponent from "../../components/TooltipComponent";
import {
  getAllBrandName,
  getAllSubCategory,
  getAllUnitMasterForDropdown,
} from "../../services/contractorApi";
import ImageViewer from "../../components/ImageViewer";
import CreatableSelect from "react-select/creatable";
import { useTranslation } from "react-i18next";

export const NewItemTableView = ({
  props,
  main,
  id,
  pushNewFund,
  removePushNewFund,
  edit,
  itemMasterData = { itemMasterData },
  type,
}) => {
  const [unitMasterData, setUnitMasterData] = useState([]);
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const [brandOptions, setBrandOptions] = useState([]);
  const [menuIsOpen, setIsMenuOpen] = useState("");
  const [brandMenuIsOpen, setIsBrandMenuOpen] = useState("");
  const { t } = useTranslation();

  const formatOptionLabel = ({ label, unique_id, image }) => (
    <div className="d-flex">
      {image && (
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
        {unique_id && <span className="text-gray">({unique_id})</span>}
      </span>
    </div>
  );
  const fetchUnitMasterData = async () => {
    const res = await getAllUnitMasterForDropdown();
    if (res.status) {
      setUnitMasterData(res.data);
    } else {
      setUnitMasterData([]);
    }
  };

  const fetchAllBrandNames = async () => {
    const res = await getAllBrandName();
    if (res.status) {
      setBrandOptions(res.data);
    } else {
      setBrandOptions([]);
    }
  };
  const fetchSubacategory = async () => {
    const isDropdown = true;
    const res = await getAllSubCategory({ isDropdown });

    if (res.status) {
      setSubCategoryOptions(res.data);
    } else {
      setSubCategoryOptions([]);
    }
  };
  useEffect(() => {
    fetchUnitMasterData();
    fetchSubacategory();
    fetchAllBrandNames();
  }, []);
  return (
    <>
      <Form.Group as={Col} md="12">
        {main?.new_request_stock?.length > 0 && (
          <div className="table-scroll">
            <Table striped hover className="text-body bg-new Roles">
              <thead>
                <tr>
                  <th>{t("Item Name")}</th>
                  <th>{t("brand name")}</th>
                  <th style={{ minWidth: "110px" }}>sub category</th>
                  <th>{t("Item Image")}</th>
                  <th>{t("description")}</th>
                  <th>{t("unit")}</th>
                  <th>{t("Rate")}</th>
                  <th>{t("Qty")}</th>
                  <th>{t("Fund Amount")}</th>
                  {type == "approve" && (
                    <>
                      <th>{t("Approve Rate")}</th>
                      <th>{t("Approve Qty")}</th>
                      <th>{t("Approve Fund Amount")}</th>
                    </>
                  )}
                  {type != "approve" && <th>{t("Action")}</th>}
                </tr>
              </thead>
              <tbody>
                {main?.new_request_stock?.map((itm, index) => (
                  <tr key={index}>
                    <td style={{ minWidth: "120px" }}>
                      <CreatableSelect
                        isClearable
                        placeholder="create"
                        className="text-primary w-auto "
                        menuPortalTarget={document.body}
                        name={`request_stock_by_user.${id}.new_request_stock[${index}].title`}
                        value={itm.title}
                        onBlur={props.handleBlur}
                        styles={{
                          dropdownIndicator: () => ({ display: "none" }),
                        }}
                        options={itemMasterData?.map((itm) => ({
                          label: itm?.name,
                          value: itm?.id,
                          unique_id: itm?.unique_id,
                          rate: +itm?.rate,
                          hsncode: itm?.hsncode,
                          description: itm?.description,
                          image: itm?.image,
                        }))}
                        formatOptionLabel={formatOptionLabel}
                        menuIsOpen={menuIsOpen === index}
                        onInputChange={(e) => {
                          e.length > 0
                            ? setIsMenuOpen(index)
                            : setIsMenuOpen("");
                        }}
                        onChange={(selectedOption) => {
                          {
                            props.setFieldValue(
                              `request_stock_by_user.${id}.new_request_stock[${index}].title`,
                              selectedOption
                            );
                          }

                          {
                            type == "approve" &&
                              props.setFieldValue(
                                `request_stock_by_user.${id}.new_request_stock[${index}].title`,
                                selectedOption
                              );

                            type == "approve" &&
                              props.setFieldValue(
                                `request_stock_by_user.${id}.new_request_stock[${index}].rate`,
                                selectedOption?.rate
                              );
                          }
                        }}
                      />
                      <ErrorMessage
                        name={`request_stock_by_user.${id}.new_request_stock[${index}].title`}
                        component="small"
                        className="text-danger"
                      />
                    </td>

                    <td style={{ minWidth: "140px" }}>
                      <CreatableSelect
                        isClearable
                        placeholder="create"
                        className="text-primary"
                        menuPortalTarget={document.body}
                        onBlur={props.handleBlur}
                        styles={{
                          dropdownIndicator: () => ({ display: "none" }),
                        }}
                        name={`request_stock_by_user.${id}.new_request_stock[${index}].brand`}
                        value={itm.brand}
                        options={brandOptions?.map((brand) => ({
                          label: brand?.brand_name,
                          value: brand?.id,
                        }))}
                        formatOptionLabel={(brandOption) => (
                          <div>
                            <span>{brandOption.label}</span>
                          </div>
                        )}
                        menuIsOpen={brandMenuIsOpen === index}
                        onInputChange={(e) => {
                          e.length > 0
                            ? setIsBrandMenuOpen(index)
                            : setIsBrandMenuOpen("");
                        }}
                        onChange={(selectedOption) => {
                          props.setFieldValue(
                            `request_stock_by_user.${id}.new_request_stock[${index}].brand`,
                            selectedOption
                          );
                        }}
                      />
                      <ErrorMessage
                        name={`request_stock_by_user.${id}.new_request_stock[${index}].brand`}
                        component="small"
                        className="text-danger"
                      />
                    </td>
                    <td>
                      <Select
                        name={`request_stock_by_user.${id}.new_request_stock[${index}].sub_category`}
                        menuPortalTarget={document.body}
                        value={itm.sub_category}
                        options={subCategoryOptions.map((data) => ({
                          label: data.name,
                          value: data.id,
                        }))}
                        onChange={(selectedOption) => {
                          props.setFieldValue(
                            `request_stock_by_user.${id}.new_request_stock[${index}].sub_category`,
                            selectedOption
                          );
                        }}
                      />
                    </td>

                    <td>
                      <div
                        style={{
                          border: "0.1em dashed rgb(204, 204, 204)",
                          width: 150,
                        }}
                        className="shadow text-white text-center p-1"
                      >
                        {" "}
                        {type != "approve" && (
                          <label className="bg-info cursor-pointer d-block bg-gradient py-1">
                            <BsCloudUpload fontSize={18} />
                            <Form.Control
                              type="file"
                              accept="image/*"
                              className="d-none"
                              name={`request_stock_by_user.${id}.new_request_stock[${index}].item_image`}
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (file) => {
                                    props.setFieldValue(
                                      `request_stock_by_user.${id}.new_request_stock[${index}].item_image`,
                                      file.target.result
                                    );
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                        )}
                        {itm?.item_image && (
                          <div className="position-relative">
                            <ImageViewer
                              src={
                                itm?.item_image?.startsWith(
                                  "/stock_request_images"
                                )
                                  ? process.env.REACT_APP_API_URL +
                                    itm?.item_image
                                  : itm?.item_image
                              }
                            >
                              <Image
                                onClick={(e) =>
                                  props.setFieldValue(
                                    `request_stock_by_user.${id}.new_request_stock[${index}].view_status`,
                                    true
                                  )
                                }
                                style={{
                                  height: "50px",
                                  width: "100%",
                                  maxWidth: "100%",
                                }}
                                className="object-fit mt-1"
                                src={
                                  itm?.item_image?.startsWith(
                                    "/stock_request_images"
                                  )
                                    ? process.env.REACT_APP_API_URL +
                                      itm?.item_image
                                    : itm?.item_image
                                }
                              />
                            </ImageViewer>

                            {type != "approve" && (
                              <span
                                style={{
                                  borderRadius: "0 0 0 50%",
                                }}
                                className="bg-blue cursor-pointer p-1 text-danger position-absolute end-0"
                                onClick={() => {
                                  props.setFieldValue(
                                    `request_stock_by_user.${id}.new_request_stock[${index}].item_image`,
                                    null
                                  );
                                }}
                              >
                                <TooltipComponent title={"Delete"}>
                                  <BsTrash />
                                </TooltipComponent>
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {type == "approve" && (
                        <span
                          className={` ${
                            main?.new_request_stock?.[index]?.view_status
                              ? "text-green"
                              : "text-danger"
                          }  mx-2 `}
                        >
                          {t("image")}
                          {!main?.new_request_stock?.[index]?.view_status &&
                            "Not"}{" "}
                          {t("viewed")}
                        </span>
                      )}

                      <ErrorMessage
                        name={`request_stock_by_user.${id}.new_request_stock[${index}].item_image`}
                        component="small"
                        className="text-danger"
                      />
                    </td>

                    <td style={{ minWidth: "120px" }}>
                      <Field
                        className="form-control"
                        name={`request_stock_by_user.${id}.new_request_stock[${index}].description`}
                        value={itm.description}
                      />
                    </td>

                    <td style={{ minWidth: "100px" }}>
                      <Select
                        menuPortalTarget={document.body}
                        autoFocus
                        className="text-primary"
                        name={`request_stock_by_user.${id}.new_request_stock[${index}].unit_id`}
                        value={itm.unit_id}
                        onChange={(val) =>
                          props.setFieldValue(
                            `request_stock_by_user.${id}.new_request_stock[${index}].unit_id`,
                            val
                          )
                        }
                        options={unitMasterData?.map((itm) => ({
                          label: itm.name,
                          value: itm.id,
                        }))}
                      />
                      <ErrorMessage
                        name={`request_stock_by_user.${id}.new_request_stock[${index}].unit_id`}
                        component="small"
                        className="text-danger"
                      />
                    </td>

                    <td style={{ minWidth: "65px" }}>
                      <Field
                        className="form-control"
                        type="number"
                        step="any"
                        onBlur={props.handleBlur}
                        name={`request_stock_by_user.${id}.new_request_stock[${index}].rate`}
                        value={itm.rate}
                        disabled={type === "approve"}
                        onChange={(e) => {
                          props.setFieldValue(
                            `request_stock_by_user.${id}.new_request_stock[${index}].rate`,
                            e.target.value
                          );

                          props.setFieldValue(
                            `request_stock_by_user.${id}.new_request_stock[${index}].fund_amount`,
                            e.target.value * +itm.qty
                          );
                        }}
                      />
                      <ErrorMessage
                        name={`request_stock_by_user.${id}.new_request_stock[${index}].rate`}
                        component="small"
                        className="text-danger"
                      />
                    </td>
                    <td style={{ minWidth: "65px" }}>
                      <Field
                        className="form-control"
                        name={`request_stock_by_user.${id}.new_request_stock[${index}].qty`}
                        value={itm.qty}
                        disabled={type === "approve"}
                        onBlur={props.handleBlur}
                        type="number"
                        step="any"
                        onChange={(e) => {
                          props.setFieldValue(
                            `request_stock_by_user.${id}.new_request_stock[${index}].fund_amount`,
                            e.target.value * +itm.rate
                          );
                          props.setFieldValue(
                            `request_stock_by_user.${id}.new_request_stock[${index}].qty`,
                            e.target.value
                          );
                        }}
                      />
                      <ErrorMessage
                        name={`request_stock_by_user.${id}.new_request_stock[${index}].qty`}
                        component="small"
                        className="text-danger"
                      />
                    </td>
                    <td style={{ minWidth: "75px" }}>
                      <Field
                        className="form-control"
                        name={`request_stock_by_user.${id}.new_request_stock[${index}].fund_amount`}
                        value={itm.fund_amount}
                        disabled
                      />
                    </td>
                    {type == "approve" && (
                      <>
                        <td style={{ minWidth: "70px" }}>
                          <Field
                            className="form-control"
                            type="number"
                            step="any"
                            name={`request_stock_by_user.${id}.new_request_stock[${index}].approved_rate`}
                            onChange={(e) => {
                              const maxValue = +itm?.rate;

                              if (e.target.value <= maxValue) {
                                props.handleChange(e);
                                props.setFieldValue(
                                  `request_stock_by_user[${id}].new_request_stock[${index}].approve_fund_amount`,
                                  (+itm.approved_qty || 0) * e.target.value
                                );
                              } else {
                                e.target.value = maxValue;
                                props.handleChange(e);
                                props.setFieldValue(
                                  `request_stock_by_user[${id}].new_request_stock[${index}].approve_fund_amount`,
                                  (+itm.approved_qty || 0) * e.target.value
                                );
                              }
                            }}
                          />

                          <ErrorMessage
                            name={`request_stock_by_user.${id}.new_request_stock[${index}].approved_rate`}
                            component="small"
                            className="text-danger"
                          />
                        </td>
                        <td style={{ minWidth: "70px" }}>
                          <Field
                            className="form-control"
                            name={`request_stock_by_user.${id}.new_request_stock[${index}].approved_qty`}
                            type="number"
                            step="any"
                            onChange={(e) => {
                              const maxValue = +itm?.qty;

                              if (e.target.value <= maxValue) {
                                props.handleChange(e);

                                props.setFieldValue(
                                  `request_stock_by_user[${id}].new_request_stock[${index}].approve_fund_amount`,
                                  (+itm.approved_rate || 0) * e.target.value
                                );
                              } else {
                                e.target.value = maxValue;
                                props.handleChange(e);
                                props.setFieldValue(
                                  `request_stock_by_user[${id}].new_request_stock[${index}].approve_fund_amount`,
                                  (+itm.approved_rate || 0) * e.target.value
                                );
                              }
                            }}
                          />
                          <ErrorMessage
                            name={`request_stock_by_user.${id}.new_request_stock[${index}].approved_qty`}
                            component="small"
                            className="text-danger"
                          />
                        </td>
                        <td>
                          <Field
                            className="form-control"
                            name={`request_stock_by_user.${id}.new_request_stock[${index}].approve_fund_amount`}
                            value={itm?.approve_fund_amount ?? 0}
                            disabled
                          />
                        </td>
                      </>
                    )}

                    {type != "approve" && (
                      <td className="text-center">
                        <TooltipComponent title={"Remove"}>
                          <BsDashLg
                            onClick={() => removePushNewFund(index)}
                            className={`social-btn red-combo`}
                          />
                        </TooltipComponent>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
        <div className="d-flex my-3 justify-content-between align-items-center">
          {type === "approve" ? null : (
            <div
              className="text-green d-inline-block cursor-pointer"
              onClick={() => {
                pushNewFund({
                  supplier_id: "",
                  unit_id: "",
                  description: "",
                  item_image: null,
                  title: "",
                  sub_category: "",
                  rate: null,
                  qty: null,
                  fund_amount: 0,
                });
              }}
            >
              <BsPlusLg className={`social-btn success-combo`} /> new request
              {t("stock")}
            </div>
          )}
          {main?.new_request_stock?.length > 0 && (
            <span className="ms-auto small">
              {t("Total")} {type == "approve" ? t("Approve") : t("Request")}{" "}
              {t("Price")}-{" "}
              <b>
                {type !== "approve"
                  ? main?.new_request_stock?.reduce(
                      (userTotal, item) => userTotal + +item.fund_amount,
                      0
                    )
                  : main?.new_request_stock?.reduce(
                      (userTotal, item) =>
                        userTotal + +item?.approve_fund_amount,
                      0
                    ) || 0}
              </b>
              <br />
              {t("Total")} {type == "approve" ? t("Approve") : t("Request")}{" "}
              {t("Quantity")}-{" "}
              <b>
                {type !== "approve"
                  ? main?.new_request_stock?.reduce(
                      (userTotal, item) => userTotal + +item.qty,
                      0
                    )
                  : main?.new_request_stock?.reduce(
                      (userTotal, item) => userTotal + +item.approved_qty,
                      0
                    ) || 0}
              </b>
            </span>
          )}
        </div>
      </Form.Group>
    </>
  );
};
