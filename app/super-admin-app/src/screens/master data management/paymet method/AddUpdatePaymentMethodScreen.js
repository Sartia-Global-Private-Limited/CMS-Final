/*    ----------------Created Date :: 6- March -2024   ----------------- */
import {StyleSheet, Text, View, SafeAreaView, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {useFormik} from 'formik';
import Colors from '../../../constants/Colors';
import CustomeHeader from '../../../component/CustomeHeader';
import IconType from '../../../constants/IconType';
import NeumorphicTextInput from '../../../component/NeumorphicTextInput';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import {addPayMethodSchema} from '../../../utils/FormSchema';
import NeumorphicButton from '../../../component/NeumorphicButton';
import NeumorphicDropDownList from '../../../component/DropDownList';
import Toast from 'react-native-toast-message';
import AlertModal from '../../../component/AlertModal';
import {
  addPayMethod,
  updatePayMethod,
} from '../../../redux/slices/master-data-management/payment-method/addUpdatePayMethodSlice';
import {getPayMethodDetailById} from '../../../redux/slices/master-data-management/payment-method/getPayMethodDetailSlice';

const AddUpdatePaymentMethodScreen = ({navigation, route}) => {
  /* declare props constant variale*/

  const edit_id = route?.params?.edit_id;

  /*declare hooks variable here */
  const dispatch = useDispatch();

  /*declare useState variable here */

  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState({});

  useEffect(() => {
    if (edit_id) {
      fetchSingleDetails();
    }
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      method: edit?.method || '',
      status: edit?.status || '1',
    },
    validationSchema: addPayMethodSchema,

    onSubmit: (values, {resetForm}) => {
      handleSubmit(values, resetForm);
    },
  });

  const GST_TREATMENT_TYPE = [
    {
      label: 'ACTIVE',
      value: '1',
    },
    {
      label: 'INACTIVE',
      value: '0',
    },
  ];

  const handleSubmit = async (values, resetForm) => {
    const reqBody = {
      method: values.method,
      status: values.status,
    };

    if (edit_id) {
      reqBody['id'] = edit_id;
    }

    try {
      setLoading(true);
      const res = edit_id
        ? await dispatch(updatePayMethod(reqBody)).unwrap()
        : await dispatch(addPayMethod(reqBody)).unwrap();

      if (res?.status) {
        Toast.show({
          type: 'success',
          text1: res?.message,
          position: 'bottom',
        });
        setLoading(false);
        resetForm();
        navigation.navigate('PaymentMethodListScreen');
      } else {
        Toast.show({
          type: 'error',
          text1: res?.message,
          position: 'bottom',
        });
        setLoading(false);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });
      setLoading(false);
    }
  };

  const fetchSingleDetails = async () => {
    const fetchResult = await dispatch(
      getPayMethodDetailById(edit_id),
    ).unwrap();
    if (fetchResult?.status) {
      setEdit(fetchResult.data);
    } else {
      setEdit([]);
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
        // height: WINDOW_HEIGHT,
        backgroundColor: Colors().screenBackground,
      }}>
      <CustomeHeader
        headerTitle={edit_id ? 'Update Pay Method' : 'Add Pay Method'}
      />

      <ScrollView>
        <View style={styles.inputContainer}>
          <NeumorphicTextInput
            title={'method'}
            required={true}
            width={WINDOW_WIDTH * 0.9}
            value={formik?.values?.method}
            onChangeText={formik.handleChange('method')}
            errorMessage={formik?.errors?.method}
          />

          <NeumorphicDropDownList
            width={WINDOW_WIDTH * 0.9}
            title={'status'}
            required={true}
            data={GST_TREATMENT_TYPE}
            value={formik?.values?.status}
            onChange={val => {
              formik.setFieldValue(`status`, val.value);
            }}
            errorMessage={formik?.errors?.status}
          />

          {/* modal view for delete*/}
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddUpdatePaymentMethodScreen;

const styles = StyleSheet.create({
  inputContainer: {
    // backgroundColor: 'green',
    flex: 1,
    marginHorizontal: WINDOW_WIDTH * 0.04,
    marginTop: WINDOW_HEIGHT * 0.02,
    rowGap: 10,
  },
  inputText: {
    color: Colors().pureBlack,
    fontSize: 12,
    fontWeight: '300',
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  listView: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 8,
  },
  selectedTextStyle: {
    fontSize: 15,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },

  errorMesage: {
    color: 'red',
    // marginTop: 5,
    alignSelf: 'flex-start',
    marginLeft: 15,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },

  title: {
    fontSize: 12,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    color: Colors().pureBlack,
  },
});
