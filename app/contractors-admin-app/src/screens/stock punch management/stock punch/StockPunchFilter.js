/*    ----------------Created Date :: 23- April -2024   ----------------- */

import {StyleSheet, Text, View, Image, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import Colors from '../../../constants/Colors';
import {WINDOW_WIDTH, WINDOW_HEIGHT} from '../../../utils/ScreenLayout';
import NeuomorphAvatar from '../../../component/NeuomorphAvatar';
import {Avatar} from '@rneui/themed';
import {useDispatch} from 'react-redux';
import {Icon} from '@rneui/base';
import Toast from 'react-native-toast-message';
import {apiBaseUrl} from '../../../../config';
import IconType from '../../../constants/IconType';
import Images from '../../../constants/Images';
import NeumorphicDropDownList from '../../../component/DropDownList';
import {
  getAllComplaintListByRoId,
  getAllComplaintListByUserId,
  getAllManger,
  getAllSupervisorByMangaerId,
} from '../../../redux/slices/commonApi';
import {getAllFreeUserList} from '../../../redux/slices/allocate/allocateComplaintSlice';
import {getStockRequestDetailById} from '../../../redux/slices/stock-management/stock-request/getStockRequestDetailSlice';

const StockPunchFilter = ({formik, type, edit_id, edit}) => {
  const dispatch = useDispatch();

  const [allManger, setAllManager] = useState([]);
  const [allSupervisor, setAllSupervisor] = useState([]);
  const [allEndUser, setAllEndUser] = useState([]);
  const [allComplaint, setAllComplaint] = useState([]);

  useEffect(() => {
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
        getAllSupervisorByMangaerId({managerId}),
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

  /*Ui of dropdown list*/
  const renderDropDown = item => {
    return (
      <View
        style={[styles.listView, {backgroundColor: Colors().inputLightShadow}]}>
        {item?.image !== undefined && (
          <NeuomorphAvatar gap={4}>
            <Avatar
              size={30}
              rounded
              source={{
                uri: item?.image
                  ? `${apiBaseUrl}${item?.image}`
                  : `${Image.resolveAssetSource(Images.DEFAULT_PROFILE).uri}`,
              }}
            />
          </NeuomorphAvatar>
        )}

        {item?.label && (
          <Text
            numberOfLines={1}
            style={[
              styles.inputText,
              {marginLeft: 10, color: Colors().pureBlack},
            ]}>
            {item.label}
          </Text>
        )}
      </View>
    );
  };

  return (
    <View style={{margin: WINDOW_WIDTH * 0.03}}>
      <>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            columnGap: 10,
          }}>
          <View style={{rowGap: 8}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={[styles.title, {color: Colors().pureBlack}]}>
                Manager{' '}
              </Text>
            </View>
            <NeumorphicDropDownList
              height={WINDOW_HEIGHT * 0.06}
              width={WINDOW_WIDTH * 0.75}
              RightIconName="caretdown"
              RightIconType={IconType.AntDesign}
              placeholder={'select...'}
              data={allManger}
              labelField={'label'}
              valueField={'value'}
              value={formik.values?.area_manager_id}
              renderItem={renderDropDown}
              search={false}
              placeholderStyle={[styles.inputText, {color: Colors().pureBlack}]}
              selectedTextStyle={[
                styles.selectedTextStyle,
                {color: Colors().pureBlack},
              ]}
              style={[styles.inputText, {color: Colors().pureBlack}]}
              containerStyle={{
                backgroundColor: Colors().inputLightShadow,
              }}
              onChange={val => {
                formik.setFieldValue(`end_users_id`, '');
                formik.setFieldValue(`supervisor_id`, '');
                formik.setFieldValue(`area_manager_id`, val.value);
                hadleTeamMangerChange(val.value);
              }}
            />
          </View>

          <View style={{rowGap: 8}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={[styles.title, {color: Colors().pureBlack}]}>
                Supervisor{' '}
              </Text>
            </View>
            <NeumorphicDropDownList
              height={WINDOW_HEIGHT * 0.06}
              width={WINDOW_WIDTH * 0.75}
              RightIconName="caretdown"
              RightIconType={IconType.AntDesign}
              placeholder={'select...'}
              data={allSupervisor}
              labelField={'label'}
              valueField={'value'}
              value={formik.values?.supervisor_id}
              renderItem={renderDropDown}
              search={false}
              placeholderStyle={[styles.inputText, {color: Colors().pureBlack}]}
              selectedTextStyle={[
                styles.selectedTextStyle,
                {color: Colors().pureBlack},
              ]}
              style={[styles.inputText, {color: Colors().pureBlack}]}
              containerStyle={{
                backgroundColor: Colors().inputLightShadow,
              }}
              onChange={val => {
                formik.setFieldValue(`end_users_id`, '');
                formik.setFieldValue(`supervisor_id`, val.value);
                hadleSupervisorChange(val.value);
              }}
            />
          </View>

          <View style={{rowGap: 8}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={[styles.title, {color: Colors().pureBlack}]}>
                End user{' '}
              </Text>
            </View>
            <NeumorphicDropDownList
              height={WINDOW_HEIGHT * 0.06}
              width={WINDOW_WIDTH * 0.75}
              RightIconName="caretdown"
              RightIconType={IconType.AntDesign}
              placeholder={'select...'}
              data={allEndUser}
              labelField={'label'}
              valueField={'value'}
              value={formik.values?.end_users_id}
              renderItem={renderDropDown}
              search={false}
              placeholderStyle={[styles.inputText, {color: Colors().pureBlack}]}
              selectedTextStyle={[
                styles.selectedTextStyle,
                {color: Colors().pureBlack},
              ]}
              style={[styles.inputText, {color: Colors().pureBlack}]}
              containerStyle={{
                backgroundColor: Colors().inputLightShadow,
              }}
              onChange={val => {
                formik.setFieldValue(`end_users_id`, val.value);
              }}
            />
          </View>

          <View style={{rowGap: 8}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={[styles.title, {color: Colors().pureBlack}]}>
                complaint no.{' '}
              </Text>
              <Icon
                name="asterisk"
                type={IconType.FontAwesome5}
                size={8}
                color={Colors().red}
              />
            </View>
            <NeumorphicDropDownList
              height={WINDOW_HEIGHT * 0.06}
              width={edit_id ? WINDOW_WIDTH * 0.9 : WINDOW_WIDTH * 0.75}
              RightIconName="caretdown"
              RightIconType={IconType.AntDesign}
              placeholder={'select...'}
              data={allComplaint}
              labelField={'label'}
              valueField={'value'}
              value={formik.values.complaint_id}
              renderItem={renderDropDown}
              search={false}
              placeholderStyle={[styles.inputText, {color: Colors().pureBlack}]}
              selectedTextStyle={[
                styles.selectedTextStyle,
                {color: Colors().pureBlack},
              ]}
              style={[styles.inputText, {color: Colors().pureBlack}]}
              containerStyle={{
                backgroundColor: Colors().inputLightShadow,
              }}
              onChange={val => {
                formik.setFieldValue(`complaint_id`, val.value);
              }}
            />
            {formik.touched.complaint_id && formik.errors.complaint_id && (
              <Text style={styles.errorMesage}>
                {formik.errors.complaint_id}
              </Text>
            )}
          </View>
        </ScrollView>
      </>
    </View>
  );
};

export default StockPunchFilter;

const styles = StyleSheet.create({
  inputText: {
    fontSize: 15,
    fontWeight: '300',
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },

  listView: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 3,
  },

  selectedTextStyle: {
    fontSize: 15,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },

  errorMesage: {
    color: Colors().red,
    alignSelf: 'flex-start',
    marginLeft: 15,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },

  title: {
    fontSize: 15,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    flexShrink: 1,
  },
});
