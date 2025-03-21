/*    ----------------Created Date :: 8- Feb -2024   ----------------- */
import {StyleSheet, Text, View, SafeAreaView, ScrollView} from 'react-native';
import React, {useEffect} from 'react';
import Colors from '../../../constants/Colors';
import CustomeHeader from '../../../component/CustomeHeader';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import {useDispatch, useSelector} from 'react-redux';
import Loader from '../../../component/Loader';
import InternalServer from '../../../component/InternalServer';
import DataNotFound from '../../../component/DataNotFound';
import NeumorphCard from '../../../component/NeumorphCard';
import SeparatorComponent from '../../../component/SeparatorComponent';
import moment from 'moment';
import {getLogsDetailById} from '../../../redux/slices/hr-management/logs/getLogDetailSlice';
import NeuomorphAvatar from '../../../component/NeuomorphAvatar';
import {Avatar} from '@rneui/themed';
import {apiBaseUrl} from '../../../../config';
import Images from '../../../constants/Images';
import {Image} from 'react-native';

const EmpLogDetailScreen = ({navigation, route}) => {
  const logId = route?.params?.logId;
  /* declare props constant variale*/

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const getData = useSelector(state => state.getLogDetail);
  const allData = getData?.data?.data;

  /*declare useState variable here */

  useEffect(() => {
    dispatch(getLogsDetailById(logId));
  }, [logId]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader headerTitle={`EMPLOYEE ACTIVITIES`} />

      {getData?.isLoading ? (
        <Loader />
      ) : !getData?.isLoading && !getData?.isError && getData?.data?.status ? (
        <>
          <ScrollView>
            <View style={styles.mainView}>
              {/* card for stock request  detail */}
              <NeumorphCard>
                <View style={styles.cardContainer}>
                  <Text style={styles.headingTxt}>user ACTIVITIES detail</Text>
                  <SeparatorComponent
                    separatorColor={Colors().gray2}
                    separatorHeight={0.5}
                  />

                  <View
                    style={{
                      flexDirection: 'row',
                      columnGap: 10,
                    }}>
                    <View>
                      <NeuomorphAvatar gap={4}>
                        <Avatar
                          size={50}
                          rounded
                          source={{
                            uri: allData?.image
                              ? `${apiBaseUrl}${allData?.image}`
                              : `${
                                  Image.resolveAssetSource(
                                    Images.DEFAULT_PROFILE,
                                  ).uri
                                }`,
                          }}
                        />
                      </NeuomorphAvatar>
                    </View>

                    <View style={{flex: 1, justifyContent: 'center'}}>
                      <View style={{flexDirection: 'row'}}>
                        <Text style={styles.cardHeadingTxt}>
                          employee name :{' '}
                        </Text>
                        <Text
                          numberOfLines={2}
                          ellipsizeMode="tail"
                          style={styles.cardtext}>
                          {allData?.user_name} ({allData?.role})
                        </Text>
                      </View>

                      <View style={{flexDirection: 'row'}}>
                        <Text style={styles.cardHeadingTxt}>USER AGENT : </Text>
                        <Text
                          numberOfLines={2}
                          ellipsizeMode="tail"
                          style={styles.cardtext}>
                          {allData?.user_agent}
                        </Text>
                      </View>

                      <View style={{flexDirection: 'row'}}>
                        <Text style={styles.cardHeadingTxt}>
                          ACTIVITY DESCRIPTION :{' '}
                        </Text>
                        <Text
                          numberOfLines={2}
                          ellipsizeMode="tail"
                          style={styles.cardtext}>
                          {allData?.action}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.twoItemView}>
                    <View style={styles.leftView}>
                      <Text style={styles.cardHeadingTxt}>IP ADDRESS : </Text>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={styles.cardtext}>
                        {allData?.ip_address}
                      </Text>
                    </View>
                    <View style={styles.rightView}>
                      <Text style={styles.cardHeadingTxt}>RESULT : </Text>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={[styles.cardtext, {textAlign: 'center'}]}>
                        {allData?.result}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.actionView}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text style={styles.cardHeadingTxt}>
                        activity time :{' '}
                      </Text>
                      <NeumorphCard>
                        <View style={{padding: 5, flexDirection: 'row'}}>
                          <Text style={{color: Colors().pending}}>
                            {moment(allData?.created_at).format('DD-MM-YYYY')}{' '}
                            ||
                          </Text>
                          <Text style={{color: Colors().aprroved}}>
                            {moment(allData?.created_at).format('dddd')} ||
                          </Text>
                          <Text style={{color: Colors().red}}>
                            {moment(allData?.created_at).format('hh:mm A')}
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

export default EmpLogDetailScreen;

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
    fontFamily: Colors().fontFamilyBookMan,
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
