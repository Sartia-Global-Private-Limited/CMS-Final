import {StyleSheet, Text, View, SafeAreaView, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {useFormik} from 'formik';
import Colors from '../../../constants/Colors';
import CustomeHeader from '../../../component/CustomeHeader';
import IconType from '../../../constants/IconType';
import NeumorphicTextInput from '../../../component/NeumorphicTextInput';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import {addROSchema} from '../../../utils/FormSchema';
import NeumorphicButton from '../../../component/NeumorphicButton';
import NeumorphicDropDownList from '../../../component/DropDownList';
import {Icon} from '@rneui/base';
import Toast from 'react-native-toast-message';
import AlertModal from '../../../component/AlertModal';
import {allEnergyCompanyList} from '../../../redux/slices/energyCompany/company/getAllEnergyCompanySlice';
import {useIsFocused} from '@react-navigation/native';
import {getAdminEnergyCompanyassignZone} from '../../../services/authApi';
import {
  createRegionalOffice,
  updateRegionalOfficeById,
} from '../../../redux/slices/energyCompany/regionalOffice/getAllRegionalOfficeListSlice';

const AddUpdateRegionalOfficeScreen = ({navigation, route}) => {
  /* declare props constant variale*/
  const dispatch = useDispatch();
  const item = route?.params?.item;
  const isFocused = useIsFocused();
  const [energyCompany, setEnergyCompany] = useState([]);
  const [energyCompanyId, setEnergyCompanyId] = useState('');
  const [zones, setZones] = useState([]);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllENData();
    getAllZones();
  }, [isFocused]);

  useEffect(() => {
    getAllZones(item?.energy_company_id);
  }, [item]);

  useEffect(() => {
    if (energyCompanyId != '') {
      getAllZones(energyCompanyId);
    }
  }, [energyCompanyId]);

  const getAllENData = async () => {
    try {
      const res = await dispatch(allEnergyCompanyList()).unwrap();
      if (res.status) {
        const rdata =
          res &&
          res?.data?.map(i => ({
            label: i?.name,
            value: i?.energy_company_id,
          }));
        setEnergyCompany(rdata);
      } else {
        setEnergyCompany([]);
      }
    } catch (error) {}
  };

  const getAllZones = async id => {
    try {
      const res = await getAdminEnergyCompanyassignZone(id);
      if (res.status) {
        const rdata =
          res &&
          res?.data?.map(i => ({
            label: i?.zone_name,
            value: i?.zone_id,
          }));
        setZones(rdata);
      } else {
        setZones([]);
      }
    } catch (error) {
      console.log('Error', error);
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      energy_company_id: (item && item?.energy_company_id) || '',
      name: (item && item?.regional_office_name) || '',
      address: (item && item?.address_1) || '',
      zone_id: (item && item?.zone_id) || '',
      status: (item && item?.status) || '',
      code: (item && item?.code) || '',
    },
    validationSchema: addROSchema,

    onSubmit: values => {
      handleSubmit(values);
    },
  });

  const handleSubmit = async values => {
    const reqBody = {
      energy_company_id: values?.energy_company_id,
      regional_office_name: values?.name,
      code: values?.code,
      zone_id: values?.zone_id,
      address_1: values?.address,
      regional_status: values.status,
    };

    if (item?.ro_id) {
      reqBody['regional_id'] = item?.ro_id;
    }

    try {
      setLoading(true);
      const res = item?.ro_id
        ? await dispatch(updateRegionalOfficeById(reqBody)).unwrap()
        : await dispatch(createRegionalOffice(reqBody)).unwrap();

      if (res?.status) {
        Toast.show({
          type: 'success',
          text1: res?.message,
          position: 'bottom',
        });
        setLoading(false);
        navigation.navigate('RegionalOfficeListScreen');
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
        headerTitle={
          item?.id ? 'update Regional Office' : 'Add Regional Office'
        }
      />

      <ScrollView>
        <View style={styles.inputContainer}>
          <View style={{rowGap: 8}}>
            <NeumorphicDropDownList
              title={'Energy Compnay Name'}
              required={true}
              placeholder={'SELECT ...'}
              data={energyCompany}
              value={formik?.values?.energy_company_id}
              renderItem={renderDropDown}
              onChange={val => {
                formik.setFieldValue(`energy_company_id`, val.value);
                setEnergyCompanyId(val?.value);
              }}
              errorMessage={formik?.errors?.energy_company_id}
            />

            <NeumorphicDropDownList
              title={'Zone'}
              required={true}
              placeholder={'SELECT ...'}
              data={zones || []}
              value={formik?.values?.zone_id}
              renderItem={renderDropDown}
              onChange={val => {
                formik.setFieldValue(`zone_id`, val.value);
              }}
              errorMessage={formik?.errors?.zone_id}
            />

            <NeumorphicTextInput
              required={true}
              title={'Regional Office Name'}
              placeHolderTxt={''}
              value={formik?.values?.name}
              onChangeText={formik.handleChange('name')}
              errorMessage={formik?.errors?.name}
            />

            <NeumorphicTextInput
              title={'Code'}
              required={true}
              placeHolderTxt={''}
              value={formik?.values?.code}
              onChangeText={formik.handleChange('code')}
              style={styles.inputText}
              errorMessage={formik.errors.code}
            />

            <NeumorphicTextInput
              title={'Address'}
              required={true}
              placeHolderTxt={''}
              value={formik?.values?.address}
              onChangeText={formik.handleChange('address')}
              style={styles.inputText}
              errorMessage={formik.errors.address}
            />

            <NeumorphicDropDownList
              placeholder={'SELECT ...'}
              data={[
                {
                  label: 'ACTIVE',
                  value: 1,
                },
                {
                  label: 'INACTIVE',
                  value: 0,
                },
              ]}
              value={formik?.values?.status}
              renderItem={renderDropDown}
              onChange={val => {
                formik.setFieldValue(`status`, val.value);
              }}
              title={'Status'}
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
              title={item ? 'update' : 'ADD'}
              titleColor={Colors().purple}
              onPress={() => {
                item ? setUpdateModalVisible(true) : formik.handleSubmit();
              }}
              loading={loading}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddUpdateRegionalOfficeScreen;

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
