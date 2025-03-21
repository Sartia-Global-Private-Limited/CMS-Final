import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAllModuleByRoleId,
  postRolesPermissions,
} from "../../services/authapi";
import { useEffect } from "react";
import { Col, Form, Spinner } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { getIcons } from "../../constants/getIcons";
import { BsRecord2 } from "react-icons/bs";
import { Formik } from "formik";
import { toast } from "react-toastify";
import CardComponent from "../../components/CardComponent";
import LoaderUi from "../../components/LoaderUi";

const ViewRolesPermissions = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);

  const fetchAllModulesData = async () => {
    const res = await getAllModuleByRoleId(id);
    if (res.status) {
      setModules(res.data);
    } else {
      setModules([]);
    }
    setIsLoading(false);
  };

  const updatePermission = (
    moduleId,
    permissionType,
    submoduleId,
    nestedSubmoduleId
  ) => {
    const updatedModules = modules.map((item) => {
      if (item.id === moduleId) {
        if (!submoduleId) {
          return {
            ...item,
            [permissionType]: item[permissionType] === 1 ? 0 : 1,
          };
        }

        const updatedSubmodules = item.submodules.map((submodule) => {
          if (submodule.id === submoduleId) {
            if (!nestedSubmoduleId) {
              return {
                ...submodule,
                [permissionType]: submodule[permissionType] === 1 ? 0 : 1,
              };
            }

            const updatedNestedSubmodules = submodule.modulesOfSubModule.map(
              (nestedSubmodule) => {
                if (nestedSubmodule.id === nestedSubmoduleId) {
                  return {
                    ...nestedSubmodule,
                    [permissionType]:
                      nestedSubmodule[permissionType] === 1 ? 0 : 1,
                  };
                } else {
                  return nestedSubmodule;
                }
              }
            );

            return {
              ...submodule,
              modulesOfSubModule: updatedNestedSubmodules,
            };
          } else {
            return submodule;
          }
        });

        return {
          ...item,
          submodules: updatedSubmodules,
        };
      } else {
        return item;
      }
    });

    setModules(updatedModules);
  };

  useEffect(() => {
    fetchAllModulesData();
  }, []);

  const permissions = ["create", "update", "view", "delete"];

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      moduleName: modules,
      role_id: id,
    };

    // return console.log("sData", sData);
    const res = await postRolesPermissions(sData);
    if (res.status) {
      toast.success(res.message);
      resetForm();
      navigate(-1);
    } else {
      toast.error(res.message);
    }
    setSubmitting(false);
  };

  if (isLoading) {
    return <LoaderUi />;
  }

  return (
    <Col md={12} data-aos={"fade-up"}>
      <Helmet>
        <title>Permissions Features · CMS Electricals</title>
      </Helmet>
      <CardComponent className={"after-bg-light"} title={"Edit Permissions"}>
        <Formik
          enableReinitialize={true}
          initialValues={{
            modules: "",
          }}
          onSubmit={handleSubmit}
        >
          {(props) => (
            <Form onSubmit={props.handleSubmit}>
              <div className="d-grid gap-2">
                {modules.map((item, index) => (
                  <div key={index} className="d-grid gap-3 shadow px-3 py-2">
                    <div className={"text-black fw-bolder"}>
                      {getIcons(item.icon)} {item.title}
                    </div>
                    {item?.submodules?.length > 0 ? null : (
                      <div key={index} className="d-grid gap-3">
                        <div className="d-flex gap-3">
                          {permissions?.map((el) => (
                            <label key={el}>
                              <input
                                className="form-check-input"
                                checked={item[el] === 1}
                                type="checkbox"
                                onChange={() => updatePermission(item.id, el)}
                              />
                              {el}
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                    {item?.submodules?.length > 0
                      ? item.submodules.map((submodule, subIndex) => (
                          <>
                            <div key={subIndex}>
                              <div className={"text-gray fw-bolder mb-2"}>
                                <BsRecord2 /> {submodule.title}
                              </div>
                              <div className="d-grid gap-3">
                                <div className="d-flex gap-3">
                                  {permissions?.map((el) => (
                                    <label key={el}>
                                      <input
                                        className="form-check-input"
                                        checked={submodule[el] === 1}
                                        type="checkbox"
                                        onChange={() =>
                                          updatePermission(
                                            item.id,
                                            el,
                                            submodule.id
                                          )
                                        }
                                      />
                                      {el}
                                    </label>
                                  ))}
                                </div>
                              </div>
                            </div>
                            {submodule?.modulesOfSubModule?.length > 0
                              ? submodule?.modulesOfSubModule?.map(
                                  (moduleOfSubModule, moduleIndex) => (
                                    <div key={moduleIndex} className="ms-3">
                                      <div
                                        className={"text-gray fw-bolder mb-2"}
                                      >
                                        <BsRecord2 /> {moduleOfSubModule.title}
                                      </div>
                                      <div className="d-grid gap-3">
                                        <div className="d-flex gap-3">
                                          {permissions?.map((el) => (
                                            <label key={el}>
                                              <input
                                                className="form-check-input"
                                                checked={
                                                  moduleOfSubModule[el] === 1
                                                }
                                                type="checkbox"
                                                onChange={() =>
                                                  updatePermission(
                                                    item.id,
                                                    el,
                                                    submodule.id,
                                                    moduleOfSubModule.id
                                                  )
                                                }
                                              />
                                              {el}
                                            </label>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  )
                                )
                              : null}
                          </>
                        ))
                      : null}
                  </div>
                ))}

                <div className="text-center mt-4">
                  <button
                    type="submit"
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
                      <>{"SAVE Permissions"}</>
                    )}
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </CardComponent>
    </Col>
  );
};

export default ViewRolesPermissions;
