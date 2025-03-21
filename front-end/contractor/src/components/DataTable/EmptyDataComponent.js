import React from "react";

export const EmptyDataComponent = ({ userPermission = { view: true } }) => {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 5,
        }}
      >
        <p>
          {userPermission?.view ? "No Data Found!!" : "Permission Denied!!"}
        </p>
      </div>
    </>
  );
};
