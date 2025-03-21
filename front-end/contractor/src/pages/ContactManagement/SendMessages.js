import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Col, Spinner, Form, Row } from "react-bootstrap";
import CardComponent from "../../components/CardComponent";
import { Helmet } from "react-helmet";
import { Formik } from "formik";
import { useTranslation } from "react-i18next";
import { BiPaperPlane } from "react-icons/bi";
import { toast } from "react-toastify";
import {
  getSendMessagesById,
  postMessages,
  updateMessages,
} from "../../services/contractorApi";
import ConfirmAlert from "../../components/ConfirmAlert";
import { addSendMessage } from "../../utils/formSchema";
import MyInput from "../../components/MyInput";
import moment from "moment";

const SendMessages = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [edit, setEdit] = useState({});
  const { t } = useTranslation();
  const location = useLocation();
  const { id, data, selectedIds } = location.state || {};

  const navigate = useNavigate();

  const fetchMessageById = async () => {
    // const res = await getSendMessagesById(selectedIds);
    // if (res.status) {
    //   setEdit(res.data);
    // } else {
    //   setEdit([]);
    // }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const ids = values.to.map((itm) => {
      return itm.value;
    });
    const sData = {
      to: values.to?.map((option) => option.label),
      user_ids: ids,
      title: values.title,
      message: values.message,
      date: values.date,
    };
    if (edit.id) {
      sData["id"] = edit.id;
    }

    // return console.log("sData", sData);

    const res = edit.id
      ? await updateMessages(sData)
      : await postMessages(sData);
    if (res?.status) {
      toast.success(res?.message);
      resetForm();
      navigate(-1);
    } else {
      toast.error(res?.message);
    }
    setSubmitting(false);
  };

  const filteredCompany = data?.filter((item) =>
    id.includes(item.id || item.user_id)
  );

  const companyData = filteredCompany?.map((item) => {
    const phoneNumbers = Array.isArray(item.email) ? item.email : [item.email];
    return phoneNumbers?.map((phone) => phone?.email).join(", ");
  });

  const preSelectedOptions =
    filteredCompany?.map((item, index) => ({
      value: item.id,
      label: companyData[index] || item.email || item.ifsc_code,
    })) || [];

  useEffect(() => {
    if (id !== "new") {
      fetchMessageById();
    }
  }, [id]);

  return (
    <>
      <Helmet>
        <title>
          {edit?.id ? "Update" : "Create"} Message · CMS Electricals
        </title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CardComponent
          showBackButton={true}
          title={`${edit?.id ? "Update" : "Create"} Message`}
        >
          <Formik
            enableReinitialize={true}
            initialValues={{
              to: edit.users
                ? edit?.users?.map((item) => {
                    return {
                      label: item.name,
                      value: item.id,
                    };
                  })
                : preSelectedOptions,
              date: edit.date || moment().format("YYYY-MM-DDTHH:mm"),
              title: edit.title || "",
              message: edit.message || "",
            }}
            validationSchema={addSendMessage}
            onSubmit={handleSubmit}
          >
            {(props) => {
              return (
                <Form onSubmit={props?.handleSubmit}>
                  <Row className="g-3 align-items-center">
                    <Form.Group as={Col} md={8}>
                      <MyInput
                        isRequired
                        multiple
                        name={"to"}
                        formikProps={props}
                        value={props.values.to}
                        label={t("To")}
                        customType={"select"}
                        placeholder="CC BCC"
                      />
                    </Form.Group>
                    <Form.Group as={Col} md={4}>
                      <MyInput
                        name={"date"}
                        formikProps={props}
                        label={t("Schedule Send Date")}
                        type="datetime-local"
                      />
                    </Form.Group>
                    <Form.Group as={Col} md={12}>
                      <MyInput
                        isRequired
                        name={"title"}
                        formikProps={props}
                        label={t("Subject")}
                      />
                    </Form.Group>
                    <MyInput
                      isRequired
                      name={"message"}
                      formikProps={props}
                      label={t("Message")}
                      customType={"editor"}
                      placeholder="Write your message..."
                    />
                    <Form.Group as={Col} md={12}>
                      <div className="mt-4 text-center">
                        <button
                          type={`submit`}
                          onClick={() => setShowAlert(edit.id && true)}
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
                              {t("PLEASE WAIT")}...
                            </>
                          ) : (
                            <>
                              {t("Send")} <BiPaperPlane />
                            </>
                          )}
                        </button>
                        <ConfirmAlert
                          size={"sm"}
                          deleteFunction={props.handleSubmit}
                          hide={setShowAlert}
                          show={showAlert}
                          title={"Confirm UPDATE"}
                          description={"Are you sure you want to update this!!"}
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

export default SendMessages;
