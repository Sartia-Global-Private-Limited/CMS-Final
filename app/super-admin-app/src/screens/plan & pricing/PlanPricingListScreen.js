import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Colors from '../../constants/Colors';
import IconType from '../../constants/IconType';
import SearchBar from '../../component/SearchBar';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../utils/ScreenLayout';
import {Icon} from '@rneui/base';
import SeparatorComponent from '../../component/SeparatorComponent';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import AlertModal from '../../component/AlertModal';
import {apiBaseUrl} from '../../../config';
import Images from '../../constants/Images';
import NeumorphCard from '../../component/NeumorphCard';
import CustomeHeader from '../../component/CustomeHeader';
import {getAllPlanPrice} from '../../redux/slices/plan-pricing/getPlanPricingListSlice';
import {deletePlanPricingById} from '../../redux/slices/plan-pricing/addUpdatePlanPriceSlice';
import Toast from 'react-native-toast-message';
import moment from 'moment';
import List from '../../component/List/List';

const PlanPricingListScreen = ({navigation, route}) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const listData = useSelector(state => state.getPlanPricingList);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [planPricingId, setPlanPricingId] = useState('');
  const [searchText, setSearchText] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(getAllPlanPrice({pageSize: pageSize, pageNo: pageNo}));
  }, [isFocused]);

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
        dispatch(getAllPlanPrice({pageSize: pageSize, pageNo: pageNo}));
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
  const renderItem = ({item}) => {
    return (
      <View>
        <TouchableOpacity style={styles.cardContainer}>
          <NeumorphCard
            darkShadowColor={Colors().darkShadow} // <- set this
            lightShadowColor={Colors().lightShadow} // <- this
          >
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: 10,
              }}>
              <Text
                style={{
                  color: '#627afe',
                  backgroundColor: '#cad2ff',
                  padding: 5,
                  borderRadius: 5,
                  textTransform: 'uppercase',
                }}>
                {moment(item?.updated_at).format('DD/MM/YYYY')}
              </Text>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  padding: 10,
                  gap: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  style={{width: 30, height: 30, borderRadius: 5}}
                  resizeMode="contain"
                  source={{
                    uri: item?.image
                      ? `${apiBaseUrl}${item?.image}`
                      : `${
                          Image.resolveAssetSource(Images.DEFAULT_PROFILE).uri
                        }`,
                  }}
                />
                <Text
                  style={{
                    fontSize: 20,
                    color: Colors().pureBlack,
                    textTransform: 'uppercase',
                  }}>
                  {item?.name}
                </Text>
              </View>
              <Text style={{color: Colors().gray, textTransform: 'uppercase'}}>
                {item?.description}
              </Text>
              {item?.modules && (
                <View style={{flexDirection: 'column', paddingVertical: 15}}>
                  {item?.modules.map((itm, index) => (
                    <View
                      style={{
                        width: WINDOW_WIDTH * 0.9,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        numberOfLines={2}
                        style={[
                          styles.cardtext,
                          {marginLeft: 5, textTransform: 'uppercase'},
                        ]}>
                        {index + 1}. {itm?.module_name}
                      </Text>
                      <Icon
                        name={'check'}
                        type={IconType.Entypo}
                        color={Colors().aprroved}
                        style={[styles.actionIcon, {padding: 2}]}
                      />
                    </View>
                  ))}
                </View>
              )}
              {/* <Text style={{color: Colors().gray}}>{item?.price}</Text> */}
              {item?.price && (
                <View style={{alignSelf: 'center', flexDirection: 'row'}}>
                  <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={[
                      styles.cardtext,
                      {color: '#009297', fontSize: 50, lineHeight: 50},
                    ]}>
                    {`₹ ${item?.price}`}
                  </Text>
                  <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={[
                      styles.cardtext,
                      {
                        color: Colors().pureBlack,
                        fontSize: 18,
                        textAlign: 'justify',
                        textTransform: 'uppercase',
                        lineHeight: 50,
                      },
                    ]}>
                    {` / ${item?.duration || '--'}`}
                  </Text>
                </View>
              )}
            </View>
            <View
              style={[styles.actionView2, {alignItems: 'center', margin: 10}]}>
              <NeumorphCard
                lightShadowColor={Colors().darkShadow2}
                darkShadowColor={Colors().lightShadow}>
                <Icon
                  size={16}
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
                  size={16}
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
          </NeumorphCard>
        </TouchableOpacity>
      </View>
    );
  };

  /*pagination button click funtion*/
  const handlePageClick = () => {
    dispatch(getAllPlanPrice({pageSize: pageSize, pageNo: pageNo}));
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader headerTitle={'Plan & Pricing'} />
      <SearchBar setSearchText={setSearchText} />
      <SeparatorComponent
        separatorWidth={0.2}
        separatorColor={Colors().darkShadow2}
      />

      <View style={{height: WINDOW_HEIGHT * 0.9, width: WINDOW_WIDTH}}>
        <List
          data={listData}
          permissions={{view: true}}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={handlePageClick}
          addAction={'AddUpdatePlainPricingScreen'}
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
          ConfirmBtnPress={() => deletePlanPricing(planPricingId)}
        />
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
  cardtext: {
    color: Colors().pureBlack,
    fontSize: 12,
    fontWeight: '300',
    lineHeight: 21,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    flexShrink: 1,
  },
  actionIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  actionView2: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    columnGap: 10,
  },
});
