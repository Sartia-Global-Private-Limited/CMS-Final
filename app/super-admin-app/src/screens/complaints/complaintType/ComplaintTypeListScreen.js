/*    ----------------Created Date :: 5 - sep  -2024   ----------------- */
import {View, SafeAreaView} from 'react-native';
import React, {useState, useEffect} from 'react';
import Colors from '../../../constants/Colors';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import SeparatorComponent from '../../../component/SeparatorComponent';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import CustomeHeader from '../../../component/CustomeHeader';
import CustomeCard from '../../../component/CustomeCard';
import List from '../../../component/List/List';
import {allComplaintTypeList} from '../../../redux/slices/complaintType/getAllComplaintTypeListSlice';
import moment from 'moment';
import SearchBar from '../../../component/SearchBar';

const ComplaintTypeListScreen = ({navigation, route}) => {
  /* declare props constant variale*/

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const ListData = useSelector(state => state.allComplaintType);

  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    dispatch(
      allComplaintTypeList({
        search: searchText,
        pageNo: pageNo,
        pageSize: pageSize,
      }),
    );
  }, [isFocused, searchText]);

  const handleAction = actionButton => {
    switch (actionButton.typeOfButton) {
      case 'edit':
        navigation.navigate('AddUpdateComplaintTypeScreen', {
          item: actionButton?.itemData,
        });

        break;

      default:
        break;
    }
  };

  /* flatlist render ui */
  const renderItem = ({item}) => {
    return (
      <CustomeCard
        avatarImage={item?.logo}
        allData={item}
        data={[
          {
            key: 'Complaint Type',
            value: item?.complaint_type_name ?? '--',
          },
          {
            key: 'Company Name',
            value: item?.energy_company_name ?? '--',
          },
        ]}
        status={[
          {
            key: 'Date',
            value: moment(item?.created_at).format('DD-MM-YYYY : hh:mm:ss : a'),
            color: Colors().purple,
          },
        ]}
        editButton={true}
        action={handleAction}
      />
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader headerTitle={`COMPLAINT Type`} />
      <SearchBar setSearchText={setSearchText} />

      <SeparatorComponent
        separatorWidth={0.2}
        separatorColor={Colors().darkShadow2}
      />

      <View style={{height: WINDOW_HEIGHT * 0.9, width: WINDOW_WIDTH}}>
        <List
          addAction={'AddUpdateComplaintTypeScreen'}
          data={ListData}
          permissions={{view: true}}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={() => {
            dispatch(allComplaintTypeList({pageSize: 8, pageNo: pageNo}));
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default ComplaintTypeListScreen;
