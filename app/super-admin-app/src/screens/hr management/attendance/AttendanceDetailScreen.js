import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomeHeader from '../../../component/CustomeHeader';
import Colors from '../../../constants/Colors';
import IconType from '../../../constants/IconType';
import Loader from '../../../component/Loader';
import InternalServer from '../../../component/InternalServer';
import {useDispatch, useSelector} from 'react-redux';
import {Icon} from '@rneui/base';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import DataNotFound from '../../../component/DataNotFound';
import SeparatorComponent from '../../../component/SeparatorComponent';
import {DataTable} from 'react-native-paper';
import NeumorphCard from '../../../component/NeumorphCard';
import {getUserDetailById} from '../../../redux/slices/hr-management/attendance/getUserDetailSlice';
import {getUserTimeSheetList} from '../../../redux/slices/hr-management/attendance/getUserTimesheetSlice';
import NeumorphDatePicker from '../../../component/NeumorphDatePicker';
import moment from 'moment';
import {useFormik} from 'formik';
import ScreensLabel from '../../../constants/ScreensLabel';
import CustomeCard from '../../../component/CustomeCard';
import Toast from 'react-native-toast-message';

const AttendanceDetailScreen = ({navigation, route}) => {
  const empId = route?.params?.empId;
  const label = ScreensLabel();

  const UserDetailData = useSelector(state => state.getUserDetail);
  const UserTimesheet = useSelector(state => state.getUserTimesheet);

  const userData = UserDetailData?.data?.data;
  const recordData = UserTimesheet?.data?.data;

  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      month: new Date(new Date().getFullYear(), new Date().getMonth()),
    },
  });

  const [openMonth, setOpenMonth] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    dispatch(getUserDetailById(empId));
    dispatch(
      getUserTimeSheetList({userId: empId, month: formik?.values?.month}),
    );
  }, [empId]);

  /* function for pull down to refresh */
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      dispatch(getUserDetailById(empId));
      dispatch(
        getUserTimeSheetList({userId: empId, month: formik?.values?.month}),
      );

      setRefreshing(false);
      formik.resetForm();
    }, 2000);
  }, []);

  /* fectch table data   function startdate and enddate */
  const fetchUserTimesheet = async month => {
    try {
      const result = await dispatch(
        getUserTimeSheetList({
          userId: empId,
          month: month ? month : formik?.values?.month,
        }),
      ).unwrap();

      if (result?.status === true) {
        // Toast.show({type: 'success', text1: result?.message, position: 'bottom'});
      } else {
        Toast.show({type: 'error', text1: result?.message, position: 'bottom'});
      }
    } catch (error) {
      Toast.show({type: 'error', text1: error, position: 'bottom'});
    }
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader headerTitle={`${label.ATTENDANCE} ${label.DETAIL}`} />

      {UserDetailData?.isLoading ? (
        <Loader />
      ) : !UserDetailData?.isLoading &&
        !UserDetailData?.isError &&
        UserDetailData?.data?.status ? (
        <>
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            <View>
              <CustomeCard
                headerName={'User details'}
                avatarImage={userData?.image}
                data={[
                  {key: 'NAME', value: userData?.name},
                  ...(userData?.employee_id
                    ? [
                        {
                          key: 'EMPLOYEE CODE',
                          value: userData?.employee_id,
                          keyColor: Colors().skyBule,
                        },
                      ]
                    : []),

                  ...(userData?.email
                    ? [{key: 'email', value: userData?.email}]
                    : []),

                  ...(userData?.mobile
                    ? [{key: 'MOBILE NUMBER', value: userData?.mobil}]
                    : []),
                ]}
                status={[
                  {
                    key: 'Role name',
                    value: userData?.role_name,
                    color: Colors().pending,
                  },
                ]}
              />

              {/* card for request field table */}
              <View style={styles.mainView}>
                <NeumorphCard>
                  <View style={styles.cardContainer}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={[styles.headingTxt, {color: Colors().purple}]}>
                        records
                      </Text>
                      <NeumorphDatePicker
                        width={WINDOW_WIDTH * 0.5}
                        iconPress={() => setOpenMonth(!openMonth)}
                        valueOfDate={
                          formik?.values?.month
                            ? moment(formik?.values?.month).format('MMMM YYYY')
                            : formik?.values?.month
                        }
                        modal
                        open={openMonth}
                        date={new Date()}
                        mode="date"
                        onConfirm={date => {
                          formik.setFieldValue(`month`, date);
                          fetchUserTimesheet(date);

                          setOpenMonth(false);
                        }}
                        onCancel={() => {
                          setOpenMonth(false);
                        }}></NeumorphDatePicker>
                    </View>

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
                            date
                          </DataTable.Title>

                          <DataTable.Title
                            textStyle={[
                              styles.cardHeadingTxt,
                              {color: Colors().purple},
                            ]}
                            style={[styles.tableHeadingView, {width: 110}]}>
                            days
                          </DataTable.Title>
                          <DataTable.Title
                            textStyle={[
                              styles.cardHeadingTxt,
                              {color: Colors().purple},
                            ]}
                            style={[styles.tableHeadingView, {width: 95}]}>
                            clockIn
                          </DataTable.Title>
                          <DataTable.Title
                            textStyle={[
                              styles.cardHeadingTxt,
                              {color: Colors().purple},
                            ]}
                            style={[styles.tableHeadingView, {width: 95}]}>
                            clockOut
                          </DataTable.Title>
                          <DataTable.Title
                            textStyle={[
                              styles.cardHeadingTxt,
                              {color: Colors().purple},
                            ]}
                            style={[styles.tableHeadingView, {width: 95}]}>
                            WORK DURATION
                          </DataTable.Title>

                          <DataTable.Title
                            textStyle={[
                              styles.cardHeadingTxt,
                              {color: Colors().purple},
                            ]}
                            style={[styles.tableHeadingView, {width: 75}]}>
                            action
                          </DataTable.Title>
                        </DataTable.Header>

                        {UserTimesheet?.isLoading ? (
                          <Loader />
                        ) : !UserTimesheet?.isLoading &&
                          !UserTimesheet?.isError &&
                          UserTimesheet?.data?.status ? (
                          <>
                            <ScrollView>
                              {recordData.map((itm, index) => (
                                <>
                                  <DataTable.Row key={index} style={{}}>
                                    <DataTable.Cell
                                      textStyle={[
                                        styles.cardHeadingTxt,
                                        {color: Colors().pureBlack},
                                      ]}
                                      style={[
                                        styles.tableHeadingView,
                                        {width: 50},
                                      ]}>
                                      {index + 1}
                                    </DataTable.Cell>

                                    <DataTable.Cell
                                      textStyle={[
                                        styles.cardHeadingTxt,
                                        {color: Colors().pureBlack},
                                      ]}
                                      style={[
                                        styles.tableHeadingView,
                                        {width: 120},
                                      ]}>
                                      <Text
                                        style={[
                                          styles.cardHeadingTxt,
                                          {color: Colors().pureBlack},
                                        ]}
                                        numberOfLines={2}>
                                        {itm?.date}
                                      </Text>
                                    </DataTable.Cell>

                                    <DataTable.Cell
                                      textStyle={[
                                        styles.cardHeadingTxt,
                                        {color: Colors().pureBlack},
                                      ]}
                                      style={[
                                        styles.tableHeadingView,
                                        {width: 110},
                                      ]}>
                                      {itm?.day}
                                    </DataTable.Cell>
                                    <DataTable.Cell
                                      textStyle={[
                                        styles.cardHeadingTxt,
                                        {color: Colors().pureBlack},
                                      ]}
                                      style={[
                                        styles.tableHeadingView,
                                        {width: 95},
                                      ]}>
                                      {itm?.clockIn}
                                    </DataTable.Cell>
                                    <DataTable.Cell
                                      textStyle={[
                                        styles.cardHeadingTxt,
                                        {color: Colors().pureBlack},
                                      ]}
                                      style={[
                                        styles.tableHeadingView,
                                        {width: 95},
                                      ]}>
                                      {itm?.clockOut}
                                    </DataTable.Cell>
                                    <DataTable.Cell
                                      textStyle={[
                                        styles.cardHeadingTxt,
                                        {color: Colors().pureBlack},
                                      ]}
                                      style={[
                                        styles.tableHeadingView,
                                        {width: 95},
                                      ]}>
                                      {itm?.totalWorkHour}
                                    </DataTable.Cell>

                                    <DataTable.Cell
                                      textStyle={[
                                        styles.cardHeadingTxt,
                                        {color: Colors().pureBlack},
                                      ]}
                                      style={[
                                        styles.tableHeadingView,
                                        {width: 75},
                                      ]}>
                                      <NeumorphCard
                                        lightShadowColor={Colors().darkShadow2}
                                        darkShadowColor={Colors().lightShadow}>
                                        <Icon
                                          size={10}
                                          name="download"
                                          type={IconType.AntDesign}
                                          color={Colors().aprroved}
                                          style={styles.actionIcon}
                                          onPress={() =>
                                            console.log('download pressed')
                                          }
                                        />
                                      </NeumorphCard>
                                    </DataTable.Cell>
                                  </DataTable.Row>
                                </>
                              ))}
                            </ScrollView>
                          </>
                        ) : UserTimesheet?.isError ? (
                          <InternalServer />
                        ) : !UserTimesheet?.data?.status &&
                          UserTimesheet?.data?.message ===
                            'Records not found' ? (
                          <>
                            <DataTable.Row style={{height: 200}}>
                              <DataNotFound />
                            </DataTable.Row>
                          </>
                        ) : (
                          <InternalServer />
                        )}
                      </DataTable>
                    </ScrollView>
                  </View>
                </NeumorphCard>
              </View>
            </View>
          </ScrollView>
        </>
      ) : UserDetailData?.isError ? (
        <InternalServer />
      ) : !UserDetailData?.data?.status &&
        UserDetailData?.data?.message === 'Data not found' ? (
        <>
          <DataNotFound />
        </>
      ) : (
        <InternalServer />
      )}
    </SafeAreaView>
  );
};

export default AttendanceDetailScreen;

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

  actionIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },

  tableHeadingView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
