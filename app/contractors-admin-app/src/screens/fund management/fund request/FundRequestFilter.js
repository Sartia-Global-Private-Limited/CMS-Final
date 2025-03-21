/*    ----------------Created Date :: 2- May -2024   ----------------- */

import { ScrollView, StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import NeumorphicDropDownList from '../../../component/DropDownList';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../utils/ScreenLayout';
import { useDispatch } from 'react-redux';
import {
  getAllManger,
  getAllSupervisorByMangaerId,
  getAllSupplier,
  getAllUsers,
} from '../../../redux/slices/commonApi';
import { getAllFreeUserList } from '../../../redux/slices/allocate/allocateComplaintSlice';
import Toast from 'react-native-toast-message';
import { getFundRequestDetailById } from '../../../redux/slices/fund-management/fund-request/getFundRequestDetailSlice';
import { Text } from 'react-native';

const FundRequestFilter = ({ formik, edit_id, index }) => {
  const dispatch = useDispatch();
  const [allOffice, setAllOffice] = useState([]);
  const [allManger, setAllManager] = useState([]);
  const [allSupervisor, setAllSupervisor] = useState([]);
  const [allEndUser, setAllEndUser] = useState([]);
  const [allSupplier, setAllSuupplier] = useState([]);

  useEffect(() => {
    fetchAllSupplier();
    fetchMangerData();
    fetchUserData();
    if (edit_id) {
      fetchSingleDetails();
    }
  }, [edit_id]);

  /*function for fetching supplier data*/
  const fetchAllSupplier = async () => {
    try {
      const result = await dispatch(getAllSupplier()).unwrap();

      if (result.status) {
        const rData = result?.data?.map(itm => ({
          label: itm?.supplier_name,
          value: itm?.id,
        }));

        setAllSuupplier(rData);
      } else {
        setAllSuupplier([]);
      }
    } catch (error) {
      setAllSuupplier([]);
    }
  };
  /*function for fetching Manger list data*/
  const fetchMangerData = async () => {
    try {
      const result = await dispatch(getAllManger()).unwrap();
      if (result.status) {
        const rData = result?.data?.map(itm => ({
          label: itm?.name,
          value: itm?.id,
          image: itm?.image,
        }));

        setAllManager(rData);
      } else {
        setAllManager([]);
      }
    } catch (error) {
      setAllManager([]);
    }
  };

  /*function for fetching User list data*/
  const fetchUserData = async () => {
    try {
      const result = await dispatch(getAllUsers()).unwrap();
      if (result.status) {
        const rData = result?.data?.map(itm => ({
          label: itm?.name,
          value: itm?.id,
          image: itm?.image,
        }));
        setAllOffice(rData);
      } else {
        setAllOffice([]);
      }
    } catch (error) {
      setAllOffice([]);
    }
  };

  /*function for fetching supervisor list data*/
  const hadleTeamMangerChange = async managerId => {
    setAllEndUser([]);
    try {
      const result = await dispatch(
        getAllSupervisorByMangaerId({ managerId }),
      ).unwrap();
      if (result.status) {
        const rData = result?.data.map(itm => {
          return {
            label: itm?.name,
            value: itm?.id,
            image: itm?.image,
          };
        });

        setAllSupervisor(rData);
      } else {
        Toast.show({
          type: 'error',
          text1: result?.message,
          position: 'bottom',
        });

        setAllSupervisor([]);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });

      setAllSupervisor([]);
    }
  };
  /*function for fetching free end user list data*/
  const hadleSupervisorChange = async superVisorId => {
    try {
      const result = await dispatch(getAllFreeUserList(superVisorId)).unwrap();
      if (result.status) {
        const rData = result?.data.map(itm => {
          return {
            label: itm?.name,
            value: itm?.id,
            image: itm?.image,
          };
        });

        setAllEndUser(rData);
      } else {
        Toast.show({
          type: 'error',
          text1: result?.message,
          position: 'bottom',
        });

        setAllEndUser([]);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });

      setAllEndUser([]);
    }
  };
  const fetchSingleDetails = async () => {
    const fetchResult = await dispatch(
      getFundRequestDetailById(edit_id),
    ).unwrap();

    if (fetchResult?.status) {
      // setEdit(fetchResult.data);
      if (fetchResult.data?.fund_request_for == 2) {
        fetchMangerData();
        fetchUserData();

        hadleTeamMangerChange(fetchResult?.data?.area_manager_id?.id);
        hadleSupervisorChange(fetchResult?.data?.supervisor_id?.id);
      }
    } else {
      setEdit([]);
    }
  };

  return (
    <View style={{ marginHorizontal: 10 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ columnGap: 10 }}>
        {formik.values.fund_request_for == 2 && (
          <NeumorphicDropDownList
            width={WINDOW_WIDTH * 0.75}
            title={'office'}
            data={allOffice}
            value={formik.values.request_data[index]?.office_users_id}
            disable={
              edit_id || formik.values.request_data[index]?.area_manager_id
            }
            onChange={val => {
              formik.setFieldValue(
                `request_data.${index}.office_users_id`,
                val.value,
              );
            }}
          />
        )}

        {formik.values.fund_request_for == 2 && (
          <NeumorphicDropDownList
            width={edit_id ? WINDOW_WIDTH * 0.9 : WINDOW_WIDTH * 0.75}
            title={'Manager'}
            data={allManger}
            value={formik.values.request_data[index]?.area_manager_id}
            disable={
              edit_id || formik.values.request_data[index]?.office_users_id
            }
            onChange={val => {
              formik.setFieldValue(
                `request_data.${index}.area_manager_id`,
                val.value,
              );
              hadleTeamMangerChange(val.value);
            }}
          />
        )}

        {formik.values.fund_request_for == 2 && (
          <NeumorphicDropDownList
            width={edit_id ? WINDOW_WIDTH * 0.9 : WINDOW_WIDTH * 0.75}
            title={'supervisor'}
            data={allSupervisor}
            value={formik.values.request_data[index]?.supervisor_id}
            disable={
              edit_id || formik.values.request_data[index]?.office_users_id
            }
            onChange={val => {
              formik.setFieldValue(
                `request_data.${index}.supervisor_id`,
                val.value,
              );
              hadleSupervisorChange(val.value);
            }}
          />
        )}

        {formik.values.fund_request_for == 2 && (
          <NeumorphicDropDownList
            width={WINDOW_WIDTH * 0.75}
            title={'end user'}
            data={allEndUser}
            value={formik.values.request_data[index]?.end_users_id}
            disable={
              edit_id || formik.values.request_data[index]?.office_users_id
            }
            onChange={val => {
              formik.setFieldValue(
                `request_data.${index}.end_users_id`,
                val.value,
              );
            }}
          />
        )}

        <NeumorphicDropDownList
          height={WINDOW_HEIGHT * 0.06}
          width={WINDOW_WIDTH * 0.75}
          title={'supplier name'}
          data={allSupplier}
          disable={edit_id}
          value={formik.values.request_data[index]?.supplier_id}
          onChange={val => {
            formik.setFieldValue(`request_data.${index}.supplier_id`, val);
          }}
        />
      </ScrollView>
    </View>
  );
};

export default FundRequestFilter;

const styles = StyleSheet.create({});
