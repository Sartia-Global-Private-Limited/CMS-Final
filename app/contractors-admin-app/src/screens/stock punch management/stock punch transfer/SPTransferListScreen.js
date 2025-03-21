/*    ----------------Created Date :: 24- April -2024   ----------------- */
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Colors from '../../../constants/Colors';
import SearchBar from '../../../component/SearchBar';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../utils/ScreenLayout';
import { Avatar } from '@rneui/base';
import { useDispatch, useSelector } from 'react-redux';
import { apiBaseUrl } from '../../../../config';
import CustomeHeader from '../../../component/CustomeHeader';
import ImageViewer from '../../../component/ImageViewer';
import Images from '../../../constants/Images';
import NeuomorphAvatar from '../../../component/NeuomorphAvatar';
import ScreensLabel from '../../../constants/ScreensLabel';
import { getAllSPTransferList } from '../../../redux/slices/stock-punch-management/stock-transfer/getSPTransferListSlice';
import CustomeCard from '../../../component/CustomeCard';
import List from '../../../component/List/List';

const SPTransferListScreen = ({ navigation, route }) => {
  /* declare props constant variale*/
  const label = ScreensLabel();
  /*declare hooks variable here */
  const dispatch = useDispatch();
  const ListData = useSelector(state => state.getSPTransferList);

  /*declare useState variable here */
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  useEffect(() => {
    dispatch(
      getAllSPTransferList({
        pageSize: pageSize,
        pageNo: pageNo,
        search: searchText,
      }),
    );
  }, [searchText]);

  /* flatlist render ui */
  const renderItem = ({ item }) => {
    return (
      <View>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('SPTransferDetailScreen', {
              transfer_by_id: item?.transfer_by?.id,
              transfer_to_id: item?.transfer_to_details?.id,
            })
          }>
          <CustomeCard
            data={[
              {
                component: (
                  <View style={styles.transfer_by}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        { color: Colors().pureBlack },
                      ]}>
                      Transfer by :{' '}
                    </Text>
                    <NeuomorphAvatar gap={4}>
                      <Avatar
                        size={50}
                        rounded
                        onPress={() => {
                          setImageModalVisible(true);
                          setImageUri(
                            `${apiBaseUrl}${item?.transfer_by?.image}`,
                          );
                        }}
                        source={{
                          uri: item?.transfer_by?.image
                            ? `${apiBaseUrl}${item?.transfer_by?.image}`
                            : `${
                                Image.resolveAssetSource(Images.DEFAULT_PROFILE)
                                  .uri
                              }`,
                        }}
                      />
                    </NeuomorphAvatar>
                    <Text
                      numberOfLines={2}
                      style={[styles.cardtext, { color: Colors().pureBlack }]}>
                      {item?.transfer_by?.name}
                    </Text>
                  </View>
                ),
              },
              {
                component: (
                  <View
                    style={{
                      flexDirection: 'row',

                      alignItems: 'center',
                      columnGap: 10,
                      flex: 1,
                    }}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        { color: Colors().pureBlack },
                      ]}>
                      Transfer to :{' '}
                    </Text>
                    <NeuomorphAvatar gap={4}>
                      <Avatar
                        size={50}
                        rounded
                        onPress={() => {
                          setImageModalVisible(true);
                          setImageUri(
                            `${apiBaseUrl}${item?.transfer_to_details?.image}`,
                          );
                        }}
                        source={{
                          uri: item?.transfer_to_details?.image
                            ? `${apiBaseUrl}${item?.transfer_to_details?.image}`
                            : `${
                                Image.resolveAssetSource(Images.DEFAULT_PROFILE)
                                  .uri
                              }`,
                        }}
                      />
                    </NeuomorphAvatar>
                    <Text
                      numberOfLines={2}
                      style={[styles.cardtext, { color: Colors().pureBlack }]}>
                      {item?.transfer_to_details?.name}
                    </Text>
                  </View>
                ),
              },
              { key: 'supplier name', value: item?.supplier_name },
            ]}
            status={[
              {
                key: 'TRANSFER DATE & TIME',
                value: item?.transfered_date,
                color: Colors().pending,
              },
            ]}
          />
        </TouchableOpacity>
      </View>
    );
  };

  /*pagination button click funtion*/
  const handlePageClick = () => {
    dispatch(getAllSPTransferList({ pageSize: pageSize, pageNo: pageNo }));
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <CustomeHeader headerTitle={label.STOCK_PUNCH_TRANSFER} />
      <View style={{ flexDirection: 'row' }}>
        <SearchBar setSearchText={setSearchText} />
      </View>

      <View style={{ height: WINDOW_HEIGHT * 0.9, width: WINDOW_WIDTH }}>
        <List
          data={ListData}
          permissions={{ view: true }}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={handlePageClick}
          addAction={'SPTransferScreen'}
        />
      </View>

      {/*view for modal of upate */}
      {imageModalVisible && (
        <ImageViewer
          visible={imageModalVisible}
          imageUri={imageUri}
          cancelBtnPress={() => setImageModalVisible(!imageModalVisible)}
          // downloadBtnPress={item => downloadImageRemote(item)}
        />
      )}
    </SafeAreaView>
  );
};

export default SPTransferListScreen;

const styles = StyleSheet.create({
  transfer_by: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
    flex: 1,
  },
  cardtext: {
    fontSize: 12,
    fontWeight: '300',
    lineHeight: 21,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    flexShrink: 1,
  },
  cardHeadingTxt: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 20,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
});
