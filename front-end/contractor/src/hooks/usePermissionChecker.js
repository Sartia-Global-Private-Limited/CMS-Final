import { useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../features/auth/authSlice";
import { selectSidebar } from "../features/modules/sidebarModuleSlice";

export function usePermissionChecker(pathname, type) {
  const { sidebar } = useSelector(selectSidebar);
  const { user } = useSelector(selectUser);
  const [isAllowed, setIsAllowed] = useState(true);
  useLayoutEffect(() => {
    if (user && pathname !== "/not-allowed") {
      let mmm = sidebar?.find((module) => module.path === pathname);
      if (mmm && mmm[type] === false) {
        setIsAllowed(false);
      } else {
        sidebar.map((side) => {
          const item = side?.subLinks.find((aa) => aa.path === pathname);
          if (item && item[type] === false) {
            setIsAllowed(false);
          }
        });
      }
    } else {
      setIsAllowed(true);
    }
  }, []);
  return { isAllowed };
}
