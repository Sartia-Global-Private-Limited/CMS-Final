import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import CustomeHeader from '../../component/CustomeHeader';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../utils/ScreenLayout';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { getMessageList } from '../../redux/slices/communications/getMessageSlice';
import List from '../../component/List/List';
import CustomeCard from '../../component/CustomeCard';
import moment from 'moment';
import Colors from '../../constants/Colors';

const Chats = () => {
  const isFocused = useIsFocused();
  const ListData = useSelector(state => state.getMessageList);
  const [search, setSearchText] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const navigation = useNavigation();

  const results = !search
    ? ListData
    : ListData?.data?.data?.filter(
        item =>
          item?.message_content
            ?.toLowerCase()
            .includes(search.toLocaleLowerCase()) ||
          item?.sender_details?.name
            ?.toLowerCase()
            .includes(search.toLocaleLowerCase()),
      );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMessageList());
  }, [isFocused]);

  const handlePageClick = () => {
    dispatch(getMessageList());
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('MessageScreen', { item: item });
        }}>
        <CustomeCard
          allData={item}
          avatarImage={item?.sender_details?.image}
          data={[
            {
              key: '',
              value: '',
              component: (
                <View
                  style={{
                    width: WINDOW_WIDTH * 0.7,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: Colors().pureBlack,
                      fontWeight: '300',
                    }}>
                    {item?.sender_details?.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: Colors().pureBlack,
                      fontWeight: '300',
                    }}>
                    🕗 {moment(item?.timestamp).calendar()}
                  </Text>
                </View>
              ),
            },
            { key: '', value: item?.message_content },
          ]}
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView>
      <CustomeHeader headerTitle={'Chats'} />
      {/* <SearchBar
        onChangeText={val => {
          setSearchText(val);
        }}
        value={search}
        onRightIconPress={() => {
          setSearchText(''), onSearchCancel();
        }}
      /> */}
      <View style={{ height: WINDOW_HEIGHT, width: WINDOW_WIDTH }}>
        <List
          data={search != '' ? results : ListData}
          permissions={{ view: true }}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={handlePageClick}
          addAction={'NewChat'}
        />
      </View>
    </SafeAreaView>
  );
};

export default Chats;

const styles = StyleSheet.create({});
