import React from "react";
import { ErrorMessage } from "formik";
import { Col, Form, Image, Table } from "react-bootstrap";
import TooltipComponent from "../../components/TooltipComponent";
import { BsCloudUpload, BsDashLg, BsPlusLg, BsTrash } from "react-icons/bs";
import ImageViewer from "../../components/ImageViewer";

export const PaymentImages = ({
  props,
  id,
  pushPaymentImage,
  removePaymentImage,
}) => {
  return (
    <>
      <Form.Group as={Col} md="12">
        {props.values.payment_images?.length > 0 && (
          <div className="table-scroll">
            <Table striped hover className="text-body bg-new Roles">
              <thead>
                <tr>
                  <th>Payment Documents</th>
                  <th>Title</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {props.values.payment_images?.map((itm, index) => (
                  <tr key={index}>
                    <td>
                      <div
                        style={{
                          border: "0.1em dashed rgb(204, 204, 204)",
                        }}
                        className="shadow text-white text-center p-1"
                      >
                        <label className="bg-info cursor-pointer d-block bg-gradient py-1">
                          <BsCloudUpload fontSize={18} /> Upload Image
                          <Form.Control
                            type="file"
                            accept="image/*"
                            className="d-none"
                            name={`payment_images[${index}].image`}
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (file) => {
                                  props.setFieldValue(
                                    `payment_images[${index}].image`,
                                    file.target.result
                                  );
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>

                        {itm.image && (
                          <div className="position-relative">
                            <ImageViewer
                              src={
                                itm?.image?.startsWith("/payment_images")
                                  ? process.env.REACT_APP_API_URL + itm.image
                                  : itm.image
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
                                  itm?.image?.startsWith("/payment_images")
                                    ? process.env.REACT_APP_API_URL + itm.image
                                    : itm.image
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
                                  `payment_images[${index}].image`,
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
                          name={`payment_images[${index}].image`}
                          component="small"
                          className="text-danger"
                        />
                      </div>
                    </td>
                    <td>
                      <Form.Control
                        name={`payment_images[${index}].title`}
                        value={itm.title}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                      />
                      <ErrorMessage
                        name={`payment_images[${index}].title`}
                        component="small"
                        className="text-danger"
                      />
                    </td>

                    <td className="text-center">
                      {index === 0 ? (
                        <TooltipComponent title={"Add"}>
                          <BsPlusLg
                            onClick={() => {
                              pushPaymentImage({
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
                            onClick={() => removePaymentImage(index)}
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
