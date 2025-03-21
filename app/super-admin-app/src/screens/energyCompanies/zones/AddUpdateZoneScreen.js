import {StyleSheet, Text, View, SafeAreaView, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {useFormik} from 'formik';
import Colors from '../../../constants/Colors';
import CustomeHeader from '../../../component/CustomeHeader';
import IconType from '../../../constants/IconType';
import NeumorphicTextInput from '../../../component/NeumorphicTextInput';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import {addZoneSchema} from '../../../utils/FormSchema';
import NeumorphicButton from '../../../component/NeumorphicButton';
import NeumorphicDropDownList from '../../../component/DropDownList';
import {Icon} from '@rneui/base';
import Toast from 'react-native-toast-message';
import AlertModal from '../../../component/AlertModal';
import {allEnergyCompanyList} from '../../../redux/slices/energyCompany/company/getAllEnergyCompanySlice';
import {useIsFocused} from '@react-navigation/native';
import {
  createZone,
  updateZoneById,
} from '../../../redux/slices/energyCompany/zones/getAllZoneListSlice';

const AddUpdateZoneScreen = ({navigation, route}) => {
  /* declare props constant variale*/
  const dispatch = useDispatch();
  const item = route?.params?.item;
  const isFocused = useIsFocused();
  const [energyCompany, setEnergyCompany] = useState([]);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllENData();
  }, [isFocused]);

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

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      energy_company_id: (item && item?.energy_company_id) || '',
      name: (item && item?.zone_name) || '',
      description: (item && item?.zone_description) || '',
    },
    validationSchema: addZoneSchema,

    onSubmit: values => {
      handleSubmit(values);
    },
  });

  const handleSubmit = async values => {
    const reqBody = {
      energy_company_id: values?.energy_company_id,
      name: values?.name,
      description: values?.description,
      status: 1,
    };

    if (item?.zone_id) {
      reqBody['id'] = item?.zone_id;
    }

    try {
      setLoading(true);
      const res = item?.zone_id
        ? await dispatch(updateZoneById(reqBody)).unwrap()
        : await dispatch(createZone(reqBody)).unwrap();

      if (res?.status) {
        Toast.show({
          type: 'success',
          text1: res?.message,
          position: 'bottom',
        });
        setLoading(false);
        navigation.navigate('ZoneListScreen');
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
        backgroundColor: Colors().screenBackground,
      }}>
      <CustomeHeader headerTitle={item?.id ? 'update Zone' : 'Add Zone'} />

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
              }}
              errorMessage={formik?.errors?.energy_company_id}
            />

            <NeumorphicTextInput
              placeHolderTxt={''}
              required={true}
              value={formik?.values?.name}
              onChangeText={formik.handleChange('name')}
              style={styles.inputText}
              title={'Name'}
              errorMessage={formik.errors.name}
            />

            <NeumorphicTextInput
              title={'Description'}
              placeHolderTxt={''}
              value={formik?.values?.description}
              onChangeText={formik.handleChange('description')}
              style={styles.inputText}
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

          <View style={{alignSelf: 'center', marginVertical: 10}}>
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

export default AddUpdateZoneScreen;

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
