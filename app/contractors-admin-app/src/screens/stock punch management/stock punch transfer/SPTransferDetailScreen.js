/*    ----------------Created Date :: 24- April -2024   ----------------- */
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Image,
  RefreshControl,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Colors from '../../../constants/Colors';
import IconType from '../../../constants/IconType';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import {Avatar} from '@rneui/base';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import Loader from '../../../component/Loader';
import InternalServer from '../../../component/InternalServer';
import DataNotFound from '../../../component/DataNotFound';
import {apiBaseUrl} from '../../../../config';
import CustomeHeader from '../../../component/CustomeHeader';
import ImageViewer from '../../../component/ImageViewer';
import Images from '../../../constants/Images';
import NeuomorphAvatar from '../../../component/NeuomorphAvatar';
import ScreensLabel from '../../../constants/ScreensLabel';
import {getAllSPTransferList} from '../../../redux/slices/stock-punch-management/stock-transfer/getSPTransferListSlice';
import CustomeCard from '../../../component/CustomeCard';
import FloatingAddButton from '../../../component/FloatingAddButton';
import {getSPTransferDetailById} from '../../../redux/slices/stock-punch-management/stock-transfer/getSPTransferDetailSlice';

const SPTransferDetailScreen = ({navigation, route}) => {
  /* declare props constant variale*/
  const transfer_by_id = route?.params?.transfer_by_id;
  const transfer_to_id = route?.params?.transfer_to_id;
  const label = ScreensLabel();
  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const ListData = useSelector(state => state.getSPTransferDetail);

  /*declare useState variable here */
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  useEffect(() => {
    dispatch(
      getSPTransferDetailById({
        transferById: transfer_by_id,
        transferToId: transfer_to_id,
        pageSize: pageSize,
        pageNo: pageNo,
      }),
    );
  }, [transfer_to_id, transfer_by_id]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      dispatch(
        getAllSPTransferList({
          pageSize: pageSize,
          pageNo: pageNo,
        }),
      );

      setRefreshing(false);
    }, 2000);
  }, []);

  /*search function*/
  const searchFunction = searchvalue => {
    dispatch(getAllSPTransferList({search: searchvalue}));
  };

  const onSearchCancel = () => {
    dispatch(getAllSPTransferList({pageSize: pageSize, pageNo: pageNo}));
  };

  /* if we got no data for flatlist*/
  const renderEmptyComponent = () => (
    // Render your empty component here<>
    <View
      style={{
        height: WINDOW_HEIGHT * 0.6,
      }}>
      <DataNotFound />
    </View>
  );

  /* flatlist render ui */
  const renderItem = ({item}) => {
    return (
      <View>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('SPTransferDetailScreen', {
              edit_id: item?.id,
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
                        {color: Colors().pureBlack},
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
                      style={[styles.cardtext, {color: Colors().pureBlack}]}>
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
                        {color: Colors().pureBlack},
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
                      style={[styles.cardtext, {color: Colors().pureBlack}]}>
                      {item?.transfer_to_details?.name}
                    </Text>
                  </View>
                ),
              },
              {key: 'supplier name', value: item?.supplier_name},
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
  const handlePageClick = number => {
    setPageNo(number);
    dispatch(getAllSPTransferList({pageSize: pageSize, pageNo: number}));
  };

  /*pagination button UI*/
  const renderPaginationButtons = () => {
    const buttons = [];
    for (let i = 1; i <= ListData?.data?.pageDetails?.totalPages; i++) {
      buttons.push(
        <TouchableOpacity
          key={i}
          onPress={() => handlePageClick(i)}
          style={[
            styles.paginationButton,
            i === pageNo ? styles.activeButton : null,
          ]}>
          <Text style={{color: 'white'}}>{i}</Text>
        </TouchableOpacity>,
      );
    }

    return buttons;
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader
        headerTitle={`${label.STOCK_PUNCH_TRANSFER} ${label.DETAIL}`}
      />

      {ListData?.isLoading ? (
        <Loader />
      ) : !ListData?.isLoading &&
        !ListData?.isError &&
        ListData?.data?.status ? (
        <>
          <FlatList
            data={ListData?.data?.data}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={{paddingBottom: 50}}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={renderEmptyComponent}
          />
          {ListData?.data?.pageDetails?.totalPages > 1 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.paginationButtonView}>
              {renderPaginationButtons()}
            </ScrollView>
          )}

          {/*view for modal of upate */}
          {imageModalVisible && (
            <ImageViewer
              visible={imageModalVisible}
              imageUri={imageUri}
              cancelBtnPress={() => setImageModalVisible(!imageModalVisible)}
              // downloadBtnPress={item => downloadImageRemote(item)}
            />
          )}
          {/* View for floating button */}
          <View
            style={{
              marginTop: WINDOW_HEIGHT * 0.75,
              marginLeft: WINDOW_WIDTH * 0.8,
              position: 'absolute',
            }}>
            <FloatingAddButton
              backgroundColor={Colors().purple}
              onPress={() => {
                navigation.navigate('AddUpdateProductScreen', {
                  // empId: item?.id,
                });
              }}></FloatingAddButton>
          </View>
        </>
      ) : ListData?.isError ? (
        <InternalServer />
      ) : !ListData?.data?.status &&
        ListData?.data?.message == 'Data not found' ? (
        <>
          <DataNotFound />
          {/* View for floating button */}
          <View
            style={{
              marginTop: WINDOW_HEIGHT * 0.75,
              marginLeft: WINDOW_WIDTH * 0.8,
              position: 'absolute',
            }}>
            <FloatingAddButton
              backgroundColor={Colors().purple}
              onPress={() => {
                navigation.navigate('AddUpdateProductScreen', {});
              }}></FloatingAddButton>
          </View>
        </>
      ) : (
        <InternalServer></InternalServer>
      )}
    </SafeAreaView>
  );
};

export default SPTransferDetailScreen;

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

  paginationButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 4,
    backgroundColor: 'gray',
  },
  paginationButtonView: {
    marginTop: WINDOW_HEIGHT * 0.8,
    bottom: 10,
    alignSelf: 'center',
    position: 'absolute',
    backgroundColor: '',
    marginHorizontal: WINDOW_WIDTH * 0.01,
    columnGap: 20,
  },
  activeButton: {
    backgroundColor: '#22c55d',
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});
