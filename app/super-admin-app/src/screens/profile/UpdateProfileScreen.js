/*    ----------------Created Date :: 5-March -2024   ----------------- */

import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import CustomeHeader from '../../component/CustomeHeader';
import IconType from '../../constants/IconType';
import Colors from '../../constants/Colors';
import AlertModal from '../../component/AlertModal';
import NeumorphicButton from '../../component/NeumorphicButton';
import * as ImagePicker from 'react-native-image-picker';
import NeumorphicTextInput from '../../component/NeumorphicTextInput';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../utils/ScreenLayout';
import {useFormik} from 'formik';
import {Icon} from '@rneui/themed';
import {MyprofileSchema} from '../../utils/FormSchema';
import Toast from 'react-native-toast-message';
import {updateProfile} from '../../redux/slices/profile/addUpdateProfileSlice';
import {apiBaseUrl} from '../../../config';

const UpdateProfileScreen = ({navigation, route}) => {
  const user = route?.params?.userData;
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [editAble, setEditAble] = useState(false);
  const [loading, setLoading] = useState(false);
  const [logo, setLogo] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {}, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: user?.name || '',
      email: user?.email || '',
      contact_no: user?.contact_no || '',
      company_logo: user?.company_logo || '',
    },
    validationSchema: MyprofileSchema,
    onSubmit: (values, {resetForm}) => {
      handleSubmit(values, resetForm);
    },
  });

  const handleSubmit = async (values, resetForm) => {
    const formadata = new FormData();
    formadata.append('company_logo', logo);
    formadata.append('email', values?.email);
    formadata.append('contact_no', values?.contact_no);
    formadata.append('name', values?.name);
    try {
      setLoading(true);
      const res = await dispatch(updateProfile(formadata)).unwrap();

      if (res.status) {
        setLoading(false);
        navigation.navigate('ProfileScreen');
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
      console.log('error', error);
      setLoading(false);
    }
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
              uri: response?.assets[0]?.uri,
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
    const imageFormData = {
      uri: imageresponse.assets[0].uri,
      name: imageresponse.assets[0].fileName,
      type: imageresponse.assets[0].type,
    };
    setLogo(imageFormData);
    formik.setFieldValue('company_logo', imageFormData.uri);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors().screenBackground,
      }}>
      <CustomeHeader
        headerTitle={'About User'}
        rightIconName={'edit'}
        rightIcontype={IconType.AntDesign}
        rightIconPress={() => setEditAble(!editAble)}
      />

      <ScrollView>
        <View style={styles.inpuntContainer}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.title}>name </Text>
            <Icon
              name="asterisk"
              type={IconType.FontAwesome}
              size={8}
              color={Colors().red}
            />
          </View>
          <NeumorphicTextInput
            width={WINDOW_WIDTH * 0.9}
            placeholder={'TYPE...'}
            style={styles.inputText}
            value={formik?.values?.name}
            editable={editAble}
            onChangeText={formik.handleChange(`name`)}
          />
          {formik?.touched?.name && formik?.errors?.name && (
            <Text style={styles.errorMesage}>{formik?.errors?.name}</Text>
          )}

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.title}>email </Text>
            <Icon
              name="asterisk"
              type={IconType.FontAwesome}
              size={8}
              color={Colors().red}
            />
          </View>
          <NeumorphicTextInput
            width={WINDOW_WIDTH * 0.9}
            placeholder={'TYPE...'}
            editable={editAble}
            style={styles.inputText}
            value={formik?.values?.email}
            onChangeText={formik.handleChange(`email`)}
          />
          {formik?.touched?.email && formik?.errors?.email && (
            <Text style={styles.errorMesage}>{formik?.errors?.email}</Text>
          )}
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.title}>Contact number </Text>
            <Icon
              name="asterisk"
              type={IconType.FontAwesome}
              size={8}
              color={Colors().red}
            />
          </View>
          <NeumorphicTextInput
            width={WINDOW_WIDTH * 0.9}
            placeholder={'TYPE...'}
            style={styles.inputText}
            value={formik?.values?.contact_no}
            onChangeText={formik.handleChange(`contact_no`)}
            keyboardType="numeric"
            maxLength={10}
            editable={editAble}
          />
          {formik?.touched?.contact_no && formik?.errors?.contact_no && (
            <Text style={styles.errorMesage}>{formik?.errors?.contact_no}</Text>
          )}
        </View>
        <View style={styles.inpuntContainer}>
          <Text style={styles.title}>Image</Text>
          <TouchableOpacity
            style={[{backgroundColor: Colors().inputDarkShadow}]}
            onPress={() => selectPhotoTapped()}>
            {!formik?.values?.company_logo && (
              <Icon
                style={{alignSelf: 'center', marginTop: 10}}
                name={'image'}
                type={IconType.EvilIcons}
                size={80}
                color={Colors().gray2}
              />
            )}
            {formik?.values?.company_logo && (
              <Image
                style={{
                  height: 100,
                  width: WINDOW_WIDTH * 0.85,
                  borderRadius: 8,
                }}
                source={{
                  uri:
                    formik?.values?.company_logo != ''
                      ? `${apiBaseUrl}${formik?.values?.company_logo}`
                      : `${
                          Image.resolveAssetSource(Images.DEFAULT_PROFILE).uri
                        }`,
                }}
              />
            )}
          </TouchableOpacity>
          <Text style={{fontSize: 16, fontWeight: '400', color: Colors().grey}}>
            ⓘ Logo image size should be between 8-20KB, with dimensions 50px
            height and 180px width.
          </Text>
          {formik.touched.company_logo && formik.errors.company_logo && (
            <Text style={styles.errorMesage}>{formik.errors.company_logo}</Text>
          )}
        </View>

        {editAble && (
          <View style={{alignSelf: 'center', marginVertical: 10}}>
            <NeumorphicButton
              title={'save'}
              titleColor={Colors().purple}
              onPress={() => {
                setUpdateModalVisible(true);
              }}
              loading={loading}
            />
          </View>
        )}

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
              formik.handleSubmit();
            }}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default UpdateProfileScreen;

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
});
