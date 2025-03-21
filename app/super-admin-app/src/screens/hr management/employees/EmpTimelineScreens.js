import {StyleSheet, Text, View, SafeAreaView, ScrollView} from 'react-native';
import React from 'react';
import CustomeHeader from '../../../component/CustomeHeader';
import Colors from '../../../constants/Colors';
import IconType from '../../../constants/IconType';
import {Badge, Icon} from '@rneui/base';
import NeumorphCard from '../../../component/NeumorphCard';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import SeparatorComponent from '../../../component/SeparatorComponent';
import DataNotFound from '../../../component/DataNotFound';
import moment from 'moment';
import ScreensLabel from '../../../constants/ScreensLabel';

const EmpTimelineScreens = ({navigation, route}) => {
  const timelineData = route?.params?.data;
  const label = ScreensLabel();

  /*function for finding object is empty or not retun boolean value*/
  function isObjectEmpty(obj) {
    return Object.keys(obj).length === 0;
  }
  /*function for giveing text of status*/
  function getStatusText(action) {
    switch (action) {
      case 1:
        return 'active';
      case 0:
        return 'inactive';

      default:
        return 'not';
    }
  }

  /*function for giveing color of status*/
  function getStatusColor(action) {
    switch (action) {
      case 1:
        return Colors().aprroved;
      case 0:
        return Colors().red;

      default:
        return Colors().black2;
    }
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader headerTitle={`${label.TIMELINE} ${label.DETAIL}`} />

      {!isObjectEmpty(timelineData) ? (
        <ScrollView>
          <View style={styles.mainView}>
            {/* card for company detail */}
            <NeumorphCard>
              <View style={styles.cardContainer}>
                <Text style={[styles.headingTxt, {color: Colors().purple}]}>
                  Timeline history
                </Text>

                {timelineData.map((item, index) => (
                  <View style={styles.timlineView}>
                    <View style={styles.lineView}>
                      <Badge
                        value={index + 1}
                        // status={memberCount > 0 ? 'success' : 'error'}
                        badgeStyle={{
                          backgroundColor: `#52${item?.id}${item?.id}FF`,
                        }}
                        containerStyle={{}}
                      />
                      <SeparatorComponent
                        separatorColor={Colors().purple}
                        separatorHeight={'95%'}
                        separatorWidth={1.5}
                      />
                    </View>

                    <View style={{flex: 1, rowGap: 10}}>
                      <View style={{flexDirection: 'row'}}>
                        <Text
                          style={[
                            styles.cardHeadingTxt,
                            {color: Colors().pureBlack},
                          ]}>
                          remark :
                        </Text>
                        <Text
                          numberOfLines={2}
                          ellipsizeMode="tail"
                          style={[
                            styles.cardtext,
                            {color: Colors().pureBlack},
                          ]}>
                          {item?.remark}
                        </Text>
                      </View>

                      <View style={styles.assignView}>
                        <Text
                          style={[
                            styles.cardHeadingTxt,
                            {color: Colors().pureBlack},
                          ]}>
                          UPDATED BY -
                        </Text>

                        <Text
                          numberOfLines={2}
                          ellipsizeMode="tail"
                          style={[
                            styles.cardtext,
                            {color: Colors().pureBlack},
                          ]}>
                          {item?.updated_by_name}
                        </Text>
                      </View>
                      <View style={styles.assignView}>
                        <Icon
                          name="history"
                          type={IconType.MaterialIcons}
                          color={Colors().pending}
                        />
                        <Text
                          numberOfLines={2}
                          ellipsizeMode="tail"
                          style={[
                            styles.cardtext,
                            {color: Colors().pureBlack},
                          ]}>
                          {moment(item?.updated_at).format('HH:mm A')} {' | '}{' '}
                          {moment(item?.updated_at).format('DD/MM/YYYY')}
                        </Text>
                      </View>
                      <View style={styles.statusView}>
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          <Text
                            style={[
                              styles.cardHeadingTxt,
                              {color: Colors().pureBlack},
                            ]}>
                            STATUS :{' '}
                          </Text>
                          <NeumorphCard>
                            <View style={{padding: 5}}>
                              <Text
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                style={[
                                  styles.cardtext,
                                  {
                                    color: getStatusColor(item?.updated_status),
                                    fontWeight: '600',
                                  },
                                ]}>
                                {/* {item?.status == 1 ? 'Active' : 'Inatcive'} */}
                                {getStatusText(item?.updated_status)}
                              </Text>
                            </View>
                          </NeumorphCard>
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </NeumorphCard>
          </View>
        </ScrollView>
      ) : (
        <DataNotFound />
      )}
    </SafeAreaView>
  );
};

export default EmpTimelineScreens;

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
  lineView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timlineView: {
    flexDirection: 'row',
    columnGap: 10,
    flex: 1,
  },
  assignView: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
  },
  statusView: {
    flexDirection: 'row',
    alignItems: 'center',

    justifyContent: 'space-between',
  },
});
