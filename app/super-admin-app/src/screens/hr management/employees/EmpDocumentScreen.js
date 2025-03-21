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
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import SeparatorComponent from '../../../component/SeparatorComponent';
import {apiBaseUrl} from '../../../../config';
import Images from '../../../constants/Images';
import NeumorphCard from '../../../component/NeumorphCard';
import ImageViewer from '../../../component/ImageViewer';
import RNFetchBlob from 'rn-fetch-blob';
import DataNotFound from '../../../component/DataNotFound';
import ScreensLabel from '../../../constants/ScreensLabel';

const EmpDocumentScreen = ({navigation, route}) => {
  const docData = route?.params?.data;
  const label = ScreensLabel();
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

  function isObjectEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader headerTitle={`${label.EMPLOYEES} ${label.DOCUMENT}`} />

      {!isObjectEmpty(docData) ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.mainView}>
            {imageModalVisible && (
              <ImageViewer
                visible={imageModalVisible}
                imageUri={imageUri}
                cancelBtnPress={() => setImageModalVisible(!imageModalVisible)}
                downloadBtnPress={item => downloadImageRemote(item)}
              />
            )}
            {docData?.aadhar_card_front_image && (
              <NeumorphCard>
                <View style={[styles.cardContainer]}>
                  <Text style={styles.headingTxt}>AADHAR CARD Front IMAGE</Text>
                  <SeparatorComponent
                    separatorColor={Colors().purple}
                    separatorHeight={3}
                  />
                  <NeumorphCard>
                    <TouchableOpacity
                      onPress={() => {
                        setImageModalVisible(true),
                          setImageUri(
                            docData?.aadhar_card_front_image
                              ? `${apiBaseUrl}${docData?.aadhar_card_front_image}`
                              : `${
                                  Image.resolveAssetSource(
                                    Images.DEFAULT_PROFILE,
                                  ).uri
                                }`,
                          );
                      }}>
                      <Image
                        source={{
                          uri: docData?.bank_documents
                            ? `${apiBaseUrl}${docData?.aadhar_card_front_image}`
                            : `${
                                Image.resolveAssetSource(Images.DEFAULT_PROFILE)
                                  .uri
                              }`,
                        }}
                        style={styles.ImageView}
                      />
                    </TouchableOpacity>
                  </NeumorphCard>
                </View>
              </NeumorphCard>
            )}
            {docData?.aadhar_card_back_image && (
              <NeumorphCard>
                <View style={[styles.cardContainer]}>
                  <Text style={styles.headingTxt}>AADHAR CARD back IMAGE</Text>
                  <SeparatorComponent
                    separatorColor={Colors().purple}
                    separatorHeight={3}
                  />
                  <NeumorphCard>
                    <TouchableOpacity
                      onPress={() => {
                        setImageModalVisible(true),
                          setImageUri(
                            docData?.aadhar_card_back_image
                              ? `${apiBaseUrl}${docData?.aadhar_card_back_image}`
                              : `${
                                  Image.resolveAssetSource(
                                    Images.DEFAULT_PROFILE,
                                  ).uri
                                }`,
                          );
                      }}>
                      <Image
                        source={{
                          uri: docData?.aadhar_card_back_image
                            ? `${apiBaseUrl}${docData?.aadhar_card_back_image}`
                            : `${
                                Image.resolveAssetSource(Images.DEFAULT_PROFILE)
                                  .uri
                              }`,
                        }}
                        style={styles.ImageView}
                      />
                    </TouchableOpacity>
                  </NeumorphCard>
                </View>
              </NeumorphCard>
            )}
            {docData?.pan_card_image && (
              <NeumorphCard>
                <View style={[styles.cardContainer]}>
                  <Text style={styles.headingTxt}>pancard IMAGE</Text>
                  <SeparatorComponent
                    separatorColor={Colors().purple}
                    separatorHeight={3}
                  />
                  <NeumorphCard>
                    <TouchableOpacity
                      onPress={() => {
                        setImageModalVisible(true),
                          setImageUri(
                            docData?.pan_card_image
                              ? `${apiBaseUrl}${docData?.pan_card_image}`
                              : `${
                                  Image.resolveAssetSource(
                                    Images.DEFAULT_PROFILE,
                                  ).uri
                                }`,
                          );
                      }}>
                      <Image
                        source={{
                          uri: docData?.pan_card_image
                            ? `${apiBaseUrl}${docData?.pan_card_image}`
                            : `${
                                Image.resolveAssetSource(Images.DEFAULT_PROFILE)
                                  .uri
                              }`,
                        }}
                        style={styles.ImageView}
                      />
                    </TouchableOpacity>
                  </NeumorphCard>
                </View>
              </NeumorphCard>
            )}
            {docData?.bank_documents && (
              <NeumorphCard>
                <View style={[styles.cardContainer]}>
                  <Text style={styles.headingTxt}>bank document</Text>
                  <SeparatorComponent
                    separatorColor={Colors().purple}
                    separatorHeight={3}
                  />
                  <NeumorphCard>
                    <TouchableOpacity
                      onPress={() => {
                        setImageModalVisible(true),
                          setImageUri(
                            docData?.bank_documents
                              ? `${apiBaseUrl}${docData?.bank_documents}`
                              : `${
                                  Image.resolveAssetSource(
                                    Images.DEFAULT_PROFILE,
                                  ).uri
                                }`,
                          );
                      }}>
                      <Image
                        source={{
                          uri: docData?.bank_documents
                            ? `${apiBaseUrl}${docData?.bank_documents}`
                            : `${
                                Image.resolveAssetSource(Images.DEFAULT_PROFILE)
                                  .uri
                              }`,
                        }}
                        style={styles.ImageView}
                      />
                    </TouchableOpacity>
                  </NeumorphCard>
                </View>
              </NeumorphCard>
            )}
            {docData?.graduation && (
              <NeumorphCard>
                <View style={[styles.cardContainer]}>
                  <Text style={styles.headingTxt}>graduation</Text>
                  <SeparatorComponent
                    separatorColor={Colors().purple}
                    separatorHeight={3}
                  />
                  <NeumorphCard>
                    <TouchableOpacity
                      onPress={() => {
                        setImageModalVisible(true),
                          setImageUri(
                            docData?.graduation
                              ? `${apiBaseUrl}${docData?.graduation}`
                              : `${
                                  Image.resolveAssetSource(
                                    Images.DEFAULT_PROFILE,
                                  ).uri
                                }`,
                          );
                      }}>
                      <Image
                        source={{
                          uri: docData?.graduation
                            ? `${apiBaseUrl}${docData?.graduation}`
                            : `${
                                Image.resolveAssetSource(Images.DEFAULT_PROFILE)
                                  .uri
                              }`,
                        }}
                        style={styles.ImageView}
                      />
                    </TouchableOpacity>
                  </NeumorphCard>
                </View>
              </NeumorphCard>
            )}

            {docData?.post_graduation && (
              <NeumorphCard>
                <View style={[styles.cardContainer]}>
                  <Text style={styles.headingTxt}> post graduation</Text>
                  <SeparatorComponent
                    separatorColor={Colors().purple}
                    separatorHeight={3}
                  />
                  <NeumorphCard>
                    <TouchableOpacity
                      onPress={() => {
                        setImageModalVisible(true),
                          setImageUri(
                            docData?.post_graduation
                              ? `${apiBaseUrl}${docData?.post_graduation}`
                              : `${
                                  Image.resolveAssetSource(
                                    Images.DEFAULT_PROFILE,
                                  ).uri
                                }`,
                          );
                      }}>
                      <Image
                        source={{
                          uri: docData?.post_graduation
                            ? `${apiBaseUrl}${docData?.post_graduation}`
                            : `${
                                Image.resolveAssetSource(Images.DEFAULT_PROFILE)
                                  .uri
                              }`,
                        }}
                        style={styles.ImageView}
                      />
                    </TouchableOpacity>
                  </NeumorphCard>
                </View>
              </NeumorphCard>
            )}
            {docData?.doctorate && (
              <NeumorphCard>
                <View style={[styles.cardContainer]}>
                  <Text style={styles.headingTxt}>doctorate</Text>
                  <SeparatorComponent
                    separatorColor={Colors().purple}
                    separatorHeight={3}
                  />
                  <NeumorphCard>
                    <TouchableOpacity
                      onPress={() => {
                        setImageModalVisible(true),
                          setImageUri(
                            docData?.doctorate
                              ? `${apiBaseUrl}${docData?.doctorate}`
                              : `${
                                  Image.resolveAssetSource(
                                    Images.DEFAULT_PROFILE,
                                  ).uri
                                }`,
                          );
                      }}>
                      <Image
                        source={{
                          uri: docData?.doctorate
                            ? `${apiBaseUrl}${docData?.doctorate}`
                            : `${
                                Image.resolveAssetSource(Images.DEFAULT_PROFILE)
                                  .uri
                              }`,
                        }}
                        style={styles.ImageView}
                      />
                    </TouchableOpacity>
                  </NeumorphCard>
                </View>
              </NeumorphCard>
            )}
          </View>
        </ScrollView>
      ) : (
        <DataNotFound />
      )}
    </SafeAreaView>
  );
};

export default EmpDocumentScreen;

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
  listView: {
    position: 'absolute',
    marginTop: '14%',
    marginLeft: '38%',
    zIndex: 1,
  },
  listItemView: {
    backgroundColor: Colors().screenBackground,
    width: '150%',
  },
  ImageView: {
    height: WINDOW_HEIGHT * 0.2,
    borderRadius: 8,
    borderColor: 'white',
    borderWidth: 2,
  },
  tableHeadingView: {
    justifyContent: 'center',
    alignItems: 'center',
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
