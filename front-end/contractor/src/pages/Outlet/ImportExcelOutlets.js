import React, { useEffect, useState } from "react";
import { Form, Col, Row, Spinner } from "react-bootstrap";
import { Helmet } from "react-helmet";
import CardComponent from "../../components/CardComponent";
import { Formik } from "formik";
import {
  getAdminDistrictOnSaId,
  getAdminEnergyCompanyassignZone,
  getAllEneryComnies,
  getRoOnZoneId,
  getSalesOnRoId,
} from "../../services/authapi";
import { useNavigate } from "react-router-dom";
import { uploadOutlets } from "../../services/contractorApi";
import { toast } from "react-toastify";
import ConfirmAlert from "../../components/ConfirmAlert";
import { RiFileExcel2Fill } from "react-icons/ri";
import { MdDownload } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { importOutletsSchema } from "../../utils/formSchema";
import Papa from "papaparse";
import { OutletData } from "../../utils/ExcelSamples";
import MyInput from "../../components/MyInput";

const ImportExcelOutlets = () => {
  const [allEnergy, setAllEnergy] = useState([]);
  const [allZones, setAllZones] = useState([]);
  const [allRo, setAllRo] = useState([]);
  const [allSa, setAllSa] = useState([]);
  const [allDistrict, setAllDistrict] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [result, setResult] = useState([]);
  const sampleFile = OutletData;
  const navigate = useNavigate();
  const { t } = useTranslation();

  const fetchEnergyCompanyData = async () => {
    const res = await getAllEneryComnies();
    if (res.status) {
      const rData = res.data.map((data) => {
        return {
          value: data.energy_company_id,
          label: data.name,
        };
      });
      setAllEnergy(rData);
    } else {
      setAllEnergy([]);
    }
  };

  const fetchZoneData = async (value) => {
    const res = await getAdminEnergyCompanyassignZone(value);

    if (res.status) {
      const rData = res.data.map((data) => {
        return {
          value: data.zone_id,
          label: data.zone_name,
        };
      });
      setAllZones(rData);
    } else {
      setAllZones([]);
      toast.error(res.message);
    }
  };

  const fetchRoData = async (value) => {
    const res = await getRoOnZoneId(value);

    if (res.status) {
      const rData = res.data.map((data) => {
        return {
          value: data.ro_id,
          label: data.regional_office_name,
        };
      });
      setAllRo(rData);
    } else {
      setAllRo([]);
      toast.error(res.message);
    }
  };

  const fetchSaData = async (value) => {
    const res = await getSalesOnRoId(value);

    if (res.status) {
      const rData = res.data.map((data) => {
        return {
          value: data.id,
          label: data.sales_area_name,
        };
      });
      setAllSa(rData);
    } else {
      setAllSa([]);
      toast.error(res.message);
    }
  };

  const fetchDistrictData = async (value) => {
    const res = await getAdminDistrictOnSaId(value);
    if (res.status) {
      const rData = res.data.map((data) => {
        return {
          value: data.district_id,
          label: data.district_name,
        };
      });
      setAllDistrict(rData);
    } else {
      setAllDistrict([]);
      toast.error(res.message);
    }
  };

  const handleFileUpload = (event, props) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        Papa.parse(text, {
          header: true,
          complete: (result) => {
            const data = result.data.map((item) => {
              if (item.outlet_name) return item;
            });
            setResult(data.filter((item) => item));
          },
        });
      };
      reader.readAsText(file);
    }
  };

  const convertToCSV = (data) => {
    const csv = data.map((row) => row.join(",")).join("\n");
    return "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
  };

  const DownloadCsvFile = async () => {
    const csvData = convertToCSV(sampleFile);
    const downloadLink = document.createElement("a");
    downloadLink.setAttribute("href", csvData);
    downloadLink.setAttribute("download", "sampleFile.csv");
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  useEffect(() => {
    fetchEnergyCompanyData();
  }, []);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      outlets: result.map((itm) => {
        return {
          ...itm,
          energy_company_id: values.energy_company_id,
          zone_id: values.zone_id,
          regional_id: values.regional_id,
          sales_area_id: values.sales_area_id,
          district_id: values.district_id,
        };
      }),
    };
    // return console.log("sdata", sData);
    const res = await uploadOutlets(sData);

    if (res.status) {
      toast.success(res.message);
      navigate(-1);
      resetForm();
    } else {
      toast.error(res.message);
    }
    setSubmitting(false);
    setShowAlert(false);
  };
  return (
    <>
      <Helmet>
        <title> Outlet Management · CMS Electricals </title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent title={"import Outlet"} showBackButton={true}>
          <Formik
            enableReinitialize={true}
            initialValues={{
              energy_company_id: "",
              zone_id: "",
              regional_id: "",
              sales_area_id: "",
              district_id: "",
            }}
            validationSchema={importOutletsSchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props?.handleSubmit}>
                <Row className="g-3">
                  <Form.Group as={Col} md={4}>
                    <MyInput
                      isRequired
                      name={"energy_company_id"}
                      formikProps={props}
                      label={t("Energy Company")}
                      customType={"select"}
                      selectProps={{
                        data: allEnergy,
                        onChange: (e) => {
                          fetchZoneData(e?.value);
                          setAllRo([]);
                          setAllSa([]);
                          setAllDistrict([]);
                          props.setFieldValue("zone_id", "");
                          props.setFieldValue("sales_area_id", "");
                          props.setFieldValue("district_id", "");
                        },
                      }}
                    />
                  </Form.Group>

                  <Form.Group as={Col} md={4}>
                    <MyInput
                      isRequired
                      name={"zone_id"}
                      formikProps={props}
                      label={t("Zone")}
                      customType={"select"}
                      selectProps={{
                        data: allZones,
                        onChange: (e) => {
                          fetchRoData(e?.value);
                          setAllSa([]);
                          setAllDistrict([]);
                          props.setFieldValue("regional_id", "");
                          props.setFieldValue("sales_area_id", "");
                          props.setFieldValue("district_id", "");
                        },
                      }}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={4}>
                    <MyInput
                      isRequired
                      name={"regional_id"}
                      formikProps={props}
                      label={t("Regional Office")}
                      customType={"select"}
                      selectProps={{
                        data: allRo,
                        onChange: (e) => {
                          fetchSaData(e?.value);
                          setAllDistrict([]);
                          props.setFieldValue("sales_area_id", "");
                          props.setFieldValue("district_id", "");
                        },
                      }}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={4}>
                    <MyInput
                      isRequired
                      name={"sales_area_id"}
                      formikProps={props}
                      label={t("Sale Area")}
                      customType={"select"}
                      selectProps={{
                        data: allSa,
                        onChange: (e) => {
                          fetchDistrictData(e?.value);
                          props.setFieldValue("district_id", "");
                        },
                      }}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={4}>
                    <MyInput
                      isRequired
                      name={"district_id"}
                      formikProps={props}
                      label={t("District")}
                      customType={"select"}
                      selectProps={{
                        data: allDistrict,
                      }}
                    />
                  </Form.Group>

                  <Col md={6} className="my-4">
                    <Form.Label className="fw-bolder">
                      {t("upload excel file")}
                    </Form.Label>
                    <Form.Control
                      type="file"
                      accept=".csv"
                      onChange={(e) => handleFileUpload(e)}
                    />
                  </Col>

                  <Col md={6} className="my-5">
                    <button
                      className="shadow border-0 purple-combo cursor-pointer px-4 py-1"
                      type="button"
                      onClick={() => DownloadCsvFile()}
                    >
                      {" "}
                      <RiFileExcel2Fill className="fs-4 text-green"></RiFileExcel2Fill>
                      {t("sample excel")} <MdDownload className="fs-6 " />
                    </button>
                  </Col>

                  <Col md={12}>
                    <div className="mt-4 text-center">
                      <button
                        type={`submit`}
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
                          "CREATE"
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

export default ImportExcelOutlets;
