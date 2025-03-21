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
import {addComplaintTypeSchema} from '../../../utils/FormSchema';
import NeumorphicButton from '../../../component/NeumorphicButton';
import NeumorphicDropDownList from '../../../component/DropDownList';
import {Icon} from '@rneui/base';
import Toast from 'react-native-toast-message';
import AlertModal from '../../../component/AlertModal';
import {allEnergyCompanyList} from '../../../redux/slices/energyCompany/company/getAllEnergyCompanySlice';
import {
  createComplaintType,
  updatComplaintTypeById,
} from '../../../redux/slices/complaintType/getAllComplaintTypeListSlice';
import {useIsFocused} from '@react-navigation/native';

const AddUpdateComplaintTypeScreen = ({navigation, route}) => {
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
      complaint_type_name: (item && item?.complaint_type_name) || '1',
    },
    validationSchema: addComplaintTypeSchema,

    onSubmit: values => {
      handleSubmit(values);
    },
  });

  const handleSubmit = async values => {
    const reqBody = {
      energy_company_id: values.energy_company_id,
      complaint_type_name: values.complaint_type_name,
    };

    if (item?.id) {
      reqBody['id'] = item?.id;
    }

    try {
      setLoading(true);
      const res = item?.id
        ? await dispatch(updatComplaintTypeById(reqBody)).unwrap()
        : await dispatch(createComplaintType(reqBody)).unwrap();

      if (res?.status) {
        Toast.show({
          type: 'success',
          text1: res?.message,
          position: 'bottom',
        });
        setLoading(false);
        navigation.navigate('ComplaintTypeListScreen');
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
        headerTitle={item?.id ? 'update Complaint Type' : 'Add Complaint Type'}
      />

      <ScrollView>
        <View style={styles.inputContainer}>
          <View style={{rowGap: 8}}>
            <NeumorphicDropDownList
              title={'Energy Company Name'}
              placeholder={'SELECT ...'}
              data={energyCompany}
              labelField={'label'}
              valueField={'value'}
              value={formik?.values?.energy_company_id}
              renderItem={renderDropDown}
              onChange={val => {
                formik.setFieldValue(`energy_company_id`, val.value);
              }}
            />
            {formik?.touched?.energy_company_id &&
              formik?.errors?.energy_company_id && (
                <Text style={styles.errorMesage}>
                  {formik?.errors?.energy_company_id}
                </Text>
              )}

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.title}>Complaint Type Name </Text>
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
              value={formik?.values?.complaint_type_name}
              onChangeText={formik.handleChange('complaint_type_name')}
              style={styles.inputText}
            />
          </View>
          {formik?.touched?.complaint_type_name &&
            formik?.errors?.complaint_type_name && (
              <Text style={styles.errorMesage}>
                {formik?.errors?.complaint_type_name}
              </Text>
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

export default AddUpdateComplaintTypeScreen;

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
