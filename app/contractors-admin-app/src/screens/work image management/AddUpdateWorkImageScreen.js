/*    ----------------Created Date :: 20- Feb -2024   ----------------- */

import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import CustomeHeader from '../../component/CustomeHeader';
import IconType from '../../constants/IconType';
import Colors from '../../constants/Colors';
import AlertModal from '../../component/AlertModal';
import ImageViewer from '../../component/ImageViewer';
import NeumorphicButton from '../../component/NeumorphicButton';
import NeumorphicTextInput from '../../component/NeumorphicTextInput';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../utils/ScreenLayout';
import NeumorphicDropDownList from '../../component/DropDownList';
import { useFormik } from 'formik';

import { addWorkImagesSchema } from '../../utils/FormSchema';

import CustomColorPicker from '../../component/CustomColorPicker';
import RBSheet from 'react-native-raw-bottom-sheet';
import { getCompliantDropDown } from '../../redux/slices/commonApi';
import * as ImagePicker from 'react-native-image-picker';
import { PermissionsAndroid } from 'react-native';
import SeparatorComponent from '../../component/SeparatorComponent';
import { Icon } from '@rneui/themed';
import NeumorphCard from '../../component/NeumorphCard';
import { ClippingRectangle } from '@react-native-community/art';
import Toast from 'react-native-toast-message';

import {
  addWorkImage,
  updateWorkImage,
} from '../../redux/slices/work-images-mangement/addUpdateWorkImageSlice';
import { getWorkImageDetailById } from '../../redux/slices/work-images-mangement/getWorkImageDetailSlice';
import { apiBaseUrl } from '../../../config';
const AddUpdateWorkImageScreen = ({ navigation, route }) => {
  const refRBSheet = useRef(RBSheet);

  const edit_id = route?.params?.edit_id;
  const type = route?.params?.type;
  const [allComplaint, setAllComplaint] = useState([]);
  const [edit, setEdit] = useState([]);
  const [openedFrom, setOpenedFrom] = useState('');
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState(false);
  const [confirm, setConfrim] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [deffCol, setDeffCol] = useState('#000000');

  useEffect(() => {
    fetchComplaintlist();
    requestCameraPermission();
    requestExternalWritePermission();
    if (edit_id || type) {
      fetchSingleData();
    }
  }, []);

  const formik = useFormik({
    enableReinitialize: 'true',
    initialValues: {
      main_image: edit?.main_image || [
        {
          row_title: '',
          row_title_color: '#5200ff',
          before_image: {
            title: '',
            title_bg_color: '#5200ff',
            title_text_color: '#ffffff',
            description: '',
            description_text_color: '#000000',
            file: '',
          },
          progress_image: {
            title: '',
            title_bg_color: '#5200ff',
            title_text_color: '#ffffff',
            description: '',
            description_text_color: '#000000',
            file: '',
          },
          after_image: {
            title: '',
            title_bg_color: '#5200ff',
            title_text_color: '#ffffff',
            description: '',
            description_text_color: '#000000',
            file: '',
          },
        },
      ],
      complaint_id: edit?.complaint_id || '',
      heading_text_color: edit?.heading_text_color || '#CA0707',
      full_slide_color: edit?.full_slide_color || '#000000',
      presentation_title: edit?.presentation_title || '',
    },
    validationSchema: addWorkImagesSchema,
    onSubmit: (values, { resetForm }) => {
      handleSubmit(values, resetForm);
    },
  });

  const handleSubmit = async (values, resetForm) => {
    const reqbody = {
      complaint_id: values.complaint_id,
      full_slide_color: values.full_slide_color,
      heading_text_color: values.heading_text_color,
      presentation_title: values.presentation_title,
      main_image: values.main_image,
    };
    if (edit_id) {
      reqbody['id'] = edit_id;
    }
    try {
      setLoading(true);
      const res = edit_id
        ? await dispatch(updateWorkImage(reqbody)).unwrap()
        : await dispatch(addWorkImage(reqbody)).unwrap();

      if (res.status) {
        setLoading(false);
        navigation.navigate('AllWorkImageScreen');
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
            sendImageFunc(response, 'img', docType, index);
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
            sendImageFunc(response, 'img', docType, index);
          } else {
            Alert.alert('Maximum size ', 'Only 800 KB file size is allowed ', [
              { text: 'OK', onPress: () => console.log('OK Pressed') },
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
            { text: 'OK', onPress: () => console.log('OK Pressed') },
          ]);
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };
  const sendImageFunc = async (imageresponse, type, docType, index) => {
    // const imageData = imageresponse.assets[0].uri;
    // const imageData = imageresponse.assets[0].base64;
    const imageData = `data:${imageresponse.assets[0].type};base64,${imageresponse.assets[0].base64}`;
    // const imageFormData = new FormData();
    // imageFormData.append('userId', this.props.userId);
    // imageFormData.append('type', 'complaint');
    // if (type === 'img') {
    //   imageFormData.append('image', {
    //     uri: imageresponse.assets[0].uri,
    //     name: imageresponse.assets[0].fileName,
    //     type: imageresponse.assets[0].type,
    //   });
    // const imageFormData = {
    //   uri: imageresponse.assets[0].uri,
    //   name: imageresponse.assets[0].fileName,
    //   type: imageresponse.assets[0].type,
    // };

    switch (docType) {
      case 'before':
        formik.setFieldValue(
          `main_image.${index}.before_image.file`,
          imageData,
        );

        break;
      case 'progress':
        formik.setFieldValue(
          `main_image.${index}.progress_image.file`,
          imageData,
        );
        break;
      case 'after':
        formik.setFieldValue(`main_image.${index}.after_image.file`, imageData);
        break;

      default:
        break;
    }
  };

  const fetchSingleData = async () => {
    const res = await dispatch(getWorkImageDetailById(edit_id)).unwrap();
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit({});
    }
  };

  const fetchComplaintlist = async () => {
    try {
      const result = await dispatch(getCompliantDropDown()).unwrap();

      if (result?.status) {
        const rData = result?.data.map(item => {
          return {
            label: item?.complaint_unique_id,
            value: item?.complaint_id,
          };
        });

        setAllComplaint(rData);
      } else {
        setAllComplaint([]);
      }
    } catch (error) {
      setAllComplaint([]);
    }
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

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors().screenBackground,
      }}>
      <CustomeHeader
        headerTitle={type ? 'view work detail' : edit_id ? 'update' : 'add'}
      />

      <ScrollView>
        <View style={styles.inpuntContainer}>
          <View style={{ rowGap: 2 }}>
            <Text style={styles.title}>Complaint id</Text>
            <NeumorphicDropDownList
              RightIconName="caretdown"
              RightIconType={IconType.AntDesign}
              RightIconColor={Colors().darkShadow2}
              placeholder={'SELECT ...'}
              data={allComplaint}
              labelField={'label'}
              valueField={'value'}
              value={formik.values.complaint_id}
              renderItem={renderDropDown}
              search={false}
              disable={type}
              placeholderStyle={styles.inputText}
              selectedTextStyle={styles.selectedTextStyle}
              editable={false}
              style={styles.inputText}
              onChange={val => {
                formik.setFieldValue(`complaint_id`, val.value);
              }}
            />
          </View>
          {formik.touched.complaint_id && formik.errors.complaint_id && (
            <Text style={styles.errorMesage}>{formik.errors.complaint_id}</Text>
          )}
          <View
            style={{
              flexDirection: 'row',
            }}>
            <View style={styles.colorView}>
              <TouchableOpacity
                disabled={type === 'view'}
                style={[
                  styles.colorBtn,
                  { backgroundColor: formik.values.full_slide_color },
                ]}
                onPress={() => {
                  setOpenedFrom('full_slide_color');
                  refRBSheet.current.open();
                }}
              />

              <Text style={[styles.title, { flexShrink: 1 }]}>
                SLIDE BG COLOR
              </Text>
            </View>
            <View style={styles.colorView}>
              <TouchableOpacity
                disabled={type === 'view'}
                style={[
                  styles.colorBtn,
                  { backgroundColor: formik.values.heading_text_color },
                ]}
                onPress={() => {
                  setOpenedFrom('heading_text_color');
                  setDeffCol(formik.values.heading_text_color);
                  refRBSheet.current.open();
                }}
              />

              <Text style={[styles.title, { flexShrink: 1 }]}>
                HEADING TEXT COLOR
              </Text>
            </View>
          </View>
          <View style={{ rowGap: 2 }}>
            <Text style={styles.title}>PRESENTATION TITLE</Text>
            <NeumorphicTextInput
              height={WINDOW_HEIGHT * 0.07}
              width={WINDOW_WIDTH * 0.9}
              placeholder={'TYPE...'}
              style={styles.inputText}
              editable={type !== 'view'}
              value={formik.values.presentation_title}
              multiline
              onChangeText={formik.handleChange(`presentation_title`)}
            />
          </View>

          {formik.values.main_image.map((item, index) => (
            <View key={index} style={{ rowGap: 8 }}>
              <View style={styles.gstDetailsText}>
                <SeparatorComponent
                  separatorWidth={WINDOW_WIDTH * 0.3}
                  separatorHeight={WINDOW_HEIGHT * 0.002}
                  separatorColor={Colors().gray2}
                />
                <Text style={styles.title}>
                  {index > 0 ? `Work Images ${index}` : 'Work Image'}
                </Text>

                <SeparatorComponent
                  separatorWidth={WINDOW_WIDTH * 0.3}
                  separatorHeight={WINDOW_HEIGHT * 0.002}
                  separatorColor={Colors().gray2}
                />
              </View>
              {index <= 0 && (
                <View style={styles.actionView2}>
                  <NeumorphCard
                    lightShadowColor={Colors().darkShadow2}
                    darkShadowColor={Colors().lightShadow}>
                    <Icon
                      disabled={type === 'view'}
                      name="plus"
                      type={IconType.AntDesign}
                      color={Colors().aprroved}
                      style={styles.actionIcon}
                      onPress={() =>
                        formik.setFieldValue(`main_image`, [
                          ...formik.values.main_image,
                          {
                            row_title: '',
                            row_title_color: '#5200ff',
                            before_image: {
                              title: '',
                              title_bg_color: '#5200ff',
                              title_text_color: '#ffffff',
                              description: '',
                              description_text_color: '#000000',
                              file: '',
                            },
                            progress_image: {
                              title: '',
                              title_bg_color: '#5200ff',
                              title_text_color: '#ffffff',
                              description: '',
                              description_text_color: '#000000',
                              file: '',
                            },
                            after_image: {
                              title: '',
                              title_bg_color: '#5200ff',
                              title_text_color: '#ffffff',
                              description: '',
                              description_text_color: '#000000',
                              file: '',
                            },
                          },
                        ])
                      }
                    />
                  </NeumorphCard>
                </View>
              )}
              {index > 0 && (
                <View style={styles.actionView2}>
                  <NeumorphCard
                    lightShadowColor={Colors().darkShadow2}
                    darkShadowColor={Colors().lightShadow}>
                    <Icon
                      disabled={type === 'view'}
                      style={styles.actionIcon}
                      onPress={() =>
                        formik.setFieldValue(
                          `main_image`,
                          formik.values.main_image.filter(
                            (_, i) => i !== index,
                          ),
                        )
                      }
                      name="minus"
                      type={IconType.AntDesign}
                      color={Colors().red}
                    />
                  </NeumorphCard>
                </View>
              )}

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View style={{ rowGap: 2 }}>
                  <Text style={styles.title}>Row TITLE</Text>
                  <NeumorphicTextInput
                    height={WINDOW_HEIGHT * 0.06}
                    width={WINDOW_WIDTH * 0.8}
                    placeholder={'TYPE...'}
                    style={styles.inputText}
                    value={item.row_title}
                    editable={type !== 'view'}
                    onChangeText={formik.handleChange(
                      `main_image.${index}.row_title`,
                    )}
                  />
                </View>
                <View
                  style={{
                    justifyContent: 'center',
                    marginTop: WINDOW_HEIGHT * 0.02,
                  }}>
                  <TouchableOpacity
                    disabled={type === 'view'}
                    style={[
                      styles.colorBtn,
                      {
                        backgroundColor:
                          formik.values.main_image[index].row_title_color,
                      },
                    ]}
                    onPress={() => {
                      setOpenedFrom(`main_image[${index}].row_title_color`);
                      setDeffCol(
                        formik.values.main_image[index].row_title_color,
                      );
                      refRBSheet.current.open();
                    }}
                  />
                </View>
              </View>
              {formik.touched.main_image &&
                formik.touched.main_image[index] &&
                formik.errors.main_image &&
                formik.errors.main_image[index]?.row_title && (
                  <Text style={styles.errorMesage}>
                    {formik.errors.main_image[index].row_title}
                  </Text>
                )}
              {/*before image Ui*/}

              {formik.values.main_image[index].before_image.file && (
                <TouchableOpacity
                  onPress={() => {
                    setImageModalVisible(true),
                      setImageUri(
                        edit_id &&
                          formik.values.main_image[
                            index
                          ].before_image.file?.startsWith('/complaint_images')
                          ? `${apiBaseUrl}${formik.values.main_image[index].before_image.file}`
                          : formik.values.main_image[index].before_image.file,
                      );
                  }}>
                  <Image
                    source={{
                      uri:
                        edit_id &&
                        formik.values.main_image[
                          index
                        ].before_image.file?.startsWith('/complaint_images')
                          ? `${apiBaseUrl}${formik.values.main_image[index].before_image.file}`
                          : formik.values.main_image[index].before_image.file,
                    }}
                    style={[styles.Image, { marginTop: 10 }]}
                  />
                </TouchableOpacity>
              )}

              <View style={styles.btnView}>
                <NeumorphicButton
                  disabled={type === 'view'}
                  title={'BEFORE IMAGE'}
                  titleColor={Colors().pending}
                  btnHeight={WINDOW_HEIGHT * 0.05}
                  onPress={() => selectPhotoTapped('before', index)}
                  btnRadius={2}
                  iconName={'upload'}
                  iconType={IconType.Feather}
                  iconColor={Colors().black2}
                />
              </View>

              {formik.touched.main_image &&
                formik.touched.main_image[index] &&
                formik.errors.main_image &&
                formik.errors.main_image[index]?.before_image && (
                  <Text style={styles.errorMesage}>
                    {formik.errors.main_image[index].before_image?.file}
                  </Text>
                )}

              <View style={{ rowGap: 2 }}>
                <View style={{ rowGap: 2 }}>
                  <Text style={styles.title}>Image TITLE</Text>
                  <NeumorphicTextInput
                    height={WINDOW_HEIGHT * 0.06}
                    width={WINDOW_WIDTH * 0.9}
                    placeholder={'TYPE...'}
                    style={styles.inputText}
                    editable={type !== 'view'}
                    value={formik.values.main_image[index].before_image?.title}
                    onChangeText={formik.handleChange(
                      `main_image.${index}.before_image.title`,
                    )}
                  />

                  {formik.touched.main_image &&
                    formik.touched.main_image[index] &&
                    formik.errors.main_image &&
                    formik.errors.main_image[index]?.before_image && (
                      <Text style={styles.errorMesage}>
                        {formik.errors.main_image[index].before_image?.title}
                      </Text>
                    )}
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  <View style={styles.colorView}>
                    <TouchableOpacity
                      disabled={type === 'view'}
                      style={[
                        styles.colorBtn,
                        {
                          backgroundColor:
                            formik.values.main_image[index].before_image
                              .title_bg_color,
                        },
                      ]}
                      onPress={() => {
                        setOpenedFrom(
                          `main_image[${index}].before_image.title_bg_color`,
                        );
                        setDeffCol(
                          formik.values.main_image[index].before_image
                            .title_bg_color,
                        );
                        refRBSheet.current.open();
                      }}
                    />

                    <Text style={[styles.title, { flexShrink: 1 }]}>
                      TITLE BACKGROUND COLOR
                    </Text>
                  </View>
                  <View style={styles.colorView}>
                    <TouchableOpacity
                      disabled={type === 'view'}
                      style={[
                        styles.colorBtn,
                        {
                          backgroundColor:
                            formik.values.main_image[index].before_image
                              .title_text_color,
                        },
                      ]}
                      onPress={() => {
                        setOpenedFrom(
                          `main_image[${index}].before_image.title_text_color`,
                        );
                        setDeffCol(
                          formik.values.main_image[index].before_image
                            .title_text_color,
                        );
                        refRBSheet.current.open();
                      }}
                    />

                    <Text style={[styles.title, { flexShrink: 1 }]}>
                      TITLE TEXT COLOR
                    </Text>
                  </View>
                </View>
                <View style={{ rowGap: 2 }}>
                  <Text style={styles.title}>Image description</Text>
                  <NeumorphicTextInput
                    height={WINDOW_HEIGHT * 0.06}
                    width={WINDOW_WIDTH * 0.9}
                    placeholder={'TYPE...'}
                    style={styles.inputText}
                    editable={type !== 'view'}
                    value={
                      formik.values.main_image[index].before_image?.description
                    }
                    onChangeText={formik.handleChange(
                      `main_image.${index}.before_image.description`,
                    )}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  <View style={styles.colorView}>
                    <TouchableOpacity
                      disabled={type === 'view'}
                      style={[
                        styles.colorBtn,
                        {
                          backgroundColor:
                            formik.values.main_image[index].before_image
                              .description_text_color,
                        },
                      ]}
                      onPress={() => {
                        setOpenedFrom(
                          `main_image[${index}].before_image.description_text_color`,
                        );
                        setDeffCol(
                          formik.values.main_image[index].before_image
                            .description_text_color,
                        );
                        refRBSheet.current.open();
                      }}
                    />

                    <Text style={[styles.title, { flexShrink: 1 }]}>
                      DESCRIPTION TEXT COLOR
                    </Text>
                  </View>
                </View>
              </View>

              {/*Progress image Ui*/}
              {formik.values.main_image[index]?.progress_image?.file && (
                <TouchableOpacity
                  onPress={() => {
                    setImageModalVisible(true),
                      setImageUri(
                        edit_id &&
                          formik.values.main_image[
                            index
                          ]?.progress_image?.file.startsWith(
                            '/complaint_images',
                          )
                          ? `${apiBaseUrl}${formik.values.main_image[index]?.progress_image?.file}`
                          : formik.values.main_image[index]?.progress_image
                              ?.file,
                      );
                  }}>
                  <Image
                    source={{
                      uri:
                        edit_id &&
                        formik.values.main_image[
                          index
                        ]?.progress_image?.file.startsWith('/complaint_images')
                          ? `${apiBaseUrl}${formik.values.main_image[index]?.progress_image?.file}`
                          : formik.values.main_image[index]?.progress_image
                              ?.file,
                    }}
                    style={[styles.Image, { marginTop: 10 }]}
                  />
                </TouchableOpacity>
              )}
              <View style={styles.btnView}>
                <NeumorphicButton
                  disabled={type === 'view'}
                  title={'Progress IMAGE'}
                  titleColor={Colors().pending}
                  btnHeight={WINDOW_HEIGHT * 0.05}
                  btnWidth={WINDOW_WIDTH * 0.55}
                  onPress={() => selectPhotoTapped('progress', index)}
                  btnRadius={2}
                  iconName={'upload'}
                  iconType={IconType.Feather}
                  iconColor={Colors().black2}
                />
              </View>

              <View style={{ rowGap: 2 }}>
                <View style={{ rowGap: 2 }}>
                  <Text style={styles.title}>Image TITLE</Text>
                  <NeumorphicTextInput
                    height={WINDOW_HEIGHT * 0.06}
                    width={WINDOW_WIDTH * 0.9}
                    placeholder={'TYPE...'}
                    style={styles.inputText}
                    editable={type !== 'view'}
                    value={
                      formik.values.main_image[index].progress_image_image
                        ?.title
                    }
                    onChangeText={formik.handleChange(
                      `main_image.${index}.progress_image.title`,
                    )}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  <View style={styles.colorView}>
                    <TouchableOpacity
                      disabled={type === 'view'}
                      style={[
                        styles.colorBtn,
                        {
                          backgroundColor:
                            formik.values.main_image[index].progress_image
                              .title_bg_color,
                        },
                      ]}
                      onPress={() => {
                        setOpenedFrom(
                          `main_image[${index}].progress_image.title_bg_color`,
                        );
                        setDeffCol(
                          formik.values.main_image[index].progress_image
                            .title_bg_color,
                        );
                        refRBSheet.current.open();
                      }}
                    />

                    <Text style={[styles.title, { flexShrink: 1 }]}>
                      TITLE BACKGROUND COLOR
                    </Text>
                  </View>
                  <View style={styles.colorView}>
                    <TouchableOpacity
                      disabled={type === 'view'}
                      style={[
                        styles.colorBtn,
                        {
                          backgroundColor:
                            formik.values.main_image[index].progress_image
                              .title_text_color,
                        },
                      ]}
                      onPress={() => {
                        setOpenedFrom(
                          `main_image[${index}].progress_image.title_text_color`,
                        );
                        setDeffCol(
                          formik.values.main_image[index].progress_image
                            .title_text_color,
                        );
                        refRBSheet.current.open();
                      }}
                    />

                    <Text style={[styles.title, { flexShrink: 1 }]}>
                      TITLE TEXT COLOR
                    </Text>
                  </View>
                </View>
                <View style={{ rowGap: 2 }}>
                  <Text style={styles.title}>Image description</Text>
                  <NeumorphicTextInput
                    height={WINDOW_HEIGHT * 0.06}
                    width={WINDOW_WIDTH * 0.9}
                    placeholder={'TYPE...'}
                    style={styles.inputText}
                    editable={type !== 'view'}
                    value={
                      formik.values.main_image[index].progress_image
                        ?.description
                    }
                    onChangeText={formik.handleChange(
                      `main_image.${index}.progress_image.description`,
                    )}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  <View style={styles.colorView}>
                    <TouchableOpacity
                      disabled={type === 'view'}
                      style={[
                        styles.colorBtn,
                        {
                          backgroundColor:
                            formik.values.main_image[index].progress_image
                              .description_text_color,
                        },
                      ]}
                      onPress={() => {
                        setOpenedFrom(
                          `main_image[${index}].progress_image.description_text_color`,
                        );
                        setDeffCol(
                          formik.values.main_image[index].progress_image
                            .description_text_color,
                        );
                        refRBSheet.current.open();
                      }}
                    />

                    <Text style={[styles.title, { flexShrink: 1 }]}>
                      DESCRIPTION TEXT COLOR
                    </Text>
                  </View>
                </View>
              </View>

              {/*After image Ui*/}
              {formik.values.main_image[index]?.after_image?.file && (
                <TouchableOpacity
                  onPress={() => {
                    setImageModalVisible(true),
                      setImageUri(
                        edit_id &&
                          formik.values.main_image[
                            index
                          ]?.after_image?.file.startsWith('/complaint_images')
                          ? `${apiBaseUrl}${formik.values.main_image[index]?.after_image?.file}`
                          : formik.values.main_image[index]?.after_image?.file,
                      );
                  }}>
                  <Image
                    source={{
                      uri:
                        edit_id &&
                        formik.values.main_image[
                          index
                        ]?.after_image?.file.startsWith('/complaint_images')
                          ? `${apiBaseUrl}${formik.values.main_image[index]?.after_image?.file}`
                          : formik.values.main_image[index]?.after_image?.file,
                    }}
                    style={[styles.Image, { marginTop: 10 }]}
                  />
                </TouchableOpacity>
              )}
              <View style={styles.btnView}>
                <NeumorphicButton
                  title={'After IMAGE'}
                  disabled={type === 'view'}
                  titleColor={Colors().pending}
                  btnHeight={WINDOW_HEIGHT * 0.05}
                  onPress={() => selectPhotoTapped('after', index)}
                  btnRadius={2}
                  iconName={'upload'}
                  iconType={IconType.Feather}
                  iconColor={Colors().black2}
                />
              </View>
              {formik.touched.main_image &&
                formik.touched.main_image[index] &&
                formik.errors.main_image &&
                formik.errors.main_image[index]?.after_image && (
                  <Text style={styles.errorMesage}>
                    {formik.errors.main_image[index].after_image?.file}
                  </Text>
                )}
              <View style={{ rowGap: 2 }}>
                <View style={{ rowGap: 2 }}>
                  <Text style={styles.title}>Image TITLE</Text>
                  <NeumorphicTextInput
                    height={WINDOW_HEIGHT * 0.06}
                    width={WINDOW_WIDTH * 0.9}
                    placeholder={'TYPE...'}
                    style={styles.inputText}
                    editable={type !== 'view'}
                    value={formik.values.main_image[index].after_image?.title}
                    // keyboardType="number-pad"
                    // multiline
                    onChangeText={formik.handleChange(
                      `main_image.${index}.after_image.title`,
                    )}
                  />

                  {formik.touched.main_image &&
                    formik.touched.main_image[index] &&
                    formik.errors.main_image &&
                    formik.errors.main_image[index]?.after_image && (
                      <Text style={styles.errorMesage}>
                        {formik.errors.main_image[index].after_image?.title}
                      </Text>
                    )}
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  <View style={styles.colorView}>
                    <TouchableOpacity
                      disabled={type === 'view'}
                      style={[
                        styles.colorBtn,
                        {
                          backgroundColor:
                            formik.values.main_image[index].after_image
                              .title_bg_color,
                        },
                      ]}
                      onPress={() => {
                        setOpenedFrom(
                          `main_image[${index}].after_image.title_bg_color`,
                        );
                        setDeffCol(
                          formik.values.main_image[index].after_image
                            .title_bg_color,
                        );
                        refRBSheet.current.open();
                      }}
                    />

                    <Text style={[styles.title, { flexShrink: 1 }]}>
                      TITLE BACKGROUND COLOR
                    </Text>
                  </View>
                  <View style={styles.colorView}>
                    <TouchableOpacity
                      disabled={type === 'view'}
                      style={[
                        styles.colorBtn,
                        {
                          backgroundColor:
                            formik.values.main_image[index].after_image
                              .title_text_color,
                        },
                      ]}
                      onPress={() => {
                        setOpenedFrom(
                          `main_image[${index}].after_image.title_text_color`,
                        );
                        setDeffCol(
                          formik.values.main_image[index].after_image
                            .title_text_color,
                        );
                        refRBSheet.current.open();
                      }}
                    />

                    <Text style={[styles.title, { flexShrink: 1 }]}>
                      TITLE TEXT COLOR
                    </Text>
                  </View>
                </View>
                <View style={{ rowGap: 2 }}>
                  <Text style={styles.title}>Image description</Text>
                  <NeumorphicTextInput
                    editable={type !== 'view'}
                    height={WINDOW_HEIGHT * 0.06}
                    width={WINDOW_WIDTH * 0.9}
                    placeholder={'TYPE...'}
                    style={styles.inputText}
                    value={
                      formik.values.main_image[index].after_image?.description
                    }
                    onChangeText={formik.handleChange(
                      `main_image.${index}.after_image.description`,
                    )}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  <View style={styles.colorView}>
                    <TouchableOpacity
                      disabled={type === 'view'}
                      style={[
                        styles.colorBtn,
                        {
                          backgroundColor:
                            formik.values.main_image[index].after_image
                              .description_text_color,
                        },
                      ]}
                      onPress={() => {
                        setOpenedFrom(
                          `main_image[${index}].after_image.description_text_color`,
                        );
                        setDeffCol(
                          formik.values.main_image[index].after_image
                            .description_text_color,
                        );
                        refRBSheet.current.open();
                      }}
                    />

                    <Text style={[styles.title, { flexShrink: 1 }]}>
                      DESCRIPTION TEXT COLOR
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/*View for bottom sheet*/}
        <CustomColorPicker
          btnRef={refRBSheet}
          defalutColor={deffCol}
          onColorChange={item => {
            formik.setFieldValue(`${openedFrom}`, item);
          }}
        />
        {!type && (
          <View style={{ alignSelf: 'center', marginVertical: 10 }}>
            <NeumorphicButton
              title={edit_id ? 'update' : 'ADD'}
              titleColor={Colors().purple}
              onPress={formik.handleSubmit}
              loading={loading}
            />
          </View>
        )}

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
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddUpdateWorkImageScreen;

const styles = StyleSheet.create({
  inpuntContainer: {
    rowGap: 10,
    // backgroundColor: 'red',
    margin: WINDOW_WIDTH * 0.05,
  },
  input: {
    color: Colors().text2,
    fontSize: 18,
    fontWeight: '400',
    fontFamily: Colors().fontFamilyBookMan,
    textTransform: 'uppercase',
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
  listView: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 8,
  },
  actionView2: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    // columnGap: 10,
    marginTop: -WINDOW_HEIGHT * 0.02,
    marginBottom: -WINDOW_HEIGHT * 0.02,
  },
  inputText: {
    color: Colors().pureBlack,
    fontSize: 12,
    fontWeight: '300',
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  selectedTextStyle: {
    fontSize: 15,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  btnView: {
    alignSelf: 'center',
    marginTop: WINDOW_HEIGHT * 0.01,
    // marginBottom: WINDOW_HEIGHT * 0.01,
  },
  actionIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  colorView: {
    flexDirection: 'row',

    width: '50%',
    columnGap: 8,
    alignItems: 'center',
  },
  colorBtn: {
    height: WINDOW_HEIGHT * 0.03,
    width: WINDOW_WIDTH * 0.06,
    borderRadius: 5,
    // backgroundColor: formik.values.full_slide_color,
  },
  gstDetailsText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: WINDOW_HEIGHT * 0.02,
    fontFamily: Colors().fontFamilyBookMan,
  },
  Image: {
    height: 40,
    width: WINDOW_WIDTH * 0.9,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: Colors().gray,
  },
});
