/*    ----------------Created Date :: 8- Feb -2024    ----------------- */
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
import AlertModal from '../../../component/AlertModal';
import {addRetirementSchema} from '../../../utils/FormSchema';
import {useIsFocused} from '@react-navigation/native';
import NeumorphDatePicker from '../../../component/NeumorphDatePicker';
import moment from 'moment';
import {Switch} from 'react-native';
import NeumorphCard from '../../../component/NeumorphCard';
import {
  createRetirement,
  updateRetirement,
} from '../../../redux/slices/hr-management/retirement/addUpdateRetirementSlice';
import {getRetirementDetailById} from '../../../redux/slices/hr-management/retirement/getRetirementDetailSlice';

const AddUpdateRetirementScreen = ({navigation, route}) => {
  // const edit = route?.params?.editData;
  const edit_id = route?.params?.retirement_id;
  const isFocused = useIsFocused();
  const [allUser, setAllUser] = useState([]);
  const [edit, setEdit] = useState([]);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [confirm, setConfrim] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openDate, setOpenDate] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    fetchAllUser();

    if (edit_id) {
      fetchSingleData();
    }
  }, []);

  const pensionOption = [
    {value: '1', label: 'active'},
    {value: '0', label: 'inactive'},
  ];

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      user_id: edit?.user_id || '',
      retirement_date: edit?.retirement_date
        ? moment(edit?.retirement_date).format('YYYY-MM-DD')
        : '',
      asset_recovery: edit?.asset_recovery || '',
      pension_amount: edit?.pension_amount || '',
      pension_duration: edit?.pension_duration || '',
      allow_commutation: Boolean(edit?.allow_commutation) || false,
      commute_percentage: edit?.commute_percentage || '',
      retirement_gratuity: edit?.retirement_gratuity || '',
      service_gratuity: edit?.service_gratuity || '',
      pension_status: edit?.pension_status || '1',
    },
    validationSchema: addRetirementSchema,
    onSubmit: (values, {resetForm}) => {
      handleSubmit(values, resetForm);
    },
  });

  const handleSubmit = async (values, resetForm) => {
    const sData = {
      user_id: values.user_id,
      retirement_date: moment(values.retirement_date).format('YYYY-MM-DD'),
      asset_recovery: values.asset_recovery,
      pension_amount: values.pension_amount,
      pension_duration: values.pension_duration,
      allow_commutation: values.allow_commutation,
      commute_percentage: values.commute_percentage,
      retirement_gratuity: values.retirement_gratuity,
      service_gratuity: values.service_gratuity,
      pension_status: values.pension_status,
    };

    if (edit?.id) {
      sData['id'] = edit.id;
    }
    try {
      if (edit_id) {
        setUpdateModalVisible(true);
        setConfrim(sData);
      } else {
        setLoading(true);
        const addResult = await dispatch(createRetirement(sData)).unwrap();

        if (addResult?.status) {
          setLoading(false);
          ToastAndroid.show(addResult?.message, ToastAndroid.LONG);
          navigation.navigate('RetirementListScreen');
          resetForm();
        } else {
          ToastAndroid.show(addResult?.message, ToastAndroid.LONG);
          setLoading(false);
        }
        // resetForm();
      }
    } catch (error) {}
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

  /*function for fetching single detail of promotion and demotion*/
  const fetchSingleData = async () => {
    try {
      const result = await dispatch(getRetirementDetailById(edit_id)).unwrap();

      if (result.status) {
        setEdit(result?.data);
      } else {
        ToastAndroid.show(result?.message, ToastAndroid.LONG);
        setEdit([]);
      }
    } catch (error) {
      ToastAndroid.show(error, ToastAndroid.LONG);
      setEdit([]);
    }
  };

  /*function for updating of Loan*/
  const updatefunction = async reqBody => {
    setLoading(true);

    const updateResult = await dispatch(updateRetirement(reqBody)).unwrap();

    if (updateResult?.status) {
      setLoading(false);
      setUpdateModalVisible(false);
      ToastAndroid.show(updateResult?.message, ToastAndroid.LONG);
      navigation.navigate('RetirementListScreen');
    } else {
      ToastAndroid.show(updateResult?.message, ToastAndroid.LONG);
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
        headerTitle={edit_id ? 'update Retirement' : 'Add Retirement'}
      />
      <ScrollView>
        <View style={styles.inpuntContainer}>
          <View style={{rowGap: 8}}>
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

          <View style={{rowGap: 8}}>
            <Text style={styles.title}>RETIREMENT DATE</Text>
            <NeumorphDatePicker
              width={WINDOW_WIDTH * 0.9}
              iconPress={() => setOpenDate(!openDate)}
              valueOfDate={
                formik?.values?.retirement_date
                  ? moment(formik?.values?.retirement_date).format(
                      'DD/MM/YYYY dddd',
                    )
                  : formik?.values?.retirement_date
              }
              modal
              open={openDate}
              date={new Date()}
              mode="date"
              onConfirm={date => {
                formik.setFieldValue(`retirement_date`, date);

                setOpenDate(false);
              }}
              onCancel={() => {
                setOpenDate(false);
              }}></NeumorphDatePicker>
          </View>
          {formik?.touched?.retirement_date &&
            formik?.errors?.retirement_date && (
              <Text style={styles.errorMesage}>
                {formik?.errors?.retirement_date}
              </Text>
            )}

          <View style={{rowGap: 8}}>
            <Text style={styles.title}>assest recovery</Text>
            <NeumorphicTextInput
              width={WINDOW_WIDTH * 0.9}
              placeholder={'TYPE...'}
              style={styles.inputText}
              value={formik?.values?.asset_recovery}
              // keyboardType="number-pad"
              multiline
              onChangeText={formik.handleChange(`asset_recovery`)}
            />
          </View>
          {formik?.touched?.asset_recovery &&
            formik?.errors?.asset_recovery && (
              <Text style={styles.errorMesage}>
                {formik?.errors?.asset_recovery}
              </Text>
            )}

          <View style={{rowGap: 8}}>
            <Text style={styles.title}>PENsION AMOUNT </Text>
            <NeumorphicTextInput
              width={WINDOW_WIDTH * 0.9}
              placeholder={'TYPE...'}
              style={styles.inputText}
              value={formik?.values?.pension_amount.toString()}
              // keyboardType="numeric"
              onChangeText={formik.handleChange(`pension_amount`)}
            />
          </View>
          {formik?.touched?.pension_amount &&
            formik?.errors?.pension_amount && (
              <Text style={styles.errorMesage}>
                {formik?.errors?.pension_amount}
              </Text>
            )}

          <View style={{rowGap: 8}}>
            <Text style={styles.title}>PENsION DURATION</Text>
            <NeumorphicTextInput
              width={WINDOW_WIDTH * 0.9}
              placeholder={'TYPE...'}
              style={styles.inputText}
              value={formik?.values?.pension_duration}
              // keyboardType="numeric"
              onChangeText={formik.handleChange(`pension_duration`)}
            />
          </View>
          {formik?.touched?.pension_duration &&
            formik?.errors?.pension_duration && (
              <Text style={styles.errorMesage}>
                {formik?.errors?.pension_duration}
              </Text>
            )}

          <View style={{rowGap: 8}}>
            <Text style={styles.title}>COMMUTATION PERCENTAGE (OPTIONAL)</Text>
            <NeumorphicTextInput
              width={WINDOW_WIDTH * 0.9}
              placeholder={'TYPE...'}
              style={styles.inputText}
              value={formik?.values?.commute_percentage}
              // keyboardType="numeric"
              onChangeText={formik.handleChange(`commute_percentage`)}
            />
          </View>
          {formik?.touched?.commute_percentage &&
            formik?.errors?.commute_percentage && (
              <Text style={styles.errorMesage}>
                {formik?.errors?.commute_percentage}
              </Text>
            )}

          <View style={{rowGap: 8}}>
            <Text style={styles.title}>RETIREMENT GRATUITY (OPTIONAL)</Text>
            <NeumorphicTextInput
              width={WINDOW_WIDTH * 0.9}
              placeholder={'TYPE...'}
              style={styles.inputText}
              value={formik?.values?.retirement_gratuity}
              // keyboardType="numeric"
              onChangeText={formik.handleChange(`retirement_gratuity`)}
            />
          </View>
          {formik?.touched?.retirement_gratuity &&
            formik?.errors?.retirement_gratuity && (
              <Text style={styles.errorMesage}>
                {formik?.errors?.retirement_gratuity}
              </Text>
            )}

          <View style={{rowGap: 8}}>
            <Text style={styles.title}>SERVICE GRATUITY (OPTIONAL)</Text>
            <NeumorphicTextInput
              width={WINDOW_WIDTH * 0.9}
              placeholder={'TYPE...'}
              style={styles.inputText}
              value={formik?.values?.service_gratuity}
              // keyboardType="numeric"
              onChangeText={formik.handleChange(`service_gratuity`)}
            />
          </View>
          {formik?.touched?.service_gratuity &&
            formik?.errors?.service_gratuity && (
              <Text style={styles.errorMesage}>
                {formik?.errors?.service_gratuity}
              </Text>
            )}

          <View style={{rowGap: 8}}>
            <Text style={styles.title}>pension status</Text>
            <NeumorphicDropDownList
              placeholder={'SELECT ...'}
              data={pensionOption}
              labelField={'label'}
              valueField={'value'}
              value={formik?.values?.pension_status}
              renderItem={renderDropDown}
              onChange={val => {
                formik.setFieldValue(`pension_status`, val.value);
              }}
            />
          </View>
          {formik?.touched?.pension_status &&
            formik?.errors?.pension_status && (
              <Text style={styles.errorMesage}>
                {formik?.errors?.pension_status}
              </Text>
            )}

          <View style={{rowGap: 8}}>
            <Text style={styles.title}>ALLOW COMMUTATION</Text>
            <View style={{flexDirection: 'row', columnGap: 10}}>
              <Text style={[styles.title, {alignSelf: 'center'}]}>No</Text>
              <NeumorphCard>
                <View style={{padding: 5}}>
                  <Switch
                    trackColor={{false: '#767577', true: '#81b0ff'}}
                    thumbColor={
                      formik?.values?.allow_commutation ? '#f5dd4b' : '#f4f3f4'
                    }
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={itm => {
                      formik.setFieldValue(`allow_commutation`, itm);
                    }}
                    value={formik?.values?.allow_commutation}
                  />
                </View>
              </NeumorphCard>
              <Text style={[styles.title, {alignSelf: 'center'}]}>yes</Text>
            </View>
          </View>
          {formik?.touched?.allow_commutation &&
            formik?.errors?.allow_commutation && (
              <Text style={styles.errorMesage}>
                {formik?.errors?.allow_commutation}
              </Text>
            )}

          <View style={{alignSelf: 'center', marginVertical: 10}}>
            <NeumorphicButton
              title={edit_id ? 'update' : 'ADD'}
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
              ConfirmBtnPress={() => updatefunction(confirm)}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddUpdateRetirementScreen;

const styles = StyleSheet.create({
  inpuntContainer: {
    rowGap: 10,
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
    fontSize: 16,
    marginLeft: 10,
    paddingVertical: 10,
  },
  selectedTextStyle: {
    fontSize: 14,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  btnView: {
    alignSelf: 'center',
    marginTop: WINDOW_HEIGHT * 0.01,
    // marginBottom: WINDOW_HEIGHT * 0.01,
  },
  Image: {
    height: 40,
    width: WINDOW_WIDTH * 0.9,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: Colors().gray,
  },
});
