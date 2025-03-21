import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import React, { useEffect } from 'react';
import Colors from '../../../constants/Colors';
import CustomeHeader from '../../../component/CustomeHeader';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../utils/ScreenLayout';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../../component/Loader';
import InternalServer from '../../../component/InternalServer';
import DataNotFound from '../../../component/DataNotFound';
import NeumorphCard from '../../../component/NeumorphCard';
import { getRetirementDetailById } from '../../../redux/slices/hr-management/retirement/getRetirementDetailSlice';
import SeparatorComponent from '../../../component/SeparatorComponent';
import moment from 'moment';

const RetirementDetailScreen = ({ navigation, route }) => {
  const retirement_id = route?.params?.retirement_id;
  /* declare props constant variale*/

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const getData = useSelector(state => state.getRetirementDetail);
  const allData = getData?.data?.data;

  /*declare useState variable here */

  useEffect(() => {
    dispatch(getRetirementDetailById(retirement_id));
  }, [retirement_id]);

  /*function for giveing color of status*/
  function getStatusColor(action) {
    switch (action) {
      case '0':
        return Colors().red;
      case '1':
        return Colors().aprroved;

      default:
        return Colors().black2;
    }
  }
  /*function for giveing text of status*/
  function getStatusText(action) {
    switch (action) {
      case '0':
        return 'Inactive';
      case '1':
        return 'active';

      default:
        return '';
    }
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <CustomeHeader headerTitle={`Retirement detail`} />

      {getData?.isLoading ? (
        <Loader />
      ) : !getData?.isLoading && !getData?.isError && getData?.data?.status ? (
        <>
          <ScrollView>
            <View style={styles.mainView}>
              {/* card for stock request  detail */}
              <NeumorphCard>
                <View style={styles.cardContainer}>
                  <Text style={styles.headingTxt}>user retirement detail</Text>
                  <SeparatorComponent
                    separatorColor={Colors().gray2}
                    separatorHeight={0.5}
                  />

                  {/* view for request user */}
                  <View
                    style={{
                      flexDirection: 'row',
                      columnGap: 10,
                    }}>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.cardHeadingTxt}>user name : </Text>
                        <Text
                          numberOfLines={2}
                          ellipsizeMode="tail"
                          style={styles.cardtext}>
                          {allData?.name}
                        </Text>
                      </View>

                      <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.cardHeadingTxt}>
                          RETIREMENT DATE :
                        </Text>
                        <Text
                          numberOfLines={2}
                          ellipsizeMode="tail"
                          style={styles.cardtext}>
                          {moment(allData?.retirement_date).format(
                            'DD-MM-YYYY',
                          )}
                        </Text>
                      </View>

                      <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.cardHeadingTxt}>
                          ASSET RECOVERY :
                        </Text>
                        <Text
                          numberOfLines={2}
                          ellipsizeMode="tail"
                          style={styles.cardtext}>
                          {allData?.asset_recovery}
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.cardHeadingTxt}>
                          PENSION AMOUNT:
                        </Text>
                        <Text
                          numberOfLines={2}
                          ellipsizeMode="tail"
                          style={styles.cardtext}>
                          {allData?.pension_amount}
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.cardHeadingTxt}>
                          PENSION DURATION :
                        </Text>
                        <Text
                          numberOfLines={2}
                          ellipsizeMode="tail"
                          style={styles.cardtext}>
                          {allData?.pension_duration}
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.cardHeadingTxt}>
                          ALLOW COMMUTATION :
                        </Text>
                        <Text
                          numberOfLines={2}
                          ellipsizeMode="tail"
                          style={styles.cardtext}>
                          {allData?.allow_commutation === '0' ? 'yes' : 'no'}
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.cardHeadingTxt}>
                          COMMUTE PERCENTAGE :
                        </Text>
                        <Text
                          numberOfLines={2}
                          ellipsizeMode="tail"
                          style={styles.cardtext}>
                          {allData?.commute_percentage}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.twoItemView}>
                    <View style={styles.leftView}>
                      <Text style={styles.cardHeadingTxt}>
                        retirement gratuity:{' '}
                      </Text>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={styles.cardtext}>
                        {allData?.retirement_gratuity}
                      </Text>
                    </View>
                    <View style={styles.rightView}>
                      <Text style={styles.cardHeadingTxt}>
                        SERVICE GRATUITY:{' '}
                      </Text>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={[styles.cardtext, { textAlign: 'center' }]}>
                        {allData?.service_gratuity}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.actionView}>
                    <View
                      style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={styles.cardHeadingTxt}>
                        pension status :{' '}
                      </Text>
                      <NeumorphCard>
                        <View style={{ padding: 5 }}>
                          <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={[
                              styles.cardtext,
                              {
                                color: getStatusColor(allData?.pension_status),
                                fontWeight: '600',
                              },
                            ]}>
                            {getStatusText(allData?.pension_status)}
                          </Text>
                        </View>
                      </NeumorphCard>
                    </View>
                  </View>
                </View>
              </NeumorphCard>
            </View>
          </ScrollView>
        </>
      ) : getData?.isError ? (
        <InternalServer />
      ) : !getData?.data?.status &&
        getData?.data?.message == 'Data not found' ? (
        <>
          <DataNotFound />
        </>
      ) : (
        <InternalServer />
      )}
    </SafeAreaView>
  );
};

export default RetirementDetailScreen;

const styles = StyleSheet.create({
  cardContainer: {
    width: WINDOW_WIDTH * 0.95,
    marginBottom: 15,
    height: 'auto',
    alignSelf: 'center',
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
  },

  actionView: {
    margin: WINDOW_WIDTH * 0.03,

    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  actionView2: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    columnGap: 10,
  },
  mainView: {
    padding: 15,
    rowGap: 15,
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
    flexShrink: 1,
    marginLeft: 2,
  },
  actionView: {
    flexDirection: 'row',
    // justifyContent: 'flex-end',
    columnGap: 10,
  },

  rightView: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
  },
  leftView: {
    flexDirection: 'row',
    flex: 1,
  },
  twoItemView: {
    flexDirection: 'row',
    columnGap: 5,
  },
});
