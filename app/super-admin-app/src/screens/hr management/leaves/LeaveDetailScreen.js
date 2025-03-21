import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import CustomeHeader from '../../../component/CustomeHeader';
import Colors from '../../../constants/Colors';
import IconType from '../../../constants/IconType';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import SeparatorComponent from '../../../component/SeparatorComponent';
import {apiBaseUrl} from '../../../../config';
import Images from '../../../constants/Images';
import NeumorphCard from '../../../component/NeumorphCard';
import ImageViewer from '../../../component/ImageViewer';
import moment from 'moment';
import {Icon} from '@rneui/base';
import ScreensLabel from '../../../constants/ScreensLabel';
import GetFileExtension from '../../../utils/FileExtensionFinder';
import Dowloader from '../../../utils/Dowloader';

const LeaveDetailScreen = ({navigation, route}) => {
  const leaveData = route?.params?.leaveData;
  const label = ScreensLabel();

  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState(false);

  /*function for giveing color of status*/
  function getStatusColor(action) {
    switch (action) {
      case 'pending':
        return Colors().pending;
      case 'approved':
        return Colors().aprroved;
      case 'rejected':
        return Colors().rejected;

      default:
        return Colors().black2;
    }
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader headerTitle={`${label.LEAVE} ${label.DETAIL}`} />

      <ScrollView>
        <View style={styles.mainView}>
          {/* card for stock request  detail */}
          <NeumorphCard>
            <View style={styles.cardContainer}>
              <Text style={[styles.headingTxt, {color: Colors().purple}]}>
                {leaveData?.applicant_name} leave application detail
              </Text>
              <SeparatorComponent
                separatorColor={Colors().gray2}
                separatorHeight={0.5}
              />

              {['jpg', 'jpeg', 'png'].includes(
                GetFileExtension(leaveData?.supporting_documents),
              ) && (
                <NeumorphCard>
                  <TouchableOpacity
                    onPress={() => {
                      setImageModalVisible(true);
                      setImageUri(
                        leaveData?.supporting_documents
                          ? `${apiBaseUrl}${leaveData?.supporting_documents}`
                          : Image.resolveAssetSource(Images.DEFAULT_PROFILE)
                              .uri,
                      );
                    }}>
                    <Image
                      source={{
                        uri: leaveData?.supporting_documents
                          ? `${apiBaseUrl}${leaveData?.supporting_documents}`
                          : Image.resolveAssetSource(Images.DEFAULT_PROFILE)
                              .uri,
                      }}
                      style={styles.ImageView}
                    />
                  </TouchableOpacity>
                </NeumorphCard>
              )}
              {['pdf', 'doc', 'docx'].includes(
                GetFileExtension(leaveData?.supporting_documents),
              ) && (
                <NeumorphCard>
                  <Icon
                    // name="file-pdf-o"
                    name={
                      GetFileExtension(leaveData?.supporting_documents) == 'pdf'
                        ? 'file-pdf-o'
                        : 'document-text-outline'
                    }
                    type={
                      GetFileExtension(leaveData?.supporting_documents) == 'pdf'
                        ? IconType.FontAwesome
                        : IconType.Ionicons
                    }
                    size={60}
                    color={
                      GetFileExtension(leaveData?.supporting_documents) == 'pdf'
                        ? Colors().red
                        : Colors().skyBule
                    }
                    style={{
                      padding: 10,
                      marginTop: 2,
                    }}
                    onPress={() =>
                      Dowloader(
                        `${apiBaseUrl}${leaveData?.supporting_documents}`,
                      )
                    }
                  />
                </NeumorphCard>
              )}

              {imageModalVisible && (
                <ImageViewer
                  visible={imageModalVisible}
                  imageUri={imageUri}
                  cancelBtnPress={() =>
                    setImageModalVisible(!imageModalVisible)
                  }
                  downloadBtnPress={true}
                />
              )}
              {/* view for request user */}
              <View
                style={{
                  flexDirection: 'row',
                  columnGap: 10,
                }}></View>
              <View style={styles.twoItemView}>
                <View style={styles.leftView}>
                  <Text
                    style={[
                      styles.cardHeadingTxt,
                      {color: Colors().pureBlack},
                    ]}>
                    From :{' '}
                  </Text>

                  <Icon
                    name="calendar"
                    type={IconType.AntDesign}
                    color={Colors().aprroved}
                    size={20}
                  />
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={[
                      styles.cardtext,
                      {color: Colors().pureBlack, marginLeft: 10},
                    ]}>
                    {moment(leaveData?.start_date).format('DD/MM/YYYY')}
                  </Text>
                </View>
                <View style={styles.rightView}>
                  <Text
                    style={[
                      styles.cardHeadingTxt,
                      {color: Colors().pureBlack},
                    ]}>
                    to :{' '}
                  </Text>
                  <Icon
                    name="calendar"
                    type={IconType.AntDesign}
                    color={Colors().red}
                    size={20}
                  />
                  <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={[
                      styles.cardtext,
                      {
                        textAlign: 'center',
                        color: Colors().pureBlack,
                        marginLeft: 10,
                      },
                    ]}>
                    {moment(leaveData?.end_date).format('DD/MM/YYYY')}
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
                    Leave type :{' '}
                  </Text>

                  <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={[styles.cardtext, {color: Colors().pureBlack}]}>
                    {leaveData?.leave_type}
                  </Text>
                </View>
                <View style={styles.rightView}>
                  <Text
                    style={[
                      styles.cardHeadingTxt,
                      {color: Colors().pureBlack},
                    ]}>
                    duration :{' '}
                  </Text>

                  <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={[
                      styles.cardtext,
                      {textAlign: 'center', color: Colors().pureBlack},
                    ]}>
                    {leaveData?.total_days} days {leaveData?.total_hours} hours
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
                    <View style={{padding: 5}}>
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={[
                          styles.cardtext,
                          {
                            color: getStatusColor(leaveData?.status),
                            fontWeight: '600',
                          },
                        ]}>
                        {leaveData?.status}
                      </Text>
                    </View>
                  </NeumorphCard>
                </View>
              </View>
            </View>
          </NeumorphCard>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LeaveDetailScreen;

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
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  cardtext: {
    fontSize: 12,
    fontWeight: '300',
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    flexShrink: 1,
    marginLeft: 2,
  },
  actionView: {
    flexDirection: 'row',
    columnGap: 10,
  },
  ImageView: {
    height: WINDOW_HEIGHT * 0.2,
    margin: 5,
    borderRadius: 8,
    borderColor: Colors().black2,
  },

  rightView: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  leftView: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  twoItemView: {
    flexDirection: 'row',
    columnGap: 5,
  },
});
