import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import DashBoardCard from '../../component/DashBoardCard';
import SeparatorComponent from '../../component/SeparatorComponent';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../utils/ScreenLayout';
import Images from '../../constants/Images';
import Colors from '../../constants/Colors';
import {
  selectUser,
  setActiveTab,
  setAllMenus,
} from '../../redux/slices/authSlice';
import {useSelector, useDispatch} from 'react-redux';
import {apiBaseUrl} from '../../../config';
import Loader from '../../component/Loader';
import InternalServer from '../../component/InternalServer';
import NeuomorphAvatar from '../../component/NeuomorphAvatar';
import {Avatar, Icon} from '@rneui/themed';
import IconType from '../../constants/IconType';
import Button from '../../component/Button';
import Toast from 'react-native-toast-message';
import {updateAttendanceStatus} from '../../redux/slices/hr-management/attendance/addUpdateAttendanceSlice';
import {useGetSidebarMenuQuery} from '../../services/generalApi';
import NeumorphCard from '../../component/NeumorphCard';

const Home = ({navigation}) => {
  const {data, isLoading, isError} = useGetSidebarMenuQuery();
  const [clockStatus, setClockStatus] = useState(false);
  const {user} = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setAllMenus(data));
  }, [data]);

  const navigationToSubmoduleSCreen = item => {
    navigation.navigate('SubModuleScreen', {
      title: item?.title,
      submodulesData: item?.submodules,
    });
  };

  const navigatingToNormalScreen = item => {
    const path = item?.path;
    dispatch(setActiveTab(path));
    switch (path) {
      case '/PlanPricing':
        navigation.navigate('PlanPricingListScreen');
        break;
      case '/dashboard':
        navigation.navigate('Dashboard');
        break;
      case '/MyProfile':
        navigation.navigate('ProfileScreen');
        break;
      case '/AllNotifications':
        navigation.navigate('NotificationsListScreen');
        break;
      case '/all-messages':
        navigation.navigate('Chats');
        break;
      case '/AllRoles':
        navigation.navigate('AllRolesScreen');
        break;
      case '/ContractorsMasterdata':
        navigation.navigate('AllContractorList');
        break;
      case '/FeedbackSuggestion':
        navigation.navigate('FeedbackSuggestionListScreen');
        break;
      default:
        break;
    }
  };

  const updateAttendance = async () => {
    const reqbody = {
      id: user?.id,
      type: clockStatus ? 'clockout' : 'clockin',
    };

    try {
      const result = await dispatch(updateAttendanceStatus(reqbody)).unwrap();
      if (result?.status) {
        setClockStatus(prev => !prev);
        Toast.show({
          type: 'success',
          text1: result?.message,
          position: 'bottom',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: result?.message,
          position: 'bottom',
        });
      }
    } catch (error) {
      console.log('error', error);
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });
    }
  };

  const cardRender = ({item}) => {
    return (
      <TouchableOpacity
        disabled={item?.status === 0}
        onPress={() =>
          item?.submodules?.length > 0
            ? navigationToSubmoduleSCreen(item)
            : navigatingToNormalScreen(item)
        }>
        <DashBoardCard
          itemName={item?.title}
          itemUri={item?.icon}
          status={item.status}
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{backgroundColor: Colors().screenBackground, flex: 1}}>
      <View style={styles.headerView}>
        <View style={styles.imageLeftView}>
          <Image
            source={{
              uri:
                user?.company_logo != ''
                  ? `${apiBaseUrl}${user?.company_logo}`
                  : `${Image.resolveAssetSource(Images.DEFAULT_PROFILE).uri}`,
            }}
            resizeMode="contain"
            style={{
              width: WINDOW_WIDTH * 0.4,
              height: WINDOW_WIDTH * 0.15,
              borderRadius: 5,
            }}
          />
          <SeparatorComponent
            separatorHeight={WINDOW_HEIGHT * 0.05}
            separatorColor={Colors().screenBackground}
          />
          <Text numberOfLines={1} style={styles.hellowTxt}>
            Hello,
          </Text>
          <SeparatorComponent separatorColor={Colors().screenBackground} />
          <Text numberOfLines={2} style={styles.useNameTxt}>
            {user?.name}
          </Text>
          <View style={{width: 103, margin: 10}}>
            <NeumorphCard
              style={{
                margin: 7,
                shadowRadius: 5,
                shadowOpacity: 0.8,
                borderRadius: 5,
              }}
              darkShadowColor={Colors().darkShadow}
              lightShadowColor={Colors().lightShadow}>
              <Button
                btnStyle={{
                  backgroundColor: clockStatus
                    ? Colors().rejected
                    : Colors().aprroved,
                  padding: 6,
                  borderRadius: 6,
                }}
                textstyle={{
                  textTransform: 'uppercase',
                  fontWeight: '700',
                  fontSize: 12,
                  color: Colors().screenBackground,
                  fontFamily: Colors().fontFamilyBookMan,
                }}
                title={clockStatus ? 'Clock Out' : 'Clock In'}
                onPress={() => {
                  updateAttendance();
                }}
              />
            </NeumorphCard>
          </View>
        </View>
        <View style={styles.imageRightView}>
          <View
            style={{
              paddingVertical: 10,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 5,
            }}>
            <NeumorphCard
              inner={true}
              darkShadowColor={Colors().darkShadow}
              lightShadowColor={Colors().lightShadow}>
              <Icon
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 5,
                }}
                name="bell"
                type={IconType.FontAwesome}
                size={18}
                color={Colors().resolved}
                onPress={() => {
                  navigation.navigate('NotificationsListScreen');
                }}
              />
            </NeumorphCard>
            <NeumorphCard
              inner={true}
              darkShadowColor={Colors().darkShadow}
              lightShadowColor={Colors().lightShadow}>
              <Icon
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 5,
                }}
                onPress={() => {
                  navigation.navigate('Chats');
                }}
                name="message-text"
                type={IconType.MaterialCommunityIcons}
                size={18}
                color={Colors().orange}
              />
            </NeumorphCard>
          </View>
          <View>
            <NeuomorphAvatar>
              <Avatar
                size={60}
                rounded
                source={{
                  uri:
                    user?.image != ''
                      ? `${apiBaseUrl}/${user?.image}`
                      : `${
                          Image.resolveAssetSource(Images.DEFAULT_PROFILE).uri
                        }`,
                }}
                onPress={() => navigation.navigate('ProfileScreen')}
              />
            </NeuomorphAvatar>
          </View>
        </View>
      </View>
      <SeparatorComponent
        separatorColor={Colors().gray2}
        separatorHeight={0.2}></SeparatorComponent>
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        {isLoading ? (
          <View style={{width: WINDOW_WIDTH, height: WINDOW_HEIGHT * 0.5}}>
            <Loader />
          </View>
        ) : data?.length > 0 ? (
          <View style={{padding: 10}}>
            <FlatList
              data={data}
              showsVerticalScrollIndicator={false}
              renderItem={cardRender}
              keyExtractor={item => item.id}
              contentContainerStyle={{
                paddingLeft: 3,
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                paddingBottom: 300,
              }}
            />
          </View>
        ) : isError ? (
          <InternalServer />
        ) : data?.status && data?.length < 0 ? (
          <View style={{width: WINDOW_WIDTH, height: WINDOW_HEIGHT * 0.5}}>
            <DataNotFound />
          </View>
        ) : (
          <Text>{data?.message || ''}</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  hellowTxt: {
    color: Colors().hellowTxt,
    fontWeight: '500',
    fontSize: 13,
    marginLeft: WINDOW_WIDTH * 0.02,
    fontFamily: Colors().fontFamilyBookMan,
    textTransform: 'uppercase',
  },
  useNameTxt: {
    fontWeight: '500',
    fontSize: 13,
    marginLeft: WINDOW_WIDTH * 0.02,
    textTransform: 'uppercase',
    color: Colors().purple,
    fontFamily: Colors().fontFamilyBookMan,
  },
  imageRightView: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headerView: {
    height: 'auto',
    margin: WINDOW_WIDTH * 0.025,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageLeftView: {
    height: 'auto',
  },
});
