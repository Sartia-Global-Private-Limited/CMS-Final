import { getAllModule } from "../services/authapi";

function findModuleIdsByPath(data, pathname) {
  for (const item of data) {
    if (item.path && item.path.includes(pathname)) {
      return {
        module_id: item.id,
        sub_module_id: null,
        module_of_sub_module_id: null,
      };
    }

    if (item.submodules) {
      const submoduleResult = findModuleIdsByPath(item.submodules, pathname);
      if (submoduleResult) {
        return {
          module_id: item.id,
          sub_module_id: submoduleResult.module_id,
          module_of_sub_module_id: submoduleResult?.module_of_sub_module_id,
        };
      }
    }

    if (item.modulesOfSubModule) {
      const modulesOfSubModuleResult = findModuleIdsByPath(
        item.modulesOfSubModule,
        pathname
      );
      if (modulesOfSubModuleResult) {
        return {
          module_id: item.id,
          sub_module_id: null,
          module_of_sub_module_id: modulesOfSubModuleResult.module_id,
        };
      }
    }
  }

  return null;
}

export const checkPermission = async ({ user_id, pathname }) => {
  // console.log("user_id", user_id);
  // console.log("pathname", pathname);
  const res = await getAllModule();
  // console.log("res --->", res);

  if (res.status) {
    const result = findModuleIdsByPath(res.data, pathname);
    return result;
    // console.log("result", result);
    // customApi.interceptors.request.use(async (config) => {
    //   // let token = localStorage.getItem("cms-sa-token");
    //   config.headers = {
    //     ...config.headers,
    //   };
    //   config.params = {
    //     ...config.params,
    //     module_id: result?.module_id || null,
    //     sub_module_id: result?.sub_module_id || null,
    //     module_of_sub_module_id: result?.module_of_sub_module_id || null,
    //     action: action,
    //   };
    //   return config;
    // });
  }
};
