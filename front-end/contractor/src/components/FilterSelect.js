import { Col, Row } from "react-bootstrap";
import Select from "react-select";
import FormLabelText from "./FormLabelText";
import { Filter } from "lucide-react";

export const FilterSelect = ({ data = [], userFormatOptionLabel }) => {
  return (
    <div className="d-flex p-2 gap-1 mt-3">
      <Filter />
      <Row className="g-3 w-100">
        {data?.map((field, index) => (
          <Col key={index} md={3}>
            <FormLabelText children={field?.title} />
            {field?.text ? (
              <div>{field?.text}</div>
            ) : (
              <Select
                menuPortalTarget={document.body}
                options={field?.data}
                onChange={(e) => {
                  if (field?.onChange) {
                    field.onChange(e);
                  }
                  if (e) {
                    field?.setId(e);
                  } else {
                    field?.setId({});
                  }
                }}
                isClearable
                formatOptionLabel={userFormatOptionLabel}
              />
            )}
            {field?.hyperText && (
              <FormLabelText info children={field?.hyperText} />
            )}
          </Col>
        ))}
      </Row>
    </div>
  );
};
