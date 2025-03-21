import React from "react";
import { ErrorMessage } from "formik";
import { Col, Form, Image, Table } from "react-bootstrap";
import TooltipComponent from "../../components/TooltipComponent";
import { BsCloudUpload, BsDashLg, BsPlusLg, BsTrash } from "react-icons/bs";
import ImageViewer from "../../components/ImageViewer";
import { useTranslation } from "react-i18next";

export const CreateBillImages = ({
  props,
  main,
  id,
  pushStockImage,
  removeStockImage,
  edit,
  type,
}) => {
  const { t } = useTranslation();
  return (
    <>
      <Form.Group as={Col} md="12">
        {main?.request_stock_images?.length > 0 && (
          <div className="table-scroll">
            <Table striped hover className="text-body bg-new Roles">
              <thead>
                <tr>
                  <th>{t("Bill Image")}</th>
                  <th>{t("Title")}</th>
                  <th>{t("Action")}</th>
                </tr>
              </thead>
              <tbody>
                {main?.request_stock_images?.map((itm, index) => (
                  <tr key={index}>
                    <td>
                      <div
                        style={{
                          border: "0.1em dashed rgb(204, 204, 204)",
                        }}
                        className="shadow text-white text-center p-1"
                      >
                        <label className="bg-info cursor-pointer d-block bg-gradient py-1">
                          <BsCloudUpload fontSize={18} /> {t("Upload Image")}
                          <Form.Control
                            type="file"
                            accept="image/*"
                            className="d-none"
                            name={`request_stock_by_user[${id}].request_stock_images[${index}].item_image`}
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (file) => {
                                  props.setFieldValue(
                                    `request_stock_by_user[${id}].request_stock_images[${index}].item_image`,
                                    file.target.result
                                  );
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>

                        {itm.item_image && (
                          <div className="position-relative">
                            <ImageViewer
                              src={
                                itm?.item_image?.startsWith(
                                  "/stock_request_images"
                                )
                                  ? process.env.REACT_APP_API_URL +
                                    itm.item_image
                                  : itm.item_image
                              }
                            >
                              <Image
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
                                      itm.item_image
                                    : itm.item_image
                                }
                              />
                            </ImageViewer>
                            <span
                              style={{
                                borderRadius: "0 0 0 50%",
                              }}
                              className="bg-blue cursor-pointer p-2 text-danger position-absolute end-0"
                              onClick={() => {
                                props.setFieldValue(
                                  `request_stock_by_user[${id}].request_stock_images[${index}].item_image`,
                                  null
                                );
                              }}
                            >
                              <TooltipComponent title={"Delete"}>
                                <BsTrash fontSize={"large"} />
                              </TooltipComponent>
                            </span>
                          </div>
                        )}
                        <ErrorMessage
                          name={`request_stock_by_user[${id}].request_stock_images[${index}].item_image`}
                          component="small"
                          className="text-danger"
                        />
                      </div>
                    </td>
                    <td>
                      <Form.Control
                        name={`request_stock_by_user[${id}].request_stock_images[${index}].title`}
                        value={itm.title}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                      />
                      <ErrorMessage
                        name={`request_stock_by_user[${id}].request_stock_images[${index}].title`}
                        component="small"
                        className="text-danger"
                      />
                    </td>

                    <td className="text-center">
                      {index === 0 ? (
                        <TooltipComponent title={"Add"}>
                          <BsPlusLg
                            onClick={() => {
                              pushStockImage({
                                title: "",
                                item_image: null,
                              });
                            }}
                            className={`social-btn success-combo`}
                          />
                        </TooltipComponent>
                      ) : (
                        <TooltipComponent title={"Remove"}>
                          <BsDashLg
                            onClick={() => removeStockImage(index)}
                            className={`social-btn red-combo`}
                          />
                        </TooltipComponent>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Form.Group>
    </>
  );
};
