import {StyleSheet, Text, View, SafeAreaView, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {useFormik} from 'formik';
import Colors from '../../../constants/Colors';
import CustomeHeader from '../../../component/CustomeHeader';
import IconType from '../../../constants/IconType';
import NeumorphicTextInput from '../../../component/NeumorphicTextInput';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import NeumorphicButton from '../../../component/NeumorphicButton';
import {Icon} from '@rneui/base';
import Toast from 'react-native-toast-message';
import NeumorphicDropDownList from '../../../component/DropDownList';
import {addEnergySchema} from '../../../utils/FormSchema';
import {
  addUserEnergyCompany,
  assignUserEnergyCompany,
} from '../../../redux/slices/energyCompany/company/getAllUserEnergyCompanySlice';
import {getEnergyAreaDataById} from '../../../redux/slices/energy team/addUpdateEnergyTeamSlice';
import NeumorphDatePicker from '../../../component/NeumorphDatePicker';
import moment from 'moment';

const AssignUserToEnergyCompanies = ({navigation, route}) => {
  /* declare props constant variale*/
  const dispatch = useDispatch();
  const ec_id = route?.params?.ec_id;
  const user_id = route?.params?.user_id;
  const type = route?.params?.type;
  const [areaTypeData, setAreaTypeData] = useState([]);
  const [areaType, setAreaType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openDate, setOpenDate] = useState(false);

  useEffect(() => {
    getAreaTypeData();
  }, [areaType]);

  const getAreaTypeData = async () => {
    try {
      const res = await dispatch(
        getEnergyAreaDataById({companyId: ec_id, type: areaType.value}),
      ).unwrap();
      if (res.status) {
        const rData = res.data?.map(item => ({
          label: item?.area_name,
          value: item?.id,
        }));
        setAreaTypeData(rData);
      } else {
        setAreaTypeData([]);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const ACTIVE_STATUS = [
    {label: 'Active', value: '1'},
    {label: 'InActive', value: '2'},
  ];

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: '',
      username: '',
      password: '',
      contact_no: '',
      alt_number: '',
      address_1: '',
      gst_number: '',
      status: '1',
      country: '',
      city: '',
      pin_code: '',
      description: '',
      area_selected: '',
      joining_date: '',
      area_name: '',
    },
    // validationSchema: addEnergySchema,

    onSubmit: values => {
      handleSubmit(values);
    },
  });

  const handleSubmit = async values => {
    if (values?.area_name === '') {
      delete values['area_name'];
      delete values['area_selected'];
      delete values['joining_date'];
    } else {
      values['energy_company_id'] = ec_id;
      values['joining_date'] = JSON.stringify(values?.joining_date);
    }
    try {
      setLoading(true);
      const res = await dispatch(
        type == 'ADD USER'
          ? addUserEnergyCompany(values)
          : assignUserEnergyCompany({body: values, id: user_id}),
      ).unwrap();

      if (res?.status) {
        Toast.show({
          type: 'success',
          text1: res?.message,
          position: 'bottom',
        });
        setLoading(false);
        navigation.navigate('EnergyCompanyListScreen');
      } else {
        Toast.show({
          type: 'error',
          text1: res?.message,
          position: 'bottom',
        });
        setLoading(false);
      }
    } catch (error) {
      console.log('error', error);
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
        // height: WINDOW_HEIGHT,
        backgroundColor: Colors().screenBackground,
      }}>
      <CustomeHeader headerTitle={type} />

      <ScrollView>
        <View style={styles.inputContainer}>
          <View style={{rowGap: 8}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.title}>Email</Text>
              <Icon
                name="asterisk"
                type={IconType.FontAwesome}
                size={8}
                color={Colors().red}
              />
            </View>
            <NeumorphicTextInput
              placeHolderTxt={''}
              width={WINDOW_WIDTH * 0.92}
              value={formik?.values?.email}
              onChangeText={formik.handleChange('email')}
              style={styles.inputText}
              errorMessage={formik?.errors?.email}
            />

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.title}>user name</Text>
              <Icon
                name="asterisk"
                type={IconType.FontAwesome}
                size={8}
                color={Colors().red}
              />
            </View>
            <NeumorphicTextInput
              placeHolderTxt={''}
              width={WINDOW_WIDTH * 0.92}
              value={formik?.values?.username}
              onChangeText={formik.handleChange('username')}
              style={styles.inputText}
              errorMessage={formik?.errors?.username}
            />

            <View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.title}>Password</Text>
              </View>
              <NeumorphicTextInput
                placeHolderTxt={''}
                width={WINDOW_WIDTH * 0.92}
                value={formik?.values?.password}
                onChangeText={formik.handleChange('password')}
                style={styles.inputText}
              />
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.title}>contact no</Text>
              <Icon
                name="asterisk"
                type={IconType.FontAwesome}
                size={8}
                color={Colors().red}
              />
            </View>
            <NeumorphicTextInput
              placeHolderTxt={''}
              width={WINDOW_WIDTH * 0.92}
              value={formik?.values?.contact_no}
              onChangeText={formik.handleChange('contact_no')}
              style={styles.inputText}
              errorMessage={formik?.errors?.contact_no}
            />

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.title}>alt number</Text>
            </View>
            <NeumorphicTextInput
              placeHolderTxt={''}
              width={WINDOW_WIDTH * 0.92}
              value={formik?.values?.alt_number}
              onChangeText={formik.handleChange('alt_number')}
              style={styles.inputText}
            />

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.title}>address</Text>
            </View>
            <NeumorphicTextInput
              placeHolderTxt={''}
              width={WINDOW_WIDTH * 0.92}
              value={formik?.values?.address_1}
              onChangeText={formik.handleChange('address_1')}
              style={styles.inputText}
            />

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.title}>gst number</Text>
            </View>
            <NeumorphicTextInput
              placeHolderTxt={''}
              width={WINDOW_WIDTH * 0.92}
              value={formik?.values?.gst_number}
              onChangeText={formik.handleChange('gst_number')}
              style={styles.inputText}
            />

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.title}>country</Text>
            </View>
            <NeumorphicTextInput
              placeHolderTxt={''}
              width={WINDOW_WIDTH * 0.92}
              value={formik?.values?.country}
              onChangeText={formik.handleChange('country')}
              style={styles.inputText}
            />

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.title}>city</Text>
            </View>
            <NeumorphicTextInput
              placeHolderTxt={''}
              width={WINDOW_WIDTH * 0.92}
              value={formik?.values?.city}
              onChangeText={formik.handleChange('city')}
              style={styles.inputText}
            />

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.title}>pin code</Text>
            </View>
            <NeumorphicTextInput
              placeHolderTxt={''}
              width={WINDOW_WIDTH * 0.92}
              value={formik?.values?.pin_code}
              onChangeText={formik.handleChange('pin_code')}
              style={styles.inputText}
            />

            {type == 'ADD USER' && (
              <View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={styles.title}>Joining Date</Text>
                </View>
                <NeumorphDatePicker
                  height={50}
                  width={WINDOW_WIDTH * 0.9}
                  withoutShadow={false}
                  iconPress={() => setOpenDate(!openDate)}
                  valueOfDate={
                    formik?.values?.joining_date
                      ? moment(formik?.values?.joining_date).format(
                          'DD/MM/YYYY',
                        )
                      : ''
                  }
                  modal
                  open={openDate}
                  date={new Date()}
                  mode="date"
                  onConfirm={date => {
                    formik.setFieldValue(`joining_date`, date);
                    setOpenDate(false);
                  }}
                  onCancel={() => {
                    setOpenDate(false);
                  }}
                />

                <NeumorphicDropDownList
                  width={WINDOW_WIDTH * 0.9}
                  title={'Area name'}
                  required={true}
                  data={[
                    {label: 'ZONE', value: 1},
                    {label: 'REGIONAL', value: 2},
                    {label: 'SALES AREA', value: 3},
                    {label: 'DISTRICT', value: 4},
                    {label: 'OUTLETS', value: 5},
                  ]}
                  value={formik?.values?.area_name}
                  onChange={val => {
                    formik.setFieldValue(`area_name`, val.value);
                    setAreaType(val);
                  }}
                  errorMessage={formik?.errors?.area_name}
                />
              </View>
            )}
            {formik?.values?.area_name != '' ? (
              <View>
                <NeumorphicDropDownList
                  width={WINDOW_WIDTH * 0.9}
                  title={`${areaType?.label}`}
                  required={true}
                  data={areaTypeData || []}
                  value={formik?.values?.area_selected}
                  onChange={val => {
                    formik.setFieldValue(`area_selected`, val?.value);
                  }}
                  errorMessage={formik?.errors?.area_selected}
                />
              </View>
            ) : null}

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.title}>Description</Text>
            </View>
            <NeumorphicTextInput
              placeHolderTxt={''}
              width={WINDOW_WIDTH * 0.92}
              value={formik?.values?.description}
              onChangeText={formik.handleChange('description')}
              style={styles.inputText}
            />

            <NeumorphicDropDownList
              width={WINDOW_WIDTH * 0.9}
              title={'status'}
              required={true}
              data={ACTIVE_STATUS}
              value={formik?.values?.status}
              onChange={val => {
                formik.setFieldValue(`status`, val.value);
              }}
              errorMessage={formik?.errors?.status}
            />
          </View>

          <View style={{alignSelf: 'center', marginVertical: 10}}>
            <NeumorphicButton
              title={'Save'}
              titleColor={Colors().purple}
              onPress={() => {
                formik.handleSubmit();
              }}
              loading={loading}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AssignUserToEnergyCompanies;

const styles = StyleSheet.create({
  inputContainer: {
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
