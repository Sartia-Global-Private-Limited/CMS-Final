import React from "react";
import { customApi } from "../services/authapi";

export const usePermissionChecker = (pathname, action) => {
  const [sidebarData, setSidebarData] = useState([]);

  customApi.interceptors.request.use(async (config) => {
    // let token = localStorage.getItem("cms-sa-token");
    config.headers = {
      ...config.headers,
    };
    return config;
  });

  return <div>usePermissionChecker</div>;
};
