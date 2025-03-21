import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import CustomeHeader from '../../component/CustomeHeader';
import IconType from '../../constants/IconType';
import Colors from '../../constants/Colors';
import AlertModal from '../../component/AlertModal';
import NeumorphicButton from '../../component/NeumorphicButton';
import * as ImagePicker from 'react-native-image-picker';
import NeumorphicTextInput from '../../component/NeumorphicTextInput';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../utils/ScreenLayout';
import { useFormik } from 'formik';
import { Icon } from '@rneui/themed';
import { addPlanPricingSchema } from '../../utils/FormSchema';
import Toast from 'react-native-toast-message';
import NeumorphicDropDownList from '../../component/DropDownList';
import { getAllModule } from '../../redux/slices/commonApi';
import NeumorphCard from '../../component/NeumorphCard';
import { MultiSelect } from 'react-native-element-dropdown';
import { TouchableOpacity } from 'react-native';
import { Image } from 'react-native';
import ImageViewer from '../../component/ImageViewer';
import { apiBaseUrl } from '../../../config';
import {
  addPlanPrice,
  updatePlanPrice,
} from '../../redux/slices/plan-pricing/addUpdatePlanPriceSlice';
import { getPlanPriceDetailById } from '../../redux/slices/plan-pricing/getPlanPriceDetailSlice';
import MultiSelectComponent from '../../component/MultiSelectComponent';

const AddUpdatePlainPricingScreen = ({ navigation, route }) => {
  const edit_id = route?.params?.edit_id;
  const [edit, setEdit] = useState([]);
  const [allModule, setAllModule] = useState([]);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    requestCameraPermission();
    requestExternalWritePermission();
    fetchAllModule();

    if (edit_id) {
      fetchSingleData();
    }
  }, []);

  const durationArray = [
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
    { value: 'year', label: 'Year' },
  ];

  const formik = useFormik({
    enableReinitialize: 'true',
    initialValues: {
      // id: edit.id || '',
      name: edit?.name || '',
      price: edit?.price || '',
      duration: edit?.duration || '',
      description: edit?.description || '',
      image: edit?.image || null,
      // modules: edit?.module ? JSON.parse(edit?.module) : '',
      modules: edit?.module
        ? JSON.parse(edit?.module.replace(/\\/g, '').replace(/"/g, ''))
        : '',
      planCheckLists: edit?.planCheckLists || [
        {
          checklist_name: '',
        },
      ],
    },
    validationSchema: addPlanPricingSchema,
    onSubmit: (values, { resetForm }) => {
      handleSubmit(values, resetForm);
    },
  });

  const handleSubmit = async (values, resetForm) => {
    const formdata = new FormData();
    formdata.append('name', values.name);
    formdata.append('price', values.price);
    formdata.append('duration', values.duration);
    formdata.append('description', values.description);
    formdata.append('image', values.image);
    formdata.append('module', JSON.stringify(values.modules));
    // formdata.append('planCheckLists', values.checklist_name);
    // formdata.append('module', JSON?.stringify(module));
    formdata.append(
      'planCheckLists',
      JSON?.stringify(
        values.planCheckLists?.map(item => {
          return item?.checklist_name;
        }),
      ) || [''],
    );

    // if (typeof values.images === 'string') {
    //   formdata.append('images', values.images);
    // } else {
    //   for (let i = 0; i < values.images.length; i++) {
    //     formdata.append('images', values.images[i]);
    //   }
    // }

    if (edit_id) {
      formdata.append('id', edit_id);
    }

    try {
      setLoading(true);
      const res = edit_id
        ? await dispatch(updatePlanPrice(formdata)).unwrap()
        : await dispatch(addPlanPrice(formdata)).unwrap();

      if (res.status) {
        setLoading(false);
        navigation.navigate('PlanPricingListScreen');
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
    const res = await dispatch(getPlanPriceDetailById(edit_id)).unwrap();
    if (res.status) {
      setEdit(res.data);
      // fetchAlluserList(res?.data?.user_type);
    } else {
      setEdit({});
    }
  };

  /* fetch Document category list  */
  const fetchAllModule = async () => {
    const res = await dispatch(getAllModule()).unwrap();

    if (res?.status === true) {
      const rData = res?.data.map(item => {
        return {
          value: item?.id,
          label: item?.title,
        };
      });
      setAllModule(rData);
    } else {
      setAllModule([]);
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
          if (response.assets[0].fileSize < 800000) {
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
    const imageFormData = {
      uri: imageresponse.assets[0].uri,
      name: imageresponse.assets[0].fileName,
      type: imageresponse.assets[0].type,
    };
    switch (docType) {
      case 'document':
        formik.setFieldValue(`image`, imageFormData);

        break;

      default:
        break;
    }
  };
  {
    /*function for removing image with index*/
  }
  const removeDocument = indexOfRemove => {
    // let arr = [];
    // arr = formik.values.images.filter((item, index) => indexOfRemove !== index);
    formik.setFieldValue(`image`, '');
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
      <CustomeHeader headerTitle={edit_id ? 'update' : 'add'} />

      <ScrollView>
        <View style={styles.inpuntContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.title}>Module </Text>
            <Icon
              name="asterisk"
              type={IconType.FontAwesome}
              size={8}
              color={Colors().red}
            />
          </View>

          <MultiSelectComponent
            title={'Module'}
            required={true}
            data={allModule}
            value={formik?.values?.modules}
            onChange={item => {
              formik.setFieldValue(`modules`, item);
            }}
            inside={true}
            errorMessage={formik?.errors?.modules}
          />

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.title}>Name </Text>
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
            value={formik.values.name}
            onChangeText={formik.handleChange(`name`)}
          />
          {formik.touched.name && formik.errors.name && (
            <Text style={styles.errorMesage}>{formik.errors.name}</Text>
          )}

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.title}>price </Text>
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
            value={formik.values.price}
            keyboardType="numeric"
            onChangeText={formik.handleChange(`price`)}
          />
          {formik.touched.price && formik.errors.price && (
            <Text style={styles.errorMesage}>{formik.errors.price}</Text>
          )}

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.title}>duration</Text>
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
            data={durationArray}
            labelField={'label'}
            valueField={'value'}
            value={formik.values.duration}
            renderItem={renderDropDown}
            search={false}
            placeholderStyle={styles.inputText}
            selectedTextStyle={styles.selectedTextStyle}
            editable={false}
            style={styles.inputText}
            onChange={val => {
              formik.setFieldValue(`duration`, val.value);
            }}
          />
          {formik.touched.duration && formik.errors.duration && (
            <Text style={styles.errorMesage}>{formik.errors.duration}</Text>
          )}

          {formik.values.image && (
            <View style={{ flexDirection: 'row' }}>
              <View style={[styles.userNameView, { columnGap: 10 }]}>
                <TouchableOpacity
                  onPress={() => {
                    setImageModalVisible(true);
                    setImageUri(
                      edit_id
                        ? `${apiBaseUrl}${formik.values.image}`
                        : `${formik.values.image?.uri}`,
                    );
                  }}>
                  <Image
                    source={{
                      uri:
                        edit_id && !formik.values.image?.uri
                          ? `${apiBaseUrl}${formik.values.image}`
                          : `${formik.values.image?.uri}`,
                    }}
                    style={[styles.Image, { marginTop: 10 }]}
                  />

                  <View style={styles.crossIcon}>
                    <Icon
                      name="close"
                      type={IconType.AntDesign}
                      size={15}
                      onPress={() => removeDocument()}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}

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
          </View>

          {formik.touched.image && formik.errors.image && (
            <Text style={styles.errorMesage}>{formik.errors.image}</Text>
          )}

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.title}>description </Text>
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

          {formik.values.planCheckLists.map((item, index) => (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View style={{ rowGap: 2 }}>
                <Text style={styles.title}>
                  {index >= 0 ? `PLAN POINTS ${index + 1}` : `PLAN POINTS`}
                </Text>
                <NeumorphicTextInput
                  height={WINDOW_HEIGHT * 0.06}
                  width={WINDOW_WIDTH * 0.75}
                  placeholder={'TYPE...'}
                  style={styles.inputText}
                  value={item.checklist_name}
                  // editable={type !== 'view'}
                  onChangeText={formik.handleChange(
                    `planCheckLists.${index}.checklist_name`,
                  )}
                />
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  marginTop: WINDOW_HEIGHT * 0.02,
                }}>
                {index <= 0 && (
                  <NeumorphCard
                    lightShadowColor={Colors().darkShadow2}
                    darkShadowColor={Colors().lightShadow}>
                    <Icon
                      // disabled={type === 'view'}
                      name="plus"
                      type={IconType.AntDesign}
                      color={Colors().aprroved}
                      style={styles.actionIcon}
                      onPress={() =>
                        formik.setFieldValue(`planCheckLists`, [
                          ...formik.values.planCheckLists,
                          {
                            checklist_name: '',
                          },
                        ])
                      }
                    />
                  </NeumorphCard>
                )}

                {index > 0 && (
                  <View style={styles.actionView2}>
                    <NeumorphCard
                      lightShadowColor={Colors().darkShadow2}
                      darkShadowColor={Colors().lightShadow}>
                      <Icon
                        // disabled={type === 'view'}
                        style={styles.actionIcon}
                        onPress={() =>
                          formik.setFieldValue(
                            `planCheckLists`,
                            formik.values.planCheckLists.filter(
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
              </View>
            </View>
          ))}
        </View>

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

export default AddUpdatePlainPricingScreen;

const styles = StyleSheet.create({
  inpuntContainer: {
    rowGap: 6,
    margin: WINDOW_WIDTH * 0.05,
  },

  actionIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
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
    marginTop: WINDOW_HEIGHT * 0.01,
    // marginBottom: WINDOW_HEIGHT * 0.01,
  },
  Image: {
    height: WINDOW_HEIGHT * 0.07,
    width: WINDOW_WIDTH * 0.9,
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
});
