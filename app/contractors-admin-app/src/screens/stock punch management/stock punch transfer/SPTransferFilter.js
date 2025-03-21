import { ScrollView, StyleSheet, Text, View, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import NeumorphicDropDownList from '../../../component/DropDownList';
import {
  getAllManger,
  getAllSupervisorByMangaerId,
  getAllUsers,
} from '../../../redux/slices/commonApi';
import { useDispatch, useSelector } from 'react-redux';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../utils/ScreenLayout';
import IconType from '../../../constants/IconType';
import Colors from '../../../constants/Colors';
import NeuomorphAvatar from '../../../component/NeuomorphAvatar';
import { Avatar } from '@rneui/themed';
import { apiBaseUrl } from '../../../../config';
import Images from '../../../constants/Images';
import { getAllFreeUserList } from '../../../redux/slices/allocate/allocateComplaintSlice';
import Toast from 'react-native-toast-message';

const SPTransferFilter = ({ formik, type, edit_id, edit }) => {
  const dispatch = useDispatch();
  const [allOffice, setAllOffice] = useState([]);
  const [allManger, setAllManager] = useState([]);
  const [allSupervisor, setAllSupervisor] = useState([]);
  const [allEndUser, setAllEndUser] = useState([]);
  const [officeId, setOfficeId] = useState('');
  const [managerId, setManagerId] = useState('');
  const [supervisorId, setSupervisorId] = useState('');
  const [endUserId, setEndUserId] = useState('');

  useEffect(() => {
    fetchMangerData();
    fetchUserData();
    setOfficeId('');
    setManagerId('');
    setSupervisorId('');
    setEndUserId('');
  }, [formik.values.stock_transfer_for]);

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
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        columnGap: 10,
        marginHorizontal: WINDOW_WIDTH * 0.04,
      }}>
      <View style={{ rowGap: 2 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={[styles.title, { color: Colors().pureBlack }]}>
            Office{' '}
          </Text>
        </View>
        <NeumorphicDropDownList
          height={WINDOW_HEIGHT * 0.06}
          width={WINDOW_WIDTH * 0.75}
          RightIconName="caretdown"
          RightIconType={IconType.AntDesign}
          placeholder={'select...'}
          data={allOffice}
          labelField={'label'}
          valueField={'value'}
          value={officeId}
          renderItem={renderDropDown}
          search={false}
          disable={managerId}
          placeholderStyle={[styles.inputText, { color: Colors().pureBlack }]}
          selectedTextStyle={[
            styles.selectedTextStyle,
            { color: Colors().pureBlack },
          ]}
          style={[styles.inputText, { color: Colors().pureBlack }]}
          containerStyle={{
            backgroundColor: Colors().inputLightShadow,
          }}
          onChange={val => {
            setOfficeId(val?.value);
            {
              type == 'from'
                ? formik.setFieldValue(`transfered_by`, val.value)
                : formik.setFieldValue(`transfered_to`, val.value);
            }
          }}
        />
      </View>

      <View style={{ rowGap: 2 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={[styles.title, { color: Colors().pureBlack }]}>
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
          value={managerId}
          renderItem={renderDropDown}
          search={false}
          disable={officeId}
          placeholderStyle={[styles.inputText, { color: Colors().pureBlack }]}
          selectedTextStyle={[
            styles.selectedTextStyle,
            { color: Colors().pureBlack },
          ]}
          style={[styles.inputText, { color: Colors().pureBlack }]}
          containerStyle={{
            backgroundColor: Colors().inputLightShadow,
          }}
          onChange={val => {
            setManagerId(val.value);
            {
              type == 'from'
                ? formik.setFieldValue(`transfered_by`, val.value)
                : formik.setFieldValue(`transfered_to`, val.value);
            }
            hadleTeamMangerChange(val.value);
          }}
        />
      </View>

      <View style={{ rowGap: 2 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={[styles.title, { color: Colors().pureBlack }]}>
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
          value={supervisorId}
          renderItem={renderDropDown}
          search={false}
          disable={officeId}
          placeholderStyle={[styles.inputText, { color: Colors().pureBlack }]}
          selectedTextStyle={[
            styles.selectedTextStyle,
            { color: Colors().pureBlack },
          ]}
          style={[styles.inputText, { color: Colors().pureBlack }]}
          containerStyle={{
            backgroundColor: Colors().inputLightShadow,
          }}
          onChange={val => {
            setSupervisorId(val?.value);
            {
              type == 'from'
                ? formik.setFieldValue(`transfered_by`, val.value)
                : formik.setFieldValue(`transfered_to`, val.value);
            }
            hadleSupervisorChange(val.value);
          }}
        />
      </View>

      <View style={{ rowGap: 2 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={[styles.title, { color: Colors().pureBlack }]}>
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
          value={endUserId}
          renderItem={renderDropDown}
          search={false}
          disable={officeId}
          placeholderStyle={[styles.inputText, { color: Colors().pureBlack }]}
          selectedTextStyle={[
            styles.selectedTextStyle,
            { color: Colors().pureBlack },
          ]}
          style={[styles.inputText, { color: Colors().pureBlack }]}
          containerStyle={{
            backgroundColor: Colors().inputLightShadow,
          }}
          onChange={val => {
            setEndUserId(val?.value);
            {
              type == 'from'
                ? formik.setFieldValue(`transfered_by`, val.value)
                : formik.setFieldValue(`transfered_to`, val.value);
            }
          }}
        />
      </View>
    </ScrollView>
  );
};

export default SPTransferFilter;

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    marginHorizontal: WINDOW_WIDTH * 0.04,
    rowGap: 10,
  },
  inputText: {
    fontSize: 13,
    fontWeight: '300',
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  separatorHeading: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flex: 1,
  },

  listView: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 3,
  },
  actionIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  selectedTextStyle: {
    fontSize: 15,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  rightView: {
    flexDirection: 'column',
    flex: 1,
    rowGap: 8,
  },
  leftView: {
    flexDirection: 'column',
    rowGap: 8,
    flex: 1,
  },
  twoItemView: {
    flexDirection: 'row',
    columnGap: 5,
  },

  errorMesage: {
    color: 'red',
    fontSize: 12,
    alignSelf: 'flex-start',
    marginLeft: 12,
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
