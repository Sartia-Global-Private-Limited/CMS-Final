import React, { useEffect, useRef, useState } from "react";
import { Col, Form, Row, Spinner, Image, Button } from "react-bootstrap";
import { Helmet } from "react-helmet";
import CardComponent from "../../components/CardComponent";
import Select from "react-select";
import { toast } from "react-toastify";
import { ErrorMessage, Formik } from "formik";
import { addEarthingTestingSchema } from "../../utils/formSchema";
import ConfirmAlert from "../../components/ConfirmAlert";

import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  getAllComplaintList,
  getAllOutletList,
  getSingleEarthingTestingById,
  postEarthingTesting,
  postEarthingTestingEarthPitReport,
  updateEarthingTesting,
} from "../../services/contractorApi";
import { getAllUsers } from "../../services/authapi";
import { useTranslation } from "react-i18next";
import ImageViewer from "../../components/ImageViewer";
import {
  Bs0Circle,
  BsCartPlus,
  BsCCircle,
  BsFillBagPlusFill,
  BsPatchPlus,
  BsPlusLg,
  BsXLg,
} from "react-icons/bs";

const PdfForm = () => {
  const [edit, setEdit] = useState({});
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const qr_file_ref = useRef(null);
  const { t } = useTranslation();
  const location = useLocation();
  const id = location.state.id;

  const [duRows, setDuRows] = useState([
    {
      du_serial_no: "",
      nozel_1: "",
      nozel_2: "",
      nozel_3: "",
      nozel_4: "",
      nozel_5: "",
      nozel_6: "",
      nozel_7: "",
      nozel_8: "",
    },
  ]);

  const [rows, setRows] = useState([
    {
      earth_pit_type: "",
      resistance_of_individual_earth_pit_ohm: "",
      earth_pit_identification_board_available: "",
      funnel_available: "",
      clamp_available: "",
      size_of_pipes_50mm: "",
      clamp_nutbolt_replaced: "",
      chamber_size_18x18: "",
      chamber_cover_available: "",
    },
  ]);

  const handleAddDuRow = () => {
    setDuRows([
      ...duRows,
      {
        du_serial_no: "",
        nozel_1: "",
        nozel_2: "",
        nozel_3: "",
        nozel_4: "",
        nozel_5: "",
        nozel_6: "",
        nozel_7: "",
        nozel_8: "",
      },
    ]);
  };
  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        earth_pit_type: "",
        resistance_of_individual_earth_pit_ohm: "",
        earth_pit_identification_board_available: "",
        funnel_available: "",
        clamp_available: "",
        size_of_pipes_50mm: "",
        clamp_nutbolt_replaced: "",
        chamber_size_18x18: "",
        chamber_cover_available: "",
      },
    ]);
  };

  const handleRemoveRow = (index) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };
  const handleDuRemoveRow = (index) => {
    const newRows = [...duRows];
    newRows.splice(index, 1);
    setDuRows(newRows);
  };
  // console.log("rows", rows);
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      id: id,
      earth_pit: rows.map((item) => ({
        ...item,
        earth_pit_type: item.earth_pit_type.label,
        resistance_of_individual_earth_pit_ohm:
          item.resistance_of_individual_earth_pit_ohm,
        earth_pit_identification_board_available:
          item.earth_pit_identification_board_available.label,
        funnel_available: item.funnel_available.label,
        clamp_available: item.clamp_available.label,
        chamber_size_18x18: item.chamber_size_18x18.label,
        size_of_pipes_50mm: item.size_of_pipes_50mm.label,
        clamp_nutbolt_replaced: item.clamp_nutbolt_replaced.label,
        chamber_cover_available: item.chamber_cover_available.label,
      })),
      du_hose: duRows,
      rubber_hose_image: {
        decantation_file: values.decantation_file,
      },

      crocodile_clamp: [
        {
          continuity_of_earth_clamp: values.continuity_of_earth_clamp,
          clamps_at_both_ends_rust_free: values.clamps_at_both_ends_rust_free,
          physical_condition_of_flexible_copper_wire_or_strip:
            values.physical_condition_of_flexible_copper_wire_or_strip,
        },
      ],
      earth_point: [
        {
          decantation_earth_point_connected_to_separate_earth_pit:
            values.decantation_earth_point_connected_to_separate_earth_pit,
          continuity_from_earth_pit_to_decantation_earth_point:
            values.continuity_from_earth_pit_to_decantation_earth_point,
          decantation_earth_point_properly_installed_with_frame_near_filling_points:
            values.decantation_earth_point_properly_installed_with_frame_near_filling_points,
          safety_message_display_board_provided_with_decantation_earth_point:
            values.safety_message_display_board_provided_with_decantation_earth_point,
        },
      ],
      earth_point_image: {
        earth_point_image: values.earth_point_image,
      },
    };
    // return console.log("sData", sData);

    const res = await postEarthingTestingEarthPitReport(sData);
    if (res.status) {
      toast.success(res.message);
      navigate(-1);
    } else {
      toast.error(res.message);
    }
    // resetForm();
    setSubmitting(false);
  };

  const formatOptionLabel = ({ label, image }) => (
    <div>
      <img
        src={
          image
            ? `${process.env.REACT_APP_API_URL}${image}`
            : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
        }
        className="avatar me-2"
      />
      {label}
    </div>
  );

  const getDecantationImageLink = (file) => {
    const type = file?.split(":")[0] == "data" ? "new" : "edit";
    if (type == "new") {
      return file;
    } else {
      const url = `${process.env.REACT_APP_API_URL}${file}`;
      return url;
    }
  };
  const getEarthPointImageLink = (file) => {
    const type = file?.split(":")[0] == "data" ? "new" : "edit";
    if (type == "new") {
      return file;
    } else {
      const url = `${process.env.REACT_APP_API_URL}${file}`;
      return url;
    }
  };

  return (
    <>
      <Helmet>
        <title>{"Create"} Earthing Testing · CMS Electricals</title>
      </Helmet>

      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent title={"Create Pdf"} showBackButton={true}>
          <Formik
            enableReinitialize={true}
            initialValues={{}}
            // validationSchema={addEarthingTestingSchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props?.handleSubmit}>
                <Row className="g-2">
                  <div>
                    {rows.map((row, index) => (
                      <div className="shadow p-3 mb-2" key={index}>
                        <Row className="g-3 align-items-center">
                          <Form.Group as={Col} md={4}>
                            <Form.Label>
                              {t("EARTH PIT TYPE (PLATE/PIPE)")}
                            </Form.Label>
                            <Select
                              menuPortalTarget={document.body}
                              name={`earth_pit_type_${index}`}
                              value={row.earth_pit_type}
                              onChange={(val) => {
                                const newRows = [...rows];
                                newRows[index].earth_pit_type = val;
                                setRows(newRows);
                              }}
                              options={[
                                { label: "Pipe", value: 0 },
                                { label: "Plate", value: 1 },
                              ]}
                            />
                            <ErrorMessage
                              name={`earth_pit_type_${index}`}
                              component="small"
                              className="text-danger"
                            />
                          </Form.Group>

                          <Form.Group as={Col} md={4}>
                            <Form.Label>
                              {t("RESISTANCE OF INDIVIDUAL EARTH PIT")}
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name={`resistance_of_individual_earth_pit_ohm_${index}`}
                              value={row.resistance_of_individual_earth_pit_ohm}
                              onChange={(e) => {
                                const newRows = [...rows];
                                newRows[
                                  index
                                ].resistance_of_individual_earth_pit_ohm =
                                  e.target.value;
                                setRows(newRows);
                              }}
                              isInvalid={Boolean(
                                props.touched[
                                  `resistance_of_individual_earth_pit_ohm_${index}`
                                ] &&
                                  props.errors[
                                    `resistance_of_individual_earth_pit_ohm_${index}`
                                  ]
                              )}
                            />
                            <ErrorMessage
                              name={`resistance_of_individual_earth_pit_ohm_${index}`}
                              component="small"
                              className="text-danger"
                            />
                          </Form.Group>

                          <Form.Group as={Col} md={4}>
                            <Form.Label>
                              {t("EARTH PIT IDENTIFICATION BOARD AVAILABLE")}
                            </Form.Label>
                            <Select
                              menuPortalTarget={document.body}
                              name={`earth_pit_identification_board_available_${index}`}
                              value={
                                row.earth_pit_identification_board_available
                              }
                              onChange={(val) => {
                                const newRows = [...rows];
                                newRows[
                                  index
                                ].earth_pit_identification_board_available =
                                  val;
                                setRows(newRows);
                              }}
                              options={[
                                { label: "Yes", value: 0 },
                                { label: "No", value: 1 },
                              ]}
                            />
                            <ErrorMessage
                              name={`earth_pit_identification_board_available_${index}`}
                              component="small"
                              className="text-danger"
                            />
                          </Form.Group>

                          <Form.Group as={Col} md={4}>
                            <Form.Label>{t("FUNNEL AVAILABLE")}</Form.Label>
                            <Select
                              menuPortalTarget={document.body}
                              name={`funnel_available_${index}`}
                              value={row.funnel_available}
                              onChange={(val) => {
                                const newRows = [...rows];
                                newRows[index].funnel_available = val;
                                setRows(newRows);
                              }}
                              options={[
                                { label: "Yes", value: 0 },
                                { label: "No", value: 1 },
                              ]}
                            />
                            <ErrorMessage
                              name={`funnel_available_${index}`}
                              component="small"
                              className="text-danger"
                            />
                          </Form.Group>

                          <Form.Group as={Col} md={4}>
                            <Form.Label>{t("CLAMP AVAILABLE")}</Form.Label>
                            <Select
                              menuPortalTarget={document.body}
                              name={`clamp_available_${index}`}
                              value={row.clamp_available}
                              onChange={(val) => {
                                const newRows = [...rows];
                                newRows[index].clamp_available = val;
                                setRows(newRows);
                              }}
                              options={[
                                { label: "Yes", value: 0 },
                                { label: "No", value: 1 },
                              ]}
                            />
                            <ErrorMessage
                              name={`clamp_available_${index}`}
                              component="small"
                              className="text-danger"
                            />
                          </Form.Group>

                          <Form.Group as={Col} md={4}>
                            <Form.Label>{t("SIZE OF PIPE (50mm)")}</Form.Label>
                            <Select
                              menuPortalTarget={document.body}
                              name={`size_of_pipes_50mm_${index}`}
                              value={row.size_of_pipes_50mm}
                              onChange={(val) => {
                                const newRows = [...rows];
                                newRows[index].size_of_pipes_50mm = val;
                                setRows(newRows);
                              }}
                              options={[
                                { label: "Yes", value: 0 },
                                { label: "No", value: 1 },
                              ]}
                            />
                            <ErrorMessage
                              name={`size_of_pipes_50mm_${index}`}
                              component="small"
                              className="text-danger"
                            />
                          </Form.Group>

                          <Form.Group as={Col} md={4}>
                            <Form.Label>
                              {t("CLAMP NUTBOLT REPLACED")}
                            </Form.Label>
                            <Select
                              menuPortalTarget={document.body}
                              name={`clamp_nutbolt_replaced_${index}`}
                              value={row.clamp_nutbolt_replaced}
                              onChange={(val) => {
                                const newRows = [...rows];
                                newRows[index].clamp_nutbolt_replaced = val;
                                setRows(newRows);
                              }}
                              options={[
                                { label: "Yes", value: 0 },
                                { label: "No", value: 1 },
                              ]}
                            />
                            <ErrorMessage
                              name={`clamp_nutbolt_replaced_${index}`}
                              component="small"
                              className="text-danger"
                            />
                          </Form.Group>

                          <Form.Group as={Col} md={4}>
                            <Form.Label>{t("CHAMBER SIZE (18*18)")}</Form.Label>
                            <Select
                              menuPortalTarget={document.body}
                              name={`chamber_size_18x18_${index}`}
                              value={row.chamber_size_18x18}
                              onChange={(val) => {
                                const newRows = [...rows];
                                newRows[index].chamber_size_18x18 = val;
                                setRows(newRows);
                              }}
                              options={[
                                { label: "Yes", value: 0 },
                                { label: "No", value: 1 },
                              ]}
                            />
                            <ErrorMessage
                              name={`chamber_size_18x18_${index}`}
                              component="small"
                              className="text-danger"
                            />
                          </Form.Group>

                          <Form.Group as={Col} md={4}>
                            <Form.Label>
                              {t("CHAMBER COVER AVAILABLE")}
                            </Form.Label>
                            <Select
                              menuPortalTarget={document.body}
                              name={`chamber_cover_available_${index}`}
                              value={row.chamber_cover_available}
                              onChange={(val) => {
                                const newRows = [...rows];
                                newRows[index].chamber_cover_available = val;
                                setRows(newRows);
                              }}
                              options={[
                                { label: "Yes", value: 0 },
                                { label: "No", value: 1 },
                              ]}
                            />
                            <ErrorMessage
                              name={`chamber_cover_available_${index}`}
                              component="small"
                              className="text-danger"
                            />
                          </Form.Group>
                          {index > 0 && (
                            <Col md={2}>
                              <span
                                disabled={index === 0}
                                className="mt-4 shadow text-danger danger-combo p-2"
                                onClick={() => handleRemoveRow(index)}
                              >
                                <BsXLg /> {/* Trash icon */}
                              </span>
                            </Col>
                          )}
                        </Row>
                      </div>
                    ))}
                    <div className="m-2 mt-3">
                      <span
                        className=" shadow p-2 success-combo text-success"
                        onClick={handleAddRow}
                      >
                        <BsPlusLg />
                      </span>
                    </div>
                  </div>

                  <div>
                    {duRows.map((row, index) => (
                      <div className="shadow p-3 mb-2" key={index}>
                        <Row className="g-3 align-items-center">
                          {/* DU Serial No */}
                          <Form.Group as={Col} md={4}>
                            <Form.Label>{t("DU MAKE MODEL Sr no.")}</Form.Label>
                            <Form.Control
                              type="text"
                              name={`du_serial_no_${index}`}
                              value={row.du_serial_no}
                              onChange={(e) => {
                                const newRows = [...duRows];
                                newRows[index].du_serial_no = e.target.value;
                                setDuRows(newRows);
                              }}
                              isInvalid={Boolean(
                                props.touched[`du_serial_no_${index}`] &&
                                  props.errors[`du_serial_no_${index}`]
                              )}
                            />
                            <ErrorMessage
                              name={`du_serial_no_${index}`}
                              component="small"
                              className="text-danger"
                            />
                          </Form.Group>

                          {/* Nozel 1 */}
                          <Form.Group as={Col} md={4}>
                            <Form.Label>
                              {t("NOZEL-1 PRODUCT CONT.")}
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name={`nozel_1_${index}`}
                              value={row.nozel_1}
                              onChange={(e) => {
                                const newRows = [...duRows];
                                newRows[index].nozel_1 = e.target.value;
                                setDuRows(newRows);
                              }}
                              isInvalid={Boolean(
                                props.touched[`nozel_1_${index}`] &&
                                  props.errors[`nozel_1_${index}`]
                              )}
                            />
                            <ErrorMessage
                              name={`nozel_1_${index}`}
                              component="small"
                              className="text-danger"
                            />
                          </Form.Group>

                          {/* Nozel 2 */}
                          <Form.Group as={Col} md={4}>
                            <Form.Label>
                              {t("NOZEL-2 PRODUCT CONT.")}
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name={`nozel_2_${index}`}
                              value={row.nozel_2}
                              onChange={(e) => {
                                const newRows = [...duRows];
                                newRows[index].nozel_2 = e.target.value;
                                setDuRows(newRows);
                              }}
                              isInvalid={Boolean(
                                props.touched[`nozel_2_${index}`] &&
                                  props.errors[`nozel_2_${index}`]
                              )}
                            />
                            <ErrorMessage
                              name={`nozel_2_${index}`}
                              component="small"
                              className="text-danger"
                            />
                          </Form.Group>

                          {/* Nozel 3 */}
                          <Form.Group as={Col} md={4}>
                            <Form.Label>
                              {t("NOZEL-3 PRODUCT CONT.")}
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name={`nozel_3_${index}`}
                              value={row.nozel_3}
                              onChange={(e) => {
                                const newRows = [...duRows];
                                newRows[index].nozel_3 = e.target.value;
                                setDuRows(newRows);
                              }}
                              isInvalid={Boolean(
                                props.touched[`nozel_3_${index}`] &&
                                  props.errors[`nozel_3_${index}`]
                              )}
                            />
                            <ErrorMessage
                              name={`nozel_3_${index}`}
                              component="small"
                              className="text-danger"
                            />
                          </Form.Group>

                          {/* Repeat the above pattern for Nozel 4, 5, 6, 7, and 8 */}

                          {/* Nozel 4 */}
                          <Form.Group as={Col} md={4}>
                            <Form.Label>
                              {t("NOZEL-4 PRODUCT CONT.")}
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name={`nozel_4_${index}`}
                              value={row.nozel_4}
                              onChange={(e) => {
                                const newRows = [...duRows];
                                newRows[index].nozel_4 = e.target.value;
                                setDuRows(newRows);
                              }}
                              isInvalid={Boolean(
                                props.touched[`nozel_4_${index}`] &&
                                  props.errors[`nozel_4_${index}`]
                              )}
                            />
                            <ErrorMessage
                              name={`nozel_4_${index}`}
                              component="small"
                              className="text-danger"
                            />
                          </Form.Group>

                          {/* Nozel 5 */}
                          <Form.Group as={Col} md={4}>
                            <Form.Label>
                              {t("NOZEL-5 PRODUCT CONT.")}
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name={`nozel_5_${index}`}
                              value={row.nozel_5}
                              onChange={(e) => {
                                const newRows = [...duRows];
                                newRows[index].nozel_5 = e.target.value;
                                setDuRows(newRows);
                              }}
                              isInvalid={Boolean(
                                props.touched[`nozel_5_${index}`] &&
                                  props.errors[`nozel_5_${index}`]
                              )}
                            />
                            <ErrorMessage
                              name={`nozel_5_${index}`}
                              component="small"
                              className="text-danger"
                            />
                          </Form.Group>

                          {/* Nozel 6 */}
                          <Form.Group as={Col} md={4}>
                            <Form.Label>
                              {t("NOZEL-6 PRODUCT CONT.")}
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name={`nozel_6_${index}`}
                              value={row.nozel_6}
                              onChange={(e) => {
                                const newRows = [...duRows];
                                newRows[index].nozel_6 = e.target.value;
                                setDuRows(newRows);
                              }}
                              isInvalid={Boolean(
                                props.touched[`nozel_6_${index}`] &&
                                  props.errors[`nozel_6_${index}`]
                              )}
                            />
                            <ErrorMessage
                              name={`nozel_6_${index}`}
                              component="small"
                              className="text-danger"
                            />
                          </Form.Group>

                          {/* Nozel 7 */}
                          <Form.Group as={Col} md={4}>
                            <Form.Label>
                              {t("NOZEL-7 PRODUCT CONT.")}
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name={`nozel_7_${index}`}
                              value={row.nozel_7}
                              onChange={(e) => {
                                const newRows = [...duRows];
                                newRows[index].nozel_7 = e.target.value;
                                setDuRows(newRows);
                              }}
                              isInvalid={Boolean(
                                props.touched[`nozel_7_${index}`] &&
                                  props.errors[`nozel_7_${index}`]
                              )}
                            />
                            <ErrorMessage
                              name={`nozel_7_${index}`}
                              component="small"
                              className="text-danger"
                            />
                          </Form.Group>

                          {/* Nozel 8 */}
                          <Form.Group as={Col} md={4}>
                            <Form.Label>
                              {t("NOZEL-8 PRODUCT CONT.")}
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name={`nozel_8_${index}`}
                              value={row.nozel_8}
                              onChange={(e) => {
                                const newRows = [...duRows];
                                newRows[index].nozel_8 = e.target.value;
                                setDuRows(newRows);
                              }}
                              isInvalid={Boolean(
                                props.touched[`nozel_8_${index}`] &&
                                  props.errors[`nozel_8_${index}`]
                              )}
                            />
                            <ErrorMessage
                              name={`nozel_8_${index}`}
                              component="small"
                              className="text-danger"
                            />
                          </Form.Group>

                          {/* Remove Button */}
                          {index > 0 && (
                            <Col md={2}>
                              <span
                                className="mt-4 shadow text-danger danger-combo p-2"
                                onClick={() => handleDuRemoveRow(index)}
                              >
                                <BsXLg /> {/* Trash icon */}
                              </span>
                            </Col>
                          )}
                        </Row>
                      </div>
                    ))}
                    <div className="m-2 mt-3">
                      <span
                        className=" shadow p-2 success-combo text-success"
                        onClick={handleAddDuRow}
                      >
                        <BsPlusLg />
                      </span>
                    </div>
                  </div>

                  {/* <div className="shadow p-3 mb-2">
                    <Row className="g-3 align-items-center">
                      <strong>DU HOSE PIPE CONTINUITY TEST REPORT</strong>

                      <Form.Group as={Col} md={4}>
                        <Form.Label>{t("DU MAKE MODEL Sr no.")}</Form.Label>
                        <Form.Control
                          type="text"
                          name="du_serial_no"
                          value={props.values.du_serial_no}
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          isInvalid={Boolean(
                            props.touched.du_serial_no &&
                              props.errors.du_serial_no
                          )}
                        />
                        <ErrorMessage
                          name="du_serial_no"
                          component="small"
                          className="text-danger"
                        />
                      </Form.Group>
                      <Form.Group as={Col} md={4}>
                        <Form.Label>{t("NOZEL-1 PRODUCT CONT.")}</Form.Label>
                        <Form.Control
                          type="text"
                          name="nozel_1"
                          value={props.values.nozel_1}
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          isInvalid={Boolean(
                            props.touched.nozel_1 && props.errors.nozel_1
                          )}
                        />

                        <ErrorMessage
                          name="nozel_1"
                          component="small"
                          className="text-danger"
                        />
                      </Form.Group>
                      <Form.Group as={Col} md={4}>
                        <Form.Label>{t("NOZEL-2 PRODUCT CONT.")}</Form.Label>
                        <Form.Control
                          type="text"
                          name="nozel_2"
                          value={props.values.nozel_2}
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          isInvalid={Boolean(
                            props.touched.nozel_2 && props.errors.nozel_2
                          )}
                        />

                        <ErrorMessage
                          name="nozel_2"
                          component="small"
                          className="text-danger"
                        />
                      </Form.Group>
                      <Form.Group as={Col} md={4}>
                        <Form.Label>{t("NOZEL-3 PRODUCT CONT.")}</Form.Label>
                        <Form.Control
                          type="text"
                          name="nozel_3"
                          value={props.values.nozel_3}
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          isInvalid={Boolean(
                            props.touched.nozel_3 && props.errors.nozel_3
                          )}
                        />

                        <ErrorMessage
                          name="nozel_3"
                          component="small"
                          className="text-danger"
                        />
                      </Form.Group>
                      <Form.Group as={Col} md={4}>
                        <Form.Label>{t("NOZEL-4 PRODUCT CONT.")}</Form.Label>
                        <Form.Control
                          type="text"
                          name="nozel_4"
                          value={props.values.nozel_4}
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          isInvalid={Boolean(
                            props.touched.nozel_4 && props.errors.nozel_4
                          )}
                        />

                        <ErrorMessage
                          name="nozel_4"
                          component="small"
                          className="text-danger"
                        />
                      </Form.Group>
                      <Form.Group as={Col} md={4}>
                        <Form.Label>{t("NOZEL-5 PRODUCT CONT.")}</Form.Label>
                        <Form.Control
                          type="text"
                          name="nozel_5"
                          value={props.values.nozel_5}
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          isInvalid={Boolean(
                            props.touched.nozel_5 && props.errors.nozel_5
                          )}
                        />

                        <ErrorMessage
                          name="nozel_5"
                          component="small"
                          className="text-danger"
                        />
                      </Form.Group>
                      <Form.Group as={Col} md={4}>
                        <Form.Label>{t("NOZEL-6 PRODUCT CONT.")}</Form.Label>
                        <Form.Control
                          type="text"
                          name="nozel_6"
                          value={props.values.nozel_6}
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          isInvalid={Boolean(
                            props.touched.nozel_6 && props.errors.nozel_6
                          )}
                        />

                        <ErrorMessage
                          name="nozel_6"
                          component="small"
                          className="text-danger"
                        />
                      </Form.Group>
                      <Form.Group as={Col} md={4}>
                        <Form.Label>{t("NOZEL-7 PRODUCT CONT.")}</Form.Label>
                        <Form.Control
                          type="text"
                          name="nozel_7"
                          value={props.values.nozel_7}
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          isInvalid={Boolean(
                            props.touched.nozel_7 && props.errors.nozel_7
                          )}
                        />

                        <ErrorMessage
                          name="nozel_7"
                          component="small"
                          className="text-danger"
                        />
                      </Form.Group>
                      <Form.Group as={Col} md={4}>
                        <Form.Label>{t("NOZEL-8 PRODUCT CONT.")}</Form.Label>
                        <Form.Control
                          type="text"
                          name="nozel_8"
                          value={props.values.nozel_8}
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          isInvalid={Boolean(
                            props.touched.nozel_8 && props.errors.nozel_8
                          )}
                        />

                        <ErrorMessage
                          name="nozel_8"
                          component="small"
                          className="text-danger"
                        />
                      </Form.Group>
                    </Row>
                  </div> */}

                  <div className="shadow p-3 mb-2">
                    <Row className="g-3 align-items-center">
                      <strong>
                        DECANTATION RUBBER HOSE PIPE CONTINUITY TEST REPORT
                      </strong>
                      <Form.Group as={Col} md={12} className="">
                        <div className="row">
                          <div className="col-md-4">
                            <Form.Control
                              ref={qr_file_ref}
                              type="file"
                              name="decantation_file"
                              className="my-2"
                              accept="image/png, image/jpeg, image/jpg, image/jfif "
                              onChange={(e) => {
                                const file = e?.target?.files?.[0];
                                if (file?.size > 1000000 * 5) {
                                  return toast.error("File size Is Too Large");
                                }
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (data) => {
                                    props.setFieldValue(
                                      "decantation_file",
                                      data.target.result
                                    );
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </div>

                          {props.values.decantation_file && (
                            <Form.Group as={Col} md={4}>
                              <div className="position-relative d-flex">
                                <ImageViewer
                                  src={getDecantationImageLink(
                                    props.values.decantation_file
                                  )}
                                >
                                  <Image
                                    style={{
                                      height: "120px",
                                      width: "100%",
                                      maxWidth: "100%",
                                    }}
                                    className="object-fit mt-1"
                                    src={getDecantationImageLink(
                                      props.values.decantation_file
                                    )}
                                  />
                                </ImageViewer>

                                <button
                                  type="button"
                                  onClick={() => {
                                    props.setFieldValue("decantation_file", "");
                                    if (qr_file_ref.current) {
                                      qr_file_ref.current.value = "";
                                    }
                                  }}
                                  className="shadow border-0 danger-combo cursor-pointer px-4 py-1 my-1"
                                >
                                  X
                                </button>
                              </div>
                            </Form.Group>
                          )}
                        </div>
                      </Form.Group>
                    </Row>
                  </div>
                  <div className="shadow p-3 mb-2">
                    <Row className="g-3 align-items-center">
                      <strong>
                        EARTH/CROCODILE CLAMP CONTINUITY TEST REPORT
                      </strong>

                      <Form.Group as={Col} md={4}>
                        <Form.Label>
                          CONTINUITY OF THE EARTH CLAMP FROM ONE END TO OTHER
                          END IS?
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="continuity_of_earth_clamp"
                          value={props.values.continuity_of_earth_clamp}
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          isInvalid={Boolean(
                            props.touched.continuity_of_earth_clamp &&
                              props.errors.continuity_of_earth_clamp
                          )}
                        />
                        <ErrorMessage
                          name="continuity_of_earth_clamp"
                          component="small"
                          className="text-danger"
                        />
                      </Form.Group>
                      <Form.Group as={Col} md={4}>
                        <Form.Label>
                          CLAMPS AT THE BOTH ENDS ARE RUST FREE?
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="clamps_at_both_ends_rust_free"
                          value={props.values.clamps_at_both_ends_rust_free}
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          isInvalid={Boolean(
                            props.touched.clamps_at_both_ends_rust_free &&
                              props.errors.clamps_at_both_ends_rust_free
                          )}
                        />
                        <ErrorMessage
                          name="clamps_at_both_ends_rust_free"
                          component="small"
                          className="text-danger"
                        />
                      </Form.Group>
                      <Form.Group as={Col} md={4}>
                        <Form.Label>
                          PHYSICAL CONDITION OF THE FLEXIBLE COPPER WIRE/STRIP
                          CONNECTED BETWEEN THE CLAMPS?
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="physical_condition_of_flexible_copper_wire_or_strip"
                          value={
                            props.values
                              .physical_condition_of_flexible_copper_wire_or_strip
                          }
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          isInvalid={Boolean(
                            props.touched
                              .physical_condition_of_flexible_copper_wire_or_strip &&
                              props.errors
                                .physical_condition_of_flexible_copper_wire_or_strip
                          )}
                        />
                        <ErrorMessage
                          name="physical_condition_of_flexible_copper_wire_or_strip"
                          component="small"
                          className="text-danger"
                        />
                      </Form.Group>
                    </Row>
                  </div>
                  <div className="shadow p-3 mb-2">
                    <Row className="g-3 align-items-center">
                      <strong>
                        DECANTATION EARTH POINT CONTINUITY TEST REPORT
                      </strong>

                      <Form.Group as={Col} md={4}>
                        <Form.Label>
                          IS THE DECANTATION EARTH POINT IS CONNECTED TO THE
                          SEPARATE EARTH PIT?
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="decantation_earth_point_connected_to_separate_earth_pit"
                          value={
                            props.values
                              .decantation_earth_point_connected_to_separate_earth_pit
                          }
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          isInvalid={Boolean(
                            props.touched
                              .decantation_earth_point_connected_to_separate_earth_pit &&
                              props.errors
                                .decantation_earth_point_connected_to_separate_earth_pit
                          )}
                        />
                        <ErrorMessage
                          name="decantation_earth_point_connected_to_separate_earth_pit"
                          component="small"
                          className="text-danger"
                        />
                      </Form.Group>
                      <Form.Group as={Col} md={4}>
                        <Form.Label>
                          CONTINUITY FROM THE EARTH PIT TO DECANTATION EARTH
                          POINT IS?
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="continuity_from_earth_pit_to_decantation_earth_point"
                          value={
                            props.values
                              .continuity_from_earth_pit_to_decantation_earth_point
                          }
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          isInvalid={Boolean(
                            props.touched
                              .continuity_from_earth_pit_to_decantation_earth_point &&
                              props.errors
                                .continuity_from_earth_pit_to_decantation_earth_point
                          )}
                        />
                        <ErrorMessage
                          name="continuity_from_earth_pit_to_decantation_earth_point"
                          component="small"
                          className="text-danger"
                        />
                      </Form.Group>
                      <Form.Group as={Col} md={4}>
                        <Form.Label>
                          IS THE DECANTATION EARTH POINT IS PROPERLY INSTALLED
                          WITH FRAME NEAR THE FILLING POINTS?
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="decantation_earth_point_properly_installed_with_frame_near_filling_points"
                          value={
                            props.values
                              .decantation_earth_point_properly_installed_with_frame_near_filling_points
                          }
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          isInvalid={Boolean(
                            props.touched
                              .decantation_earth_point_properly_installed_with_frame_near_filling_points &&
                              props.errors
                                .decantation_earth_point_properly_installed_with_frame_near_filling_points
                          )}
                        />
                        <ErrorMessage
                          name="decantation_earth_point_properly_installed_with_frame_near_filling_points"
                          component="small"
                          className="text-danger"
                        />
                      </Form.Group>
                      <Form.Group as={Col} md={4}>
                        <Form.Label>
                          IS THE SAFETY MASSAGE DISPLAY BOARD PROVIDED WITH THE
                          DECANTATION EARTH POINT?
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="safety_message_display_board_provided_with_decantation_earth_point"
                          value={
                            props.values
                              .safety_message_display_board_provided_with_decantation_earth_point
                          }
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          isInvalid={Boolean(
                            props.touched
                              .safety_message_display_board_provided_with_decantation_earth_point &&
                              props.errors
                                .safety_message_display_board_provided_with_decantation_earth_point
                          )}
                        />
                        <ErrorMessage
                          name="safety_message_display_board_provided_with_decantation_earth_point"
                          component="small"
                          className="text-danger"
                        />
                      </Form.Group>

                      <Form.Group as={Col} md={12} className="">
                        <Form.Label id="earth_point_image" className="fw-bold">
                          {t("Earth Point Image")}
                        </Form.Label>
                        <div className="row">
                          <div className="col-md-4">
                            <Form.Control
                              ref={qr_file_ref}
                              type="file"
                              name="earth_point_image"
                              className="my-2"
                              accept="image/png, image/jpeg, image/jpg, image/jfif "
                              onChange={(e) => {
                                const file = e?.target?.files?.[0];
                                if (file?.size > 1000000 * 5) {
                                  return toast.error("File size Is Too Large");
                                }
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (data) => {
                                    props.setFieldValue(
                                      "earth_point_image",
                                      data.target.result
                                    );
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </div>

                          {props.values.earth_point_image && (
                            <Form.Group as={Col} md={4}>
                              <div className="position-relative d-flex">
                                <ImageViewer
                                  src={getEarthPointImageLink(
                                    props.values.earth_point_image
                                  )}
                                >
                                  <Image
                                    style={{
                                      height: "120px",
                                      width: "100%",
                                      maxWidth: "100%",
                                    }}
                                    className="object-fit mt-1"
                                    src={getEarthPointImageLink(
                                      props.values.earth_point_image
                                    )}
                                  />
                                </ImageViewer>

                                <button
                                  type="button"
                                  onClick={() => {
                                    props.setFieldValue(
                                      "earth_point_image",
                                      ""
                                    );
                                    if (qr_file_ref.current) {
                                      qr_file_ref.current.value = "";
                                    }
                                  }}
                                  className="shadow border-0 danger-combo cursor-pointer px-4 py-1 my-1"
                                >
                                  X
                                </button>
                              </div>
                            </Form.Group>
                          )}
                        </div>
                      </Form.Group>
                    </Row>
                  </div>

                  <Form.Group as={Col} md={12}>
                    <div className="mt-4 text-center">
                      <button
                        type={"submit"}
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
                          <>{"submit"}</>
                        )}
                      </button>
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

export default PdfForm;
