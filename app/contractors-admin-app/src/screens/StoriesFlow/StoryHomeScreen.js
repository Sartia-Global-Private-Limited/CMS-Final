import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  RefreshControl, // Import RefreshControl
} from 'react-native';
import Video from 'react-native-video';
import CustomeHeader from '../../component/CustomeHeader';
import Colors from '../../constants/Colors';
import ScreensLabel from '../../constants/ScreensLabel';
import { View } from 'react-native';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../utils/ScreenLayout';
import { useDispatch, useSelector } from 'react-redux';
import { getAllTutorialList } from '../../redux/slices/tutorials/getTutorialListSlice';
import { useIsFocused } from '@react-navigation/native';
import { apiBaseUrl } from '../../../config';
import { Image } from 'react-native';
import Images from '../../constants/Images';
import DataNotFound from '../../component/DataNotFound';

const ReelsScreen = () => {
  const dispatch = useDispatch();
  const ListData = useSelector(state => state.getTutorialList);
  const label = ScreensLabel();
  const isFocused = useIsFocused();
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0); // Track the current video in focus
  const [refreshing, setRefreshing] = useState(false); // State for refresh control

  useEffect(() => {
    dispatch(getAllTutorialList({ pageSize: pageSize, pageNo: pageNo }));
  }, [isFocused]);

  const moveToNextVideo = () => {
    setCurrentVideoIndex(prevIndex => {
      const nextIndex = prevIndex + 1;
      // Check if next index is within the range of videos
      return nextIndex < ListData?.data?.data?.length - 1
        ? nextIndex
        : prevIndex;
    });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setPageNo(1); // Reset to first page for fresh data
    await dispatch(getAllTutorialList({ pageSize: pageSize, pageNo: 1 })); // Fetch fresh data
    setRefreshing(false);
  };

  const renderItem = ({ item, index }) => {
    // Check if item is valid
    if (!item || !item.tutorial_format) {
      console.warn('Invalid item:', item);
      return null;
    }

    // Handle unsupported formats
    if (
      item?.tutorial_format === 'text' ||
      item?.tutorial_format === 'pdf' ||
      item?.tutorial_format === 'audio'
    )
      return null;

    // Render media
    return (
      <View style={styles.mediaContainer}>
        {item?.tutorial_format === 'image' ? (
          <Image
            source={{
              uri: item?.attachment
                ? `${apiBaseUrl}${item?.attachment}`
                : `${Image.resolveAssetSource(Images.DEFAULT_PROFILE).uri}`,
            }}
            style={styles.ImageView}
          />
        ) : (
          <Video
            source={{ uri: `${apiBaseUrl}${item?.attachment}` }}
            style={styles.media}
            resizeMode="cover"
            repeat={true}
            paused={index !== currentVideoIndex}
            onError={e => console.error('Video Error:', e)}
            onEnd={() => {
              moveToNextVideo();
              console.log('Video playback finished');
            }}
          />
        )}
        <View style={styles.overlay}>
          <Text style={styles.title}>{item?.module_type || 'No Title'}</Text>
          <Text style={styles.description}>
            {item?.description || 'No Description'}
          </Text>
          <Text style={styles.additionalInfo}>Duration: 1 min</Text>
        </View>
      </View>
    );
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index;
      if (index !== currentVideoIndex) {
        setCurrentVideoIndex(index);
      }
    }
  }).current;

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50, // Video is considered in view when 50% visible
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <CustomeHeader headerTitle={label.STORIES} leftIconPress={() => {}} />
      <View style={{ height: WINDOW_HEIGHT * 0.8 }}>
        <FlatList
          data={ListData?.data?.data}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          pagingEnabled
          horizontal={false}
          showsVerticalScrollIndicator={false}
          snapToInterval={WINDOW_HEIGHT * 0.8}
          decelerationRate="fast"
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[Colors().primary]} // Set loading spinner color
              tintColor={Colors().primary}
            />
          }
          ListEmptyComponent={
            <View style={{ width: WINDOW_WIDTH, height: WINDOW_HEIGHT * 0.8 }}>
              <DataNotFound />
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mediaContainer: {
    height: WINDOW_HEIGHT * 0.8,
    width: WINDOW_WIDTH,
    position: 'relative',
  },
  media: {
    height: WINDOW_HEIGHT * 0.8,
    width: WINDOW_WIDTH,
  },
  overlay: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    borderRadius: 10,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 5,
  },
  additionalInfo: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.8,
  },
  ImageView: {
    position: 'absolute',
    height: WINDOW_HEIGHT * 0.8,
    width: WINDOW_WIDTH * 0.97,
    margin: 5,
    borderRadius: 8,
    borderColor: Colors().black2,
  },
});

export default ReelsScreen;
