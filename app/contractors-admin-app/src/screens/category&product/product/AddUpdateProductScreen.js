import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import CustomeHeader from '../../../component/CustomeHeader';
import IconType from '../../../constants/IconType';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../utils/ScreenLayout';
import Colors from '../../../constants/Colors';

import NeumorphicDropDownList from '../../../component/DropDownList';
import NeumorphicTextInput from '../../../component/NeumorphicTextInput';
import { useFormik } from 'formik';
import { addProductSchema } from '../../../utils/FormSchema';
import NeumorphicButton from '../../../component/NeumorphicButton';
import { Icon, ListItem } from '@rneui/base';
import { useDispatch } from 'react-redux';
import AlertModal from '../../../component/AlertModal';
import { CheckBox } from '@rneui/themed';
import Toast from 'react-native-toast-message';
import NeumorphDatePicker from '../../../component/NeumorphDatePicker';
import ImageViewer from '../../../component/ImageViewer';
import * as ImagePicker from 'react-native-image-picker';
import { getCategory } from '../../../redux/slices/category&product/category/getCategoryListSlice';
import moment from 'moment';
import {
  addProduct,
  updateProduct,
} from '../../../redux/slices/category&product/product/addUpdateProductSlice';
import { getProductDetailById } from '../../../redux/slices/category&product/product/getProductDetailSlice';
import { apiBaseUrl } from '../../../../config';
import { getAllSupplier } from '../../../redux/slices/commonApi';
import ScreensLabel from '../../../constants/ScreensLabel';
import { store } from '../../../redux/store';
const AddUpdateProductScreen = ({ navigation, route }) => {
  const edit_id = route?.params?.edit_id;
  const { isDarkMode } = store.getState().getDarkMode;
  const label = ScreensLabel();
  const [edit, setEdit] = useState({});
  const [allCategory, setAllCategory] = useState([]);
  const [allSupplier, setAllSupplier] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openFromDate, setOpenFromDate] = useState(false);
  const [openToDate, setOpenToDate] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState(0);
  const dispatch = useDispatch();

  const AVAILABILTY_STATUS = [
    { label: 'IN STOCK', value: '1' },
    { label: 'OUT STOCK', value: '2' },
  ];
  const PUBLISHED_STATUS = [
    { label: 'NOT PUBLISHED', value: '0' },
    { label: 'PUBLISHED', value: '1' },
  ];

  useEffect(() => {
    fetchAllCategory();
    fetchAllSuuplier();
    requestCameraPermission();
    requestExternalWritePermission();

    if (edit_id) {
      fetchSingleData(edit_id);
    }
  }, [edit_id]);

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
  const selectPhotoTapped = async docType => {
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
          onPress: () => PhotoTapped('library', docType),
        },
        {
          text: 'capture Photo',
          onPress: () => {
            PhotoTapped('camera', docType);
          },
        },
      ],
    );
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
              { text: 'OK', onPress: () => {} },
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

  const sendImageFunc = async (imageresponse, type, docType) => {
    const imageData = imageresponse.assets[0].uri;
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
        formik.setFieldValue(`image_url`, imageFormData);
        break;

      default:
        break;
    }
  };

  const formik = useFormik({
    enableReinitialize: 'true',
    initialValues: {
      category_id: edit?.category_id || '',
      product_name: edit?.product_name || '',
      price: edit?.price ? edit?.price.toString() : '',
      quantity: edit?.quantity ? edit?.quantity.toString() : '',
      alert_quantity: edit?.alert_quantity
        ? edit?.alert_quantity.toString()
        : '',
      supplier_id: edit?.supplier_id || '',
      manufacturing_date: edit?.manufacturing_date || '',
      expiry_date: edit?.expiry_date || '',
      availability_status: edit?.availability_status || '1',
      is_published: edit?.is_published || '0',
      description: edit?.description || '',
      image_url: edit?.image_url || null,
    },
    validationSchema: addProductSchema,

    onSubmit: (values, { resetForm }) => {
      handleSubmit(values, resetForm);
    },
  });

  const handleSubmit = async (values, resetForm) => {
    const formData = new FormData();
    formData.append('category_id', values.category_id);
    formData.append('product_name', values.product_name);
    formData.append('price', values.price);
    formData.append('quantity', values.quantity);
    formData.append('alert_quantity', values.alert_quantity);
    formData.append('supplier_id', values.supplier_id);
    formData.append(
      'manufacturing_date',
      moment(values.manufacturing_date).format('YYYY-MM-DD'),
    );
    formData.append(
      'expiry_date',
      moment(values.expiry_date).format('YYYY-MM-DD'),
    );
    formData.append('availability_status', values.availability_status);
    formData.append('is_published', values.is_published);
    formData.append('description', values.description);
    formData.append('image_url', values.image_url);

    if (edit.id) {
      formData.append('id', edit_id);
    }

    try {
      setLoading(true);
      const res = edit_id
        ? await dispatch(updateProduct(formData)).unwrap()
        : await dispatch(addProduct(formData)).unwrap();

      if (res.status) {
        setLoading(false);
        navigation.navigate('ProductListScreen');
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

  /*function for fetching category data*/
  const fetchAllCategory = async () => {
    try {
      const result = await dispatch(
        getCategory({ isDropdown: false }),
      ).unwrap();

      if (result.status) {
        const rData = result?.data?.map(itm => ({
          label: itm?.category_name,
          value: itm?.id,
        }));

        setAllCategory(rData);
      } else {
        setAllCategory([]);
      }
    } catch (error) {
      setAllCategory([]);
    }
  };
  /*function for fetching supplier data*/
  const fetchAllSuuplier = async () => {
    try {
      const result = await dispatch(getAllSupplier()).unwrap();

      if (result.status) {
        const rData = result?.data?.map(itm => ({
          label: itm?.supplier_name,
          value: itm?.id,
        }));

        setAllSupplier(rData);
      } else {
        setAllSupplier([]);
      }
    } catch (error) {
      setAllSupplier([]);
    }
  };

  /*function for fetching single detail of employees*/
  const fetchSingleData = async () => {
    try {
      const result = await dispatch(getProductDetailById(edit_id)).unwrap();

      if (result.status) {
        setEdit(result?.data);
      } else {
        Toast.show({
          type: 'error',
          text1: result?.message,
          position: 'bottom',
        });
        setEdit([]);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });
      setEdit([]);
    }
  };

  const accordionData = [
    { title: 'Basic details', content: 'Content for Item 1' },
    { title: 'Poduct DETAILS', content: 'Content for Item 3' },
  ];

  const handlePress = index => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const getFormError = (errors, index) => {
    let indexArray = [];

    if (errors.category_id || errors.product_name || errors.price) {
      indexArray.push(0);
    }
    if (errors.quantity || errors.alert_quantity) {
      indexArray.push(1);
    }

    if (errors.address) {
      indexArray.push(2);
    }

    return indexArray;
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors().screenBackground,
      }}>
      <CustomeHeader
        headerTitle={
          edit_id
            ? `${label.PRODUCT} ${label.UPDATE}`
            : `${label.PRODUCT} ${label.ADD}`
        }
      />
      <ScrollView>
        <View style={styles.inpuntContainer}>
          {accordionData.map((item, index) => (
            <ListItem.Accordion
              containerStyle={{
                backgroundColor: isDarkMode
                  ? Colors().cardBackground
                  : Colors().inputDarkShadow,
                borderRadius: 8,
              }}
              theme={{ colors: { background: Colors().red } }}
              icon={
                <Icon
                  name="down"
                  type={IconType.AntDesign}
                  size={20}
                  color={Colors().pureBlack}></Icon>
              }
              content={
                <>
                  <ListItem.Content style={{}}>
                    <ListItem.Title
                      style={[styles.title, { color: Colors().purple }]}>
                      {item?.title}
                      <>
                        {getFormError(formik.errors, index).includes(index) && (
                          <Icon
                            name="error-outline"
                            type={IconType.MaterialIcons}
                            color={Colors().red}></Icon>
                        )}
                      </>
                    </ListItem.Title>
                  </ListItem.Content>
                </>
              }
              isExpanded={index === openIndex}
              onPress={() => {
                handlePress(index);
              }}>
              {/*view for basic detail*/}
              {index == 0 && (
                <ListItem.Content>
                  <View style={{ rowGap: 2 }}>
                    <NeumorphicDropDownList
                      title={'category name'}
                      required={true}
                      data={allCategory}
                      value={formik.values.category_id}
                      onChange={val => {
                        formik.setFieldValue(`category_id`, val.value);
                      }}
                      errorMessage={formik.errors.category_id}
                    />

                    <NeumorphicTextInput
                      title={'product name'}
                      required={true}
                      errorMessage={formik.errors.product_name}
                      width={WINDOW_WIDTH * 0.92}
                      value={formik.values.product_name}
                      onChangeText={formik.handleChange('product_name')}
                    />

                    <NeumorphicTextInput
                      title={'price'}
                      required={true}
                      width={WINDOW_WIDTH * 0.92}
                      value={formik.values.price}
                      onChangeText={formik.handleChange('price')}
                      keyboardType="numeric"
                      errorMessage={formik.errors.price}
                    />

                    <NeumorphicDropDownList
                      title={'supplier'}
                      data={allSupplier}
                      value={formik.values.supplier_id}
                      onChange={val => {
                        formik.setFieldValue(`supplier_id`, val.value);
                      }}
                    />

                    <View style={styles.twoItemView}>
                      <View style={styles.leftView}>
                        <NeumorphDatePicker
                          height={WINDOW_HEIGHT * 0.06}
                          width={WINDOW_WIDTH * 0.42}
                          title={'Manufac.date'}
                          iconPress={() => setOpenFromDate(!openFromDate)}
                          valueOfDate={
                            formik.values.manufacturing_date
                              ? moment(formik.values.manufacturing_date).format(
                                  'DD/MM/YYYY',
                                )
                              : formik.values.manufacturing_date
                          }
                          modal
                          open={openFromDate}
                          date={new Date()}
                          mode="datetime"
                          onConfirm={date => {
                            formik.setFieldValue(`manufacturing_date`, date);

                            setOpenFromDate(false);
                          }}
                          onCancel={() => {
                            setOpenFromDate(false);
                          }}></NeumorphDatePicker>
                      </View>
                      <View style={styles.rightView}>
                        <NeumorphDatePicker
                          height={WINDOW_HEIGHT * 0.06}
                          width={WINDOW_WIDTH * 0.42}
                          title={'Expiry date'}
                          iconPress={() => setOpenToDate(!openToDate)}
                          valueOfDate={
                            formik.values.expiry_date
                              ? moment(formik.values.expiry_date).format(
                                  'DD/MM/YYYY',
                                )
                              : formik.values.expiry_date
                          }
                          modal
                          open={openToDate}
                          date={new Date()}
                          mode="datetime"
                          onConfirm={date => {
                            formik.setFieldValue(`expiry_date`, date);

                            setOpenToDate(false);
                          }}
                          onCancel={() => {
                            setOpenToDate(false);
                          }}></NeumorphDatePicker>
                      </View>
                    </View>

                    <NeumorphicTextInput
                      title={'product description'}
                      height={WINDOW_HEIGHT * 0.09}
                      width={WINDOW_WIDTH * 0.92}
                      value={formik.values.description}
                      multiline
                      onChangeText={formik.handleChange('description')}
                    />
                  </View>
                </ListItem.Content>
              )}

              {/*view for bank details*/}
              {index == 1 && (
                <ListItem.Content style={{ rowGap: 8 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={[styles.title, { color: Colors().pureBlack }]}>
                      availability status{' '}
                    </Text>
                    <Icon
                      name="asterisk"
                      type={IconType.FontAwesome5}
                      size={8}
                      color={Colors().red}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      width: '100%',
                      justifyContent: 'space-between',
                    }}>
                    {AVAILABILTY_STATUS.map((radioButton, index) => (
                      <>
                        <CheckBox
                          key={index}
                          containerStyle={{
                            backgroundColor: Colors().screenBackground,
                            padding: 0,
                          }}
                          textStyle={{
                            fontFamily: Colors().fontFamilyBookMan,
                            fontWeight: '500',
                            color: Colors().pureBlack,
                          }}
                          checkedIcon="dot-circle-o"
                          uncheckedIcon="circle-o"
                          title={radioButton.label}
                          //   disabled={id ? true : false}
                          checked={
                            formik.values.availability_status ===
                            radioButton.value
                          }
                          onPress={() => {
                            // setComplaintFor(radioButton.value);
                            formik.setFieldValue(
                              'availability_status',
                              radioButton.value,
                            );
                          }}
                          checkedColor={Colors().aprroved}
                        />
                      </>
                    ))}
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={[styles.title, { color: Colors().pureBlack }]}>
                      PUBLISH SCHEDULE{' '}
                    </Text>
                    <Icon
                      name="asterisk"
                      type={IconType.FontAwesome5}
                      size={8}
                      color={Colors().red}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      width: '100%',
                      justifyContent: 'space-between',
                    }}>
                    {PUBLISHED_STATUS.map((radioButton, index) => (
                      <>
                        <CheckBox
                          key={index}
                          containerStyle={{
                            backgroundColor: Colors().screenBackground,
                            padding: 0,
                          }}
                          textStyle={{
                            fontFamily: Colors().fontFamilyBookMan,
                            fontWeight: '500',
                            color: Colors().pureBlack,
                          }}
                          checkedIcon="dot-circle-o"
                          uncheckedIcon="circle-o"
                          title={radioButton.label}
                          //   disabled={id ? true : false}
                          checked={
                            formik.values.is_published === radioButton.value
                          }
                          onPress={() => {
                            // setComplaintFor(radioButton.value);
                            formik.setFieldValue(
                              'is_published',
                              radioButton.value,
                            );
                          }}
                          checkedColor={Colors().aprroved}
                        />
                      </>
                    ))}
                  </View>

                  <View style={styles.twoItemView}>
                    <View style={styles.leftView}>
                      <NeumorphicTextInput
                        height={WINDOW_HEIGHT * 0.06}
                        width={WINDOW_WIDTH * 0.42}
                        title={'quantity'}
                        required={true}
                        errorMessage={formik.errors.quantity}
                        value={formik.values.quantity}
                        keyboardType="number-pad"
                        // maxLength={10}
                        onChangeText={formik.handleChange('quantity')}
                      />
                    </View>
                    <View style={styles.rightView}>
                      <NeumorphicTextInput
                        height={WINDOW_HEIGHT * 0.06}
                        width={WINDOW_WIDTH * 0.42}
                        title={'Alert Quantity'}
                        required={true}
                        value={formik.values.alert_quantity}
                        keyboardType="number-pad"
                        // maxLength={12}
                        onChangeText={formik.handleChange('alert_quantity')}
                        errorMessage={formik.errors.alert_quantity}
                      />
                    </View>
                  </View>

                  {formik.values.image_url && (
                    <TouchableOpacity
                      onPress={() => {
                        setImageModalVisible(true),
                          setImageUri(
                            edit_id && !formik.values.image_url.uri
                              ? `${apiBaseUrl}${formik.values.image_url}`
                              : formik.values.image_url.uri,
                          );
                      }}>
                      <Image
                        source={{
                          uri:
                            edit_id && !formik.values.image_url.uri
                              ? `${apiBaseUrl}${formik.values.image_url}`
                              : formik.values.image_url.uri,
                        }}
                        style={styles.Image}
                      />
                    </TouchableOpacity>
                  )}

                  <View style={styles.btnView}>
                    <NeumorphicButton
                      title={'Image'}
                      titleColor={Colors().pending}
                      btnHeight={WINDOW_HEIGHT * 0.05}
                      onPress={() => selectPhotoTapped('document')}
                      btnRadius={2}
                      iconName={'upload'}
                      iconType={IconType.Feather}
                      iconColor={Colors().black2}
                      loading={loading}
                    />
                  </View>
                </ListItem.Content>
              )}
              {/*view for Addresses details*/}

              <ListItem.Chevron />
            </ListItem.Accordion>
          ))}

          {/*view for modal of upate */}
          {updateModalVisible && (
            <AlertModal
              visible={updateModalVisible}
              iconName={'clock-edit-outline'}
              icontype={IconType.MaterialCommunityIcons}
              iconColor={Colors().aprroved}
              textToShow={'ARE YOU SURE YOU WANT TO UPDATE THIS!!'}
              cancelBtnPress={() => setUpdateModalVisible(!updateModalVisible)}
              ConfirmBtnPress={() => {
                formik.handleSubmit(), setUpdateModalVisible(false);
              }}
            />
          )}

          {imageModalVisible && (
            <ImageViewer
              visible={imageModalVisible}
              imageUri={imageUri}
              cancelBtnPress={() => setImageModalVisible(!imageModalVisible)}
            />
          )}
          <View style={{ alignSelf: 'center', marginVertical: 10 }}>
            <NeumorphicButton
              title={edit_id ? `${label.UPDATE}` : `${label.ADD}`}
              titleColor={Colors().purple}
              onPress={() => {
                edit_id ? setUpdateModalVisible(true) : formik.handleSubmit();
              }}
              loading={loading}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddUpdateProductScreen;

const styles = StyleSheet.create({
  inpuntContainer: {
    rowGap: 10,
    // backgroundColor: 'red',
    margin: WINDOW_WIDTH * 0.05,
  },
  btnView: {
    alignSelf: 'center',
    marginTop: WINDOW_HEIGHT * 0.01,
    // marginBottom: WINDOW_HEIGHT * 0.01,
  },

  Image: {
    height: 40,
    width: WINDOW_WIDTH * 0.9,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: Colors().gray,
  },
  title: {
    fontSize: 12,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
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
