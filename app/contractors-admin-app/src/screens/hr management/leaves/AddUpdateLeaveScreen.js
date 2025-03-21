import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import Colors from '../../../constants/Colors';
import CustomeHeader from '../../../component/CustomeHeader';
import IconType from '../../../constants/IconType';
import NeumorphicTextInput from '../../../component/NeumorphicTextInput';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../utils/ScreenLayout';
import ImageViewer from '../../../component/ImageViewer';
import { assignLeaveSchema } from '../../../utils/FormSchema';
import NeumorphicButton from '../../../component/NeumorphicButton';
import NeumorphicDropDownList from '../../../component/DropDownList';
import {
  getAllEmplist,
  getLeaveTypelist,
} from '../../../redux/slices/commonApi';
import { Avatar } from '@rneui/base';
import { apiBaseUrl } from '../../../../config';
import { Image } from 'react-native';
import Images from '../../../constants/Images';
import NeuomorphAvatar from '../../../component/NeuomorphAvatar';
import moment from 'moment';
import NeumorphDatePicker from '../../../component/NeumorphDatePicker';
import { createLeave } from '../../../redux/slices/hr-management/leave/addUpdateLeaveSlice';
import Toast from 'react-native-toast-message';
import ScreensLabel from '../../../constants/ScreensLabel';
import Fileupploader from '../../../component/Fileupploader';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Icon } from '@rneui/themed';

const AddUpdateLeaveScreen = ({ navigation, route }) => {
  /* declare props constant variale*/
  const user_id = route?.params?.user_id;
  const label = ScreensLabel();

  /*declare hooks variable here */
  const dispatch = useDispatch();

  /*declare useState variable here */

  const [modalVisible, setModalVisible] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState(false);
  const [confirm, setConfrim] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState([]);
  const [leaveTypeData, setLeaveTypeData] = useState([]);
  const refRBSheet = useRef(RBSheet);
  const [openFromDate, setOpenFromDate] = useState(false);
  const [openToDate, setOpenToDate] = useState(false);

  useEffect(() => {
    fetchUsersData();
    fetchLeaveTypeData();
  }, []);

  const formik = useFormik({
    enableReinitialize: 'true',
    initialValues: {
      user_id: '',
      leave_type_id: '',
      start_date: '',
      end_date: '',
      reason: '',
      image: null,
    },
    validationSchema: assignLeaveSchema,

    onSubmit: values => {
      handleSubmit(values);
    },
  });

  const handleSubmit = async values => {
    const formData = new FormData();
    formData.append('user_id', values.user_id);
    formData.append('leave_type_id', values.leave_type_id);
    formData.append(
      'start_date',
      moment(values.start_date).format('YYYY-MM-DD'),
    );
    formData.append('end_date', moment(values.end_date).format('YYYY-MM-DD'));
    formData.append('reason', values.reason);
    formData.append('image', values.image);
    formData.append('status', 'approved');

    try {
      if (user_id) {
        setModalVisible(true);
        setConfrim(formData);
      } else {
        setLoading(true);
        const createLeaveResult = await dispatch(
          createLeave(formData),
        ).unwrap();

        if (createLeaveResult?.status) {
          setLoading(false);
          Toast.show({
            type: 'success',
            text1: createLeaveResult?.message,
            position: 'bottom',
          });

          navigation.navigate('LeaveListingScreen');
        } else {
          Toast.show({
            type: 'error',
            text1: createLeaveResult?.message,
            position: 'bottom',
          });

          setLoading(false);
        }
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });
    }
  };

  /*function for fetching User list data*/
  const fetchUsersData = async () => {
    try {
      const result = await dispatch(getAllEmplist()).unwrap();
      if (result.status) {
        const rData = result?.data.map(item => {
          return {
            label: item?.name,
            value: item?.id,
            image: item?.image,
          };
        });
        setUserData(rData);
      } else {
        setUserData([]);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });
      setUserData([]);
    }
  };
  /*function for fetching User list data*/
  const fetchLeaveTypeData = async () => {
    try {
      const result = await dispatch(getLeaveTypelist()).unwrap();
      if (result.status) {
        const rData = result?.data.map(item => {
          return {
            label: item?.leave_type,
            value: item?.id,
          };
        });
        setLeaveTypeData(rData);
      } else {
        setLeaveTypeData([]);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });
      setLeaveTypeData([]);
    }
  };

  /*Ui of dropdown list*/
  const renderDropDown = item => {
    return (
      <View style={[styles.listView]}>
        {item?.image !== undefined && (
          <NeuomorphAvatar gap={4}>
            <Avatar
              size={30}
              rounded
              source={{
                uri: item?.image
                  ? `${apiBaseUrl}${item?.image}`
                  : `${Image.resolveAssetSource(Images.DEFAULT_PROFILE).uri}`,
              }}
            />
          </NeuomorphAvatar>
        )}

        {item?.label && (
          <Text
            numberOfLines={1}
            style={[
              styles.inputText,
              { marginLeft: 10, color: Colors().pureBlack },
            ]}>
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
      <CustomeHeader headerTitle={`${label.ASSIGN} ${label.LEAVE}`} />

      <ScrollView>
        <View style={styles.inputContainer}>
          <View style={{ rowGap: 2 }}>
            <Text style={[styles.title, { color: Colors().pureBlack }]}>
              user name
            </Text>
            <NeumorphicDropDownList
              RightIconName="caretdown"
              RightIconType={IconType.AntDesign}
              placeholder={'SELECT ...'}
              data={userData}
              labelField={'label'}
              valueField={'value'}
              renderItem={renderDropDown}
              value={formik.values.user_id}
              search={false}
              editable={false}
              activeColor={Colors().skyBule}
              placeholderStyle={[
                styles.inputText,
                { color: Colors().pureBlack },
              ]}
              selectedTextStyle={[
                styles.selectedTextStyle,
                { color: Colors().pureBlack },
              ]}
              style={[styles.inputText, { color: Colors().pureBlack }]}
              containerStyle={{
                backgroundColor: Colors().inputLightShadow,
              }}
              onChange={val => {
                formik.setFieldValue(`user_id`, val?.value);
              }}
            />
          </View>
          {formik.touched.user_id && formik.errors.user_id && (
            <Text style={styles.errorMesage}>{formik.errors.user_id}</Text>
          )}
          <View style={{ rowGap: 2 }}>
            <Text style={[styles.title, { color: Colors().pureBlack }]}>
              LEAVE TYPE
            </Text>
            <NeumorphicDropDownList
              RightIconName="caretdown"
              RightIconType={IconType.AntDesign}
              placeholder={'SELECT ...'}
              data={leaveTypeData}
              labelField={'label'}
              valueField={'value'}
              value={formik.values.leave_type_id}
              search={false}
              editable={false}
              renderItem={renderDropDown}
              activeColor={Colors().skyBule}
              placeholderStyle={[
                styles.inputText,
                { color: Colors().pureBlack },
              ]}
              selectedTextStyle={[
                styles.selectedTextStyle,
                { color: Colors().pureBlack },
              ]}
              style={[styles.inputText, { color: Colors().pureBlack }]}
              containerStyle={{
                backgroundColor: Colors().inputLightShadow,
              }}
              onChange={val => {
                formik.setFieldValue(`leave_type_id`, val?.value);
              }}
            />
          </View>
          {formik.touched.leave_type_id && formik.errors.leave_type_id && (
            <Text style={styles.errorMesage}>
              {formik.errors.leave_type_id}
            </Text>
          )}
          <View style={styles.twoItemView}>
            <>
              <View style={styles.leftView}>
                <Text style={[styles.title, { color: Colors().pureBlack }]}>
                  From{' '}
                </Text>
                <NeumorphDatePicker
                  height={WINDOW_HEIGHT * 0.06}
                  width={WINDOW_WIDTH * 0.4}
                  iconPress={() => setOpenFromDate(!openFromDate)}
                  valueOfDate={
                    formik.values.start_date
                      ? moment(formik.values.start_date).format('DD/MM/YYYY')
                      : ''
                  }
                  modal
                  open={openFromDate}
                  date={new Date()}
                  mode="date"
                  onConfirm={date => {
                    formik.setFieldValue(`start_date`, date);

                    setOpenFromDate(false);
                  }}
                  onCancel={() => {
                    setOpenFromDate(false);
                  }}></NeumorphDatePicker>
                {formik.touched.start_date && formik.errors.start_date && (
                  <Text style={styles.errorMesage}>
                    {formik.errors.start_date}
                  </Text>
                )}
              </View>
              <View style={styles.rightView}>
                <Text style={[styles.title, { color: Colors().pureBlack }]}>
                  To
                </Text>

                <NeumorphDatePicker
                  height={WINDOW_HEIGHT * 0.06}
                  width={WINDOW_WIDTH * 0.4}
                  iconPress={() => setOpenToDate(!openToDate)}
                  valueOfDate={
                    formik.values.end_date
                      ? moment(formik.values.end_date).format('DD/MM/YYYY')
                      : ''
                  }
                  modal
                  minimumDate={
                    formik.values.start_date
                      ? moment(formik.values.start_date)
                      : new Date()
                  }
                  open={openToDate}
                  date={new Date()}
                  mode="date"
                  onConfirm={date => {
                    formik.setFieldValue(`end_date`, date);

                    setOpenToDate(false);
                  }}
                  onCancel={() => {
                    setOpenToDate(false);
                  }}></NeumorphDatePicker>
                {formik.touched.end_date && formik.errors.end_date && (
                  <Text style={styles.errorMesage}>
                    {formik.errors.end_date}
                  </Text>
                )}
              </View>
            </>
          </View>

          <View style={{ rowGap: 2 }}>
            <Text style={[styles.title, { color: Colors().pureBlack }]}>
              NOTE
            </Text>
            <NeumorphicTextInput
              placeHolderTxt={'TYPE...'}
              placeHolderTxtColor={Colors().pureBlack}
              width={WINDOW_WIDTH * 0.92}
              height={WINDOW_HEIGHT * 0.08}
              value={formik.values.reason}
              numberOfLines={2}
              multiline={true}
              onChangeText={formik.handleChange('reason')}
              style={[styles.inputText, { color: Colors().pureBlack }]}
            />
          </View>
          {formik.touched.reason && formik.errors.reason && (
            <Text style={styles.errorMesage}>{formik.errors.reason}</Text>
          )}

          <View style={{ flexDirection: 'row' }}>
            {formik.values.image && (
              <View style={{ marginRight: 10 }}>
                {/* Add margin for spacing between items */}
                <View style={styles.crossIcon}>
                  <Icon
                    name="close"
                    color={Colors().pureBlack}
                    type={IconType.AntDesign}
                    size={15}
                    onPress={() => formik.setFieldValue(`image`, '')}
                  />
                </View>

                {(formik.values.image?.type == 'application/msword' ||
                  formik.values.image?.type ==
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document') && (
                  <View style={{ alignSelf: 'center' }}>
                    <View
                      style={[
                        styles.Image,
                        { marginTop: 10, justifyContent: 'center' },
                      ]}>
                      <Icon
                        name="document-text-outline"
                        type={IconType.Ionicons}
                        size={50}
                        color={Colors().skyBule}
                      />
                    </View>
                  </View>
                )}

                {formik.values.image?.type == 'application/pdf' && (
                  <View style={{ alignSelf: 'center' }}>
                    <View
                      style={[
                        styles.Image,
                        { marginTop: 10, justifyContent: 'center' },
                      ]}>
                      <Icon
                        name="file-pdf-o"
                        type={IconType.FontAwesome}
                        size={45}
                        color={Colors().red}
                      />
                    </View>
                  </View>
                )}

                {(formik.values.image?.type == 'image/jpeg' ||
                  formik.values.image?.type == 'image/png') && (
                  <TouchableOpacity
                    style={{ alignSelf: 'center' }}
                    onPress={() => {
                      setImageModalVisible(true);

                      setImageUri(`${formik.values.image?.uri}`);
                    }}>
                    <Image
                      source={{
                        uri: `${formik.values.image?.uri}`,
                      }}
                      style={[styles.Image, { marginTop: 10 }]}
                    />
                  </TouchableOpacity>
                )}
                <Text
                  style={[
                    styles.title,
                    {
                      color: Colors().pureBlack,
                      alignSelf: 'center',
                      maxWidth: WINDOW_WIDTH * 0.2,
                      textAlign: 'center',
                      width: '100%',
                    },
                  ]}>
                  {}
                  {formik.values.image?.name}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.btnView}>
            <NeumorphicButton
              title={'Document'}
              titleColor={Colors().pending}
              onPress={() => refRBSheet.current.open()}
              btnRadius={2}
              iconName={'upload'}
              iconType={IconType.Feather}
              iconColor={Colors().black2}
              loading={loading}
            />
          </View>
          {formik.touched.image && formik.errors.image && (
            <Text style={styles.errorMesage}>{formik.errors.image}</Text>
          )}

          <Fileupploader
            btnRef={refRBSheet}
            cameraOption={{
              base64: false,
              multiselet: false,
            }}
            cameraResponse={item => {
              if (!item) return; // Check if item has a value
              const imageFormData = {
                uri: item?.uri,
                name: item?.name,
                type: item?.type,
              };
              formik.setFieldValue(`image`, imageFormData);
              refRBSheet.current.close();
            }}
            galleryOption={{ base64: false, multiselet: false }}
            galleryResponse={item => {
              if (!item) return; // Check if item has a value
              const imageFormData = {
                uri: item?.uri,
                name: item?.name,
                type: item?.type,
              };
              formik.setFieldValue(`image`, imageFormData);
              refRBSheet.current.close();
            }}
            documentOption={{
              base64: false,
              multiselet: false,
              fileType: ['pdf', 'doc', 'docx'],
            }}
            documentResponse={item => {
              if (!item) return; // Check if item has a value
              const imageFormData = {
                uri: item?.uri,
                name: item?.name,
                type: item?.type,
              };
              formik.setFieldValue(`image`, imageFormData);
              refRBSheet.current.close();
            }}
          />
          {/* modal view for document*/}
          {imageModalVisible && (
            <ImageViewer
              visible={imageModalVisible}
              imageUri={imageUri}
              cancelBtnPress={() => setImageModalVisible(!imageModalVisible)}
            />
          )}

          <View style={{ alignSelf: 'center', marginVertical: 10 }}>
            <NeumorphicButton
              title={user_id ? label.UPDATE : label.ADD}
              titleColor={Colors().purple}
              onPress={formik.handleSubmit}
              loading={loading}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddUpdateLeaveScreen;

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    marginHorizontal: WINDOW_WIDTH * 0.04,
    marginTop: WINDOW_HEIGHT * 0.02,
    rowGap: 10,
  },

  inputText: {
    fontSize: 15,
    fontWeight: '300',
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  errorMesage: {
    color: Colors().red,
    alignSelf: 'flex-start',
    marginLeft: 15,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  title: {
    fontSize: 12,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  listView: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 3,
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
  rightView: {
    flexDirection: 'column',
    flex: 1,
    rowGap: 8,
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
  btnView: {
    alignSelf: 'center',
    marginTop: WINDOW_HEIGHT * 0.01,
  },
  Image: {
    height: WINDOW_HEIGHT * 0.07,
    width: WINDOW_WIDTH * 0.2,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: Colors().gray,
  },
  crossIcon: {
    backgroundColor: Colors().red,
    borderRadius: 50,

    padding: '1%',
    position: 'absolute',
    right: -7,
    top: 3,
    zIndex: 1,
    justifyContent: 'center',
  },
});
