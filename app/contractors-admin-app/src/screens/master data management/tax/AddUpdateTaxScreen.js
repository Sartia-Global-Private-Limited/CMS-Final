/*    ----------------Updated On :: 5- Sep -2024   ----------------- */

import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import Colors from '../../../constants/Colors';
import CustomeHeader from '../../../component/CustomeHeader';
import IconType from '../../../constants/IconType';
import NeumorphicTextInput from '../../../component/NeumorphicTextInput';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../utils/ScreenLayout';
import { addTaxSchema } from '../../../utils/FormSchema';
import NeumorphicButton from '../../../component/NeumorphicButton';
import NeumorphicDropDownList from '../../../component/DropDownList';
import { Icon } from '@rneui/base';
import Toast from 'react-native-toast-message';
import AlertModal from '../../../component/AlertModal';
import { getAllBillingType } from '../../../redux/slices/commonApi';
import {
  addTax,
  updateTax,
} from '../../../redux/slices/master-data-management/tax/addUpdateTaxSlice';
import { getTaxDetailById } from '../../../redux/slices/master-data-management/tax/getTaxDetailSlice';

const AddUpdateTaxScreen = ({ navigation, route }) => {
  /* declare props constant variale*/

  const edit_id = route?.params?.edit_id;

  /*declare hooks variable here */
  const dispatch = useDispatch();

  /*declare useState variable here */

  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState({});
  const [billingType, setBillingType] = useState([]);

  useEffect(() => {
    fetchAllBillingType();
    if (edit_id) {
      fetchSingleDetails();
    }
  }, []);

  const formik = useFormik({
    enableReinitialize: 'true',
    initialValues: {
      billing_type_id: edit?.billing_type_id || '',
      name: edit?.name || '',
      value: edit?.value ? JSON.stringify(edit?.value) : '',
      status: (edit_id && edit?.status) || '1',
    },
    validationSchema: addTaxSchema,

    onSubmit: (values, { resetForm }) => {
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
      billing_type_id: values.billing_type_id,
      name: values.name,
      value: values.value,
      status: values.status,
    };

    if (edit_id) {
      reqBody['id'] = edit_id;
    }

    try {
      setLoading(true);
      const res = edit_id
        ? await dispatch(updateTax(reqBody)).unwrap()
        : await dispatch(addTax(reqBody)).unwrap();

      if (res?.status) {
        Toast.show({
          type: 'success',
          text1: res?.message,
          position: 'bottom',
        });
        setLoading(false);
        resetForm();
        navigation.navigate('TaxListScreen');
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
    const fetchResult = await dispatch(getTaxDetailById(edit_id)).unwrap();
    if (fetchResult?.status) {
      setEdit(fetchResult.data);
    } else {
      setEdit([]);
    }
  };

  /*function for all billing type*/
  const fetchAllBillingType = async () => {
    const res = await dispatch(getAllBillingType()).unwrap();

    if (res?.status) {
      const rData = res?.data?.map(item => {
        return {
          label: item?.name,
          value: item?.id,
        };
      });
      setBillingType(rData);
    } else {
      setBillingType([]);
    }
  };

  /*Ui of dropdown list*/
  const renderDropDown = item => {
    return (
      <View style={styles.listView}>
        {item?.label && (
          <Text
            numberOfLines={1}
            style={[styles.inputText, { marginLeft: 10 }]}>
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
      <CustomeHeader headerTitle={edit_id ? 'update Tax' : 'Add Tax'} />

      <ScrollView>
        <View style={styles.inputContainer}>
          <View style={{ rowGap: 2 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.title}>Name </Text>
              {/* <Icon
                name="asterisk"
                type={IconType.FontAwesome5}
                size={8}
                color={Colors().red}
              /> */}
            </View>

            <NeumorphicTextInput
              placeHolderTxt={'TYPE...'}
              width={WINDOW_WIDTH * 0.9}
              value={formik.values.name}
              onChangeText={formik.handleChange('name')}
              style={styles.inputText}
            />
          </View>
          {/* {formik.touched.name && formik.errors.name && (
            <Text style={styles.errorMesage}>{formik.errors.name}</Text>
          )} */}

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.title}>Billing type </Text>
            <Icon
              name="asterisk"
              type={IconType.FontAwesome}
              size={8}
              color={Colors().red}
            />
          </View>
          <NeumorphicDropDownList
            width={WINDOW_WIDTH * 0.9}
            RightIconName="caretdown"
            RightIconType={IconType.AntDesign}
            RightIconColor={Colors().darkShadow2}
            placeholder={'SELECT ...'}
            data={billingType}
            labelField={'label'}
            valueField={'value'}
            value={formik.values.billing_type_id}
            renderItem={renderDropDown}
            search={false}
            placeholderStyle={styles.inputText}
            selectedTextStyle={styles.selectedTextStyle}
            editable={false}
            style={styles.inputText}
            onChange={val => {
              formik.setFieldValue(`billing_type_id`, val.value);
            }}
          />
          {formik.touched.billing_type_id && formik.errors.billing_type_id && (
            <Text style={styles.errorMesage}>
              {formik.errors.billing_type_id}
            </Text>
          )}

          <View style={styles.twoItemView}>
            <>
              <View style={styles.leftView}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.title}>value (%) </Text>
                  <Icon
                    name="asterisk"
                    type={IconType.FontAwesome5}
                    size={8}
                    color={Colors().red}
                  />
                </View>
                <NeumorphicTextInput
                  placeHolderTxt={'TYPE...'}
                  width={WINDOW_WIDTH * 0.44}
                  value={formik.values.value}
                  onChangeText={formik.handleChange('value')}
                  style={styles.inputText}
                  keyboardType={'numeric'}
                />
                {formik.touched.value && formik.errors.value && (
                  <Text style={styles.errorMesage}>{formik.errors.value}</Text>
                )}
              </View>
              <View style={styles.rightView}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.title}>STATus </Text>
                  <Icon
                    name="asterisk"
                    type={IconType.FontAwesome5}
                    size={8}
                    color={Colors().red}
                  />
                </View>
                <NeumorphicDropDownList
                  width={WINDOW_WIDTH * 0.44}
                  RightIconName="caretdown"
                  RightIconType={IconType.AntDesign}
                  RightIconColor={Colors().darkShadow2}
                  placeholder={'SELECT ...'}
                  data={GST_TREATMENT_TYPE}
                  labelField={'label'}
                  valueField={'value'}
                  value={formik.values.status}
                  renderItem={renderDropDown}
                  search={false}
                  placeholderStyle={styles.inputText}
                  selectedTextStyle={styles.selectedTextStyle}
                  editable={false}
                  style={styles.inputText}
                  onChange={val => {
                    formik.setFieldValue(`status`, val.value);
                  }}
                />
                {formik.touched.status && formik.errors.status && (
                  <Text style={styles.errorMesage}>{formik.errors.status}</Text>
                )}
              </View>
            </>
          </View>
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

          <View style={{ alignSelf: 'center', marginVertical: 10 }}>
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

export default AddUpdateTaxScreen;

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
  rightView: {
    flexDirection: 'column',
    flex: 1,
    rowGap: 8,
    // justifyContent: 'flex-end',
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
    fontSize: 12,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    color: Colors().pureBlack,
  },
});
