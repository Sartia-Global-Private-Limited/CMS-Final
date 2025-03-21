/*    ----------------Created Date :: 4 -March -2024   ----------------- */

import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CustomeHeader from '../../component/CustomeHeader';
import IconType from '../../constants/IconType';
import Colors from '../../constants/Colors';
import AlertModal from '../../component/AlertModal';
import NeumorphicButton from '../../component/NeumorphicButton';
import * as ImagePicker from 'react-native-image-picker';
import DocumentPicker, { types } from 'react-native-document-picker';
import NeumorphicTextInput from '../../component/NeumorphicTextInput';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../utils/ScreenLayout';
import { useFormik } from 'formik';
import { Icon } from '@rneui/themed';
import { addTutorialsSchema } from '../../utils/FormSchema';
import Toast from 'react-native-toast-message';
import NeumorphicDropDownList from '../../component/DropDownList';
import { getAllModule, getAllRoles } from '../../redux/slices/commonApi';
import { TouchableOpacity } from 'react-native';
import ImageViewer from '../../component/ImageViewer';
import { selectUser } from '../../redux/slices/authSlice';

import {
  addTutorial,
  updateTutorial,
} from '../../redux/slices/tutorials/addUpdateTutorialSlice';
import { getTutorialDetailById } from '../../redux/slices/tutorials/getTutorialDetailSlice';
import { Image } from 'react-native';
import { apiBaseUrl } from '../../../config';

const AddUpdateTutorialScreen = ({ navigation, route }) => {
  const edit_id = route?.params?.edit_id;
  const [edit, setEdit] = useState([]);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [allModule, setAllModule] = useState([]);
  const [allRoles, setAllRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState(false);
  const [docType, setDocType] = useState();
  const dispatch = useDispatch();
  const { user } = useSelector(selectUser);

  useEffect(() => {
    requestCameraPermission();
    requestExternalWritePermission();
    fetchAllModuleList();
    fetchAllRolesList();
    if (edit_id) {
      fetchSingleData();
    }
  }, []);

  const formik = useFormik({
    enableReinitialize: 'true',
    initialValues: {
      user_type: edit[0]?.user_type || '',
      application_type: edit[0]?.application_type || '',
      module_type: edit[0]?.module_type || '',
      tutorial_format: edit[0]?.tutorial_format || '',
      attachment: edit[0]?.attachment || null,
      description: edit[0]?.description || '',
    },
    validationSchema: addTutorialsSchema,
    onSubmit: (values, { resetForm }) => {
      handleSubmit(values, resetForm);
    },
  });

  const handleSubmit = async (values, resetForm) => {
    const formdata = new FormData();
    formdata.append('user_type', values.user_type);
    formdata.append('application_type', values.application_type);
    formdata.append('module_type', values.module_type);
    formdata.append('tutorial_format', values.tutorial_format);
    formdata.append('attachment', values.attachment);
    formdata.append('description', values.description);

    if (edit_id) {
      formdata.append('id', edit_id);
    }

    try {
      setLoading(true);
      const res = edit_id
        ? await dispatch(updateTutorial(formdata)).unwrap()
        : await dispatch(addTutorial(formdata)).unwrap();

      if (res.status) {
        setLoading(false);
        navigation.navigate('TutorialTopTab');
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

  const APPLICATION_TYPE = [
    { label: 'Mobile', value: 'mobile' },
    { label: 'Web', value: 'web' },
  ];

  const FORMAT = [
    { label: 'video', value: 'video' },
    { label: 'audio', value: 'audio' },
    { label: 'text', value: 'text' },
    { label: 'pdf', value: 'pdf' },
    { label: 'image', value: 'image' },
  ];

  const fetchSingleData = async () => {
    const res = await dispatch(getTutorialDetailById(edit_id)).unwrap();

    if (res?.status) {
      setEdit(res?.data);
    } else {
      setEdit({});
    }
  };

  /* fetch Document category list  */
  const fetchAllModuleList = async () => {
    const res = await dispatch(getAllModule()).unwrap();

    if (res?.status === true) {
      const rData = res?.data.map(item => {
        return {
          value: item?.title,
          label: item?.title,
        };
      });
      setAllModule(rData);
    } else {
      setAllModule([]);
    }
  };
  /* fetch all role list  */
  const fetchAllRolesList = async () => {
    const res = await dispatch(getAllRoles()).unwrap();
    // if (edit) {
    //   setAllUser([]);
    // }

    if (res?.status === true) {
      const rData = res?.data.map(item => {
        return {
          value: item?.id,
          label: item?.name,
        };
      });
      setAllRoles(rData);
    } else {
      setAllRoles([]);
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
      'UPLOAD Document',
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
      if (docType === 'image') {
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
              Alert.alert(
                'Maximum size ',
                'Only 800 KB file size is allowed ',
                [{ text: 'OK', onPress: () => {} }],
              );
            }
          }
        });
      } else {
        try {
          const response = await DocumentPicker.pick({
            presentationStyle: '',
            type: [docType],
            copyTo: 'cachesDirectory',
          });

          if (response[0].size < 800000000000000) {
            sendImageFunc(response, 'documet');
          } else {
            Alert.alert(
              'Maximum size ',
              'Only 800 KB file size is allowed ',
              [],
            );
          }
        } catch (err) {}
      }
    }
  };

  const sendImageFunc = async (imageresponse, type) => {
    // const rData = imageresponse.assets.map((item, index) => {
    //   return {
    //     uri: item.uri,
    //     name: item.fileName,
    //     type: item.type,
    //   };
    // });
    // const imageData = imageresponse.assets[0].uri;
    // const imageData = imageresponse.assets[0].base64;
    // const imageData = `data:${imageresponse.assets[0].type};base64,${imageresponse.assets[0].base64}`;
    // const imageFormData = new FormData();
    // imageFormData.append('userId', this.props.userId);
    // imageFormData.append('type', 'complaint');
    // if (type === 'img') {
    //   imageFormData.append('image', {
    //     uri: imageresponse.assets[0].uri,
    //     name: imageresponse.assets[0].fileName,
    //     type: imageresponse.assets[0].type,
    //   });

    if (type == 'img') {
      const imageFormData = {
        uri: imageresponse.assets[0].uri,
        name: imageresponse.assets[0].fileName,
        type: imageresponse.assets[0].type,
      };
      formik.setFieldValue(`attachment`, imageFormData);
    } else {
      const imageFormData = {
        uri: imageresponse[0].fileCopyUri,
        name: imageresponse[0].name,
        type: imageresponse[0].type,
      };
      formik.setFieldValue(`attachment`, imageFormData);
    }
  };

  const removeDocument = indexOfRemove => {
    let arr = [];
    arr = formik.values.images.filter((item, index) => indexOfRemove !== index);
    formik.setFieldValue(`images`, arr);
  };

  /*Ui of dropdown list*/
  const renderDropDown = item => {
    return (
      <View style={styles.listView}>
        {item?.label && (
          <Text
            numberOfLines={1}
            style={[styles.inputText, { marginLeft: 10 }]}>
            {item.label}
          </Text>
        )}
      </View>
    );
  };

  const getDocumentTypeToUplaod = type => {
    switch (type) {
      case 'pdf':
        setDocType(types.pdf);
        break;
      case 'text':
        setDocType(types.plainText);
        break;
      case 'video':
        setDocType(types.video);
        break;
      case 'audio':
        setDocType(types.audio);
        break;
      case 'image':
        setDocType('image');
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
      <CustomeHeader
        headerTitle={edit_id ? 'update Tutorial' : 'add Tutorial'}
      />

      <ScrollView>
        <View style={styles.inpuntContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.title}>SOFTWARE USER TYPE </Text>
            <Icon
              name="asterisk"
              type={IconType.FontAwesome}
              size={8}
              color={Colors().red}
            />
          </View>
          <NeumorphicDropDownList
            width={WINDOW_WIDTH * 0.9}
            RightIconName="caretdown"
            RightIconType={IconType.AntDesign}
            RightIconColor={Colors().darkShadow2}
            placeholder={'SELECT ...'}
            data={allRoles}
            labelField={'label'}
            valueField={'value'}
            value={formik.values.user_type}
            renderItem={renderDropDown}
            search={false}
            placeholderStyle={styles.inputText}
            selectedTextStyle={styles.selectedTextStyle}
            editable={false}
            style={styles.inputText}
            onChange={val => {
              formik.setFieldValue(`user_type`, val.value);
            }}
          />
          {formik.touched.user_type && formik.errors.user_type && (
            <Text style={styles.errorMesage}>{formik.errors.user_type}</Text>
          )}

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.title}>MODULE TYPE </Text>
            <Icon
              name="asterisk"
              type={IconType.FontAwesome}
              size={8}
              color={Colors().red}
            />
          </View>
          <NeumorphicDropDownList
            width={WINDOW_WIDTH * 0.9}
            RightIconName="caretdown"
            RightIconType={IconType.AntDesign}
            RightIconColor={Colors().darkShadow2}
            placeholder={'SELECT ...'}
            data={allModule}
            labelField={'label'}
            valueField={'value'}
            value={formik.values.module_type}
            renderItem={renderDropDown}
            search={false}
            placeholderStyle={styles.inputText}
            selectedTextStyle={styles.selectedTextStyle}
            editable={false}
            style={styles.inputText}
            onChange={val => {
              formik.setFieldValue(`module_type`, val.value);
            }}
          />
          {formik.touched.module_type && formik.errors.module_type && (
            <Text style={styles.errorMesage}>{formik.errors.module_type}</Text>
          )}

          <View style={styles.twoItemView}>
            <View style={styles.leftView}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.title}>APPLICATION TYPE </Text>
                <Icon
                  name="asterisk"
                  type={IconType.FontAwesome5}
                  size={8}
                  color={Colors().red}
                />
              </View>
              <NeumorphicDropDownList
                width={WINDOW_WIDTH * 0.42}
                RightIconName="caretdown"
                RightIconType={IconType.AntDesign}
                RightIconColor={Colors().darkShadow2}
                placeholder={'SELECT ...'}
                data={APPLICATION_TYPE}
                labelField={'label'}
                valueField={'value'}
                value={formik.values.application_type}
                renderItem={renderDropDown}
                search={false}
                placeholderStyle={styles.inputText}
                selectedTextStyle={styles.selectedTextStyle}
                editable={false}
                style={styles.inputText}
                onChange={val => {
                  formik.setFieldValue(`application_type`, val.value);
                }}
              />
              {formik.touched.application_type &&
                formik.errors.application_type && (
                  <Text style={styles.errorMesage}>
                    {formik.errors.application_type}
                  </Text>
                )}
            </View>
            <View style={styles.rightView}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.title}>TUTORIAL FORMAT </Text>
                <Icon
                  name="asterisk"
                  type={IconType.FontAwesome5}
                  size={8}
                  color={Colors().red}
                />
              </View>
              <NeumorphicDropDownList
                width={WINDOW_WIDTH * 0.42}
                RightIconName="caretdown"
                RightIconType={IconType.AntDesign}
                RightIconColor={Colors().darkShadow2}
                placeholder={'SELECT ...'}
                data={FORMAT}
                labelField={'label'}
                valueField={'value'}
                value={formik.values.tutorial_format}
                renderItem={renderDropDown}
                search={false}
                placeholderStyle={styles.inputText}
                selectedTextStyle={styles.selectedTextStyle}
                editable={false}
                style={styles.inputText}
                onChange={val => {
                  getDocumentTypeToUplaod(val.value);
                  formik.setFieldValue(`tutorial_format`, val.value);
                }}
              />
              {formik.touched.tutorial_format &&
                formik.errors.tutorial_format && (
                  <Text style={styles.errorMesage}>
                    {formik.errors.tutorial_format}
                  </Text>
                )}
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.title}>Description </Text>
            <Icon
              name="asterisk"
              type={IconType.FontAwesome}
              size={8}
              color={Colors().red}
            />
          </View>
          <NeumorphicTextInput
            placeholder={'TYPE...'}
            style={styles.inputText}
            value={formik.values.description}
            onChangeText={formik.handleChange(`description`)}
          />
          {formik.touched.description && formik.errors.description && (
            <Text style={styles.errorMesage}>{formik.errors.description}</Text>
          )}

          {formik.values.attachment && (
            <View style={{ flexDirection: 'row' }}>
              <View style={[styles.userNameView, { columnGap: 10 }]}>
                <TouchableOpacity
                // onPress={() => {
                //   setImageModalVisible(true);
                //   setImageUri(
                //     edit_id
                //       ? `${apiBaseUrl}${formik.values?.attachment}`
                //       : `${formik.values?.attachment?.uri}`,
                //   );
                // }}
                >
                  {formik.values.tutorial_format === 'pdf' && (
                    <Icon
                      name="pdffile1"
                      type={IconType.AntDesign}
                      size={100}
                      color={Colors().red}
                      style={{ marginVertical: 20 }}
                      // onPress={() =>
                      //   downloadImageRemote(`${apiBaseUrl}${item?.attachment}`)
                      // }
                    />
                  )}
                  {formik.values.tutorial_format === 'text' && (
                    <Icon
                      name="filetext1"
                      type={IconType.AntDesign}
                      size={100}
                      color={Colors().skyBule}
                      style={{ marginVertical: 20 }}
                      // onPress={() =>
                      //   downloadImageRemote(
                      //     `${apiBaseUrl}${item?.attachment}`,
                      //   )
                      // }
                    />
                  )}

                  {formik.values.tutorial_format === 'video' && (
                    <Icon
                      name="video"
                      type={IconType.Entypo}
                      size={100}
                      color={Colors().skyBule}
                      style={{ marginVertical: 20 }}
                      // onPress={() => setIsPlaying(true)}
                    />
                  )}

                  {formik.values.tutorial_format === 'audio' && (
                    <Icon
                      name="file-audio-o"
                      type={IconType.FontAwesome}
                      size={100}
                      color={Colors().skyBule}
                      style={{ marginVertical: 20 }}
                      // onPress={() => setIsAudioPlaying(true)}
                    />
                  )}
                  {formik.values.tutorial_format === 'image' && (
                    <Image
                      source={{
                        uri: edit_id
                          ? `${apiBaseUrl}${formik.values?.attachment}`
                          : `${formik.values?.attachment?.uri}`,
                      }}
                      style={[styles.Image, { marginTop: 10 }]}
                    />
                  )}

                  <View style={styles.crossIcon}>
                    <Icon
                      name="close"
                      type={IconType.AntDesign}
                      size={15}
                      onPress={() => formik.setFieldValue(`attachment`, '')}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {formik.values.tutorial_format && (
          <View style={styles.btnView}>
            <NeumorphicButton
              // disabled={type === 'view'}
              title={`Document`}
              titleColor={Colors().pending}
              btnHeight={WINDOW_HEIGHT * 0.05}
              onPress={() => selectPhotoTapped(docType)}
              btnRadius={2}
              iconName={'upload'}
              iconType={IconType.Feather}
              iconColor={Colors().black2}
            />

            {formik.touched.attachment && formik.errors.attachment && (
              <Text style={styles.errorMesage}>{formik.errors.attachment}</Text>
            )}
          </View>
        )}

        <View style={{ alignSelf: 'center', marginVertical: 10 }}>
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

export default AddUpdateTutorialScreen;

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
  selectedStyle: {
    borderRadius: 12,
  },
  dropdown: {
    marginLeft: 10,
    marginRight: 10,
  },

  placeholderStyle: {
    fontSize: 16,
    marginLeft: 10,
    paddingVertical: 10,
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
  userNameView: { flex: 1, flexDirection: 'row', flexWrap: 'wrap' },
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
  rightView: {
    flexDirection: 'column',
    flex: 1,
    rowGap: 8,
    // justifyContent: 'flex-end',
  },
  leftView: {
    flexDirection: 'column',
    rowGap: 8,
    flex: 1,
  },
  twoItemView: {
    flexDirection: 'row',
    columnGap: 5,
  },
});
