/*    ----------------Created Date :: 5- March -2024   ----------------- */
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomeHeader from '../../component/CustomeHeader';
import IconType from '../../constants/IconType';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../utils/ScreenLayout';
import RNRestart from 'react-native-restart';
import Images from '../../constants/Images';
import DataNotFound from '../../component/DataNotFound';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import InternalServer from '../../component/InternalServer';
import * as ImagePicker from 'react-native-image-picker';
import {apiBaseUrl} from '../../../config';
import Loader from '../../component/Loader';
import FloatingAddButton from '../../component/FloatingAddButton';
import NeuomorphAvatar from '../../component/NeuomorphAvatar';
import {Avatar, Badge, Icon, Switch} from '@rneui/themed';
import {updateProfile} from '../../redux/slices/profile/addUpdateProfileSlice';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {logout} from '../../redux/slices/authSlice';
import {toggleDarkMode} from '../../redux/slices/getdarkModeSlice';
import Colors from '../../constants/Colors';
import {getUnreadNotificationCount} from '../../redux/slices/profile/getNotificationSlice';

import NeumorphCard from '../../component/NeumorphCard';
import ScreensLabel from '../../constants/ScreensLabel';
import {getAllProfileDetail} from '../../redux/slices/profile/getProfileDetailSlice';
import {toggleLanguage} from '../../redux/slices/getLanguageSlice';

const ProfileScreen = ({navigation, route}) => {
  const screenLabel = ScreensLabel();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [count, setCount] = useState('');
  const listData = useSelector(state => state.getProfileDetail);
  // const {user} = useSelector(selectUser);
  const data = listData?.data?.data;
  const {isDarkMode} = useSelector(state => state.getDarkMode);
  const {isEnglish} = useSelector(state => state.getLanguage);

  useEffect(() => {
    requestCameraPermission(), requestExternalWritePermission();
    dispatch(getAllProfileDetail());
    unreadNotificatoinCount();
  }, [isFocused]);

  const unreadNotificatoinCount = async () => {
    const result = await dispatch(getUnreadNotificationCount()).unwrap();
    if (result?.status) {
      setCount(result?.data.totalUnreadNotifications);
    } else {
      setCount('');
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

        ImagePicker?.launchCamera(options, response => {
          if (response?.didCancel) {
          } else if (response?.error) {
          } else if (response?.customButton) {
          } else {
            let source = {
              type: 'application/png',
              uri: response?.assets[0]?.uri,
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
          sendImageFunc(response, 'pdf');
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

    const formadata = new FormData();
    formadata.append('image', imageFormData);
    formadata.append('email', data?.email);
    formadata.append('contact_no', data?.contact_no);
    formadata.append('name', data?.name);

    updateProfileImage(formadata);
  };

  const updateProfileImage = async reqBody => {
    const res = await dispatch(updateProfile(reqBody)).unwrap();

    if (res?.status) {
      Toast.show({
        type: 'success',
        text1: res?.message,
        position: 'bottom',
      });
      dispatch(getAllProfileDetail());
    } else {
      Toast.show({
        type: 'error',
        text1: res?.message,
        position: 'bottom',
      });
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader
        headerTitle={screenLabel.MY_PROFILE}
        leftIconPress={() => {}}
      />

      {listData?.isLoading ? (
        <Loader />
      ) : !listData?.isLoading &&
        !listData?.isError &&
        listData?.data?.status ? (
        <>
          <ScrollView>
            <View style={styles.mainView}>
              {/* card for stock request  detail */}
              <View style={{alignSelf: 'center'}}>
                <NeuomorphAvatar gap={8}>
                  <Avatar
                    size={150}
                    rounded
                    source={{
                      uri: data?.image
                        ? `${apiBaseUrl}${data?.image}`
                        : `${
                            Image.resolveAssetSource(Images.DEFAULT_PROFILE).uri
                          }`,
                    }}
                    onPress={() => navigation.navigate('ProfileScreen')}
                  />
                </NeuomorphAvatar>
                <View style={{position: 'absolute', right: 0, bottom: 10}}>
                  <NeuomorphAvatar gap={10}>
                    <Icon
                      name="camera"
                      type={IconType.Feather}
                      size={20}
                      color={Colors().skyBule}
                      onPress={() => selectPhotoTapped('document')}
                    />
                  </NeuomorphAvatar>
                </View>
              </View>
              <Text style={styles.useNameTxt} numberOfLines={2}>
                {data?.name}
              </Text>

              <View style={styles.addressView}>
                <Icon
                  name="location"
                  type={IconType.EvilIcons}
                  size={20}
                  color={Colors().skyBule}
                />
                <Text
                  style={[styles.addressTxt, {color: Colors().black2}]}
                  numberOfLines={2}>
                  {data?.address_1}
                </Text>
              </View>

              <Image
                source={Images.PROFILE_BACKGROUND}
                resizeMode="cover"
                style={styles.purpleBackground}
              />
              <View style={{rowGap: 10}}>
                <NeumorphCard>
                  <View style={[styles.tagsView]}>
                    <Icon
                      name="user"
                      type={IconType.AntDesign}
                      size={20}
                      color={Colors().purple}
                      style={{}}
                    />
                    <View style={styles.tagTitleView}>
                      <Text
                        style={[
                          styles.cardHeadingTxt,
                          {color: Colors().pureBlack},
                        ]}>
                        {screenLabel.MY_PROFILE}
                      </Text>
                      <View style={{padding: 5}}>
                        <Icon
                          style={styles.cardHeadingTxt}
                          name="navigate-next"
                          type={IconType.MaterialIcons}
                          size={20}
                          color={Colors().pureBlack}
                          onPress={() =>
                            navigation.navigate('UpdateProfileScreen', {
                              userData: data,
                            })
                          }
                        />
                      </View>
                    </View>
                  </View>
                </NeumorphCard>

                <NeumorphCard>
                  <View style={[styles.tagsView]}>
                    <Icon
                      name="password"
                      type={IconType.MaterialIcons}
                      size={20}
                      color={Colors().purple}
                      style={{}}
                    />
                    <View style={styles.tagTitleView}>
                      <Text
                        style={[
                          styles.cardHeadingTxt,
                          {color: Colors().pureBlack},
                        ]}>
                        {screenLabel.CHANGE_PASSWORD}
                      </Text>
                      <View style={{padding: 5}}>
                        <Icon
                          style={styles.cardHeadingTxt}
                          name="navigate-next"
                          type={IconType.MaterialIcons}
                          size={20}
                          color={Colors().pureBlack}
                          onPress={() =>
                            navigation.navigate('UpdatePasswordScreen')
                          }
                        />
                      </View>
                    </View>
                  </View>
                </NeumorphCard>

                <NeumorphCard>
                  <View style={[styles.tagsView]}>
                    <Icon
                      name="message1"
                      type={IconType.AntDesign}
                      size={20}
                      color={Colors().purple}
                      style={{}}
                    />
                    <View style={styles.tagTitleView}>
                      <Text
                        style={[
                          styles.cardHeadingTxt,
                          {color: Colors().pureBlack},
                        ]}>
                        {screenLabel.MESSAGE}
                      </Text>

                      <View style={{padding: 5}}>
                        {count ? (
                          <Badge
                            value={count}
                            badgeStyle={{
                              backgroundColor: 'red',
                            }}
                            containerStyle={{}}
                            onPress={() =>
                              navigation.navigate('NotificationsListScreen')
                            }
                          />
                        ) : (
                          <Icon
                            style={styles.cardHeadingTxt}
                            name="navigate-next"
                            type={IconType.MaterialIcons}
                            size={20}
                            color={Colors().pureBlack}
                            onPress={() =>
                              navigation.navigate('NotificationScreen')
                            }
                          />
                        )}
                      </View>
                    </View>
                  </View>
                </NeumorphCard>
                <NeumorphCard>
                  <View style={[styles.tagsView]}>
                    <Icon
                      name="theme-light-dark"
                      type={IconType.MaterialCommunityIcons}
                      size={20}
                      color={Colors().purple}
                      style={{}}
                    />
                    <View style={styles.tagTitleView}>
                      <Text
                        style={[
                          styles.cardHeadingTxt,
                          {color: Colors().pureBlack},
                        ]}>
                        {screenLabel.DARK_MODE}
                      </Text>

                      <Switch
                        trackColor={{false: '#767577', true: '#81b0ff'}}
                        thumbColor={isDarkMode ? '#f5dd4b' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={async () => {
                          await dispatch(toggleDarkMode());
                          RNRestart.restart();
                        }}
                        value={isDarkMode}
                      />
                    </View>
                  </View>
                </NeumorphCard>
                <NeumorphCard>
                  <View style={[styles.tagsView]}>
                    <Icon
                      name="language"
                      type={IconType.Entypo}
                      size={20}
                      color={Colors().purple}
                      style={{}}
                    />
                    <View style={styles.tagTitleView}>
                      <Text
                        style={[
                          styles.cardHeadingTxt,
                          {color: Colors().pureBlack},
                        ]}>
                        {screenLabel.LANGUAGE}
                      </Text>

                      <Switch
                        trackColor={{false: '#767577', true: '#81b0ff'}}
                        thumbColor={isEnglish ? '#f5dd4b' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={async () => {
                          await dispatch(toggleLanguage());
                        }}
                        value={isEnglish}
                      />
                    </View>
                  </View>
                </NeumorphCard>

                <NeumorphCard>
                  <View style={[styles.tagsView]}>
                    <Icon
                      name="logout"
                      type={IconType.MaterialIcons}
                      size={20}
                      color={Colors().purple}
                      style={{}}
                    />
                    <View style={styles.tagTitleView}>
                      <Text
                        style={[
                          styles.cardHeadingTxt,
                          {color: Colors().pureBlack},
                        ]}>
                        {screenLabel.LOGOUT}
                      </Text>
                      <View style={{padding: 5}}>
                        <Icon
                          style={styles.cardHeadingTxt}
                          name="navigate-next"
                          type={IconType.MaterialIcons}
                          size={20}
                          color={Colors().pureBlack}
                          onPress={async () => {
                            await AsyncStorage.removeItem('cms-sa-token');
                            dispatch(logout());
                            RNRestart.restart();
                          }}
                        />
                      </View>
                    </View>
                  </View>
                </NeumorphCard>
              </View>
            </View>
          </ScrollView>
        </>
      ) : listData?.isError ? (
        <InternalServer />
      ) : !listData?.data?.status &&
        listData?.data?.message === 'Data not found' ? (
        <>
          <DataNotFound />
          {/* View for floating button */}
          <View
            style={{
              marginTop: WINDOW_HEIGHT * 0.8,
              marginLeft: WINDOW_WIDTH * 0.8,
              position: 'absolute',
            }}>
            <FloatingAddButton
              backgroundColor={Colors().purple}
              onPress={() => {
                navigation.navigate('AddUpdateWorkQuotationScreen');
              }}></FloatingAddButton>
          </View>
        </>
      ) : (
        <InternalServer />
      )}
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  mainView: {
    padding: 15,
    rowGap: 8,
    paddingBottom: 100,
  },
  cardContainer: {
    margin: WINDOW_WIDTH * 0.03,
    flex: 1,
    rowGap: 5,
  },
  tagsView: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: WINDOW_HEIGHT * 0.015,
  },
  tagTitleView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    marginLeft: WINDOW_WIDTH * 0.05,
    alignItems: 'center',
  },
  addressView: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
  },
  cardHeadingTxt: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 21,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    maxWidth: WINDOW_WIDTH * 0.5,
  },
  useNameTxt: {
    color: Colors().purple,
    fontWeight: '600',
    fontSize: 15,
    marginLeft: WINDOW_WIDTH * 0.02,
    fontFamily: Colors().fontFamilyBookMan,
    textTransform: 'uppercase',
    alignSelf: 'center',
    maxWidth: WINDOW_WIDTH * 0.7,
  },
  addressTxt: {
    fontWeight: '600',
    fontSize: 12,
    marginLeft: WINDOW_WIDTH * 0.02,
    fontFamily: Colors().fontFamilyBookMan,
    textTransform: 'uppercase',
    alignSelf: 'center',
    maxWidth: WINDOW_WIDTH * 0.7,
  },
  purpleBackground: {
    width: WINDOW_WIDTH * 1.1,
    height: WINDOW_HEIGHT * 0.18,
    marginLeft: -WINDOW_WIDTH * 0.04,
    marginTop: -WINDOW_HEIGHT * 0.09,
  },
});
