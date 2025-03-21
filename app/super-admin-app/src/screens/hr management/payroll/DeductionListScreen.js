import {StyleSheet, Text, View, SafeAreaView} from 'react-native';
import React, {useState, useEffect} from 'react';
import Colors from '../../../constants/Colors';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import {Badge} from '@rneui/base';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import SearchBar from '../../../component/SearchBar';
import {getDeductionList} from '../../../redux/slices/hr-management/payroll/getDeductionListSlice';
import List from '../../../component/List/List';
import CustomeCard from '../../../component/CustomeCard';

const DeductionListScreen = () => {
  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const deductionListData = useSelector(state => state.getDeductionList);

  /*declare useState variable here */
  const [searchText, setSearchText] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(
      getDeductionList({
        pageSize: pageSize,
        pageNo: pageNo,
        search: searchText,
      }),
    );
  }, [isFocused, searchText]);

  /* flatlist render ui  for table view*/
  const renderItem = ({item}) => {
    return (
      <CustomeCard
        allData={item}
        data={[
          {key: 'Name', value: item?.name},
          {key: 'applied type', value: item?.applied_type},

          {key: 'value type', value: item?.value_type},
          {
            key: 'APPLIED ON',
            component:
              item?.applied_on &&
              item?.applied_on?.length > 0 &&
              item?.applied_on.map((itm, index) => (
                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  <Badge value={index + 1} status="primary" />
                  <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={[
                      styles.cardtext,
                      {marginLeft: 5, color: Colors().pureBlack},
                    ]}>
                    {itm?.name}
                  </Text>
                </View>
              )),
          },
          {
            key: 'CREATED AT',
            value: item?.created_at,
            keyColor: Colors().skyBule,
          },
        ]}
        status={[{key: 'value', value: item?.value, color: Colors().pending}]}
      />
    );
  };

  /*pagination button click funtion*/
  const handlePageClick = () => {
    dispatch(getDeductionList({pageSize: pageSize, pageNo: pageNo}));
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <SearchBar setSearchText={setSearchText} />
      <View style={{height: WINDOW_HEIGHT * 0.85, width: WINDOW_WIDTH}}>
        <List
          data={deductionListData}
          permissions={{view: true}}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={handlePageClick}
          addAction={''}
        />
      </View>
    </SafeAreaView>
  );
};

export default DeductionListScreen;

const styles = StyleSheet.create({
  cardtext: {
    fontSize: 12,
    fontWeight: '300',
    lineHeight: 21,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    flexShrink: 1,
  },
});
