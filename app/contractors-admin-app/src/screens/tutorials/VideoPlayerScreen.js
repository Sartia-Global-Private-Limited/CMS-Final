import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import VideoPlayer from 'react-native-video-controls';
import { WINDOW_HEIGHT } from '../../utils/ScreenLayout';
import Colors from '../../constants/Colors';

const VideoPlayerScreen = ({ route, navigation }) => {
  const videoUri = route?.params?.uri;
  //   const navigation = useNavigation();
  return (
    <View style={{ flex: 1 }}>
      <VideoPlayer
        source={{ uri: videoUri }} // Can be a URL or a local file.
        navigator={navigation}
        ref={ref => {
          this.player = ref;
        }} // Store reference
        onBuffer={this.onBuffer} // Callback when remote video is buffering
        onError={this.videoError} // Callback when video cannot be loaded
        onEnterFullscreen={() => {
          //   navigation.navigate('VideoPlayerScreen');
        }}
        resizeMode="cover"
        fullscreenOrientation="landscape"
        pictureInPicture={true}
        muted={true}
        tapAnywhereToPause={true}
        paused={false}
        style={styles.ImageView}
      />
    </View>
  );
};

export default VideoPlayerScreen;

const styles = StyleSheet.create({
  ImageView: {
    // position: 'absolute',
    height: WINDOW_HEIGHT * 0.2,
    // width: WINDOW_WIDTH * 0.9,
    margin: 5,
    borderRadius: 8,
    borderColor: Colors().black2,
  },
});
