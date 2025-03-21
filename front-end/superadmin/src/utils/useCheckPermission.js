export const useCheckPermission = (module, subModule, subSubModule) => {
  const data = userPermission.find((itm) => itm.title == module);

  if (subModule && subSubModule == null) {
    return data.submodules?.find((itm2) => itm2.title == subModule);
  } else if (subSubModule) {
    const data3 = data.submodules
      .find((itm2) => itm2.title == subModule)
      .modulesOfSubModule.find((itm3) => itm3.title == subSubModule);
    return data3;
  } else return data;
};
