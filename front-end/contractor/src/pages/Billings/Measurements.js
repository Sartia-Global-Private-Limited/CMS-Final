import React, { useEffect, useState } from "react";
import { Col, Table, Form, Button } from "react-bootstrap";
import { BsPlus } from "react-icons/bs";
import { toast } from "react-toastify";
import ConfirmAlert from "../../components/ConfirmAlert";
import ReactPagination from "../../components/ReactPagination";
import { Helmet } from "react-helmet";
import CardComponent from "../../components/CardComponent";
import {
  deleteMeasurementsById,
  discardMeasurementsById,
  getAllMeasurements,
} from "../../services/contractorApi";
import ActionButton from "../../components/ActionButton";
import { Link } from "react-router-dom";
import TooltipComponent from "../../components/TooltipComponent";
import { BsHourglassTop } from "react-icons/bs";
import { useTranslation } from "react-i18next";

const Measurements = () => {
  const [measurement, setMeasurement] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
  const [showDiscard, setShowDiscard] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [isLoading, setIsLoading] = useState(true);
  const [idToDiscard, setIdToDiscard] = useState("");
  const { t } = useTranslation();

  const fetchMeasurementsData = async () => {
    const res = await getAllMeasurements(search, pageSize, pageNo);
    if (res.status) {
      setMeasurement(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setMeasurement([]);
      setPageDetail({});
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    const res = await deleteMeasurementsById(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setMeasurement((prev) => prev.filter((itm) => itm.id !== +idToDelete));
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowDelete(false);
  };

  const handleDiscard = async () => {
    const res = await discardMeasurementsById(idToDiscard);
    if (res.status) {
      toast.success(res.message);
      setMeasurement((prev) => prev.filter((itm) => itm.id !== idToDiscard));
    } else {
      toast.error(res.message);
    }

    setShowDiscard(false);
    setIdToDiscard("");
  };

  useEffect(() => {
    fetchMeasurementsData();
  }, [search, pageNo, pageSize]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  const serialNumber = Array.from(
    { length: pageDetail?.pageEndResult - pageDetail?.pageStartResult + 1 },
    (_, index) => pageDetail?.pageStartResult + index
  );

  return (
    <>
      <Helmet>
        <title>Measurements · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent
          search={true}
          searchOnChange={(e) => {
            setSearch(e.target.value);
          }}
          title={"Measurements"}
          icon={<BsPlus />}
          link={"/Measurements/CreateMeasurement/new"}
          tag={"Create"}
          custom={
            <Form.Control
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              className="w-auto"
              type="date"
            />
          }
        >
          <div className="table-scroll p-2">
            <Table className="text-body bg-new Roles">
              <thead className="text-truncate">
                <tr>
                  {[
                    "Sr No.",
                    "Measurement Date",
                    "Complaint no.",
                    "Outlet/Ro/Po",
                    "po limit",
                    "Complaint Type",
                    "M. Amount",
                    "Status",
                    "Action",
                  ].map((thead) => (
                    <th key={thead}>{thead}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={15}>
                      <img
                        className="p-3"
                        width="250"
                        src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
                        alt={t("Loading")}
                      />
                    </td>
                  </tr>
                ) : measurement.length > 0 ? (
                  <>
                    {measurement.map((data, id1) => (
                      <tr key={id1}>
                        <td>{serialNumber[id1]}</td>
                        <td>
                          <Link
                            className="text-secondary text-none"
                            to={`/Measurements/CreateMeasurement/${data.id}?type=view`}
                          >
                            {data.measurement_date}
                          </Link>
                        </td>
                        <td>{data.complaint_unique_id}</td>
                        <td>
                          {data.outlet_name ? `${data?.outlet_name}/` : null}
                          {data?.regional_office_name
                            ? `${data?.regional_office_name}/`
                            : null}
                          {data.po_number ? `${data?.po_number}` : null}
                        </td>
                        <td>{data.po_limit}</td>
                        <td>{data.complaint_type_name}</td>
                        <td>{data.measurement_amount}</td>
                        <td
                          className={`text-${
                            data?.status === "1" ? "green" : "danger"
                          }`}
                        >
                          {data?.status === "1" ? "Active" : "De-Active"}
                        </td>
                        <td>
                          <ActionButton
                            eyelink={`/Measurements/CreateMeasurement/${data.id}?type=view`}
                            editlink={`/Measurements/CreateMeasurement/${data.id}`}
                            deleteOnclick={() => {
                              setIdToDelete(data.id);
                              setShowDelete(true);
                            }}
                            custom={
                              <TooltipComponent align="left" title={"discard"}>
                                <Button
                                  className={`view-btn`}
                                  variant="light"
                                  onClick={() => {
                                    setShowDiscard(true);
                                    setIdToDiscard(data.id);
                                  }}
                                >
                                  <BsHourglassTop
                                    className={`social-btn red-combo`}
                                  />
                                </Button>
                              </TooltipComponent>
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </>
                ) : (
                  <tr>
                    <td colSpan={15}>
                      <img
                        className="p-3"
                        alt="no-result"
                        width="250"
                        src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                      />
                    </td>
                  </tr>
                )}
              </tbody>
              <ConfirmAlert
                size={"sm"}
                deleteFunction={handleDelete}
                hide={setShowDelete}
                show={showDelete}
                title={"Confirm Delete"}
                description={"Are you sure you want to delete this!!"}
              />

              <ConfirmAlert
                size={"sm"}
                deleteFunction={handleDiscard}
                hide={setShowDiscard}
                show={showDiscard}
                title={"Confirm Discard"}
                description={"Are you sure you want to discard this!!"}
              />
            </Table>
          </div>

          <ReactPagination
            pageSize={pageSize}
            prevClassName={
              pageNo === 1 ? "danger-combo-disable pe-none" : "red-combo"
            }
            nextClassName={
              pageSize == pageDetail?.total
                ? measurement.length - 1 < pageSize
                  ? "danger-combo-disable pe-none"
                  : "success-combo"
                : measurement.length < pageSize
                ? "danger-combo-disable pe-none"
                : "success-combo"
            }
            title={`Showing ${pageDetail?.pageStartResult || 0} to ${
              pageDetail?.pageEndResult || 0
            } of ${pageDetail?.total || 0}`}
            handlePageSizeChange={handlePageSizeChange}
            prevonClick={() => setPageNo(pageNo - 1)}
            nextonClick={() => setPageNo(pageNo + 1)}
          />
        </CardComponent>
      </Col>
    </>
  );
};

export default Measurements;
