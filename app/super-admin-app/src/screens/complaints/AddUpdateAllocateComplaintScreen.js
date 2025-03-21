import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {useFormik} from 'formik';
import Colors from '../../constants/Colors';
import CustomeHeader from '../../component/CustomeHeader';
import IconType from '../../constants/IconType';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../utils/ScreenLayout';
import {allocateCompplaintViaSchema} from '../../utils/FormSchema';
import NeumorphicButton from '../../component/NeumorphicButton';
import NeumorphicDropDownList from '../../component/DropDownList';
import {
  getAllManagerList,
  getAllSuperVisorList,
  getAllFreeUserList,
  allocateComplaint,
  updateAllocateComplaint,
  holdComplaint,
  reworkComplaint,
} from '../../redux/slices/allocate/allocateComplaintSlice';
import {Avatar, Badge} from '@rneui/base';
import {apiBaseUrl} from '../../../config';
import Images from '../../constants/Images';
import NeuomorphAvatar from '../../component/NeuomorphAvatar';
import {getApprovedComlaintDetailById} from '../../redux/slices/complaint/getComplaintDetailSlice';
import Toast from 'react-native-toast-message';
import {Icon} from '@rneui/themed';
import AlertModal from '../../component/AlertModal';
import {MultiSelect} from 'react-native-element-dropdown';
import ScreensLabel from '../../constants/ScreensLabel';
import CustomeCard from '../../component/CustomeCard';

const AddUpdateAllocateComplaintScreen = ({navigation, route}) => {
  /* declare props constant variale*/
  const complaint_id = route?.params?.complaint_id;
  const type = route?.params?.type;

  /*declare hooks variable here */
  const label = ScreensLabel();
  const dispatch = useDispatch();

  /*declare useState variable here */
  const [loading, setLoading] = useState(false);
  const [managerData, setManagerData] = useState([]);
  const [superVisorData, setSuperVisorData] = useState([]);
  const [freeUserData, setFreeUserData] = useState([]);
  const [complaintData, setComplaintData] = useState([]);
  const [mangerId, setMangerId] = useState('');
  const [superVisorId, setSuperVisorId] = useState('');
  const [userId, setUserId] = useState('');
  const [removeModalVisble, setRemoveModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [removeId, setRemoveId] = useState('');

  useEffect(() => {
    fetchManagerList();
    fetchApprovedComlaintDetail();

    if (mangerId) {
      fetchSuperVisorList(mangerId);
    }
    if (superVisorId) {
      fetchFreeUserList(superVisorId);
    }
  }, [mangerId, superVisorId, removeId]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      area_manager_id: mangerId || '',
      supervisor_id: superVisorId || '',
      user_id: userId || '',
    },
    validationSchema: allocateCompplaintViaSchema,

    onSubmit: values => {
      handleSubmit(values);
    },
  });

  const handleSubmit = async values => {
    const reqBody = {
      complaint_id: JSON.stringify(complaint_id),
      area_manager_id: values.area_manager_id,
      supervisor_id: values.supervisor_id,
      user_id: values.user_id,
    };

    try {
      setLoading(true);
      if (type == 'update') {
        setUpdateModalVisible(true);
      }

      const allocateComplaintResult = await dispatch(
        type === 'updatejfj'
          ? setUpdateModalVisible(true)
          : type === 'hold'
          ? holdComplaint(reqBody)
          : type === 'rework'
          ? reworkComplaint(reqBody)
          : allocateComplaint(reqBody),
      ).unwrap();

      if (allocateComplaintResult?.status) {
        setLoading(false);

        Toast.show({
          type: 'success',
          text1: allocateComplaintResult?.message,
          position: 'bottom',
        });
        navigation.navigate('ApprovedComplaintListing');
      } else {
        Toast.show({
          type: 'info',
          text1: allocateComplaintResult?.message,
          position: 'bottom',
        });
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const fetchApprovedComlaintDetail = async () => {
    try {
      const res = await dispatch(
        getApprovedComlaintDetailById(complaint_id),
      ).unwrap();

      if (res?.status) {
        setComplaintData(res?.data);
        if (res?.data?.manager_and_supevisor?.areaManagerDetails) {
          setMangerId(res?.data?.manager_and_supevisor?.areaManagerDetails?.id);
        }
        if (res?.data?.manager_and_supevisor?.superVisorDetails) {
          setSuperVisorId(
            res?.data?.manager_and_supevisor?.superVisorDetails?.id,
          );
        }
        if (
          type !== 'update' &&
          res?.data?.manager_and_supevisor?.endUserDetails
        ) {
          setUserId(res?.data?.manager_and_supevisor?.endUserDetails[0]?.id);
        }

        if (
          type === 'update' &&
          res?.data?.manager_and_supevisor?.endUserDetails
        ) {
          const filterData =
            res?.data?.manager_and_supevisor?.endUserDetails.filter(
              item => item?.isAssigned == true,
            );

          const rData = filterData.map(item => {
            return item?.id;
          });

          setUserId(rData);
        }
      } else {
        setComplaintData([]);
        Toast.show({
          type: 'info',
          text1: res?.message,
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

  const fetchManagerList = async complaintId => {
    try {
      const fetchManagerResult = await dispatch(getAllManagerList()).unwrap();

      if (fetchManagerResult?.status === true) {
        const rData = fetchManagerResult?.data.map(item => {
          return {
            label: item?.name,
            value: item?.id,
            image: item?.image,
          };
        });
        setManagerData(rData);
      } else {
        Toast.show({
          type: 'info',
          text1: fetchManagerResult?.message,
          position: 'bottom',
        });
        setManagerData([]);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });
      setManagerData([]);
    }
  };

  const fetchSuperVisorList = async mangerId => {
    try {
      const fetchSuperVisorResult = await dispatch(
        getAllSuperVisorList(mangerId),
      ).unwrap();

      if (fetchSuperVisorResult?.status === true) {
        setSuperVisorData(fetchSuperVisorResult?.data);
      } else {
        Toast.show({
          type: 'info',
          text1: fetchSuperVisorResult?.message,
          position: 'bottom',
        });
        setSuperVisorData([]);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });
      setSuperVisorData([]);
    }
  };

  const fetchFreeUserList = async superVisorId => {
    try {
      const fetchFreeUserResult = await dispatch(
        getAllFreeUserList(superVisorId),
      ).unwrap();

      if (fetchFreeUserResult?.status === true) {
        setFreeUserData(fetchFreeUserResult?.data);
      } else {
        Toast.show({
          type: 'info',
          text1: fetchFreeUserResult?.message,
          position: 'bottom',
        });
        setFreeUserData([]);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });
      setFreeUserData([]);
    }
  };

  const updateAllocate = async () => {
    setUpdateModalVisible(false);
    setRemoveModalVisible(false);

    const reqBody = {
      action: [
        {
          [removeId ? 'remove' : 'add']: {
            assign_to: removeId ? [removeId] : formik?.values?.user_id,
          },
        },
      ],
      area_manager_id: formik?.values?.area_manager_id,
      complaints_id: complaint_id,
      supervisor_id: formik?.values?.supervisor_id,
    };

    try {
      const result = await dispatch(updateAllocateComplaint(reqBody)).unwrap();

      if (result?.status === true) {
        Toast.show({
          type: 'info',
          text1: result?.message,
          position: 'top',
        });
        if (removeId) {
          setRemoveId('');
        } else {
          navigation.navigate('ApprovedComplaintListing');
        }
      } else {
        Toast.show({
          type: 'info',
          text1: result?.message,
          position: 'top',
        });
        setRemoveId('');
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'top',
      });
      setRemoveId('');
    }
  };

  const managerDropdown = item => {
    return (
      <View
        style={[styles.listView, {backgroundColor: Colors().inputLightShadow}]}>
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

        <Text
          numberOfLines={1}
          style={[
            styles.inputText,
            {marginLeft: 10, color: Colors().pureBlack},
          ]}>
          {item.name}
        </Text>
      </View>
    );
  };

  const supervisorDropDown = item => {
    return (
      <TouchableOpacity
        disabled={
          !(
            item?.free_end_users <= 0 &&
            (type == 'allocate' || type == 'rework' || type == 'update')
          )
        }
        onPress={() => {
          if (
            (type == 'allocate' || type == 'rework' || type == 'update') &&
            item?.free_end_users <= 0
          ) {
            Toast.show({
              type: 'info',
              text1: 'Supervisor has no free end user',
              position: 'top',
            });
          }
        }}
        style={[
          styles.listView,
          {
            justifyContent: 'space-between',
            backgroundColor:
              (type == 'allocate' || type == 'rework' || type == 'update') &&
              item?.free_end_users <= 0
                ? Colors().darkShadow
                : Colors().inputLightShadow,
          },
        ]}>
        <View
          style={[
            styles.listView,
            {
              maxWidth:
                type == 'allocate' || type == 'rework' || type == 'update'
                  ? '50%'
                  : '100%',
              backgroundColor:
                (type == 'allocate' || type == 'rework' || type == 'update') &&
                item?.free_end_users <= 0
                  ? Colors().darkShadow
                  : Colors().inputLightShadow,
            },
          ]}>
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

          <Text
            numberOfLines={2}
            style={[
              styles.inputText,
              {marginLeft: 10, flexShrink: 1, color: Colors().pureBlack},
            ]}>
            {item.name}
          </Text>
        </View>
        {(type == 'allocate' || type == 'rework' || type == 'update') && (
          <View style={[styles.listView]}>
            <Text
              numberOfLines={1}
              style={[
                styles.inputText,
                {color: Colors().pureBlack, marginRight: 10},
              ]}>
              Free user
            </Text>
            <Badge
              value={item?.free_end_users}
              status={item?.free_end_users > 0 ? 'success' : 'error'}
            />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const freeEndUserDropDown = item => {
    return (
      <TouchableOpacity
        disabled={
          !(
            item?.isAssigned &&
            (type == 'allocate' || type == 'rework' || type == 'update')
          )
        }
        onPress={() => {
          if (
            (type == 'allocate' || type == 'rework' || type == 'update') &&
            item?.isAssigned
          ) {
            Toast.show({
              type: 'info',
              text1: 'Select Un Assigned User',
              position: 'top',
            });
          }
        }}
        style={[
          styles.listView,
          {
            justifyContent: 'space-between',
            backgroundColor:
              (type == 'allocate' || type == 'rework' || type == 'update') &&
              item?.isAssigned
                ? Colors().darkShadow
                : Colors().inputLightShadow,
          },
        ]}>
        <View
          style={[
            styles.listView,
            {
              maxWidth:
                type == 'allocate' || type == 'rework' || type == 'update'
                  ? '50%'
                  : '100%',
              backgroundColor:
                (type == 'allocate' || type == 'rework' || type == 'update') &&
                item?.isAssigned
                  ? Colors().darkShadow
                  : Colors().inputLightShadow,
            },
          ]}>
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

          <Text
            numberOfLines={2}
            style={[
              styles.inputText,
              {marginLeft: 10, flexShrink: 1, color: Colors().pureBlack},
            ]}>
            {item.name}
          </Text>
        </View>
        <View style={[styles.listView]}>
          {type === 'update' && item?.isAssigned && (
            <Icon
              name="delete"
              type={IconType.AntDesign}
              size={20}
              color={Colors().red}
              style={{marginRight: 8}}
              onPress={() => {
                setRemoveModalVisible(true), setRemoveId(item?.id);
              }}
            />
          )}

          {(type == 'allocate' || type == 'rework' || type == 'update') &&
            item?.isAssigned && (
              <Badge
                value={item?.isAssigned ? 'Assigned' : ''}
                status={item?.isAssigned ? 'success' : 'error'}
                textStyle={{fontSize: 15, alignSelf: 'center'}}
                badgeStyle={{height: 25}}
              />
            )}
        </View>
      </TouchableOpacity>
    );
  };
  // fuction for getting header title
  const getHeaderTitle = type => {
    switch (type) {
      case 'allocate':
        return label.COMPLAINT_ALLOCATION;
      case 'hold':
        return label.HOLD_COMPLAINT;
      case 'update':
        return label.UPDATE_ALLOCATION;
      case 'rework':
        return label.REWORK_COMPLAINT;

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
      <CustomeHeader headerTitle={getHeaderTitle(type)} />

      <ScrollView>
        <View style={{rowGap: 20}}>
          {/*card for company details*/}
          <CustomeCard
            headerName={'Company DETAILS'}
            data={[
              {
                key: 'Company name',
                value: complaintData?.energy_company_name,
              },
              {
                key: 'Regional office',
                value:
                  complaintData?.regionalOffices &&
                  complaintData?.regionalOffices?.[0]?.regional_office_name,
              },
              {
                key: 'sales area',
                value:
                  complaintData?.saleAreas &&
                  complaintData?.saleAreas?.[0]?.sales_area_name,
              },
              {
                key: 'District',
                value:
                  complaintData?.districts &&
                  complaintData?.districts?.[0]?.district_name,
              },
              {
                key: 'OUTLET',
                value:
                  complaintData.outlets &&
                  complaintData?.outlets?.[0]?.outlet_name,
              },
              {
                key: 'order by',
                value: complaintData?.order_by_details,
              },
              {
                key: 'order via',
                value: complaintData?.order_via_details,
              },
            ]}
          />

          {/*card for complaint details*/}
          <CustomeCard
            headerName={'Complaint DETAILS'}
            data={[
              {
                key: 'complaint id',
                value: complaintData?.complaint_unique_id,
                keyColor: Colors().skyBule,
              },
              {
                key: 'COMPLAINT RAISE BY',
                value: complaintData?.complaint_raise_by,
              },
              {
                key: 'COMPLAINT TYPE',
                value: complaintData?.complaint_type,
              },
            ]}
          />
        </View>

        <View style={styles.inputContainer}>
          <NeumorphicDropDownList
            width={WINDOW_WIDTH * 0.92}
            title={'Manager name'}
            required={true}
            data={managerData}
            value={formik?.values?.area_manager_id}
            disable={complaintData?.isComplaintAssigned || type === 'update'}
            onChange={val => {
              formik.setFieldValue(`user_id`, '');
              setFreeUserData([]);
              formik.setFieldValue(`supervisor_id`, '');
              setSuperVisorData([]);
              fetchSuperVisorList(val?.value);
              formik.setFieldValue('area_manager_id', val?.value);
            }}
            errorMessage={formik?.errors?.area_manager_id}
          />

          <NeumorphicDropDownList
            title={'supervisor'}
            required={true}
            width={WINDOW_WIDTH * 0.92}
            data={superVisorData}
            labelField={'name'}
            valueField={'id'}
            value={
              formik?.values?.supervisor_id
              // ? formik?.values?.supervisor_id
              // : complaintData?.manager_and_supevisor?.superVisorDetails?.id
            }
            renderItem={supervisorDropDown}
            disable={complaintData?.isComplaintAssigned && type !== 'update'}
            onChange={val => {
              formik.setFieldValue(`user_id`, '');
              setFreeUserData([]);
              fetchFreeUserList(val?.id);
              formik.setFieldValue('supervisor_id', val?.id);
            }}
            errorMessage={formik?.errors?.supervisor_id}
          />

          {type !== 'update' && (
            <NeumorphicDropDownList
              title={'free end user count'}
              required={true}
              width={WINDOW_WIDTH * 0.92}
              data={freeUserData}
              labelField={'name'}
              valueField={'id'}
              value={formik?.values?.user_id}
              renderItem={freeEndUserDropDown}
              onChange={val => {
                formik.setFieldValue('user_id', val?.id);
              }}
            />
          )}

          {type === 'update' && (
            <MultiSelectComponent
              title={'Users'}
              placeHolderTxt={`Select...`}
              required={true}
              labelField="name"
              valueField="id"
              data={freeUserData}
              value={formik.values.user_id}
              inside={false}
              onChange={e => {
                formik.setFieldValue(`user_id`, e);
              }}
              errorMessage={formik?.errors?.user_id}
            />
          )}

          {formik?.touched?.user_id && formik?.errors?.user_id && (
            <Text style={styles.errorMesage}>{formik?.errors?.user_id}</Text>
          )}

          {removeModalVisble && (
            <AlertModal
              visible={removeModalVisble}
              iconName={'delete'}
              icontype={IconType.AntDesign}
              iconColor={Colors().red}
              textToShow={'ARE YOU SURE YOU WANT TO REmove THIS!!'}
              cancelBtnPress={() => setRemoveModalVisible(!removeModalVisble)}
              ConfirmBtnPress={() => updateAllocate(removeId)}
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
              ConfirmBtnPress={() => updateAllocate()}
            />
          )}

          <View style={{alignSelf: 'center', marginVertical: 10}}>
            <NeumorphicButton
              title={label.SUBMIT}
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

export default AddUpdateAllocateComplaintScreen;

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    marginHorizontal: 15,
    marginTop: 5,
    // marginHorizontal: WINDOW_WIDTH * 0.04,
    // marginTop: WINDOW_HEIGHT * 0.02,
    rowGap: 10,
  },
  inputText: {
    color: Colors().pureBlack,
    fontSize: 15,
    fontWeight: '400',
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  title: {
    fontSize: 15,
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

  listView: {
    flexDirection: 'row',
    alignItems: 'center',

    margin: 3,
    fontFamily: Colors().fontFamilyBookMan,
  },

  dropdown: {
    marginLeft: 10,
    flex: 1,
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
  iconStyle: {
    width: 30,
    height: 30,
    marginRight: 5,
  },

  selectedStyle: {
    borderRadius: 12,
  },
});
