import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomeHeader from '../../../component/CustomeHeader';
import Colors from '../../../constants/Colors';
import IconType from '../../../constants/IconType';
import Loader from '../../../component/Loader';
import InternalServer from '../../../component/InternalServer';
import {useDispatch, useSelector} from 'react-redux';
import {getApprovedComlaintDetailById} from '../../../redux/slices/complaint/getComplaintDetailSlice';
import ScreensLabel from '../../../constants/ScreensLabel';
import {Icon} from '@rneui/base';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import DataNotFound from '../../../component/DataNotFound';
import {Avatar, ListItem} from '@rneui/themed';
import FloatingAddButton from '../../../component/FloatingAddButton';
import AlertModal from '../../../component/AlertModal';
import {useFormik} from 'formik';
import {
  approveComplaintById,
  rejectComplaintById,
} from '../../../redux/slices/complaint/updateComplaintStatusSlice';
import NeuomorphAvatar from '../../../component/NeuomorphAvatar';
import {Image} from 'react-native';
import Images from '../../../constants/Images';
import {apiBaseUrl} from '../../../../config';
import {
  getTimeLineDetailById,
  getTotalCountById,
} from '../../../redux/slices/complaint/getComplaintTimelineSlice';
import CustomeCard from '../../../component/CustomeCard';

const CompaniesDetailsScreen = ({navigation, route}) => {
  const complaint_id = route?.params?.complaint_id;
  const label = ScreensLabel();

  const complainttDetailDta = useSelector(state => state.getComplaintDetail);
  const dispatch = useDispatch();

  const [timelineData, setTimelineData] = useState();
  const [memberData, setMemberData] = useState();
  const [listModalVisible, setListModalVisible] = useState(false);
  const [approveModalVisible, setApproveModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [complaintId, setComplaintId] = useState('');
  useEffect(() => {
    dispatch(getApprovedComlaintDetailById(complaint_id));
    fetchTimelineData();
    fetchMemberCountData();
  }, [setComplaintId]);

  const data = complainttDetailDta?.data?.data;

  const formik = useFormik({
    initialValues: {
      remark: '',
    },
  });

  /* for getting color of status*/
  function getStatusColor(action) {
    switch (action) {
      case 'pending':
        return Colors().pending;
      case 'rejected':
        return Colors().rejected;
      case 'working':
        return Colors().working;
      case 'approved':
        return Colors().aprroved;
      case 'resolved':
        return Colors().resolved;
      case 'Hold':
        return Colors().partial;
      default:
        return 'black';
    }
  }

  /* rejectComplaint  function with id */
  const rejectComplaint = async complaintId => {
    const reqbody = {
      id: complaintId,
      remark: formik.values.remark,
      status: 4,
    };

    try {
      const rejectResult = await dispatch(
        rejectComplaintById(reqbody),
      ).unwrap();

      if (rejectResult?.status === true) {
        ToastAndroid.show(rejectResult?.message, ToastAndroid.LONG);
        setRejectModalVisible(false), setComplaintId('');
        dispatch(getApprovedComlaintDetailById(complaint_id));
      } else {
        ToastAndroid.show(rejectResult?.message, ToastAndroid.LONG);
        setRejectModalVisible(false), setComplaintId('');
      }
    } catch (error) {
      ToastAndroid.show(error, ToastAndroid.LONG);
      setRejectModalVisible(false), setComplaintId('');
    }
  };
  /* approved  function with id */
  const approveComplaint = async complaintId => {
    const reqbody = {
      complaint_id: complaintId,
    };
    try {
      const rejectResult = await dispatch(
        approveComplaintById(reqbody),
      ).unwrap();

      if (rejectResult?.status === true) {
        ToastAndroid.show(rejectResult?.message, ToastAndroid.LONG);
        setApproveModalVisible(false), setComplaintId('');
        dispatch(getApprovedComlaintDetailById(complaint_id));
      } else {
        ToastAndroid.show(rejectResult?.message, ToastAndroid.LONG);
        setApproveModalVisible(false), setComplaintId('');
      }
    } catch (error) {
      ToastAndroid.show(error, ToastAndroid.LONG);
      setApproveModalVisible(false), setComplaintId('');
    }
  };

  const fetchTimelineData = async comlaint_id => {
    try {
      const result = await dispatch(
        getTimeLineDetailById(complaint_id),
      ).unwrap();
      if (result?.status === true) {
        setTimelineData(result?.data);
      }
    } catch (error) {}
  };
  const fetchMemberCountData = async comlaint_id => {
    try {
      const result = await dispatch(getTotalCountById(complaint_id)).unwrap();
      if (result?.status === true) {
        setMemberData(result?.data);
      }
    } catch (error) {}
  };

  /*fucntion for handling the action button */
  const handleAction = actionButton => {
    switch (actionButton.typeOfButton) {
      case 'edit':
        navigation.navigate('AddUpdateComplaintScreen', {
          complaint_id: data?.id,
        });
        break;
      case 'reject':
        setRejectModalVisible(true), setComplaintId(data?.id);
        break;
      case 'approve':
        setApproveModalVisible(true), setComplaintId(data?.id);
        break;

      default:
        break;
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader
        headerTitle={`${label.COMPLAINT} ${label.DETAIL}`}
        lefIconName={'chevron-back'}
        lefIconType={IconType.Ionicons}
        rightIconName={'dots-vertical'}
        rightIcontype={IconType.MaterialCommunityIcons}
        rightIconPress={() => setListModalVisible(!listModalVisible)}
      />

      {complainttDetailDta?.isLoading ? (
        <Loader />
      ) : !complainttDetailDta?.isLoading &&
        !complainttDetailDta?.isError &&
        complainttDetailDta?.data?.status ? (
        <>
          {listModalVisible && (
            <View style={[styles.listView]}>
              <ListItem
                style={{}}
                containerStyle={[
                  styles.listItemView,
                  {backgroundColor: Colors().cardBackground},
                ]}>
                <Icon
                  name="persons"
                  type={IconType.Fontisto}
                  color={Colors().black2}
                />
                <ListItem.Content>
                  <ListItem.Title
                    style={{
                      textAlign: 'center',
                      color: Colors().gray2,
                      textTransform: 'uppercase',
                      fontFamily: Colors().fontFamilyBookMan,
                    }}>
                    timeline
                  </ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron
                  color={Colors().black2}
                  size={20}
                  onPress={() => {
                    navigation.navigate('ComplaintTimelineScreen', {
                      complaint_id: complaint_id,
                      // memberCountData: memberData,
                    }),
                      setListModalVisible(false);
                  }}
                />
              </ListItem>

              <ListItem
                style={{}}
                containerStyle={[
                  styles.listItemView,
                  {backgroundColor: Colors().cardBackground},
                ]}>
                <Icon
                  name="assignment"
                  type={IconType.MaterialIcons}
                  color={Colors().black2}
                />
                <ListItem.Content>
                  <ListItem.Title
                    style={{
                      textAlign: 'center',
                      color: Colors().gray2,
                      textTransform: 'uppercase',
                      fontFamily: Colors().fontFamilyBookMan,
                    }}>
                    More Details....
                  </ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron
                  color={Colors().black2}
                  size={20}
                  onPress={() => {
                    navigation.navigate('ComplaintMoreDetails', {
                      moreComplaintData: timelineData,
                      memberCountData: memberData,
                    }),
                      setListModalVisible(false);
                  }}
                />
              </ListItem>
            </View>
          )}
          <ScrollView>
            <View style={{}}>
              {/* card for company detail */}
              <CustomeCard
                headerName={'COMPANY DETAILS'}
                data={[
                  {key: 'company name', value: data?.energy_company_name},
                  {
                    key: ' REGIONAL OFFICE',
                    value: data?.regionalOffices?.[0]?.regional_office_name,
                  },
                  {
                    key: 'SALES AREA',
                    value: data?.saleAreas?.[0]?.sales_area_name,
                  },
                  {
                    key: 'DISTRICT',
                    value: data?.districts?.[0]?.district_name,
                  },
                  {
                    key: 'outlet',
                    value: data?.outlets?.[0]?.outlet_name,
                  },
                  {
                    key: 'ORDER BY',
                    value: data?.order_by_details,
                  },
                  {
                    key: 'ORDER via',
                    value: data?.order_via_details,
                  },
                ]}
              />

              {/* card for complaint detail */}

              <CustomeCard
                headerName={'COmplaint DETAILS'}
                data={[
                  {
                    key: 'compplaint id',
                    value: data?.complaint_unique_id,
                    keyColor: Colors().skyBule,
                  },
                  {key: 'complaint raise by', value: data?.complaint_raise_by},
                  {key: 'COMPLAINT TYPE', value: data?.complaint_type},
                  {key: 'created at', value: data?.created_at},
                  {key: 'DESCRIPTION', value: data?.description},
                ]}
                status={[
                  {
                    key: 'status',
                    value: data?.status,
                    color: getStatusColor(data?.status),
                  },
                ]}
                editButton={
                  data?.status !== 'rejected' && data?.status != 'resolved'
                }
                rejectButton={data?.status === 'pending'}
                approveButton={data?.status === 'pending'}
                action={handleAction}
              />

              {/* card for OTHER DETAILS detail */}
              {data?.manager_and_supevisor?.areaManagerDetails && (
                <CustomeCard
                  headerName={'other details'}
                  data={[
                    {
                      component: (
                        <View
                          style={{
                            flexDirection: 'row',
                            columnGap: 10,
                            flex: 1,
                          }}>
                          <Text
                            style={[
                              styles.cardHeadingTxt,
                              {alignSelf: 'center', color: Colors().pureBlack},
                            ]}>
                            Manager :{' '}
                          </Text>

                          <View style={{flexDirection: 'row', flex: 1}}>
                            <NeuomorphAvatar gap={4}>
                              <Avatar
                                size={50}
                                rounded
                                source={{
                                  uri: data?.manager_and_supevisor
                                    ?.areaManagerDetails?.image
                                    ? `${apiBaseUrl}${data?.manager_and_supevisor?.areaManagerDetails?.image}`
                                    : `${
                                        Image.resolveAssetSource(
                                          Images.DEFAULT_PROFILE,
                                        ).uri
                                      }`,
                                }}
                              />
                            </NeuomorphAvatar>

                            <Text
                              numberOfLines={2}
                              ellipsizeMode="tail"
                              style={[
                                styles.cardtext,
                                {
                                  alignSelf: 'center',
                                  marginLeft: 10,
                                  color: Colors().pureBlack,
                                },
                              ]}>
                              {
                                data?.manager_and_supevisor?.areaManagerDetails
                                  ?.name
                              }{' '}
                              -{' '}
                              {
                                data?.manager_and_supevisor?.areaManagerDetails
                                  ?.employee_id
                              }
                            </Text>
                          </View>
                        </View>
                      ),
                    },
                    {
                      component: (
                        <View
                          style={{
                            flexDirection: 'row',
                            columnGap: 10,
                            flex: 1,
                          }}>
                          <Text
                            style={[
                              styles.cardHeadingTxt,
                              {alignSelf: 'center', color: Colors().pureBlack},
                            ]}>
                            supervisor :{' '}
                          </Text>

                          <View style={{flexDirection: 'row', flex: 1}}>
                            <NeuomorphAvatar gap={4}>
                              <Avatar
                                size={50}
                                rounded
                                source={{
                                  uri: data?.manager_and_supevisor
                                    ?.superVisorDetails?.image
                                    ? `${apiBaseUrl}${data?.manager_and_supevisor?.superVisorDetails?.image}`
                                    : `${
                                        Image.resolveAssetSource(
                                          Images.DEFAULT_PROFILE,
                                        ).uri
                                      }`,
                                }}
                              />
                            </NeuomorphAvatar>

                            <Text
                              numberOfLines={2}
                              ellipsizeMode="tail"
                              style={[
                                styles.cardtext,
                                {
                                  alignSelf: 'center',
                                  marginLeft: 10,
                                  color: Colors().pureBlack,
                                },
                              ]}>
                              {
                                data?.manager_and_supevisor?.superVisorDetails
                                  ?.name
                              }{' '}
                              -{' '}
                              {
                                data?.manager_and_supevisor?.superVisorDetails
                                  ?.employee_id
                              }
                            </Text>
                          </View>
                        </View>
                      ),
                    },
                  ]}
                />
              )}

              {/* modal view for ACTION */}
              {rejectModalVisible && (
                <AlertModal
                  visible={rejectModalVisible}
                  iconName={'closecircleo'}
                  icontype={IconType.AntDesign}
                  iconColor={Colors().red}
                  textToShow={'ARE YOU SURE YOU WANT TO REJECT THIS!!'}
                  cancelBtnPress={() =>
                    setRejectModalVisible(!rejectModalVisible)
                  }
                  ConfirmBtnPress={() => rejectComplaint(complaintId)}
                  remarkText={formik.values.remark}
                  onRemarkChange={formik.handleChange('remark')}
                  errorMesage={formik.values.remark ? '' : 'Remark is required'}
                />
              )}
              {approveModalVisible && (
                <AlertModal
                  visible={approveModalVisible}
                  iconName={'checkcircleo'}
                  icontype={IconType.AntDesign}
                  iconColor={Colors().aprroved}
                  textToShow={'ARE YOU SURE YOU WANT TO APPROVE THIS!!'}
                  cancelBtnPress={() =>
                    setApproveModalVisible(!approveModalVisible)
                  }
                  ConfirmBtnPress={() => approveComplaint(complaintId)}
                />
              )}
            </View>
          </ScrollView>
        </>
      ) : complainttDetailDta?.isError ? (
        <InternalServer />
      ) : !complainttDetailDta?.data?.status &&
        complainttDetailDta?.data?.message == 'Data not found' ? (
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
                navigation.navigate('AddUpdateComplaintScreen', {});
              }}></FloatingAddButton>
          </View>
        </>
      ) : (
        <InternalServer></InternalServer>
      )}
    </SafeAreaView>
  );
};

export default CompaniesDetailsScreen;

const styles = StyleSheet.create({
  cardHeadingTxt: {
    fontSize: 12,

    lineHeight: 21,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  cardtext: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 21,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    flexShrink: 1,
    marginLeft: 2,
  },

  listView: {
    position: 'absolute',
    marginTop: '14%',
    marginLeft: '38%',
    zIndex: 1,
  },
  listItemView: {
    width: '150%',
  },
});
