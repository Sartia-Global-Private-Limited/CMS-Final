/*    ----------------Created Date :: 4- March -2024   ----------------- */

import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Colors from '../../constants/Colors';
import IconType from '../../constants/IconType';
import SearchBar from '../../component/SearchBar';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../utils/ScreenLayout';
import { Icon } from '@rneui/base';
import SeparatorComponent from '../../component/SeparatorComponent';
import FloatingAddButton from '../../component/FloatingAddButton';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../component/Loader';
import InternalServer from '../../component/InternalServer';
import DataNotFound from '../../component/DataNotFound';
import AlertModal from '../../component/AlertModal';
import { apiBaseUrl } from '../../../config';
import NeumorphCard from '../../component/NeumorphCard';
import Toast from 'react-native-toast-message';
import ImageViewer from '../../component/ImageViewer';
import RNFetchBlob from 'rn-fetch-blob';
import { getAllTutorialList } from '../../redux/slices/tutorials/getTutorialListSlice';
import VideoPlayer from 'react-native-video-controls';
import { deleteTutorialById } from '../../redux/slices/tutorials/addUpdateTutorialSlice';
import Pagination from '../../component/List/Pagination';
import { Image } from 'react-native';
import Images from '../../constants/Images';

const TutorialListingScreen = ({ navigation, route }) => {
  const typeOfTutorial = route?.params?.type;
  /* declare props constant variale*/

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const ListData = useSelector(state => state.getTutorialList);

  /*declare useState variable here */
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(null);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [isFetchingPreviousPage, setIsFetchingPreviousPage] = useState(false);
  const [tutorialId, setTutorialId] = useState('');
  const [searchText, setSearchText] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(getAllTutorialList({ pageSize: pageSize, pageNo: pageNo }));
  }, [isFocused]);

  /*search function*/
  const searchFunction = searchvalue => {
    dispatch(getAllTutorialList({ search: searchvalue }));
  };

  const playVideoAtIndex = index => {
    console.log('setCurrentVideoIndex====>', index);
    setCurrentVideoIndex(index);
    setIsPlaying(true);
  };
  
  const onSearchCancel = () => {
    dispatch(getAllTutorialList({ pageSize: pageSize, pageNo: pageNo }));
  };
  /* delete Stock request  function with id */
  const deleteTutorial = async Id => {
    try {
      const deleteResult = await dispatch(deleteTutorialById(Id)).unwrap();

      if (deleteResult?.status === true) {
        Toast.show({
          type: 'success',
          text1: deleteResult?.message,
          position: 'bottom',
        });
        setDeleteModalVisible(false), setTutorialId('');
        dispatch(getAllTutorialList({ pageSize: pageSize, pageNo: pageNo }));
      } else {
        Toast.show({
          type: 'error',
          text1: deleteResult?.message,
          position: 'bottom',
        });
        setDeleteModalVisible(false), setTutorialId('');
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });
      setDeleteModalVisible(false), setTutorialId('');
    }
  };

  const renderEmptyComponent = () => (
    <View
      style={{
        height: WINDOW_HEIGHT * 0.6,
      }}>
      <DataNotFound />
    </View>
  );

  const getFilteredData = data => {
    if (typeOfTutorial === 'text') {
      const res = data.filter(item => item.tutorial_format === 'text');
      return res;
    } else if (typeOfTutorial === 'audio') {
      const res = data.filter(item => item.tutorial_format === 'audio');
      return res;
    } else if (typeOfTutorial === 'video') {
      const res = data.filter(item => item.tutorial_format === 'video');
      return res;
    } else if (typeOfTutorial === 'pdf') {
      const res = data.filter(item => item.tutorial_format === 'pdf');
      return res;
    } else if (typeOfTutorial === 'image') {
      const res = data.filter(item => item.tutorial_format === 'image');
      return res;
    } else {
      return data;
    }
  };

  const getExtention = filename => {
    // To get the file extension
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
  };

  /*function for downloading image*/
  const downloadImageRemote = remoteImagePath => {
    // Main function to download the image
    // To add the time suffix in filename
    let date = new Date();
    // Image URL which we want to download
    let image_URL = remoteImagePath;
    // Getting the extention of the file
    let ext = getExtention(image_URL);
    ext = '.' + ext[0];
    // Get config and fs from RNFetchBlob
    // config: To pass the downloading related options
    // fs: Directory path where we want our image to download
    const { config, fs } = RNFetchBlob;
    let PictureDir = fs.dirs.PictureDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        // Related to the Android only
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
        // Showing alert after successful downloading
        setImageModalVisible(false);
        // console.log('res -> ', JSON.stringify(res));
        Toast.show({
          type: 'success',
          text1: 'Download success full',
          position: 'bottom',
        });
        // ToastAndroid.show('Download complete', ToastAndroid.LONG);
      });
  };

  /* flatlist render ui */
  const renderItem = ({ item, index }) => {
    return (
      <View>
        <TouchableOpacity
          style={styles.cardContainer}
          onPress={() =>
            navigation.navigate('TaskDetailScreen', {
              id: item?.id,
            })
          }>
          <NeumorphCard
            darkShadowColor={Colors().darkShadow} // <- set this
            lightShadowColor={Colors().lightShadow} // <- this
          >
            <View
              style={{
                margin: WINDOW_WIDTH * 0.03,
                flex: 1,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  columnGap: 10,
                }}>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <TouchableOpacity
                    style={{
                      borderColor: Colors().purple,
                      borderWidth: 0.5,
                      borderRadius: 10,
                      padding: 5,
                    }}
                    onPress={() => {
                      setImageModalVisible(true),
                        setImageUri(
                          item?.attachment
                            ? `${apiBaseUrl}${item?.attachment}`
                            : `${
                                Image.resolveAssetSource(Images.DEFAULT_PROFILE)
                                  .uri
                              }`,
                        );
                    }}>
                    {item.tutorial_format === 'pdf' && (
                      <Icon
                        name="pdffile1"
                        type={IconType.AntDesign}
                        size={100}
                        color={Colors().red}
                        style={{ marginVertical: 20 }}
                        onPress={() =>
                          downloadImageRemote(
                            `${apiBaseUrl}${item?.attachment}`,
                          )
                        }
                      />
                    )}
                    {item.tutorial_format === 'text' && (
                      <Icon
                        name="filetext1"
                        type={IconType.AntDesign}
                        size={100}
                        color={Colors().skyBule}
                        style={{ marginVertical: 20 }}
                        onPress={() =>
                          downloadImageRemote(
                            `${apiBaseUrl}${item?.attachment}`,
                          )
                        }
                      />
                    )}
                    {item.tutorial_format === 'video' && (
                      <>
                        {index != currentVideoIndex && (
                          <Icon
                            name="video"
                            type={IconType.Entypo}
                            size={100}
                            color={Colors().skyBule}
                            style={{ marginVertical: 20 }}
                            onPress={() => playVideoAtIndex(index)}
                          />
                        )}

                        {isPlaying && index == currentVideoIndex && (
                          <VideoPlayer
                            source={{ uri: `${apiBaseUrl}${item?.attachment}` }} // Can be a URL or a local file.
                            ref={ref => {
                              this.player = ref;
                            }} // Store reference
                            onBuffer={item => {
                              console.log('video is bufferign', item);
                            }} // Callback when remote video is buffering
                            onError={this.videoError} // Callback when video cannot be loaded
                            poster={
                              'https://www.freeiconspng.com/thumbs/sound-png/sound-png-3.png'
                            }
                            posterResizeMode="cover"
                            onEnterFullscreen={() => {
                              // presentFullscreenPlayer();
                              navigation.navigate('VideoPlayerScreen', {
                                uri: `${apiBaseUrl}${item?.attachment}`,
                              });
                            }}
                            onPlaybackRateChange={() =>
                              console.log('callded playback')
                            }
                            resizeMode="cover"
                            disableBack
                            muted={true}
                            tapAnywhereToPause={true}
                            // autoPlay={false}
                            paused={!isPlaying}
                            style={styles.ImageView}
                          />
                        )}
                      </>
                    )}
                    {item.tutorial_format === 'audio' && (
                      <>
                        {!isAudioPlaying && (
                          <Icon
                            name="file-audio-o"
                            type={IconType.FontAwesome}
                            size={100}
                            color={Colors().skyBule}
                            style={{ marginVertical: 20 }}
                            onPress={() => setIsAudioPlaying(true)}
                          />
                        )}
                        {isAudioPlaying && (
                          <VideoPlayer
                            source={{ uri: `${apiBaseUrl}${item?.attachment}` }} // Can be a URL or a local file.
                            ref={ref => {
                              this.player = ref;
                            }}
                            onBuffer={this.onBuffer} // Callback when remote video is buffering
                            onError={this.videoError} // Callback when video cannot be loaded
                            onEnterFullscreen={() => {
                              // navigation.navigate('VideoPlayerScreen', {
                              //   uri: `${apiBaseUrl}${item?.attachment}`,
                              // });
                            }}
                            resizeMode="cover"
                            disableBack
                            muted={true}
                            tapAnywhereToPause={true}
                            paused={!isAudioPlaying}
                            style={styles.ImageView}
                          />
                        )}
                      </>
                    )}
                    {item?.tutorial_format === 'image' && (
                      <Image
                        source={{
                          uri: item?.attachment
                            ? `${apiBaseUrl}${item?.attachment}`
                            : `${
                                Image.resolveAssetSource(Images.DEFAULT_PROFILE)
                                  .uri
                              }`,
                        }}
                        style={styles.ImageView}
                      />
                    )}
                  </TouchableOpacity>

                  <View style={{ flexDirection: 'row', marginTop: 5 }}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        { width: 100, color: Colors().purple },
                      ]}>
                      Title
                    </Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={[styles.cardtext, { color: Colors().pureBlack }]}>
                      : {item?.module_type} / {item?.application_type}
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        { width: 100, color: Colors().purple },
                      ]}>
                      description
                    </Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={[styles.cardtext, { color: Colors().pureBlack }]}>
                      : {item?.description}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.actionView}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text
                  style={[
                    styles.cardHeadingTxt,
                    { width: 100, color: Colors().purple },
                  ]}>
                  File Type
                </Text>
                <Text
                  style={[styles.cardHeadingTxt, { color: Colors().purple }]}>
                  :
                </Text>
                <NeumorphCard>
                  <View style={{ padding: 5 }}>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={[styles.cardtext, { color: Colors().pending }]}>
                      {item?.tutorial_format}
                    </Text>
                  </View>
                </NeumorphCard>
              </View>
              <View style={styles.actionView2}>
                <NeumorphCard
                  inner={true}
                  darkShadowColor={Colors().darkShadow}
                  lightShadowColor={Colors().lightShadow}>
                  <Icon
                    name="edit"
                    type={IconType.Feather}
                    color={Colors().edit}
                    size={18}
                    style={styles.actionIcon}
                    onPress={() =>
                      navigation.navigate('AddUpdateTutorialScreen', {
                        edit_id: item?.id,
                        // type: 'update',
                      })
                    }
                  />
                </NeumorphCard>
                <NeumorphCard
                  inner={true}
                  darkShadowColor={Colors().darkShadow}
                  lightShadowColor={Colors().lightShadow}>
                  <Icon
                    name="delete"
                    type={IconType.AntDesign}
                    color={Colors().red}
                    size={18}
                    onPress={() => {
                      setDeleteModalVisible(true), setTutorialId(item?.id);
                    }}
                    style={styles.actionIcon}
                  />
                </NeumorphCard>
              </View>
            </View>
          </NeumorphCard>
        </TouchableOpacity>
      </View>
    );
  };

  /*pagination button click funtion*/
  const handlePageClick = () => {
    dispatch(getAllTutorialList({ pageSize: pageSize, pageNo: pageNo }));
  };

  const handleLoadNextPage = () => {
    if (
      !isFetchingNextPage &&
      !ListData?.isLoading &&
      ListData?.data?.pageDetails?.totalPages >
        ListData?.data?.pageDetails?.currentPage
    ) {
      setIsFetchingNextPage(true);
      setPageNo(pageNo + 1);
      // console.log('Page No For Next', pageNo);
    }
  };

  // Handle loading the previous page
  const handleLoadPreviousPage = () => {
    if (
      !isFetchingPreviousPage &&
      !ListData?.isLoading &&
      ListData?.data?.pageDetails?.currentPage >= 1
    ) {
      setIsFetchingPreviousPage(true);
      if (pageNo > 1) {
        setPageNo(pageNo - 1);
        // console.log('Page No For Previous', pageNo);
      }
    }
  };

  useEffect(() => {
    if (isFetchingNextPage) setIsFetchingNextPage(false);
    if (isFetchingPreviousPage) setIsFetchingPreviousPage(false);
  }, [ListData]);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <SearchBar setSearchText={setSearchText} />
      <SeparatorComponent
        separatorWidth={0.2}
        separatorColor={Colors().darkShadow2}
      />
      <View style={{ height: WINDOW_HEIGHT * 0.8 }}>
        {ListData?.isLoading ? (
          <Loader />
        ) : !ListData?.isLoading && !ListData?.isError ? (
          <>
            <FlatList
              data={getFilteredData(ListData?.data?.data)}
              renderItem={renderItem}
              contentContainerStyle={{
                width: WINDOW_WIDTH,
                height: 'auto',
                backgroundColor: Colors()?.screenBackground,
                paddingBottom: 100,
              }}
              keyExtractor={item => item.id.toString()}
              refreshControl={
                <RefreshControl
                  refreshing={ListData?.isLoading}
                  onRefresh={handlePageClick}
                />
              }
              onEndReached={() => {
                handleLoadNextPage();
              }}
              onStartReached={() => {
                handleLoadPreviousPage();
              }}
              ListEmptyComponent={renderEmptyComponent}
            />

            <View
              style={{
                pasition: 'absolute',
                bottom: 80,
                height: 60,
              }}>
              <Pagination
                setPageNo={setPageNo}
                ListData={ListData}
                pageNo={pageNo}
                apiFunctions={handlePageClick}
              />
            </View>
            {/* modal view for ACTION */}
            {deleteModalVisible && (
              <AlertModal
                visible={deleteModalVisible}
                iconName={'delete-circle-outline'}
                icontype={IconType.MaterialCommunityIcons}
                iconColor={Colors().red}
                textToShow={'ARE YOU SURE YOU WANT TO DELETE THIS!!'}
                cancelBtnPress={() =>
                  setDeleteModalVisible(!deleteModalVisible)
                }
                ConfirmBtnPress={() => deleteTutorial(tutorialId)}
              />
            )}

            {statusModalVisible && (
              <AlertModal
                visible={statusModalVisible}
                iconName={'clock-edit-outline'}
                icontype={IconType.MaterialCommunityIcons}
                iconColor={Colors().aprroved}
                textToShow={'ARE YOU SURE YOU WANT TO UPDATE THIS!!'}
                cancelBtnPress={() =>
                  setStatusModalVisible(!statusModalVisible)
                }
                ConfirmBtnPress={() => formik.handleSubmit()}
              />
            )}

            {/*view for modal of upate */}
            {imageModalVisible && (
              <ImageViewer
                visible={imageModalVisible}
                imageUri={imageUri}
                cancelBtnPress={() => setImageModalVisible(!imageModalVisible)}
                // downloadBtnPress={item => downloadImageRemote(item)}
              />
            )}

            {/* View for floating button */}
            <View
              style={{
                zIndex: 1,
                position: 'absolute',
                bottom: 250,
                right: 80,
              }}>
              <FloatingAddButton
                backgroundColor={Colors().purple}
                onPress={() => {
                  navigation.navigate('AddUpdateTutorialScreen', {
                    // empId: item?.id,
                  });
                }}></FloatingAddButton>
            </View>
          </>
        ) : ListData?.isError ? (
          <InternalServer />
        ) : !ListData?.data?.status &&
          ListData?.data?.message === 'Data not found' ? (
          <>
            <DataNotFound />
            {/* View for floating button */}
            <View
              style={{
                zIndex: 1,
                position: 'absolute',
                bottom: 250,
                right: 80,
              }}>
              <FloatingAddButton
                backgroundColor={Colors().purple}
                onPress={() => {
                  navigation.navigate('AddUpdateTutorialScreen', {});
                }}></FloatingAddButton>
            </View>
          </>
        ) : (
          <InternalServer></InternalServer>
        )}
      </View>
    </SafeAreaView>
  );
};

export default TutorialListingScreen;

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    paddingHorizontal: WINDOW_WIDTH * 0.05,
    paddingVertical: WINDOW_HEIGHT * 0.01,
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
  },

  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },

  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: 'transparent',
  },
  paginationButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 4,
    backgroundColor: 'gray',
  },
  activeButton: {
    backgroundColor: '#22c55d',
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  buttonText: {
    color: 'white',
  },
  actionView: {
    margin: WINDOW_WIDTH * 0.03,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  actionView2: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    columnGap: 10,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  ImageView: {
    // position: 'absolute',
    height: WINDOW_HEIGHT * 0.2,
    // width: WINDOW_WIDTH * 0.9,
    margin: 5,
    borderRadius: 8,
    borderColor: Colors().black2,
  },
});
