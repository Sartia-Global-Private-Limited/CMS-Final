import {StyleSheet, Text, View, SafeAreaView, Linking} from 'react-native';
import React, {useState, useEffect} from 'react';
import Colors from '../../../constants/Colors';
import IconType from '../../../constants/IconType';
import SearchBar from '../../../component/SearchBar';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import {Icon} from '@rneui/base';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import NeumorphCard from '../../../component/NeumorphCard';
import CustomeHeader from '../../../component/CustomeHeader';
import {getAllBankList} from '../../../redux/slices/master-data-management/bank-mangement/getBankListSlice';
import CustomeCard from '../../../component/CustomeCard';
import List from '../../../component/List/List';

const BankListScreen = ({navigation, route}) => {
  /* declare props constant variale*/

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const ListData = useSelector(state => state.getBankList);

  /*declare useState variable here */
  const [searchText, setSearchText] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(
      getAllBankList({
        search: searchText,
        pageSize: pageSize,
        pageNo: pageNo,
      }),
    );
  }, [isFocused, searchText]);

  const handleAction = actionButton => {
    switch (actionButton.typeOfButton) {
      case 'edit':
        navigation.navigate('AddUpdateBankScreen', {
          edit_id: actionButton?.itemData?.id,
        });

        break;
      default:
        break;
    }
  };

  /* flatlist render ui */
  const renderItem = ({item}) => {
    return (
      <View>
        <CustomeCard
          allData={item}
          avatarImage={item?.logo}
          data={[
            {
              key: 'Bank Name',
              value: item?.bank_name ?? '--',
              keyColor: Colors().aprroved,
            },
            {
              key: 'Link',
              component: (
                <Text
                  numberOfLines={2}
                  onPress={() => Linking.openURL(item?.website)}
                  ellipsizeMode="tail"
                  style={[styles.cardtext, {color: Colors().skyBule}]}>
                  {item?.website}
                </Text>
              ),
            },
          ]}
          status={[
            {
              key: 'Created At',
              value: item?.created_at,
              keyColor: Colors().pending,
            },
          ]}
          editButton={true}
          action={handleAction}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader headerTitle={`All Bank`} />
      <View style={{flexDirection: 'row'}}>
        <SearchBar setSearchText={setSearchText} />
        <View style={{alignSelf: 'center'}}>
          <NeumorphCard>
            <Icon
              name="upload"
              type={IconType.Feather}
              color={Colors().purple}
              onPress={() => {
                setDeleteModalVisible(true), setTaskId(item?.id);
              }}
              style={{margin: 8}}
            />
          </NeumorphCard>
        </View>
      </View>
      <View style={{height: WINDOW_HEIGHT * 0.9, width: WINDOW_WIDTH}}>
        <List
          addAction={'AddUpdateBankScreen'}
          data={ListData}
          permissions={{view: true}}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={() => {
            dispatch(getAllBankList({pageSize: pageSize, pageNo: pageNo}));
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default BankListScreen;

const styles = StyleSheet.create({
  cardtext: {
    color: Colors().pureBlack,
    fontSize: 12,
    fontWeight: '300',
    lineHeight: 21,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    flexShrink: 1,
  },
});
