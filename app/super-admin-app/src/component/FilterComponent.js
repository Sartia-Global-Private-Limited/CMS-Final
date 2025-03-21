/*    ----------------Created Date :: 15- Feb -2024    ----------------- */
import {ScrollView, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import NeumorphicDropDownList from './DropDownList';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../utils/ScreenLayout';

import {
  getAllEndUserAssigned,
  getAllMangerAssinged,
  getAllOrderByWithStatus,
  getAllOutletWithStatus,
  getAllRegionalOfficeWithStatus,
  getAllSalesAreaWithStatus,
  getAllSupervisorAssigned,
} from '../redux/slices/commonApi';

import {useDispatch} from 'react-redux';

const FilterComponent = ({
  outletId,
  setOutletId,
  saleId,
  setSaleId,
  roId,
  setRoId,
  orderById,
  setOrderById,
  mangerId,
  setManagerId,
  supervisorId,
  setSupervisorId,
  endUserId,
  setEndUserId,

  status,
}) => {
  const [allOutlet, setAllOutlet] = useState([]);
  const [allRegionalOffice, setAllRegionalOffice] = useState([]);
  const [allSalesArea, setAllSalesArea] = useState([]);
  const [allOrderBy, setAllOrderBy] = useState([]);
  const [allManager, setAllManager] = useState([]);
  const [allSupervisor, setAllSupervisor] = useState([]);
  const [allEndUser, setAllEndUser] = useState([]);

  const dispatch = useDispatch();

  /*function for fetching all outlet data*/
  const fetchAllOutlet = async () => {
    try {
      const result = await dispatch(getAllOutletWithStatus(status)).unwrap();

      if (result.status) {
        const rData = result?.data?.map(itm => ({
          label: itm?.outlet_name,
          value: itm?.id,
        }));
        setAllOutlet(rData);
      } else {
        // ToastAndroid.show(result?.message, ToastAndroid.LONG);
        setAllOutlet([]);
      }
    } catch (error) {
      // ToastAndroid.show(error, ToastAndroid.LONG);
      setAllOutlet([]);
    }
  };

  /*function for fetching all Regional office data*/
  const fetchAllRegionalOffice = async () => {
    try {
      const result = await dispatch(
        getAllRegionalOfficeWithStatus(status),
      ).unwrap();

      if (result.status) {
        const rData = result?.data?.map(itm => ({
          label: itm?.regional_office_name,
          value: itm?.id,
        }));
        setAllRegionalOffice(rData);
      } else {
        // ToastAndroid.show(result?.message, ToastAndroid.LONG);
        setAllRegionalOffice([]);
      }
    } catch (error) {
      // ToastAndroid.show(error, ToastAndroid.LONG);
      setAllRegionalOffice([]);
    }
  };

  /*function for fetching all sales Area data*/
  const fetchAllSalesArea = async () => {
    try {
      const result = await dispatch(getAllSalesAreaWithStatus(status)).unwrap();

      if (result.status) {
        const rData = result?.data?.map(itm => ({
          label: itm?.sales_area_name,
          value: itm?.id,
        }));
        setAllSalesArea(rData);
      } else {
        setAllSalesArea([]);
      }
    } catch (error) {
      setAllSalesArea([]);
    }
  };

  /*function for fetching all order by  data*/
  const fetchAllOrderBy = async () => {
    try {
      const result = await dispatch(getAllOrderByWithStatus(status)).unwrap();

      if (result.status) {
        const rData = result?.data?.map(itm => ({
          label: itm?.name,
          value: itm?.id,
        }));
        setAllOrderBy(rData);
      } else {
        setAllOrderBy([]);
      }
    } catch (error) {
      setAllOrderBy([]);
    }
  };

  /*function for fetching all manger  data*/
  const fetchAllManager = async () => {
    try {
      const result = await dispatch(getAllMangerAssinged()).unwrap();

      if (result.status) {
        const rData = result?.data?.map(itm => ({
          label: itm?.name,
          value: itm?.id,
        }));
        setAllManager(rData);
      } else {
        setAllManager([]);
      }
    } catch (error) {
      setAllManager([]);
    }
  };

  /*function for fetching all supervisor  data*/
  const fetchAllSupervisor = async () => {
    try {
      const result = await dispatch(getAllSupervisorAssigned()).unwrap();

      if (result.status) {
        const rData = result?.data?.map(itm => ({
          label: itm?.name,
          value: itm?.id,
        }));
        setAllSupervisor(rData);
      } else {
        setAllSupervisor([]);
      }
    } catch (error) {
      setAllSupervisor([]);
    }
  };
  /*function for fetching all end user  data*/
  const fetchAllEndUser = async () => {
    try {
      const result = await dispatch(getAllEndUserAssigned()).unwrap();

      if (result.status) {
        const rData = result?.data?.map(itm => ({
          label: itm?.name,
          value: itm?.id,
        }));
        setAllEndUser(rData);
      } else {
        setAllEndUser([]);
      }
    } catch (error) {
      setAllEndUser([]);
    }
  };

  useEffect(() => {
    fetchAllOutlet();
    fetchAllSalesArea();
    fetchAllRegionalOffice();
    fetchAllOrderBy();
    fetchAllManager();
    fetchAllSupervisor();
    fetchAllEndUser();
  }, []);

  return (
    <View style={{paddingHorizontal: WINDOW_WIDTH * 0.04, rowGap: 10}}>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{columnGap: 8}}>
        {setOutletId && (
          <NeumorphicDropDownList
            title={'outlet area'}
            width={WINDOW_WIDTH * 0.5}
            data={allOutlet}
            value={outletId}
            onChange={val => {
              setOutletId(val.value);
            }}
          />
        )}

        {setRoId && (
          <NeumorphicDropDownList
            width={WINDOW_WIDTH * 0.5}
            title={'RO Office'}
            data={allRegionalOffice}
            value={roId}
            onChange={val => {
              setRoId(val.value);
            }}
          />
        )}

        {setSaleId && (
          <NeumorphicDropDownList
            width={WINDOW_WIDTH * 0.5}
            title={'Sales area'}
            data={allSalesArea}
            value={saleId}
            onChange={val => {
              setSaleId(val.value);
            }}
          />
        )}

        {setOrderById && (
          <NeumorphicDropDownList
            width={WINDOW_WIDTH * 0.5}
            title={'order by'}
            data={allOrderBy}
            value={orderById}
            onChange={val => {
              setOrderById(val.value);
            }}
          />
        )}
      </ScrollView>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{columnGap: 8}}>
        {setManagerId && (
          <NeumorphicDropDownList
            width={WINDOW_WIDTH * 0.5}
            title={'Manager'}
            data={allManager}
            value={mangerId}
            onChange={val => {
              setManagerId(val.value);
            }}
          />
        )}

        {setSupervisorId && (
          <NeumorphicDropDownList
            width={WINDOW_WIDTH * 0.5}
            title={'SuperVisor'}
            data={allSupervisor}
            value={supervisorId}
            onChange={val => {
              setSupervisorId(val.value);
            }}
          />
        )}
        {setEndUserId && (
          <NeumorphicDropDownList
            width={WINDOW_WIDTH * 0.5}
            title={'End user'}
            data={allEndUser}
            value={endUserId}
            onChange={val => {
              setEndUserId(val.value);
            }}
          />
        )}
      </ScrollView>
    </View>
  );
};

export default FilterComponent;

const styles = StyleSheet.create({});
