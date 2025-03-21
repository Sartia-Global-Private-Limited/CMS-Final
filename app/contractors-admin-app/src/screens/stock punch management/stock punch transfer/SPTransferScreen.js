/*    ----------------Created Date :: 23- April -2024   ----------------- */
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useFormik} from 'formik';
import Colors from '../../../constants/Colors';
import CustomeHeader from '../../../component/CustomeHeader';
import IconType from '../../../constants/IconType';
import {WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import NeumorphicButton from '../../../component/NeumorphicButton';
import Toast from 'react-native-toast-message';
import AlertModal from '../../../component/AlertModal';
import {selectUser} from '../../../redux/slices/authSlice';
import Images from '../../../constants/Images';
import {approveStockPunch} from '../../../redux/slices/stock-punch-management/stock-punch/addApproveStockPunchSlice';
import OTPTextView from 'react-native-otp-textinput';
import ScreensLabel from '../../../constants/ScreensLabel';
import {Avatar, CheckBox, Icon} from '@rneui/themed';
import NeuomorphAvatar from '../../../component/NeuomorphAvatar';
import {apiBaseUrl} from '../../../../config';
import SPTransferFilter from './SPTransferFilter';
import SPTransferItemComponent from './SPTransferItemComponent';
import {addStockPunchTransfer} from '../../../redux/slices/stock-punch-management/stock-transfer/addSPTransferSlice';

const SPTransferScreen = ({navigation, route}) => {
  /* declare props constant variale*/

  const type = route?.params?.type;
  const label = ScreensLabel();

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const {user} = useSelector(selectUser);

  /*declare useState variable here */
  const [approveModalVisible, setApproveModalVisible] = useState(false);
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    enableReinitialize: 'true',
    initialValues: {
      stock_transfer_for: '1',
      transfered_by: '',
      transfered_to: '',
      otp: '',
      transfer_items: [
        {
          id: '',
          item_id: '',
          remaining_item_qty: 0,
          transfer_item_qty: 0,
          approved_price: 0,
          transfer_amount: 0,
        },
      ],
    },

    onSubmit: (values, {resetForm}) => {
      handleSubmit(values, resetForm);
    },
  });

  const handleSubmit = async (values, resetForm) => {
    let sData;

    const modifiedItem = formik.values.transfer_items.map(itm => {
      return {
        id: itm?.id,
        item_id: itm?.item_id,
        approved_price: itm?.approved_price,
        remaining_item_qty: itm?.remaining_item_qty,
        transfer_amount: itm?.transfer_amount,
        transfer_item_qty: itm?.transfer_item_qty,
      };
    });

    if (values.stock_transfer_for == '1') {
      values['transfered_by'] = user.id;
    }

    sData = {
      stock_transfer_for: values?.stock_transfer_for,
      transfered_by: values?.transfered_by,
      transfered_to: values?.transfered_to,
      otp: values?.otp,
      transfer_items: modifiedItem,
    };

    try {
      if (values.otp) {
        setLoading(true);
      }

      const res =
        type == 'approve'
          ? await dispatch(approveStockPunch(sData)).unwrap()
          : await dispatch(addStockPunchTransfer(sData)).unwrap();

      if (res?.status) {
        if (!values.otp && type != 'approve') {
          setOtpModalVisible(true);
          Toast.show({
            type: 'success',
            text1: res?.message,
            position: 'bottom',
          });
        } else {
          Toast.show({
            type: 'success',
            text1: res?.message,
            position: 'bottom',
          });
          setLoading(false);
          setApproveModalVisible(false);

          resetForm();
          navigation.navigate('SPTransferListScreen');
        }
      } else {
        if (res?.message == 'Invalid OTP!') {
          setOtpModalVisible(true);
        }
        Toast.show({
          type: 'error',
          text1: res?.message,
          position: 'bottom',
        });
        setLoading(false);
        setApproveModalVisible(false);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });
      setLoading(false);
      setApproveModalVisible(false);
    }
  };

  const REQUEST_TYPE = [
    {label: 'SELF', value: '1'},
    {label: 'OTHER', value: '2'},
  ];

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors().screenBackground,
      }}>
      <CustomeHeader
        headerTitle={
          type === 'approve'
            ? `${label.STOCK_PUNCH} ${label.APPROVE}`
            : `${label.STOCK_PUNCH} ${label.TRANSFER}`
        }
      />

      <ScrollView contentContainerStyle={{rowGap: 10}}>
        <View>
          <Text
            style={[
              styles.title,
              {marginLeft: 10, marginTop: 5, color: Colors().pureBlack},
            ]}>
            Transfer from :--
          </Text>
        </View>
        <View style={styles.radioView}>
          {REQUEST_TYPE.map((radioButton, index) => (
            <View key={index}>
              <CheckBox
                key={index}
                textStyle={{
                  fontFamily: Colors().fontFamilyBookMan,
                  color: Colors().gray,
                }}
                containerStyle={{
                  backgroundColor: Colors().screenBackground,
                }}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                title={radioButton.label}
                checked={formik.values.stock_transfer_for == radioButton.value}
                onPress={() => {
                  formik.resetForm();

                  formik.setFieldValue('stock_transfer_for', radioButton.value);
                }}
                checkedColor={Colors().aprroved}
              />
            </View>
          ))}
        </View>

        {formik.values.stock_transfer_for == 1 && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginHorizontal: WINDOW_WIDTH * 0.03,
            }}>
            <NeuomorphAvatar gap={4}>
              <Avatar
                size={40}
                rounded
                source={{
                  uri: user?.image
                    ? `${apiBaseUrl}${user?.image}`
                    : `${Image.resolveAssetSource(Images.DEFAULT_PROFILE).uri}`,
                }}
              />
            </NeuomorphAvatar>
            <Text
              numberOfLines={2}
              style={[
                styles.title,
                {
                  color: Colors().pureBlack,
                  alignSelf: 'center',
                  marginHorizontal: 10,
                  textAlign: 'center',
                },
              ]}>
              {user?.name} ({user?.employee_id} self)
            </Text>
          </View>
        )}
        {formik.values.stock_transfer_for == 2 && (
          <SPTransferFilter formik={formik} type={'from'} />
        )}

        <Icon
          name="exchange"
          type={IconType.FontAwesome}
          size={30}
          color={Colors().orange}
        />

        <SPTransferFilter formik={formik} type={'to'} />

        <SPTransferItemComponent formik={formik} />

        <View style={{}}>
          {/* modal view for delete*/}
          {approveModalVisible && (
            <AlertModal
              visible={approveModalVisible}
              iconName={'checkcircleo'}
              icontype={IconType.AntDesign}
              iconColor={Colors().aprroved}
              textToShow={'ARE YOU SURE YOU WANT TO APPROVE THIS!!'}
              cancelBtnPress={() =>
                setApproveModalVisible(!approveModalVisible)
              }
              ConfirmBtnPress={() => formik.handleSubmit()}
            />
          )}
          {otpModalVisible && (
            <AlertModal
              visible={otpModalVisible}
              iconName={'checkcircleo'}
              icontype={IconType.AntDesign}
              iconColor={Colors().aprroved}
              textToShow={'ARE YOU SURE YOU WANT TO APPROVE THIS!!'}
              cancelBtnPress={() => setOtpModalVisible(!otpModalVisible)}
              ConfirmBtnPress={() => formik.handleSubmit()}
              Component={
                <OTPTextView
                  inputCount={6}
                  textInputStyle={{
                    borderWidth: 1,
                    borderRadius: 8,
                  }}
                  offTintColor={Colors().pending}
                  tintColor={Colors().aprroved}
                  containerStyle={{
                    marginBottom: 10,
                  }}
                  handleTextChange={formik.handleChange('otp')}></OTPTextView>
              }
            />
          )}

          <View style={{alignSelf: 'center', marginVertical: 20}}>
            <NeumorphicButton
              title={`${label.TRANSFER}`}
              titleColor={Colors().purple}
              onPress={() => {
                type == 'approve'
                  ? setApproveModalVisible(true)
                  : formik.handleSubmit();
              }}
              loading={loading}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SPTransferScreen;

const styles = StyleSheet.create({
  twoItemView: {
    flexDirection: 'row',
    columnGap: 5,
  },
  radioView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  bankCard: {
    marginHorizontal: WINDOW_WIDTH * 0.03,
    padding: WINDOW_WIDTH * 0.03,
    rowGap: 10,
  },
  title: {
    fontSize: 15,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    color: Colors().pureBlack,
    flexShrink: 1,
  },
});
