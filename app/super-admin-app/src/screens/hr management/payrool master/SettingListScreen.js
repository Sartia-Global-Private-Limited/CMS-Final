import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Colors from '../../../constants/Colors';
import IconType from '../../../constants/IconType';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../utils/ScreenLayout';
import { Icon } from '@rneui/base';
import FloatingAddButton from '../../../component/FloatingAddButton';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../../component/Loader';
import InternalServer from '../../../component/InternalServer';
import DataNotFound from '../../../component/DataNotFound';
import NeumorphCard from '../../../component/NeumorphCard';
import AlertModal from '../../../component/AlertModal';
import { getSettingList } from '../../../redux/slices/hr-management/payroll-master/getSettingListSlice';
import { Switch } from '@rneui/themed';
import { updateSettingStatus } from '../../../redux/slices/hr-management/payroll-master/addUpdateSettingSlice';
import Toast from 'react-native-toast-message';

const SettingListScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [refreshing, setRefreshing] = useState(false);
  const getSettingListData = useSelector(state => state.getSettingList);
  const [settingId, setSettingId] = useState('');
  const [alertModalVisible, setAlertModalVisible] = useState(false);

  useEffect(() => {
    dispatch(getSettingList());
  }, [isFocused]);

  /* function for pull down to refresh */
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      dispatch(getSettingList());

      setRefreshing(false);
    }, 2000);
  }, []);

  /*  function for updating setting status  */
  const updateSettingStatusFunction = async () => {
    const reqbody = {
      id: settingId,
    };

    try {
      const updateResult = await dispatch(
        updateSettingStatus(reqbody),
      ).unwrap();

      if (updateResult?.status === true) {
        Toast.show({
          type: 'success',
          text1: updateResult?.message,
          position: 'bottom',
        });

        setAlertModalVisible(false), setSettingId('');
        dispatch(getSettingList());
      } else {
        Toast.show({
          type: 'error',
          text1: updateResult?.message,
          position: 'bottom',
        });
        setAlertModalVisible(false), setSettingId('');
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });
      setAlertModalVisible(false), setSettingId('');
    }
  };

  /* flatlist render ui  for table view*/
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
                flex: 1,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  columnGap: 10,
                }}>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  {item?.label && (
                    <View style={{ flexDirection: 'row' }}>
                      <Text
                        ellipsizeMode="tail"
                        style={[
                          styles.cardtext,
                          { color: Colors().pureBlack },
                        ]}>
                        {item?.label}
                      </Text>
                    </View>
                  )}
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
                  Change :{' '}
                </Text>
                <NeumorphCard>
                  <View style={{ padding: 5 }}>
                    <Switch
                      trackColor={{ false: '#767577', true: '#81b0ff' }}
                      thumbColor={
                        item?.active_setting === '1' ? '#f5dd4b' : '#f4f3f4'
                      }
                      ios_backgroundColor="#3e3e3e"
                      onValueChange={() => {
                        setAlertModalVisible(true);
                        setSettingId(item?.id);
                      }}
                      value={item?.active_setting === '1' ? true : false}
                    />
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
                      navigation.navigate('CreateUpdateSettingScreen', {
                        editData: item,
                      })
                    }
                  />
                </NeumorphCard>
              </View>
            </View>
          </NeumorphCard>
        </TouchableOpacity>
      </View>
    );
  };

  const renderEmptyComponent = () => (
    // Render your empty component here<>
    <View
      style={{
        height: WINDOW_HEIGHT * 0.6,
      }}>
      {/* <Text>dskfjdksljflkdsj</Text> */}
      <DataNotFound />
    </View>
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      {getSettingListData?.isLoading ? (
        <Loader />
      ) : !getSettingListData?.isLoading &&
        !getSettingListData?.isError &&
        getSettingListData?.data?.status ? (
        <>
          <FlatList
            data={getSettingListData?.data?.data}
            renderItem={renderItem}
            keyExtractor={(_, index) => {
              return index.toString();
            }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 50 }}
            ListEmptyComponent={renderEmptyComponent}
          />

          {alertModalVisible && (
            <AlertModal
              visible={alertModalVisible}
              iconName={'circle-edit-outline'}
              icontype={IconType.MaterialCommunityIcons}
              iconColor={Colors().aprroved}
              textToShow={`ARE YOU SURE YOU WANT sure make it default setting`}
              cancelBtnPress={() => setAlertModalVisible(!alertModalVisible)}
              ConfirmBtnPress={() => updateSettingStatusFunction()}
            />
          )}

          {/* View for floating button */}
          <View
            style={{
              marginTop: WINDOW_HEIGHT * 0.65,
              marginLeft: WINDOW_WIDTH * 0.8,
              position: 'absolute',
            }}>
            <FloatingAddButton
              backgroundColor={Colors().purple}
              onPress={() => {
                navigation.navigate('CreateUpdateSettingScreen');
              }}></FloatingAddButton>
          </View>
        </>
      ) : getSettingListData?.isError ? (
        <InternalServer />
      ) : !getSettingListData?.data?.status &&
        getSettingListData?.data?.message === 'Data not found' ? (
        <>
          <DataNotFound />
          {/* View for floating button */}
          <View
            style={{
              marginTop: WINDOW_HEIGHT * 0.65,
              marginLeft: WINDOW_WIDTH * 0.8,
              position: 'absolute',
            }}>
            <FloatingAddButton
              backgroundColor={Colors().purple}
              onPress={() => {
                navigation.navigate('CreateUpdateSettingScreen');
              }}></FloatingAddButton>
          </View>
        </>
      ) : (
        <>
          <InternalServer></InternalServer>
        </>
      )}
    </SafeAreaView>
  );
};

export default SettingListScreen;

const styles = StyleSheet.create({
  cardContainer: {
    width: WINDOW_WIDTH * 0.95,
    marginBottom: 15,
    height: 'auto',
    alignSelf: 'center',
  },
  cardHeadingTxt: {
    fontSize: 12,
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
