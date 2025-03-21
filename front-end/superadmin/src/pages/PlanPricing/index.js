import React, { Fragment, useEffect, useState } from "react";
import "react-best-tabs/dist/index.css";
import { Col } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { BsPlus } from "react-icons/bs";
import CardComponent from "../../components/CardComponent";
import SwiperSlider from "../../components/SwiperSlider";
import { SwiperSlide } from "swiper/react";
import {
  getAdminAllPlanPricing,
  getAdminDeletePlanPricing,
} from "../../services/authapi";
import { toast } from "react-toastify";
import ConfirmAlert from "../../components/ConfirmAlert";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import ActionButtons from "../../components/DataTable/ActionButtons";
import { findMatchingPath, getDateValue } from "../../utils/helper";
import ImageViewer from "../../components/ImageViewer";

const PlanPricing = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [idToDelete, setIdToDelete] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [planPricing, setPlanPricing] = useState([]);
  const [search, setSearch] = useState(0);
  const { userPermission } = useSelector(selectUser);
  const { pathname } = useLocation();
  const [matchingPathObject, setMatchingPathObject] = useState(null);

  const fetchPlanPricingData = async () => {
    const res = await getAdminAllPlanPricing(search);
    if (res.status) {
      setPlanPricing(res.data);
    } else {
      setPlanPricing([]);
    }
  };

  const handleDelete = async () => {
    const res = await getAdminDeletePlanPricing(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setPlanPricing((prev) => prev.filter((itm) => itm.id !== +idToDelete));
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
  };

  // for role and permissions
  useEffect(() => {
    if (userPermission) {
      const result = findMatchingPath(userPermission, pathname);
      setMatchingPathObject(result);
    }
  }, [userPermission, pathname, searchParams, navigate]);

  const checkPermission = matchingPathObject;

  useEffect(() => {
    fetchPlanPricingData();
  }, [search]);

  return (
    <>
      <Helmet>
        <title>Plan & Pricing · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent
          search={true}
          searchOnChange={(e) => {
            setSearch(e.target.value);
          }}
          title={"Plan & Pricing"}
          icon={<BsPlus />}
          link={`/PlanPricing/add`}
          classbody={"pricing-css"}
          tag={checkPermission?.create ? "Create" : null}
        >
          <SwiperSlider showpage={3}>
            {planPricing.length > 0 ? null : (
              <div className="text-center">
                <img
                  className="p-3"
                  alt="no-result"
                  width="250"
                  src="assets/images/no-results.png"
                />
              </div>
            )}
            {planPricing.map((item, ide) => (
              <Fragment key={ide}>
                <SwiperSlide>
                  <div
                    className={`pricing-table ${
                      ide == 0 ? "purple" : ide == 1 ? "turquoise" : "red"
                    }`}
                  >
                    <div className="pricing-label">
                      {getDateValue(item?.updated_at || item?.created_at)}
                    </div>
                    <h2>
                      <ImageViewer
                        src={`${process.env.REACT_APP_API_URL}${item?.image}`}
                      >
                        <img
                          className="my-btn object-fit"
                          src={`${process.env.REACT_APP_API_URL}${item?.image}`}
                          alt=""
                        />
                      </ImageViewer>{" "}
                      {item?.name}{" "}
                    </h2>
                    <h5>{item?.description}</h5>
                    <div className="pricing-features">
                      {item?.modules?.map((moduleData, idx) => {
                        return (
                          <div className="feature" key={idx}>
                            <div>
                              <span>&#10003;</span> {moduleData?.module_name}
                            </div>
                          </div>
                        );
                      })}
                      <hr />
                      <ul style={{ paddingLeft: "1rem" }}>
                        {item?.planCheckLists?.map((itm, idx) =>
                          itm?.checklist_name ? (
                            <li className="feature" key={idx}>
                              {itm?.checklist_name}
                            </li>
                          ) : (
                            ""
                          )
                        )}
                      </ul>
                    </div>
                    <div className="price-tag">
                      <span className="symbol">₹</span>
                      <span className="amount">{item?.price}</span>
                      <span className="after">/{item?.duration}</span>
                    </div>
                    <ActionButtons
                      actions={{
                        edit: {
                          show: checkPermission?.update,
                          action: () =>
                            navigate(`/PlanPricing/edit/${item.id}`),
                        },
                        delete: {
                          show: checkPermission?.delete,
                          action: () => {
                            setIdToDelete(item.id);
                            setShowAlert(true);
                          },
                        },
                      }}
                    />
                  </div>
                </SwiperSlide>
              </Fragment>
            ))}
          </SwiperSlider>
        </CardComponent>
      </Col>

      <ConfirmAlert
        size={"sm"}
        deleteFunction={handleDelete}
        hide={setShowAlert}
        show={showAlert}
        title={"Confirm Delete"}
        description={"Are you sure you want to delete this!!"}
      />
    </>
  );
};

export default PlanPricing;
