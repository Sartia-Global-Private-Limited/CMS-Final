import {StyleSheet, Text, View, SafeAreaView, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {useFormik} from 'formik';
import Colors from '../../../constants/Colors';
import CustomeHeader from '../../../component/CustomeHeader';
import IconType from '../../../constants/IconType';
import NeumorphicTextInput from '../../../component/NeumorphicTextInput';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import {addDistrictSchema} from '../../../utils/FormSchema';
import NeumorphicButton from '../../../component/NeumorphicButton';
import NeumorphicDropDownList from '../../../component/DropDownList';
import {Icon} from '@rneui/base';
import Toast from 'react-native-toast-message';
import AlertModal from '../../../component/AlertModal';
import {allEnergyCompanyList} from '../../../redux/slices/energyCompany/company/getAllEnergyCompanySlice';
import {useIsFocused} from '@react-navigation/native';
import {getAdminEnergyCompanyassignZone} from '../../../services/authApi';
import {
  getAllRegionalOfficeByZoneId,
  getSalesRAOnRoId,
} from '../../../redux/slices/commonApi';
import {
  createDistrict,
  updateDistrictById,
} from '../../../redux/slices/energyCompany/districts/getAllDistrictListSlice';

const AddUpdateDistrictScreen = ({navigation, route}) => {
  /* declare props constant variale*/
  const dispatch = useDispatch();
  const item = route?.params?.item;
  const isFocused = useIsFocused();
  const [energyCompany, setEnergyCompany] = useState([]);
  const [allRO, setAllRO] = useState([]);
  const [allSalesArea, setAllSalesArea] = useState([]);
  const [energyCompanyId, setEnergyCompanyId] = useState('');
  const [zoneId, setZoneId] = useState('');
  const [roId, setRoId] = useState('');
  const [zones, setZones] = useState([]);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllENData();
  }, [isFocused]);

  useEffect(() => {
    if (item?.energy_company_id) {
      getAllZones(item?.energy_company_id);
    }
    if (item?.zone_id) {
      getAllRO(item?.zone_id);
    }
    if (item?.ro_id) {
      getAllSalesArea(item?.ro_id);
    }
  }, [item]);

  useEffect(() => {
    if (energyCompanyId != '') {
      getAllZones(energyCompanyId);
    }
  }, [energyCompanyId]);

  useEffect(() => {
    if (zoneId != '') {
      getAllRO(zoneId);
    }
  }, [zoneId]);

  useEffect(() => {
    if (roId != '') {
      getAllSalesArea(roId);
    }
  }, [roId]);

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
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });
    }
  };

  const getAllRO = async id => {
    try {
      const res = await dispatch(getAllRegionalOfficeByZoneId(id)).unwrap();
      if (res.status) {
        const rdata =
          res &&
          res?.data?.map(i => ({
            label: i?.regional_office_name,
            value: i?.ro_id,
          }));
        setAllRO(rdata);
      } else {
        setAllRO([]);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });
    }
  };

  const getAllSalesArea = async id => {
    try {
      const res = await dispatch(getSalesRAOnRoId(id)).unwrap();
      if (res.status) {
        const rdata =
          res &&
          res?.data?.map(i => ({
            label: i?.sales_area_name,
            value: i?.id,
          }));
        setAllSalesArea(rdata);
      } else {
        setAllSalesArea([]);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      energy_company_id: (item && item?.energy_company_id) || '',
      zone_id: (item && item?.zone_id) || '',
      regional_office_id: (item && item?.ro_id) || '',
      name: (item && item?.district_name) || '',
      status: (item && item?.status) || '',
      sales_area_id: (item && item?.sale_area_id) || '',
    },
    validationSchema: addDistrictSchema,

    onSubmit: values => {
      handleSubmit(values);
    },
  });

  const handleSubmit = async values => {
    const reqBody = {
      energy_company_id: values?.energy_company_id,
      district_name: values?.name,
      zone_id: values?.zone_id,
      status: values.status,
      regional_office_id: values?.regional_office_id,
      sales_area_id: values.sales_area_id,
    };

    if (item?.id) {
      reqBody['district_id'] = item?.id;
    }

    try {
      setLoading(true);
      const res = item?.id
        ? await dispatch(updateDistrictById(reqBody)).unwrap()
        : await dispatch(createDistrict(reqBody)).unwrap();

      if (res?.status) {
        Toast.show({
          type: 'success',
          text1: res?.message,
          position: 'bottom',
        });
        setLoading(false);
        navigation.navigate('DistrictListScreen');
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
        headerTitle={item?.id ? 'update District' : 'Add District'}
      />

      <ScrollView>
        <View style={styles.inputContainer}>
          <View style={{rowGap: 8}}>
            <NeumorphicDropDownList
              title={'Energy Company Name'}
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
              placeholder={'SELECT ...'}
              data={zones || []}
              required={true}
              value={formik?.values?.zone_id}
              renderItem={renderDropDown}
              onChange={val => {
                formik.setFieldValue(`zone_id`, val.value);
                setZoneId(val.value);
              }}
              errorMessage={formik?.errors?.zone_id}
            />

            <NeumorphicDropDownList
              title={'Regional Office'}
              placeholder={'SELECT ...'}
              data={allRO || []}
              required={true}
              value={formik?.values?.regional_office_id}
              renderItem={renderDropDown}
              errorMessage={formik?.errors?.regional_office_id}
              onChange={val => {
                formik.setFieldValue(`regional_office_id`, val.value);
              }}
            />

            <NeumorphicDropDownList
              title={'Sales Area'}
              placeholder={'SELECT ...'}
              data={allSalesArea || []}
              value={formik?.values?.sales_area_id}
              required={true}
              renderItem={renderDropDown}
              onChange={val => {
                formik.setFieldValue(`sales_area_id`, val.value);
              }}
              errorMessage={formik?.errors?.sales_area_id}
            />

            <NeumorphicTextInput
              title={'District Name'}
              placeHolderTxt={''}
              errorMessage={formik?.errors?.name}
              value={formik?.values?.name}
              onChangeText={formik.handleChange('name')}
              style={styles.inputText}
            />

            <NeumorphicDropDownList
              title={'Status'}
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

export default AddUpdateDistrictScreen;

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
