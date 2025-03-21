import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Alert,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, { useEffect } from 'react';
import Colors from '../../constants/Colors';
import IconType from '../../constants/IconType';
import CustomeHeader from '../../component/CustomeHeader';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../utils/ScreenLayout';
import FloatingAddButton from '../../component/FloatingAddButton';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../component/Loader';
import InternalServer from '../../component/InternalServer';
import DataNotFound from '../../component/DataNotFound';
import NeumorphCard from '../../component/NeumorphCard';

import SeparatorComponent from '../../component/SeparatorComponent';
import { DataTable } from 'react-native-paper';
import { getEnergyContactDetailById } from '../../redux/slices/contacts/energy-contact/getEnergyContactDetailSlice';
import { getTaskDashData } from '../../redux/slices/task-mangement/getTaskDashboardDataSlice';
import NeumorphLinearGradientCard from '../../component/NeumorphLinearGradientCard';

const TaskDashBoardScreen = ({ navigation, route }) => {
  const edit_id = route?.params?.id;
  /* declare props constant variale*/

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const listData = useSelector(state => state.getTaskDashboardData);
  const data = listData?.data?.data;

  // Variable to keep track of the index of the last returned color
  var currentIndex = 0;
  // Array to store extracted keys

  useEffect(() => {
    dispatch(getTaskDashData());
  }, [isFocused]);

  // Array of fixed colors
  var colors = [
    Colors().skyGradient,
    Colors().redGradient,
    Colors().orangeGradient,
    Colors().purpleGradient,
  ];

  // Function to return a different color each time
  function getNextColor() {
    // Get the color at the current index
    var color = colors[currentIndex];

    // Increment the index, and loop back to the beginning if it exceeds the array length
    currentIndex = (currentIndex + 1) % Colors().length;

    return color;
  }

  function getFirstAndSecondValues(object, logFirst = true, logSecond = true) {
    // Get the array of key-value pairs
    const entries = Object.entries(object);

    // Initialize variables to store the values
    let firstValue, secondValue;

    // Access the first key-value pair if logFirst is true
    if (logFirst && entries.length > 0) {
      const [firstEntry] = entries;
      [, firstValue] = firstEntry;
      return [firstValue];
    }

    // Access the second key-value pair if logSecond is true
    if (logSecond && entries.length > 1) {
      const [, secondEntry] = entries;
      [, secondValue] = secondEntry;
      return [secondValue];
    }
  }

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.mainView}>
        <NeumorphLinearGradientCard
          itemData={getFirstAndSecondValues(item, false, true)}
          value={getFirstAndSecondValues(item, true, false)}
          gradientArray={getNextColor()}
        />
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <CustomeHeader headerTitle={`Task Dashboard`} />

      {listData?.isLoading ? (
        <Loader />
      ) : !listData?.isLoading &&
        !listData?.isError &&
        listData?.data?.status ? (
        <>
          <FlatList
            data={listData?.data?.data}
            renderItem={renderItem}
            numColumns={2}
            contentContainerStyle={{ paddingBottom: 50 }}
            // ListEmptyComponent={renderEmptyComponent}
          />
        </>
      ) : listData?.isError ? (
        <InternalServer />
      ) : !listData?.data?.status &&
        listData?.data?.message == 'Data not  found' ? (
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

export default TaskDashBoardScreen;

const styles = StyleSheet.create({
  mainView: {
    padding: WINDOW_HEIGHT * 0.017,
  },
  cardContainer: {
    margin: WINDOW_WIDTH * 0.03,
    flex: 1,
    rowGap: WINDOW_HEIGHT * 0.01,
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
    flexDirection: 'row',
    // justifyContent: 'flex-end',
    columnGap: 10,
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
