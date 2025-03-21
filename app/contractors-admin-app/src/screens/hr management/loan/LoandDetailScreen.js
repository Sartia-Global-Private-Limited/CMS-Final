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
import Screenslabel from '../../../constants/ScreensLabel';

const LoandDetailScreen = ({navigation, route}) => {
  const loanData = route?.params?.loanData;
  const label = Screenslabel();

  /*function for giveing color of status*/
  function getStatusColor(action) {
    switch (action) {
      case 'pending':
        return Colors().pending;
      case 'active':
        return Colors().aprroved;
      case 'rejected':
        return Colors().rejected;
      case 'reject':
        return Colors().rejected;
      case 'closed':
        return Colors().red;

      default:
        return Colors().black2;
    }
  }

  /*function for finding object is empty or not retun boolean value*/
  function isObjectEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader headerTitle={`${label.LOAN} ${label.DETAIL}`} />

      {!isObjectEmpty(loanData) ? (
        <ScrollView>
          <View style={styles.mainView}>
            {/* card for stock request  detail */}
            <NeumorphCard>
              <View style={styles.cardContainer}>
                <Text style={[styles.headingTxt, {color: Colors().purple}]}>
                  user Loan detail
                </Text>
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
                          uri: loanData?.image
                            ? `${apiBaseUrl}${loanData?.image}`
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
                      <Text
                        style={[
                          styles.cardHeadingTxt,
                          {color: Colors().pureBlack},
                        ]}>
                        employee name :{' '}
                      </Text>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={[styles.cardtext, {color: Colors().pureBlack}]}>
                        {loanData?.name}
                      </Text>
                    </View>

                    <View style={{flexDirection: 'row'}}>
                      <Text
                        style={[
                          styles.cardHeadingTxt,
                          {color: Colors().pureBlack},
                        ]}>
                        remark :{' '}
                      </Text>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={[styles.cardtext, {color: Colors().pureBlack}]}>
                        {loanData?.remarks}
                      </Text>
                    </View>
                  </View>
                </View>
                {loanData?.status !== 'pending' && (
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
                            uri: loanData?.loan_status_changed_image
                              ? `${apiBaseUrl}${loanData?.loan_status_changed_image}`
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
                        <Text
                          style={[
                            styles.cardHeadingTxt,
                            {color: Colors().pureBlack},
                          ]}>
                          STATUS CHANGED BY:{' '}
                        </Text>
                        <Text
                          numberOfLines={2}
                          ellipsizeMode="tail"
                          style={[
                            styles.cardtext,
                            {color: Colors().pureBlack},
                          ]}>
                          {loanData?.loan_status_changed_by}
                        </Text>
                      </View>

                      <View style={{flexDirection: 'row'}}>
                        <Text
                          style={[
                            styles.cardHeadingTxt,
                            {color: Colors().pureBlack},
                          ]}>
                          STATUS CHANGED DATE :{' '}
                        </Text>
                        <Text
                          numberOfLines={2}
                          ellipsizeMode="tail"
                          style={[
                            styles.cardtext,
                            {color: Colors().pureBlack},
                          ]}>
                          {moment(loanData?.loan_status_changed_date).format(
                            'DD/MM/YYYY',
                          )}{' '}
                          ||{' '}
                          {moment(loanData?.loan_status_changed_date).format(
                            'hh:mm A',
                          )}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}

                {/* view for request user */}
                <View
                  style={{
                    flexDirection: 'row',
                    columnGap: 10,
                  }}>
                  <View style={{flex: 1, justifyContent: 'center'}}>
                    {loanData?.bank_name && (
                      <View style={{flexDirection: 'row'}}>
                        <Text
                          style={[
                            styles.cardHeadingTxt,
                            {color: Colors().pureBlack},
                          ]}>
                          bank name :{' '}
                        </Text>
                        <Text
                          numberOfLines={2}
                          ellipsizeMode="tail"
                          style={[
                            styles.cardtext,
                            {color: Colors().pureBlack},
                          ]}>
                          {loanData?.bank_name}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
                <View style={styles.twoItemView}>
                  <View style={styles.leftView}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        {color: Colors().pureBlack},
                      ]}>
                      Loan amount :{' '}
                    </Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={[
                        styles.cardtext,
                        {textAlign: 'center', color: Colors().aprroved},
                      ]}>
                      ₹ {loanData?.loan_amount}
                    </Text>
                  </View>
                  <View style={styles.rightView}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        {color: Colors().pureBlack},
                      ]}>
                      loan id :{' '}
                    </Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={[styles.cardtext, {color: Colors().pureBlack}]}>
                      {loanData?.loan_id}
                    </Text>
                  </View>
                </View>
                <View style={styles.twoItemView}>
                  <View style={styles.leftView}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        {color: Colors().pureBlack},
                      ]}>
                      Loan type :{' '}
                    </Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={[
                        styles.cardtext,
                        {textAlign: 'center', color: Colors().pureBlack},
                      ]}>
                      {loanData?.loan_type}
                    </Text>
                  </View>
                  <View style={styles.rightView}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        {color: Colors().pureBlack},
                      ]}>
                      Loan term :{' '}
                    </Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={[styles.cardtext, {color: Colors().pureBlack}]}>
                      {loanData?.loan_term}
                    </Text>
                  </View>
                </View>
                <View style={styles.actionView}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        {color: Colors().pureBlack},
                      ]}>
                      status :{' '}
                    </Text>
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
                              color: getStatusColor(loanData?.status),
                              fontWeight: '600',
                            },
                          ]}>
                          {loanData?.status}
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

export default LoandDetailScreen;

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
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    alignSelf: 'center',
    marginBottom: 2,
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
