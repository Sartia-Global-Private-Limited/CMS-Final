/*    ----------------Created Date :: 6- Feb -2024    ----------------- */
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
import RNFetchBlob from 'rn-fetch-blob';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import SeparatorComponent from '../../../component/SeparatorComponent';
import {apiBaseUrl} from '../../../../config';
import Images from '../../../constants/Images';
import NeumorphCard from '../../../component/NeumorphCard';
import ImageViewer from '../../../component/ImageViewer';
import DataNotFound from '../../../component/DataNotFound';

const PromotionDemotionDetailScreens = ({navigation, route}) => {
  const allData = route?.params?.allData;

  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState(false);

  const getExtention = filename => {
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
  };

  const downloadImageRemote = remoteImagePath => {
    let date = new Date();
    let image_URL = remoteImagePath;
    let ext = getExtention(image_URL);
    ext = '.' + ext[0];
    const {config, fs} = RNFetchBlob;
    let PictureDir = fs.dirs.PictureDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path:
          PictureDir +
          '/image_' +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          ext,
        description: 'Image',
      },
    };
    config(options)
      .fetch('GET', image_URL)
      .then(res => {
        setImageModalVisible(false);
        ToastAndroid.show('Download complete', ToastAndroid.LONG);
      });
  };

  /*function for finding object is empty or not retun boolean value*/
  function isObjectEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader headerTitle={'Promotion/Demotion detail'} />

      {!isObjectEmpty(allData) ? (
        <ScrollView>
          <View style={styles.mainView}>
            <NeumorphCard>
              <View style={styles.cardContainer}>
                <Text style={styles.headingTxt}>
                  Promotion & Demotion detail
                </Text>
                <SeparatorComponent
                  separatorColor={Colors().gray2}
                  separatorHeight={0.5}
                />
                <NeumorphCard>
                  <TouchableOpacity
                    onPress={() => {
                      setImageModalVisible(true),
                        setImageUri(
                          allData?.document
                            ? `${apiBaseUrl}${allData?.document}`
                            : `${
                                Image.resolveAssetSource(Images.DEFAULT_PROFILE)
                                  .uri
                              }`,
                        );
                    }}>
                    <Image
                      source={{
                        uri: allData?.document
                          ? `${apiBaseUrl}${allData?.document}`
                          : `${
                              Image.resolveAssetSource(Images.DEFAULT_PROFILE)
                                .uri
                            }`,
                      }}
                      style={styles.ImageView}
                    />
                  </TouchableOpacity>
                </NeumorphCard>

                {imageModalVisible && (
                  <ImageViewer
                    visible={imageModalVisible}
                    imageUri={imageUri}
                    cancelBtnPress={() =>
                      setImageModalVisible(!imageModalVisible)
                    }
                    downloadBtnPress={item => downloadImageRemote(item)}
                  />
                )}
                {/* view for request user */}
                <View
                  style={{
                    flexDirection: 'row',
                    columnGap: 10,
                  }}>
                  <View style={{flex: 1, justifyContent: 'center'}}>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={styles.cardHeadingTxt}>user name : </Text>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={styles.cardtext}>
                        {allData?.user_name}
                      </Text>
                    </View>

                    <View style={{flexDirection: 'row'}}>
                      <Text style={styles.cardHeadingTxt}>reason :</Text>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={styles.cardtext}>
                        {allData?.reason}
                      </Text>
                    </View>

                    <View style={{flexDirection: 'row'}}>
                      <Text style={styles.cardHeadingTxt}>
                        new designation :
                      </Text>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={styles.cardtext}>
                        {allData?.role_name}
                      </Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={styles.cardHeadingTxt}>new team :</Text>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={styles.cardtext}>
                        {allData?.team_name}
                      </Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={styles.cardHeadingTxt}>
                        change in salary type :
                      </Text>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={styles.cardtext}>
                        {allData?.change_in_salary_type}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.twoItemView}>
                  <View style={styles.leftView}>
                    <Text style={styles.cardHeadingTxt}>Purpose : </Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={styles.cardtext}>
                      {allData?.purpose}
                    </Text>
                  </View>
                  <View style={styles.rightView}>
                    <Text style={styles.cardHeadingTxt}>
                      CHANGE IN SALARY:{' '}
                    </Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={[styles.cardtext, {textAlign: 'center'}]}>
                      {allData?.change_in_salary}
                    </Text>
                  </View>
                </View>

                <View style={styles.actionView}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={styles.cardHeadingTxt}>
                      change in salary value :{' '}
                    </Text>
                    <NeumorphCard>
                      <View style={{padding: 5}}>
                        <Text
                          numberOfLines={1}
                          ellipsizeMode="tail"
                          style={[
                            styles.cardtext,
                            {
                              color: Colors().pending,
                              fontWeight: '600',
                            },
                          ]}>
                          {allData?.change_in_salary_type === 'percentage'
                            ? `${allData?.change_in_salary_value} %`
                            : `${allData?.change_in_salary_value}`}
                        </Text>
                      </View>
                    </NeumorphCard>
                  </View>
                </View>
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

export default PromotionDemotionDetailScreens;

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
    columnGap: 10,
  },
  actionIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
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
