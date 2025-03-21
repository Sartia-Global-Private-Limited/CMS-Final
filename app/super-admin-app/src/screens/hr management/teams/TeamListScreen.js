import {
  StyleSheet,
  View,
  SafeAreaView,
  FlatList,
  ToastAndroid,
  Image,
  Pressable,
} from 'react-native';
import React, {useState, useEffect, Component} from 'react';
import Colors from '../../../constants/Colors';
import IconType from '../../../constants/IconType';
import SearchBar from '../../../component/SearchBar';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import {Avatar} from '@rneui/base';
import SeparatorComponent from '../../../component/SeparatorComponent';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import ScreensLabel from '../../../constants/ScreensLabel';
import {deleteTeamById} from '../../../redux/slices/hr-management/teams/addUpdateTeamSlice';
import AlertModal from '../../../component/AlertModal';
import NeuomorphAvatar from '../../../component/NeuomorphAvatar';
import {apiBaseUrl} from '../../../../config';
import Images from '../../../constants/Images';
import {getTeamList} from '../../../redux/slices/hr-management/teams/getTeamListSlice';
import CustomeHeader from '../../../component/CustomeHeader';
import List from '../../../component/List/List';
import CustomeCard from '../../../component/CustomeCard';

const TeamListScreen = ({navigation, route}) => {
  /* declare props constant variale*/
  const label = ScreensLabel();
  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const teamListData = useSelector(state => state.getTeamList);

  /*declare useState variable here */
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [teamId, setTeamId] = useState('');
  const [searchText, setSearchText] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(
      getTeamList({pageSize: pageSize, pageNo: pageNo, search: searchText}),
    );
  }, [isFocused, searchText]);

  /* delete team  function with id */
  const deleteTeam = async teamId => {
    try {
      const deleteResult = await dispatch(deleteTeamById({teamId})).unwrap();

      if (deleteResult?.status === true) {
        ToastAndroid.show(deleteResult?.message, ToastAndroid.LONG);
        setDeleteModalVisible(false), setTeamId('');
        dispatch(getTeamList({pageSize: pageSize, pageNo: pageNo}));
      } else {
        ToastAndroid.show(deleteResult?.message, ToastAndroid.LONG);
        setDeleteModalVisible(false), setTeamId('');
      }
    } catch (error) {
      ToastAndroid.show(error, ToastAndroid.LONG);
      setDeleteModalVisible(false), setTeamId('');
    }
  };

  /*fucntion for handling the action button */
  const handleAction = actionButton => {
    switch (actionButton.typeOfButton) {
      case 'edit':
        navigation.navigate('AddUpdateTeamScreen', {
          team_id: actionButton?.itemData?.team_id,
        });
        break;
      case 'delete':
        setDeleteModalVisible(true), setTeamId(actionButton?.itemData?.team_id);
        break;

      default:
        break;
    }
  };

  /* flatlist render ui */
  const renderItem = ({item}) => {
    return (
      <Pressable
        onPress={() =>
          navigation.navigate('TemsDeatailScreen', {
            team_id: item?.team_id,
          })
        }>
        <CustomeCard
          allData={item}
          data={[
            {
              key: 'Team Name',
              value: item?.team_name ?? '--',
            },
            {
              key: 'Manage',
              value: item?.manager_role ?? '--',
            },
            {
              key: 'Supervisor',
              value: item?.supervisor_name ?? '--',
            },
            {
              key: 'Members',
              component: (
                <FlatList
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  data={item?.members}
                  contentContainerStyle={{backgroundColor: 'transparent'}}
                  renderItem={({item, idx}) => (
                    <View
                      key={idx}
                      style={{
                        marginLeft: +idx > 0 ? -15 : 0,
                        alignSelf: 'center',
                        backgroundColor: 'transparent',
                      }}>
                      <NeuomorphAvatar gap={5}>
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
              ),
            },
          ]}
          status={[{key: 'Total Members', value: item?.total_members}]}
          editButton={true}
          deleteButton={true}
          action={handleAction}
        />
      </Pressable>
    );
  };

  /*pagination button click funtion*/
  const handlePageClick = () => {
    dispatch(getTeamList({pageSize: pageSize, pageNo: pageNo}));
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader headerTitle={label.TEAMS} />
      <SearchBar setSearchText={setSearchText} />
      <SeparatorComponent
        separatorWidth={0.2}
        separatorColor={Colors().darkShadow2}
      />

      <View style={{height: WINDOW_HEIGHT * 0.9, width: WINDOW_WIDTH}}>
        <List
          data={teamListData}
          permissions={{view: true}}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={handlePageClick}
          addAction={'AddUpdateTeamScreen'}
        />
      </View>

      {/* modal view for ACTION */}
      {deleteModalVisible && (
        <AlertModal
          visible={deleteModalVisible}
          iconName={'delete-circle-outline'}
          icontype={IconType.MaterialCommunityIcons}
          iconColor={Colors().red}
          textToShow={'ARE YOU SURE YOU WANT TO DELETE THIS!!'}
          cancelBtnPress={() => setDeleteModalVisible(!deleteModalVisible)}
          ConfirmBtnPress={() => deleteTeam(teamId)}
        />
      )}
    </SafeAreaView>
  );
};

export default TeamListScreen;

const styles = StyleSheet.create({
  cardContainer: {
    width: WINDOW_WIDTH * 0.95,
    marginBottom: 15,
    height: 'auto',
    alignSelf: 'center',
  },
  cardHeadingTxt: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 21,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  cardtext: {
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
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: 'transparent',
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
  mangerNameView: {
    margin: WINDOW_WIDTH * 0.03,
    maxWidth: '30%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: -10,
  },
});
