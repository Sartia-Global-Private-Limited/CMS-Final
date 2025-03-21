import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import CustomeHeader from '../../../component/CustomeHeader';
import IconType from '../../../constants/IconType';
import Colors from '../../../constants/Colors';
import AlertModal from '../../../component/AlertModal';
import NeumorphicButton from '../../../component/NeumorphicButton';
import * as ImagePicker from 'react-native-image-picker';
import NeumorphicTextInput from '../../../component/NeumorphicTextInput';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import {useFormik} from 'formik';
import {Icon} from '@rneui/themed';
import {addBankDataSchema} from '../../../utils/FormSchema';
import Toast from 'react-native-toast-message';
import {TouchableOpacity} from 'react-native';
import {Image} from 'react-native';
import ImageViewer from '../../../component/ImageViewer';
import {apiBaseUrl} from '../../../../config';
import {
  addBankDetail,
  updateBankDetail,
} from '../../../redux/slices/master-data-management/bank-mangement/addUpdateBankSlice';
import {getBankDetailById} from '../../../redux/slices/master-data-management/bank-mangement/getBankDetailSlice';

const AddUpdateBankScreen = ({navigation, route}) => {
  const edit_id = route?.params?.edit_id;
  const [edit, setEdit] = useState([]);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    requestCameraPermission();
    requestExternalWritePermission();

    if (edit_id) {
      fetchSingleData();
    }
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      bank_name: edit?.bank_name || '',
      website: edit?.website || '',
      logo: edit?.logo || null,
    },
    validationSchema: addBankDataSchema,
    onSubmit: (values, {resetForm}) => {
      handleSubmit(values, resetForm);
    },
  });

  const handleSubmit = async (values, resetForm) => {
    const formdata = new FormData();
    formdata.append('bank_name', values.bank_name);
    formdata.append('website', values.website);
    formdata.append('logo', values.logo);

    if (edit_id) {
      formdata.append('id', edit_id);
    }

    try {
      setLoading(true);
      const res = edit_id
        ? await dispatch(updateBankDetail(formdata)).unwrap()
        : await dispatch(addBankDetail(formdata)).unwrap();

      if (res.status) {
        setLoading(false);
        navigation.navigate('BankListScreen');
        Toast.show({
          type: 'success',
          text1: res?.message,
          position: 'bottom',
        });
        resetForm();
      } else {
        setLoading(false);
        Toast.show({
          type: 'error',
          text1: res?.message,
          position: 'bottom',
        });
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const fetchSingleData = async () => {
    const res = await dispatch(getBankDetailById(edit_id)).unwrap();
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit({});
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
          // {
          //   title:
          //     this.props.ConstantReducer.grievance[
          //       this.props.ConstantReducer.globalLanguage
          //     ].externalPermission,
          //   message:
          //     this.props.ConstantReducer.grievance[
          //       this.props.ConstantReducer.globalLanguage
          //     ].externalPermissionMsg,
          // },
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        // alert('Write permission err', err);
      }
      return false;
    } else return true;
  };
  const selectPhotoTapped = async (docType, index) => {
    // let isCameraPermitted = await this.requestCameraPermission();
    // let isStoragePermitted = await this.requestExternalWritePermission();
    // this.setState({
    //   isCameraPermitted: isCameraPermitted,
    //   isStoragePermitted: isStoragePermitted,
    // });
    return Alert.alert(
      // the title of the alert dialog
      'UPLOAD BILL IMAGE',
      // the message you want to show up
      '',
      [
        {
          text: 'cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'upload From Library',
          onPress: () => PhotoTapped('library', docType, index),
        },
        {
          text: 'capture Photo',
          onPress: () => {
            PhotoTapped('camera', docType, index);
          },
        },
      ],
    );
  };

  const PhotoTapped = async (type, docType, index) => {
    if (type == 'camera') {
      if (true) {
        const options = {
          quality: 1.0,
          maxWidth: 500,
          maxHeight: 500,

          storageOptions: {
            skipBackup: true,
          },
          includeBase64: false,
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
            sendImageFunc(response, 'img', docType, index);
          }
        });
      }
    } else if (type == 'library') {
      const options = {
        quality: 1.0,
        maxWidth: 500,
        maxHeight: 500,
        // selectionLimit: 10,
        storageOptions: {
          skipBackup: true,
        },
        includeBase64: false,
      };

      ImagePicker.launchImageLibrary(options, response => {
        if (response.didCancel) {
        } else if (response.error) {
        } else if (response.customButton) {
        } else {
          if (response.assets[0].fileSize < 80000) {
            sendImageFunc(response, 'img', docType, index);
          } else {
            Alert.alert(
              'Maximum size ',
              'Only 800 KB file size is allowed ',
              [],
            );
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
          Alert.alert('Maximum size ', 'Only 800 KB file size is allowed ', []);
        }
      } catch (err) {}
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
        formik.setFieldValue(`logo`, imageFormData);

        break;

      default:
        break;
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors().screenBackground,
      }}>
      <CustomeHeader headerTitle={edit_id ? 'update' : 'add'} />

      <ScrollView>
        <View style={styles.inpuntContainer}>
          <NeumorphicTextInput
            title={'Bank name'}
            required={true}
            width={WINDOW_WIDTH * 0.9}
            placeholder={'TYPE...'}
            style={styles.inputText}
            value={formik?.values?.bank_name}
            onChangeText={formik.handleChange(`bank_name`)}
          />
          {formik?.touched?.bank_name && formik?.errors?.bank_name && (
            <Text style={styles.errorMesage}>{formik?.errors?.bank_name}</Text>
          )}

          <NeumorphicTextInput
            title={'Website'}
            required={true}
            width={WINDOW_WIDTH * 0.9}
            placeholder={'TYPE...'}
            style={styles.inputText}
            value={formik?.values?.website}
            onChangeText={formik.handleChange(`website`)}
          />
          {formik?.touched?.website && formik?.errors?.website && (
            <Text style={styles.errorMesage}>{formik?.errors?.website}</Text>
          )}

          {formik?.values?.logo && (
            <View style={{flexDirection: 'row'}}>
              <View style={[styles.userNameView, {columnGap: 10}]}>
                <TouchableOpacity
                  onPress={() => {
                    setImageModalVisible(true);
                    setImageUri(
                      edit_id
                        ? `${apiBaseUrl}${formik?.values?.logo}`
                        : `${formik?.values?.logo?.uri}`,
                    );
                  }}>
                  <Image
                    source={{
                      uri:
                        edit_id && !formik?.values?.logo.uri
                          ? `${apiBaseUrl}${formik?.values?.logo}`
                          : `${formik?.values?.logo?.uri}`,
                    }}
                    style={[styles.Image, {marginTop: 10}]}
                  />

                  <View style={styles.crossIcon}>
                    <Icon
                      name="close"
                      type={IconType.AntDesign}
                      color={Colors().pureBlack}
                      size={15}
                      onPress={() => formik.setFieldValue('logo', '')}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        <View style={styles.btnView}>
          <NeumorphicButton
            // disabled={type === 'view'}
            title={'Document'}
            titleColor={Colors().pending}
            btnHeight={WINDOW_HEIGHT * 0.05}
            onPress={() => selectPhotoTapped('document')}
            btnRadius={2}
            iconName={'upload'}
            iconType={IconType.Feather}
            iconColor={Colors().black2}
          />
          {formik?.touched?.logo && formik?.errors?.logo && (
            <Text style={[styles.errorMesage, {marginVertical: 10}]}>
              {formik?.errors?.logo}
            </Text>
          )}
        </View>

        <View style={{alignSelf: 'center', marginVertical: 10}}>
          <NeumorphicButton
            title={edit_id ? 'update' : 'ADD'}
            titleColor={Colors().purple}
            onPress={() => {
              edit_id ? setUpdateModalVisible(true) : formik.handleSubmit();
            }}
            loading={loading}
          />
        </View>

        {/*view for modal of upate */}
        {imageModalVisible && (
          <ImageViewer
            visible={imageModalVisible}
            imageUri={imageUri}
            cancelBtnPress={() => setImageModalVisible(!imageModalVisible)}
            // downloadBtnPress={item => downloadImageRemote(item)}
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
            ConfirmBtnPress={() => formik.handleSubmit()}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddUpdateBankScreen;

const styles = StyleSheet.create({
  inpuntContainer: {
    rowGap: 6,
    margin: WINDOW_WIDTH * 0.05,
  },

  errorMesage: {
    color: 'red',
    // marginTop: 5,
    alignSelf: 'flex-start',
    marginLeft: 15,
    fontFamily: Colors().fontFamilyBookMan,
    textTransform: 'uppercase',
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

  btnView: {
    alignSelf: 'center',
    // marginTop: WINDOW_HEIGHT * 0.01,
    // marginBottom: WINDOW_HEIGHT * 0.01,
  },
  Image: {
    height: WINDOW_HEIGHT * 0.07,
    width: WINDOW_WIDTH * 0.2,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: Colors().gray,
  },
  userNameView: {flex: 1, flexDirection: 'row', flexWrap: 'wrap'},
  crossIcon: {
    backgroundColor: Colors().red,
    borderRadius: 50,
    padding: '1%',
    position: 'absolute',
    right: -2,
    top: 5,
    zIndex: 1,
    justifyContent: 'center',
  },
});
