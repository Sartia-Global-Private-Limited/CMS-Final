/*    ----------------Created Date :: 05-Oct -2024   ----------------- */
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {useFormik} from 'formik';
import Colors from '../../constants/Colors';
import CustomeHeader from '../../component/CustomeHeader';
import IconType from '../../constants/IconType';
import NeumorphicTextInput from '../../component/NeumorphicTextInput';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../utils/ScreenLayout';
import NeumorphicButton from '../../component/NeumorphicButton';
import NeumorphicDropDownList from '../../component/DropDownList';
import {Icon} from '@rneui/base';
import Toast from 'react-native-toast-message';
import AlertModal from '../../component/AlertModal';
import * as ImagePicker from 'react-native-image-picker';
import {useIsFocused} from '@react-navigation/native';
import {
  addAdminContractors,
  getAdminAllPlanPricing,
  updateAdminContractors,
} from '../../services/authApi';
import Images from '../../constants/Images';
import {apiBaseUrl} from '../../../config';
import {addContractorsSchema} from '../../utils/FormSchema';
import {getContractorDetailById} from '../../redux/slices/contractor/getAllContractorListSlice';

const AddUpdateContractorsForm = ({navigation, route}) => {
  /* declare props constant variale*/
  const dispatch = useDispatch();
  const item = route?.params?.item;
  const isFocused = useIsFocused();
  const [energyCompany, setEnergyCompany] = useState([]);
  const [itemData, setItemData] = useState({});
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllENData();
    getContractorDetails();
  }, [isFocused]);

  const getAllENData = async () => {
    try {
      const res = await getAdminAllPlanPricing();
      if (res.status) {
        const rdata =
          res &&
          res?.data?.map(i => ({
            label: `${i?.name} ( ₹ ${i?.price} / ${i?.duration})`,
            value: i?.id,
          }));
        setEnergyCompany(rdata);
      } else {
        setEnergyCompany([]);
      }
    } catch (error) {}
  };

  const getContractorDetails = async () => {
    try {
      const res = await dispatch(
        getContractorDetailById({id: item?.admin_id, type: 'Contractor'}),
      ).unwrap();

      if (res.status) {
        setItemData(res?.data);
      } else {
        setItemData({});
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const formik = useFormik({
    enableReinitialize: 'true',
    initialValues: {
      name: itemData?.name || '',
      email: itemData?.email || '',
      password: itemData?.password || '',
      contact_no: itemData?.contact_no || '',
      alt_number: itemData?.alt_number || '',
      address_1: itemData?.address_1 || '',
      country: itemData?.country || '',
      city: itemData?.city || '',
      pin_code: itemData?.pin_code || '',
      status: itemData?.status || '',
      plan_id: itemData?.plan_id || '',
      image: itemData?.image || '',
    },
    validationSchema: addContractorsSchema,

    onSubmit: values => {
      handleSubmit(values);
    },
  });

  const handleSubmit = async values => {
    const reqBody = {
      name: values?.name || '',
      email: values?.email || '',
      password: values?.password || '',
      contact_no: values?.contact_no || '',
      alt_number: values?.alt_number || '',
      address_1: values?.address_1 || '',
      country: values?.country || '',
      city: values?.city || '',
      pin_code: values?.pin_code || '',
      status: values?.status || '',
      plan_id: values?.plan_id || '',
      image: values?.image || '',
      type: 'Contractor',
    };

    if (item?.admin_id) {
      reqBody['id'] = item?.admin_id;
    }

    try {
      setLoading(true);
      const res = item?.admin_id
        ? await updateAdminContractors(reqBody)
        : await addAdminContractors(reqBody);

      if (res?.status) {
        Toast.show({
          type: 'success',
          text1: res?.message,
          position: 'bottom',
        });
        setLoading(false);
        navigation.goBack();
      } else {
        Toast.show({
          type: 'error',
          text1: res?.message,
          position: 'bottom',
        });
        setLoading(false);
      }
    } catch (error) {
      console.log('error', error);
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

  const selectPhotoTapped = async keyToSet => {
    return Alert.alert(
      // the title of the alert dialog
      'UPLOAD IMAGE',
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
          onPress: () => PhotoTapped('library', keyToSet),
        },
        {
          text: 'capture Photo',
          onPress: () => {
            PhotoTapped('camera', keyToSet);
          },
        },
      ],
    );
  };

  const PhotoTapped = async (type, keyToSet) => {
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
            sendImageFunc(response, 'img', keyToSet);
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
        includeBase64: true,
      };

      ImagePicker.launchImageLibrary(options, response => {
        if (response.didCancel) {
        } else if (response.error) {
        } else if (response.customButton) {
        } else {
          if (response.assets[0].fileSize < 80000) {
            sendImageFunc(response, 'img', keyToSet);
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

  const sendImageFunc = async (imageresponse, type, keyToSet) => {
    const imageData = `data:${imageresponse.assets[0].type};base64,${imageresponse.assets[0].base64}`;
    formik.setFieldValue('image', imageData);
  };

  const GST_TREATMENT_TYPE = [
    {
      label: 'ACTIVE',
      value: '1',
    },
    {
      label: 'INACTIVE',
      value: '0',
    },
  ];

  return (
    <SafeAreaView
      style={{
        flex: 1,
        // height: WINDOW_HEIGHT,
        backgroundColor: Colors().screenBackground,
      }}>
      <CustomeHeader
        headerTitle={item?.admin_id ? 'update Contractor' : 'Add Contractor'}
      />

      <ScrollView>
        <View style={styles.inputContainer}>
          <View style={{rowGap: 8}}>
            <View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.title}>Name </Text>
                <Icon
                  name="asterisk"
                  type={IconType.FontAwesome5}
                  size={8}
                  color={Colors().red}
                />
              </View>
              <NeumorphicTextInput
                placeHolderTxt={''}
                value={formik.values.name}
                onChangeText={formik.handleChange('name')}
                style={styles.inputText}
              />

              {formik.touched.name && formik.errors.name && (
                <Text style={styles.errorMesage}>{formik.errors.name}</Text>
              )}
            </View>

            <View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.title}>Email </Text>
                <Icon
                  name="asterisk"
                  type={IconType.FontAwesome5}
                  size={8}
                  color={Colors().red}
                />
              </View>
              <NeumorphicTextInput
                placeHolderTxt={''}
                value={formik.values.email}
                onChangeText={formik.handleChange('email')}
                style={styles.inputText}
              />

              {formik.touched.email && formik.errors.email && (
                <Text style={styles.errorMesage}>{formik.errors.email}</Text>
              )}
            </View>

            {!item?.admin_id && (
              <View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={styles.title}>Password </Text>
                  <Icon
                    name="asterisk"
                    type={IconType.FontAwesome5}
                    size={8}
                    color={Colors().red}
                  />
                </View>
                <NeumorphicTextInput
                  placeHolderTxt={''}
                  value={formik.values.password}
                  onChangeText={formik.handleChange('password')}
                  style={styles.inputText}
                />

                {formik.touched.password && formik.errors.password && (
                  <Text style={styles.errorMesage}>
                    {formik.errors.password}
                  </Text>
                )}
              </View>
            )}

            <View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.title}>Contact No. </Text>
                <Icon
                  name="asterisk"
                  type={IconType.FontAwesome5}
                  size={8}
                  color={Colors().red}
                />
              </View>
              <NeumorphicTextInput
                placeHolderTxt={''}
                value={formik.values.contact_no}
                onChangeText={formik.handleChange('contact_no')}
                style={styles.inputText}
              />

              {formik.touched.contact_no && formik.errors.contact_no && (
                <Text style={styles.errorMesage}>
                  {formik.errors.contact_no}
                </Text>
              )}
            </View>
            <View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.title}>Alternate No. </Text>
              </View>
              <NeumorphicTextInput
                placeHolderTxt={''}
                value={formik.values.alt_number}
                onChangeText={formik.handleChange('alt_number')}
                style={styles.inputText}
              />

              {formik.touched.alt_number && formik.errors.alt_number && (
                <Text style={styles.errorMesage}>
                  {formik.errors.alt_number}
                </Text>
              )}
            </View>
            <View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.title}>Address </Text>
              </View>
              <NeumorphicTextInput
                placeHolderTxt={''}
                multiline={true}
                value={formik.values.address_1}
                onChangeText={formik.handleChange('address_1')}
                style={{...styles.inputText, height: 'auto'}}
              />

              {formik.touched.address_1 && formik.errors.address_1 && (
                <Text style={styles.errorMesage}>
                  {formik.errors.address_1}
                </Text>
              )}
            </View>

            <View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.title}>Country </Text>
              </View>
              <NeumorphicTextInput
                placeHolderTxt={''}
                value={formik.values.country}
                onChangeText={formik.handleChange('country')}
                style={styles.inputText}
              />

              {formik.touched.country && formik.errors.country && (
                <Text style={styles.errorMesage}>{formik.errors.country}</Text>
              )}
            </View>
            <View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.title}>City </Text>
              </View>
              <NeumorphicTextInput
                placeHolderTxt={''}
                value={formik.values.city}
                onChangeText={formik.handleChange('city')}
                style={styles.inputText}
              />

              {formik.touched.city && formik.errors.city && (
                <Text style={styles.errorMesage}>{formik.errors.city}</Text>
              )}
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.title}>Pin Code </Text>
            </View>
            <NeumorphicTextInput
              placeHolderTxt={''}
              value={formik.values.pin_code}
              onChangeText={formik.handleChange('pin_code')}
              style={styles.inputText}
            />
            {formik.touched.pin_code && formik.errors.pin_code && (
              <Text style={styles.errorMesage}>{formik.errors.pin_code}</Text>
            )}
          </View>

          <View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.title}>Status </Text>
            </View>
            <NeumorphicDropDownList
              placeholder={'SELECT ...'}
              data={GST_TREATMENT_TYPE}
              labelField={'label'}
              valueField={'value'}
              value={formik.values.status}
              renderItem={renderDropDown}
              onChange={val => {
                formik.setFieldValue(`status`, val.value);
              }}
            />
            {formik.touched.status && formik.errors.status && (
              <Text style={styles.errorMesage}>{formik.errors.status}</Text>
            )}
          </View>
          <View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.title}>plan and Pricing </Text>
              <Icon
                name="asterisk"
                type={IconType.FontAwesome}
                size={8}
                color={Colors().red}
              />
            </View>
            <NeumorphicDropDownList
              placeholder={'SELECT ...'}
              data={energyCompany}
              labelField={'label'}
              valueField={'value'}
              value={+formik.values.plan_id}
              renderItem={renderDropDown}
              onChange={val => {
                formik.setFieldValue(`plan_id`, val.value);
              }}
            />
            {formik.touched.status && formik.errors.status && (
              <Text style={styles.errorMesage}>{formik.errors.status}</Text>
            )}
          </View>

          <View>
            <Text style={styles.title}>Image</Text>
            <TouchableOpacity
              style={[
                styles.modalImage,
                {backgroundColor: Colors().inputDarkShadow},
              ]}
              onPress={() => selectPhotoTapped()}>
              {!formik?.values?.image && (
                <Icon
                  style={{alignSelf: 'center', marginTop: 10}}
                  name={'image'}
                  type={IconType.EvilIcons}
                  size={80}
                  color={Colors().gray2}
                />
              )}
              {formik?.values?.image && (
                <Image
                  style={{
                    height: 100,
                    width: WINDOW_WIDTH * 0.92,
                    borderRadius: 8,
                  }}
                  source={{
                    uri:
                      formik?.values?.image != ''
                        ? `${apiBaseUrl}${formik?.values?.image}`
                        : `${
                            Image.resolveAssetSource(Images.DEFAULT_PROFILE).uri
                          }`,
                  }}
                />
              )}
            </TouchableOpacity>
            {formik.touched.image && formik.errors.image && (
              <Text style={styles.errorMesage}>{formik.errors.image}</Text>
            )}
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
                item?.admin
                  ? setUpdateModalVisible(true)
                  : formik.handleSubmit();
              }}
              loading={loading}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddUpdateContractorsForm;

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
