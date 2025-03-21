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
import {addOrderViaSchema} from '../../../utils/FormSchema';
import NeumorphicButton from '../../../component/NeumorphicButton';
import NeumorphicDropDownList from '../../../component/DropDownList';

import {Icon} from '@rneui/base';
import {
  createOrderVia,
  getOrederViaDetailById,
  updatOrderViaById,
} from '../../../redux/slices/order-via/orederViaSlice';

import Toast from 'react-native-toast-message';
import AlertModal from '../../../component/AlertModal';

const AddUpdateOrderViaScreen = ({navigation, route}) => {
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
      fetchSingleDetails(edit_id);
    }
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      order_via: (edit_id && edit?.order_via) || '',
      status: (edit_id && edit?.status) || '1',
    },
    validationSchema: addOrderViaSchema,

    onSubmit: values => {
      handleSubmit(values);
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

  const handleSubmit = async values => {
    const reqBody = {
      order_via: values.order_via,
      status: values.status,
    };

    if (edit_id) {
      reqBody['id'] = edit_id;
    }

    try {
      setLoading(true);
      const res = edit_id
        ? await dispatch(updatOrderViaById(reqBody)).unwrap()
        : await dispatch(createOrderVia(reqBody)).unwrap();

      if (res?.status) {
        Toast.show({
          type: 'success',
          text1: res?.message,
          position: 'bottom',
        });
        setLoading(false);
        navigation.navigate('OrderViaListScreen');
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

  const fetchSingleDetails = async id => {
    const fetchResult = await dispatch(getOrederViaDetailById(id)).unwrap();
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
        headerTitle={edit_id ? 'update order Via' : 'Add order via'}
      />

      <ScrollView>
        <View style={styles.inputContainer}>
          <View style={{rowGap: 8}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.title}>Order via </Text>
              <Icon
                name="asterisk"
                type={IconType.FontAwesome}
                size={8}
                color={Colors().red}
              />
            </View>

            <NeumorphicTextInput
              placeHolderTxt={'ORDER VIA'}
              width={WINDOW_WIDTH * 0.92}
              value={formik?.values?.order_via}
              onChangeText={formik.handleChange('order_via')}
              style={styles.inputText}
            />
          </View>
          {formik?.touched?.order_via && formik?.errors?.order_via && (
            <Text style={styles.errorMesage}>{formik?.errors?.order_via}</Text>
          )}

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.title}>STATus </Text>
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
            data={GST_TREATMENT_TYPE}
            labelField={'label'}
            valueField={'value'}
            value={formik?.values?.status}
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
          {formik?.touched?.status && formik?.errors?.status && (
            <Text style={styles.errorMesage}>{formik?.errors?.status}</Text>
          )}
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

export default AddUpdateOrderViaScreen;

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
