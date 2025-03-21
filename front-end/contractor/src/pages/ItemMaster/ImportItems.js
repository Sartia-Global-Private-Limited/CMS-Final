import React, { useEffect, useState } from "react";
import { Form, Col, Row, Spinner } from "react-bootstrap";
import { Helmet } from "react-helmet";
import CardComponent from "../../components/CardComponent";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import {
  getAllSubCategory,
  getAllSuppliers,
  getAllUnitMasterForDropdown,
} from "../../services/contractorApi";
import { toast } from "react-toastify";
import { MdDownload } from "react-icons/md";
import { useTranslation } from "react-i18next";
import MyInput from "../../components/MyInput";
import { uploadImportItems } from "../../services/authapi";
import { importItemsSchema } from "../../utils/formSchema";
import { DOWNLOAD_FILE_WITH_BACKEND } from "../../utils/helper";

const ImportItems = () => {
  const [unitMasterData, setUnitMasterData] = useState([]);
  const [allSubCategory, setAllSubCategory] = useState([]);
  const [allSuppliers, setAllSuppliers] = useState([]);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const fetchUnitMasterData = async () => {
    const res = await getAllUnitMasterForDropdown();
    if (res.status) {
      setUnitMasterData(res.data);
    } else {
      setUnitMasterData([]);
    }
  };

  const fetchSuppliersData = async () => {
    const res = await getAllSuppliers({ isDropdown: true });
    if (res.status) {
      setAllSuppliers(res.data);
    } else {
      setAllSuppliers([]);
    }
  };

  const fetchAllSubCategory = async () => {
    const res = await getAllSubCategory({ isDropdown: true });
    if (res.status) {
      setAllSubCategory(res.data);
    } else {
      setAllSubCategory([]);
    }
  };

  useEffect(() => {
    fetchSuppliersData();
    fetchAllSubCategory();
    fetchUnitMasterData();
  }, []);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();
    for (const key in values) {
      formData.append(key, values[key]);
    }

    const res = await uploadImportItems(formData);
    if (res.status) {
      toast.success(res.message);
      navigate(-1);
      resetForm();
    } else {
      toast.error(res.message);
    }
    setSubmitting(false);
  };

  return (
    <>
      <Helmet>
        <title>Item Master · CMS Electricals </title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent title={"Import Item Master"} showBackButton={true}>
          <Formik
            enableReinitialize={true}
            initialValues={{
              supplier_id: "",
              unit_id: "",
              sub_category: "",
              excel: "",
            }}
            validationSchema={importItemsSchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props.handleSubmit}>
                <Row className="g-3">
                  <Form.Group as={Col} md={4}>
                    <MyInput
                      isRequired
                      name={"supplier_id"}
                      formikProps={props}
                      label={t("Supplier")}
                      customType={"select"}
                      selectProps={{
                        data: allSuppliers?.map((itm) => ({
                          label: itm.supplier_name,
                          value: itm.id,
                        })),
                      }}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={4}>
                    <MyInput
                      isRequired
                      name={"unit_id"}
                      formikProps={props}
                      label={t("Unit Id")}
                      customType={"select"}
                      selectProps={{
                        data: unitMasterData?.map((itm) => ({
                          label: itm.name,
                          value: itm.id,
                        })),
                      }}
                    />
                  </Form.Group>

                  <Form.Group as={Col} md={4}>
                    <MyInput
                      isRequired
                      name={"sub_category"}
                      formikProps={props}
                      label={t("Sub Category")}
                      customType={"select"}
                      selectProps={{
                        data: allSubCategory?.map((itm) => ({
                          label: itm.name,
                          value: itm.id,
                        })),
                      }}
                    />
                  </Form.Group>

                  <Form.Group
                    as={Col}
                    md={4}
                    className="d-align justify-content-start gap-2"
                  >
                    <MyInput
                      isRequired
                      name={"excel"}
                      formikProps={props}
                      label={t("upload excel file")}
                      accepts={[".csv", ".xls", ".xlsx"]}
                      customType={"fileUpload"}
                    />
                    <button
                      className="shadow border-0 purple-combo cursor-pointer px-2 py-1"
                      type="button"
                      onClick={() => {
                        DOWNLOAD_FILE_WITH_BACKEND("sample_item_master.xlsx");
                      }}
                    >
                      <MdDownload className="fs-6" />
                    </button>
                  </Form.Group>

                  <Col md={12}>
                    <div className="mt-4 text-center">
                      <button
                        type="submit"
                        disabled={props.isSubmitting}
                        className="shadow border-0 purple-combo cursor-pointer px-4 py-1"
                      >
                        {props.isSubmitting ? (
                          <>
                            <Spinner
                              animation="border"
                              variant="primary"
                              size="sm"
                            />{" "}
                            {t("PLEASE WAIT")}...
                          </>
                        ) : (
                          "CREATE"
                        )}
                      </button>
                    </div>
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
        </CardComponent>
      </Col>
    </>
  );
};

export default ImportItems;
