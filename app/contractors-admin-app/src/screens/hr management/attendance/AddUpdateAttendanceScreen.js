import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import Colors from '../../../constants/Colors';
import CustomeHeader from '../../../component/CustomeHeader';
import IconType from '../../../constants/IconType';
import NeumorphicTextInput from '../../../component/NeumorphicTextInput';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../utils/ScreenLayout';
import ScreensLabel from '../../../constants/ScreensLabel';
import {
  createManuallyAttendanceSchema,
  createManuallySchema,
} from '../../../utils/FormSchema';
import NeumorphicButton from '../../../component/NeumorphicButton';
import NeumorphicDropDownList from '../../../component/DropDownList';
import { getAllUsers } from '../../../redux/slices/commonApi';
import { Avatar } from '@rneui/base';
import {
  addAttendance,
  markAttendance,
} from '../../../redux/slices/hr-management/attendance/addUpdateAttendanceSlice';
import { apiBaseUrl } from '../../../../config';
import { Image } from 'react-native';
import Images from '../../../constants/Images';
import NeuomorphAvatar from '../../../component/NeuomorphAvatar';
import { MultiSelect } from 'react-native-element-dropdown';
import moment from 'moment';
import NeumorphDatePicker from '../../../component/NeumorphDatePicker';
import NeumorphicCheckbox from '../../../component/NeumorphicCheckbox';
import AlertModal from '../../../component/AlertModal';
import Toast from 'react-native-toast-message';
import DropDownItem from '../../../component/DropDownItem';
import MultiSelectComponent from '../../../component/MultiSelectComponent';

const AddUpdateAttendanceScreen = ({ navigation, route }) => {
  /* declare props constant variale*/
  const label = ScreensLabel();
  const user_id = route?.params?.user_id;
  const datePressedInTime = moment(
    route?.params?.datePressed?.timestamp,
  ).format('YYYY-MM-DD 09:00');
  const datePressedOutTime = moment(
    route?.params?.datePressed?.timestamp,
  ).format('YYYY-MM-DD 18:00');

  /*declare hooks variable here */
  const dispatch = useDispatch();

  /*declare useState variable here */

  const [modalVisible, setModalVisible] = useState(false);
  const [confirm, setConfrim] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState([]);

  const [openFromDate, setOpenFromDate] = useState(false);
  const [openToDate, setOpenToDate] = useState(false);

  useEffect(() => {
    fetchUsersData();
  }, []);

  const formik = useFormik({
    enableReinitialize: 'true',
    initialValues: {
      user_ids: '',
      in_time: user_id
        ? datePressedInTime
        : moment().format(`YYYY-MM-DD 09:00`),
      out_time: user_id
        ? datePressedOutTime
        : moment().format(`YYYY-MM-DD 18:00`),
      is_default_time: false,
      note: '',
      attendance_status: '',
    },
    validationSchema: user_id
      ? createManuallyAttendanceSchema
      : createManuallySchema,

    onSubmit: values => {
      handleSubmit(values);
    },
  });

  const AttendanceOptions = [
    { label: 'Absent', value: 1 },
    { label: 'Present', value: 2 },
    { label: 'Half Day', value: 3 },
  ];

  const handleSubmit = async values => {
    const reqBody = {
      user_ids: values?.user_ids,
      in_time: values.is_default_time == true ? '' : values.in_time,
      out_time: values.is_default_time == true ? '' : values.out_time,
      is_default_time: values.is_default_time,
      note: values.note,
      attendance_status: values.attendance_status.value,
    };

    const reqBody2 = {
      user_id: user_id,
      in_time: values.is_default_time == true ? '' : values.in_time,
      out_time: values.is_default_time == true ? '' : values.out_time,
      is_default_time: values.is_default_time,
      note: values.note,
      attendance_status: values.attendance_status.value,
    };

    try {
      if (user_id) {
        setModalVisible(true);
        setConfrim(reqBody2);
      } else {
        setLoading(true);
        const createAttendanceResult = await dispatch(
          addAttendance(reqBody),
        ).unwrap();

        if (createAttendanceResult?.status) {
          setLoading(false);
          Toast.show({
            type: 'success',
            text1Style: createAttendanceResult?.message,
            position: 'bottom',
          });

          navigation.navigate('AttendaceListScreen');
        } else {
          Toast.show({
            type: 'error',
            text1Style: createAttendanceResult?.message,
            position: 'bottom',
          });

          setLoading(false);
        }
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1Style: error,
        position: 'bottom',
      });

      console.error('Error in creating order via:', error);
    }
  };

  const markAttendancefunction = async reqBody => {
    setLoading(true);

    const markResult = await dispatch(markAttendance(reqBody)).unwrap();

    if (markResult?.status) {
      setLoading(false);
      setModalVisible(false);
      Toast.show({
        type: 'success',
        text1Style: markResult?.message,
        position: 'bottom',
      });

      navigation.navigate('AttendaceListScreen');
    } else {
      Toast.show({
        type: 'error',
        text1Style: markResult?.message,
        position: 'bottom',
      });

      setLoading(false);
      setModalVisible(false);
    }
  };

  /*function for fetching User list data*/
  const fetchUsersData = async () => {
    try {
      const result = await dispatch(getAllUsers()).unwrap();
      if (result.status) {
        const rData = result?.data.map(item => {
          return {
            label: item?.name,
            value: item?.id,
            image: item?.image,
          };
        });
        setUserData(rData);
      } else {
        setUserData([]);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1Style: error,
        position: 'bottom',
      });

      setUserData([]);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,

        backgroundColor: Colors().screenBackground,
      }}>
      <CustomeHeader
        headerTitle={user_id ? label.UPDATE_ATTENDANCE : label.ADD_ATTENDANCE}
      />

      <ScrollView>
        <View style={styles.inputContainer}>
          {!user_id && (
            <View style={{ rowGap: 2 }}>
              <MultiSelectComponent
                title={'Select User'}
                required={true}
                placeholder="Select user name ..."
                data={userData || []}
                value={formik?.values?.user_ids}
                inside={true}
                onChange={item => {
                  formik.setFieldValue(`user_ids`, item);
                }}
                errorMessage={formik?.errors?.user_ids}
              />
            </View>
          )}

          <NeumorphicDropDownList
            width={WINDOW_WIDTH * 0.9}
            title={'attendance status'}
            required={true}
            data={AttendanceOptions}
            value={formik.values.attendance_status}
            onChange={val => {
              formik.setFieldValue(`attendance_status`, val);
            }}
            errorMessage={formik?.errors?.attendance_status}
          />

          <View style={styles.checkboxView}>
            <NeumorphicCheckbox
              isChecked={formik.values.is_default_time}
              onChange={value => {
                formik.setFieldValue(`is_default_time`, value);
              }}></NeumorphicCheckbox>
            <Text style={[styles.rememberTxt, { color: Colors().gray2 }]}>
              IS DEFAULT TIME
            </Text>
          </View>

          {!formik.values.is_default_time && (
            <NeumorphDatePicker
              width={WINDOW_WIDTH * 0.9}
              title={'in time'}
              iconPress={() => setOpenFromDate(!openFromDate)}
              valueOfDate={
                formik.values.in_time
                  ? moment(formik.values.in_time).format('DD/MM/YYYY  h:mm A')
                  : formik.values.in_time
              }
              modal
              open={openFromDate}
              date={new Date()}
              mode="datetime"
              onConfirm={date => {
                formik.setFieldValue(`in_time`, date);

                setOpenFromDate(false);
              }}
              onCancel={() => {
                setOpenFromDate(false);
              }}></NeumorphDatePicker>
          )}

          {!formik.values.is_default_time && (
            <NeumorphDatePicker
              width={WINDOW_WIDTH * 0.9}
              title={'out time'}
              iconPress={() => setOpenToDate(!openToDate)}
              valueOfDate={
                formik.values.out_time
                  ? moment(formik.values.out_time).format('DD/MM/YYYY h:mm A')
                  : formik.values.out_time
              }
              modal
              open={openToDate}
              date={new Date()}
              mode="datetime"
              onConfirm={date => {
                formik.setFieldValue(`out_time`, date);

                setOpenToDate(false);
              }}
              onCancel={() => {
                setOpenToDate(false);
              }}></NeumorphDatePicker>
          )}

          <NeumorphicTextInput
            title={'Note'}
            height={WINDOW_HEIGHT * 0.08}
            value={formik.values.note}
            numberOfLines={2}
            multiline={true}
            onChangeText={formik.handleChange('note')}
          />

          {/* modal view for delete*/}
          {modalVisible && (
            <>
              <AlertModal
                visible={modalVisible}
                iconName={'edit'}
                icontype={IconType.FontAwesome}
                iconColor={Colors().red}
                textToShow={'ARE YOU SURE YOU WANT TO Update THIS!!'}
                cancelBtnPress={() => setModalVisible(false)}
                ConfirmBtnPress={() => markAttendancefunction(confirm)}
              />
            </>
          )}

          <View style={{ alignSelf: 'center', marginVertical: 10 }}>
            <NeumorphicButton
              title={user_id ? label.UPDATE : label.ADD}
              titleColor={Colors().purple}
              onPress={formik.handleSubmit}
              loading={loading}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddUpdateAttendanceScreen;

const styles = StyleSheet.create({
  inputContainer: {
    // backgroundColor: 'green',
    flex: 1,
    marginHorizontal: WINDOW_WIDTH * 0.04,
    marginTop: WINDOW_HEIGHT * 0.02,
    rowGap: 10,
  },
  inputText: {
    fontSize: 15,
    fontWeight: '300',
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
  checkboxView: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  title: {
    fontSize: 12,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  listView: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: 'red',
    margin: 3,
  },
  dropdown: {
    marginLeft: 10,
    flex: 1,
  },
  placeholderStyle: {
    fontSize: 16,
    marginLeft: 10,
    paddingVertical: 10,
  },
  selectedTextStyle: {
    fontSize: 14,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  iconStyle: {
    width: 30,
    height: 30,
    marginRight: 5,
  },

  selectedStyle: {
    borderRadius: 12,
  },

  rememberTxt: {
    marginLeft: '2%',

    fontSize: 17,
    fontWeight: '600',
    fontFamily: Colors().fontFamilyBookMan,
  },
});
