/*    ----------------Created Date :: 10- April -2024   ----------------- */

import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import NeumorphicDropDownList from '../../../component/DropDownList';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../utils/ScreenLayout';
import Colors from '../../../constants/Colors';
import SearchBar from '../../../component/SearchBar';
import IconType from '../../../constants/IconType';
import { Avatar } from '@rneui/base';

import {
  getAllAccount,
  getAllBank,
  getAllManger,
  getAllSupervisorByMangaerId,
  getAllSupplier,
  getAllUsers,
} from '../../../redux/slices/commonApi';
import { getAllFreeUserList } from '../../../redux/slices/allocate/allocateComplaintSlice';
import NeuomorphAvatar from '../../../component/NeuomorphAvatar';
import Images from '../../../constants/Images';
import { apiBaseUrl } from '../../../../config';
import NeumorphDatePicker from '../../../component/NeumorphDatePicker';
import moment from 'moment';
import Toast from 'react-native-toast-message';
import ScreensLabel from '../../../constants/ScreensLabel';

const StockTransactionFilter = ({ formik, type, dateFilter }) => {
  const dispatch = useDispatch();
  const label = ScreensLabel();
  const [allOffice, setAllOffice] = useState([]);
  const [allManger, setAllManager] = useState([]);
  const [allSupervisor, setAllSupervisor] = useState([]);
  const [allEndUser, setAllEndUser] = useState([]);
  const [allBank, setAllBank] = useState([]);
  const [allAccount, setAllAccount] = useState([]);
  const [allSupplier, setAllSupplier] = useState([]);
  const [openFromDate, setOpenFromDate] = useState(false);
  const [openToDate, setOpenToDate] = useState(false);

  useEffect(() => {
    if (formik.values.section_type == '1') {
      fetchAllBank();
    }
    if (formik.values.section_type == '2') {
      fetchMangerData();
      fetchUserData();
    }
    if (formik.values.section_type == '3') {
      fetchSupplierData();
    }
  }, [formik.values.section_type]);

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
  /*function for fetching supervisor list data*/
  const handleBankChange = async bank_id => {
    formik.setFieldValue('account_id', '');
    try {
      const result = await dispatch(getAllAccount(bank_id)).unwrap();
      if (result.status) {
        const rData = result?.data.map(itm => {
          return {
            ...itm,
            label: itm?.account_holder_name,
            value: itm?.id,
          };
        });

        setAllAccount(rData);
      } else {
        Toast.show({
          type: 'error',
          text1: result?.message,
          position: 'bottom',
        });

        setAllAccount([]);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });

      setAllAccount([]);
    }
  };

  /*function for fetching All bank*/
  const fetchAllBank = async () => {
    try {
      const result = await dispatch(getAllBank()).unwrap();

      if (result.status) {
        const rData = result?.data?.map(itm => ({
          label: itm?.bank_name,
          value: itm?.id,
          image: itm?.logo,
        }));

        setAllBank(rData);
      } else {
        setAllBank([]);
      }
    } catch (error) {
      setAllBank([]);
    }
  };

  /*function for fetching Supplier  list data*/
  const fetchSupplierData = async () => {
    try {
      const result = await dispatch(getAllSupplier()).unwrap();
      if (result.status) {
        const rData = result?.data?.map(itm => ({
          label: itm?.supplier_name,
          value: itm?.id,
        }));

        setAllSupplier(rData);
      } else {
        setAllSupplier([]);
      }
    } catch (error) {
      setAllSupplier([]);
    }
  };

  /*function for calculation year difference*/
  const dateChangeFunction = yeardifference => {
    formik.setFieldValue(`date`, yeardifference);
  };
  /*Ui of dropdown list*/
  const renderDropDown = item => {
    return (
      <View
        style={[
          styles.listView,
          { backgroundColor: Colors().inputLightShadow },
        ]}>
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
              { marginLeft: 10, color: Colors().pureBlack },
            ]}>
            {item.label}
          </Text>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.inputContainer]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ columnGap: 5 }}>
        <View style={{ margin: 0 }}>
          <SearchBar
            searchWidth={WINDOW_WIDTH * 0.78}
            setSearchText={formik.handleChange('search')}
          />
        </View>
        <View style={{ marginTop: 8 }}>
          {formik.values.section_type == '1' && (
            <NeumorphicDropDownList
              height={WINDOW_HEIGHT * 0.05}
              width={WINDOW_WIDTH * 0.75}
              title={''}
              data={allBank}
              placeholder={'banks...'}
              value={formik.values.bank_id}
              onChange={val => {
                formik.setFieldValue(`bank_id`, val.value);
                handleBankChange(val.value);
              }}
            />
          )}
        </View>

        {formik.values.section_type == '1' && type == 'trasaction' && (
          <View style={{ marginTop: 8 }}>
            <NeumorphicDropDownList
              height={WINDOW_HEIGHT * 0.05}
              width={WINDOW_WIDTH * 0.75}
              RightIconName="caretdown"
              RightIconType={IconType.AntDesign}
              placeholder={' Accounts...'}
              data={allAccount}
              labelField={'label'}
              valueField={'value'}
              value={formik.values.account_id}
              renderItem={renderDropDown}
              search={false}
              placeholderStyle={[
                styles.inputText,
                {
                  color: Colors().pureBlack,
                },
              ]}
              edTextStyle={[
                styles.edTextStyle,
                {
                  color: Colors().pureBlack,
                },
              ]}
              style={[
                styles.inputText,
                {
                  color: Colors().pureBlack,
                },
              ]}
              containerStyle={{
                backgroundColor: Colors().inputLightShadow,
              }}
              onChange={val => {
                formik.setFieldValue(`account_id`, val);
              }}
            />
          </View>
        )}

        {formik.values.section_type == '2' && (
          <View style={{ marginTop: 8 }}>
            {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={[styles.title, {color: Colors().pureBlack}]}>
                Office{' '}
              </Text>
            </View> */}
            <NeumorphicDropDownList
              height={WINDOW_HEIGHT * 0.05}
              width={WINDOW_WIDTH * 0.75}
              RightIconName="caretdown"
              RightIconType={IconType.AntDesign}
              placeholder={' Office...'}
              data={allOffice}
              labelField={'label'}
              valueField={'value'}
              value={formik.values?.office_id}
              renderItem={renderDropDown}
              search={false}
              disable={formik.values.manager_id}
              placeholderStyle={[
                styles.inputText,
                {
                  color: Colors().pureBlack,
                },
              ]}
              edTextStyle={[
                styles.edTextStyle,
                {
                  color: Colors().pureBlack,
                },
              ]}
              style={[
                styles.inputText,
                {
                  color: Colors().pureBlack,
                },
              ]}
              containerStyle={{
                backgroundColor: Colors().inputLightShadow,
              }}
              onChange={val => {
                formik.setFieldValue(`end_user_id`, val.value);
                formik.setFieldValue(`office_id`, val.value);
                if (
                  formik.values.edData == '' ||
                  formik.values.edData != undefined
                ) {
                  formik.setFieldValue(`edData`, val.label);
                }
              }}
            />
          </View>
        )}
        {formik.values.section_type == '2' && (
          <View style={{ marginTop: 8 }}>
            {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={[styles.title, {color: Colors().pureBlack}]}>
                Manager{' '}
              </Text>
            </View> */}
            <NeumorphicDropDownList
              height={WINDOW_HEIGHT * 0.05}
              width={WINDOW_WIDTH * 0.75}
              RightIconName="caretdown"
              RightIconType={IconType.AntDesign}
              placeholder={' Manager...'}
              data={allManger}
              labelField={'label'}
              valueField={'value'}
              value={formik.values?.manager_id}
              renderItem={renderDropDown}
              search={false}
              disable={formik.values.office_id}
              placeholderStyle={[
                styles.inputText,
                {
                  color: Colors().pureBlack,
                },
              ]}
              edTextStyle={[
                styles.edTextStyle,
                {
                  color: Colors().pureBlack,
                },
              ]}
              style={[
                styles.inputText,
                {
                  color: Colors().pureBlack,
                },
              ]}
              containerStyle={{
                backgroundColor: Colors().inputLightShadow,
              }}
              onChange={val => {
                formik.setFieldValue(`end_user_id`, val.value);
                formik.setFieldValue(`manager_id`, val.value);
                hadleTeamMangerChange(val.value);

                if (
                  formik.values.edData == '' ||
                  formik.values.edData != undefined
                ) {
                  formik.setFieldValue(`edData`, val.label);
                }
              }}
            />
          </View>
        )}

        {formik.values.section_type == '2' && (
          <View style={{ marginTop: 8 }}>
            {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={[styles.title, {color: Colors().pureBlack}]}>
                Supervisor{' '}
              </Text>
            </View> */}
            <NeumorphicDropDownList
              height={WINDOW_HEIGHT * 0.05}
              width={WINDOW_WIDTH * 0.75}
              RightIconName="caretdown"
              RightIconType={IconType.AntDesign}
              placeholder={' Supervisor...'}
              data={allSupervisor}
              labelField={'label'}
              valueField={'value'}
              value={formik.values?.end_user_id}
              renderItem={renderDropDown}
              search={false}
              disable={formik.values.office_id}
              placeholderStyle={[
                styles.inputText,
                {
                  color: Colors().pureBlack,
                },
              ]}
              edTextStyle={[
                styles.edTextStyle,
                {
                  color: Colors().pureBlack,
                },
              ]}
              style={[
                styles.inputText,
                {
                  color: Colors().pureBlack,
                },
              ]}
              containerStyle={{
                backgroundColor: Colors().inputLightShadow,
              }}
              onChange={val => {
                formik.setFieldValue(`end_user_id`, val.value);
                hadleSupervisorChange(val.value);
                if (
                  formik.values.edData == '' ||
                  formik.values.edData != undefined
                ) {
                  formik.setFieldValue(`edData`, val.label);
                }
              }}
            />
          </View>
        )}

        {formik.values.section_type == '2' && (
          <View style={{ marginTop: 8 }}>
            {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={[styles.title, {color: Colors().pureBlack}]}>
                End user{' '}
              </Text>
            </View> */}
            <NeumorphicDropDownList
              height={WINDOW_HEIGHT * 0.05}
              width={WINDOW_WIDTH * 0.75}
              RightIconName="caretdown"
              RightIconType={IconType.AntDesign}
              placeholder={' End user...'}
              data={allEndUser}
              labelField={'label'}
              valueField={'value'}
              value={formik.values?.end_user_id}
              renderItem={renderDropDown}
              search={false}
              disable={formik.values.office_id}
              placeholderStyle={[
                styles.inputText,
                {
                  color: Colors().pureBlack,
                },
              ]}
              edTextStyle={[
                styles.edTextStyle,
                {
                  color: Colors().pureBlack,
                },
              ]}
              style={[
                styles.inputText,
                {
                  color: Colors().pureBlack,
                },
              ]}
              containerStyle={{
                backgroundColor: Colors().inputLightShadow,
              }}
              onChange={val => {
                formik.setFieldValue(`end_user_id`, val.value);
                if (
                  formik.values.edData == '' ||
                  formik.values.edData != undefined
                ) {
                  formik.setFieldValue(`edData`, val.label);
                }
              }}
            />
          </View>
        )}
        {formik.values.section_type == '3' && (
          <View style={{ marginTop: 8 }}>
            {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={[styles.title, {color: Colors().pureBlack}]}>
                SUPPLIER{' '}
              </Text>
            </View> */}
            <NeumorphicDropDownList
              height={WINDOW_HEIGHT * 0.05}
              width={WINDOW_WIDTH * 0.75}
              RightIconName="caretdown"
              RightIconType={IconType.AntDesign}
              placeholder={' supplier...'}
              data={allSupplier}
              labelField={'label'}
              valueField={'value'}
              renderItem={renderDropDown}
              search={false}
              placeholderStyle={[
                styles.inputText,
                {
                  color: Colors().pureBlack,
                },
              ]}
              edTextStyle={[
                styles.edTextStyle,
                {
                  color: Colors().pureBlack,
                },
              ]}
              style={[
                styles.inputText,
                {
                  color: Colors().pureBlack,
                },
              ]}
              containerStyle={{
                backgroundColor: Colors().inputLightShadow,
              }}
              onChange={val => {
                formik.setFieldValue(`supplier_id`, val.value);
              }}
            />
          </View>
        )}
      </ScrollView>

      {dateFilter && type == 'trasaction' && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ columnGap: 10 }}>
          <View style={{ marginTop: 8 }}>
            {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={[styles.title, {color: Colors().pureBlack}]}>
                From{' '}
              </Text>
            </View> */}
            <NeumorphDatePicker
              height={WINDOW_HEIGHT * 0.05}
              width={WINDOW_WIDTH * 0.5}
              iconPress={() => setOpenFromDate(!openFromDate)}
              valueOfDate={moment(formik.values.start_date).format(
                'DD/MM/YYYY',
              )}
              modal
              open={openFromDate}
              date={new Date()}
              mode="date"
              onConfirm={date => {
                formik.setFieldValue(`start_date`, date);
                dateChangeFunction(
                  `${moment(date).format('YYYY')}-${moment(
                    formik.values.end_date,
                  ).format('YYYY')}`,
                );

                setOpenFromDate(false);
              }}
              onCancel={() => {
                setOpenFromDate(false);
              }}></NeumorphDatePicker>
          </View>

          <View style={{ marginTop: 8 }}>
            {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={[styles.title, {color: Colors().pureBlack}]}>
                to{' '}
              </Text>
            </View> */}
            <NeumorphDatePicker
              height={WINDOW_HEIGHT * 0.05}
              width={WINDOW_WIDTH * 0.5}
              iconPress={() => setOpenToDate(!openToDate)}
              valueOfDate={moment(formik.values.end_date).format('DD/MM/YYYY')}
              modal
              open={openToDate}
              date={new Date()}
              mode="date"
              onConfirm={date => {
                formik.setFieldValue(`end_date`, moment(date).format('YYYY'));
                dateChangeFunction(
                  `${moment(formik.values.start_date).format('YYYY')}-${moment(
                    date,
                  ).format('YYYY')}`,
                );

                setOpenToDate(false);
              }}
              onCancel={() => {
                setOpenToDate(false);
              }}></NeumorphDatePicker>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default StockTransactionFilter;

const styles = StyleSheet.create({
  inputContainer: {
    // marginHorizontal: WINDOW_WIDTH * 0.04,
  },

  inputText: {
    fontSize: 14,
    fontWeight: '300',
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },

  edTextStyle: {
    fontSize: 15,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  listView: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 3,
  },
  title: {
    fontSize: 15,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,

    flexShrink: 1,
  },
});
