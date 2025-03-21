import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import { Neomorph } from 'react-native-neomorph-shadows';
import Colors from '../constants/Colors';
import Images from '../constants/Images';
import { WINDOW_WIDTH } from '../utils/ScreenLayout';
import { apiBaseUrl } from '../../config';

const DashBoardCard = ({ itemUri, itemName, status }) => {
  return (
    <Neomorph
      darkShadowColor={Colors().darkShadow} // <- set this
      lightShadowColor={Colors().lightShadow} // <- this
      style={{
        margin: 7,
        shadowRadius: 5,
        shadowOpacity: 0.8,
        borderRadius: 5,
        backgroundColor: Colors().cardBackground,
        width: WINDOW_WIDTH * 0.28,
        height: WINDOW_WIDTH * 0.28,
      }}>
      <View
        style={[
          styles.mainContainer,
          {
            borderRadius: 8,
            backgroundColor: status === 0 ? '#f101' : Colors().backgroundColor,
          },
        ]}>
        <View style={styles.imageContainer}>
          <Image
            resizeMode="contain"
            source={
              itemUri
                ? {
                    uri: `${apiBaseUrl}${itemUri}`,
                  }
                : Images.DEFAULT
            }
            style={{ height: 60, width: 60 }}
          />
        </View>
        <View style={styles.textContainer}>
          <Text
            numberOfLines={2}
            style={[styles.textStyle, { color: Colors().pureBlack }]}>
            {itemName}
          </Text>
        </View>
      </View>
    </Neomorph>
  );
};

export default DashBoardCard;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    maxHeight: '100%',
    maxWidth: '100%',
  },
  imageContainer: {
    height: '70%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    maxWidth: '100%',
    alignSelf: 'center',
    marginTop: -5,
  },
  textStyle: {
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 12,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
});
