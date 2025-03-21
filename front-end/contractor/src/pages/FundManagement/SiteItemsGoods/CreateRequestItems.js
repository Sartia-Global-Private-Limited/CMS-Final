import React, { useEffect, useState } from "react";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import { ErrorMessage, Formik } from "formik";
import TextareaAutosize from "react-textarea-autosize";
import Select from "react-select";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { addRequestItemsSchema } from "../../../utils/formSchema";
import {
  getAllItemMasterForDropdown,
  postSiteItemsGoods,
  updateSiteItemsGoods,
} from "../../../services/contractorApi";
import ConfirmAlert from "../../../components/ConfirmAlert";
import { getSingleSiteItemsGoodsById } from "../../../services/contractorApi";
import CardComponent from "../../../components/CardComponent";
import ViewRequestItems from "./ViewRequestItems";

const CreateRequestItems = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [edit, setEdit] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [itemMasterData, setItemMasterData] = useState([]);
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || null;

  const fetchSingleData = async () => {
    const res = await getSingleSiteItemsGoodsById(id);
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit([]);
    }
  };

  const fetchItemMasterData = async () => {
    const res = await getAllItemMasterForDropdown();
    if (res.status) {
      setItemMasterData(res.data);
    } else {
      setItemMasterData([]);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      item_id: values.item_id.value,
      date: values.date,
      notes: values.notes,
    };

    if (edit.id) {
      sData["id"] = edit.id;
    }
    // return console.log("sData", sData);
    const res = edit.id
      ? await updateSiteItemsGoods(sData)
      : await postSiteItemsGoods(sData);
    if (res.status) {
      toast.success(res.message);
      navigate(-1);
    } else {
      toast.error(res.message);
    }
    resetForm();
    setSubmitting(false);
  };

  const formatOptionLabel = ({ label, image }) => (
    <div>
      <img
        src={`${process.env.REACT_APP_API_URL}${image}`}
        className="avatar me-2"
      />
      {label}
    </div>
  );

  useEffect(() => {
    if (id !== "new") {
      fetchSingleData();
    }
    fetchItemMasterData();
  }, []);

  return (
    <>
      <Helmet>
        <title>
          {edit?.id ? "Update" : "Create"} Request Item · CMS Electricals
        </title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent title={`${edit?.id ? "Update" : "Create"} Request Item`}>
          <Formik
            enableReinitialize={true}
            initialValues={{
              date: edit.date || "",
              item_id: edit.item_id
                ? {
                    label: edit.item_name,
                    value: parseInt(edit.item_id),
                    image: edit.item_image,
                  }
                : "",
              notes: edit.notes || "",
            }}
            validationSchema={addRequestItemsSchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props?.handleSubmit}>
                <Row className="g-2">
                  {type == "view" ? (
                    <ViewRequestItems edit={edit} />
                  ) : (
                    <>
                      <Form.Group as={Col} md={6}>
                        <Form.Label>
                          Item Name <span className="text-danger small">*</span>
                        </Form.Label>
                        <Select
                          className="text-start"
                          menuPortalTarget={document.body}
                          name={`item_id`}
                          value={props.values.item_id}
                          options={itemMasterData?.map((itm) => ({
                            label: itm.name,
                            value: itm.id,
                            rate: itm.rate,
                            image: itm.image,
                          }))}
                          onChange={(e) => {
                            props.setFieldValue(`item_id`, e);
                          }}
                          formatOptionLabel={formatOptionLabel}
                        />
                        <ErrorMessage
                          name={`item_id`}
                          component="small"
                          className="text-danger"
                        />
                      </Form.Group>
                      <Form.Group as={Col} md={6}>
                        <Form.Label>
                          Date <span className="text-danger small">*</span>
                        </Form.Label>
                        <Form.Control
                          type="date"
                          name={"date"}
                          value={props.values.date}
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          isInvalid={Boolean(
                            props.touched.date && props.errors.date
                          )}
                        />
                        <ErrorMessage
                          name={`date`}
                          component="small"
                          className="text-danger"
                        />
                      </Form.Group>
                      <Form.Group as={Col} md={12}>
                        <Form.Label>
                          notes <span className="text-danger small">*</span>
                        </Form.Label>
                        <TextareaAutosize
                          className="edit-textarea"
                          minRows={3}
                          name="notes"
                          value={props.values.notes}
                          onChange={props.handleChange}
                        />
                        <ErrorMessage
                          name="notes"
                          component="small"
                          className="text-danger"
                        />
                      </Form.Group>
                      <Form.Group as={Col} md={12}>
                        <div className="mt-4 text-center">
                          <button
                            type={`${edit?.id ? "button" : "submit"}`}
                            onClick={() => setShowAlert(edit?.id && true)}
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
                              <>{edit?.id ? "UPDATE" : "SAVE"}</>
                            )}
                          </button>
                          <ConfirmAlert
                            size={"sm"}
                            deleteFunction={props.handleSubmit}
                            hide={setShowAlert}
                            show={showAlert}
                            title={"Confirm UPDATE"}
                            description={
                              "Are you sure you want to update this!!"
                            }
                          />
                        </div>
                      </Form.Group>
                    </>
                  )}
                </Row>
              </Form>
            )}
          </Formik>
        </CardComponent>
      </Col>
    </>
  );
};

export default CreateRequestItems;
