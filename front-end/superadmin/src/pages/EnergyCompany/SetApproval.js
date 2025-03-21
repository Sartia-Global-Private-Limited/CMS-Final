import React, { useEffect, useState } from "react";
import { Button, Col } from "react-bootstrap";
import {
  getApprovelMemberList,
  postApprovelMemberList,
} from "../../services/authapi";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { FilterSelect } from "../../components/FilterSelect";
import NotAllowed from "../Authentication/NotAllowed";

const SetApproval = ({ checkPermission }) => {
  const [assign, setAssign] = useState([]);
  const [roleId, setRoleId] = useState("");
  const { t } = useTranslation();

  const handlerSubmit = async () => {
    const sData = {
      role_id: roleId.value,
      complaint_list: [],
    };
    const res = await postApprovelMemberList(sData);
    if (res.status) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };

  const fetchAssignData = async () => {
    const res = await getApprovelMemberList();
    if (res.status) {
      setAssign(
        res.data?.map((itm) => ({
          label: itm?.name,
          value: itm?.id,
        }))
      );
    } else {
      setAssign([]);
      toast.error(res.message);
    }
  };

  useEffect(() => {
    fetchAssignData();
  }, []);

  return (
    <>
      {checkPermission?.create ? (
        <FilterSelect
          data={[
            {
              id: roleId,
              setId: setRoleId,
              title: t("select role"),
              data: assign,
              md: 6,
              hyperText:
                "Select the role you want to allow for complaint approval.",
            },
          ]}
          customField={
            <Col md={3}>
              <Button variant="success" onClick={() => handlerSubmit()}>
                {t("submit")}
              </Button>
            </Col>
          }
        />
      ) : (
        <NotAllowed />
      )}
    </>
  );
};

export default SetApproval;
