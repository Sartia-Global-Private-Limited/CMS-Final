import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/slices/authSlice';

const usePermission = ({ title = '', subtab = '' }) => {
  const { allMenus, activeTab, activeSubTab } = useSelector(selectUser);
  const { user } = useSelector(selectUser);
  const [permissions, setPermissions] = useState({
    view: 1,
    create: 1,
    update: 1,
    delete: 1,
  });

  const findValueByKey = (data, key, value) => {
    if (
      typeof data === 'object' &&
      data !== null &&
      key in data &&
      data[key] === value
    ) {
      return data;
    }

    if (Array.isArray(data)) {
      for (let element of data) {
        const result = findValueByKey(element, key, value);
        if (result) {
          return result;
        }
      }
    }

    if (typeof data === 'object' && data !== null) {
      for (let objValue of Object.values(data)) {
        const result = findValueByKey(objValue, key, value);
        if (result) {
          return result;
        }
      }
    }

    return null;
  };

  useEffect(() => {
    let activetab;
    if (subtab) {
      activetab =
        activeTab + '?tab=' + subtab?.toLowerCase().replace(/\s+/g, '-');
    } else if (activeTab) {
      activetab = activeTab;
    } else {
      activetab = '';
    }

    const module =
      title !== ''
        ? findValueByKey(allMenus, 'title', title)
        : findValueByKey(allMenus, 'path', activetab);

    const resultObject = {
      view: module && module?.view == 1 ? 1 : 0,
      update: module && module?.update == 1 ? 1 : 0,
      delete: module && module?.delete == 1 ? 1 : 0,
      create: module && module?.create == 1 ? 1 : 0,
    };

    setPermissions(resultObject);
  }, [activeTab, activeSubTab, title, subtab]);
  return { permissions };
};
export default usePermission;
