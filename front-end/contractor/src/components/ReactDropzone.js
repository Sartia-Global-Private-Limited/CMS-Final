import React from "react";
import { Form } from "react-bootstrap";

const ReactDropzone = (props) => {
  return (
    <div className="file-border">
      <Form.Label controlId="uploadFile">
        {props.title}
        <Form.Control
          multiple
          id={props.id}
          className="d-none"
          type="file"
          name={props.name}
          onChange={props.onChange}
        />
      </Form.Label>
      {/* {imageView && <img src={imageView} alt={user.name} />} */}
    </div>
  );
};

export default ReactDropzone;
