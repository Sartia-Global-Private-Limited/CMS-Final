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
import AlertModal from '../../../component/AlertModal';
import {getAdminSingleEnergy} from '../../../services/authApi';
import NeumorphicDropDownList from '../../../component/DropDownList';
import {addEnergySchema} from '../../../utils/FormSchema';
import {
  createUserEnergyCompany,
  updateUserEnergyCompany,
} from '../../../redux/slices/energyCompany/company/getAllUserEnergyCompanySlice';

const AddUpdateEnegyCompanyScreen = ({navigation, route}) => {
  /* declare props constant variale*/
  const dispatch = useDispatch();
  const id = route?.params?.id;
  const [energyCompany, setEnergyCompany] = useState([]);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getSingleENData();
  }, [id]);

  const getSingleENData = async () => {
    try {
      const res = await getAdminSingleEnergy(id);
      if (res.status) {
        console.log('res', res);
        setEnergyCompany(res?.data);
      } else {
        setEnergyCompany([]);
      }
    } catch (error) {}
  };

  const ACTIVE_STATUS = [
    {label: 'Active', value: '1'},
    {label: 'InActive', value: '2'},
  ];

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      company_name: energyCompany?.company_name || '',
      website_url: energyCompany?.website_url || '',
      username: energyCompany?.username || '',
      email: energyCompany?.email || '',
      contact_no: energyCompany?.contact_no || '',
      alt_number: energyCompany?.alt_number || '',
      address_1: energyCompany?.address_1 || '',
      status: energyCompany?.status || '',
      country: energyCompany?.country || '',
      city: energyCompany?.city || '',
      pin_code: energyCompany?.pin_code || '',
      description: energyCompany?.description || '',
      gst_number: energyCompany?.gst_number || '',
      status: energyCompany?.status || '',
      password: energyCompany?.password,
    },
    validationSchema: addEnergySchema,

    onSubmit: values => {
      handleSubmit(values);
    },
  });

  const handleSubmit = async values => {
    const formData = new FormData();
    Object.entries(values).forEach(([name, value]) => {
      formData.append(name, value);
    });

    if (id) {
      formData.append('energy_company_id', id);
    }

    // return console.log('formData', formData);

    try {
      setLoading(true);
      const res = id
        ? await dispatch(updateUserEnergyCompany(formData)).unwrap()
        : await dispatch(createUserEnergyCompany(formData)).unwrap();

      if (res?.status) {
        Toast.show({
          type: 'success',
          text1: res?.message,
          position: 'bottom',
        });
        setLoading(false);
        navigation.navigate('EnergyCompanyListScreen');
      } else {
        console.log('res', res);
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
      <CustomeHeader
        headerTitle={id ? 'update Energy Company' : 'Add Energy Company'}
      />

      <ScrollView>
        <View style={styles.inputContainer}>
          <View style={{rowGap: 8}}>
            <NeumorphicTextInput
              placeHolderTxt={''}
              title={'Company Name'}
              value={formik?.values?.company_name}
              onChangeText={formik.handleChange('company_name')}
            />

            <NeumorphicTextInput
              title={'Website Url'}
              placeHolderTxt={''}
              value={formik?.values?.website_url}
              onChangeText={formik.handleChange('website_url')}
            />

            <NeumorphicTextInput
              placeHolderTxt={''}
              title={'Email'}
              value={formik?.values?.email}
              onChangeText={formik.handleChange('email')}
              errorMessage={formik?.errors?.email}
            />

            <NeumorphicTextInput
              placeHolderTxt={''}
              title={'User Name'}
              value={formik?.values?.username}
              onChangeText={formik.handleChange('username')}
              errorMessage={formik?.errors?.username}
            />

            {!id && (
              <View>
                <NeumorphicTextInput
                  placeHolderTxt={''}
                  title={'Password'}
                  value={formik?.values?.password}
                  onChangeText={formik.handleChange('password')}
                />
              </View>
            )}

            <NeumorphicTextInput
              required
              title={'contact no'}
              placeHolderTxt={''}
              value={formik?.values?.contact_no}
              onChangeText={formik.handleChange('contact_no')}
              errorMessage={formik?.errors?.contact_no}
            />

            <NeumorphicTextInput
              title={'Alt Number'}
              placeHolderTxt={''}
              value={formik?.values?.alt_number}
              onChangeText={formik.handleChange('alt_number')}
            />

            <NeumorphicTextInput
              title={'address'}
              placeHolderTxt={''}
              value={formik?.values?.address_1}
              onChangeText={formik.handleChange('address_1')}
            />

            <NeumorphicTextInput
              placeHolderTxt={''}
              title={'gst number'}
              value={formik?.values?.gst_number}
              onChangeText={formik.handleChange('gst_number')}
            />

            <NeumorphicTextInput
              title={'country'}
              placeHolderTxt={''}
              value={formik?.values?.country}
              onChangeText={formik.handleChange('country')}
            />

            <NeumorphicTextInput
              title={'city'}
              placeHolderTxt={''}
              value={formik?.values?.city}
              onChangeText={formik.handleChange('city')}
            />

            <NeumorphicTextInput
              title={'pin code'}
              placeHolderTxt={''}
              value={formik?.values?.pin_code}
              onChangeText={formik.handleChange('pin_code')}
            />

            <NeumorphicTextInput
              title={'Description'}
              placeHolderTxt={''}
              value={formik?.values?.description}
              onChangeText={formik.handleChange('description')}
            />

            <NeumorphicDropDownList
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

          {/* modal view for delete*/}
          {updateModalVisible && (
            <AlertModal
              visible={updateModalVisible}
              iconName={'clock-edit-outline'}
              icontype={IconType.MaterialCommunityIcons}
              iconColor={Colors().aprroved}
              textToShow={'ARE YOU SURE YOU WANT TO UPDATE THIS!!'}
              cancelBtnPress={() => setUpdateModalVisible(!updateModalVisible)}
              ConfirmBtnPress={() => {
                setUpdateModalVisible(false);
                formik.handleSubmit();
              }}
            />
          )}

          <View style={{alignSelf: 'center', marginVertical: 50}}>
            <NeumorphicButton
              title={id ? 'update' : 'ADD'}
              titleColor={Colors().purple}
              onPress={() => {
                id ? setUpdateModalVisible(true) : formik.handleSubmit();
              }}
              loading={loading}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddUpdateEnegyCompanyScreen;

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
