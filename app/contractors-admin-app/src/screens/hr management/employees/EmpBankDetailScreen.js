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
import ScreensLabel from '../../../constants/ScreensLabel';

const EmpBankDetailScreen = ({route}) => {
  const bankData = route?.params?.data;
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState(false);
  const label = ScreensLabel();

  const getExtention = filename => {
    // To get the file extension
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
  };
  {
    /*function for downloading image*/
  }
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
      <CustomeHeader headerTitle={`${label.BANK} ${label.DETAIL}`} />

      {!isObjectEmpty(bankData) ? (
        <ScrollView>
          <View style={styles.mainView}>
            {/* card for stock request  detail */}
            <NeumorphCard>
              <View style={styles.cardContainer}>
                <Text style={[styles.headingTxt, {color: Colors().purple}]}>
                  user bank detail
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
                          bankData?.bank_documents
                            ? `${apiBaseUrl}${bankData?.bank_documents}`
                            : `${
                                Image.resolveAssetSource(Images.DEFAULT_PROFILE)
                                  .uri
                              }`,
                        );
                    }}>
                    <Image
                      source={{
                        uri: bankData?.bank_documents
                          ? `${apiBaseUrl}${bankData?.bank_documents}`
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
                    {bankData?.bank_name && (
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
                          {bankData?.bank_name}
                        </Text>
                      </View>
                    )}

                    {bankData?.username && (
                      <View style={{flexDirection: 'row'}}>
                        <Text
                          style={[
                            styles.cardHeadingTxt,
                            {color: Colors().pureBlack},
                          ]}>
                          username :
                        </Text>
                        <Text
                          numberOfLines={2}
                          ellipsizeMode="tail"
                          style={[
                            styles.cardtext,
                            {color: Colors().pureBlack},
                          ]}>
                          {bankData?.username}
                        </Text>
                      </View>
                    )}

                    {bankData?.account_number && (
                      <View style={{flexDirection: 'row'}}>
                        <Text
                          style={[
                            styles.cardHeadingTxt,
                            {color: Colors().pureBlack},
                          ]}>
                          ACCOUNT NUMBER :
                        </Text>
                        <Text
                          numberOfLines={2}
                          ellipsizeMode="tail"
                          style={[
                            styles.cardtext,
                            {color: Colors().pureBlack},
                          ]}>
                          {bankData?.account_number}
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
                      esi no :{' '}
                    </Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={[styles.cardtext, {color: Colors().pureBlack}]}>
                      {bankData?.esi_no}
                    </Text>
                  </View>
                  <View style={styles.rightView}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        {color: Colors().pureBlack},
                      ]}>
                      epf no :{' '}
                    </Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={[
                        styles.cardtext,
                        {textAlign: 'center', color: Colors().pureBlack},
                      ]}>
                      {bankData?.epf_no}
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
                      ifsc code :{' '}
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
                          {bankData?.ifsc_code}
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

export default EmpBankDetailScreen;

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
