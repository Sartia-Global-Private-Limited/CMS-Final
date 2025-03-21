import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { BsCameraFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { selectUser } from "../features/auth/authSlice";
import { adminProfileUpdate } from "../services/authapi";

const UploadPhoto = ({ getProfileData }) => {
  const { user } = useSelector(selectUser);
  const [file, setFile] = useState(null);

  const fileHandler = async (e) => {
    setFile(e.target.files[0]);
    const values = new FormData();
    values.set("image", e.target.files[0]);
    values.set("email", user.email);
    values.set("contact_no", user.contact_no);
    values.set("name", user.name);

    const res = await adminProfileUpdate(values);

    if (res.status) {
      toast.success(res.message);
      getProfileData();
    } else {
      toast.error(res.message);
    }
  };
  return (
    <figure className="snip1205">
      <img
        src={
          user.image
            ? `${process.env.REACT_APP_API_URL}${user.image}`
            : "./assets/images/default-image.png"
        }
        alt={user.name}
      />
      <span className="ion-chatboxes">
        <Form.Label controlId="uploadphoto" className="w-100 mb-0">
          <BsCameraFill />
          <Form.Control type="file" onChange={fileHandler} className="d-none" />
        </Form.Label>
      </span>
    </figure>
  );
};

export default UploadPhoto;
