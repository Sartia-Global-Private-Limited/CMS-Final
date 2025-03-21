/*    ----------------Created Date :: 7- Feb -2024    ----------------- */
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  ToastAndroid,
  PermissionsAndroid,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import IconType from '../../../constants/IconType';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import Colors from '../../../constants/Colors';
import NeumorphicDropDownList from '../../../component/DropDownList';
import NeumorphicTextInput from '../../../component/NeumorphicTextInput';
import {useFormik} from 'formik';
import NeumorphicButton from '../../../component/NeumorphicButton';
import {useDispatch} from 'react-redux';
import {getAllRoles, getAllUsers} from '../../../redux/slices/commonApi';
import CustomeHeader from '../../../component/CustomeHeader';
import AlertModal from '../../../component/AlertModal';
import {addPromotionSchema} from '../../../utils/FormSchema';
import * as ImagePicker from 'react-native-image-picker';
import {getTeamList} from '../../../redux/slices/hr-management/teams/getTeamListSlice';
import ImageViewer from '../../../component/ImageViewer';
import {
  addPromotionDemotion,
  updatePromotionDemotion,
} from '../../../redux/slices/hr-management/promotion-demotion/addUpdatePromotionDemotionSlice';
import {getPromotionDemotionDetailById} from '../../../redux/slices/hr-management/promotion-demotion/getPromotionDemotionDetailSlice';
import {apiBaseUrl} from '../../../../config';

const AddUpdatePromotionDemotionScreen = ({navigation, route}) => {
  // const edit = route?.params?.editData;
  const edit_id = route?.params?.edit_id;
  const [allUser, setAllUser] = useState([]);
  const [allTeam, setAllTeam] = useState([]);
  const [allRoles, setAllRoles] = useState([]);
  const [edit, setEdit] = useState([]);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState(false);
  const [confirm, setConfrim] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    fetchAllUser();
    fetchAllRoles();
    fetchTeamData();
    requestCameraPermission();
    requestExternalWritePermission();
    if (edit_id) {
      fetchSingleData();
    }
  }, []);

  const purposeOption = [
    {value: 'promotion', label: 'Promotion'},
    {value: 'demotion', label: 'Demotion'},
  ];
  const CHANGE_IN_SALARY = [
    {value: 'hike', label: 'hike'},
    {value: 'deduction', label: 'deduction'},
  ];
  const VALUE_TYPE = [
    {value: 'percentage', label: 'percentage'},
    {value: 'amount', label: 'amount'},
  ];

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      user_id: edit?.user_id || '',
      purpose: edit?.purpose || '',
      new_team: edit?.new_team || '',
      change_in_salary_type: edit?.change_in_salary_type || '',
      change_in_salary: edit?.change_in_salary || '',
      new_designation: edit?.new_designation || '',
      reason: edit?.reason || '',
      change_in_salary_value: edit?.change_in_salary_value || '',
      document: edit?.document || null,
    },
    validationSchema: addPromotionSchema,
    onSubmit: (values, {resetForm}) => {
      handleSubmit(values, resetForm);
    },
  });

  const handleSubmit = async (values, resetForm) => {
    const formData = new FormData();

    formData.append('user_id', values.user_id);
    formData.append('purpose', values.purpose);
    formData.append('reason', values.reason);
    formData.append('new_designation', values.new_designation);
    formData.append('new_team', values.new_team);
    formData.append('change_in_salary', values.change_in_salary);
    formData.append('change_in_salary_type', values.change_in_salary_type);
    formData.append('change_in_salary_value', values.change_in_salary_value);
    formData.append('document', values.document);
    if (edit?.id) {
      formData.append('id', edit?.id);
    }

    if (edit?.id) {
      formData['id'] = edit.id;
    }

    try {
      if (edit_id) {
        setUpdateModalVisible(true);
        setConfrim(formData);
      } else {
        setLoading(true);
        const addResult = await dispatch(
          addPromotionDemotion(formData),
        ).unwrap();

        if (addResult?.status) {
          setLoading(false);
          ToastAndroid.show(addResult?.message, ToastAndroid.LONG);
          navigation.navigate('PromotionDemotionListScreen');
          resetForm();
        } else {
          ToastAndroid.show(addResult?.message, ToastAndroid.LONG);
          setLoading(false);
        }
        // resetForm();
      }
    } catch (error) {
      console.error('Error in creating promotion and demotioan:', error);
    }
  };

  requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          // {
          //   title: 'Camera permission is required',
          //   message: 'fsdkjkfsdkfj',
          // },
        );
        // If CAMERA Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        return false;
      }
    } else return true;
  };

  requestExternalWritePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {}
      return false;
    } else return true;
  };
  const selectPhotoTapped = async docType => {
    return Alert.alert('UPLOAD BILL IMAGE', '', [
      {
        text: 'cancel',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'upload From Library',
        onPress: () => PhotoTapped('library', docType),
      },
      {
        text: 'capture Photo',
        onPress: () => {
          PhotoTapped('camera', docType);
        },
      },
    ]);
  };

  const PhotoTapped = async (type, docType) => {
    if (type == 'camera') {
      if (true) {
        const options = {
          quality: 1.0,
          maxWidth: 500,
          maxHeight: 500,
          storageOptions: {
            skipBackup: true,
          },
          includeBase64: true,
        };

        ImagePicker.launchCamera(options, response => {
          if (response.didCancel) {
          } else if (response.error) {
          } else if (response.customButton) {
          } else {
            let source = {
              type: 'application/png',
              uri: response.assets[0].uri,
            };
            sendImageFunc(response, 'img', docType);
          }
        });
      }
    } else if (type == 'library') {
      const options = {
        quality: 1.0,
        maxWidth: 500,
        maxHeight: 500,
        storageOptions: {
          skipBackup: true,
        },
        includeBase64: true,
      };

      ImagePicker.launchImageLibrary(options, response => {
        if (response.didCancel) {
        } else if (response.error) {
        } else if (response.customButton) {
        } else {
          if (response.assets[0].fileSize < 800000) {
            sendImageFunc(response, 'img', docType);
          } else {
            Alert.alert('Maximum size ', 'Only 800 KB file size is allowed ', [
              {text: 'OK', onPress: () => console.log('OK Pressed')},
            ]);
          }
        }
      });
    } else if (type == 'pdf') {
      try {
        const response = await DocumentPicker.pick({
          presentationStyle: '',
          type: [types.pdf],
          copyTo: 'cachesDirectory',
        });

        if (response[0].size < 800000) {
          this.sendImageFunc(response, 'pdf');
        } else {
          Alert.alert('Maximum size ', 'Only 800 KB file size is allowed ', [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ]);
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };
  const sendImageFunc = async (imageresponse, type, docType) => {
    const imageFormData = {
      uri: imageresponse.assets[0].uri,
      name: imageresponse.assets[0].fileName,
      type: imageresponse.assets[0].type,
    };

    switch (docType) {
      case 'document':
        formik.setFieldValue(`document`, imageFormData);
        break;

      default:
        break;
    }
  };

  /*function for fetching all user data*/
  const fetchAllUser = async () => {
    try {
      const result = await dispatch(getAllUsers()).unwrap();

      if (result.status) {
        const rData = result?.data?.map(itm => ({
          label: itm?.name,
          value: itm?.id,
        }));
        setAllUser(rData);
      } else {
        ToastAndroid.show(result?.message, ToastAndroid.LONG);
        setAllUser([]);
      }
    } catch (error) {
      ToastAndroid.show(error, ToastAndroid.LONG);
      setAllUser([]);
    }
  };

  /*function for fetching team data*/
  const fetchTeamData = async () => {
    try {
      const result = await dispatch(getTeamList({search: ''})).unwrap();

      if (result.status) {
        const rData = result?.data?.map(itm => ({
          label: itm?.team_name,
          value: itm?.team_id,
        }));

        setAllTeam(rData);
      } else {
        ToastAndroid.show(result?.message, ToastAndroid.LONG);
        setAllTeam([]);
      }
    } catch (error) {
      ToastAndroid.show(error, ToastAndroid.LONG);
      setAllTeam([]);
    }
  };

  /*function for fetching all roles data*/
  const fetchAllRoles = async () => {
    try {
      const result = await dispatch(getAllRoles()).unwrap();

      if (result.status) {
        const rData = result?.data?.map(itm => ({
          label: itm?.name,
          value: itm?.id,
        }));
        setAllRoles(rData);
      } else {
        ToastAndroid.show(result?.message, ToastAndroid.LONG);
        setAllRoles([]);
      }
    } catch (error) {
      ToastAndroid.show(error, ToastAndroid.LONG);
      setAllRoles([]);
    }
  };

  /*function for fetching single detail of promotion and demotion*/
  const fetchSingleData = async () => {
    try {
      const result = await dispatch(
        getPromotionDemotionDetailById(edit_id),
      ).unwrap();

      if (result.status) {
        setEdit(result?.data);
      } else {
        ToastAndroid.show(result?.message, ToastAndroid.LONG);
        setEdit([]);
      }
    } catch (error) {
      ToastAndroid.show(error, ToastAndroid.LONG);
      setEdit([]);
    }
  };

  /*function for updating of Loan*/
  const updatefunction = async reqBody => {
    setLoading(true);

    const updateResult = await dispatch(
      updatePromotionDemotion(reqBody),
    ).unwrap();

    if (updateResult?.status) {
      setLoading(false);
      setUpdateModalVisible(false);
      ToastAndroid.show(updateResult?.message, ToastAndroid.LONG);
      navigation.navigate('PromotionDemotionListScreen');
    } else {
      ToastAndroid.show(updateResult?.message, ToastAndroid.LONG);
      setLoading(false);
      setUpdateModalVisible(false);
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
      <CustomeHeader headerTitle={edit_id ? 'update P & D' : 'Add P & D'} />
      <ScrollView>
        <View style={styles.inpuntContainer}>
          <View style={{rowGap: 2}}>
            <Text style={styles.title}>User name</Text>
            <NeumorphicDropDownList
              placeholder={'SELECT ...'}
              data={allUser}
              labelField={'label'}
              valueField={'value'}
              value={formik?.values?.user_id}
              renderItem={renderDropDown}
              onChange={val => {
                formik.setFieldValue(`user_id`, val.value);
              }}
            />
          </View>
          {formik?.touched?.user_id && formik?.errors?.user_id && (
            <Text style={styles.errorMesage}>{formik?.errors?.user_id}</Text>
          )}

          <View style={{rowGap: 2}}>
            <Text style={styles.title}>Purpose</Text>
            <NeumorphicDropDownList
              placeholder={'SELECT ...'}
              data={purposeOption}
              labelField={'label'}
              valueField={'value'}
              value={formik?.values?.purpose}
              renderItem={renderDropDown}
              onChange={val => {
                formik.setFieldValue(`purpose`, val.value);
              }}
            />
          </View>
          {formik?.touched?.purpose && formik?.errors?.purpose && (
            <Text style={styles.errorMesage}>{formik?.errors?.purpose}</Text>
          )}

          <View style={{rowGap: 2}}>
            <Text style={styles.title}>reason</Text>
            <NeumorphicTextInput
              height={WINDOW_HEIGHT * 0.07}
              placeholder={'TYPE...'}
              style={styles.inputText}
              value={formik?.values?.reason}
              // keyboardType="number-pad"
              multiline
              onChangeText={formik.handleChange(`reason`)}
            />
          </View>
          {formik?.touched?.reason && formik?.errors?.reason && (
            <Text style={styles.errorMesage}>{formik?.errors?.reason}</Text>
          )}

          <View style={{rowGap: 2}}>
            <Text style={styles.title}>New designation</Text>
            <NeumorphicDropDownList
              placeholder={'SELECT ...'}
              data={allRoles}
              labelField={'label'}
              valueField={'value'}
              value={formik?.values?.new_designation}
              renderItem={renderDropDown}
              onChange={val => {
                formik.setFieldValue(`new_designation`, val.value);
              }}
            />
          </View>
          {formik?.touched?.new_designation &&
            formik?.errors?.new_designation && (
              <Text style={styles.errorMesage}>
                {formik?.errors?.new_designation}
              </Text>
            )}

          <View style={{rowGap: 2}}>
            <Text style={styles.title}>New team (OPTIONAL)</Text>
            <NeumorphicDropDownList
              placeholder={'SELECT ...'}
              data={allTeam}
              labelField={'label'}
              valueField={'value'}
              value={formik?.values?.new_team}
              renderItem={renderDropDown}
              onChange={val => {
                formik.setFieldValue(`new_team`, val.value);
              }}
            />
          </View>
          {formik?.touched?.new_team && formik?.errors?.new_team && (
            <Text style={styles.errorMesage}>{formik?.errors?.new_team}</Text>
          )}

          <View style={{rowGap: 2}}>
            <Text style={styles.title}>CHANGES IN SALARY (BASIC)</Text>
            <NeumorphicDropDownList
              placeholder={'SELECT ...'}
              data={CHANGE_IN_SALARY}
              labelField={'label'}
              valueField={'value'}
              value={formik?.values?.change_in_salary}
              renderItem={renderDropDown}
              onChange={val => {
                formik.setFieldValue(`change_in_salary`, val.value);
              }}
            />
          </View>
          {formik?.touched?.change_in_salary &&
            formik?.errors?.change_in_salary && (
              <Text style={styles.errorMesage}>
                {formik?.errors?.change_in_salary}
              </Text>
            )}

          <View style={{rowGap: 2}}>
            <Text style={styles.title}>PERCENTAGE/AMOUNT</Text>
            <NeumorphicDropDownList
              placeholder={'SELECT ...'}
              data={VALUE_TYPE}
              labelField={'label'}
              valueField={'value'}
              value={formik?.values?.change_in_salary_type}
              renderItem={renderDropDown}
              onChange={val => {
                formik.setFieldValue(`change_in_salary_type`, val.value);
              }}
            />
          </View>
          {formik?.touched?.change_in_salary_type &&
            formik?.errors?.change_in_salary_type && (
              <Text style={styles.errorMesage}>
                {formik?.errors?.change_in_salary_type}
              </Text>
            )}

          <View style={{rowGap: 2}}>
            <Text style={styles.title}>VALUE</Text>
            <NeumorphicTextInput
              placeholder={'TYPE...'}
              style={styles.inputText}
              value={formik?.values?.change_in_salary_value}
              keyboardType="numeric"
              onChangeText={formik.handleChange(`change_in_salary_value`)}
            />
          </View>
          {formik?.touched?.change_in_salary_value &&
            formik?.errors?.change_in_salary_value && (
              <Text style={styles.errorMesage}>
                {formik?.errors?.change_in_salary_value}
              </Text>
            )}

          {formik?.values?.document && (
            <TouchableOpacity
              onPress={() => {
                setImageModalVisible(true),
                  setImageUri(
                    edit_id && !formik?.values?.document.uri
                      ? `${apiBaseUrl}${formik?.values?.document}`
                      : formik?.values?.document.uri,
                  );
              }}>
              <Image
                source={{
                  uri:
                    edit_id && !formik?.values?.document.uri
                      ? `${apiBaseUrl}${formik?.values?.document}`
                      : formik?.values?.document.uri,
                }}
                style={styles.Image}
              />
            </TouchableOpacity>
          )}

          <View style={styles.btnView}>
            <NeumorphicButton
              title={' DOCUMENTS'}
              titleColor={Colors().pending}
              btnHeight={WINDOW_HEIGHT * 0.05}
              onPress={() => selectPhotoTapped('document')}
              btnRadius={2}
              iconName={'upload'}
              iconType={IconType.Feather}
              iconColor={Colors().black2}
              loading={loading}
            />

            {formik?.touched?.document && formik?.errors?.document && (
              <Text style={styles.errorMesage}>{formik?.errors?.document}</Text>
            )}
          </View>

          <View style={{alignSelf: 'center', marginVertical: 10}}>
            <NeumorphicButton
              title={edit_id ? 'update' : 'ADD'}
              titleColor={Colors().purple}
              onPress={formik.handleSubmit}
              loading={loading}
            />
          </View>
          {/*view for modal of upate */}

          {imageModalVisible && (
            <ImageViewer
              visible={imageModalVisible}
              imageUri={imageUri}
              cancelBtnPress={() => setImageModalVisible(!imageModalVisible)}
            />
          )}

          {updateModalVisible && (
            <AlertModal
              visible={updateModalVisible}
              iconName={'clock-edit-outline'}
              icontype={IconType.MaterialCommunityIcons}
              iconColor={Colors().aprroved}
              textToShow={'ARE YOU SURE YOU WANT TO UPDATE THIS!!'}
              cancelBtnPress={() => setUpdateModalVisible(!updateModalVisible)}
              ConfirmBtnPress={() => updatefunction(confirm)}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddUpdatePromotionDemotionScreen;

const styles = StyleSheet.create({
  inpuntContainer: {
    rowGap: 10,
    margin: WINDOW_WIDTH * 0.05,
  },
  errorMesage: {
    color: Colors().red,
    alignSelf: 'flex-start',
    marginLeft: 15,
    fontSize: 12,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  listView: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 8,
  },
  title: {
    fontSize: 12,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    color: Colors().pureBlack,
  },
  inputText: {
    color: Colors().pureBlack,
    fontSize: 12,
    fontWeight: '300',
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  dropdown: {
    marginLeft: 10,
  },
  placeholderStyle: {
    fontSize: 16,
    marginLeft: 10,
    paddingVertical: 10,
  },
  selectedTextStyle: {
    fontSize: 14,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  btnView: {
    alignSelf: 'center',
    marginTop: WINDOW_HEIGHT * 0.01,
  },
  Image: {
    height: 40,
    width: WINDOW_WIDTH * 0.9,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: Colors().gray,
  },
});
