import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Colors from '../../constants/Colors';
import IconType from '../../constants/IconType';
import SearchBar from '../../component/SearchBar';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../utils/ScreenLayout';
import { Avatar, Icon } from '@rneui/base';
import SeparatorComponent from '../../component/SeparatorComponent';
import FloatingAddButton from '../../component/FloatingAddButton';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../component/Loader';
import InternalServer from '../../component/InternalServer';
import DataNotFound from '../../component/DataNotFound';
import AlertModal from '../../component/AlertModal';
import NeuomorphAvatar from '../../component/NeuomorphAvatar';
import { apiBaseUrl } from '../../../config';
import Images from '../../constants/Images';
import NeumorphCard from '../../component/NeumorphCard';
import CustomeHeader from '../../component/CustomeHeader';
import { getAllPlanPrice } from '../../redux/slices/plan-pricing/getPlanPricingListSlice';
import { Badge } from '@rneui/themed';
import { deletePlanPricingById } from '../../redux/slices/plan-pricing/addUpdatePlanPriceSlice';
import Toast from 'react-native-toast-message';

const PlanPricingListScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const listData = useSelector(state => state.getPlanPricingList);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [planPricingId, setPlanPricingId] = useState('');
  const [searchText, setSearchText] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(getAllPlanPrice({ pageSize: pageSize, pageNo: pageNo }));
  }, [isFocused]);

  /*search function*/
  const searchFunction = searchvalue => {
    dispatch(getAllPlanPrice({ search: searchvalue }));
  };

  const onSearchCancel = () => {
    dispatch(getAllPlanPrice({ pageSize: pageSize, pageNo: pageNo }));
  };
  /* delete plan and pricing function with id */
  const deletePlanPricing = async planPricingId => {
    try {
      const deleteResult = await dispatch(
        deletePlanPricingById(planPricingId),
      ).unwrap();

      if (deleteResult?.status === true) {
        Toast.show({
          type: 'success',
          text1: deleteResult?.message,
          position: 'bottom',
        });
        setDeleteModalVisible(false), setPlanPricingId('');
        dispatch(getAllPlanPrice({ pageSize: pageSize, pageNo: pageNo }));
      } else {
        Toast.show({
          type: 'error',
          text1: deleteResult?.message,
          position: 'bottom',
        });
        setDeleteModalVisible(false), setPlanPricingId('');
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });
      setDeleteModalVisible(false), setPlanPricingId('');
    }
  };

  /* flatlist render ui */
  const renderItem = ({ item }) => {
    return (
      <View>
        <TouchableOpacity style={styles.cardContainer}>
          <NeumorphCard
            darkShadowColor={Colors().darkShadow} // <- set this
            lightShadowColor={Colors().lightShadow} // <- this
          >
            <View
              style={{
                margin: WINDOW_WIDTH * 0.03,
                flexDirection: 'row',
                columnGap: 10,
                // flex: 1,
              }}>
              <NeumorphCard>
                <View style={{ padding: 5 }}>
                  <Avatar
                    size={80}
                    avatarStyle={{ borderRadius: 8 }}
                    source={{
                      uri: item?.image
                        ? `${apiBaseUrl}${item?.image}`
                        : `${
                            Image.resolveAssetSource(Images.DEFAULT_PROFILE).uri
                          }`,
                    }}
                  />
                </View>
              </NeumorphCard>

              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  // backgroundColor: 'green',
                }}>
                {item?.name && (
                  <View style={{ alignSelf: 'center' }}>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={[
                        styles.cardHeadingTxt,
                        { color: Colors().aprroved },
                      ]}>
                      {`${item?.name}`}
                    </Text>
                  </View>
                )}

                {item?.price && (
                  <View style={{ alignSelf: 'center', flexDirection: 'row' }}>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={[
                        styles.cardtext,
                        { color: Colors().aprroved, fontSize: 18 },
                      ]}>
                      {`₹ ${item?.price}`}
                    </Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={[
                        styles.cardtext,
                        { color: Colors().pending, fontSize: 18 },
                      ]}>
                      {` / ${item?.duration}`}
                    </Text>
                  </View>
                )}

                {item?.members && (
                  <FlatList
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    data={item?.members}
                    renderItem={({ item }) => (
                      <View
                        style={{
                          alignSelf: 'center',
                        }}>
                        <NeuomorphAvatar gap={4}>
                          <Avatar
                            rounded
                            size={40}
                            source={{
                              uri: item?.image
                                ? `${apiBaseUrl}${item?.image}`
                                : `${
                                    Image.resolveAssetSource(
                                      Images.DEFAULT_PROFILE,
                                    ).uri
                                  }`,
                            }}
                          />
                        </NeuomorphAvatar>
                      </View>
                    )}
                  />
                )}
              </View>
            </View>

            <View
              style={{
                margin: WINDOW_WIDTH * 0.03,
                // flex: 1,
                // flexDirection: 'row',
                columnGap: 10,
              }}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  // backgroundColor: 'green',
                }}>
                {item?.planCheckLists && (
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.cardHeadingTxt}>CheckLists : </Text>
                    <View style={styles.userNameView}>
                      {item?.planCheckLists.map((itm, index) => (
                        <View
                          style={{
                            flexDirection: 'row',
                            marginLeft: 5,
                          }}>
                          <Badge value={index + 1} status="primary" />
                          <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={[styles.cardtext, { marginLeft: 5 }]}>
                            {itm?.checklist_name}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {item?.modules && (
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.cardHeadingTxt}>Module : </Text>
                    <View style={styles.userNameView}>
                      {item?.modules.map((itm, index) => (
                        <View
                          style={{
                            flexDirection: 'row',
                            marginLeft: 5,
                          }}>
                          <Badge value={index + 1} status="primary" />
                          <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={[styles.cardtext, { marginLeft: 5 }]}>
                            {itm?.module_name}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.cardHeadingTxt}>description : </Text>
                <Text
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  style={styles.cardtext}>
                  {item?.description}
                </Text>
              </View>
            </View>

            <View style={styles.actionView}>
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
                      navigation.navigate('AddUpdatePlainPricingScreen', {
                        edit_id: item?.id,
                      })
                    }
                  />
                </NeumorphCard>
                <NeumorphCard
                  lightShadowColor={Colors().darkShadow2}
                  darkShadowColor={Colors().lightShadow}>
                  <Icon
                    name="delete"
                    type={IconType.AntDesign}
                    color={Colors().red}
                    onPress={() => {
                      setDeleteModalVisible(true), setPlanPricingId(item?.id);
                    }}
                    style={styles.actionIcon}
                  />
                </NeumorphCard>
              </View>
            </View>
          </NeumorphCard>
        </TouchableOpacity>
      </View>
    );
  };

  /*pagination button click funtion*/
  const handlePageClick = number => {
    setPageNo(number);
    dispatch(getAllPlanPrice({ pageSize: pageSize, pageNo: pageNo }));
  };

  /*pagination button UI*/
  const renderPaginationButtons = () => {
    const buttons = [];

    for (let i = 1; i <= listData?.data?.pageDetails?.totalPages; i++) {
      buttons.push(
        <TouchableOpacity
          key={i}
          onPress={() => handlePageClick(i)}
          style={[
            styles.paginationButton,
            i === pageNo ? styles.activeButton : null,
          ]}>
          {/* <Text style={{color: 'white'}}>{i}</Text> */}
        </TouchableOpacity>,
      );
    }

    return buttons;
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <CustomeHeader headerTitle={'Plan & Pricing'} />
      <SearchBar setSearchText={setSearchText} />
      <SeparatorComponent
        separatorWidth={0.2}
        separatorColor={Colors().darkShadow2}
      />
      {listData?.isLoading ? (
        <Loader />
      ) : !listData?.isLoading &&
        !listData?.isError &&
        listData?.data?.status ? (
        <>
          <FlatList
            data={listData?.data?.data}
            renderItem={renderItem}
            keyExtractor={(_, index) => {
              return index.toString();
            }}
            contentContainerStyle={{ paddingBottom: 50 }}
          />
          {listData?.data?.pageDetails?.totalPages > 1 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{
                marginTop: WINDOW_HEIGHT * 0.8,
                bottom: 10,
                alignSelf: 'center',
                position: 'absolute',
                backgroundColor: '',
                marginHorizontal: WINDOW_WIDTH * 0.01,

                columnGap: 20,
              }}>
              {renderPaginationButtons()}
            </ScrollView>
          )}

          {/* modal view for ACTION */}
          {deleteModalVisible && (
            <AlertModal
              visible={deleteModalVisible}
              iconName={'delete-circle-outline'}
              icontype={IconType.MaterialCommunityIcons}
              iconColor={Colors().red}
              textToShow={'ARE YOU SURE YOU WANT TO DELETE THIS!!'}
              cancelBtnPress={() => setDeleteModalVisible(!deleteModalVisible)}
              ConfirmBtnPress={() => deletePlanPricing(planPricingId)}
            />
          )}

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
                navigation.navigate('AddUpdatePlainPricingScreen', {
                  // typeOfComplaint: typeOfComplaint,
                });
              }}></FloatingAddButton>
          </View>
        </>
      ) : listData?.isError ? (
        <InternalServer />
      ) : !listData?.data?.status &&
        listData?.data?.message === 'Data not found' ? (
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
                navigation.navigate('AddUpdatePlainPricingScreen', {
                  // typeOfComplaint: typeOfComplaint,
                });
              }}></FloatingAddButton>
          </View>
        </>
      ) : (
        <InternalServer></InternalServer>
      )}
    </SafeAreaView>
  );
};

export default PlanPricingListScreen;

const styles = StyleSheet.create({
  cardContainer: {
    width: WINDOW_WIDTH * 0.95,
    marginBottom: 15,
    height: 'auto',
    alignSelf: 'center',
  },
  cardHeadingTxt: {
    color: Colors().pureBlack,
    fontSize: 15,
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
  },

  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  userNameView: { flex: 1, flexDirection: 'row', flexWrap: 'wrap' },

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
  buttonText: {
    color: 'white',
  },
  actionView: {
    margin: WINDOW_WIDTH * 0.03,

    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  actionView2: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    columnGap: 10,
  },
});
