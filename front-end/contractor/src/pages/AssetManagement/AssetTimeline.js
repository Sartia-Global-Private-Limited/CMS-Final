import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Helmet } from "react-helmet";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import Select from "react-select";
import CardComponent from "../../components/CardComponent";
import {
  getAllAssignedAssets,
  getAssetsTimelineById,
} from "../../services/contractorApi";
import ImageViewer from "../../components/ImageViewer";

const AssetTimeline = () => {
  const [allAssetData, setAllAssetData] = useState([]);
  const [selected, setSelected] = useState([]);
  const [trackingData, setTrackingData] = useState([]);

  const fetchAllAssignedAssets = async () => {
    const res = await getAllAssignedAssets();
    if (res.status) {
      setAllAssetData(res.data);
    } else {
      setAllAssetData([]);
    }
  };
  const fetchEmployeeHistory = async (id) => {
    const res = await getAssetsTimelineById(id);
    if (res.status) {
      setTrackingData(res.data);
    } else {
      setTrackingData([]);
    }
  };

  const handlerFieldValue = async (val) => {
    if (!val) return false;
    fetchEmployeeHistory(val.value);
    setSelected(val.label);
  };

  useEffect(() => {
    fetchAllAssignedAssets();
  }, []);
  return (
    <>
      <Helmet>
        <title>Asset Timeline · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CardComponent classbody={"timebar-area"} title={"Asset Timeline"}>
          <Row className="g-4">
            <Col md={12}>
              <Select
                menuPortalTarget={document.body}
                name="id"
                onChange={(val) => handlerFieldValue(val, "id")}
                options={allAssetData?.map((user) => ({
                  value: user.id,
                  label: user.asset_name,
                }))}
                placeholder="--Select Asset--"
              />
            </Col>
            {selected.includes("") ? (
              <>
                <Col md={12}>
                  <SimpleBar className="area ps-2 pe-3">
                    <p className="hr-border2 text-secondary fw-bolder pb-2">
                      Assets Timeline History
                    </p>
                    <div className="ps-3">
                      {trackingData?.length > 0 ? null : (
                        <div className="text-center">
                          <img
                            className="p-3"
                            alt="no-result"
                            width="290"
                            src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                          />
                        </div>
                      )}
                      {trackingData?.map((data) => (
                        <div key={data} className="hstack gap-4">
                          <div className="vr hr-shadow d-align align-items-baseline">
                            <span
                              className={`bg-${data.color} zIndex rounded-circle btn-play d-flex`}
                              style={{ padding: "7px" }}
                            />
                          </div>
                          <div>
                            <p className="mb-2">
                              <strong>{data.asset_name}</strong>{" "}
                              <span className="small text-gray">
                                ({data.asset_model_number})
                              </span>
                            </p>
                            <p className="mb-2 small">
                              <span className="fw-bold">assigned by</span> -{" "}
                              {data.asset_assigned_by_name}{" "}
                              <span className="small text-gray">
                                ({data.asset_assigned_at})
                              </span>
                            </p>
                            <p className="small">
                              <span className="fw-bold">notes</span> -{" "}
                              {data.notes}
                            </p>
                            <div className="d-flex small align-items-center mt-2 mb-5 hr-border2 pb-4">
                              <span className="fw-bold">assigned to -</span>
                              <ImageViewer
                                src={
                                  data?.asset_assigned_to_image
                                    ? `${process.env.REACT_APP_API_URL}${data?.asset_assigned_to_image}`
                                    : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                }
                              >
                                {" "}
                                <img
                                  className="avatar mx-2"
                                  src={
                                    data?.asset_assigned_to_image
                                      ? `${process.env.REACT_APP_API_URL}${data?.asset_assigned_to_image}`
                                      : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                  }
                                  alt={data.asset_assigned_to_name}
                                />
                              </ImageViewer>
                              <div>{data.asset_assigned_to_name}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </SimpleBar>
                </Col>
              </>
            ) : (
              <Col md={12} className="text-center">
                <img
                  alt="no-result"
                  width="250"
                  src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                />
              </Col>
            )}
          </Row>
        </CardComponent>
      </Col>
    </>
  );
};

export default AssetTimeline;
