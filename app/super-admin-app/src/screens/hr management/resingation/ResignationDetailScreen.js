/*    ----------------Created Date :: 5- Feb -2024    ----------------- */
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import React from 'react';

import CustomeHeader from '../../../component/CustomeHeader';
import Colors from '../../../constants/Colors';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import SeparatorComponent from '../../../component/SeparatorComponent';
import {apiBaseUrl} from '../../../../config';
import Images from '../../../constants/Images';
import NeumorphCard from '../../../component/NeumorphCard';
import NeuomorphAvatar from '../../../component/NeuomorphAvatar';
import {Avatar} from '@rneui/themed';
import moment from 'moment';
import DataNotFound from '../../../component/DataNotFound';

const ResignationDetailScreen = ({navigation, route}) => {
  const resignationData = route?.params?.resignationData;

  /*function for giveing color of status*/
  function getStatusColor(action) {
    switch (action) {
      case '0':
        return Colors().pending;
      case '1':
        return Colors().aprroved;
      case '2':
        return Colors().rejected;

      default:
        return Colors().black2;
    }
  }

  /*function for giveing text of status*/
  function getStatusText(action) {
    switch (action) {
      case '0':
        return 'pending';
      case '1':
        return 'approved';
      case '2':
        return 'rejected';
      default:
        return 'black';
    }
  }
  /*function for finding object is empty or not retun boolean value*/
  function isObjectEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader
        headerTitle={'Resignation detail'}

        // rightIconPress={() => setListModalVisible(!listModalVisible)}
      />

      {!isObjectEmpty(resignationData) ? (
        <ScrollView>
          <View style={styles.mainView}>
            {/* card for stock request  detail */}
            <NeumorphCard>
              <View style={styles.cardContainer}>
                <Text style={styles.headingTxt}>Resignation detail data</Text>
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
                          uri: resignationData?.image
                            ? `${apiBaseUrl}${resignationData?.image}`
                            : `${
                                Image.resolveAssetSource(Images.DEFAULT_PROFILE)
                                  .uri
                              }`,
                        }}
                      />
                    </NeuomorphAvatar>
                  </View>

                  <View style={{flex: 1, justifyContent: 'center'}}>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={styles.cardHeadingTxt}>user name : </Text>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={styles.cardtext}>
                        {resignationData?.user_name}
                      </Text>
                    </View>

                    <View style={{flexDirection: 'row'}}>
                      <Text style={styles.cardHeadingTxt}>
                        RESIGNATION DATE :{' '}
                      </Text>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={styles.cardtext}>
                        {moment(resignationData?.resignation_date).format(
                          'DD/MM/YYYY',
                        )}{' '}
                        |{' '}
                        {moment(resignationData?.resignation_date).format(
                          'hh:mm A',
                        )}
                      </Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={styles.cardHeadingTxt}>
                        last working day :{' '}
                      </Text>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={styles.cardtext}>
                        {moment(resignationData?.last_working_day).format(
                          'DD/MM/YYYY',
                        )}{' '}
                        |{' '}
                        {moment(resignationData?.last_working_day).format(
                          'hh:mm A',
                        )}
                      </Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={styles.cardHeadingTxt}>FNF : </Text>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={styles.cardtext}>
                        {resignationData?.fnf}
                      </Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={styles.cardHeadingTxt}>Reason : </Text>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={styles.cardtext}>
                        {resignationData?.reason}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.actionView}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={styles.cardHeadingTxt}>status : </Text>
                    <NeumorphCard>
                      <View
                        style={{
                          padding: 5,
                        }}>
                        <Text
                          numberOfLines={2}
                          ellipsizeMode="tail"
                          style={[
                            styles.cardtext,
                            {
                              color: getStatusColor(
                                resignationData?.resignation_status,
                              ),
                              fontWeight: '600',
                            },
                          ]}>
                          {getStatusText(resignationData?.resignation_status)}
                        </Text>
                      </View>
                    </NeumorphCard>
                  </View>
                </View>
              </View>
            </NeumorphCard>

            <NeumorphCard
              darkShadowColor={Colors().darkShadow} // <- set this
              lightShadowColor={Colors().lightShadow} // <- this
            ></NeumorphCard>
          </View>
        </ScrollView>
      ) : (
        <DataNotFound />
      )}
    </SafeAreaView>
  );
};

export default ResignationDetailScreen;

const styles = StyleSheet.create({
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
    justifyContent: 'space-between',
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
