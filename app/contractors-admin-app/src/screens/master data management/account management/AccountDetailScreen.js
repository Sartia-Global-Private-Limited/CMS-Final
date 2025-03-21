/*    ----------------Created Date :: 8- March -2024   ----------------- */

import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Colors from '../../../constants/Colors';
import IconType from '../../../constants/IconType';
import CustomeHeader from '../../../component/CustomeHeader';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../utils/ScreenLayout';
import FloatingAddButton from '../../../component/FloatingAddButton';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../../component/Loader';
import InternalServer from '../../../component/InternalServer';
import DataNotFound from '../../../component/DataNotFound';
import NeumorphCard from '../../../component/NeumorphCard';
import { getAccountDetailById } from '../../../redux/slices/master-data-management/account-mangement/getAccountDetailSlice';
import NeuomorphAvatar from '../../../component/NeuomorphAvatar';
import { Avatar, Icon } from '@rneui/themed';
import Images from '../../../constants/Images';
import { apiBaseUrl } from '../../../../config';
import { getAllTransactionList } from '../../../redux/slices/master-data-management/account-mangement/getTransactionHistorySlice';
import { Menu, MenuItem } from 'react-native-material-menu';

const AccountDetailScreen = ({ navigation, route }) => {
  const edit_id = route?.params?.edit_id;

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState('last12Months');
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [visible, setVisible] = useState(false);

  const filterArray = [
    'today',
    'yesterday',
    'this Week',
    'last Week',
    'last Month',
    'this Quarter',
    'last Quarter',
    'last 6 Months',
    'last 12 Months',
  ];

  const hideMenu = val => {
    const valueToSend = val?.split(' ').join('');
    setVisible(false);
    if (val !== undefined) {
      dispatch(
        getAllTransactionList({
          id: edit_id,
          date: valueToSend || searchText,
          pageSize: pageSize,
          pageNo: pageNo,
        }),
      );
    }
  };

  const showMenu = () => setVisible(true);

  const listData = useSelector(state => state.getAccountDetail);
  const transactionData = useSelector(state => state.getTransactionHistory);
  const data = listData?.data?.data;

  const historyData = transactionData?.data?.data;

  useEffect(() => {
    dispatch(getAccountDetailById(edit_id));
    dispatch(
      getAllTransactionList({
        id: edit_id,
        date: searchText,
        pageSize: pageSize,
        pageNo: pageNo,
      }),
    );
  }, [edit_id]);

  /* for getting color of status*/
  function getStatusColor(action) {
    switch (action) {
      case 'credit':
        return Colors().aprroved;
      case 'debit':
        return Colors().red;

      default:
        return 'black';
    }
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <CustomeHeader headerTitle={`Account Detail`} />

      {listData?.isLoading ? (
        <Loader />
      ) : !listData?.isLoading &&
        !listData?.isError &&
        listData?.data?.status ? (
        <>
          <ScrollView style={{}}>
            <View style={styles.mainView}>
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
                            setImageUri(`${apiBaseUrl}${data?.bank_logo}`);
                          }}
                          source={{
                            uri: data?.bank_logo
                              ? `${apiBaseUrl}${data?.bank_logo}`
                              : `${
                                  Image.resolveAssetSource(
                                    Images.DEFAULT_PROFILE,
                                  ).uri
                                }`,
                          }}
                        />
                      </NeuomorphAvatar>
                    </View>

                    <View style={{ flex: 1, justifyContent: 'center' }}>
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.cardHeadingTxt}>user name : </Text>

                        <Text
                          numberOfLines={2}
                          ellipsizeMode="tail"
                          style={styles.cardtext}>
                          {data?.accounts[0]?.user_name}
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.cardHeadingTxt}>Bank name : </Text>

                        <Text
                          numberOfLines={2}
                          ellipsizeMode="tail"
                          style={styles.cardtext}>
                          {data?.bank_name}
                        </Text>
                      </View>

                      <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.cardHeadingTxt}>
                          account number :{' '}
                        </Text>
                        <Text
                          numberOfLines={2}
                          ellipsizeMode="tail"
                          style={[styles.cardtext, { color: Colors().purple }]}>
                          {data?.accounts[0]?.account_number}
                        </Text>
                      </View>

                      <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.cardHeadingTxt}>Ifsc code : </Text>

                        <Text
                          numberOfLines={2}
                          ellipsizeMode="tail"
                          style={styles.cardtext}>
                          {data?.accounts[0]?.ifsc_code}
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.cardHeadingTxt}>branch : </Text>

                        <Text
                          numberOfLines={2}
                          ellipsizeMode="tail"
                          style={styles.cardtext}>
                          {data?.accounts[0]?.branch}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.actionView}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.cardHeadingTxt}>balance : </Text>
                    <NeumorphCard>
                      <View style={{ padding: 5 }}>
                        <Text
                          numberOfLines={1}
                          ellipsizeMode="tail"
                          style={[
                            styles.cardtext,
                            { color: Colors().pending },
                          ]}>
                          ₹ {data?.accounts[0]?.balance}
                        </Text>
                      </View>
                    </NeumorphCard>
                  </View>
                  <View style={styles.actionView2}>
                    <NeumorphCard
                      lightShadowColor={Colors().darkShadow2}
                      darkShadowColor={Colors().lightShadow}>
                      <Icon
                        name="edit"
                        type={IconType.Feather}
                        color={Colors().edit}
                        style={styles.actionIcon}
                        onPress={() =>
                          navigation.navigate('AddUpdateAcoountScreen', {
                            edit_id: edit_id,
                            // type: 'update',
                          })
                        }
                      />
                    </NeumorphCard>
                  </View>
                </View>
              </NeumorphCard>

              <View style={styles.actionView}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text
                    style={[
                      styles.cardHeadingTxt,
                      { fontSize: 15, color: Colors().purple },
                    ]}>
                    All transaction history :{' '}
                  </Text>
                </View>

                <View style={styles.actionView2}>
                  <Menu
                    visible={visible}
                    anchor={
                      <Icon
                        name="dots-three-vertical"
                        type={IconType.Entypo}
                        color={Colors().edit}
                        style={styles.actionIcon}
                        onPress={showMenu}
                      />
                    }
                    onRequestClose={hideMenu}>
                    {filterArray.map(itm => (
                      <MenuItem
                        textStyle={styles.cardtext}
                        onPress={() => {
                          hideMenu(itm);
                          setSearchText(itm);
                        }}>
                        {itm}
                      </MenuItem>
                    ))}
                  </Menu>
                </View>
              </View>

              {transactionData?.isLoading ? (
                <View style={styles.transactionNoFound}>
                  <Loader />
                </View>
              ) : !transactionData?.isLoading &&
                !transactionData?.isError &&
                transactionData?.data?.status ? (
                <>
                  {/*ui for transaction list*/}

                  {historyData.map(item => (
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
                          <View style={{ flex: 1, justifyContent: 'center' }}>
                            <View style={{ flexDirection: 'row' }}>
                              <Text style={styles.cardHeadingTxt}>
                                description :{' '}
                              </Text>

                              <Text
                                numberOfLines={2}
                                ellipsizeMode="tail"
                                style={styles.cardtext}>
                                {item?.description}
                              </Text>
                            </View>

                            <View style={{ flexDirection: 'row' }}>
                              <Text style={styles.cardHeadingTxt}>
                                UPDATED BALANCE :{' '}
                              </Text>
                              <Text
                                numberOfLines={2}
                                ellipsizeMode="tail"
                                style={[
                                  styles.cardtext,
                                  { color: Colors().purple },
                                ]}>
                                {item?.updated_balance}
                              </Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                              <Text style={styles.cardHeadingTxt}>date : </Text>

                              <Text
                                numberOfLines={2}
                                ellipsizeMode="tail"
                                style={styles.cardtext}>
                                {item?.date}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>

                      <View style={styles.actionView}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <Text style={styles.cardHeadingTxt}>
                            Transaction :{' '}
                          </Text>
                          <NeumorphCard>
                            <View style={{ padding: 5 }}>
                              <Text
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                style={[
                                  styles.cardtext,
                                  { color: getStatusColor(item?.status) },
                                ]}>
                                {item.status == 'credit' ? '+' : '-'} ₹{' '}
                                {item?.transaction}
                              </Text>
                            </View>
                          </NeumorphCard>
                        </View>
                        <View style={styles.actionView2}>
                          <NeumorphCard>
                            <View style={{ padding: 5 }}>
                              <Text
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                style={[
                                  styles.cardtext,
                                  { color: getStatusColor(item?.status) },
                                ]}>
                                {item?.status}ed
                              </Text>
                            </View>
                          </NeumorphCard>
                        </View>
                      </View>
                    </NeumorphCard>
                  ))}
                </>
              ) : transactionData?.isError ? (
                <InternalServer />
              ) : !transactionData?.data?.status &&
                transactionData?.data?.message == 'No Data found' ? (
                <View style={styles.transactionNoFound}>
                  <DataNotFound />
                </View>
              ) : (
                <View style={styles.transactionNoFound}>
                  <InternalServer />
                </View>
              )}
            </View>
          </ScrollView>
        </>
      ) : listData?.isError ? (
        <InternalServer />
      ) : !listData?.data?.status &&
        listData?.data?.message == 'No Data found' ? (
        <>
          <DataNotFound />
          {/* View for floating button */}
          <View
            style={{
              marginTop: WINDOW_HEIGHT * 0.8,
              marginLeft: WINDOW_WIDTH * 0.8,
              position: 'absolute',
            }}>
            <FloatingAddButton
              backgroundColor={Colors().purple}
              onPress={() => {
                navigation.navigate('AddUpdateSuplierScreen');
              }}></FloatingAddButton>
          </View>
        </>
      ) : (
        <InternalServer />
      )}
    </SafeAreaView>
  );
};

export default AccountDetailScreen;

const styles = StyleSheet.create({
  mainView: {
    padding: 15,
    rowGap: 15,
  },
  cardContainer: {
    // margin: WINDOW_WIDTH * 0.03,
    // flex: 1,
    // rowGap: WINDOW_HEIGHT * 0.01,
  },
  transactionNoFound: {
    height: WINDOW_HEIGHT * 0.4,
    width: WINDOW_WIDTH * 0.95,
  },
  headingTxt: {
    color: Colors().purple,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    alignSelf: 'center',
    marginBottom: 2,
  },

  cardHeadingTxt: {
    color: Colors().pureBlack,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 21,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  cardtext: {
    color: Colors().pureBlack,
    fontSize: 12,
    fontWeight: '300',
    lineHeight: 21,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    flexShrink: 1,
    marginLeft: 2,
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
  actionIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },

  tableHeadingView: {
    // width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'green',
  },
  defaultView: {
    backgroundColor: Colors().purple,
    borderRadius: 5,
    padding: 1,
    height: 20,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
