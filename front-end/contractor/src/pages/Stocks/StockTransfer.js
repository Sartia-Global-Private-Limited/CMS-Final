import React, { useEffect } from "react";
import { Col, Form, Row, Spinner, Stack, Table } from "react-bootstrap";
import Select from "react-select";
import CardComponent from "../../components/CardComponent";
import { ErrorMessage, Field, FieldArray, Formik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAllItemMasterForDropdown,
  postTransferStock,
} from "../../services/contractorApi";
import { toast } from "react-toastify";
import { useState } from "react";
import ConfirmAlert from "../../components/ConfirmAlert";
import { addStockTransferSchema } from "../../utils/formSchema";
import { Helmet } from "react-helmet";
import { BsDashLg, BsPlusLg, BsQuestionLg } from "react-icons/bs";
import TooltipComponent from "../../components/TooltipComponent";
import { getAllUsers } from "../../services/authapi";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";

const StockTransfer = () => {
  const { user } = useSelector(selectUser);
  const [itemMasterData, setItemMasterData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [allUserData, setAllUserData] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchItemMasterData = async () => {
    const res = await getAllItemMasterForDropdown();
    if (res.status) {
      setItemMasterData(res.data);
    } else {
      setItemMasterData([]);
    }
  };

  const fetchAllUsersData = async () => {
    const res = await getAllUsers();
    if (res.status) {
      setAllUserData(res.data);
    } else {
      setAllUserData([]);
    }
  };

  const formatOptionLabel = ({ label, image }) => (
    <div>
      <img src={image} className="avatar me-2" />
      {label}
    </div>
  );

  useEffect(() => {
    fetchAllUsersData();
    fetchItemMasterData();
  }, [id]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const modifiedItems = values.items?.map((itm) => ({
      item_id: itm?.item_id?.value,
      qty: itm?.qty,
    }));
    const sData = {
      transfer_for: values.transfer_for,
      transfer_by: values.transfer_for == "1" ? user?.id : values.transfer_for,
      transfer_to: values.transfer_to.value,
      items: modifiedItems,
    };
    // return console.log("sData", sData);

    const res = await postTransferStock(sData);
    if (res.status) {
      toast.success(res.message);
      navigate(-1);
    } else {
      toast.error(res.message);
      setShowAlert(false);
    }
    resetForm();
    setSubmitting(false);
  };

  const itemFormatOptionLabel = ({ label, unique_id, image }) => (
    <div className="d-flex">
      <img src={image} className="avatar me-2" />
      <span className="small d-grid">
        <span>{label}</span>
        <span className="text-gray">({unique_id})</span>
      </span>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Stock Transfer · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CardComponent title={`Stock Transfer`}>
          <Formik
            enableReinitialize={true}
            initialValues={{
              transfer_for: "1",
              transfer_by: "",
              transfer_to: "",
              items: [
                {
                  item_id: "",
                  qty: "",
                },
              ],
            }}
            validationSchema={addStockTransferSchema}
            onSubmit={handleSubmit}
          >
            {(props) => {
              return (
                <Form onSubmit={props?.handleSubmit}>
                  <Row className="g-3 align-items-center">
                    <Form.Group as={Col} md={12}>
                      <Stack
                        // className="text-truncate"
                        className={`text-truncate px-0 after-bg-light social-btn-re w-auto h-auto`}
                        direction="horizontal"
                        gap={4}
                      >
                        <span className="ps-3">Stock Transfer For : </span>
                        <label className="fw-bolder">
                          <Field
                            onClick={() => props.resetForm()}
                            type="radio"
                            name="transfer_for"
                            value="1"
                            onChange={props.handleChange}
                            className="form-check-input"
                          />
                          Self
                        </label>
                        <div className={`vr hr-shadow`} />
                        <label className="fw-bolder">
                          <Field
                            onClick={() => props.resetForm()}
                            type="radio"
                            name="transfer_for"
                            value="2"
                            onChange={props.handleChange}
                            className="form-check-input"
                          />
                          Behalf
                        </label>
                      </Stack>
                    </Form.Group>

                    {props.values.transfer_for == "2" ? (
                      <Form.Group as={Col} md={6}>
                        <div className="shadow p-3">
                          <Form.Label className="fw-bolder">
                            Transfer By <span className="text-danger">*</span>
                          </Form.Label>
                          <Select
                            menuPortalTarget={document.body}
                            name={`transfer_by`}
                            value={props.values.transfer_by}
                            options={allUserData?.map((user) => ({
                              label: user.name,
                              value: user.id,
                              image: user.image
                                ? `${process.env.REACT_APP_API_URL}${user.image}`
                                : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`,
                            }))}
                            onChange={(e) => {
                              props.setFieldValue(`transfer_by`, e);
                            }}
                            formatOptionLabel={formatOptionLabel}
                          />
                          <ErrorMessage
                            name="transfer_by"
                            component="small"
                            className="text-danger"
                          />
                        </div>
                      </Form.Group>
                    ) : null}

                    <Form.Group as={Col} md={6}>
                      <div className="shadow p-3">
                        <Form.Label className="fw-bolder">
                          Transfer To <span className="text-danger">*</span>
                        </Form.Label>
                        <Select
                          menuPortalTarget={document.body}
                          name={`transfer_to`}
                          value={props.values.transfer_to}
                          options={allUserData
                            .filter(
                              (usr) => usr.id !== props.values.transfer_by.value
                            )
                            ?.map((user) => ({
                              label: user.name,
                              value: user.id,
                              image: user.image
                                ? `${process.env.REACT_APP_API_URL}${user.image}`
                                : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`,
                            }))}
                          onChange={(e) => {
                            props.setFieldValue(`transfer_to`, e);
                          }}
                          formatOptionLabel={formatOptionLabel}
                        />
                        <ErrorMessage
                          name="transfer_to"
                          component="small"
                          className="text-danger"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group as={Col} md={12}>
                      <div className="shadow p-2">
                        <Row className="g-3 align-items-center">
                          <Form.Group as={Col} md={12}>
                            <FieldArray name="items">
                              {({ remove, push }) => (
                                <div className="table-scroll p-2">
                                  {props.values.items.length > 0 && (
                                    <Table
                                      striped
                                      hover
                                      className="text-body bg-new Roles"
                                    >
                                      <thead>
                                        <tr>
                                          <th>Item Name</th>
                                          <th>Quantity</th>
                                          <th>Action</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {props.values.items.map(
                                          (itm, index) => (
                                            <tr key={index}>
                                              <td className="text-start">
                                                <Select
                                                  menuPortalTarget={
                                                    document.body
                                                  }
                                                  name={`items.${index}.item_id`}
                                                  value={itm.item_id}
                                                  options={itemMasterData?.map(
                                                    (itm) => ({
                                                      // label: `${itm.unique_id} - ${itm.name}`,
                                                      label: itm.name,
                                                      value: itm.id,
                                                      unique_id: itm.unique_id,
                                                      rate: itm.rate,
                                                      image: itm.image
                                                        ? `${process.env.REACT_APP_API_URL}${itm.image}`
                                                        : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`,
                                                    })
                                                  )}
                                                  formatOptionLabel={
                                                    itemFormatOptionLabel
                                                  }
                                                  onChange={(e) => {
                                                    props.setFieldValue(
                                                      `items.${index}.item_id`,
                                                      e
                                                    );
                                                  }}
                                                />
                                                <ErrorMessage
                                                  name={`items.${index}.item_id`}
                                                  component="span"
                                                  className="text-danger"
                                                />
                                              </td>
                                              <td>
                                                <Form.Control
                                                  name={`items.${index}.qty`}
                                                  placeholder="0"
                                                  value={itm.qty}
                                                  type="number"
                                                  step="any"
                                                  onChange={props.handleChange}
                                                />
                                                <ErrorMessage
                                                  name={`items.${index}.qty`}
                                                  component="span"
                                                  className="text-danger"
                                                />
                                              </td>
                                              <td className="text-center">
                                                {index === 0 ? (
                                                  <TooltipComponent
                                                    title={"Add"}
                                                  >
                                                    <BsPlusLg
                                                      onClick={() =>
                                                        push({
                                                          item_id: "",
                                                          qty: "",
                                                        })
                                                      }
                                                      className={`social-btn success-combo`}
                                                    />
                                                  </TooltipComponent>
                                                ) : (
                                                  <TooltipComponent
                                                    title={"Remove"}
                                                  >
                                                    <BsDashLg
                                                      onClick={() =>
                                                        remove(index)
                                                      }
                                                      className={`social-btn red-combo`}
                                                    />
                                                  </TooltipComponent>
                                                )}
                                              </td>
                                            </tr>
                                          )
                                        )}
                                      </tbody>
                                    </Table>
                                  )}
                                </div>
                              )}
                            </FieldArray>
                          </Form.Group>
                        </Row>
                      </div>
                    </Form.Group>

                    <Form.Group as={Col} md={12}>
                      <div className="mt-4 text-center">
                        <button
                          type={`button`}
                          onClick={() => setShowAlert(true)}
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
                            "Stock Transfer"
                          )}
                        </button>
                        <ConfirmAlert
                          size={"sm"}
                          deleteFunction={props.handleSubmit}
                          hide={setShowAlert}
                          show={showAlert}
                          defaultIcon={<BsQuestionLg />}
                          title={"Confirm Transfer"}
                          description={
                            "Are you sure you want to transfer this!!"
                          }
                        />
                      </div>
                    </Form.Group>
                  </Row>
                </Form>
              );
            }}
          </Formik>
        </CardComponent>
      </Col>
    </>
  );
};

export default StockTransfer;
