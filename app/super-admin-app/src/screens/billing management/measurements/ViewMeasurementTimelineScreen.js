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
import PtmItemList from './PtmItemList';
import {getMeasurementTimelineById} from '../../../redux/slices/billing management/measurement/getMeasurementTimelineDetailSlice';

const ViewMeasurementTimelineScreen = ({navigation, route}) => {
  /* declare props constant variale*/
  const id = route?.params?.id;
  const [showTable, setShowTable] = useState([]);

  const label = ScreensLabel();
  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const ListData = useSelector(state => state.getMeasurementTimelineDetail);

  const {items_data} = ListData?.data?.data[0] || [];
  const {po_number} = ListData?.data?.data[0] || '';
  const {po_limit} = ListData?.data?.data[0] || '';

  /*declare useState variable here */
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(getMeasurementTimelineById(id));
  }, [id]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      dispatch(getMeasurementTimelineById(id));

      setRefreshing(false);
    }, 2000);
  }, []);

  /*fucntion for handling the action button */
  const handleAction = actionButton => {
    const {index} = actionButton?.itemData;
    switch (actionButton.typeOfButton) {
      case 'list':
        setShowTable(prevState => {
          // Initialize the state if it's empty or the index is out of bounds
          const newState = [...prevState];
          if (newState.length <= index) {
            for (let i = newState.length; i <= index; i++) {
              newState.push(false);
            }
          }
          // Reverse the value of the given index
          newState[index] = !newState[index];
          // If remaining indices are true, make them false
          for (let i = 0; i < newState.length; i++) {
            if (i !== index && newState[i] === true) {
              newState[i] = false;
            }
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
      <View>
        <CustomeCard
          allData={{item, index, showTable}}
          avatarImage={item?.userDetails && item?.userDetails[0]?.image}
          data={[
            {
              key: 'item name',
              value: item?.item_name || '--',
              keyColor: Colors().skyBule,
            },
            {
              key: 'unit',
              value: item?.unit || '--',
            },
            {
              key: 'Total qty',
              value: item?.total_qty || '--',
              keyColor: Colors().pending,
            },
            {
              key: 'Rate',
              value: `₹ ${item?.rate || 0}`,
              keyColor: Colors().aprroved,
            },
            {
              key: 'Total amount',
              value: `₹ ${(item?.total_qty * item?.rate).toFixed(2)}`,
              keyColor: Colors().red,
            },
          ]}
          status={[
            {
              key: 'action',
              value: 'item list ',
            },
          ]}
          listButton={true}
          action={handleAction}
        />

        {showTable[index] && <PtmItemList data={item} type={'timeline'} />}
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader headerTitle={`${label.MEASUREMENTS} ${label.TIMELINE}`} />
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
                {'Po number : '}
              </Text>
              <Text style={[styles.title, {color: 'white', fontSize: 20}]}>
                {po_number}
              </Text>
            </View>
            <View>
              <Text
                style={[
                  styles.title,
                  {color: 'white', fontSize: 22, alignSelf: 'center'},
                ]}>
                ₹ {po_limit}
              </Text>
            </View>
          </ImageBackground>

          <FlatList
            data={items_data}
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

export default ViewMeasurementTimelineScreen;

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
