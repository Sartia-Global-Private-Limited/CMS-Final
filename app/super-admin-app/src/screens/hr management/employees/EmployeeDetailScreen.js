import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomeHeader from '../../../component/CustomeHeader';
import Colors from '../../../constants/Colors';
import IconType from '../../../constants/IconType';
import Loader from '../../../component/Loader';
import InternalServer from '../../../component/InternalServer';
import {useDispatch, useSelector} from 'react-redux';
import {Avatar, Icon} from '@rneui/base';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import DataNotFound from '../../../component/DataNotFound';
import SeparatorComponent from '../../../component/SeparatorComponent';
import {ListItem} from '@rneui/themed';
import FloatingAddButton from '../../../component/FloatingAddButton';
import ScreensLabel from '../../../constants/ScreensLabel';
import {getEmployeeDetail} from '../../../redux/slices/hr-management/employees/getEmployeeDetailSlice';
import NeuomorphAvatar from '../../../component/NeuomorphAvatar';
import {apiBaseUrl} from '../../../../config';
import Images from '../../../constants/Images';
import {DataTable} from 'react-native-paper';
import NeumorphCard from '../../../component/NeumorphCard';

const EmployeeDetailScreen = ({navigation, route}) => {
  const headerTitle = route?.params?.title;
  const label = ScreensLabel();
  const empId = route?.params?.empId;
  const dispatch = useDispatch();
  const empDetailData = useSelector(state => state.getEmployeeDetail);
  const [listModalVisible, setListModalVisible] = useState(false);

  useEffect(() => {
    dispatch(getEmployeeDetail({empId}));
  }, [empId]);

  const data = empDetailData?.data?.data;

  /*function for giveing color of status*/
  function getStatusColor(action) {
    switch (action) {
      case 'Permanent':
        return Colors().aprroved;
      case '1':
        return Colors().aprroved;
      case '2':
        return Colors().rejected;

      default:
        return Colors().black2;
    }
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader
        headerTitle={`${label.EMPLOYEES} ${label.DETAIL}`}
        lefIconName={'chevron-back'}
        lefIconType={IconType.Ionicons}
        rightIconName={'dots-vertical'}
        rightIcontype={IconType.MaterialCommunityIcons}
        rightIconPress={() => setListModalVisible(!listModalVisible)}
      />

      {empDetailData?.isLoading ? (
        <Loader />
      ) : !empDetailData?.isLoading &&
        !empDetailData?.isError &&
        empDetailData?.data?.status ? (
        <>
          {listModalVisible && (
            <View style={styles.listView}>
              <ListItem
                style={{}}
                containerStyle={[
                  styles.listItemView,
                  {backgroundColor: Colors().screenBackground},
                ]}>
                <Icon
                  name="document"
                  type={IconType.Ionicons}
                  color={Colors().purple}
                />
                <ListItem.Content>
                  <ListItem.Title
                    style={{
                      textAlign: 'center',
                      color: Colors().pureBlack,
                      textTransform: 'uppercase',
                      fontFamily: Colors().fontFamilyBookMan,
                    }}>
                    Documents
                  </ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron
                  color={Colors().purple}
                  size={20}
                  onPress={() => {
                    navigation.navigate('EmpDocumentScreen', {
                      data: data,
                    }),
                      setListModalVisible(false);
                  }}
                />
              </ListItem>
              <ListItem
                style={{}}
                containerStyle={[
                  styles.listItemView,
                  {backgroundColor: Colors().screenBackground},
                ]}>
                <Icon
                  name="bank"
                  type={IconType.FontAwesome}
                  color={Colors().purple}
                />
                <ListItem.Content>
                  <ListItem.Title
                    style={{
                      textAlign: 'center',
                      color: Colors().pureBlack,
                      textTransform: 'uppercase',
                      fontFamily: Colors().fontFamilyBookMan,
                    }}>
                    Bank Details
                  </ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron
                  color={Colors().purple}
                  size={20}
                  onPress={() => {
                    navigation.navigate('EmpBankDetailScreen', {
                      data: data,
                    }),
                      setListModalVisible(false);
                  }}
                />
              </ListItem>
              <ListItem
                style={{}}
                containerStyle={[
                  styles.listItemView,
                  {backgroundColor: Colors().screenBackground},
                ]}>
                <Icon
                  name="history"
                  type={IconType.MaterialIcons}
                  color={Colors().purple}
                />
                <ListItem.Content>
                  <ListItem.Title
                    style={{
                      textAlign: 'center',
                      color: Colors().pureBlack,
                      textTransform: 'uppercase',
                      fontFamily: Colors().fontFamilyBookMan,
                    }}>
                    Timeline
                  </ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron
                  color={Colors().purple}
                  size={20}
                  onPress={() => {
                    navigation.navigate('EmpTimelineScreens', {
                      data: data?.status_timeline,
                    }),
                      setListModalVisible(false);
                  }}
                />
              </ListItem>
            </View>
          )}
          <ScrollView>
            <View style={styles.mainView}>
              {/* card for stock request  detail */}
              <NeumorphCard>
                <View style={styles.cardContainer}>
                  <Text style={[styles.headingTxt, {color: Colors().purple}]}>
                    PERSONAL INFO
                  </Text>
                  <SeparatorComponent
                    separatorColor={Colors().gray2}
                    separatorHeight={0.5}
                  />

                  {/* view for request user */}
                  <View
                    style={{
                      flexDirection: 'row',
                      columnGap: 10,
                    }}>
                    <View>
                      <NeuomorphAvatar gap={4}>
                        <Avatar
                          size={50}
                          rounded
                          source={{
                            uri: data?.image
                              ? `${apiBaseUrl}${data?.image}`
                              : `${
                                  Image.resolveAssetSource(
                                    Images.DEFAULT_PROFILE,
                                  ).uri
                                }`,
                          }}
                        />
                      </NeuomorphAvatar>
                    </View>

                    <View style={{flex: 1, justifyContent: 'center'}}>
                      {data?.name && (
                        <View style={{flexDirection: 'row'}}>
                          <Text
                            style={[
                              styles.cardHeadingTxt,
                              {color: Colors().pureBlack},
                            ]}>
                            name :{' '}
                          </Text>
                          <Text
                            numberOfLines={2}
                            ellipsizeMode="tail"
                            style={[
                              styles.cardtext,
                              {color: Colors().pureBlack},
                            ]}>
                            {data?.name}
                          </Text>
                        </View>
                      )}

                      {data?.email && (
                        <View style={{flexDirection: 'row'}}>
                          <Text
                            style={[
                              styles.cardHeadingTxt,
                              {color: Colors().pureBlack},
                            ]}>
                            email :
                          </Text>
                          <Text
                            numberOfLines={2}
                            ellipsizeMode="tail"
                            style={[
                              styles.cardtext,
                              {color: Colors().pureBlack},
                            ]}>
                            {data?.email}
                          </Text>
                        </View>
                      )}
                      {data?.team_name && (
                        <View style={{flexDirection: 'row'}}>
                          <Text
                            style={[
                              styles.cardHeadingTxt,
                              {color: Colors().pureBlack},
                            ]}>
                            team name :
                          </Text>
                          <Text
                            numberOfLines={2}
                            ellipsizeMode="tail"
                            style={[
                              styles.cardtext,
                              {color: Colors().pureBlack},
                            ]}>
                            {data?.team_name}
                          </Text>
                        </View>
                      )}

                      {data?.skills && (
                        <View style={{flexDirection: 'row'}}>
                          <Text
                            style={[
                              styles.cardHeadingTxt,
                              {color: Colors().pureBlack},
                            ]}>
                            SKILLS :
                          </Text>
                          <Text
                            numberOfLines={2}
                            ellipsizeMode="tail"
                            style={[
                              styles.cardtext,
                              {color: Colors().pureBlack},
                            ]}>
                            {data?.skills.join(' , ')}
                          </Text>
                        </View>
                      )}
                      {data?.address && (
                        <View style={{flexDirection: 'row'}}>
                          <Text
                            style={[
                              styles.cardHeadingTxt,
                              {color: Colors().pureBlack},
                            ]}>
                            address :
                          </Text>
                          <Text
                            numberOfLines={2}
                            ellipsizeMode="tail"
                            style={[
                              styles.cardtext,
                              {color: Colors().pureBlack},
                            ]}>
                            {data?.address}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <View style={{flexDirection: 'row', flex: 1}}>
                      <Text
                        style={[
                          styles.cardHeadingTxt,
                          {color: Colors().pureBlack},
                        ]}>
                        MOBILE :{' '}
                      </Text>
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={[styles.cardtext, {color: Colors().pureBlack}]}>
                        {data?.mobile}
                      </Text>
                    </View>
                    <View style={{flexDirection: 'row', flex: 1}}>
                      <Text
                        style={[
                          styles.cardHeadingTxt,
                          {color: Colors().pureBlack},
                        ]}>
                        EMPLOYEE ID :{' '}
                      </Text>
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={[styles.cardtext, {color: Colors().pureBlack}]}>
                        {data?.employee_id}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <View style={{flexDirection: 'row', flex: 1}}>
                      <Text
                        style={[
                          styles.cardHeadingTxt,
                          {color: Colors().pureBlack},
                        ]}>
                        ROLE NAME . :{' '}
                      </Text>
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={[styles.cardtext, {color: Colors().pureBlack}]}>
                        {data?.role_name}
                      </Text>
                    </View>
                    <View style={{flexDirection: 'row', flex: 1}}>
                      <Text
                        style={[
                          styles.cardHeadingTxt,
                          {color: Colors().pureBlack},
                        ]}>
                        JOINING DATE. :{' '}
                      </Text>
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={[styles.cardtext, {color: Colors().pureBlack}]}>
                        {data?.joining_date}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <View style={{flexDirection: 'row', flex: 1}}>
                      <Text
                        style={[
                          styles.cardHeadingTxt,
                          {color: Colors().pureBlack},
                        ]}>
                        AADHAR No. :{' '}
                      </Text>
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={[styles.cardtext, {color: Colors().pureBlack}]}>
                        {data?.aadhar}
                      </Text>
                    </View>
                    <View style={{flexDirection: 'row', flex: 1}}>
                      <Text
                        style={[
                          styles.cardHeadingTxt,
                          {color: Colors().pureBlack},
                        ]}>
                        PAN NO. :{' '}
                      </Text>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={[styles.cardtext, {color: Colors().pureBlack}]}>
                        {data?.pan}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.actionView}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text
                        style={[
                          styles.cardHeadingTxt,
                          {color: Colors().pureBlack},
                        ]}>
                        EMPLOYMENT STATUS :{' '}
                      </Text>
                      <NeumorphCard>
                        <View style={{padding: 5}}>
                          <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={[
                              styles.cardtext,
                              {
                                color: getStatusColor(data?.employment_status),
                                fontWeight: '600',
                              },
                            ]}>
                            {data?.employment_status}
                          </Text>
                        </View>
                      </NeumorphCard>
                    </View>
                  </View>
                </View>
              </NeumorphCard>

              {/* card for family info table */}
              <NeumorphCard>
                <View style={styles.cardContainer}>
                  <Text style={[styles.headingTxt, {color: Colors().purple}]}>
                    FAMILY INFO
                  </Text>
                  <SeparatorComponent
                    separatorColor={Colors().gray2}
                    separatorHeight={0.5}
                  />
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}>
                    <DataTable>
                      <DataTable.Header style={{columnGap: 10}}>
                        <DataTable.Title
                          textStyle={[
                            styles.cardHeadingTxt,
                            {color: Colors().purple},
                          ]}
                          style={[styles.tableHeadingView, {width: 50}]}>
                          S.NO
                        </DataTable.Title>
                        <DataTable.Title
                          textStyle={[
                            styles.cardHeadingTxt,
                            {color: Colors().purple},
                          ]}
                          style={[styles.tableHeadingView, {width: 120}]}>
                          MEMBER NAME
                        </DataTable.Title>
                        <DataTable.Title
                          textStyle={[
                            styles.cardHeadingTxt,
                            {color: Colors().purple},
                          ]}
                          style={[styles.tableHeadingView, {width: 120}]}>
                          MEMBER RELATION
                        </DataTable.Title>
                      </DataTable.Header>
                      <ScrollView>
                        {data?.family_info?.map((itm, index) => (
                          <>
                            <DataTable.Row key={index} style={{}}>
                              <DataTable.Cell
                                textStyle={[
                                  styles.cardHeadingTxt,
                                  {color: Colors().pureBlack},
                                ]}
                                style={[styles.tableHeadingView, {width: 50}]}>
                                {index + 1}
                              </DataTable.Cell>

                              <DataTable.Cell
                                textStyle={[
                                  styles.cardHeadingTxt,
                                  {color: Colors().pureBlack},
                                ]}
                                style={[styles.tableHeadingView, {width: 120}]}>
                                <Text
                                  numberOfLines={2}
                                  style={[
                                    styles.cardtext,
                                    {color: Colors().pureBlack},
                                  ]}>
                                  {itm?.member_name}
                                </Text>
                              </DataTable.Cell>
                              <DataTable.Cell
                                textStyle={[
                                  styles.cardHeadingTxt,
                                  {color: Colors().pureBlack},
                                ]}
                                style={[styles.tableHeadingView, {width: 120}]}>
                                <Text
                                  numberOfLines={2}
                                  style={[
                                    styles.cardtext,
                                    {color: Colors().pureBlack},
                                  ]}>
                                  {itm?.member_relation}
                                </Text>
                              </DataTable.Cell>
                            </DataTable.Row>
                          </>
                        ))}

                        <DataTable.Row
                          style={{
                            alignItems: 'flex-end',
                            justifyContent: 'center',
                          }}>
                          <Text
                            style={[
                              styles.cardHeadingTxt,
                              {color: Colors().purple, alignSelf: 'center'},
                            ]}>
                            TOTAL family member. = {data?.family_info?.length}
                          </Text>
                        </DataTable.Row>
                      </ScrollView>
                    </DataTable>
                  </ScrollView>
                </View>
              </NeumorphCard>
            </View>
          </ScrollView>
        </>
      ) : empDetailData?.isError ? (
        <InternalServer />
      ) : !empDetailData?.data?.status &&
        empDetailData?.data?.message === 'Data not found' ? (
        <>
          <DataNotFound />
          <View
            style={{
              marginTop: WINDOW_HEIGHT * 0.8,
              marginLeft: WINDOW_WIDTH * 0.8,
              position: 'absolute',
            }}>
            <FloatingAddButton
              backgroundColor={Colors().purple}
              onPress={() => {
                navigation.navigate('AddUpdatePurchaseCompany', {
                  title: headerTitle,
                });
              }}></FloatingAddButton>
          </View>
        </>
      ) : (
        <InternalServer></InternalServer>
      )}
    </SafeAreaView>
  );
};

export default EmployeeDetailScreen;

const styles = StyleSheet.create({
  mainView: {
    padding: 15,
    rowGap: 15,
  },
  cardContainer: {
    margin: WINDOW_WIDTH * 0.03,
    flex: 1,
    rowGap: WINDOW_HEIGHT * 0.01,
  },
  headingTxt: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    alignSelf: 'center',
    marginBottom: 2,
  },

  cardHeadingTxt: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 21,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  cardtext: {
    fontSize: 12,
    fontWeight: '300',
    lineHeight: 21,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    flexShrink: 1,
    marginLeft: 2,
  },
  actionView: {
    flexDirection: 'row',

    columnGap: 10,
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

  tableHeadingView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
