import {StyleSheet, Text, View, SafeAreaView, ScrollView} from 'react-native';
import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {useFormik} from 'formik';
import Colors from '../../constants/Colors';
import CustomeHeader from '../../component/CustomeHeader';
import IconType from '../../constants/IconType';
import NeumorphicTextInput from '../../component/NeumorphicTextInput';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../utils/ScreenLayout';
import {addComplaintTypeSchema, addRolesSchema} from '../../utils/FormSchema';
import NeumorphicButton from '../../component/NeumorphicButton';
import {Icon} from '@rneui/base';
import Toast from 'react-native-toast-message';
import AlertModal from '../../component/AlertModal';
import {
  createComplaintType,
  updatComplaintTypeById,
} from '../../redux/slices/complaintType/getAllComplaintTypeListSlice';
import {updateRolesById} from '../../redux/slices/allRolesSlice';

const AddUpdateRoleScreen = ({navigation, route}) => {
  /* declare props constant variale*/
  const dispatch = useDispatch();
  const item = route?.params?.item;
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      energy_company_id: (item && item?.energy_company_id) || '',
      name: (item && item?.name) || '1',
    },
    validationSchema: addRolesSchema,

    onSubmit: values => {
      handleSubmit(values);
    },
  });

  const handleSubmit = async values => {
    const reqBody = {
      name: values.name,
    };

    if (item?.id) {
      reqBody['role_id'] = item?.id;
    }

    try {
      setLoading(true);
      const res = item?.id
        ? await dispatch(updateRolesById(reqBody)).unwrap()
        : await dispatch(createRole(reqBody)).unwrap();

      if (res?.status) {
        Toast.show({
          type: 'success',
          text1: res?.message,
          position: 'bottom',
        });
        setLoading(false);
        navigation.navigate('AllRolesScreen');
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
        // height: WINDOW_HEIGHT,
        backgroundColor: Colors().screenBackground,
      }}>
      <CustomeHeader headerTitle={item?.id ? 'update Roles' : 'Add Roles'} />

      <ScrollView>
        <View style={styles.inputContainer}>
          <View style={{rowGap: 8}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.title}>Name </Text>
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
              value={formik?.values?.name}
              onChangeText={formik.handleChange('name')}
              style={styles.inputText}
            />
          </View>
          {formik?.touched?.name && formik?.errors?.name && (
            <Text style={styles.errorMesage}>{formik?.errors?.name}</Text>
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

export default AddUpdateRoleScreen;

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
