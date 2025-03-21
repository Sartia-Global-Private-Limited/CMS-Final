/*    ----------------Created Date :: 23- April -2024   ----------------- */
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Colors from '../../../constants/Colors';
import IconType from '../../../constants/IconType';
import {useDispatch, useSelector} from 'react-redux';
import Loader from '../../../component/Loader';
import InternalServer from '../../../component/InternalServer';
import DataNotFound from '../../../component/DataNotFound';
import CustomeHeader from '../../../component/CustomeHeader';
import {Menu, MenuItem} from 'react-native-material-menu';
import ScreensLabel from '../../../constants/ScreensLabel';
import CustomeCard from '../../../component/CustomeCard';
import {
  getApproveStockPunchDetailById,
  getStockPunchDetailById,
} from '../../../redux/slices/stock-punch-management/stock-punch/getStockPunchDetailSlice';

const SPDetailScreen = ({navigation, route}) => {
  /* declare props constant variale*/
  const complaintId = route?.params?.complaintId;
  const userId = route?.params?.userId;
  const type = route?.params?.type;
  const label = ScreensLabel();
  /*declare hooks variable here */
  const dispatch = useDispatch();
  const ListData = useSelector(state => state.getStockPunchDetail);
  const data = ListData?.data?.data;

  /*declare useState variable here */
  const [visible2, setVisible2] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (type == 'pending') {
      dispatch(getStockPunchDetailById({complaintId, userId}));
    }
    if (type == 'checkAndApprove') {
      dispatch(getApproveStockPunchDetailById({complaintId, userId}));
    }
  }, [complaintId, userId, refreshing]);

  /*pull down to refresh funciton*/
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  /*const for main filter*/
  const mainFilterArray = ['Hitory'];
  /*constant of month*/

  /* function for hiding the main filter*/
  const hideMenu2 = val => {
    setVisible2(false);
    if (val !== undefined) {
      navigation.navigate('SPItemHisory', {
        complaintId: complaintId,
        userId: userId,
        type: type,
      });
    }
  };

  /*for hiding the main filter*/
  const showMenu2 = () => setVisible2(true);

  const handleAction = actionButton => {
    switch (actionButton) {
      case 'approve':
        navigation.navigate('');
        break;

      default:
        break;
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader
        headerTitle={`${label.STOCK_PUNCH} ${label.DETAIL}`}
        lefIconName={'chevron-back'}
        lefIconType={IconType.Ionicons}
        rightIconName={'dots-three-vertical'}
        rightIcontype={IconType.Entypo}
        rightIconPress={showMenu2}
      />
      <View style={{alignSelf: 'flex-end'}}>
        <Menu visible={visible2} onRequestClose={hideMenu2}>
          {mainFilterArray.map(itm => (
            <MenuItem
              style={{backgroundColor: Colors().inputLightShadow}}
              textStyle={
                [styles.cardtext, {color: Colors().pureBlack}] // Otherwise, use the default text style
              }
              onPress={() => {
                hideMenu2(itm);
              }}>
              {itm}
            </MenuItem>
          ))}
        </Menu>
      </View>

      {ListData?.isLoading ? (
        <Loader />
      ) : !ListData?.isLoading &&
        !ListData?.isError &&
        ListData?.data?.status ? (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          {/*card for request and approve field*/}
          <CustomeCard
            headerName={type == 'pending' ? 'request field' : 'Approve field'}
            avatarImage={data[0]?.user_image}
            data={[
              {
                key: 'User name ',
                value: data[0]?.user_name,
                // component: <Text>hdkfhskdfj</Text>,
              },
              {
                key: 'complaint id',
                value: data[0]?.complaint_unique_id,
                keyColor: Colors().purple,
              },
            ]}
            status={[
              {
                key: 'punch at',
                value: data[0]?.punch_at,
                color: Colors().pending,
              },
            ]}
            action={handleAction}
          />
          {/*card for company details*/}
          <CustomeCard
            headerName={'company details'}
            data={[
              {
                key: 'Company name ',
                value: data[0]?.complainsDetails?.companyDetails?.company_name,
              },
              {
                key: 'regional office',
                value:
                  data[0]?.complainsDetails?.companyDetails
                    ?.selectedRegionalOffices[0]?.regional_office_name,
              },
              {
                key: 'sales area',
                value:
                  data[0]?.complainsDetails?.companyDetails
                    ?.selectedSaleAreas[0]?.sales_area_name,
              },
              {
                key: 'district',
                value:
                  data[0]?.complainsDetails?.companyDetails
                    ?.selectedDistricts[0]?.district_name,
              },
            ]}
          />
          {/*card for complaint details*/}
          <CustomeCard
            headerName={'complaint details'}
            avatarImage={
              data[0]?.complainsDetails?.complaintRaiserDetails?.image
            }
            data={[
              {
                key: 'Raise by ',
                value: data[0]?.complainsDetails?.complaintRaiserDetails?.name,
              },
              {
                key: 'Complaint type',
                value: data[0]?.complainsDetails?.complaint_type,
              },
              {
                key: 'Complaint type',
                value: data[0]?.complainsDetails?.complaint_unique_id,
                keyColor: Colors().purple,
              },
            ]}
          />
        </ScrollView>
      ) : ListData?.isError ? (
        <InternalServer />
      ) : !ListData?.data?.status &&
        ListData?.data?.message == 'Data not found' ? (
        <>
          <DataNotFound />
        </>
      ) : (
        <InternalServer></InternalServer>
      )}
    </SafeAreaView>
  );
};

export default SPDetailScreen;

const styles = StyleSheet.create({
  cardtext: {
    fontSize: 12,
    fontWeight: '300',
    lineHeight: 21,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    flexShrink: 1,
  },
});
