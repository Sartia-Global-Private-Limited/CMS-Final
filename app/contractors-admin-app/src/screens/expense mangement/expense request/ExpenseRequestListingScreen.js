/*    ----------------Created Date :: 15- April -2024   ----------------- */
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
import NeumorphCard from '../../../component/NeumorphCard';
import CustomeHeader from '../../../component/CustomeHeader';
import ImageViewer from '../../../component/ImageViewer';
import Images from '../../../constants/Images';
import NeuomorphAvatar from '../../../component/NeuomorphAvatar';
import { Badge } from '@rneui/themed';
import { getAllExpenseList } from '../../../redux/slices/expense-management/expense-request/getExpenseRequestListSlice';
import moment from 'moment';
import ScreensLabel from '../../../constants/ScreensLabel';
import List from '../../../component/List/List';

const ExpenseRequestListingScreen = ({ navigation, route }) => {
  /* declare props constant variale*/

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const ListData = useSelector(state => state.getExpenseRequestList);
  const label = ScreensLabel();

  /*declare useState variable here */
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  useEffect(() => {
    dispatch(
      getAllExpenseList({
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
          style={styles.cardContainer}
          onPress={() =>
            navigation.navigate('ExpenseRequestDetailScreen', {
              edit_id: item?.id,
            })
          }>
          <NeumorphCard
            darkShadowColor={Colors().darkShadow} // <- set this
            lightShadowColor={Colors().lightShadow} // <- this
          >
            <View
              style={{
                margin: WINDOW_WIDTH * 0.03,
                flex: 1,
              }}>
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
                      onPress={() => {
                        setImageModalVisible(true);
                        setImageUri(`${apiBaseUrl}${item?.image}`);
                      }}
                      source={{
                        uri: item?.image
                          ? `${apiBaseUrl}${item?.image}`
                          : `${
                              Image.resolveAssetSource(Images.DEFAULT_PROFILE)
                                .uri
                            }`,
                      }}
                    />
                  </NeuomorphAvatar>
                </View>

                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        { color: Colors().pureBlack },
                      ]}>
                      unique id :{' '}
                    </Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={[styles.cardtext, { color: Colors().skyBule }]}>
                      {item?.employee_id}
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        { color: Colors().pureBlack },
                      ]}>
                      name :{' '}
                    </Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={[styles.cardtext, { color: Colors().pureBlack }]}>
                      {item?.name}
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        { color: Colors().pureBlack },
                      ]}>
                      Total complaint:{' '}
                    </Text>

                    <View
                      style={{
                        flexDirection: 'row',
                        marginLeft: 5,
                        columnGap: 8,
                      }}>
                      <Badge value={`${item?.totalPunch}`} status="primary" />
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        { color: Colors().pureBlack },
                      ]}>
                      Total amount:{' '}
                    </Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={[styles.cardtext, { color: Colors().aprroved }]}>
                      ₹ {item?.totalSum}
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        { color: Colors().pureBlack },
                      ]}>
                      Transfer amount :{' '}
                    </Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={[styles.cardtext, { color: Colors().aprroved }]}>
                      ₹ {item?.total_expense_amount}
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        { color: Colors().pureBlack },
                      ]}>
                      Balance :{' '}
                    </Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={[styles.cardtext, { color: Colors().aprroved }]}>
                      ₹ {item?.balance}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.actionView}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text
                  style={[
                    styles.cardHeadingTxt,
                    { color: Colors().pureBlack },
                  ]}>
                  requested month :{' '}
                </Text>
                <NeumorphCard>
                  <View style={{ padding: 5 }}>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={[
                        styles.cardtext,
                        {
                          color: Colors().pending,
                        },
                      ]}>
                      {moment(item?.month, 'YY-MM').format('MMMM YYYY')}
                    </Text>
                  </View>
                </NeumorphCard>
              </View>
              <View style={styles.actionView2}></View>
            </View>
          </NeumorphCard>
        </TouchableOpacity>
      </View>
    );
  };

  /*pagination button click funtion*/
  const handlePageClick = () => {
    dispatch(getAllExpenseList({ pageSize: pageSize, pageNo: pageNo }));
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <CustomeHeader headerTitle={label.EXPENSE_REQUEST} />
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
        />
      </View>

      {/* view for modal of upate */}
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

export default ExpenseRequestListingScreen;

const styles = StyleSheet.create({
  cardContainer: {
    width: WINDOW_WIDTH * 0.95,
    marginBottom: 15,
    height: 'auto',
    alignSelf: 'center',
  },
  cardtext: {
    fontSize: 12,
    fontWeight: '300',
    lineHeight: 21,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    flexShrink: 1,
  },
  actionView: {
    margin: WINDOW_WIDTH * 0.03,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionView2: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    columnGap: 10,
  },
  cardHeadingTxt: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 21,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
});
