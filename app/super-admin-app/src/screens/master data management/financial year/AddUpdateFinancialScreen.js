import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import CustomeHeader from '../../../component/CustomeHeader';
import IconType from '../../../constants/IconType';
import Colors from '../../../constants/Colors';
import AlertModal from '../../../component/AlertModal';
import NeumorphicButton from '../../../component/NeumorphicButton';
import {useFormik} from 'formik';
import {addFinancialYearSchema} from '../../../utils/FormSchema';
import Toast from 'react-native-toast-message';
import NeumorphDatePicker from '../../../component/NeumorphDatePicker';
import moment from 'moment';
import {
  addFiannceYear,
  updateFiannceYear,
} from '../../../redux/slices/master-data-management/financial-year/AddUpdateFinancialSlice';
import NeumorphCard from '../../../component/NeumorphCard';
import {getFinancialYearDetailById} from '../../../redux/slices/master-data-management/financial-year/getFinancialDetailSlice';

const AddUpdateFinancialScreen = ({route, navigation}) => {
  const width = Dimensions?.get('screen')?.width;
  const height = Dimensions?.get('screen')?.height;
  const edit_id = route?.params?.edit_id;
  const [edit, setEdit] = useState([]);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [openFromDate, setOpenFromDate] = useState(false);
  const [openToDate, setOpenToDate] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (edit_id) {
      fetchSingleData();
    }
  }, [edit_id]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      start_date: edit?.start_date || '',
      end_date: edit?.end_date || '',
    },
    validationSchema: addFinancialYearSchema,
    onSubmit: (values, {resetForm}) => {
      handleSubmit(values, resetForm);
    },
  });

  const handleSubmit = async (values, resetForm) => {
    const reqBody = {
      start_date: moment(values.start_date).format('YYYY-MM-DD'),
      end_date: moment(values.end_date).format('YYYY-MM-DD'),
    };

    try {
      setLoading(true);
      const res = edit_id
        ? await dispatch(
            updateFiannceYear({reqBody: reqBody, id: edit_id}),
          ).unwrap()
        : await dispatch(addFiannceYear(reqBody)).unwrap();

      if (res.status) {
        setLoading(false);
        navigation.navigate('FinancialYearListScreen');
        Toast.show({
          type: 'success',
          text1: res?.message,
          position: 'bottom',
        });
        resetForm();
      } else {
        setLoading(false);
        Toast.show({
          type: 'error',
          text1: res?.message,
          position: 'bottom',
        });
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const fetchSingleData = async () => {
    const res = await dispatch(getFinancialYearDetailById(edit_id)).unwrap();
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit({});
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors().screenBackground,
      }}>
      <CustomeHeader headerTitle={edit_id ? 'update' : 'add'} />
      <ScrollView>
        <View
          style={[
            styles.inpuntContainer,
            {width: Dimensions?.get('screen')?.width * 0.9},
          ]}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.title}>Start date *</Text>
          </View>
          <NeumorphDatePicker
            height={height * 0.055}
            width={width * 0.9}
            iconPress={() => setOpenFromDate(!openFromDate)}
            valueOfDate={
              formik?.values?.start_date
                ? moment(formik?.values?.start_date).format('DD/MM/YYYY')
                : ''
            }
            modal
            open={openFromDate}
            date={new Date()}
            mode="date"
            onConfirm={date => {
              formik.setFieldValue(`start_date`, date);

              setOpenFromDate(false);
            }}
            onCancel={() => {
              setOpenFromDate(false);
            }}></NeumorphDatePicker>

          {formik?.touched?.start_date && formik?.errors?.start_date && (
            <Text style={styles.errorMesage}>{formik?.errors?.start_date}</Text>
          )}

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.title}>End date *</Text>
          </View>

          <NeumorphDatePicker
            height={height * 0.055}
            width={width * 0.9}
            iconPress={() => setOpenToDate(!openToDate)}
            valueOfDate={
              formik?.values?.end_date
                ? moment(formik?.values?.end_date).format('DD/MM/YYYY')
                : ''
            }
            modal
            open={openToDate}
            date={new Date()}
            mode="date"
            onConfirm={date => {
              formik.setFieldValue(`end_date`, date);

              setOpenToDate(false);
            }}
            onCancel={() => {
              setOpenToDate(false);
            }}></NeumorphDatePicker>

          {formik?.touched?.end_date && formik?.errors?.end_date && (
            <Text style={styles.errorMesage}>{formik?.errors?.end_date}</Text>
          )}

          {edit_id && (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.cardHeadingTxt}>Finacial year : </Text>
              <NeumorphCard>
                <View style={{padding: 5}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={[styles.cardtext, {color: Colors().purple}]}>
                    {edit?.year_name}
                  </Text>
                </View>
              </NeumorphCard>
            </View>
          )}
          <NeumorphCard />
        </View>

        <View style={{alignSelf: 'center', marginVertical: 10}}>
          <NeumorphicButton
            title={edit_id ? 'update' : 'ADD'}
            titleColor={Colors().purple}
            onPress={() => {
              edit_id ? setUpdateModalVisible(true) : formik.handleSubmit();
            }}
            loading={loading}
          />
        </View>

        {updateModalVisible && (
          <AlertModal
            visible={updateModalVisible}
            iconName={'clock-edit-outline'}
            icontype={IconType.MaterialCommunityIcons}
            iconColor={Colors().aprroved}
            textToShow={'ARE YOU SURE YOU WANT TO UPDATE THIS!!'}
            cancelBtnPress={() => setUpdateModalVisible(!updateModalVisible)}
            ConfirmBtnPress={() => formik.handleSubmit()}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddUpdateFinancialScreen;

const styles = StyleSheet.create({
  inpuntContainer: {
    rowGap: 6,
    margin: 15,
  },
  cardHeadingTxt: {
    color: Colors().pureBlack,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 21,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  errorMesage: {
    color: 'red',
    marginTop: 5,
    alignSelf: 'flex-start',
    marginLeft: 15,
    fontFamily: Colors().fontFamilyBookMan,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 12,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    color: Colors().pureBlack,
  },
});
