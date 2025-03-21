/*    ----------------Created Date :: 11- March -2024   ----------------- */
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {useFormik} from 'formik';
import Colors from '../../../constants/Colors';
import CustomeHeader from '../../../component/CustomeHeader';
import IconType from '../../../constants/IconType';
import NeumorphicTextInput from '../../../component/NeumorphicTextInput';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import {addBankBalaceSchema} from '../../../utils/FormSchema';
import NeumorphicButton from '../../../component/NeumorphicButton';
import NeumorphicDropDownList from '../../../component/DropDownList';
import {Icon} from '@rneui/base';
import Toast from 'react-native-toast-message';
import AlertModal from '../../../component/AlertModal';
import {getAllAccount, getAllBank} from '../../../redux/slices/commonApi';
import NeuomorphAvatar from '../../../component/NeuomorphAvatar';
import {Avatar} from '@rneui/themed';
import Images from '../../../constants/Images';
import {apiBaseUrl} from '../../../../config';
import {updateAccountDetail} from '../../../redux/slices/master-data-management/account-mangement/addUpdateAccountSlice';
import {getAccountDetailById} from '../../../redux/slices/master-data-management/account-mangement/getAccountDetailSlice';
import {addAccountBalance} from '../../../redux/slices/master-data-management/add-bank-balance/AddUpdateBankBalanceSlic';

const AddUpdateBalanceScreen = ({navigation, route}) => {
  /* declare props constant variale*/

  const edit_id = route?.params?.edit_id;

  /*declare hooks variable here */
  const dispatch = useDispatch();

  /*declare useState variable here */

  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allBank, setAllBank] = useState([]);
  const [allAccount, setAllAccount] = useState([]);
  const [edit, setEdit] = useState({});

  useEffect(() => {
    fetchAllBank();
    if (edit_id) {
      fetchSingleDetails();
    }
  }, [edit_id]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      bank_id: '',
      id: '',
      transaction_id: '',
      balance: '',
      remark: '',
    },
    validationSchema: addBankBalaceSchema,

    onSubmit: (values, {resetForm}) => {
      handleSubmit(values, resetForm);
    },
  });

  const handleSubmit = async (values, resetForm) => {
    const reqBody = {
      id: values.id,
      balance: values.balance,
      remark: values.remark,
      transaction_id: values.transaction_id,
    };
    try {
      setLoading(true);
      const res = edit_id
        ? await dispatch(updateAccountDetail(reqBody)).unwrap()
        : await dispatch(addAccountBalance(reqBody)).unwrap();

      if (res?.status) {
        Toast.show({
          type: 'success',
          text1: res?.message,
          position: 'bottom',
        });
        setLoading(false);
        resetForm();
        navigation.navigate('AccountListScreen');
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
    const fetchResult = await dispatch(getAccountDetailById(edit_id)).unwrap();

    if (fetchResult?.status) {
      setEdit(fetchResult.data);
    } else {
      setEdit([]);
    }
  };

  const handleBankChange = async id => {
    const res = await dispatch(getAllAccount(id)).unwrap();
    if (res?.status) {
      const rData = res?.data.map(item => {
        return {value: item?.id, label: item?.account_number};
      });
      setAllAccount(rData);
    } else {
      Toast.show({
        type: 'error',
        text1: res?.message,
        position: 'bottom',
      });
      setAllAccount([]);
    }
  };

  /* function for fetching all finance year*/
  const fetchAllBank = async () => {
    const res = await dispatch(getAllBank()).unwrap();

    if (res?.status) {
      const rData = res?.data.map(item => {
        return {
          label: item?.bank_name,
          value: item?.id,
          image: item?.logo,
        };
      });
      setAllBank(rData);
    } else {
      setAllBank([]);
    }
  };

  /*Ui of dropdown list*/
  const renderDropDown = item => {
    return (
      <View style={styles.listView}>
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
      <CustomeHeader headerTitle={'Add Bank balance'} />

      <ScrollView>
        <View style={styles.inputContainer}>
          <View style={{rowGap: 8}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.title}>Bank name </Text>
              <Icon
                name="asterisk"
                type={IconType.FontAwesome}
                size={8}
                color={Colors().red}
              />
            </View>

            <NeumorphicDropDownList
              placeholder={'select...'}
              data={allBank}
              labelField={'label'}
              valueField={'value'}
              value={formik?.values?.bank_id}
              renderItem={renderDropDown}
              search={false}
              placeholderStyle={styles.inputText}
              selectedTextStyle={styles.selectedTextStyle}
              style={styles.inputText}
              onChange={val => {
                formik.setFieldValue(`bank_id`, val.value);
                handleBankChange(val.value);
              }}
            />
          </View>

          {formik?.touched?.bank_id && formik?.errors?.bank_id && (
            <Text style={styles.errorMesage}>{formik?.errors?.bank_id}</Text>
          )}

          <View style={{rowGap: 8}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.title}>Select account </Text>
              <Icon
                name="asterisk"
                type={IconType.FontAwesome}
                size={8}
                color={Colors().red}
              />
            </View>

            <NeumorphicDropDownList
              placeholder={'select...'}
              data={allAccount}
              labelField={'label'}
              valueField={'value'}
              value={formik?.values?.id}
              renderItem={renderDropDown}
              search={false}
              placeholderStyle={styles.inputText}
              selectedTextStyle={styles.selectedTextStyle}
              style={styles.inputText}
              onChange={val => {
                formik.setFieldValue(`id`, val.value);
              }}
            />
          </View>
          {formik?.touched?.id && formik?.errors?.id && (
            <Text style={styles.errorMesage}>{formik?.errors?.id}</Text>
          )}

          <View style={styles.twoItemView}>
            <View style={styles.leftView}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.title}>transaction id </Text>
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
                value={formik?.values?.transaction_id}
                onChangeText={formik.handleChange(`transaction_id`)}
                style={styles.inputText}
              />
              {formik?.touched?.transaction_id &&
                formik?.errors?.transaction_id && (
                  <Text style={styles.errorMesage}>
                    {formik?.errors?.transaction_id}
                  </Text>
                )}
            </View>
            <View style={styles.rightView}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.title}>Amount </Text>
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
                value={formik?.values?.balance}
                onChangeText={formik.handleChange(`balance`)}
                style={styles.inputText}
                // maxLength={11}
                keyboardType={'numeric'}
              />
              {formik?.touched?.balance && formik?.errors?.balance && (
                <Text style={styles.errorMesage}>
                  {formik?.errors?.balance}
                </Text>
              )}
            </View>
          </View>

          <View style={{rowGap: 8}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.title}>Remark </Text>
              <Icon
                name="asterisk"
                type={IconType.FontAwesome}
                size={8}
                color={Colors().red}
              />
            </View>

            <NeumorphicTextInput
              placeHolderTxt={'TYPE...'}
              width={WINDOW_WIDTH * 0.9}
              value={formik?.values?.remark}
              onChangeText={formik.handleChange(`remark`)}
              style={styles.inputText}
            />
          </View>
          {formik?.touched?.remark && formik?.errors?.remark && (
            <Text style={styles.errorMesage}>{formik?.errors?.remark}</Text>
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

export default AddUpdateBalanceScreen;

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
  separatorHeading: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',

    flex: 1,
  },
  listView: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 8,
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
  createSkillView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    borderBottomColor: Colors().gray,
    borderBottomWidth: 2,
    marginHorizontal: 8,
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
  checkboxView: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginLeft: '1%',
  },
  rememberTxt: {
    marginLeft: '2%',
    color: Colors().gray,
    fontSize: 15,
    fontWeight: '600',
    fontFamily: Colors().fontFamilyBookMan,
  },
});
