/*    ----------------Created Date :: 5- Feb -2024    ----------------- */
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import IconType from '../../../constants/IconType';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import Colors from '../../../constants/Colors';
import NeumorphicDropDownList from '../../../component/DropDownList';
import NeumorphicTextInput from '../../../component/NeumorphicTextInput';
import {useFormik} from 'formik';
import NeumorphicButton from '../../../component/NeumorphicButton';
import {useDispatch} from 'react-redux';
import {getAllUsers} from '../../../redux/slices/commonApi';
import CustomeHeader from '../../../component/CustomeHeader';
import {addResignationSchema} from '../../../utils/FormSchema';
import AlertModal from '../../../component/AlertModal';
import NeumorphDatePicker from '../../../component/NeumorphDatePicker';
import moment from 'moment';
import {
  createResignation,
  updateResignation,
} from '../../../redux/slices/hr-management/resignation/addUpdateResignationSlice';

const AddUpdateResignationScreen = ({navigation, route}) => {
  const edit = route?.params?.editData;

  const [allUser, setAllUser] = useState([]);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [confirm, setConfrim] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openFromDate, setOpenFromDate] = useState(false);
  const [openToDate, setOpenToDate] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    fetchAllUser();
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      user_id: edit?.user_id || '',
      resignation_date: edit?.resignation_date || '',
      last_working_day: edit?.last_working_day || '',
      reason: edit?.reason || '',
    },
    validationSchema: addResignationSchema,
    onSubmit: (values, {resetForm}) => {
      handleSubmit(values, resetForm);
    },
  });

  const handleSubmit = async (values, resetForm) => {
    const sData = {
      user_id: values.user_id,
      last_working_day: moment(values.last_working_day).format('YYYY-MM-DD'),
      resignation_date: moment(values.resignation_date).format('YYYY-MM-DD'),
      reason: values.reason,
    };

    if (edit?.id) {
      sData['id'] = edit.id;
    }

    try {
      if (edit) {
        setUpdateModalVisible(true);
        setConfrim(sData);
      } else {
        setLoading(true);
        const createResignationResult = await dispatch(
          createResignation(sData),
        ).unwrap();

        if (createResignationResult?.status) {
          setLoading(false);
          ToastAndroid.show(
            createResignationResult?.message,
            ToastAndroid.LONG,
          );
          navigation.navigate('ResignationListScreen');
          resetForm();
        } else {
          ToastAndroid.show(
            createResignationResult?.message,
            ToastAndroid.LONG,
          );
          setLoading(false);
        }
        // resetForm();
      }
    } catch (error) {
      console.error('Error in creating resignation:', error);
    }
  };

  /*function for fetching all user data*/
  const fetchAllUser = async () => {
    try {
      const result = await dispatch(getAllUsers()).unwrap();

      if (result.status) {
        const rData = result?.data?.map(itm => ({
          label: itm?.name,
          value: itm?.id,
        }));
        setAllUser(rData);
      } else {
        ToastAndroid.show(result?.message, ToastAndroid.LONG);
        setAllUser([]);
      }
    } catch (error) {
      ToastAndroid.show(error, ToastAndroid.LONG);
      setAllUser([]);
    }
  };

  /*function for updating of Loan*/
  const updateResignationfunction = async reqBody => {
    setLoading(true);

    const updateResignationResult = await dispatch(
      updateResignation(reqBody),
    ).unwrap();

    if (updateResignationResult?.status) {
      setLoading(false);
      setUpdateModalVisible(false);
      ToastAndroid.show(updateResignationResult?.message, ToastAndroid.LONG);
      navigation.navigate('ResignationListScreen');
    } else {
      ToastAndroid.show(updateResignationResult?.message, ToastAndroid.LONG);
      setLoading(false);
      setUpdateModalVisible(false);
    }
  };

  /*Ui of dropdown list*/
  const renderDropDown = item => {
    return (
      <View style={styles.listView}>
        {item?.label && (
          <Text numberOfLines={1} style={[styles.inputText, {marginLeft: 10}]}>
            {item.label}
          </Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors().screenBackground,
      }}>
      <CustomeHeader
        headerTitle={edit ? 'update Resignation' : 'Add Resignation'}
      />
      <ScrollView>
        <View style={styles.inpuntContainer}>
          <View style={{rowGap: 2}}>
            <Text style={styles.title}>User name</Text>
            <NeumorphicDropDownList
              placeholder={'SELECT ...'}
              data={allUser}
              labelField={'label'}
              valueField={'value'}
              value={formik?.values?.user_id}
              renderItem={renderDropDown}
              onChange={val => {
                formik.setFieldValue(`user_id`, val.value);
              }}
            />
          </View>
          {formik?.touched?.user_id && formik?.errors?.user_id && (
            <Text style={styles.errorMesage}>{formik?.errors?.user_id}</Text>
          )}

          <View style={{rowGap: 2}}>
            <Text style={styles.title}>Resignation date</Text>
            <NeumorphDatePicker
              iconPress={() => setOpenFromDate(!openFromDate)}
              valueOfDate={
                formik?.values?.resignation_date
                  ? moment(formik?.values?.resignation_date).format(
                      'DD/MM/YYYY dddd',
                    )
                  : formik?.values?.resignation_date
              }
              modal
              open={openFromDate}
              date={new Date()}
              mode="date"
              onConfirm={date => {
                formik.setFieldValue(`resignation_date`, date);

                setOpenFromDate(false);
              }}
              onCancel={() => {
                setOpenFromDate(false);
              }}></NeumorphDatePicker>
          </View>
          {formik?.touched?.resignation_date &&
            formik?.errors?.resignation_date && (
              <Text style={styles.errorMesage}>
                {formik?.errors?.resignation_date}
              </Text>
            )}

          <View style={{rowGap: 2}}>
            <Text style={styles.title}>Last working day</Text>
            <NeumorphDatePicker
              iconPress={() => setOpenToDate(!openToDate)}
              valueOfDate={
                formik?.values?.last_working_day
                  ? moment(formik?.values?.last_working_day).format(
                      'DD/MM/YYYY dddd',
                    )
                  : formik?.values?.last_working_day
              }
              modal
              open={openToDate}
              date={new Date()}
              mode="date"
              onConfirm={date => {
                formik.setFieldValue(`last_working_day`, date);

                setOpenToDate(false);
              }}
              onCancel={() => {
                setOpenToDate(false);
              }}></NeumorphDatePicker>
          </View>
          {formik?.touched?.last_working_day &&
            formik?.errors?.last_working_day && (
              <Text style={styles.errorMesage}>
                {formik?.errors?.last_working_day}
              </Text>
            )}

          <View style={{rowGap: 2}}>
            <Text style={styles.title}>Reason</Text>
            <NeumorphicTextInput
              height={WINDOW_HEIGHT * 0.08}
              placeholder={'TYPE...'}
              style={styles.inputText}
              value={formik?.values?.reason}
              multiline={true}
              onChangeText={formik.handleChange(`reason`)}
            />
          </View>
          {formik?.touched?.reason && formik?.errors?.reason && (
            <Text style={styles.errorMesage}>{formik?.errors?.reason}</Text>
          )}

          <View style={{alignSelf: 'center', marginVertical: 10}}>
            <NeumorphicButton
              title={edit ? 'update' : 'ADD'}
              titleColor={Colors().purple}
              onPress={formik.handleSubmit}
              loading={loading}
            />
          </View>
          {/*view for modal of upate */}
          {updateModalVisible && (
            <AlertModal
              visible={updateModalVisible}
              iconName={'clock-edit-outline'}
              icontype={IconType.MaterialCommunityIcons}
              iconColor={Colors().aprroved}
              textToShow={'ARE YOU SURE YOU WANT TO UPDATE THIS!!'}
              cancelBtnPress={() => setUpdateModalVisible(!updateModalVisible)}
              ConfirmBtnPress={() => updateResignationfunction(confirm)}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddUpdateResignationScreen;

const styles = StyleSheet.create({
  inpuntContainer: {
    rowGap: 10,
    // backgroundColor: 'red',
    margin: WINDOW_WIDTH * 0.05,
  },

  errorMesage: {
    color: Colors().red,
    alignSelf: 'flex-start',
    marginLeft: 15,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  listView: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 8,
  },
  title: {
    fontSize: 12,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    color: Colors().pureBlack,
  },

  inputText: {
    color: Colors().pureBlack,
    fontSize: 12,
    fontWeight: '300',
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  dropdown: {
    marginLeft: 10,
  },
  placeholderStyle: {
    fontSize: 12,
    marginLeft: 10,
    paddingVertical: 10,
  },
  selectedTextStyle: {
    fontSize: 14,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
});
