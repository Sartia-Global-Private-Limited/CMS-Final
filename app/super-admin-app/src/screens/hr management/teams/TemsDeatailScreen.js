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
import React, {useState, useEffect} from 'react';
import Colors from '../../../constants/Colors';
import IconType from '../../../constants/IconType';
import SearchBar from '../../../component/SearchBar';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import {Avatar, Icon} from '@rneui/base';
import SeparatorComponent from '../../../component/SeparatorComponent';
import FloatingAddButton from '../../../component/FloatingAddButton';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import Loader from '../../../component/Loader';
import InternalServer from '../../../component/InternalServer';
import DataNotFound from '../../../component/DataNotFound';
import ScreensLabel from '../../../constants/ScreensLabel';
import {deleteMemberById} from '../../../redux/slices/hr-management/teams/addUpdateTeamSlice';
import AlertModal from '../../../component/AlertModal';
import NeuomorphAvatar from '../../../component/NeuomorphAvatar';
import {apiBaseUrl} from '../../../../config';
import Images from '../../../constants/Images';
import {getTeamDetail} from '../../../redux/slices/hr-management/teams/getTeamDetailSlice';
import NeumorphCard from '../../../component/NeumorphCard';
import CustomeHeader from '../../../component/CustomeHeader';
import ImageViewer from '../../../component/ImageViewer';
import Toast from 'react-native-toast-message';

const TemsDeatailScreen = ({navigation, route}) => {
  /* declare props constant variale*/
  const teamId = route?.params?.team_id;
  const label = ScreensLabel();
  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const teamDetailData = useSelector(state => state.getTeamDetail);
  const teamDetail = teamDetailData?.data?.data;
  const teamMemberDetail = teamDetail?.members;

  /*declare useState variable here */
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState(false);
  const [memberId, setMemberId] = useState('');
  const [searchText, setSearchText] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(
      getTeamDetail({
        pageSize: pageSize,
        pageNo: pageNo,
        teamId: teamId,
        search: searchText,
      }),
    );
  }, [isFocused, searchText]);

  /*search function*/
  const searchFunction = () => {
    dispatch(getTeamDetail({search: searchText}));
  };

  /* delete team  function with id */
  const deleteMember = async memberId => {
    const reqBody = {
      team_id: teamId,
      user_id: memberId,
    };
    try {
      const deleteResult = await dispatch(deleteMemberById({reqBody})).unwrap();

      if (deleteResult?.status === true) {
        Toast.show({
          type: 'success',
          text1: deleteResult?.message,
          position: 'bottom',
        });

        setDeleteModalVisible(false), setMemberId('');
        dispatch(getTeamDetail({teamId: teamId}));
      } else {
        Toast.show({
          type: 'error',
          text1: deleteResult?.message,
          position: 'bottom',
        });

        setDeleteModalVisible(false), setMemberId('');
      }
    } catch (error) {
      Toast.show({type: 'error', text1: error, position: 'bottom'});
      setDeleteModalVisible(false), setMemberId('');
    }
  };

  /* flatlist render ui */
  const renderItem = ({item}) => {
    return (
      <View>
        <NeumorphCard
          darkShadowColor={Colors().darkShadow} // <- set this
          lightShadowColor={Colors().lightShadow} // <- this
        >
          <View style={styles.userView}>
            <TouchableOpacity
              onPress={() => {
                setImageModalVisible(true),
                  setImageUri(
                    item?.image
                      ? `${apiBaseUrl}${item?.image}`
                      : `${
                          Image.resolveAssetSource(Images.DEFAULT_PROFILE).uri
                        }`,
                  );
              }}>
              <NeuomorphAvatar gap={4}>
                <Avatar
                  rounded
                  size={50}
                  source={{
                    uri: item?.image
                      ? `${apiBaseUrl}${item?.image}`
                      : `${
                          Image.resolveAssetSource(Images.DEFAULT_PROFILE).uri
                        }`,
                  }}
                />
              </NeuomorphAvatar>
            </TouchableOpacity>
            {item?.name && (
              <Text
                numberOfLines={1}
                style={[styles.cardtext, {color: Colors().pureBlack}]}>
                {item?.name}
              </Text>
            )}
            {item?.role && (
              <Text
                numberOfLines={1}
                style={[styles.cardtext, {color: Colors().pureBlack}]}>
                ({item?.role})
              </Text>
            )}
            {item?.employee_id && (
              <Text
                numberOfLines={1}
                style={[styles.cardtext, {color: Colors().pureBlack}]}>
                {item?.employee_id}
              </Text>
            )}
            {item?.mobile && (
              <Text
                numberOfLines={1}
                style={[styles.cardtext, {color: Colors().pureBlack}]}>
                {item?.mobile}
              </Text>
            )}
            {item?.email && (
              <Text
                numberOfLines={1}
                style={[styles.cardtext, {color: Colors().pureBlack}]}>
                {item?.email}
              </Text>
            )}
          </View>

          <View style={styles.actionView2}>
            <NeumorphCard
              lightShadowColor={Colors().darkShadow2}
              darkShadowColor={Colors().lightShadow}>
              <Icon
                name="delete"
                type={IconType.AntDesign}
                color={Colors().red}
                onPress={() => {
                  setDeleteModalVisible(true), setMemberId(item?.id);
                }}
                style={styles.actionIcon}
              />
            </NeumorphCard>
          </View>
        </NeumorphCard>
      </View>
    );
  };

  /*pagination button click funtion*/
  const handlePageClick = number => {
    setPageNo(number);
    dispatch(getTeamDetail({pageSize: pageSize, pageNo: number}));
  };

  /*pagination button UI*/
  const renderPaginationButtons = () => {
    const buttons = [];

    for (let i = 1; i <= teamDetailData?.data?.pageDetails?.totalPages; i++) {
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
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader headerTitle={label.TEAM_DETAIL} />
      <SearchBar setSearchText={setSearchText} />
      <SeparatorComponent
        separatorWidth={0.2}
        separatorColor={Colors().darkShadow2}
      />

      {teamDetailData?.isLoading ? (
        <Loader />
      ) : !teamDetailData?.isLoading &&
        !teamDetailData?.isError &&
        teamDetailData?.data?.status ? (
        <>
          <View style={styles.mainView}>
            <NeumorphCard>
              <View style={styles.cardContainer}>
                <Text style={[styles.headingTxt]}>TEAM DETAILS</Text>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={[
                      styles.cardHeadingTxt,
                      {color: Colors().pureBlack},
                    ]}>
                    TEAM NAME :{' '}
                  </Text>
                  <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={[styles.cardtext, {color: Colors().pureBlack}]}>
                    {teamDetail?.team_name}
                  </Text>
                </View>

                <View style={styles.assignView}>
                  <Text
                    style={[
                      styles.cardHeadingTxt,
                      {color: Colors().pureBlack},
                    ]}>
                    MANAGER -
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setImageModalVisible(true),
                        setImageUri(
                          teamDetail?.manager_image
                            ? `${apiBaseUrl}${teamDetail?.manager_image}`
                            : `${
                                Image.resolveAssetSource(Images.DEFAULT_PROFILE)
                                  .uri
                              }`,
                        );
                    }}>
                    <NeuomorphAvatar gap={4}>
                      <Avatar
                        size={50}
                        rounded
                        source={{
                          uri: teamDetail?.manager_image
                            ? `${apiBaseUrl}${teamDetail?.manager_image}`
                            : `${
                                Image.resolveAssetSource(Images.DEFAULT_PROFILE)
                                  .uri
                              }`,
                        }}
                      />
                    </NeuomorphAvatar>
                  </TouchableOpacity>
                  <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={[styles.cardtext, {color: Colors().pureBlack}]}>
                    {teamDetail?.manager_name}
                  </Text>
                </View>
                <View style={styles.assignView}>
                  <Text
                    style={[
                      styles.cardHeadingTxt,
                      {color: Colors().pureBlack},
                    ]}>
                    SUPERVISOR -
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setImageModalVisible(true),
                        setImageUri(
                          teamDetail?.supervisor_image
                            ? `${apiBaseUrl}${teamDetail?.supervisor_image}`
                            : `${
                                Image.resolveAssetSource(Images.DEFAULT_PROFILE)
                                  .uri
                              }`,
                        );
                    }}>
                    <NeuomorphAvatar gap={4}>
                      <Avatar
                        size={50}
                        rounded
                        source={{
                          uri: teamDetail?.supervisor_image
                            ? `${apiBaseUrl}${teamDetail?.supervisor_image}`
                            : `${
                                Image.resolveAssetSource(Images.DEFAULT_PROFILE)
                                  .uri
                              }`,
                        }}
                      />
                    </NeuomorphAvatar>
                  </TouchableOpacity>
                  <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={[styles.cardtext, {color: Colors().pureBlack}]}>
                    {teamDetail?.supervisor_name}
                  </Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={[
                      styles.cardHeadingTxt,
                      {color: Colors().pureBlack},
                    ]}>
                    DESCRIPTION :{' '}
                  </Text>
                  <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={[styles.cardtext, {color: Colors().pureBlack}]}>
                    {teamDetail?.team_short_description}
                  </Text>
                </View>
              </View>
            </NeumorphCard>
          </View>

          <FlatList
            data={teamMemberDetail}
            // keyExtractor={item => item.id}
            numColumns={2}
            columnWrapperStyle={{
              justifyContent: 'space-evenly',
              marginTop: 15,
            }}
            scrollEnabled={true}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 20}}
            renderItem={renderItem}></FlatList>
          {teamDetailData?.data?.pageDetails?.totalPages > 1 && (
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
              ConfirmBtnPress={() => deleteMember(memberId)}
            />
          )}
          {/* modal view for Image viewer */}
          {imageModalVisible && (
            <ImageViewer
              visible={imageModalVisible}
              imageUri={imageUri}
              cancelBtnPress={() => setImageModalVisible(!imageModalVisible)}
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
                navigation.navigate('AddTeamMemeberScreen', {
                  team_id: teamId,
                });
              }}></FloatingAddButton>
          </View>
        </>
      ) : teamDetailData?.isError ? (
        <InternalServer />
      ) : !teamDetailData?.data?.status &&
        teamDetailData?.data?.message === 'Data not found' ? (
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
                navigation.navigate('AddTeamMemeberScreen', {
                  team_id: teamId,
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

export default TemsDeatailScreen;

const styles = StyleSheet.create({
  mainView: {
    padding: 15,
    rowGap: 15,
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
  assignView: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
  },

  cardContainer: {
    paddingHorizontal: WINDOW_WIDTH * 0.05,
    paddingVertical: WINDOW_HEIGHT * 0.01,
  },
  cardHeadingTxt: {
    fontSize: 13,

    lineHeight: 21,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  cardtext: {
    fontSize: 13,

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

  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: 'transparent',
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
    right: 5,
    top: 5,
    position: 'absolute',
  },
  mangerNameView: {
    margin: WINDOW_WIDTH * 0.03,

    maxWidth: '30%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: -10,
  },
  userView: {
    flex: 1,

    margin: WINDOW_WIDTH * 0.03,
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 4,
    maxWidth: WINDOW_WIDTH * 0.8,
    width: WINDOW_WIDTH * 0.4,
  },
});
