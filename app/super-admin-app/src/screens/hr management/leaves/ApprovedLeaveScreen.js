import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Colors from '../../../constants/Colors';
import IconType from '../../../constants/IconType';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import {Icon} from '@rneui/base';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import SearchBar from '../../../component/SearchBar';
import {getAllLeaveList} from '../../../redux/slices/hr-management/leave/getLeaveListSlice';
import ScreensLabel from '../../../constants/ScreensLabel';
import CustomeCard from '../../../component/CustomeCard';
import List from '../../../component/List/List';

const ApprovedLeaveScreen = ({navigation, route}) => {
  /* declare props constant variale*/
  const label = ScreensLabel();

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const getLeaveListData = useSelector(state => state?.getLeaveList);

  /*declare useState variable here */
  const [searchText, setSearchText] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(
      getAllLeaveList({
        pageSize: pageSize,
        pageNo: pageNo,
        search: searchText,
      }),
    );
  }, [isFocused, searchText]);

  /*function for giveing color of status*/
  function getStatusColor(action) {
    switch (action) {
      case 'pending':
        return Colors().pending;
      case 'approved':
        return Colors().aprroved;
      case 'rejected':
        return Colors().rejected;

      default:
        return Colors().black2;
    }
  }

  /* flatlist render ui  for table view*/
  const renderItem = ({item}) => {
    if (item?.status === 'approved') {
      return (
        <View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('LeaveDetailScreen', {
                leaveData: item,
              })
            }>
            <CustomeCard
              avatarImage={item?.user_image}
              data={[
                {key: 'EMPLOYEE NAME', value: item?.applicant_name},
                {key: 'EMPLOYEE Id ', value: item?.id},
                {
                  component: (
                    <View style={{flexDirection: 'row'}}>
                      <Text
                        style={[
                          styles.cardHeadingTxt,
                          {color: Colors().pureBlack},
                        ]}>
                        start date :{' '}
                      </Text>
                      <Icon
                        name="calendar"
                        type={IconType.AntDesign}
                        color={Colors().aprroved}
                        size={20}
                      />
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={[
                          styles.cardtext,
                          {marginLeft: 5, color: Colors().pureBlack},
                        ]}>
                        {moment(item?.start_date).format('DD/MM/YYYY')}
                      </Text>
                    </View>
                  ),
                },
                {
                  component: (
                    <View style={{flexDirection: 'row'}}>
                      <Text
                        style={[
                          styles.cardHeadingTxt,
                          {color: Colors().pureBlack},
                        ]}>
                        end date :{' '}
                      </Text>
                      <Icon
                        name="calendar"
                        type={IconType.AntDesign}
                        color={Colors().red}
                        size={20}
                      />
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={[
                          styles.cardtext,
                          {marginLeft: 5, color: Colors().pureBlack},
                        ]}>
                        {moment(item?.end_date).format('DD/MM/YYYY')}
                      </Text>
                    </View>
                  ),
                },
                ...(item?.total_days || item?.total_hours
                  ? [
                      {
                        key: 'Duration',
                        value: `${item?.total_days} days ${item?.total_hours} hours`,
                      },
                    ]
                  : []),
                ...(item?.leave_type
                  ? [{key: 'leave type', value: item?.leave_type}]
                  : []),
              ]}
              status={[
                {
                  key: 'status',
                  value: item?.status,
                  color: getStatusColor(item?.status),
                },
              ]}
            />
          </TouchableOpacity>
        </View>
      );
    }
  };

  /*pagination button click funtion*/
  const handlePageClick = () => {
    dispatch(getAllLeaveList({pageSize: pageSize, pageNo: pageNo}));
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <SearchBar setSearchText={setSearchText} />

      <View style={{height: WINDOW_HEIGHT * 0.85, width: WINDOW_WIDTH}}>
        <List
          data={getLeaveListData}
          permissions={{view: true}}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={handlePageClick}
          addAction={'AddUpdateLeaveScreen'}
        />
      </View>
    </SafeAreaView>
  );
};

export default ApprovedLeaveScreen;

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
});
