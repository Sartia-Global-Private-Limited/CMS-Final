import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
} from 'react-native';
import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {useFormik} from 'formik';
import Colors from '../../../constants/Colors';
import CustomeHeader from '../../../component/CustomeHeader';
import IconType from '../../../constants/IconType';
import NeumorphicButton from '../../../component/NeumorphicButton';
import Toast from 'react-native-toast-message';
import ScreensLabel from '../../../constants/ScreensLabel';
import moment from 'moment';
import converToNumber from '../../../utils/StringToNumber';
import {addPaymentSchema2} from '../../../utils/FormSchema';
import {updatePayementAmountRetention} from '../../../redux/slices/billing management/retention money/addUpdateRetentionSlice';
import CustomeCard from '../../../component/CustomeCard';
import NeumorphDatePicker from '../../../component/NeumorphDatePicker';
import {WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import {Icon} from '@rneui/themed';

const ApporveRetentionMoneyScreen = ({navigation, route}) => {
  /* declare props constant variale*/
  const ids = route?.params?.ids;
  const label = ScreensLabel();

  /*declare hooks variable here */
  const dispatch = useDispatch();

  /*declare useState variable here */
  const [openPurchaseDate, setOpenPurchaseDate] = useState(false);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    enableReinitialize: true,

    initialValues: {
      payment_reference_number: '',
      date: '',
      amount: '',
      ids: ids,
    },
    validationSchema: addPaymentSchema2,
    onSubmit: (values, {resetForm}) => {
      handleSubmit(values, resetForm);
    },
  });

  const handleSubmit = async (values, resetForm) => {
    const sData = {
      ids: values?.ids,
      payment_reference_number: values?.payment_reference_number,
      date: moment(values?.date).format('YYYY-MM-DD'),
      amount: converToNumber(values?.amount).toFixed(2),
    };

    try {
      setLoading(true);

      const res = await dispatch(updatePayementAmountRetention(sData)).unwrap();
      if (res?.status) {
        Toast.show({
          type: 'success',
          text1: res?.message,
          position: 'bottom',
        });
        setLoading(false);

        resetForm();
        navigation.navigate('RetentionMoneyTopTab');
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

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors().screenBackground,
      }}>
      <CustomeHeader
        headerTitle={`${label.APPROVE} ${label.RETENTION_MONEY} `}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{}}>
          {/* form ui section wise  */}
          <CustomeCard
            headerName={'voucher detail'}
            data={[
              {
                key: 'Voucher no',
                component: (
                  <View
                    style={{
                      flexDirection: 'row',
                      flex: 1,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <TextInput
                      placeholder="TYPE..."
                      placeholderTextColor={Colors().gray2}
                      style={[
                        styles.inputText,
                        styles.inputText2,
                        {backgroundColor: Colors().cardBackground},
                      ]}
                      value={formik?.values?.payment_reference_number}
                      onChangeText={formik.handleChange(
                        `payment_reference_number`,
                      )}
                    />
                    {!formik?.values?.payment_reference_number && (
                      <View style={{}}>
                        <Icon
                          name="asterisk"
                          type={IconType.FontAwesome5}
                          size={8}
                          color={Colors().red}
                        />
                      </View>
                    )}
                  </View>
                ),
              },
              {
                component: (
                  <View style={styles.twoItemView}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        {color: Colors().pureBlack},
                      ]}>
                      Voucher dates :{' '}
                    </Text>

                    <View style={{flex: 1}}>
                      <NeumorphDatePicker
                        height={38}
                        width={
                          formik?.values?.receipt_date
                            ? WINDOW_WIDTH * 0.56
                            : WINDOW_WIDTH * 0.54
                        }
                        withoutShadow={true}
                        iconPress={() => setOpenPurchaseDate(!openPurchaseDate)}
                        valueOfDate={
                          formik?.values?.date
                            ? moment(formik?.values?.date).format('DD/MM/YYYY')
                            : ''
                        }
                        modal
                        open={openPurchaseDate}
                        date={new Date()}
                        mode="date"
                        onConfirm={date => {
                          formik.setFieldValue(`date`, date);

                          setOpenPurchaseDate(false);
                        }}
                        onCancel={() => {
                          setOpenPurchaseDate(false);
                        }}></NeumorphDatePicker>
                    </View>
                    {!formik.values?.date && (
                      <View style={{alignSelf: 'center'}}>
                        <Icon
                          name="asterisk"
                          type={IconType.FontAwesome5}
                          size={8}
                          color={Colors().red}
                        />
                      </View>
                    )}
                  </View>
                ),
              },

              {
                key: 'Voucher amount ',
                component: (
                  <View
                    style={{
                      flexDirection: 'row',
                      flex: 1,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <TextInput
                      placeholder="TYPE..."
                      placeholderTextColor={Colors().gray2}
                      style={[styles.inputText, styles.inputText2]}
                      keyboardType="numeric"
                      value={formik?.values?.amount}
                      onChangeText={formik.handleChange(`amount`)}
                    />
                    {!formik?.values?.amount && (
                      <View style={{}}>
                        <Icon
                          name="asterisk"
                          type={IconType.FontAwesome5}
                          size={8}
                          color={Colors().red}
                        />
                      </View>
                    )}
                  </View>
                ),
              },
            ]}
          />

          <View
            style={{
              justifyContent: 'center',
              marginVertical: 20,
              gap: 10,
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}>
            <NeumorphicButton
              title={`${label.UPDATE}`}
              titleColor={Colors().purple}
              onPress={() => formik.handleSubmit()}
              loading={loading}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ApporveRetentionMoneyScreen;

const styles = StyleSheet.create({
  twoItemView: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardHeadingTxt: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 20,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  inputText: {
    fontSize: 13,
    fontWeight: '300',
    textTransform: 'uppercase',
    flexShrink: 1,
    fontFamily: Colors().fontFamilyBookMan,
  },
  inputText2: {
    height: 20,
    padding: 1,
    paddingLeft: 5,
    alignSelf: 'center',
    color: Colors().pureBlack,
    justifyContent: 'center',
    flexShrink: 1,
  },
});
