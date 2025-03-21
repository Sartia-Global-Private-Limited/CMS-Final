import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  RefreshControl,
  ImageBackground,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Colors from '../../../constants/Colors';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import Loader from '../../../component/Loader';
import InternalServer from '../../../component/InternalServer';
import DataNotFound from '../../../component/DataNotFound';
import CustomeCard from '../../../component/CustomeCard';
import CustomeHeader from '../../../component/CustomeHeader';
import ScreensLabel from '../../../constants/ScreensLabel';
import Images from '../../../constants/Images';
import PtmItemList from '../measurements/PtmItemList';
import {getInvoiceDetailById} from '../../../redux/slices/billing management/inovice/getInvoiceDetailSlice';

const InvoiceDetailItemListScreen = ({navigation, route}) => {
  /* declare props constant variale*/
  const pi_Id = route?.params?.pi_Id;
  const piNo = route?.params?.piNo;

  const [showTable, setShowTable] = useState([]);

  const label = ScreensLabel();
  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const ListData = useSelector(state => state.getInvoiceDetail);

  const {getMeasurements} = ListData?.data?.data?.[0] || [];

  const filterData = getMeasurements.filter(itm => itm.bill_no === piNo);
  const flatlistData = filterData[0]?.getMeasurements;

  /*declare useState variable here */
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(getInvoiceDetailById(pi_Id));
  }, [pi_Id]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      dispatch(getInvoiceDetailById(pi_Id));

      setRefreshing(false);
    }, 2000);
  }, []);

  /*fucntion for handling the action button */
  const handleAction = actionButton => {
    const {index, idx} = actionButton?.itemData;
    switch (actionButton.typeOfButton) {
      case 'list':
        setShowTable(prevState => {
          const newState = {...prevState};
          // Reset all inner arrays to be false
          Object.keys(newState).forEach(key => {
            newState[key] = new Array(
              actionButton?.itemData[key]?.items_data.length,
            ).fill(false);
          });
          // Toggle the specific item
          if (newState[index]) {
            newState[index][idx] = !prevState[index][idx];
          } else {
            newState[index] = new Array(
              actionButton?.itemData[idx]?.items_data.length,
            ).fill(false);
            newState[index][idx] = true;
          }
          return newState;
        });

        break;

      default:
        break;
    }
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
  const renderItem = ({item, index}) => {
    return (
      <View key={index}>
        <Text
          style={[
            styles.title,
            {
              alignSelf: 'center',
              color: Colors().skyBule,
              marginVertical: WINDOW_HEIGHT * 0.01,
            },
          ]}>
          {item?.complaintDetails?.complaint_unique_id}
        </Text>

        {item?.items_data?.map((itm, idx) => {
          return (
            <View key={idx}>
              <CustomeCard
                allData={{item, index, idx, showTable}}
                data={[
                  {
                    key: 'item name',
                    value: itm?.item_name || '--',
                    keyColor: Colors().skyBule,
                  },
                  {
                    key: 'unit',
                    value: itm?.unit || '--',
                  },
                  {
                    key: 'Total qty',
                    value: itm?.total_qty || '--',
                    keyColor: Colors().pending,
                  },
                  {
                    key: 'Rate',
                    value: `₹ ${itm?.rate || 0}`,
                    keyColor: Colors().aprroved,
                  },
                  {
                    key: 'Total amount',
                    value: `₹ ${(itm?.total_qty * itm?.rate).toFixed(2)}`,
                    keyColor: Colors().red,
                  },
                ]}
                status={[
                  {
                    key: 'orderline no',
                    value: itm?.order_line_number,
                    color: Colors().pending,
                  },
                ]}
                listButton={true}
                action={handleAction}
              />
              {showTable[index] && showTable[index][idx] && (
                <PtmItemList data={itm} />
              )}
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader headerTitle={label.INVOICE_ITEM_LIST} />
      {ListData?.isLoading ? (
        <Loader />
      ) : !ListData?.isLoading &&
        !ListData?.isError &&
        ListData?.data?.status ? (
        <ScrollView>
          <ImageBackground
            source={Images.BANK_CARD}
            imageStyle={{borderRadius: WINDOW_WIDTH * 0.03}}
            style={styles.bankCard}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={[styles.title, {color: 'white', fontSize: 20}]}>
                {'PI number : '}
              </Text>
              <Text style={[styles.title, {color: 'white', fontSize: 20}]}>
                {piNo}
              </Text>
            </View>
          </ImageBackground>

          <FlatList
            data={flatlistData}
            renderItem={renderItem}
            contentContainerStyle={{paddingBottom: 0}}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={renderEmptyComponent}
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

export default InvoiceDetailItemListScreen;

const styles = StyleSheet.create({
  bankCard: {
    margin: WINDOW_WIDTH * 0.03,
    padding: WINDOW_WIDTH * 0.03,
    rowGap: 10,
  },
  title: {
    fontSize: 15,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    flexShrink: 1,
  },
});
