import React, { useEffect, useTransition } from "react";
import { useState } from "react";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import CardComponent from "../../components/CardComponent";
import { Formik } from "formik";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import Select from "react-select";
import ConfirmAlert from "../../components/ConfirmAlert";
import { addSubCategorySchema } from "../../utils/formSchema";
import {
  createSubCategory,
  getSingleSubCategoryById,
  updateSubCategory,
} from "../../services/contractorApi";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MyInput from "../../components/MyInput";

const CreateSubCategory = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [edit, setEdit] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const fetchSubCtaegoryDataById = async () => {
    const res = await getSingleSubCategoryById(id);
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit([]);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    if (edit.id) {
      values["id"] = edit.id;
    }

    // return console.log(values, "values");
    const res = edit.id
      ? await updateSubCategory(values)
      : await createSubCategory(values);

    if (res.status) {
      handleBack();
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    resetForm();
    setSubmitting(false);
  };

  useEffect(() => {
    if (id !== "new") {
      fetchSubCtaegoryDataById();
    }
  }, [id]);

  return (
    <>
      <Helmet>
        {edit?.id ? "Update" : "Create"} Category · CMS Electricals
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CardComponent
          showBackButton={true}
          title={`${edit?.id ? "Update" : "Create"} Sub Category`}
        >
          <Formik
            enableReinitialize={true}
            initialValues={{
              name: edit.name || "",
              status: `${edit.status}` || "1",
            }}
            validationSchema={addSubCategorySchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props?.handleSubmit}>
                <Row className="g-2">
                  <Form.Group md="12">
                    <MyInput
                      isRequired
                      name={"name"}
                      formikProps={props}
                      label={t("sub Category Name")}
                    />
                  </Form.Group>
                  <Form.Group md="12">
                    <MyInput
                      isRequired
                      name={"status"}
                      formikProps={props}
                      label={t("Status")}
                      customType={"select"}
                      selectProps={{
                        data: [
                          {
                            label: "Active",
                            value: "1",
                          },
                          {
                            label: "InActive",
                            value: "0",
                          },
                        ],
                      }}
                    />
                  </Form.Group>
                  <Form.Group md="12">
                    <div className="mt-4 text-center">
                      <button
                        type={`${edit.id ? "button" : "submit"}`}
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
                            />
                            {t("PLEASE WAIT")}...
                          </>
                        ) : (
                          <>{edit.id ? t("UPDATE") : t("CREATE")}</>
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
            )}
          </Formik>
        </CardComponent>
      </Col>
    </>
  );
};

export default CreateSubCategory;
