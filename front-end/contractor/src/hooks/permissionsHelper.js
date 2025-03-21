// Function to check specific permission (view, create, update, delete)
export const checkPermission = (permissions, action) => {
  if (!permissions) return false;
  return permissions[action] === 1;
};

// Function to filter modules based on a specific permission type (e.g., 'view')
export const getFilteredSubmodules = (submodules, permissionType) => {
  return submodules.filter((submodule) =>
    checkPermission(submodule, permissionType)
  );
};

// Example to find a matching path (assuming you have userPermission and pathname logic)
export const findMatchingPath = (userPermission, pathname) => {
  return userPermission?.modules?.find((module) => module.path === pathname);
};
