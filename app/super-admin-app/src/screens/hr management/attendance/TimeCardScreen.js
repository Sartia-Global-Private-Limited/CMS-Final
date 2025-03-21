import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Colors from '../../../constants/Colors';
import IconType from '../../../constants/IconType';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import {Icon} from '@rneui/base';
import SeparatorComponent from '../../../component/SeparatorComponent';
import FloatingAddButton from '../../../component/FloatingAddButton';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import Loader from '../../../component/Loader';
import InternalServer from '../../../component/InternalServer';
import DataNotFound from '../../../component/DataNotFound';
import {getTimeSheetList} from '../../../redux/slices/hr-management/attendance/getTimeSheetSlice';
import {Calendar} from 'react-native-calendars';
import NeumorphDatePicker from '../../../component/NeumorphDatePicker';
import moment from 'moment';
import {Formik, useFormik} from 'formik';
import {getCalendarList} from '../../../redux/slices/hr-management/attendance/getCalendarSlice';
import Toast from 'react-native-toast-message';
import CustomeCard from '../../../component/CustomeCard';
import AlertModal from '../../../component/AlertModal';
import NeumorphicDropDownList from '../../../component/DropDownList';
import NeumorphicTextInput from '../../../component/NeumorphicTextInput';
import {markAttendanceInBulk} from '../../../redux/slices/hr-management/attendance/addUpdateAttendanceSlice';
import List from '../../../component/List/List';
import NeumorphicCheckbox from '../../../component/NeumorphicCheckbox';
import Button from '../../../component/Button';
import {addBulkAttendanceSchema} from '../../../utils/FormSchema';

const TimeCardScreen = ({navigation, route}) => {
  /* declare props constant variale*/

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const timeSheetListData = useSelector(state => state.getTimeSheet);
  const calendarListData = useSelector(state => state.getCalendar);
  const attendenceRecordData = calendarListData?.data?.data;

  /*declare useState variable here */
  const [viewType, setViewType] = useState('table');

  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [openFromDate, setOpenFromDate] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [openToDate, setOpenToDate] = useState(false);
  const [openMonth, setOpenMonth] = useState(false);
  const [attendaceModal, setAttendanceModal] = useState(false);
  const [checkData, setCheckData] = useState([{}]);
  const [filterChekcBox, setFilterChekcBox] = useState([]);
  const formik = useFormik({
    initialValues: {
      start_date: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      end_date: new Date(),
      month: new Date(new Date().getFullYear(), new Date().getMonth()),
    },
  });

  useEffect(() => {
    fetchTableViewData();

    fetchCalenderViewDate();
  }, [
    formik?.values?.end_date,
    formik?.values?.start_date,
    viewType,
    isFocused,
  ]);

  /* function for pull down to refresh */
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      fetchTableViewData();

      fetchCalenderViewDate();

      setRefreshing(false);
    }, 2000);
  }, []);

  const AttendanceOptions = [
    {value: 'AB', label: 'Absent'},
    {value: 'P', label: 'Present'},
    {value: 'HF', label: 'Half Day'},
  ];

  /* fectch table data   function startdate and enddate */
  const fetchTableViewData = async (startDate, endDate) => {
    try {
      const result = await dispatch(
        getTimeSheetList({
          startDate: startDate ? startDate : formik?.values?.start_date,
          endDate: endDate ? endDate : formik?.values?.end_date,
          pageSize: pageSize,
          pageNo: pageNo,
        }),
      ).unwrap();

      if (result?.status === true) {
        Toast.show({
          type: 'success',
          text1: result?.message,
          position: 'bottom',
        });
      } else {
        Toast.show({type: 'error', text1: result?.message, position: 'bottom'});
      }
    } catch (error) {
      Toast.show({type: 'error', text1: error, position: 'bottom'});
    }
  };

  /* fectch table data   function startdate and enddate */
  const fetchCalenderViewDate = async month => {
    try {
      const result = await dispatch(
        getCalendarList({
          calendarMonth: month ? month : formik?.values?.month,
        }),
      ).unwrap();

      if (result?.status === true) {
        Toast.show({
          type: 'success',
          text1: result?.message,
          position: 'bottom',
        });
      } else {
        Toast.show({type: 'error', text1: result?.message, position: 'bottom'});
      }
    } catch (error) {
      Toast.show({type: 'error', text1: error, position: 'bottom'});
    }
  };

  const handleSubmit = async (values, {setSubmitting, resetForm}) => {
    setSubmitting(true);
    values['user_ids'] = filterChekcBox?.map(i => i.id);
    values['month'] = moment(formik?.values?.month).format('YYYY-MM');

    const result = await dispatch(markAttendanceInBulk(values)).unwrap();
    if (result?.status) {
      setSubmitting(false);
      fetchCalenderViewDate();
      setFilterChekcBox([{}]);
      Toast.show({type: 'success', position: 'bottom', text1: result?.message});
      setAttendanceModal(false);
    } else {
      setSubmitting(false);
      Toast.show({type: 'error', position: 'bottom', text1: result?.message});
      setAttendanceModal(false);
    }
  };

  /* flatlist render ui  for table view*/
  const renderItem = ({item}) => {
    return (
      <View>
        <TouchableOpacity
          style={{}}
          onPress={() =>
            navigation.navigate('AttendanceDetailScreen', {
              empId: item?.user_id,
            })
          }>
          <CustomeCard
            avatarImage={item?.user_image}
            data={[
              {key: 'EMPLOYEE NAME', value: item?.user_name},
              {
                key: 'EMPLOYEE CODE',
                value: item?.employee_id,
                keyColor: Colors().skyBule,
              },
              {
                key: 'login',
                component: (
                  <View style={{flexDirection: 'row'}}>
                    <Icon
                      name="access-time"
                      type={IconType.MaterialIcons}
                      color={Colors().aprroved}
                      size={20}
                    />
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={[
                        styles.cardtext,
                        {color: Colors().pureBlack, marginLeft: 10},
                      ]}>
                      {item?.clockIn}
                    </Text>
                  </View>
                ),
              },
              {
                key: 'logout',
                component: (
                  <View style={{flexDirection: 'row'}}>
                    <Icon
                      name="access-time"
                      type={IconType.MaterialIcons}
                      color={Colors().red}
                      size={20}
                    />
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={[
                        styles.cardtext,
                        {color: Colors().pureBlack, marginLeft: 10},
                      ]}>
                      {item?.clockOut}
                    </Text>
                  </View>
                ),
              },
            ]}
            status={[
              {
                key: 'total time',
                value: item?.totalWorkDuration,
                color: Colors().pending,
              },
            ]}
            rightStatus={[
              {key: 'date', value: item?.date, color: Colors().pending},
            ]}
          />
        </TouchableOpacity>
      </View>
    );
  };

  /* flatlist render ui for calendar view */
  const renderItem2 = ({item, index}) => {
    return (
      <View>
        <TouchableOpacity style={{}}>
          <CustomeCard
            avatarImage={item?.image}
            allData={item}
            data={[
              {key: 'EMPLOYEE NAME', value: item?.name},
              {
                key: 'EMPLOYEE CODE',
                value: item?.employee_id,
                keyColor: Colors().skyBule,
              },
              ...[
                {
                  component: (
                    <View style={{flex: 1}}>
                      <View
                        style={{
                          alignSelf: 'flex-end',
                          position: 'absolute',
                        }}>
                        <NeumorphicCheckbox
                          // isChecked={true}
                          isChecked={checkData[index]?.chekedValue}
                          onChange={val => {
                            updateCheckDataAtIndex(
                              index,
                              (val = {chekedValue: val, id: item?.id}),
                            );
                          }}
                        />
                      </View>
                    </View>
                  ),
                },
              ],
              {
                component: (
                  <Calendar
                    theme={{
                      calendarBackground: Colors().cardBackground,
                      monthTextColor: Colors().gray2,
                      textMonthFontFamily: Colors().fontFamilyBookMan,
                      textDayHeaderFontFamily: Colors().fontFamilyBookMan,

                      textDayFontFamily: Colors().fontFamilyBookMan,
                    }}
                    initialDate={moment(formik?.values?.month).format(
                      'YYYY-MM-DD',
                    )}
                    markedDates={generateMarkedDates(item?.attendanceReports)}
                    markingType={'multi-dot'}
                    hideArrows={true}
                    enableSwipeMonths={false}
                    style={{
                      marginTop: 20,
                      width: WINDOW_WIDTH * 0.82,
                      marginLeft: -WINDOW_WIDTH * 0.15,
                    }}
                    disableMonthChange={true}
                    hideExtraDays={true}
                    onDayPress={it => {
                      navigation.navigate('AddUpdateAttendanceScreen', {
                        datePressed: it,
                        user_id: item?.id,
                      });
                    }}
                  />
                ),
              },
            ]}
            status={[
              {
                key: 'total pay days',
                value: String(item?.total_pay_days),
                color: Colors().pending,
              },
            ]}
            // rightStatus={[
            //   {
            //     key: 'date',
            //     value: moment(formik?.values?.month).format('MMMM'),
            //     color: Colors().pending,
            //   },
            // ]}
          />
        </TouchableOpacity>
      </View>
    );
  };

  /* function gettiing marked data of calendar */
  const generateMarkedDates = attendanceReports => {
    let markedDates = {};

    attendanceReports.forEach((status, index) => {
      const date = `${moment(formik?.values?.month).format('YYYY')}-${moment(
        formik?.values?.month,
      ).format('MM')}-${
        index < 9 ? (index + 1).toString().padStart(2, '0') : index + 1
      }`;
      let marking = {};

      if (status === 'AB') {
        marking = {selected: true, marked: true, selectedColor: Colors().red}; // Absent
      } else if (status === 'HF') {
        marking = {
          selected: true,
          marked: true,
          selectedColor: Colors().pending,
        }; // Half day
      } else {
        marking = {
          selected: true,
          marked: true,
          selectedColor: Colors().aprroved,
        }; // Present
      }

      markedDates[date] = marking;
    });

    return markedDates;
  };

  /*pagination button click funtion*/
  const handlePageClick = () => {
    dispatch(getTimeSheetList({pageSize: pageSize, pageNo: pageNo}));
  };

  const updateCheckDataAtIndex = (index, value) => {
    setCheckData(prevState => {
      const newState = [...prevState];
      newState[index] = value;
      return newState;
    });
  };

  const areAllIdsPresent = (listedData, allData) => {
    // Check if listedData is empty
    if (listedData.length === 0) {
      return false;
    }
    const listedIds = listedData.map(item => item.id);
    const allIds = allData.map(item => item.id);
    return allIds.every(id => listedIds.includes(id));
  };

  useEffect(() => {
    const filteredData = checkData.filter(itm => itm?.chekedValue === true);
    setFilterChekcBox(filteredData);
  }, [checkData]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <View style={styles.twoItemView}>
        {viewType === 'table' && (
          <>
            <View style={styles.leftView}>
              <NeumorphDatePicker
                title={'From'}
                width={WINDOW_WIDTH * 0.4}
                iconPress={() => setOpenFromDate(!openFromDate)}
                valueOfDate={
                  formik?.values?.start_date
                    ? moment(formik?.values?.start_date).format('DD/MM/YYYY')
                    : formik?.values?.start_date
                }
                modal
                open={openFromDate}
                date={new Date()}
                mode="date"
                onConfirm={date => {
                  formik.setFieldValue(`start_date`, date);

                  fetchTableViewData(date, formik?.values?.end_date);
                  setOpenFromDate(false);
                }}
                onCancel={() => {
                  setOpenFromDate(false);
                }}></NeumorphDatePicker>
            </View>
            <View style={styles.rightView}>
              <NeumorphDatePicker
                title={'To'}
                width={WINDOW_WIDTH * 0.4}
                iconPress={() => setOpenToDate(!openToDate)}
                valueOfDate={
                  formik?.values?.end_date
                    ? moment(formik?.values?.end_date).format('DD/MM/YYYY')
                    : formik?.values?.end_date
                }
                modal
                open={openToDate}
                date={new Date()}
                mode="date"
                onConfirm={date => {
                  formik.setFieldValue(`end_date`, date);

                  fetchTableViewData(formik?.values?.start_date, date);
                  setOpenToDate(false);
                }}
                onCancel={() => {
                  setOpenToDate(false);
                }}></NeumorphDatePicker>
            </View>
          </>
        )}
        {viewType === 'calendar' && (
          <>
            <View style={styles.leftView}>
              <NeumorphDatePicker
                title={'Month'}
                width={WINDOW_WIDTH * 0.8}
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

                  fetchCalenderViewDate(date);

                  setOpenMonth(false);
                }}
                onCancel={() => {
                  setOpenMonth(false);
                }}></NeumorphDatePicker>
            </View>
          </>
        )}
        {viewType === 'table' && (
          <View
            style={{
              justifyContent: 'center',

              marginTop: WINDOW_HEIGHT * 0.031,
            }}>
            <Icon
              name="calendar"
              type={IconType.AntDesign}
              size={20}
              color={Colors().purple}
              onPress={() => {
                setViewType('calendar'),
                  fetchCalenderViewDate(formik?.values?.month);
              }}
            />
          </View>
        )}
        {viewType === 'calendar' && (
          <View
            style={{
              justifyContent: 'center',

              marginTop: WINDOW_HEIGHT * 0.031,
            }}>
            <Icon
              name="table"
              type={IconType.AntDesign}
              size={20}
              color={Colors().purple}
              onPress={() => setViewType('table')}
            />
          </View>
        )}
      </View>

      <SeparatorComponent
        separatorWidth={0.2}
        separatorColor={Colors().darkShadow2}
      />

      {/*ui for table view */}
      {viewType === 'table' ? (
        <>
          <View style={{height: WINDOW_HEIGHT * 0.8, width: WINDOW_WIDTH}}>
            <List
              data={timeSheetListData}
              permissions={{view: true}}
              renderItem={renderItem}
              setPageNo={setPageNo}
              pageNo={pageNo}
              apiFunctions={handlePageClick}
              addAction={'AddUpdateAttendanceScreen'}
            />
          </View>
        </>
      ) : null}

      {/*ui for calender view */}
      {viewType === 'calendar' && (
        <>
          {calendarListData?.isLoading ? (
            <Loader />
          ) : !calendarListData?.isLoading &&
            !calendarListData?.isError &&
            calendarListData?.data?.status ? (
            <>
              {filterChekcBox?.length > 0 && (
                <View
                  style={{
                    alignSelf: 'flex-end',
                    flexDirection: 'row',
                    marginRight: 15,
                  }}>
                  <Button
                    btnStyle={{
                      marginTop: -5,
                      marginRight: 10,
                      width: 'auto',
                      padding: 5,
                      backgroundColor: Colors().purple,
                      borderRadius: 2,
                    }}
                    textstyle={{
                      color: Colors().cardBackground,
                      fontFamily: Colors().fontFamilyBookMan,
                    }}
                    title={'Mark Multiple Attendance'}
                    onPress={() => {
                      setAttendanceModal(true);
                    }}
                  />
                  <Text
                    style={[
                      styles.cardHeadingTxt,
                      {color: Colors().purple, fontSize: 15, marginRight: 20},
                    ]}>
                    Select All
                  </Text>
                  <NeumorphicCheckbox
                    isChecked={areAllIdsPresent(
                      filterChekcBox,
                      calendarListData?.data?.data,
                    )}
                    onChange={e => {
                      calendarListData?.data?.data?.map((itm, idx) => {
                        updateCheckDataAtIndex(
                          idx,
                          (val = {chekedValue: e, id: itm?.id}),
                        );
                      });
                    }}
                  />
                </View>
              )}

              <FlatList
                data={attendenceRecordData}
                renderItem={renderItem2}
                keyExtractor={(_, index) => {
                  return index.toString();
                }}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: 50}}
              />
              {attendaceModal && (
                <Formik
                  enableReinitialize={true}
                  initialValues={{
                    attendance_status: 'P',
                    date: '',
                    in_time: moment(new Date()).format('09:00'),
                    out_time: moment(new Date()).format('18:00'),
                    note: '',
                  }}
                  validationSchema={addBulkAttendanceSchema}
                  onSubmit={handleSubmit}>
                  {props => (
                    <AlertModal
                      isLoading={props?.isSubmitting}
                      visible={attendaceModal}
                      iconName={'account-edit-outline'}
                      icontype={IconType.MaterialCommunityIcons}
                      iconColor={Colors().aprroved}
                      textToShow={'Are you sure you want to mark this !!'}
                      Component={
                        <View style={{gap: 10, marginBottom: 20}}>
                          <View>
                            <NeumorphicDropDownList
                              title={'attendance status'}
                              required={true}
                              data={AttendanceOptions}
                              value={props.values?.attendance_status}
                              onChange={val => {
                                props.setFieldValue(
                                  `attendance_status`,
                                  val?.value,
                                );
                              }}
                            />

                            <NeumorphDatePicker
                              title={'In Time'}
                              width={WINDOW_WIDTH * 0.75}
                              iconPress={() => setOpenFromDate(!openFromDate)}
                              valueOfDate={props?.values?.in_time}
                              modal
                              open={openFromDate}
                              date={new Date()}
                              mode="time"
                              onConfirm={date => {
                                props?.setFieldValue(
                                  `in_time`,
                                  moment(date).format('hh:mm'),
                                );
                                setOpenFromDate(false);
                              }}
                              onCancel={() => {
                                setOpenFromDate(false);
                              }}></NeumorphDatePicker>

                            <NeumorphDatePicker
                              title={'Out Time'}
                              width={WINDOW_WIDTH * 0.75}
                              iconPress={() => setOpenToDate(!openToDate)}
                              valueOfDate={props?.values?.out_time}
                              modal
                              open={openToDate}
                              date={new Date()}
                              mode="time"
                              onConfirm={date => {
                                props?.setFieldValue(
                                  `out_time`,
                                  moment(date).format('hh:mm'),
                                );
                                setOpenToDate(false);
                              }}
                              onCancel={() => {
                                setOpenToDate(false);
                              }}></NeumorphDatePicker>

                            <NeumorphicTextInput
                              title="date range"
                              required={true}
                              value={props.values?.date}
                              onChangeText={val => {
                                props?.setFieldValue(`date`, val);
                              }}
                            />
                            <Text
                              style={{
                                fontSize: 12,
                                color: Colors().gray,
                                fontFamily: Colors().fontFamilyBookMan,
                                textTransform: 'uppercase',
                              }}>
                              {'  '}
                              format should be: 1-5, 7-8, 10, etc.
                            </Text>
                            <NeumorphicTextInput
                              title="Note"
                              required={true}
                              onChangeText={val => {
                                props?.setFieldValue(`note`, val);
                              }}
                            />
                          </View>
                        </View>
                      }
                      ConfirmBtnPress={() => props.handleSubmit()}
                    />
                  )}
                </Formik>
              )}
              {/* View for floating button */}
              <View
                style={{
                  marginTop: WINDOW_HEIGHT * 0.65,
                  marginLeft: WINDOW_WIDTH * 0.8,
                  position: 'absolute',
                }}>
                <FloatingAddButton
                  backgroundColor={Colors().purple}
                  onPress={() => {
                    navigation.navigate('AddUpdateAttendanceScreen', {});
                  }}></FloatingAddButton>
              </View>
            </>
          ) : calendarListData?.isError ? (
            <InternalServer />
          ) : !calendarListData?.data?.status &&
            calendarListData?.data?.message === 'data not found' ? (
            <>
              <DataNotFound />
              {/* View for floating button */}
              <View
                style={{
                  marginTop: WINDOW_HEIGHT * 0.65,
                  marginLeft: WINDOW_WIDTH * 0.8,
                  position: 'absolute',
                }}>
                <FloatingAddButton
                  backgroundColor={Colors().purple}
                  onPress={() => {
                    navigation.navigate('AddUpdateAttendanceScreen', {});
                  }}></FloatingAddButton>
              </View>
            </>
          ) : (
            <>
              <InternalServer></InternalServer>
            </>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

export default TimeCardScreen;

const styles = StyleSheet.create({
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
  },

  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },

  paginationButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 4,
    backgroundColor: 'gray',
  },
  activeButton: {
    backgroundColor: '#22c55d',
    width: 50,
    height: 50,
    borderRadius: 25,
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
    margin: WINDOW_WIDTH * 0.05,
  },
  title: {
    fontSize: 15,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
});
