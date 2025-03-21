/*    ----------------Created Date :: 18- April -2024   ----------------- */

import { StyleSheet, View, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from '../../../utils/ScreenLayout';
import { useDispatch } from 'react-redux';
import Toast from 'react-native-toast-message';
import NeumorphicDropDownList from '../../../component/DropDownList';
import {
  getAllComplaintListByRoId,
  getAllComplaintListByUserId,
  getAllManger,
  getAllRegionalOffice,
  getAllSupervisorByMangaerId,
} from '../../../redux/slices/commonApi';
import { getAllFreeUserList } from '../../../redux/slices/allocate/allocateComplaintSlice';
import { getStockRequestDetailById } from '../../../redux/slices/stock-management/stock-request/getStockRequestDetailSlice';

const ExpensePunchFliter = ({ formik, type, edit_id, edit }) => {
  const dispatch = useDispatch();

  const [allManger, setAllManager] = useState([]);
  // const [allAreaManger, setAllAreaManager] = useState([]);
  const [allRo, setAllRo] = useState([]);
  const [allSupervisor, setAllSupervisor] = useState([]);
  const [allEndUser, setAllEndUser] = useState([]);
  const [allComplaint, setAllComplaint] = useState([]);

  useEffect(() => {
    fetchAllRegionalOffice();
    fetchMangerData();

    if (edit_id) {
      fetchSingleDetails();
    }
    fetchAllComplaint();
  }, [
    edit_id,
    formik.values.regional_office,
    formik.values.area_manager_id,
    formik.values.supervisor_id,
    formik.values.end_users_id,
  ]);

  /*funciton for fetching the single stock detail*/
  const fetchSingleDetails = async () => {
    const fetchResult = await dispatch(
      getStockRequestDetailById(edit_id),
    ).unwrap();

    if (fetchResult?.status) {
      if (fetchResult.data?.expense_punch_for == 2) {
        if (fetchResult?.data?.area_manager_id?.value) {
          hadleTeamMangerChange(fetchResult?.data?.area_manager_id?.value);
        }

        if (fetchResult?.data?.supervisor_id?.value) {
          hadleSupervisorChange(fetchResult?.data?.supervisor_id?.value);
        }
      }
    } else {
      // setEdit([]);
    }
  };

  /*function for fetching complaint data*/
  const fetchAllComplaint = async id => {
    try {
      const result = formik.values.regional_office
        ? await dispatch(
            getAllComplaintListByRoId(formik.values.regional_office),
          ).unwrap()
        : await dispatch(
            getAllComplaintListByUserId(
              formik.values.end_users_id ||
                formik.values.supervisor_id ||
                formik.values.area_manager_id,
            ),
          ).unwrap();

      if (result.status) {
        const rData = result?.data?.map(itm => ({
          label: itm?.complaint_unique_id,
          value: itm?.id,
        }));

        setAllComplaint(rData);
      } else {
        setAllComplaint([]);
      }
    } catch (error) {
      setAllComplaint([]);
    }
  };
  /* function for fetching regional office */
  const fetchAllRegionalOffice = async () => {
    try {
      const result = await dispatch(getAllRegionalOffice()).unwrap();
      if (result?.status) {
        const rData = result?.data.map(itm => ({
          label: itm?.regional_office_name,
          value: itm?.id,
        }));
        setAllRo(rData);
      } else {
        setAllRo([]);
      }
    } catch (error) {
      setAllRo([]);
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

  return (
    <View style={{ margin: WINDOW_WIDTH * 0.02 }}>
      <>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            columnGap: 10,
          }}>
          {formik.values.expense_punch_for == 1 && (
            <NeumorphicDropDownList
              height={WINDOW_HEIGHT * 0.06}
              width={WINDOW_WIDTH * 0.75}
              title={'regional office'}
              required={true}
              data={allRo}
              value={formik.values.regional_office}
              onChange={val => {
                formik.setFieldValue(`regional_office`, val.value);
              }}
            />
          )}
          {formik.values.expense_punch_for == 1 && (
            <NeumorphicDropDownList
              height={WINDOW_HEIGHT * 0.06}
              width={WINDOW_WIDTH * 0.75}
              title={'Area manager'}
              required={true}
              data={allManger}
              value={formik.values.area_manager_id}
              disable={edit_id || formik.values.regional_office}
              onChange={val => {
                formik.setFieldValue(`area_manager_id`, val.value);
              }}
            />
          )}

          {formik.values.expense_punch_for == 2 && (
            <NeumorphicDropDownList
              height={WINDOW_HEIGHT * 0.06}
              width={WINDOW_WIDTH * 0.75}
              title={'manager'}
              data={allManger}
              value={formik.values?.area_manager_id}
              onChange={val => {
                formik.setFieldValue(`end_users_id`, '');
                formik.setFieldValue(`supervisor_id`, '');
                formik.setFieldValue(`area_manager_id`, val.value);
                hadleTeamMangerChange(val.value);
              }}
            />
          )}

          {formik.values.expense_punch_for == 2 && (
            <NeumorphicDropDownList
              height={WINDOW_HEIGHT * 0.06}
              width={WINDOW_WIDTH * 0.75}
              title={'Supervisor'}
              data={allSupervisor}
              value={formik.values?.supervisor_id}
              onChange={val => {
                formik.setFieldValue(`end_users_id`, '');
                formik.setFieldValue(`supervisor_id`, val.value);
                hadleSupervisorChange(val.value);
              }}
            />
          )}

          {formik.values.expense_punch_for == 2 && (
            <NeumorphicDropDownList
              height={WINDOW_HEIGHT * 0.06}
              width={WINDOW_WIDTH * 0.75}
              title={'end user'}
              data={allEndUser}
              value={formik.values?.end_users_id}
              onChange={val => {
                formik.setFieldValue(`end_users_id`, val.value);
              }}
            />
          )}

          <NeumorphicDropDownList
            width={edit_id ? WINDOW_WIDTH * 0.9 : WINDOW_WIDTH * 0.75}
            title={'Complaint no'}
            required={true}
            data={allComplaint}
            value={formik.values.complaint_id}
            onChange={val => {
              formik.setFieldValue(`complaint_id`, val.value);
            }}
            errorMessage={formik?.errors?.complaint_id}
          />
        </ScrollView>
      </>
    </View>
  );
};

export default ExpensePunchFliter;

const styles = StyleSheet.create({});
