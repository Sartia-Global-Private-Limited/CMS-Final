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
  addUserContractors,
  updateAdminContractors,
  updateUserContractors,
} from '../../services/authApi';
import Images from '../../constants/Images';
import {apiBaseUrl} from '../../../config';
import NeumorphDatePicker from '../../component/NeumorphDatePicker';
import moment from 'moment';
import {getContractorDetailById} from '../../redux/slices/contractor/getAllContractorListSlice';

const AddUpdateContractUsersScreen = ({navigation, route}) => {
  /* declare props constant variale*/
  const dispatch = useDispatch();
  const item = route?.params?.item;
  const contractor_id = route?.params?.contractor_id;
  const isFocused = useIsFocused();
  const [openStartDate, setOpenStartDate] = useState(false);
  const [itemData, setItemData] = useState({});
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getContractorDetails();
  }, [isFocused]);

  const getContractorDetails = async () => {
    try {
      const res = await dispatch(
        getContractorDetailById({id: item?.admin_id, type: 'User'}),
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
    enableReinitialize: true,
    initialValues: {
      name: itemData?.name || '',
      email: itemData?.email || '',
      password: itemData?.password || '',
      mobile: itemData?.mobile || '',
      joining_date: itemData?.joining_date || '',
      status: itemData?.status || '',
      image: itemData?.image || '',
    },

    onSubmit: values => {
      handleSubmit(values);
    },
  });

  const handleSubmit = async values => {
    const reqBody = {
      name: values?.name || '',
      email: values?.email || '',
      password: values?.password || '',
      mobile: values?.mobile || '',
      status: values?.status || '',
      joining_date: values?.joining_date,
      image: values?.image || '',
      type: 'User',
      contractor_id: contractor_id,
    };

    if (item?.admin_id) {
      reqBody['id'] = item?.admin_id;
      reqBody['contact_no'] = values?.mobile;
    }

    try {
      setLoading(true);
      const res = item?.admin_id
        ? await updateAdminContractors(reqBody)
        : await addUserContractors(reqBody);

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
            sendImageFunc(source, 'img', keyToSet);
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
        headerTitle={item?.admin_id ? 'update User' : 'Add User'}
      />

      <ScrollView>
        <View style={styles.inputContainer}>
          <View style={{rowGap: 8}}>
            <View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.title}>Name </Text>
              </View>
              <NeumorphicTextInput
                placeHolderTxt={''}
                width={WINDOW_WIDTH * 0.92}
                value={formik?.values?.name}
                onChangeText={formik.handleChange('name')}
                style={styles.inputText}
              />

              {formik?.touched?.name && formik?.errors?.name && (
                <Text style={styles.errorMesage}>{formik?.errors?.name}</Text>
              )}
            </View>

            <View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.title}>Email </Text>
              </View>
              <NeumorphicTextInput
                placeHolderTxt={''}
                width={WINDOW_WIDTH * 0.92}
                value={formik?.values?.email}
                onChangeText={formik.handleChange('email')}
                style={styles.inputText}
              />

              {formik?.touched?.email && formik?.errors?.email && (
                <Text style={styles.errorMesage}>{formik?.errors?.email}</Text>
              )}
            </View>

            {!item?.admin_id && (
              <View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={styles.title}>Password </Text>
                </View>
                <NeumorphicTextInput
                  placeHolderTxt={''}
                  width={WINDOW_WIDTH * 0.92}
                  value={formik?.values?.password}
                  onChangeText={formik.handleChange('password')}
                  style={styles.inputText}
                />

                {formik?.touched?.password && formik?.errors?.password && (
                  <Text style={styles.errorMesage}>
                    {formik?.errors?.password}
                  </Text>
                )}
              </View>
            )}

            <View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.title}>Contact No. </Text>
              </View>
              <NeumorphicTextInput
                placeHolderTxt={''}
                width={WINDOW_WIDTH * 0.92}
                value={formik?.values?.mobile}
                onChangeText={formik.handleChange('mobile')}
                style={styles.inputText}
              />

              {formik?.touched?.mobile && formik?.errors?.mobile && (
                <Text style={styles.errorMesage}>{formik?.errors?.mobile}</Text>
              )}
            </View>

            <View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.title}>Joining Date </Text>
              </View>

              <NeumorphDatePicker
                height={38}
                width={
                  formik?.values?.joining_date
                    ? WINDOW_WIDTH * 0.9
                    : WINDOW_WIDTH * 0.87
                }
                withoutShadow={true}
                iconPress={() => setOpenStartDate(!openStartDate)}
                valueOfDate={
                  formik?.values?.joining_date
                    ? moment(formik?.values?.joining_date).format('DD/MM/YYYY')
                    : ''
                }
                modal
                open={openStartDate}
                date={new Date()}
                mode="date"
                onConfirm={date => {
                  formik.setFieldValue(`joining_date`, date);
                  setOpenStartDate(false);
                }}
                onCancel={() => {
                  setOpenStartDate(false);
                }}
              />

              {formik?.touched?.joining_date &&
                formik?.errors?.joining_date && (
                  <Text style={styles.errorMesage}>
                    {formik?.errors?.joining_date}
                  </Text>
                )}
            </View>
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
              value={formik?.values?.status}
              renderItem={renderDropDown}
              onChange={val => {
                formik.setFieldValue(`status`, val.value);
              }}
            />
            {formik?.touched?.status && formik?.errors?.status && (
              <Text style={styles.errorMesage}>{formik?.errors?.status}</Text>
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
            {formik?.touched?.image && formik?.errors?.image && (
              <Text style={styles.errorMesage}>{formik?.errors?.image}</Text>
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

export default AddUpdateContractUsersScreen;

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
