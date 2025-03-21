import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Colors from '../../constants/Colors';
import IconType from '../../constants/IconType';
import CustomeHeader from '../../component/CustomeHeader';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../utils/ScreenLayout';
import FloatingAddButton from '../../component/FloatingAddButton';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../component/Loader';
import InternalServer from '../../component/InternalServer';
import DataNotFound from '../../component/DataNotFound';
import { getTaskDetailById } from '../../redux/slices/task-mangement/getTaskDetailSlice';
import { Badge, Icon } from '@rneui/themed';
import moment from 'moment';
import {
  addTaskComment,
  updateMainTaskStatus,
} from '../../redux/slices/task-mangement/addUpdateTaskSlice';
import Toast from 'react-native-toast-message';
import ScreensLabel from '../../constants/ScreensLabel';
import CustomeCard from '../../component/CustomeCard';
import CardDropDown from '../../component/CardDropDown';
import Fileupploader from '../../component/Fileupploader';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useFormik } from 'formik';
import ImageViewer from '../../component/ImageViewer';
import { Menu, MenuItem } from 'react-native-material-menu';
const TaskDetailScreen = ({ navigation, route }) => {
  const edit_id = route?.params?.id;
  const user_id = route?.params?.assign_to;

  /* declare props constant variale*/
  const label = ScreensLabel();
  const refRBSheet = useRef(RBSheet);
  /*declare hooks variable here */
  const [imageUri, setImageUri] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const listData = useSelector(state => state.getTaskDetail);
  const data = listData?.data?.data;

  const STATUS_ARRAY = [
    { value: 'assign', label: 'assign' },
    { value: 'in progress', label: 'in progress' },
    { value: 'completed', label: 'completed' },
  ];

  useEffect(() => {
    dispatch(getTaskDetailById(edit_id));
  }, [edit_id]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      user_id: user_id,
      task_id: edit_id,
      remark: '',
      attachment: '',
    },
    onSubmit: (values, { resetForm }) => {
      handleSubmit(values, resetForm);
    },
  });

  const handleSubmit = async (values, resetForm) => {
    const formdata = new FormData();
    formdata.append('task_id', values?.task_id);
    formdata.append('user_id', values?.user_id);
    formdata.append('remark', values?.remark);
    formdata.append('attachment', values?.attachment);

    const result = await dispatch(addTaskComment(formdata)).unwrap();
    if (result?.status) {
      Toast.show({
        type: 'success',
        text1: result?.message,
        position: 'bottom',
      });
      navigation.navigate('TaskActivityListScreen', { edit_id: edit_id });
      resetForm();
    } else {
      Toast.show({
        type: 'error',
        text1: result?.message,
        position: 'bottom',
      });
      resetForm();
    }
  };

  /* for getting color of status*/
  function getStatusColor(action) {
    switch (action) {
      case 'assign':
        return Colors().red;
      case 'in progress':
        return Colors().pending;
      case 'completed':
        return Colors().aprroved;

      default:
        return 'black';
    }
  }

  /* delete Stock request  function with id */
  const changeTaskStatus = async status => {
    const reqBody = {
      status: status,
      task_id: JSON.stringify(edit_id),
    };

    try {
      const updateResult = await dispatch(
        updateMainTaskStatus(reqBody),
      ).unwrap();

      if (updateResult?.status === true) {
        Toast.show({
          type: 'success',
          text1: updateResult?.message,
          position: 'bottom',
        });

        dispatch(getTaskDetailById(edit_id));
      } else {
        Toast.show({
          type: 'error',
          text1: updateResult?.message,
          position: 'bottom',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });
    }
  };
  const menuData = ['task comment'];
  const hideMenu = val => {
    const valueToSend = val?.split(' ').join('');

    setVisible(false);
    switch (valueToSend) {
      case 'taskcomment':
        navigation.navigate('TaskActivityListScreen', {
          edit_id: edit_id,
        });
        break;

      default:
        break;
    }
  };
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <CustomeHeader
        headerTitle={`${label.TASK} ${label.DETAIL}`}
        lefIconName={'chevron-back'}
        lefIconType={IconType.Ionicons}
        rightIconName={'dots-three-vertical'}
        rightIcontype={IconType.Entypo}
        rightIconPress={() => setVisible(!visible)}
      />

      {listData?.isLoading ? (
        <Loader />
      ) : !listData?.isLoading &&
        !listData?.isError &&
        listData?.data?.status ? (
        <>
          <ScrollView>
            <View style={{}}>
              <View style={{ alignSelf: 'flex-end' }}>
                <Menu
                  visible={visible}
                  onRequestClose={() => setVisible(false)}
                  style={{}}>
                  {menuData.map(itm => (
                    <MenuItem
                      style={{
                        backgroundColor: Colors().cardBackground,
                      }}
                      textStyle={
                        [styles.cardtext, { color: Colors().pureBlack }] // Otherwise, use the default text style
                      }
                      onPress={() => {
                        hideMenu(itm);
                      }}>
                      {itm}
                    </MenuItem>
                  ))}
                </Menu>
              </View>
              {/* card for   detail */}

              <CustomeCard
                avatarImage={data?.assign_user_image}
                data={[
                  {
                    key: 'user name',
                    value: data?.assign_user_name,
                    keyColor: Colors().skyBule,
                  },
                  { key: 'task name', value: data?.title },
                  { key: 'project name', value: data?.project_name },
                  { key: 'Task category', value: data?.task_category_name },
                  {
                    key: 'collaborators',
                    component: (
                      <View style={styles.userNameView}>
                        {data?.collaborators_list.map((itm, index) => (
                          <View
                            style={{
                              flexDirection: 'row',
                              marginLeft: 5,
                            }}>
                            <Badge value={index + 1} status="primary" />
                            <Text
                              numberOfLines={1}
                              ellipsizeMode="tail"
                              style={[
                                styles.cardtext,
                                { marginLeft: 5, color: Colors().pureBlack },
                              ]}>
                              {itm?.name}
                            </Text>
                          </View>
                        ))}
                      </View>
                    ),
                  },
                  {
                    key: 'Start date',
                    value: moment(data?.start_date).format('DD/MM/YYYY'),
                    keyColor: Colors().aprroved,
                  },
                  {
                    key: 'end date',
                    value: moment(data?.end_date).format('DD/MM/YYYY'),
                    keyColor: Colors().red,
                  },
                  {
                    key: 'change status',
                    component: (
                      <CardDropDown
                        data={STATUS_ARRAY}
                        value={data.status}
                        onChange={val => {
                          changeTaskStatus(val.value);
                        }}
                      />
                    ),
                  },
                ]}
                status={[
                  {
                    key: 'status',
                    value: data?.status,
                    color: getStatusColor(data?.status),
                  },
                ]}
              />

              <View style={styles.writeCommentView}>
                <TextInput
                  placeholder="WRITE COMMENT"
                  style={[
                    styles.inputText,
                    {
                      marginLeft: WINDOW_WIDTH * 0.04,
                      width: '70%',
                      color: Colors().pureBlack,
                    },
                  ]}
                  onChangeText={formik.handleChange(`remark`)}
                />
                <View style={styles.commentIconView}>
                  <Icon
                    name="attachment"
                    type={IconType.Entypo}
                    color={Colors().purple}
                    size={30}
                    onPress={() => refRBSheet.current.open()}
                  />
                  <Icon
                    name="send"
                    type={IconType.MaterialCommunityIcons}
                    color={Colors().purple}
                    size={30}
                    onPress={formik.handleSubmit}
                  />
                </View>
              </View>

              {formik?.values?.attachment && (
                <View style={[styles.userNameView, { columnGap: 10 }]}>
                  <TouchableOpacity
                    onPress={() => {
                      setImageModalVisible(true);
                      setImageUri(formik?.values?.attachment?.uri);
                    }}>
                    <Image
                      source={{
                        uri: formik?.values?.attachment?.uri,
                      }}
                      style={[styles.Image, { marginTop: 10 }]}
                    />

                    <View style={styles.crossIcon}>
                      <Icon
                        name="close"
                        type={IconType.AntDesign}
                        size={15}
                        color={'white'}
                        onPress={() => formik.setFieldValue(`attachment`, '')}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              )}

              {imageModalVisible && (
                <ImageViewer
                  visible={imageModalVisible}
                  imageUri={imageUri}
                  cancelBtnPress={() =>
                    setImageModalVisible(!imageModalVisible)
                  }
                  // downloadBtnPress={item => downloadImageRemote(item)}
                />
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

                  formik.setFieldValue(`attachment`, imageFormData);
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

                  formik.setFieldValue(`attachment`, imageFormData);
                  refRBSheet.current.close();
                }}
              />
            </View>
          </ScrollView>
        </>
      ) : listData?.isError ? (
        <InternalServer />
      ) : !listData?.data?.status &&
        listData?.data?.message == 'Data not found' ? (
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
                navigation.navigate('AddUpdateSuplierScreen');
              }}></FloatingAddButton>
          </View>
        </>
      ) : (
        <InternalServer />
      )}
    </SafeAreaView>
  );
};

export default TaskDetailScreen;

const styles = StyleSheet.create({
  cardtext: {
    fontSize: 12,
    fontWeight: '300',
    lineHeight: 21,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    flexShrink: 1,
    marginLeft: 2,
  },

  inputText: {
    fontSize: 15,
    fontWeight: '300',
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },

  writeCommentView: {
    height: WINDOW_HEIGHT * 0.055,

    backgroundColor: Colors().cardBackground,
    flexDirection: 'row',
    borderRadius: 50,
    borderColor: Colors().purple,
    borderWidth: 1,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  commentIconView: {
    flexDirection: 'row',
    marginRight: WINDOW_WIDTH * 0.03,
    columnGap: 15,
  },
  Image: {
    height: WINDOW_HEIGHT * 0.09,
    width: WINDOW_WIDTH * 0.3,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: Colors().gray,
  },
  userNameView: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignSelf: 'center',
  },
  crossIcon: {
    backgroundColor: Colors().red,
    borderRadius: 50,
    padding: '1%',
    position: 'absolute',
    right: -7,
    top: 5,
    zIndex: 1,
    justifyContent: 'center',
  },
});
